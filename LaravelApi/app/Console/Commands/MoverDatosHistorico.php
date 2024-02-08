<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\MunicipioController;
class MoverDatosHistorico extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mover-datos-historico';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $controller = new MunicipioController;
        $controller->GuardarEnHistorico();
        $this->info('Importación completa.');
    }
}
