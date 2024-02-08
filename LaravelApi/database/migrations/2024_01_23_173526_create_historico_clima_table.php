<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('historico_clima', function (Blueprint $table) {
            $table->id();
            $table->string('ubicacion_id'); // Utilizamos string ya que se referirá al nombre de la capital
            $table->foreign('ubicacion_id')->references('NOMBRE_CAPITAL')->on('Municipios')->onDelete('cascade');
            $table->string('Descripcion');
            $table->decimal('Temperatura', 5, 2);
            $table->decimal('SensacionTermica', 5, 2);
            $table->integer('Presion');
            $table->integer('Humedad');
            $table->decimal('VelocidadDelViento', 5, 2);
            $table->integer('DireccionDelViento');
            $table->timestamp('fecha_actualizacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historico_clima');
    }
};
