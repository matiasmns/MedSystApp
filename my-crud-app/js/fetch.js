// URL de la API
const API_SERVER = 'http://localhost/my-crud-app/api/api.php';

// Opciones para las peticiones fetch a la API
const options = {
    method: 'GET', // Método de la petición (GET)
    headers: {
        accept: 'application/json', // Tipo de respuesta esperada (JSON)
    }
};

// Función para crear elementos HTML
const createElement = (tag, className, attributes = {}) => {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
};

// Función para cargar pacientes
const loadPatients = async () => {
    try {
        const response = await fetch(API_SERVER, options);
        const data = await response.json();
        
        const pacientesContainer = document.querySelector('.pacientesContainer');
        pacientesContainer.innerHTML = ''; // Limpiar contenido previo

        if (data.pacientes) {
            data.pacientes.forEach(paciente => {
                const row = createElement('div', 'pacienteRow');
                row.innerHTML = `
                    <div>${paciente.id}</div>
                    <div>${paciente.nombre}</div>
                    <div>${paciente.dni}</div>
                    <div>${paciente.idpaciente}</div>
                    <div>
                        <button class="btn" onclick="deletePatient(${paciente.id})">Eliminar</button>
                    </div>
                    <div>
                        <button class="btn" onclick="editPatient('${paciente.id}', '${paciente.nombre}', '${paciente.dni}', '${paciente.idpaciente}')">Editar</button>
                    </div>
                `;
                pacientesContainer.appendChild(row);
            });
        } else {
            console.log("No hay datos de pacientes");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

// Event listener para el botón "Guardar"
document.querySelector('#btnGuardar').addEventListener('click', loadPatients);

// Ejecutamos la función de carga de pacientes al cargar la página (opcional)
document.addEventListener('DOMContentLoaded', loadPatients);
