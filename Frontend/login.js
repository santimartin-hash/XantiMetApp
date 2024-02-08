document.addEventListener('DOMContentLoaded', function () {
    var accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
        MostrarContenido();
    }
});

async function loginFunction() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email.trim() === '' || password.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const response = await fetch("http://localhost:8082/api/auth/login", {
            method: 'POST',
            headers: {},
            body: new URLSearchParams({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const result = await response.json();

            const accessToken = result.access_token;

            sessionStorage.setItem('accessToken', accessToken);

            MostrarContenido();

            console.log(result);
        }
    } catch (err) {
        mostrarAlerta(err);
    }
}

async function RegisterFunction() {
    const accessToken = sessionStorage.getItem('accessToken');

    try {
        const email = document.getElementById('email1').value;
        const password = document.getElementById('password1').value;
        const name = document.getElementById('Name1').value;
        const response = await fetch("http://localhost:8082/api/auth/register", {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + accessToken
            },
            body: new URLSearchParams({
                email: email,
                password: password,
                name: name
            })
        });

        if (response.ok) {
            const result = await response.json();
            const accessToken = result.access_token;

            sessionStorage.setItem('accessToken', accessToken);

            MostrarContenido();

            console.log(result);
        }
    } catch (err) {
        mostrarAlerta(err);
    }
}


function RegistroArriba() {
    document.getElementById('loginform').classList.add('hideup');
    document.getElementById('RegisterForm').classList.add('show');
}

function LoginAbajo() {
    document.getElementById('loginform').classList.remove('hideup');
    document.getElementById('RegisterForm').classList.remove('show');
}

function mostrarLogin() {
    document.body.style.backgroundImage = 'url("/imgs/raimond-klavins-jZuIwS3VBME-unsplash.jpg")';
    document.getElementById('loginform').style.display = 'block';
    document.getElementById('loginform').classList.remove('hideup');
    document.getElementById('RegisterForm').style.display = 'block';
    var inputs = document.getElementById('loginform').getElementsByTagName('input');
    var inputs1 = document.getElementById('RegisterForm').getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
    for (var i = 0; i < inputs1.length; i++) {
        inputs1[i].value = '';
    }
}

function MostrarContenido() {
 var nuevaURL = "index.html";
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