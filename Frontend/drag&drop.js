function handleDragStart(event) {

    var idElementoAgarrado = event.target.id;
    event.dataTransfer.setData("idElementoAgarrado", idElementoAgarrado); // Almacenar el ID en el evento de arrastre

    console.log("ID del elemento agarrado:", idElementoAgarrado);
    event.currentTarget.style.cursor = "grabbing";
}

function handleDragOver(event) {
    event.preventDefault();

}


// Obtener el ID del usuario actual desde sessionStorage
const userId = sessionStorage.getItem('userId');

// Obtener el array de usuarios del localStorage
const arrayDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Buscar el usuario correspondiente en el array de usuarios
const usuario = arrayDeUsuarios.find(user => user.id === userId);

console.log(usuario);

function handleDrop(event, cartaId) {
    var idElementoAgarrado = event.dataTransfer.getData("idElementoAgarrado");
    console.log("Elemento soltado en la carta con ID:", cartaId);
    // Extraer los dígitos de la cadena cartaId y guardarlos en una variable aparte
    var numerosCarta = cartaId.match(/\d+/g);
    var numerosCartaString = numerosCarta.join(''); // Convertir el array de dígitos a una cadena de texto

    console.log("Dígitos extraídos de la carta ID:", numerosCartaString);
    
    console.log("ID del elemento arrastrado:", idElementoAgarrado);

    // Encontrar el elemento en la carta con el mismo ID que idElementoAgarrado
    var elementoCarta = document.querySelector(`#${cartaId} #${idElementoAgarrado}`);
    if (elementoCarta) {
        elementoCarta.style.display = "block"
    } else {
        console.log("No se encontró ningún elemento en la carta con el ID:", idElementoAgarrado);
    }
    
    if (usuario) {
        // Verificar si el idElementoAgarrado no está ya en el array de items
        var elementoExiste = false;
        usuario.municipios.forEach(municipio => {
            // Convertir el ID del municipio a cadena para la comparación
            var municipioIdString = municipio.id.toString();
            if (municipioIdString === numerosCartaString && municipio.items && municipio.items.includes(idElementoAgarrado.toString())) {
                elementoExiste = true;
            }
        });
    
        // Si el elemento no existe y el municipio coincide con el ID de la carta, agregarlo al array de items
        if (!elementoExiste) {
            usuario.municipios.forEach(municipio => {
                // Convertir el ID del municipio a cadena para la comparación
                var municipioIdString = municipio.id.toString();
                if (municipioIdString === numerosCartaString) {
                    if (!municipio.items) {
                        municipio.items = []; // Si no existe, crear el array de items
                    }
                    municipio.items.push(idElementoAgarrado.toString()); // Agregar el idElementoAgarrado al array de items
                }
            });
    
            // Guardar los datos actualizados en localStorage usando arrayDeUsuarios
            localStorage.setItem('usuarios', JSON.stringify(arrayDeUsuarios));
        } else {
            console.log("El elemento ya existe en el array de items.");
        }
    } else {
        console.log("El usuario no se encontró en el array de usuarios.");
    }
}


function EliminarItem(NombreItem) {
    var elementos = document.querySelectorAll('.cartitas div[id="' + NombreItem + '"]');
    elementos.forEach(function (elemento) {
        elemento.style.display = "none";
    });
    if (usuario) {
        usuario.municipios.forEach(municipio => {
            if (municipio.items && municipio.items.includes(NombreItem)) {
                municipio.items = municipio.items.filter(item => item !== NombreItem); // Filtrar el array para eliminar el NombreItem
            }
        });

        // Guardar los datos actualizados en localStorage usando arrayDeUsuarios
        localStorage.setItem('usuarios', JSON.stringify(arrayDeUsuarios));
    } else {
        console.log("El usuario no se encontró en el array de usuarios.");
    }
}

function DropHandler(event) {
    var idElementoAgarrado = event.dataTransfer.getData("idElementoAgarrado");
    EliminarItem(idElementoAgarrado);
}

document.addEventListener("dragend", function (event) {
    event.target.style.cursor = "pointer";
    console.log("Elemento soltado:", event.target.id);
});