document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("itemForm");
    const itemTableBody = document.getElementById("itemsTableBody");
    const addButton = document.getElementById("addButton");
    const editButton = document.getElementById("editButton");

    // Carga la tabla en el HTML. Lo renderiza
    function loadItems() {
        fetch("http://localhost/my-crud-app/api/api.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then((data) => {
                itemTableBody.innerHTML = "";
                if (data.pacientes) {
                    data.pacientes.forEach((paciente) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td class='py-3 px-6 text-left'>${paciente.id}</td>
                            <td class='py-3 px-6 text-left'>${paciente.nombre}</td>
                            <td class='py-3 px-6 text-left'>${paciente.dni}</td>
                            <td class='py-3 px-6 text-left'>${paciente.idpaciente}</td>
                            <td>
                                <button class='py-3 px-6 text-left' onclick="deleteItem(${paciente.id})">Eliminar</button>
                            </td>
                            <td>
                                <button class='py-3 px-6 text-left' onclick="editItem(
                                    '${paciente.id}',
                                    '${paciente.nombre}',
                                    '${paciente.dni}',
                                    '${paciente.idpaciente}'
                                )">Editar</button>
                            </td>
                        `;
                        itemTableBody.appendChild(row);
                    });
                } else {
                    console.log("No hay datos de pacientes");
                }
            })
            .catch((error) => console.error("Error:", error));
    }

    function deleteItem(id) {
        fetch(`http://localhost/my-crud-app/api/api.php?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                loadItems();
            })
            .catch((error) => console.error("Error:", error));
    }

    window.editItem = function (id, nombre, dni, idpaciente) {
        document.getElementById('id').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('dni').value = dni;
        document.getElementById('idpaciente').value = idpaciente;
        
        // Mostrar el botón de editar y ocultar el de agregar
        addButton.style.display = "none";
        editButton.style.display = "inline";
    };

    window.deleteItem = deleteItem;

    // Función para agregar un nuevo paciente
    addButton.addEventListener("click", function () {
        const nombre = document.getElementById('nombre').value;
        const dni = document.getElementById('dni').value;
        const idpaciente = document.getElementById('idpaciente').value;

        fetch("http://localhost/my-crud-app/api/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre, dni, idpaciente })
        })
            .then((response) => response.json())
            .then((data) => {
                form.reset();
                loadItems();
            })
            .catch((error) => console.error("Error:", error));
    });

    // Función para actualizar un paciente existente
    editButton.addEventListener("click", function () {
        const id = document.getElementById('id').value;
        const nombre = document.getElementById('nombre').value;
        const dni = document.getElementById('dni').value;
        const idpaciente = document.getElementById('idpaciente').value;

        fetch(`http://localhost/my-crud-app/api/api.php?id=${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre, dni, idpaciente })
        })
            .then((response) => response.json())
            .then((data) => {
                form.reset();
                addButton.style.display = "inline";
                editButton.style.display = "none";
                loadItems();
            })
            .catch((error) => console.error("Error:", error));
    });

    loadItems();
});
