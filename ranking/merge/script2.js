// "https://www.virtualbadge.io/resources/utf-8-converter-for-csv-files"
// https://convertio.co/es/pdf-csv/
// https://tinywow.com/pdf/to-csv

var tiemposDesde = "";
var CLUBES_FCN = {};
var timerInputBusqueda; // Variable global para almacenar el ID del temporizador

const fileNameRankingCadda = [
    "ranking_cadda_corta",
    "ranking_cadda_larga",
]

var traduccionEstilo = {
    "IM": "Combinado",
    "Fly": "Mariposa",
    "Back": "Espalda",
    "Breast": "Pecho",
    "Free": "Libre",
}

function unirRankingCadda1() {

    return new Promise(resolve => {
        fetch("rankingCADDA.csv")
            .then(peticion => peticion.text())
            .then((res) => {

                let formatLines = res.split('Licensed To')
                formatLines.shift()

                formatLines.forEach((line, index) => {

                    let res = formatData(line)

                    let resJson = {
                        desde: res[3],
                        nombre: res[7],
                        club: res[8],
                        tiempo: res[9],
                        distancia: res[10],
                        estilo: res[11],
                        fecha: res[12],
                        evento: res[13],
                    }

                    unificarRanking(resJson)



                });

                // var agrupadosPorNombre = formatLines.reduce(function (acc, obj) {
                //     var key = normalize(obj.nombre) + " - " + obj.club;
                //     if (!acc[key]) {
                //         acc[key] = [];
                //     }
                //     acc[key].push(obj);
                //     return acc;
                // }, {});

                resolve(res)

            })
            .catch(e => {
                console.log(e)
            })
    })

}

function unificarRanking(datosNadador) {
    let nadadorKey = normalize(datosNadador.nombre) + " - " + datosNadador.club;


    // if (datosNadador.club == "CEF11") {
    //     console.log(datosNadador.nombre)
    //     console.log(normalize(datosNadador.nombre))
    // }
    // Solamente los clubes que estan en la base de la fcn
    if (Object.keys(CLUBES_FCN).includes(datosNadador.club)) {

        // Si el nadador no esta en la base de la fcn lo creo seteando la bandera
        if (!Object.keys(CLUBES_FCN[datosNadador.club]).includes(nadadorKey)) {
            CLUBES_FCN[datosNadador.club][nadadorKey] = {
                nombre: datosNadador.nombre,
                club: datosNadador.club,
                eventos: [],
                estaEnBaseFcn: false,
            };
        }


        let idEvento = datosNadador.distancia + "-" + datosNadador.estilo + "-" + datosNadador.evento;

        // Debo buscar aquellos eventos que no esten cargados previamente
        let existeRegistroTiempoEnFcn = CLUBES_FCN[datosNadador.club][nadadorKey].eventos.filter(evento => evento.id == idEvento)[0]

        // Si no esta en la base de la fcn seteo la bandera en false
        if (!existeRegistroTiempoEnFcn) {
            CLUBES_FCN[datosNadador.club][nadadorKey].eventos.push({
                id: datosNadador.distancia + "-" + datosNadador.estilo + "-" + datosNadador.evento,
                distancia: datosNadador.distancia,
                estilo: datosNadador.estilo,
                estiloTraduccion: traduccionEstilo[datosNadador.estilo],
                tiempo: datosNadador.tiempo,
                fecha: datosNadador.fecha,
                evento: datosNadador.evento,
                estaEnBaseFcn: false,
                estaEnBaseCadda: true,
            })
        } else {
            CLUBES_FCN[datosNadador.club][nadadorKey].eventos.filter(evento => evento.id == idEvento)[0].estaEnBaseCadda = true
        }
    }



}

function formatRanking() {

    return new Promise(resolve => {
        fetch("ranking_fcn.csv")
            .then(peticion => peticion.blob())
            .then((res) => {

                var reader = new window.FileReader();
                reader.addEventListener('loadend', function () {
                    let formatLines = reader.result.split('Licensed To')
                    formatLines.shift()


                    formatLines.forEach(line => {
                        let res = formatData(line)
                        res.pop()

                        let resJson = {
                            desde: res[3],
                            nombre: res[7],
                            club: res[8],
                            tiempo: res[9].replace("x", ""),
                            distancia: res[10],
                            estilo: res[11],
                            fecha: res[12],
                            evento: res.slice(13).join(" "),
                        }

                        let nombreNormalizado = normalize(resJson.nombre);
                        let nadadorKey = nombreNormalizado + " - " + resJson.club;

                        if (!CLUBES_FCN[resJson.club]) CLUBES_FCN[resJson.club] = {};

                        if (!CLUBES_FCN[resJson.club][nadadorKey]) CLUBES_FCN[resJson.club][nadadorKey] = {
                            nombre: resJson.nombre,
                            club: resJson.club,
                            eventos: [],
                            estaEnBaseFcn: true,
                        };

                        CLUBES_FCN[resJson.club][nadadorKey].eventos.push({
                            id: resJson.distancia + "-" + resJson.estilo + "-" + resJson.evento,
                            distancia: resJson.distancia,
                            estilo: resJson.estilo,
                            estiloTraduccion: traduccionEstilo[resJson.estilo],
                            tiempo: resJson.tiempo,
                            fecha: resJson.fecha,
                            evento: resJson.evento,
                            estaEnBaseFcn: true,
                            estaEnBaseCadda: false,
                        })


                    });

                    resolve()

                });
                reader.readAsBinaryString(res);

            })
            .catch(e => {
                console.log(e)
            })
    })

}

function formatData(data) {
    return data
        .split(",")
        .map(element => element.replaceAll('"', ""))
        .filter(element => element.length > 1)
        .filter(element => element != "")
        .map(element => element.trim())

}


// Función para normalizar caracteres especiales
function normalize(str) {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
        .normalize()
        .slice(0, -7)
        .trim()
}

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
                        img.src = `./assets/img/${validacionRanking == "estaEnBaseFcn" ? "logo_fcn.png" : "logo_cadda.png"}`
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

// ***********************************************************************************************************************



function unificarRankingCadda({
    fileNumber
}) {

    return new Promise(resolve => {
        fetch(`./registros/cadda (${fileNumber}).csv`)
            .then(peticion => peticion.text())
            .then((res) => {

                let renglones = res.replaceAll("\n", "").split('"').filter(renglon => renglon != "");
                renglones.splice(0, 4);

                var nadadoresFCN = [];

                var eventoActual = "";

                renglones.forEach(renglon => {

                    renglon = renglon
                        .trim()
                        .replaceAll("\f", "")
                        .replaceAll("\ff", "")
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
                        .normalize()
                        .replace("\n", "")


                    let primeraPalabraRenglon = renglon.split(" ").filter(data => data != "")[0]

                    if (primeraPalabraRenglon == "Women" || primeraPalabraRenglon == "Men" || primeraPalabraRenglon == "") {
                        eventoActual = renglon;
                    } else {

                        let datosNadador = eliminarCaracteresEspecialesRenglon(renglon).split(" ").filter(dato => dato != "" && !dato.includes("\\"))
                        datosNadador.splice(0, 1);



                        for (let i = 2; i < datosNadador.length; i++) {
                            const dato = datosNadador[i];


                            if (esFecha(dato)) {

                                let club = datosNadador[i - 1];



                                if (!Object.keys(CLUBES_FCN).includes(club)) break

                                if (!sonTodosNumeros(datosNadador[i - 2].replaceAll(".", ""))) {
                                    datosNadador.splice(i - 1, 0, "99999999");
                                }

                                let resJsonNadador = formatearJSON({
                                    datosNadador,
                                    evento: eventoActual
                                });

                                unificarRanking(resJsonNadador)
                                // nadadoresFCN.push(datosNadador)
                            }
                        }

                    }


                });


                resolve(nadadoresFCN)

            })
            .catch(e => {
                resolve(true)
            })
    })

}

function formatearJSON({
    datosNadador,
    evento
}) {


    let eventData = evento.split(" ").filter(data => data != "");

    let resJson = {
        desde: "",
        nombre: "",
        club: "",
        tiempo: "",
        distancia: eventData[1],
        estilo: eventData[2],
        fecha: "",
        evento: "",
    }

    let arrApellido = [];
    let arrNombre = [];
    let arrEvento = [];

    let datoActual = "tiempo";
    datosNadador.forEach((dato, index) => {

        if (sonTodosNumeros(dato) && datoActual == "nombre") datoActual = "dni"

        const actualData = {
            tiempo: () => {
                datoActual = "apellido"
                resJson.tiempo = dato;
            },
            apellido: () => {


                if (dato.includes(",")) datoActual = "nombre";

                arrApellido.push(dato.replaceAll(",", ""));
            },
            nombre: () => {

                arrNombre.push(dato);
            },
            dni: () => {
                datoActual = "club"
            },
            club: () => {
                datoActual = "fecha";
                resJson.club = dato;
            },
            fecha: () => {
                datoActual = "evento";
                resJson.fecha = dato;
            },
            evento: () => {
                arrEvento.push(dato.replaceAll(",", ""))
            },
        }

        actualData[datoActual]()

    });


    resJson.nombre = (arrNombre.join(" ") + " " + arrApellido.join(" ") + " " + "(00)  G").trim();
    resJson.evento = arrEvento.join(" ");



    return resJson;
}

function eliminarCaracteresEspecialesRenglon(renglon) {
    return renglon
        .replaceAll("TBM1", "")
        .replaceAll("TBM2", "")
        .replaceAll("TBM3", "")
        .replaceAll("TBM4", "")
        .replaceAll("TBM5", "")
        .replaceAll("TBI1", "")
        .replaceAll("TBI2", "")
        .replaceAll("TBI3", "")
        .replaceAll("TBI4", "")
        .replaceAll("TBI5", "")
        .replaceAll("*", "")
        .replaceAll("\f", "")

}

function sonTodosNumeros(str) {
    let regex = /^[0-9]+$/;
    return regex.test(str);
}

function esFecha(texto) {
    // Expresión regular para validar los formatos de fecha d/m/yyyy, dd/m/yyyy, d/mm/yyyy, dd/mm/yyyy
    var regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(19|20)\d\d$/;

    // Verificar si el texto coincide con la expresión regular
    if (regex.test(texto)) {
        var partes = texto.split("/");
        var dia = parseInt(partes[0], 10);
        var mes = parseInt(partes[1], 10);
        var año = parseInt(partes[2], 10);

        // Comprobar si el mes tiene 30 días y el día es 31
        if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
            if (dia === 31) {
                return false;
            }
        }
        // Comprobar si el mes es febrero
        else if (mes === 2) {
            var esBisiesto = (año % 4 === 0 && año % 100 !== 0) || año % 400 === 0;
            if (dia > 29 || (dia === 29 && !esBisiesto)) {
                return false;
            }
        }
        // La fecha es válida
        return true;
    }
    // El texto no coincide con el formato de fecha
    return false;
}





function validarTiemposEntries() {

    return new Promise(resolve => {
        fetch("entries.csv")
            .then(peticion => peticion.text())
            .then((res) => {

                let formatLines = res.split('Licensed To')
                formatLines.shift()

                let entriesInvalidas = [];

                formatLines.forEach((line, index) => {

                    let res = formatData(line).splice(5, 4)

                    let estiloDistancia = res[0].split(" ");

                    let resJson = {
                        nombre: res[1] + " " + "(00)  G",
                        club: res[2],
                        tiempo: res[3].replace("L", ""),
                        distancia: estiloDistancia.at(-2),
                        estilo: estiloDistancia.at(-1),
                    }

                    let {
                        existe,
                        registros
                    } = existeRegistroTiempo(resJson)

                    if (!existe) {

                        resJson.nombre = resJson.nombre.slice(0, -7);
                        resJson.registros = registros.map(registro => {
                            return {
                                evento: registro.evento,
                                tiempo: registro.tiempo,
                                fecha: registro.fecha,
                                estaEnBaseCadda: registro.estaEnBaseCadda,
                                estaEnBaseFcn: registro.estaEnBaseFcn,
                            }
                        })


                        entriesInvalidas.push(resJson)
                    }

                });


                localStorage.setItem("entriesInvalidas", JSON.stringify(entriesInvalidas))

                window.open("validarEntries.html", "blank")

                resolve()

            })
            .catch(e => {
                console.log(e)
            })
    })

}

function existeRegistroTiempo(datosNadador) {

    let nadadorKey = normalize(datosNadador.nombre) + " - " + datosNadador.club;

    let registros = [];
    let existe = false;

    if (!CLUBES_FCN[datosNadador.club][nadadorKey]) {
        return {
            existe,
            registros
        }
    } else {
        return {
            existe: CLUBES_FCN[datosNadador.club][nadadorKey].eventos.some(evento => evento.distancia == datosNadador.distancia && evento.estilo == datosNadador.estilo && evento.tiempo == datosNadador.tiempo),
            registros: CLUBES_FCN[datosNadador.club][nadadorKey].eventos.filter(evento => evento.distancia == datosNadador.distancia && evento.estilo == datosNadador.estilo)
        }
    }


}








window.onload = async () => {
    await formatRanking()
    // await unirRankingCadda1()

    for (let i = 0; i < 15; i++) {
        await unificarRankingCadda({
            fileNumber: i
        })
    }


    cargarOpcionesSelector(Object.keys(CLUBES_FCN), "listadoClubes")

    document.getElementById("buscarNadador").addEventListener("input", iniciarBusqueda);

    validarTiemposEntries()


}