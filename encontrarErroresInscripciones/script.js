const cantidadMaxInscripciones = 6;
var nadadoresEncontrados = [];

function obtenerErroresInscripcion(){
    listadoNadadores
    .split("Natatorio")
    .filter(data => data != "\n").filter(data => data != ",\n")
    .forEach(nadador => {
        let swimmer = {};
        let pruebasAux = [];
        let pruebas = [];
        let pruebasSinRelevo = [];


        let swimmerData =  nadador.split(",")

        swimmerData.forEach((nadadorData,index) => {
            if(nadadorData.includes("Edad")){
                swimmer.info = swimmerData[index-1] + nadadorData
            }
            if(nadadorData.includes("#")){
            
                // let aux = nadadorData.replaceAll("$","").split(" ")
                let aux = nadadorData.slice(1).slice(0, nadadorData.length - 2).split(" ")
         

                if(aux[aux.length-1].includes("(")){
                    aux.splice(-1,1);
                }
                pruebasAux.push(aux.pop().substr(0,8))
                // pruebas.push(nadadorData.replaceAll("$",""))
                let prueba = nadadorData.slice(1).slice(0, nadadorData.length - 2)
                pruebas.push(prueba)
                
                if (!prueba.includes("Relevo")) {
                    pruebasSinRelevo.push(prueba)
                }
            }

        });
        pruebasAux = pruebasAux.filter((item,index) => pruebasAux.indexOf(item) === index);
    
        if (pruebasAux.length != 1 || pruebasSinRelevo.length > cantidadMaxInscripciones || pruebasSinRelevo.length == 0 ) {
            swimmer.pruebas = pruebas
            nadadoresEncontrados.push(swimmer)
        }


    });

    mostrarInfo();
}

function mostrarInfo(){
    let resultados = document.getElementById("resultados")
    nadadoresEncontrados.forEach(nadador => {
        let nombre = document.createElement("h3")
        nombre.innerHTML = nadador.info
        resultados.appendChild(nombre);

        nadador.pruebas.forEach(prueba => {

            let aux = prueba.split(" ")

            if(aux[aux.length-1].includes("(")){
                aux.splice(-1,1);
            }
            let colorText = aux.pop().substr(0,1)

            let prueb = document.createElement("p")
            prueb.innerHTML = prueba
            prueb.setAttribute("class",colorText)
            resultados.appendChild(prueb);

        });
    });

}

obtenerErroresInscripcion()
