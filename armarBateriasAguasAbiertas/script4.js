const constRenglonPDF = 35;
var renglonPDF = constRenglonPDF;
const margenRenglon = 15;

const tableHeader = ["Puesto", "Apellido", "Nombre", "INSTIUCIÓN", "NRO NADADOR", "TIEMPO"];

const categoriasNatacion = [
    "INFANTIL 1",
    "INFANTIL 2",
    "MENOR 1",
    "MENOR 2",
    "CADETE 1",
    "CADETE 2",
    "JUVENIL 1",
    "JUVENIL 2",
    "MAYOR",
    "PRIMERA"
];

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


const bateria0 = [
    {
        "distancia": 700,
        "nivel": niveles,
        "categoria": categoriasNatacion.concat(categoriasAficionados) ,
        "genero": generos,
    },
    {
        "distancia": 1400,
        "nivel": niveles,
        "categoria": categoriasNatacion.concat(categoriasAficionados) ,
        "genero": generos,
    },
    {
        "distancia": 2100,
        "nivel": niveles,
        "categoria": categoriasNatacion.concat(categoriasAficionados) ,
        "genero": generos,
    },
        {
        "distancia": 2800,
        "nivel": niveles,
        "categoria": categoriasNatacion.concat(categoriasAficionados) ,
        "genero": generos,
    },
    {
        "distancia": 5000,
        "nivel": niveles,
        "categoria": ["ELITE NATACION"] ,
        "genero": generos,
    }
];

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

var baterias = [
    // {
    //     data: bateria0,
    //     listadoNadadores: true,
    // },
    {
        data: bateria1,
        hora: "09.30"
    },
    {
        data: bateria2,
        hora: "11.00"
    },
    {
        data: bateria3,
        hora: "12.00"
    },
    {
        data: bateria4,
        hora: "12.50"
    },

];

function generarPdf() {
    return new Promise(async (resolve) => {

        // Crea una nueva instancia de jsPDF
        var doc = jsPDF();
        // doc.setFont('helvetica');

        doc.setFontSize(15);
        doc.setFontType('bold');
        doc.text('Bateria de largadas ', (doc.internal.pageSize.width / 2) - 22, 20);
        renglonPDF-= 5;
        añadirTextoAPdf(doc, 'Embalse 2023', (doc.internal.pageSize.width / 2) - 25, 20, "negrita", true)
        // doc.text('Almafuerte 2023', (doc.internal.pageSize.width / 2) - 25 , 20);
        añadirTextoAPdf(doc,'Listado de nadadores',  (doc.internal.pageSize.width / 2)-35, 20,"negrita",true)

        let nadadoresEnPdf = [];

        baterias.forEach((bateria, nroBateria) => {
            if (!bateria.listadoNadadores) {
                renglonPDF+= 5;
                añadirTextoAPdf(doc, `${nroBateria + 1}° Bateria ${bateria.hora} Hs.`, (doc.internal.pageSize.width / 2) - 30, 20, "negrita", true)
                renglonPDF += 5;
            }

            let cantNadadoresBateria = 0;
            bateria.data.forEach(orden => {

                let nadadoresDistancia = nadadores.filter(n => n.distancia == orden.distancia);

                orden.nivel.forEach(nivel => {
                    let nadadoresNivel = nadadoresDistancia.filter(n => n.nivel == nivel);

                    orden.categoria.forEach(categoria => {
                        let nadadoresCategoria = nadadoresNivel.filter(n => n.categoria == categoria);

                        orden.genero.forEach(genero => {
                            let nadadoresGenero = nadadoresCategoria.filter(n => n.genero == genero);

                            if (nadadoresGenero.length == 0) return;


                            nadadoresGenero.sort(function (a, b) {
                                if (a.tiempo > b.tiempo) {
                                    return 1;
                                }
                                if (a.tiempo < b.tiempo) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                            let datos = nadadoresGenero.map((nadador, index) => {
                                nadadoresEnPdf.push(nadador.id)

                                return [
                                    nadador.tiempoFormat == "-" ? nadador.tiempoFormat : index + 1,
                                    nadador.apellido,
                                    nadador.nombre,
                                    nadador.club,
                                    nadador.id,
                                    nadador.tiempoFormat
                                ]

                            });

                            cantNadadoresBateria += datos.length;

                            if (renglonPDF > 240) {
                                doc.addPage();
                                renglonPDF = constRenglonPDF;
                            }

                            añadirTextoAPdf(doc, `${nadadoresGenero[0].distancia} mts. ${nadadoresGenero[0].nivel}  ${nadadoresGenero[0].genero}`, (doc.internal.pageSize.width / 2) - 30, 12, "normal", true)

                            let alignText = 17;
                            if (nadadoresGenero[0].categoria.length <= 8) alignText = 10;


                            añadirTextoAPdf(doc, `${nadadoresGenero[0].categoria} `, (doc.internal.pageSize.width / 2) - alignText, 12, "normal", true)
                            añadirTablaAPdf(doc, tableHeader, datos, "striped")
                            // renglonPDF+= 10;

                        });
                    });

                });
            });

            console.log(`${nroBateria + 1}° Bateria: ${cantNadadoresBateria} nadadores`)

            if (nroBateria+1 < baterias.length ) {
                doc.addPage();
                renglonPDF = constRenglonPDF;
            }

        });

        console.log("Nadadores que faltan por mostrar en el PDF")
        nadadores.filter(nadador =>{
            if (!nadadoresEnPdf.includes(nadador.id)) {
                console.log(nadador)
            }
        })

        // Obtiene el PDF en formato base64
        var pdfBase64 = doc.output('datauristring');

        var iframe = document.createElement('iframe');
        iframe.classList.add("pdf")
        iframe.src = pdfBase64;

        // Agrega la etiqueta iframe a la página web
        document.getElementById("printSection").appendChild(iframe);

        return


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

function añadirTextoAPdf(pdf, texto, posicionY, tamañoLetra, tipoLetra, sumarRenglon) {
    if (tipoLetra == "negrita") tipoLetra = "bold";

    pdf.setFontSize(tamañoLetra);
    pdf.setFontType(tipoLetra);
    pdf.text(texto, posicionY, renglonPDF);

    if (sumarRenglon) renglonPDF += 7;

}