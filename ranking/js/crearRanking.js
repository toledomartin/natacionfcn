function cargarOpcionesSelector(array, selectorId) {
    var select = document.getElementById(selectorId);

    // Limpiar opciones existentes
    select.innerHTML = "";

    crearOption("Todos los clubes", select)

    // Crear y añadir nuevas opciones
    array.sort().forEach(function (text) {
        crearOption(text, select)
    });
}

function crearOption(text, select) {
    var option = document.createElement("option");
    option.text = text;
    select.add(option);
}


// Función que maneja el evento input en el input
function iniciarBusqueda() {
    var inputValue = document.getElementById("buscarNadador").value;

    // Verificar si se han ingresado al menos 3 caracteres
    if (inputValue.length >= 3) {
        // Iniciar el temporizador para la búsqueda
        clearTimeout(timerInputBusqueda); // Limpiar el temporizador existente si hay uno

        // Esperar 2 segundos y luego ejecutar la función de búsqueda
        timerInputBusqueda = setTimeout(buscar, 1000);
    }
}

// Función para ejecutar la acción de búsqueda
function buscar() {
    var valorBuscado = document.getElementById("buscarNadador").value.toLowerCase();
    var clubSeleccionado = document.getElementById("listadoClubes").value;
    document.getElementById("container").innerHTML = "";

    let nadadoresClubSeleccionado = [];

    if (clubSeleccionado == "Todos los clubes") {

        Object.keys(CLUBES_FCN).forEach(club => {
            nadadoresClubSeleccionado.push(Object.values(CLUBES_FCN[club]))
        });


    } else {
        nadadoresClubSeleccionado = Object.values(CLUBES_FCN[clubSeleccionado])
    }

    let nadadoresEncontrados = nadadoresClubSeleccionado.flat().filter(nadador => nadador.nombre.toLowerCase().includes(valorBuscado))

    nadadoresEncontrados.forEach(nadador => {

        let datosNadadorOrdenados = ordenarEventos(nadador);
        mostrarInformacion(datosNadadorOrdenados)
    });

}

function ordenarEventos(nadador) {

    nadador.eventos.sort((a, b) => {
        if (a.distancia === b.distancia) {
            if (a.estilo === b.estilo) {
                return a.tiempo.replace(":", "").replace(".", "") - b.tiempo.replace(":", "").replace(".", ""); // Ordena por tiempo si la distancia y el estilo son iguales
            } else {
                return a.estilo.localeCompare(b.estilo); // Ordena por estilo si la distancia es igual
            }
        } else {
            return a.distancia - b.distancia; // Ordena por distancia
        }
    });

    return nadador
}


function mostrarInformacion(json) {
    var container = document.getElementById("container");

    var containerTitle = document.createElement("div");
    containerTitle.classList.add("containerTitle");

    var nombre = document.createElement("div");
    nombre.className = "nombre";
    nombre.textContent = json.nombre;
    containerTitle.appendChild(nombre);

    var club = document.createElement("div");
    club.className = "club";
    club.textContent = "Club: " + json.club;
    containerTitle.appendChild(club);

    container.appendChild(containerTitle)

    var table = document.createElement("table");
    container.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var encabezados = ["Distancia", "Estilo", "Tiempo", "Fecha", "Evento", "RANKING"];
    encabezados.forEach(function (encabezado) {
        var th = document.createElement("th");
        th.textContent = encabezado;
        tr.appendChild(th);
    });

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    let distanciaEstiloAnterior = "";
    let rowStyleActual = 1;

    json.eventos.forEach(function (evento, index) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);

        var campos = ["distancia", "estiloTraduccion", "tiempo", "fecha", "evento", "ranking"];

        let distanciaEstiloActual = evento.distancia + " " + evento.estiloTraduccion

        if (index == 0) distanciaEstiloAnterior = distanciaEstiloActual;

        if (distanciaEstiloAnterior != distanciaEstiloActual) {
            rowStyleActual = rowStyleActual == 1 ? 2 : 1;
            distanciaEstiloAnterior = distanciaEstiloActual;
        }

        tr.classList.add(`row-style-${rowStyleActual}`)


        campos.forEach(function (campo) {


            var td = document.createElement("td");

            if (campo == "ranking") {

                ["estaEnBaseFcn", "estaEnBaseCadda"].forEach(validacionRanking => {

                    if (evento[validacionRanking]) {
                        let divImg = document.createElement("div");
                        divImg.classList.add("imgRanking");

                        let img = document.createElement("img");
                        img.src = `../assets/img/${validacionRanking == "estaEnBaseFcn" ? "logo_fcn.png" : "logo_cadda.png"}`
                        divImg.appendChild(img);

                        td.classList.add("imgContainerRanking")

                        td.appendChild(divImg)
                    }


                });

            } else {
                td.textContent = evento[campo];
            }

            tr.appendChild(td);
        });
    });

    // var estaEnBaseFcn = document.createElement("div");
    // estaEnBaseFcn.textContent = "¿Está en base Fcn? " + (json.estaEnBaseFcn ? "Sí" : "No");
    // container.appendChild(estaEnBaseFcn);
}


