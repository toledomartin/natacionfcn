const constRenglonPDF = 35;
var renglonPDF = constRenglonPDF;
const margenRenglon = 15;

const tableHeader = ["Puesto", "Apellido", "Nombre", "INSTIUCIÓN", "NRO NADADOR", "TIEMPO"];
const tableHeaderResultadosCampeonato = ["Puesto", "Apellido", "Nombre", "INSTIUCIÓN", "PUNTAJE"];

const tableHeaderListadoInscripciones = ["Apellido", "Nombre", "DNI", "INSTIUCIÓN"];

const puntaje = {
    1: 18,
    2: 14,
    3: 11,
    4: 8,
    5: 6,
    6: 4,
}

const categoriasNatacion = [
    "INFANTIL",
    "INFANTIL 1",
    "INFANTIL 2",
    "MENOR 1",
    "MENOR 2",
    "CADETE 1",
    "CADETE 2",
    "JUVENIL 1",
    "JUVENIL 2",
    "MAYOR",
    "JUNIOR",
    "PRIMERA"
];

const categoriasAficionadosReducida = [
    "PRE MASTER",
    "CATEGORIA 1",
    "CATEGORIA 2",
    "CATEGORIA 3",
    "CATEGORIA 4",
    "CATEGORIA 5",
    "CATEGORIA 6",
    "CATEGORIA 7",
]

const categoriasAficionados = [
    "PRE MASTER",
    "MASTER A",
    "MASTER B",
    "MASTER C",
    "MASTER D",
    "MASTER E",
    "MASTER F",
    "MASTER G",
    "MASTER H",
    "MASTER I",
    "MASTER J",
    "MASTER K",
    "MASTER L",
    "MASTER M",
    "MASTER N",
    "MASTER O",
    "MASTER P",
    "MASTER Q",
]

const niveles = [
    "AFICIONADO",
    "PROMOCIONAL",
    "NACIONAL",
];

const generos = [
    "FEMENINO",
    "MASCULINO"
];

// *****************************************************************************************
const bateria_general_data = [{
        "distancia": 750,
        "nivel": niveles,
        "categoria": categoriasNatacion,
        "genero": generos,
    },

    {
        "distancia": 1500,
        "nivel": niveles,
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 1500,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionados,
        "genero": generos,
    },
    {
        "distancia": 1500,
        "nivel": ["AFICIONADO"],
        "categoria": categoriasAficionadosReducida,
        "genero": generos,
    },

    {
        "distancia": 2250,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(categoriasAficionados),
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["PROMOCIONAL"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["AFICIONADO"],
        "categoria": categoriasNatacion.concat(categoriasAficionadosReducida),
        "genero": generos,
    },

    {
        "distancia": 3000,
        "nivel": ["NACIONAL","AFICIONADO"],
        "categoria": categoriasNatacion.concat(categoriasAficionadosReducida),
        "genero": generos,
    },

    {
        "distancia": 5000,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(["ELITE NATACION"]),
        "genero": generos,
    },
    {
        "distancia": 7500,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 10000,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
];

const bateriasGeneral = [{
    data: bateria_general_data,
    listadoNadadores: true,
}]




// ***********************************************************************************************

const cuatro_baterias_bateria_1 = [{
        "distancia": 5000,
        "nivel": ["NACIONAL"],
        "categoria": ["ELITE NATACION"],
        "genero": generos,
    },
    {
        "distancia": 2800,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(categoriasAficionados),
        "genero": generos,
    },
    {
        "distancia": 2100,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(categoriasAficionados),
        "genero": generos,
    },
    {
        "distancia": 2100,
        "nivel": ["PROMOCIONAL"],
        "categoria": categoriasNatacion,
        "genero": generos,
    }
];

const cuatro_baterias_bateria_2 = [{
    "distancia": 2100,
    "nivel": ["AFICIONADO"],
    "categoria": categoriasNatacion.concat(categoriasAficionados),
    "genero": generos,
}];

const cuatro_baterias_bateria_3 = [

    {
        "distancia": 700,
        "nivel": niveles,
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 1400,
        "nivel": niveles,
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 1400,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionados,
        "genero": generos,
    },
    {
        "distancia": 1400,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "PRE MASTER",
            "MASTER A",
            "MASTER B",
            "MASTER C",
        ],
        "genero": generos,
    }
];

const cuatro_baterias_bateria_4 = [{
    "distancia": 1400,
    "nivel": ["AFICIONADO"],
    "categoria": [
        "MASTER D",
        "MASTER E",
        "MASTER F",
        "MASTER G",
        "MASTER H",
        "MASTER I",
        "MASTER J",
    ],
    "genero": generos,
}];

const cuatro_baterias = [{
        data: cuatro_baterias_bateria_1,
        hora: "09.30"
    },
    {
        data: cuatro_baterias_bateria_2,
        hora: "11.00"
    },
    {
        data: cuatro_baterias_bateria_3,
        hora: "12.00"
    },
    {
        data: cuatro_baterias_bateria_4,
        hora: "12.50"
    },
]
// ****************************************************************************************

const tres_baterias_bateria_1 = [{
        "distancia": 5000,
        "nivel": ["NACIONAL"],
        "categoria": ["ELITE NATACION"],
        "genero": generos,
    },
    {
        "distancia": 3000,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionadosReducida,
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(categoriasAficionados),
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["PROMOCIONAL"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["AFICIONADO"],
        "categoria": categoriasNatacion.concat(categoriasAficionadosReducida),
        "genero": generos,
    },

];

const tres_baterias_bateria_2 = [

    {
        "distancia": 750,
        "nivel": niveles,
        "categoria": categoriasNatacion,
        "genero": generos,
    },



];


const tres_baterias_bateria_3 = [
    {
        "distancia": 1500,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "PRE MASTER",
            "CATEGORIA 1",
            "CATEGORIA 2",
            "CATEGORIA 3",
        ],
        "genero": generos,
    },
    {
        "distancia": 1500,
        "nivel": ["PROMOCIONAL", "AFICIONADO"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 1500,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "CATEGORIA 4",
            "CATEGORIA 5",
            "CATEGORIA 6",
            "CATEGORIA 7",
        ],
        "genero": generos,
    }, 
    {
        "distancia": 1500,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionados,
        "genero": generos,
    },
];


const tres_baterias = [{
        data: tres_baterias_bateria_1,
        hora: "09.30"
    },
    {
        data: tres_baterias_bateria_2,
        hora: "11.00"
    },
    {
        data: tres_baterias_bateria_3,
        hora: "11.20"
    },
]

// ****************************************************************************************

const cinco_baterias_bateria_1 = [{
        "distancia": 5000,
        "nivel": ["NACIONAL"],
        "categoria": ["ELITE NATACION"],
        "genero": generos,
    },
    {
        "distancia": 3000,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionadosReducida,
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["PROMOCIONAL"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(categoriasAficionados),
        "genero": generos,
    },
    {
        "distancia": 2250,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "PRE MASTER",
            "CATEGORIA 1",
        ],
        "genero": generos,
    },

];

const cinco_baterias_bateria_2 = [
 
    {
        "distancia": 2250,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "CATEGORIA 2",
            "CATEGORIA 3",
            "CATEGORIA 4",
            "CATEGORIA 5",
            "CATEGORIA 6",
            "CATEGORIA 7",
        ],
        "genero": generos,
    },
];

// Aca irian los de 1500
const cinco_baterias_bateria_3 = [

    {
        "distancia": 750,
        "nivel": niveles,
        "categoria": categoriasNatacion,
        "genero": generos,
    },

];

const cinco_baterias_bateria_4 = [{
        "distancia": 1500,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "PRE MASTER",
            "CATEGORIA 1",
        ],
        "genero": generos,
    },
    {
        "distancia": 1500,
        "nivel": ["PROMOCIONAL", "AFICIONADO"],
        "categoria": categoriasNatacion,
        "genero": generos,
    },
];

const cinco_baterias_bateria_5 = [{
    "distancia": 1500,
    "nivel": ["AFICIONADO"],
    "categoria": [
        "CATEGORIA 2",
        "CATEGORIA 3",
        "CATEGORIA 4",
        "CATEGORIA 5",
        "CATEGORIA 6",
        "CATEGORIA 7",
    ],
    "genero": generos,
}, 
{
    "distancia": 1500,
    "nivel": ["NACIONAL"],
    "categoria": categoriasAficionados,
    "genero": generos,
},];

const cinco_baterias = [{
        data: cinco_baterias_bateria_1,
        hora: "9.30"
    },
    {
        data: cinco_baterias_bateria_2,
        hora: "11.00"
    },
    {
        data: cinco_baterias_bateria_3,
        hora: "12.00"
    },
    {
        data: cinco_baterias_bateria_4,
        hora: "12.30"
    },
    {
        data: cinco_baterias_bateria_5,
        hora: "13.15"
    },
]

const formatoBateria = tres_baterias;
// ************************************************************************************************

// Función para obtener el formato de baterías (desde localStorage o default)
function obtenerFormatoBaterias() {
    const guardado = localStorage.getItem("configuracionBaterias");
    if (guardado) {
        try {
            return JSON.parse(guardado);
        } catch (e) {
            console.error("Error al cargar configuración de baterías:", e);
        }
    }
    return formatoBateria;
}

var baterias = obtenerFormatoBaterias();

var nadadoresQueFaltanMostrar = [];
var recuentoDeNadadores = document.createElement("div")
recuentoDeNadadores.classList.add("recuentoNadadores");


function generarPdf({
    nadadoresEvento,
    resultadosCampeonato,
    abrirEnNuevaVentana = true,
    nombreEvento = "Evento de aguas abiertas",
    listadoNadadores = false
}) {

    if (listadoNadadores || resultadosCampeonato) {
        baterias = bateriasGeneral
    } else {
        baterias = obtenerFormatoBaterias()
    }

    console.log(baterias)
    return new Promise(async (resolve) => {

        recuentoDeNadadores.innerHTML = "";
        renglonPDF = constRenglonPDF;

        // Crea una nueva instancia de jsPDF
        var doc = jsPDF();
        // doc.setFont('helvetica');

        doc.setFontSize(15);
        doc.setFontType('bold');
        if (resultadosCampeonato !== true) {
            const texto = 'Bateria de largadas';
            const anchoTexto = doc.getStringUnitWidth(texto) * 15 / doc.internal.scaleFactor;
            doc.text(texto, (doc.internal.pageSize.width - anchoTexto) / 2, 20);
        }
        renglonPDF -= 5;
        añadirTextoAPdf(doc, nombreEvento, 0, 20, "negrita", true, true)


        if (listadoNadadores) {
            añadirTextoAPdf(doc, 'Listado Campeonato', 0, 20, "negrita", true, true)
        } else {
            if (resultadosCampeonato) {
                añadirTextoAPdf(doc, 'Resultados Campeonato', 0, 20, "negrita", true, true)
            } else {
                añadirTextoAPdf(doc, 'Listado de nadadores', 0, 20, "negrita", true, true)
            }
        }



        let nadadoresEnPdf = [];

        baterias.forEach((bateria, nroBateria) => {
            if (!listadoNadadores && resultadosCampeonato !== true) {
                renglonPDF += 5;
                añadirTextoAPdf(doc, `${nroBateria + 1}° Bateria ${bateria.hora} Hs.`, 0, 20, "negrita", true, true)
                renglonPDF += 5;
            }

            let cantNadadoresBateria = 0;
            bateria.data.forEach(orden => {

                // obtengo los nadadores que van en la bateria actual segun la distancia
                let nadadoresDistancia = nadadoresEvento.filter(n => n.distancia == orden.distancia);

                orden.nivel.forEach(nivel => {
                    // En base a los nadadores de la distancia, obtengo los nadadores segun cada nivel
                    let nadadoresNivel = nadadoresDistancia.filter(n => n.nivel == nivel);

                    orden.categoria.forEach(categoria => {
                        // En base a los nadadores del nivel, obtengo los nadadores segun cada categoria
                        let nadadoresCategoria = nadadoresNivel.filter(n => n.categoria == categoria);

                        orden.genero.forEach(genero => {
                            // En base a los nadadores de la categoria, obtengo los nadadores segun cada genero
                            let nadadoresGenero = nadadoresCategoria.filter(n => n.genero == genero);

                            // si no encontro ningun nadador segun los filtros, corto la ejecucion
                            if (nadadoresGenero.length == 0) return;

                            // si quiero mostrar los resultados ordeno por el puntaje, sino por el tiempo
                            if (resultadosCampeonato) {
                                nadadoresGenero.sort(function (nadador_a, nadador_b) {
                                    if (nadador_a.puntaje < nadador_b.puntaje) {
                                        return 1;
                                    }
                                    if (nadador_a.puntaje > nadador_b.puntaje) {
                                        return -1;
                                    }
                                    // a must be equal to b
                                    return 0;
                                });
                            } else {
                                nadadoresGenero.sort(function (nadador_a, nadador_b) {
                                    if (nadador_a.tiempo > nadador_b.tiempo) {
                                        return 1;
                                    }
                                    if (nadador_a.tiempo < nadador_b.tiempo) {
                                        return -1;
                                    }
                                    // a must be equal to b
                                    return 0;
                                });
                            }


                            // Recorro los nadadores encontrados y ordenados
                            let datos = nadadoresGenero.map((nadador, index) => {
                                // Los almaceno para saber cuales ya estan cargados en el pdf y luego saber si alguno no esta
                                nadadoresEnPdf.push(nadador.documento)

                                if (listadoNadadores) {
                                    return [
                                        nadador.apellido,
                                        nadador.nombre,
                                        nadador.documento,
                                        nadador.club,
                                    ]
                                } else {
                                    //De cada nadador formateo los datos que necesito segun si quiero mostrar los resultados o la planilla
                                    if (resultadosCampeonato) {
                                        return [
                                            index + 1,
                                            nadador.apellido,
                                            nadador.nombre,
                                            nadador.club,
                                            nadador.puntaje,
                                        ]
                                    } else {


                                        return [
                                            // nadador.tiempoFormat == "-" ? "-" : index + 1,
                                            nadador.tiempoFormat == "-" ? "-" : index + 1,
                                            nadador.apellido,
                                            nadador.nombre,
                                            nadador.club,
                                            nadador.id,
                                            nadador.tiempoFormat,
                                            nadador.tiempoFormat == "-" ? 0 : index + 1 <= parseInt(Object.keys(puntaje).pop()) ? puntaje[index + 1] : 0
                                        ]


                                    }
                                }




                            });

                            // Almaceno la cantidad de nadadores de cada bateria
                            cantNadadoresBateria += datos.length;

                            // Configuracion para mostrar el pdf
                            if (renglonPDF > 240) {
                                doc.addPage();
                                renglonPDF = constRenglonPDF;
                            }

                            añadirTextoAPdf(doc, `${nadadoresGenero[0].distancia} mts. ${nadadoresGenero[0].nivel}  ${nadadoresGenero[0].genero}`, (doc.internal.pageSize.width / 2) - 30, 12, "normal", true)

                            let alignText = 17;
                            if (nadadoresGenero[0].categoria.length <= 8) alignText = 10;


                            añadirTextoAPdf(doc, `${nadadoresGenero[0].categoria} `, (doc.internal.pageSize.width / 2) - alignText, 12, "normal", true)

                            if (listadoNadadores) {
                                añadirTablaAPdf(doc, tableHeaderListadoInscripciones, datos, "striped")
                            } else {
                                if (resultadosCampeonato) {
                                    añadirTablaAPdf(doc, tableHeaderResultadosCampeonato, datos, "striped")
                                } else {
                                    añadirTablaAPdf(doc, tableHeader, datos, "striped")
                                }
                            }


                            // renglonPDF+= 10;

                        });
                    });

                });
            });



            if (resultadosCampeonato !== true) {
                let texto = `${nroBateria + 1}° Bateria: ${cantNadadoresBateria} nadadores`
                console.log(texto)
                let span = document.createElement("span")
                span.innerHTML = texto

                recuentoDeNadadores.appendChild(span)
            }

            if (nroBateria + 1 < baterias.length) {
                doc.addPage();
                renglonPDF = constRenglonPDF;
            }

        });


        if (resultadosCampeonato !== true) {
            console.log("Nadadores que faltan por mostrar en el PDF")
            nadadoresEvento.filter(nadador => {
                if (!nadadoresEnPdf.includes(nadador.documento)) {
                    console.log(nadador)
                    nadadoresQueFaltanMostrar.push(nadador)
                }
            })
        }

        // Obtiene el PDF en formato base64
        var pdfBase64 = doc.output('datauristring');

        if (abrirEnNuevaVentana) {

            // Abre una nueva ventana
            var newWindow = window.open();
            newWindow.document.write('<iframe class="pdf" src="' + pdfBase64 + '" frameborder="0" style="width:100%;height:100vh;"></iframe>');

        } else {
            var iframe = document.createElement('iframe');
            iframe.classList.add("pdf")
            iframe.src = pdfBase64;

            // Agrega la etiqueta iframe a la página web
            document.getElementById("printSection").appendChild(iframe);
        }


        resolve()


    });

}



function getBase64(path) {
    return new Promise((resolve, reject) => {
        // Utiliza fetch para cargar el archivo
        fetch(path)
            .then(response => {
                // Obtiene un objeto Blob a partir de la respuesta
                return response.blob();
            })
            .then(blob => {
                // Procesa el objeto Blob para obtener la imagen en formato base64
                var reader = new FileReader();
                reader.onloadend = function () {
                    // Obtiene la extensión del archivo
                    var extension = path.split('.').pop();

                    var base64 = reader.result;
                    resolve({
                        type: extension.toUpperCase(),
                        data: reader.result
                    });
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                // Si hay un error al cargar el archivo, rechaza la promesa con el mensaje de error
                reject(error);
            });
    });
}


function ordenarObjetos(arrData, ordenamiento) {
    arrData.sort(function (a, b) {
        for (let i = 0; i < ordenamiento.length; i++) {
            let propiedad = ordenamiento[i];
            if (a[propiedad] !== b[propiedad]) {
                return a[propiedad] > b[propiedad] ? 1 : -1;
            }
        }
        return 0;
    });

    return arrData
}

function redondearProximoCinco(number) {
    // Redondea el número al entero más próximo
    var roundedNumber = Math.round(number);

    // Si el número redondeado es divisible por 5, devuelve el número redondeado
    if (roundedNumber % 5 === 0) return roundedNumber;

    // Si el número redondeado es mayor o igual a 5, devuelve el número redondeado hacia abajo
    // if (roundedNumber >= 5) return roundedNumber - roundedNumber % 5;

    // Si el número redondeado es menor que 5, devuelve el número redondeado hacia arriba
    return roundedNumber + (5 - roundedNumber % 5);
}

function añadirTablaAPdf(pdf, titulosTabla, bodyTable, themeTable) {
    pdf.autoTable({
        theme: themeTable, // Aplica un tema de filas alternas grises y blancas
        head: [titulosTabla],
        body: bodyTable,
        startY: renglonPDF,
        margin: {
            top: 30
        }
    })

    // Obtiene el objeto de la tabla anterior
    let previousTable = pdf.previousAutoTable;

    // Obtiene el alto de la tabla
    let tableHeight = previousTable.finalY;

    renglonPDF = redondearProximoCinco(tableHeight) + 10

}

function añadirTextoAPdf(pdf, texto, posicionX, tamañoLetra, tipoLetra, sumarRenglon, centrar) {
    if (tipoLetra == "negrita") tipoLetra = "bold";

    pdf.setFontSize(tamañoLetra);
    pdf.setFontType(tipoLetra);
    if (centrar) {
        const anchoTexto = pdf.getStringUnitWidth(texto) * tamañoLetra / pdf.internal.scaleFactor;
        const x = (pdf.internal.pageSize.width - anchoTexto) / 2;
        pdf.text(texto, x, renglonPDF);
    } else {
        pdf.text(texto, posicionX, renglonPDF);
    }

    if (sumarRenglon) renglonPDF += 7;

}