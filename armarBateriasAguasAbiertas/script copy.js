

const constRenglonPDF = 35;
var renglonPDF = constRenglonPDF;
const margenRenglon = 15;

// const ordenamiento2 = [
    //     "distancia",
    //     "nivel",
    //     "categoria",
    //     "genero",
    //     "apellido"
    // ];
const tableHeader = ["Puesto","Apellido","Nombre", "INSTIUCIÓN", "NRO NADADOR", "TIEMPO"];
    
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

const bateria1 = [
    {
        "distancia": 5000,
        "nivel": ["NACIONAL"],
        "categoria": ["ELITE NATACION"],
        "genero": generos,
    },
    {
        "distancia": 2800,
        "nivel": ["NACIONAL"],
        "categoria": categoriasNatacion.concat(categoriasAficionados) ,
        "genero": generos,
    },
    {
        "distancia": 2100,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionados ,
        "genero": generos,
    },
        {
        "distancia": 2100,
        "nivel": ["PROMOCIONAL"],
        "categoria": categoriasNatacion ,
        "genero": generos,
    }
];

const bateria2 = [
    {
        "distancia": 2100,
        "nivel": ["AFICIONADO"],
        "categoria": [
            "MENOR 2",
            "PRE MASTER",
            "MASTER A",
            "MASTER B",
            "MASTER C",
            "MASTER D",
            "MASTER E",
            "MASTER F",
            "MASTER G",
            "MASTER H",
        ] ,
        "genero": generos,
    }
];

const bateria3 = [

    {
        "distancia": 700,
        "nivel": niveles,
        "categoria": categoriasNatacion ,
        "genero": generos,
    },
    {
        "distancia": 1400,
        "nivel": niveles,
        "categoria": categoriasNatacion ,
        "genero": generos,
    },
    {
        "distancia": 1400,
        "nivel": ["NACIONAL"],
        "categoria": categoriasAficionados ,
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

const bateria4 = [
    {
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
        ] ,
        "genero": generos,
    }
];

var baterias = [
    {
        data: bateria1,
        hora: "09.30"
    },
    {
        data: bateria2,
        hora: "11.30"
    },
    {
        data: bateria3,
        hora: "12.10"
    },
    {
        data: bateria4,
        hora: "09.30"
    },

];



function generarPdf(){
    return new Promise(async(resolve) => {

        // Crea una nueva instancia de jsPDF
        var doc = jsPDF();
        // doc.setFont('helvetica');

        doc.setFontSize(15);
        doc.setFontType('bold');
        doc.text('Bateria de largadas ', (doc.internal.pageSize.width / 2) - 25, 20);

        baterias.forEach((bateria,nroBateria) => {
            añadirTextoAPdf(doc,`${nroBateria + 1}° Bateria ${bateria.hora} Hs.`,  (doc.internal.pageSize.width / 2)-30, 20,"negrita",true)
            renglonPDF += 5;
            
            bateria.data.forEach(orden => {
                
                let nadadoresDistancia = nadadores.filter(n => n.distancia == orden.distancia);
    
                orden.nivel.forEach(nivel => {
                    let nadadoresNivel = nadadoresDistancia.filter(n =>  n.nivel == nivel);
    
                    orden.categoria.forEach(categoria => {
                        let nadadoresCategoria = nadadoresNivel.filter(n =>  n.categoria == categoria);
                        
                        orden.genero.forEach(genero => {
                            let nadadoresGenero = nadadoresCategoria.filter(n =>  n.genero == genero);
                            
                            if(nadadoresGenero.length == 0 ) return;
    
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

                            let datos = nadadoresGenero.map((nadador,index) => {
                                return [
                                    nadador.tiempoFormat == "-" ? nadador.tiempoFormat : index + 1,
                                    nadador.apellido,
                                    nadador.nombre,
                                    nadador.club,
                                    nadador.id,
                                    nadador.tiempoFormat
                                ]
                    
                            });

                            
                            if (renglonPDF > 240) {
                                doc.addPage();
                                renglonPDF = constRenglonPDF;
                            }
    
                            añadirTextoAPdf(doc,`${nadadoresGenero[0].distancia} mts. ${nadadoresGenero[0].nivel}  ${nadadoresGenero[0].genero}`, (doc.internal.pageSize.width / 2) - 30, 12,"normal",true)

                            let alignText = 17;
                            if (nadadoresGenero[0].categoria.length <= 8 ) alignText = 10;
                                
                            
                            añadirTextoAPdf(doc,`${nadadoresGenero[0].categoria} `,  (doc.internal.pageSize.width / 2)-alignText, 12,"normal",true)
                            añadirTablaAPdf(doc,tableHeader,datos,"striped")
                            // renglonPDF+= 10;
                          
                        });
                    });
                    
                });
            });
        });
        


        // Obtiene el PDF en formato base64
        var pdfBase64 = doc.output('datauristring');

        var iframe = document.createElement('iframe');
        iframe.classList.add("pdf")
        iframe.src = pdfBase64;

        // Agrega la etiqueta iframe a la página web
        document.getElementById("printSection").appendChild(iframe);

        return


        let arrRespPreg = await consultar("audi_modulo_respuesta_preg")
        let arrPreg = await consultar("audi_preguntas")
        arrRespPreg = arrRespPreg.filter(res => res.auditoriaId == parseInt(auditoriaNro) )
        arrRespPreg.map(objResp => { objResp["pregunta"] = arrPreg.filter(preg=> preg.id == objResp.preguntaId)[0].pregunta; return objResp })

        let arrModuloObsAux = await consultar("audi_modulo_observacion")
        let arrModuloObs = arrModuloObsAux.filter(res => res.auditoriaId == parseInt(auditoriaNro) )

        let arrPreguntas = [];
        let arrObservacion = [];
        let data = [];

        for (let modulo in modulos){
            let titulo = modulos[modulo].titulo
            let tituloTabla = modulos[modulo].tituloTabla

            // titulos
            añadirTextoAPdf(doc,titulo, margenRenglon, 15,"negrita",true)

            // console.log("renglonPDF para data de", modulo , renglonPDF)
            switch (modulo) {
            case "personal":

                let arrPersonal = await consultar("audi_personal");
                arrPersonal = arrPersonal.filter(objPersonal => objPersonal.auditoriaId == auditoriaNro)
                data = arrPersonal.map(res=>{ return [res.dni,res.apellido + ", " + res.nombre,res.funcionNombre,res.capacitacionNombre,res.constancia]})

                añadirTablaAPdf(doc,tituloTabla,data,"striped")
                break;

            case "obleas":
                let arrObleas = await consultar("audi_tipo_oblea");
                let arrRespOblea = await consultar("audi_oblea_respuesta")
                arrRespOblea = arrRespOblea.filter(res => res.auditoriaId == parseInt(auditoriaNro) )
                data = arrRespOblea.map(objOblea => {objOblea["tipoOblea"] = arrObleas.filter(oblea => oblea.id == objOblea.tipoObleaId)[0].nombre; return objOblea});
                data = data.map(objOblea => { return [objOblea.tipoOblea, objOblea.cantidad, objOblea.observaciones]})

                añadirTablaAPdf(doc,tituloTabla,data,"striped")

                break;

            case "crt":
                break;

            case "equipamiento":
                let arrEquipamientos = await consultar("audi_tipo_equipo");
                let arrRespEquip = await consultar("audi_equipamiento_respuesta")
                arrRespEquip = arrRespEquip.filter(res => res.auditoriaId == parseInt(auditoriaNro) )
                data = arrRespEquip.map(objEquipamiento => {objEquipamiento["tipoEquipamiento"] = arrEquipamientos.filter(equipamiento => equipamiento.id == objEquipamiento.tipoEquipamientoId)[0].nombre; return objEquipamiento});
                data = data.map(objEquipamiento => { return [objEquipamiento.tipoEquipamiento, objEquipamiento.funcionamiento, objEquipamiento.calibracion, objEquipamiento.observaciones]})

                añadirTablaAPdf(doc,tituloTabla,data,"striped")
                
                break;

            case "establecimiento":
                break;

            case "revisionTecnica":
                let arrParteVehi = await consultar("audi_tipo_parte_vehiculo");
                let arrRespRevision = await consultar("audi_revision_respuesta")
                arrRespRevision = arrRespRevision.filter(res => res.auditoriaId == parseInt(auditoriaNro) )
                data = arrRespRevision.map(objParteVehi => {
                    objParteVehi["tipoParteVehiculo"] = arrParteVehi.filter(parteVehiculo => parteVehiculo.id == objParteVehi.tipoParteVehiculoId)[0].nombre; 
                    objParteVehi["tipoParteVehiculo"] += arrParteVehi.filter(parteVehiculo => parteVehiculo.id == objParteVehi.tipoParteVehiculoId)[0].ley;
                    return objParteVehi
                });
                data = data.map(objParteVehi => { return [objParteVehi.tipoParteVehiculo, objParteVehi.respuesta, objParteVehi.observaciones]})
                
                añadirTablaAPdf(doc,tituloTabla,data,"striped")

                break;

            case "direccionTecnica":
                break;
            }

            // añadir las preguntas y observaciones de los modulos

            arrPreguntas = arrRespPreg.filter(objResp => objResp.moduloId == modulos[modulo].id).map(objResp => {return [objResp.pregunta, objResp.respuesta]});
            arrObservacion = arrModuloObs.filter(objObs => objObs.moduloId == modulos[modulo].id).map(objObs => {return [objObs.observacion]});
            
            if (arrPreguntas.length != 0) {
                // renglonPDF -= 10;
                añadirTablaAPdf(doc,["Pregunta", "Respuesta"],arrPreguntas,"grid")
            }

            if (arrObservacion.length != 0) {
                renglonPDF -= 5;
                añadirTablaAPdf(doc,["Observaciones adicionales"],arrObservacion,"plain")

            }


            // Obtiene el alto de la página actual
            var tamañoPagina =  Math.round(doc.internal.pageSize.height) ;

            // Obtiene la posición y del último elemento añadido al documento
            // var posicionUltimoElemento = doc.lastAutoTable.finalY;

            // Si se llega al final de la página, añade una nueva página al documento
            // if (y >= tamañoPagina) {
            //     doc.addPage();
            // }

            if ((tamañoPagina-renglonPDF) < 50) {
                doc.addPage();
                renglonPDF = constRenglonPDF;
            }
        }


        renglonPDF += 20;
        añadirTextoAPdf(doc,"Lugar: _________________________________", margenRenglon, 12,"normal",true)
        añadirTextoAPdf(doc,"Domicilio del TRT: _______________________", margenRenglon, 12,"normal",true)
        añadirTextoAPdf(doc,"Fecha de Auditoría: _____ de _____ de ______", margenRenglon, 12,"normal",true)

        renglonPDF += 10;
        añadirTextoAPdf(doc,"______________________", 130, 12,"normal",true)
        añadirTextoAPdf(doc,"Firma Director Técnico TRT", 130, 12,"normal",true)


        var idkey = generateUniqueId()
        let qr = new QRious({
            value: `https://micronauta.dnsalias.net/audiweb/components/auditoria/auditoriaRevision.php?idkey=${idkey}&qr=true&cc=${client}`, // La URL o el texto

            size: 200,
            backgroundAlpha: 0, // 0 para fondo transparente
            foreground: "#000000", // Color del QR
            level: "H", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
        });

        let qrCodeBase64 = qr.toDataURL();

        // Header y Footer
        // *********************************************************
        var pageCount = doc.internal.getNumberOfPages();
        for(i = 0; i < pageCount; i++) {

            doc.setPage(i);

            doc.setFontSize(13);

            let contadorHojas =  doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount
            // Obtiene el ancho del texto en puntos
            var textWidth = doc.getStringUnitWidth(contadorHojas);

            // Calcula la posición x en la que se debe mostrar el texto
            var x = (doc.internal.pageSize.width / 2) - (textWidth * 2);

            // Agrega el texto centrado en la parte inferior del PDF
            doc.text(x, doc.internal.pageSize.height - 7  , contadorHojas);

            if (i == 1) {
                doc.addImage(qrCodeBase64, "PNG", 10, 3, 35, 35);
            }

            doc.setFontSize(13);
            doc.setFontType('bold');
            doc.text('Secretaria de Servicios Publicos', doc.internal.pageSize.width - 80, 15);

            doc.setFontSize(10);
            doc.setFontType('normal');
            doc.text('Unidad Ejecutiva de Seguridad Vial', doc.internal.pageSize.width - 65, 20);

            // Agrega una imagen al PDF
            let file = await getBase64("./imagenes/mendoza.jpg")
            doc.addImage(file.data, file.type, 70, 5, 50, 20);

            doc.setFontSize(12);
            doc.setFontType('normal');
            let text = "__________________________"
            // Calcula la posición x y y del texto
            var x = doc.internal.pageSize.width  - 70;
            var y = doc.internal.pageSize.height - 10;

            // Agrega el texto al PDF
            doc.text(text, x, y);
            doc.text("Firma", x + 25, y + 5);

        }

        // *********************************************************

        // Guarda el PDF en el dispositivo del usuario
        // doc.save('mi-pdf.pdf');

        // Obtiene el PDF en formato base64
        var pdfBase64 = doc.output('datauristring');

        // var iframe = document.createElement('iframe');
        // iframe.classList.add("pdf")
        // iframe.src = pdfBase64;

        // // Agrega la etiqueta iframe a la página web
        // document.getElementById("printSection").appendChild(iframe);


        resolve({idkey:idkey, data: pdfBase64}) ;
    });

}

async function mostrarPdf(){

    let pdfBase64 = await consultar("audi_pdf",auditoriaNro)
    pdfBase64 = pdfBase64[0].data;
    // Crea una nueva etiqueta iframe y establece su contenido en el PDF en base64
    var iframe = document.createElement('iframe');
    iframe.classList.add("pdf")
    iframe.src = pdfBase64;

    // Agrega la etiqueta iframe a la página web
    document.getElementById("printSection").appendChild(iframe);

}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9) + Date.now();
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
            reader.onloadend = function() {
                 // Obtiene la extensión del archivo
                var extension = path.split('.').pop();

                var base64 = reader.result;
                resolve({ type: extension.toUpperCase(), data: reader.result });
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

function añadirTablaAPdf(pdf,titulosTabla,bodyTable,themeTable){
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

function añadirTextoAPdf(pdf,texto, posicionY, tamañoLetra,tipoLetra,sumarRenglon){
    if (tipoLetra == "negrita") tipoLetra = "bold" ;

    pdf.setFontSize(tamañoLetra);
    pdf.setFontType(tipoLetra);
    pdf.text(texto, posicionY, renglonPDF);

    if(sumarRenglon) renglonPDF += 7;

}