<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\MunicipioController;
class ImportMunicipios extends Command
{
    protected $signature = 'app:import-municipios';

    protected $description = 'Importa municipios y datos de municipios';

    public function handle()
    {
        $controller = new MunicipioController;
        $controller->importMunicipios();
        $controller->importDatosMunicipios();
        $this->info('Importación completa.');
    }
}
