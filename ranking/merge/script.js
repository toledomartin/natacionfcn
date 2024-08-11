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

// ***********************************************************************************************************************
// FUNCIONES AUX
// ***********************************************************************************************************************

// Esta funcion era por si CADDA nos pasaba el mismo formato que exporta el Team Manager

function unirRankingCaddaAux() {

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

// ***********************************************************************************************************************
// RANKING FCN
// ***********************************************************************************************************************


function formatRankingFCN() {

    return new Promise(resolve => {
        fetch("fcn/ranking_fcn.csv")
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



// ***********************************************************************************************************************
// RANKING CADDA
// ***********************************************************************************************************************


function unificarRankingCadda({
    fileNumber
}) {

    return new Promise(resolve => {
        fetch(`./cadda/cadda (${fileNumber}).csv`)
            .then(peticion => peticion.text())
            .then((res) => {
                let renglones = res.split('\n')

                var nadadoresFCN = [];
                var eventoActual = "";

                for (let i = 0; i < renglones.length; i++) {
                    var renglon = renglones[i];
                    if (renglon.includes("Individual") || renglon.includes("Times since") || renglon.includes("Number of") || renglon.includes("TIME")) continue;

                    renglon = eliminarCaracteresEspecialesRenglon(renglon).split(';').filter(dato => dato != "" && !dato.includes("\\"));

                    if (renglon.length == 0) continue

                    let primeraPalabraRenglon = renglon[0].split(" ").filter(data => data != "")[0]

                    if (primeraPalabraRenglon == "Women" || primeraPalabraRenglon == "Men" || primeraPalabraRenglon == "") {
                        eventoActual = renglon[0].replaceAll("  ", " ").replaceAll("  ", " ").replaceAll("  ", " ");
                    } else {
                        renglon.splice(0, 1);

                        let datosNadador = renglon;

                        for (let i = 2; i < datosNadador.length; i++) {
                            const dato = datosNadador[i];

                            if (esFecha(dato)) {

                                let club = datosNadador[i - 1];

                                if (!Object.keys(CLUBES_FCN).includes(club)) continue

                                let datoDNI = datosNadador[i - 2].replaceAll(".", "").replaceAll(" ", "").replaceAll("M", "").trim();
                                if (!sonTodosNumeros(datoDNI)) {
                                    datosNadador.splice(i - 1, 0, "99999999");
                                }else{
                                    datosNadador[i - 2] = datoDNI;
                                }

                                let resJsonNadador = formatearJSON({
                                    datosNadador,
                                    evento: eventoActual
                                });

                                // if (club == "SITAS" && datosNadador.join(" ").includes("Panzi")) {
                                //     console.log(datosNadador)
                                //     console.log(resJsonNadador)
                                // }

                                unificarRanking(resJsonNadador)
                            }
                        }

                    }


                }

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

        if (sonTodosNumeros(dato) && datoActual == "apellido") datoActual = "dni"

        const actualData = {
            tiempo: () => {
                datoActual = "apellido"
                resJson.tiempo = dato.replace("x", "");
            },
            apellido: () => {
                let apellidoNombre = dato.split(",")
                // if (dato.includes(",")) datoActual = "nombre";

                // arrApellido.push(dato.replaceAll(",", ""));

                resJson.nombre = (apellidoNombre[1] + " " + apellidoNombre[0] + " " + "(00)  G").trim();
            },
            // nombre: () => {

            //     arrNombre.push(dato);
            // },
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


    resJson.evento = arrEvento.join(" ");


    return resJson;
}

function unificarRanking(datosNadador) {
    let nadadorKey = normalize(datosNadador.nombre) + " - " + datosNadador.club;

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

// ***********************************************************************************************************************
// FORMATEAR TEXTOS
// ***********************************************************************************************************************

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
        .replaceAll("\ff", "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
        .normalize()
        .replaceAll("\r", "")
        .replace("\n", "")

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

// ***********************************************************************************************************************
// VALIDAR INSCRIPCIONES
// ***********************************************************************************************************************

function cargarInscripciones() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = function (event) {
        let archivo = event.target.files[0];
        let lector = new FileReader();

        lector.onload = function (e) {
            let contenido = e.target.result;
            alert("Inscripciones cargadas correctamente")
            localStorage.setItem("inscripciones", contenido)
        };

        lector.readAsText(archivo);
    };

    input.click();
}


function validarTiemposInscripciones() {


    let inscripciones = localStorage.getItem("inscripciones")

    let formatLines = inscripciones.split('Licensed To')
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


// ***********************************************************************************************************************
// DESCARGAR RANKING
// ***********************************************************************************************************************

function descargarRanking(data) {
    let json = JSON.stringify(data, null, 2);
    let blob = new Blob([json], {
        type: 'application/json'
    });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = 'ranking.json';
    link.click();
}


// ***********************************************************************************************************************
// ON LOAD
// ***********************************************************************************************************************


window.onload = async () => {
    await formatRankingFCN()

    for (let i = 0; i < 5; i++) {
        await unificarRankingCadda({
            fileNumber: i
        })
    }

    cargarOpcionesSelector(Object.keys(CLUBES_FCN), "listadoClubes")

    document.getElementById("buscarNadador").addEventListener("input", iniciarBusqueda);


}