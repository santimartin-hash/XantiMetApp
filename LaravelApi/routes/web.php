<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MunicipioController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/importMunicipios', [MunicipioController::class, 'importMunicipios']);

Route::get('/importDatosMunicipios', [MunicipioController::class, 'importDatosMunicipios']);

Route::get('/importDatosFake', [MunicipioController::class, 'importDatosFake']);

Route::get('/GuardarEnHistorico', [MunicipioController::class, 'GuardarEnHistorico']);
