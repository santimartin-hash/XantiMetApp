document.addEventListener('DOMContentLoaded', function () {
    var accessToken = sessionStorage.getItem('accessToken');
    // Verifica si accessToken está presente
    if (!accessToken) {
        MostrarLogin();
    }
    const nombreUsuario = sessionStorage.getItem('userName');
    document.getElementById('nombreUsuario').textContent = 'Hola, ' + nombreUsuario;
});

async function ObtenerUsuario(accessToken) {
    try {
        const response = await fetch("http://localhost:8082/api/auth/user", {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });

        if (response.ok) {
            const result = await response.json();
            // Extraer el ID, nombre y correo electrónico del usuario
            const { id, name, email } = result;

            // Guardar el ID, nombre y correo electrónico en sessionStorage
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('userName', name);
            sessionStorage.setItem('userEmail', email);
        }
    } catch (err) {
        console.error(err);
    }
}
var accessToken = sessionStorage.getItem('accessToken');
ObtenerUsuario(accessToken);

async function logoutFunction() {
    try {
        const accessToken = sessionStorage.getItem('accessToken');
        const response = await fetch("http://localhost:8082/api/auth/logout", {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
        if (response.ok) {
            const result = await response.json();

            sessionStorage.removeItem('accessToken');

            MostrarLogin();

            console.log(result);
        }
    } catch (err) {
        mostrarAlerta(err);
    }
}

function MostrarLogin() {
    var nuevaURL = "login.html";
    window.location.href = nuevaURL;
}

function mostrarAlerta(mensaje) {
    var alerta = document.getElementById('errorAlert');
    var errorContent = document.getElementById('errorContent');

    if (!mensaje) {
        alerta.style.display = 'none';
    } else {

        errorContent.textContent = mensaje;

        alerta.style.display = 'block';
        setTimeout(function () {
            alerta.style.transform = 'translateY(-250%)';
            setTimeout(function () {
                alerta.style.display = 'none';
                alerta.style.transform = '';
                errorContent.textContent = '';
            }, 1000);
        }, 3000);
    }

}

function MasInfo(card, signo, downPanel, boton) {
    var carta = document.getElementById(card);
    var svg = document.getElementById(signo);
    var DownPanel = document.getElementById(downPanel);
    var Boton = document.getElementById(boton);
    // Comprueba si la card esta expandida
    if (carta.style.height === '280px') {
        // si esta expandida, la minimiza y pone el signo de mas
        carta.style.height = '';
        DownPanel.classList.remove('visible');
        svg.innerHTML = '<path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path>';
        Boton.style.background = '#ff6600';
    } else {
        // sino pone el signo negativo y la expande
        svg.innerHTML = '<path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M5 12h14v2H5z"></path>';
        carta.style.height = '280px';
        DownPanel.classList.add('visible');
        Boton.style.background = 'red';
    }
}

// Obtener el contexto del lienzo
var ctx = document.getElementById('miGrafico').getContext('2d');

// Datos del gráfico
var data = {
    labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
    datasets: [{
        label: 'Ejemplo de Datos',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
        borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
        borderWidth: 1 // Ancho del borde de las barras
    }]
};

// Opciones del gráfico
var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

// Crear el gráfico de barras
var miGrafico = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});

async function InicializarMapa() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Mostrar loader
    const accessToken = sessionStorage.getItem('accessToken');
    try {
        const response = await fetch("http://localhost:8082/api/RecogerMunicipios", {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });

        if (response.ok) {
            const result = await response.json();

            // Mapear los datos obtenidos en result a la estructura deseada para lugares
            var lugares = result.map(municipio => {
                return {
                    "nombre": municipio.NOMBRE_CAPITAL,
                    "id": municipio.id,
                    "latitud": parseFloat(municipio.Coordenadas.split(';')[1]),
                    "longitud": parseFloat(municipio.Coordenadas.split(';')[0])
                };
            });
            var map = L.map('map').setView([43.3171715, -1.88191785], 11);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);


            lugares.forEach(ciudad => {

                var marker = L.marker([ciudad.latitud, ciudad.longitud], { id: ciudad.id }).addTo(map);
                marker.bindTooltip(ciudad.nombre, {
                    permanent: false,    // El tooltip no será permanente
                    direction: 'top',    // Se mostrará encima del marcador
                    offset: L.point(0, 0) // Desplazamiento del tooltip respecto al marcador
                })

                // Acceder al ID del marcador
                var idDelMarker = marker.options.id;

                // Obtener el ID del usuario actual desde sessionStorage
                const userId = sessionStorage.getItem('userId');

                // Obtener el array de usuarios del localStorage
                const arrayDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                // Buscar el usuario correspondiente en el array de usuarios
                const usuario = arrayDeUsuarios.find(user => user.id === userId);

                // Obtener los municipios del usuario o un array vacío si el usuario no tiene municipios
                const storedMunicipios = (usuario && usuario.municipios) ? usuario.municipios : [];

                // Iterar sobre los municipios almacenados
                storedMunicipios.forEach(municipio => {
                    // Verificar si el municipio está asociado al marker actual
                    if (municipio.id === idDelMarker) {
                        // Si el municipio está asociado al marker, aplicar estilo y mostrar el elemento correspondiente
                        marker._icon.classList.add('green');
                        var CardId = document.getElementById('carta' + municipio.id);
                        CardId.style.display = 'flex';

                        // Obtener los elementos asociados a este municipio
                        var items = municipio.items || [];

                        // Iterar sobre los elementos y mostrarlos en la tarjeta correspondiente
                        items.forEach(item => {
                            var elementoDiv = CardId.querySelector('div[id="' + item + '"]');
                            if (elementoDiv) {
                                elementoDiv.style.display = 'block';
                            }
                        });
                    }
                });

                // Agregar un manejador de clic al marcador
                marker.on('click', function () {

                    // Verificar si el icono ya tiene la clase 'green'
                    const hasGreenClass = this._icon.classList.contains('green');

                    if (hasGreenClass) {
                        this._icon.classList.remove('green');
                        CardId = document.getElementById('carta' + ciudad.id);
                        CardId.style.display = 'none';


                        const userId = sessionStorage.getItem('userId');
                        const userEmail = sessionStorage.getItem('userEmail');
                        const newMunicipio = { id: ciudad.id, nombre: ciudad.nombre };
                        guardarMunicipioDelUsuario(userId, userEmail, newMunicipio);

                    } else {
                        this._icon.classList.add('green');
                        CardId = document.getElementById('carta' + ciudad.id);
                        CardId.style.display = 'flex';

                        const userId = sessionStorage.getItem('userId');
                        const userEmail = sessionStorage.getItem('userEmail');
                        const newMunicipio = { id: ciudad.id, nombre: ciudad.nombre };
                        guardarMunicipioDelUsuario(userId, userEmail, newMunicipio);
                    }
                });
            });
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

InicializarMapa();

async function GenerarCards() {
    try {
        const response = await fetch("http://localhost:8082/api/RecogerMunicipios", {
            method: 'GET',
            headers: {}
        });

        if (response.ok) {
            const result = await response.json();
            const contenedor = document.getElementById("cartitas");


            // Iterar sobre cada elemento del JSON original
            result.forEach(municipio => {
                // HTML de la carta
                const existingCarta = document.getElementById(`carta${municipio.id}`);
                if (existingCarta) {
                    // Si la carta ya existe, actualizar su contenido
                    existingCarta.querySelector('.temperatura').textContent = `${municipio.Temperatura}ºc`;
                    existingCarta.querySelector('.ciudad').textContent = municipio.NOMBRE_CAPITAL;
                    existingCarta.querySelector('.SensacionTermica').textContent = `${municipio.SensacionTermica}ºc`;
                    existingCarta.querySelector('.Presion').textContent = municipio.Presion;
                    existingCarta.querySelector('.Humedad').textContent = municipio.Humedad;
                    existingCarta.querySelector('.VelocidadDelViento').textContent = municipio.VelocidadDelViento;
                    existingCarta.querySelector('.Descripcion').textContent = municipio.Descripcion;
                    existingCarta.querySelector('.DireccionDelViento').textContent = municipio.DireccionDelViento;
                } else {


                    const htmlCarta = `
                                    
                <div class="carta" id="carta${municipio.id}" ondragover="handleDragOver(event)" ondrop="handleDrop(event, 'carta${municipio.id}')">
                <div class="up-panel">
                    <div class="left-panel panel">
                    <div class="temperatura">
                        ${municipio.Temperatura}ºc
                    </div>
                    <div class="ciudad"  data-tooltip="">
                        ${municipio.NOMBRE_CAPITAL}
                    </div>
                    </div>
                    <div class="right-panel panel">
                    <img src="https://codefrog.space/cp/wp/ts.png" height="80px" width="100px" draggable="false">
                    </div>
                </div>

                <div id="down-panel${municipio.id}" class="down-panel">
                    <div class="items">
                    <div class="panelizq">
                        <div id="temperatura" class="especial">           
                        <span class="SensacionTermica">${municipio.SensacionTermica}ºc</span>
                        <img src="imgs/itemsMeteorologicos/icons8-temperatura-80.png" height="25px" width="25px" draggable="false">
                        </div>
                        <div id="presion" class="item">             
                        <span class="Presion">${municipio.Presion}</span>
                        <img src="imgs/itemsMeteorologicos/icons8-presión-100.png" height="25px" width="25px" draggable="false">
                        </div>
                        <div id="humedad" class="especial">                     
                        <span class="Humedad">${municipio.Humedad}</span>
                        <img src="imgs/itemsMeteorologicos/icons8-humedad-48.png" height="25px" width="25px" draggable="false">
                        </div>
                    </div>
                    <div class="panelder">
                        <div id="velocidadViento" class="item">                
                        <span class="VelocidadDelViento">${municipio.VelocidadDelViento}</span>
                        <img src="imgs/itemsMeteorologicos/icons8-manga-catavientos-50.png" height="25px" 
                            width="25px" draggable="false">
                        </div>
                        <div id="descripcion" class="item">           
                        <span class="Descripcion">${municipio.Descripcion}</span>
                        <img src="https://codefrog.space/cp/wp/ts.png" height="25px" width="25px" draggable="false">
                        </div>
                        <div id="DireccionViento" class="item">
                        <span class="DireccionDelViento">${municipio.DireccionDelViento}</span>
                        <img src="imgs/itemsMeteorologicos/direccion-del-viento.png" height="25px" width="25px" draggable="false">
                        </div>
                    </div>
                    </div>
                </div>
                <button id="boton${municipio.id}" onclick="MasInfo('carta${municipio.id}', 'svg${municipio.id}', 'down-panel${municipio.id}','boton${municipio.id}')" class="cssbuttons-io-button">
                    <svg id="svg${municipio.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path>
                    </svg>
                    <span>Info</span>
                </button>
                </div>
                `;

                    // Agregar el HTML de la carta al principio del contenido del contenedor
                    contenedor.insertAdjacentHTML('afterbegin', htmlCarta);
                }
            });

        }
    } catch (err) {
        console.error(err);
    }
    MostrarTooltip();
}
GenerarCards();
setInterval(GenerarCards, 15000);

function MostrarTooltip() {
    var lugares = [
        { "nombre": "Irun", "region": 'basque_country', "zone": 'coast_zone', "location": 'irun', "id": '4' },
        { "nombre": "Hondarribia", "region": 'basque_country', "zone": 'coast_zone', "location": 'hondarribia', "id": '3' },
        { "nombre": "Errenteria", "region": 'basque_country', "zone": 'donostialdea', "location": 'errenteria', "id": '2' },
        { "nombre": "Donostia/San Sebastián", "region": 'basque_country', "zone": 'donostialdea', "location": 'donostia', "id": '1' },
        { "nombre": "Usurbil", "region": 'basque_country', "zone": 'coast_zone', "location": 'usurbil', "id": '9' }
    ];
    lugares.forEach(function (lugar) {
        // Obtener la fecha de hoy
        var fechaHoy = new Date();
        var diaHoy = fechaHoy.getDate();
        var mesHoy = (fechaHoy.getMonth() + 1).toString().padStart(2, '0');
        var añoHoy = fechaHoy.getFullYear();

        // Obtener la fecha de mañana
        var fechaManana = new Date();
        fechaManana.setDate(fechaManana.getDate() + 1);
        var diaManana = fechaManana.getDate();
        var mesManana = (fechaManana.getMonth() + 1).toString().padStart(2, '0');
        var añoManana = fechaManana.getFullYear();
        // Formatear las fechas como strings en el formato deseado (DD/MM/YYYY)
        var fechaHoyCompleta = añoHoy + '/' + mesHoy + '/' + diaHoy;
        var fechaMananaCompleta = añoManana + '' + mesManana + '' + diaManana;
        var settings = {
            "url": `https://api.euskadi.eus/euskalmet/weather/regions/${lugar.region}/zones/${lugar.zone}/locations/${lugar.location}/forecast/at/${fechaHoyCompleta}/for/${fechaMananaCompleta}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtjZmFAcGxhaWF1bmRpLm5ldCJ9.PODo0mMve65Kpl5FT8bUphus6coMBaQllMvRBrpBdghgsSgnSTz5pjkIAemGoFJgPtCOzY2IeFHoupsyJD52m1nIyeHqbZKQbMRttfpZT0Fi4FUN95csf5qTTMSAEPO9nKD04H4tjhVTxQ2k2DJFhUzgw9aiJxzIZYXYckNUxfLJ0BioMKiEnVnxM-SXiMcwM5o9QRbscIHUnCPda9OyUtSgKUJ0iytUAPpp-cIPfvCAbIsgc-n7jHSGgiu1Juc9tXfhgNAsCnesFFc4NbvIgyjRZWjIy9IoKwrzLPCOogaTsOUomaiz02mGhkYwbgHSdBI3kyZ3FPpd3kiqSQyCUQ",
            },
        };

        jQuery.ajax(settings).done(function (response) {
            var forecastText = response.forecastText.SPANISH;

            jQuery('#carta' + lugar.id + ' .ciudad').attr('data-tooltip', forecastText);
        });
    });
}


function guardarMunicipioDelUsuario(idUsuario, gmailUsuario, municipio) {
    // Verificar si el array de usuarios existe en localStorage
    let arrayDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar si el usuario ya existe en el array de usuarios
    const usuarioIndex = arrayDeUsuarios.findIndex(usuario => usuario.id === idUsuario);

    if (usuarioIndex !== -1) {
        // Si el usuario ya existe, obtener su referencia
        const usuario = arrayDeUsuarios[usuarioIndex];

        // Verificar si el municipio ya existe en los municipios del usuario
        const municipioIndex = usuario.municipios.findIndex(m => m.id === municipio.id);

        if (municipioIndex !== -1) {
            // Si el municipio ya existe, quitarlo
            usuario.municipios.splice(municipioIndex, 1);
        } else {
            // Si el municipio no existe, agregarlo
            usuario.municipios.push(municipio);
        }

        // Si el usuario no tiene ningún municipio, eliminarlo del array de usuarios
        if (usuario.municipios.length === 0) {
            arrayDeUsuarios.splice(usuarioIndex, 1);
        } else {
            // Actualizar el usuario en el array de usuarios
            arrayDeUsuarios[usuarioIndex] = usuario;
        }
    } else if (municipio !== null) { // Solo agregar si el municipio no es null
        // Si el usuario no existe, crearlo con el municipio
        arrayDeUsuarios.push({
            id: idUsuario,
            gmail: gmailUsuario,
            municipios: [municipio]
        });
    }

    // Convertir el array de usuarios a formato JSON
    const jsonUsuarios = JSON.stringify(arrayDeUsuarios);

    // Guardar el JSON actualizado en localStorage
    localStorage.setItem('usuarios', jsonUsuarios);
}

function obtenerMunicipiosDeUsuario() {
    // Obtener el ID del usuario actual desde sessionStorage
    const userId = sessionStorage.getItem('userId');

    // Obtener el array de usuarios del localStorage
    const arrayDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar el usuario correspondiente en el array de usuarios
    const usuario = arrayDeUsuarios.find(user => user.id === userId);

    // Si se encuentra el usuario y tiene municipios, devolver sus municipios; de lo contrario, devolver un array vacío
    if (usuario && usuario.municipios) {
        return usuario.municipios;
    } else {
        return [];
    }
}

