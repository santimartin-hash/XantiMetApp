<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Historico extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'NOMBRE_CAPITAL',
        'Coordenadas',
        'Descripcion',
        'Temperatura',
        'SensacionTermica',
        'Presion',
        'Humedad',
        'VelocidadDelViento',
        'DireccionDelViento',
        'FechaActualizacion',
    ];    
    public $timestamps = false;
}
