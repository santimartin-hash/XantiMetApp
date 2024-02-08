<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Municipio;
use App\Models\Historico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MunicipioController extends Controller
{
    public function importMunicipios()
    {
        Log::info('Ejecutando importMunicipios');
        $url = 'https://www.el-tiempo.net/api/json/v1/provincias/20/municipios';

        $response = Http::withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ])->get($url);


        if ($response->successful()) {
            $json = $response->body();
            $data = json_decode($json, true);

            DB::statement('ALTER TABLE Municipios AUTO_INCREMENT = 1');

            // Obtener el último id en la tabla Municipios
            $ultimoId = Municipio::max('id');

            // Si no hay registros, establecer $ultimoId en 0
            if ($ultimoId === null) {
                $ultimoId = 0;
            }

            $capitalesPermitidas = ['Irun', 'Hondarribia', 'Donostia/San Sebastián', 'Errenteria', 'Usurbil', 'Hernani' ];
            foreach ($data as $item) {
                // Verificar si el NOMBRE_CAPITAL está en la lista permitida
                if (in_array($item['NOMBRE_CAPITAL'], $capitalesPermitidas)) {
                    // Incrementar $ultimoId antes de crear el nuevo registro
                    $ultimoId++;

                    // Comprobar si ya existe un registro con el mismo NOMBRE_CAPITAL
                    $existingMunicipio = Municipio::where('NOMBRE_CAPITAL', $item['NOMBRE_CAPITAL'])->first();

                    // Si no existe, crear un nuevo registro con el siguiente id
                    if (!$existingMunicipio) {

                        $coordenadas = $item['LONGITUD_ETRS89_REGCAN95'] . ';' . $item['LATITUD_ETRS89_REGCAN95'];

                        Municipio::create([
                            'id' => $ultimoId,
                            'NOMBRE_CAPITAL' => $item['NOMBRE_CAPITAL'],
                            'Coordenadas' => $coordenadas,
                        ]);
                    }
                }
            }
        } else {
            echo "Error en la solicitud. Código: " . $response->status();
            echo "Mensaje de error: " . $response->body();
        }
    }


    public function importDatosMunicipios()
    {
        Log::info('Ejecutando importDatosMunicipios');
        $apiKey = '6dcaf2e2fda122dd2066332a778e28fb';
        $municipios = Municipio::all();

        foreach ($municipios as $municipio) {
            // Obtener las coordenadas del municipio
            $coordenadas = explode(';', $municipio->Coordenadas);
            $latitud = $coordenadas[1];
            $longitud = $coordenadas[0];

            // Realizar la solicitud a la API
            $url = "https://api.openweathermap.org/data/2.5/weather?lat=$latitud&lon=$longitud&appid={$apiKey}&units=metric&lang=es";
            $response = Http::withHeaders([
                'X-Requested-With' => 'XMLHttpRequest',
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ])->get($url);

            if ($response->successful()) {
                $data = $response->json();
                // Verificar si las claves esperadas están presentes antes de acceder a ellas
                $descripcionTiempo = $data['weather'][0]['description'] ?? null;
                $temperatura = $data['main']['temp'] ?? null;
                $sensacionTermica = $data['main']['feels_like'] ?? null;
                $presion = $data['main']['pressure'] ?? null;
                $humedad = $data['main']['humidity'] ?? null;
                $VelocidadViento = $data['wind']['speed'] ?? null;
                $DireccionViento = $data['wind']['deg'] ?? null;
                $fechaHoraCliente = Carbon::now('Europe/Madrid');


                // Actualizar el registro específico en la base de datos con la información de la API
                $municipio->update([
                    'Descripcion' => $descripcionTiempo,
                    'Temperatura' => $temperatura,
                    'SensacionTermica' => $sensacionTermica,
                    'Presion' => $presion,
                    'Humedad' => $humedad,
                    'VelocidadDelViento' => $VelocidadViento,
                    'DireccionDelViento' => $DireccionViento,
                    'FechaActualizacion' => $fechaHoraCliente,
                ]);
            } else {
                echo "Error en la solicitud para el municipio {$municipio->NOMBRE_CAPITAL}. Código: " . $response->status();
                echo "Mensaje de error: " . $response->body();
            }
        }
    }
    public function importDatosFake()
    {
        Log::info('Ejecutando importDatosFake');
        $municipios = Municipio::all();
        foreach ($municipios as $municipio) {
            // Obtener valores actuales de la base de datos
            $temperatura = $municipio->Temperatura;
            $sensacionTermica = $municipio->SensacionTermica;
            $velocidadDelViento = $municipio->VelocidadDelViento;

            // Agregar o restar 0.01 aleatoriamente
            $temperatura += (rand(0, 1) == 0 ? -0.01 : 0.01);
            $sensacionTermica += (rand(0, 1) == 0 ? -0.01 : 0.01);
            $velocidadDelViento += (rand(0, 1) == 0 ? -0.01 : 0.01);

            // Actualizar los valores en la base de datos
            DB::table('Municipios') // Reemplaza 'nombre_de_tabla' con el nombre real de tu tabla
                ->where('id', $municipio->id) // Ajusta según tu estructura de tabla
                ->update([
                    'Temperatura' => $temperatura,
                    'SensacionTermica' => $sensacionTermica,
                    'VelocidadDelViento' => $velocidadDelViento,
                ]);
        }
    }
    public function GuardarEnHistorico()
    {
        Log::info('Ejecutando GuardarEnHistorico');

        // Obtener todos los municipios
        $municipios = Municipio::all();

        // Iterar sobre cada municipio y guardar en la tabla Historico
        foreach ($municipios as $municipio) {
            Historico::create([
                'NOMBRE_CAPITAL' => $municipio->NOMBRE_CAPITAL,
                'Coordenadas' => $municipio->Coordenadas,
                'Descripcion' => $municipio->Descripcion,
                'Temperatura' => $municipio->Temperatura,
                'SensacionTermica' => $municipio->SensacionTermica,
                'Presion' => $municipio->Presion,
                'Humedad' => $municipio->Humedad,
                'VelocidadDelViento' => $municipio->VelocidadDelViento,
                'DireccionDelViento' => $municipio->DireccionDelViento,
                'FechaActualizacion' => $municipio->FechaActualizacion,
            ]);
        }
    }
}
