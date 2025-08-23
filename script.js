// Constantes para los elementos del DOM
const sosBtn = document.getElementById('sos-btn');
const mapContainer = document.getElementById('map-container');
const locationMessage = document.getElementById('location-message');
const infoContainer = document.getElementById('info-container');
const optionButtons = document.querySelectorAll('.option-btn');

// Datos ficticios para los servicios de emergencia
const emergencyData = {
    'medical-btn': {
        title: 'Hospitales Cercanos',
        items: ['Hospital Central', 'Clínica San Juan', 'Centro de Salud Comunitario'],
        callNumber: '106'
    },
    'fire-btn': {
        title: 'Estaciones de Bomberos',
        items: ['Compañía de Bomberos 1', 'Brigada de Incendios', 'Estación de Rescate Local'],
        callNumber: '116'
    },
    'police-btn': {
        title: 'Comisarías',
        items: ['Comisaría Central', 'Puesto de Policía del Barrio', 'División de Patrullaje'],
        callNumber: '105'
    }
};

let map = null;

// Función para obtener la ubicación del usuario
function getLocation() {
    if (navigator.geolocation) {
        // Muestra un mensaje de espera
        locationMessage.textContent = 'Obteniendo su ubicación...';
        locationMessage.classList.remove('hidden');

        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        locationMessage.textContent = 'La geolocalización no es compatible con este navegador.';
        locationMessage.classList.remove('hidden');
    }
}

// Función que se ejecuta si se obtiene la posición correctamente
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Muestra el contenedor del mapa
    mapContainer.style.display = 'block';

    // Inicializa el mapa solo una vez
    if (map === null) {
        map = L.map('map').setView([lat, lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        // Si el mapa ya existe, simplemente actualiza la vista
        map.setView([lat, lon], 15);
    }

    // Agrega un marcador en la ubicación del usuario
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Tu ubicación actual.')
        .openPopup();

    // Muestra el mensaje de éxito
    locationMessage.textContent = 'Ubicación detectada, busca ayuda cercana.';
}

// Función para manejar errores de geolocalización
function showError(error) {
    mapContainer.style.display = 'none'; // Oculta el mapa si hay un error
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationMessage.textContent = 'El usuario denegó la solicitud de geolocalización.';
            break;
        case error.POSITION_UNAVAILABLE:
            locationMessage.textContent = 'Información de ubicación no disponible.';
            break;
        case error.TIMEOUT:
            locationMessage.textContent = 'La solicitud para obtener la ubicación ha caducado.';
            break;
        case error.UNKNOWN_ERROR:
            locationMessage.textContent = 'Ocurrió un error desconocido.';
            break;
    }
    locationMessage.classList.remove('hidden');
}

// Función para mostrar la información de emergencia
function showEmergencyInfo(e) {
    const buttonClass = e.target.classList[1]; // Ejemplo: 'medical-btn'
    const data = emergencyData[buttonClass];

    if (!data) return;

    infoContainer.innerHTML = `
        <h2>${data.title}</h2>
        <ul>
            ${data.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <a href="tel:${data.callNumber}" class="call-button">Llamar al ${data.callNumber}</a>
    `;
    infoContainer.style.display = 'block';
}

// Escuchador de eventos para el botón SOS
sosBtn.addEventListener('click', getLocation);

// Escuchadores de eventos para los otros botones de emergencia
optionButtons.forEach(button => {
    button.addEventListener('click', showEmergencyInfo);
});
