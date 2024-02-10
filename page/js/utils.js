function loadHTMLFile(filePath) {
    return fetch(filePath)
        .then(response => response.text());
}

function convertirTextoAHTML(texto) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(texto, 'text/html');
    return doc.body;
}

function obtenerContextoAlrededorDePalabra(texto, palabraBuscada) {
    const cantidadCaracteres = 15;
    // Convertir el texto y la palabra buscada a minúsculas para hacer la búsqueda sin distinción de mayúsculas y minúsculas
    var textoEnMinusculas = texto.toLowerCase();
    var palabraBuscadaEnMinusculas = palabraBuscada.toLowerCase();

    // Buscar la posición de la palabra buscada en el texto
    var posicionPalabra = textoEnMinusculas.indexOf(palabraBuscadaEnMinusculas);

    // Verificar si la palabra se encontró
    if (posicionPalabra !== -1) {
        // Obtener cantidadCaracteres caracteres antes y cantidadCaracteres después de la palabra
        var contextoInicio = Math.max(0, posicionPalabra - cantidadCaracteres);
        var contextoFin = Math.min(texto.length, posicionPalabra + palabraBuscada.length + cantidadCaracteres);

        // Extraer el contexto
        var contexto = texto.substring(contextoInicio, contextoFin);

        return `... ${contexto} ...`;
    }

}


// Función para buscar elementos que contienen cierto texto
function buscarElementosConTexto(html, texto) {
    var elementos = html.querySelectorAll('*'); // Obtener todos los elementos

    var elementosCoincidentes = [];

    elementos.forEach(function (elemento) {
        // Verificar si el elemento contiene texto directo y no tiene elementos hijos
        if (elemento.childNodes.length === 1 && elemento.firstChild.nodeType === Node.TEXT_NODE) {
            // Verificar si el texto está presente en el contenido del elemento
            var contenidoElemento = elemento.textContent.toLowerCase();
            var expresionRegular = new RegExp(texto.toLowerCase(), 'g');

            if (expresionRegular.test(contenidoElemento)) {
                elementosCoincidentes.push(obtenerContextoAlrededorDePalabra(elemento.innerHTML,
                    texto));
            }
        }
    });

    return elementosCoincidentes;
}


function searchInHTMLFile(content, searchTerm) {
    // Convertir a minúsculas para hacer la búsqueda sin distinción entre mayúsculas y minúsculas
    var lowerCaseContent = content.toLowerCase();

    let html = convertirTextoAHTML(content)
    let coincidencias = buscarElementosConTexto(html.querySelector(".page"), searchTerm)

    return coincidencias
}


function displaySearchResults(searchTerm) {
    var filePaths = ['about-us.html', 'index.html'];

    var promises = filePaths.map(filePath => loadHTMLFile(filePath));

    // Retornar la promesa resultante de Promise.all
    return Promise.all(promises)
        .then(contents => {
            let results = [];

            contents.forEach((content, index) => {
                let coincidencias = searchInHTMLFile(content, searchTerm);

                coincidencias.forEach(coincidencia => {
                    let res = {
                        title: filePaths[index],
                        content: coincidencia,
                        url: filePaths[index]
                    };

                    results.push(res);
                });
            });

            return results; // Retornar los resultados después de procesar los archivos HTML
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Propagar el error para que pueda ser manejado en la llamada externa
        });
}


function createHtmlSearchResults(results) {
    // Crear los elementos HTML dinámicamente
    let searchResultsDiv = document.createElement('div');
    searchResultsDiv.id = 'search-results';

    let quickResultDiv = document.createElement('div');
    quickResultDiv.className = 'search-quick-result';
    quickResultDiv.textContent = 'Quick Results';

    let olElement = document.createElement('ol');
    olElement.className = 'search-list';

    results.forEach(result => {
        let liElement = document.createElement('li');
        liElement.className = 'search-list-item';

        let h5Element = document.createElement('h5');
        h5Element.className = 'search-title';

        let aElement = document.createElement('a');
        aElement.target = '_top';
        aElement.href = result.url;
        aElement.className = 'search-link';
        aElement.textContent = result.title;

        h5Element.appendChild(aElement);

        let pContentElement = document.createElement('p');
        pContentElement.textContent = result.content + '.';

        let pMatchElement = document.createElement('p');
        pMatchElement.className = 'match';
        pMatchElement.innerHTML = '<em>Terms matched: 2 - URL: ' + result.url + '</em>';

        liElement.appendChild(h5Element);
        liElement.appendChild(pContentElement);
        liElement.appendChild(pMatchElement);

        olElement.appendChild(liElement);
    });

    // Agregar los elementos al documento
    searchResultsDiv.appendChild(quickResultDiv);
    searchResultsDiv.appendChild(olElement);


    return searchResultsDiv

}


function cargarGaleria({
    idContainer,
    imageName
}) {

    let container = document.getElementById(idContainer)

    for (let i = 1; i <= 10; i++) {
        const imagePath = `images/galeria/${imageName} (${i}).jpg`;

        let galeriaHTML = `
        <div class="col-sm-6 col-lg-4 col-xl-3 isotope-item">
            <article class="thumbnail-classic">
                <div class="thumbnail-classic-figure">
                    <img src="${imagePath}" alt="" width="270" height="250" />
                </div>
                <div class="thumbnail-classic-caption">
                    <div>
                        <h5 class="thumbnail-classic-title"><a href="#">Ver fotos</a></h5>
                        <div class="thumbnail-classic-button-wrap">
                            <div class="thumbnail-classic-button">
                                <a class="button button-primary-2 button-zakaria fl-bigmug-line-search74"
                                    href="${imagePath}"
                                    data-lightgallery="item">
                                    <img src="${imagePath}" alt="" width="270"
                                        height="250" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
        `;

        container.innerHTML += galeriaHTML;

    }

}



function cargarGrillaGaleria({
    idContainer,
    imageName
}) {

    let container = document.getElementById(idContainer)

    let type = 1;

    for (let i = 1; i <= 10; i++) {
        const imagePath = `images/galeria/${imageName} (${i}).jpg`;

        let galeriaHTML = `
        <div class="col-sm-6 col-lg-4 isotope-item" data-filter="Type ${type}">
            <article class="thumbnail-classic">
                <div class="thumbnail-classic-figure">
                    <img src="${imagePath}" alt="" width="370" height="315" />
                </div>
                <div class="thumbnail-classic-caption">
                    <div>
                        <h5 class="thumbnail-classic-title">
                            <a href="#">Ver imagenes</a>
                        </h5>
                        <div class="thumbnail-classic-button-wrap">
                            <div class="thumbnail-classic-button">
                                <a class="button button-primary-2 button-zakaria fl-bigmug-line-search74"  href="${imagePath}" data-lightgallery="item">
                                    <img src="${imagePath}" alt="" width="370" height="315" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
        `;

        container.innerHTML += galeriaHTML;

        type = type == 1 ? 2 : 1;

    }

}

function cargarGaleriaFooter({
    idContainer,
    imageName
}) {

    let container = document.getElementById(idContainer)

    for (let i = 1; i <= 6; i++) {
        const imagePath = `images/galeria/${imageName} (${i}).jpg`;

        let galeriaHTML = `
        <div class="col-4 col-sm-2 col-lg-4">
            <a class="thumbnail-minimal" href="${imagePath}" data-lightgallery="item">
                <img src="${imagePath}" alt="" width="93" height="93" />
            </a>
        </div>
        `;

        container.innerHTML += galeriaHTML;

    }

}

async function cargarHeader() {
    var filePaths = ['header.html'];

    var promises = filePaths.map(filePath => loadHTMLFile(filePath));

    // Retornar la promesa resultante de Promise.all
    return Promise.all(promises)
        .then(contents => {
            let header = convertirTextoAHTML(contents)

            document.querySelector("header").innerHTML = header.querySelector("header").innerHTML
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Propagar el error para que pueda ser manejado en la llamada externa
        });
}


function obtenerParametroDeURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
  }