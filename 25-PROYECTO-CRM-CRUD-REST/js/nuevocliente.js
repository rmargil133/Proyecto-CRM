const nombre = document.querySelector("#nombre")
const email = document.querySelector("#email")
const telefono = document.querySelector("#telefono")
const empresa = document.querySelector("#empresa")
const formulario = document.querySelector("#formulario")
const btnSubmit = document.querySelector('#formulario input[type="submit"]')
const spinner = document.querySelector("#spinner")

  const formOBJ = {
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',

  }

  nombre.addEventListener("blur", validar)
  email.addEventListener("blur", validar)
  telefono.addEventListener("blur", validar)
  empresa.addEventListener("blur", validar)
  formulario.addEventListener("submit", activarSpinner)
  formulario.addEventListener("submit", (e) =>{
    e.preventDefault()
    añadirCliente(formOBJ)
  })

  function activarSpinner(e) {
    e.preventDefault()
    spinner.classList.add("flex")
    spinner.classList.remove("hidden")

    setTimeout(()=> {
      spinner.classList.remove("flex")
      spinner.classList.add("hidden")

    
    // Creamos una alerta
    const confirmar = document.createElement("P")
    confirmar.classList.add("bg-green-500", "text-white", "p-3", "text-center", "rounded-lg", "mt-5", "font-bold", "text-sm", "uppercase")
    confirmar.textContent = "Cliente agregado correctamente"
    // Lo insertamos al final del formulario
    formulario.appendChild(confirmar)

    // El mensaje se queda siempre, ponemos otrro setTimeout para quitarlo.
      setTimeout(()=> {
        confirmar.remove()
      },3000)

    }, 3000)
  }

  function validar(e) {

    if(e.target.value.trim() === ""){
      mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
      formOBJ[e.target.name] = ""
      habilitarBoton()
      return
    }

    if (e.target.id === "email" && !validarEmail(e.target.value)){
      mostrarAlerta(`El email no es valido`, e.target.parentElement)
      habilitarBoton()
      return
    }
    
    if (e.target.id === "telefono" && !validarTelefono(e.target.value)){
      mostrarAlerta(`El telefono no es valido`, e.target.parentElement)
      habilitarBoton()
      return
    }

    limpiarAlerta(e.target.parentElement)

    formOBJ[e.target.name] = e.target.value.trim().toLowerCase()
    habilitarBoton(formOBJ)
  }

  function habilitarBoton() {
    const values = Object.values(formOBJ)
    console.log(values)
    if(values.includes ("")){
      btnSubmit.classList.add("opacity-50")
      btnSubmit.disabled = true
    } else {
      btnSubmit.classList.remove("opacity-50")
      btnSubmit.disabled = false
    }
  }

  function validarEmail(email){
    //Esta expresion regular comprueba que el email introducido corresponde con la estructura de un email.
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const resultado = regex.test(email)
    return resultado
  }

  function validarTelefono(telefono){
    //Esta expresion regular comprueba que telefono contega	9 cifras seguidas
    const regex = /^\d{9}$/;
    const resultado = regex.test(telefono)
    return resultado
  }

  function limpiarAlerta(referencia) {
    const alerta = referencia.querySelector(".bg-red-600")
    if (alerta){
      alerta.remove()
    }
}

function mostrarAlerta(mensaje, referencia) {
  limpiarAlerta(referencia)
  const error = document.createElement("P")
  error.textContent = mensaje
  error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
  referencia.appendChild(error)
}


const añadirCliente = (formOBJ) => {
  const request = indexedDB.open("ClienteBD")

  request.onupgradeneeded = (e) => {
      const db = e.target.result
      const objectStore = db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true })
      objectStore.createIndex("nombre", "nombre", { unique: false })
      objectStore.createIndex("email", "email", { unique: true })
      objectStore.createIndex("telefono", "telefono", { unique: false })
      objectStore.createIndex("empresa", "empresa", { unique: false })
  }

  request.onsuccess = (e) => {
      const db = e.target.result
      const transaction = db.transaction("clientes", "readwrite")
      const objectStore = transaction.objectStore("clientes")
      const addRequest = objectStore.add(formOBJ)

      addRequest.onerror =  (error) => {
          alert("Error al añadir cliente: ", error)
      }
  }

  request.onerror = (error) => {
      alert("Error al abrir la base de datos: ", error)
  }
}
