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

        const callBtn = document.createElement('button');
        callBtn.className = 'btn btn-red call-btn';
        callBtn.textContent = `📞 Llamar al ${data.number}`;
        callBtn.setAttribute('data-number', data.number);
        callButtonContainer.appendChild(callBtn);
    }

    // Nuevo manejador de eventos para los botones de llamada
    callButtonContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('call-btn')) {
            const phoneNumber = event.target.getAttribute('data-number');
            showConfirmationDialog(phoneNumber);
        }
    });

    function showConfirmationDialog(phoneNumber) {
        const dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <h3>¿Estás seguro de que quieres llamar?</h3>
            <p>Acuérdate que esto no es un juego.</p>
            <button class="btn-confirm">Sí, llamar al ${phoneNumber}</button>
            <button class="btn-cancel">Cancelar</button>
        `;
        document.body.appendChild(dialog);

        dialog.querySelector('.btn-confirm').addEventListener('click', () => {
            window.location.href = `tel:${phoneNumber}`;
            document.body.removeChild(dialog);
        });

        dialog.querySelector('.btn-cancel').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    medicalBtn.addEventListener('click', () => showEmergencyInfo('medical'));
    fireBtn.addEventListener('click', () => showEmergencyInfo('fire'));
    policeBtn.addEventListener('click', () => showEmergencyInfo('police'));
});
