document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sos-button');
    const mapContainer = document.getElementById('map-container');
    const emergencyOptions = document.getElementById('emergency-options');
    const resultsContainer = document.getElementById('results-container');
    const resultsList = document.getElementById('results-list');
    const callButtonContainer = document.getElementById('call-button-container');
    const medicalBtn = document.getElementById('medical-btn');
    const fireBtn = document.getElementById('fire-btn');
    const policeBtn = document.getElementById('police-btn');

    let map;
    let marker;

    const dummyData = {
        medical: {
            list: ['Hospital San Juan', 'Clínica Central', 'Centro de Salud N°5'],
            number: '106'
        },
        fire: {
            list: ['Estación de Bomberos Voluntarios', 'Compañía de Bomberos Lima Sur'],
            number: '116'
        },
        police: {
            list: ['Comisaría del Distrito', 'Puesto Policial Vecinal'],
            number: '105'
        }
    };

    sosButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            sosButton.textContent = 'Buscando ubicación...';
            sosButton.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    sosButton.style.display = 'none';
                    mapContainer.style.display = 'block';
                    emergencyOptions.style.display = 'flex';
                    emergencyOptions.style.flexDirection = 'column';

                    if (!map) {
                        map = L.map('map').setView([lat, lng], 15);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(map);
                    } else {
                        map.setView([lat, lng], 15);
                    }

                    if (marker) {
                        map.removeLayer(marker);
                    }
                    marker = L.marker([lat, lng]).addTo(map)
                        .bindPopup('Tu ubicación actual').openPopup();

                    document.getElementById('location-message').textContent = 'Ubicación detectada, busca ayuda cercana.';
                    
                },
                (error) => {
                    sosButton.textContent = '🚨 SOS (Error de ubicación)';
                    alert('No se pudo obtener la ubicación. Por favor, asegúrate de que la geolocalización esté activada.');
                    console.error('Error de geolocalización:', error);
                    sosButton.disabled = false;
                }
            );
        } else {
            alert('Tu navegador no soporta la API de geolocalización.');
        }
    });

    function showEmergencyInfo(type) {
        resultsList.innerHTML = '';
        callButtonContainer.innerHTML = '';
        resultsContainer.style.display = 'block';

        const data = dummyData[type];
        data.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            resultsList.appendChild(li);
        });

        const callBtn = document.createElement('a');
        callBtn.href = `tel:${data.number}`;
        callBtn.className = 'btn btn-red';
        callBtn.textContent = `📞 Llamar al ${data.number}`;
        callButtonContainer.appendChild(callBtn);
    }

    medicalBtn.addEventListener('click', () => showEmergencyInfo('medical'));
    fireBtn.addEventListener('click', () => showEmergencyInfo('fire'));
    policeBtn.addEventListener('click', () => showEmergencyInfo('police'));
});
