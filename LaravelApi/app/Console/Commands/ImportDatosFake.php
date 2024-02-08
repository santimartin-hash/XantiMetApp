<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\MunicipioController;
class ImportDatosFake extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-datos-fake';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa datos de municipios fake aleatoriamente agrega o disminuye al valor original 0.01';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $controller = new MunicipioController;
        $controller->importDatosFake();
        $this->info('Importación completa.');
    }
}
