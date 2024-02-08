<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Municipio;
class MunicipioController extends Controller
{
   Public function obtenerMunicipios(){
    $municipios = Municipio::all();
    return response()->json($municipios);
   }
}
