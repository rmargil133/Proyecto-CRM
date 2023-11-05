const tablaClientes = document.querySelector("#listado-clientes");
const mostrarTodos = () => {
    const nombreBD = "ClienteBD";
    const request = window.indexedDB.open(nombreBD, 1);

    request.onsuccess = (e) => {
        const bd = e.target.result;
        const transaction = bd.transaction("clientes", "readonly");
        const objectStore = transaction.objectStore("clientes");
        const requestObtener = objectStore.getAll();

        requestObtener.onsuccess = () => {
            const clientes = requestObtener.result;
            insertarClientes(clientes);
        };

        requestObtener.onerror = (error) => {
            alert("Error al obtener clientes:", error);
        };
    };

    request.onerror = (error) => {
        alert("Error al abrir la base de datos: ", error);
    };
};

const insertarClientes = (clientes) => {
    clientes.forEach(cliente => {
        const nuevaFila = tablaClientes.insertRow();
        const celdaNombre = nuevaFila.insertCell(0);
        celdaNombre.style.textAlign = "center"; 
        const celdaTelefono = nuevaFila.insertCell(1);
        celdaTelefono.style.textAlign = "center"; 
        const celdaEmpresa = nuevaFila.insertCell(2);
        celdaEmpresa.style.textAlign = "center"; 
        const celdaAcciones = nuevaFila.insertCell(3);
        celdaAcciones.style.textAlign = "center"; 

        celdaNombre.textContent = cliente.nombre;
        celdaTelefono.textContent = cliente.telefono;
        celdaEmpresa.textContent = cliente.empresa;

        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar Cliente";
        botonBorrar.classList.add("boton-eliminar", "bg-red-600", "hover:bg-red-500", "font-semibold", "px-2");
        
        const espacios = document.createTextNode("   ");

        const enlaceEditarCliente = document.createElement("a");
        enlaceEditarCliente.href = "./editar-cliente.html";

        botonBorrar.addEventListener("click", () => {
            nuevaFila.remove();
            const nombreBD = "ClienteBD";
            const request = indexedDB.open(nombreBD, 1);

            request.onsuccess = (e) => {
                const bd = e.target.result;
                const transaction = bd.transaction("clientes", "readwrite");
                const objectStore = transaction.objectStore("clientes");
                const requestEliminar = objectStore.delete(cliente.id);
                requestEliminar.onsuccess = () => {
                    alert("Cliente eliminado de la base de datos");
                };
            };
        });

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar Cliente";
        botonEditar.classList.add("boton-editar", "bg-green-600", "hover:bg-green-500", "font-semibold", "px-2");
        enlaceEditarCliente.appendChild(botonEditar);
        botonEditar.addEventListener("click", () => {
            localStorage.setItem("idClienteAEditar", cliente.id);
        });


        celdaAcciones.appendChild(botonBorrar);
        celdaAcciones.appendChild(espacios);
        celdaAcciones.appendChild(enlaceEditarCliente);
   
    });
};

document.addEventListener("DOMContentLoaded", mostrarTodos);
