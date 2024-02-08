<?php

return [
    'paths' => ['api/*'],

    'allowed_origins' => ['http://localhost:8080'],
    
    'allowed_methods' => ['*'],
    
    'allowed_headers' => ['Content-Type', 'Authorization'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => false,    
];

