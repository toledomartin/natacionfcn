const eventos = [{
        id: "almafuerte_2024",
        fecha: "3 de Febrero, 2024",
        titulo: "ALMAFUERTE 2024",
        subtitulo: "Campeonato oficial de Aguas Abiertas",
        portada: "almafuerte_2024.jpg",
        reglamento: "https://drive.google.com/file/d/1KA6pC9SfmFxG6bEtPp0S-2kYWCxkIZm3/view?usp=drive_link",
        contenido: `De nuestra mayor consideración: 
        </br>
        </br>
        Tenemos el agrado de dirigirnos a Ud. y por su digno intermedio al Honorable Consejo Directivo de esa prestigiosa Institución, a los fines de hacerles llegar la documentación correspondiente al tradicional evento de Aguas Abiertas, denominado Maratón de Aguas Abiertas “ALMAFUERTE 2024”, el cual está reservado para nadadores de los niveles Federados y Aficionados y es la Segunda Prueba del Campeonato Interprovincial de Aguas Abiertas “SR. NESTOR HUGO BURGOS”.
        Este evento, se llevará a cabo el día Sábado 3 de febrero, a partir de las 09.30 hs, en el dique Piedras Moras,
        </br>
        </br>
        Sin otro particular y esperando la grata visita de vuestros representantes, hacemos propicia la oportunidad para saludar a Ud., con nuestras mejores expresiones de cordialidad y estima. -`
    },
    {
        id: "boca_de_rio_2024",
        fecha: "17 de Febrero, 2024",
        titulo: "BOCA DE RIO 2024",
        subtitulo: "Campeonato oficial de Aguas Abiertas",
        portada: "boca_de_rio_2024.jpg",
        reglamento: "https://drive.google.com/file/d/19MRcDWCqMvHn6R0caqyhz3V61QioxPpw/view?usp=drive_link",
        contenido: `De nuestra mayor consideración: 
        </br>
        </br>
        Tenemos el agrado de dirigirnos a Ud. y por su digno
        intermedio al Honorable Consejo Directivo de esa prestigiosa Institución, a los fines de
        hacerles llegar la documentación correspondiente al tradicional evento de Aguas Abiertas,
        denominado VIII Maratón de Aguas Abiertas “Boca de Río”, el cual está reservado para
        nadadores de los niveles Federados y Aficionados, considerada la 3° Fecha del Campeonato
        Interprovincial de Aguas Abiertas 2024 “SR. NESTOR HUGO BURGOS”.
        </br>
        </br>
        Este evento, se llevará a cabo el día Sábado 17 de
        febrero, a partir de las 12.00 hs, en el lago-Camping Boca del Río, en un todo de acuerdo al
        protocolo de competencias y así también de lo que establece el Protocolo de balneario y
        playas para concurrentes.
        </br>
        </br>
        Sin otro particular y esperando la grata visita de vuestros representantes, hacemos propicia la oportunidad para saludar a Ud., con nuestras mejores expresiones de cordialidad y estima. -`
    },
    {
        id: "federalisimo_2024",
        fecha: "3 de Febrero, 2024",
        titulo: "FEDERALISIMO 2024",
        subtitulo: "Torneo provincial de natación Escuela G1 y G2",
        portada: "federalisimo_2024.jpg",
        reglamento: "https://drive.google.com/file/d/1ngA9eK6j92rJ5MCZXKPZmCvyH_6NS0kB/view?usp=drive_link",
        contenido: `De nuestra mayor consideración: 
        </br>
        </br>
        Tenemos el agrado de dirigirnos a Uds. a los efectos de
        adjuntar documentación correspondiente a la 6° Edición del Torneo Provincial de Natación
        “FEDERALÍSIMO”, organizado por nuestra entidad y reservado para nadadores de ambos
        sexos y del nivel Promocionales Escuela (Grupos 1 y 2), a llevarse a cabo el día 24 de febrero
        de 2024, en la piscina Georgina Bardach, de 50 metros del CARD (Estadio Mario A. Kempes),
        de esta ciudad Capital
        </br>
        </br>
        Sin otro particular y esperando la grata visita de vuestros representantes, hacemos propicia la oportunidad para saludar a Ud., con nuestras mejores expresiones de cordialidad y estima. -`
    },


];



function cargarEventos({
    idContainer = false,
    containerArticle = true,
    maxEventos = false,
    largeContainer = false,
    except = [],
}) {

    var events = eventos;

    if (maxEventos) {
        events = eventos.slice(0, maxEventos);
    }

    events = events.filter(evento => !except.includes(evento.id));

    let arrEventos = [];

    events.forEach((evento, index) => {

        let containerElement = document.createElement("div");
        containerElement.classList.add("col-sm-6")

        if (!largeContainer) {
            containerElement.classList.add("col-lg-4")
        }


        let article = document.createElement("article");
        article.classList.add("post", "post-classic", "box-md")

        let htmlEvento = `
            <a class="post-classic-figure" href="blog-post.html?id=${evento.id}">
                <img src="images/eventos/${evento.portada}" alt="" width="370" height="239"/>
            </a>
            <div class="post-classic-content">
                <div class="post-classic-time">
                    <time datetime="2021-08-09">${evento.fecha}</time>
                </div>
                <h5 class="post-classic-title text-spacing-0">
                    <a href="blog-post.html?id=${evento.id}">${evento.titulo}</a>
                </h5>
                <p class="post-classic-text font-fourth">${evento.subtitulo}</p>
            </div>
        `;

        article.innerHTML = htmlEvento;




        if (containerArticle) {
            containerElement.appendChild(article);
            arrEventos.push(containerElement)
        } else {
            arrEventos.push(article)
        }


        if (idContainer) {

            let container = document.getElementById(idContainer)

            if (containerArticle) {
                container.appendChild(containerElement);
            } else {
                container.appendChild(article);
            }
        }

    });

    return arrEventos;
}


function cargarListadoEventos({
    idContainer = false,
    containerArticle = true,
    maxEventos = false,
    except = [],
}) {

    var events = eventos;

    if (maxEventos) {
        events = eventos.slice(0, maxEventos);
    }

    events = events.filter(evento => !except.includes(evento.id));

    let arrEventos = [];

    events.forEach((evento, index) => {

        let containerElement = document.createElement("div");
        containerElement.classList.add("col-12")


        let article = document.createElement("article");
        article.classList.add("post", "post-modern", "box-xxl")

        let htmlEvento = `
        <div class="post-modern-panel">
            <div><a class="post-modern-tag" href="#">Natación</a></div>
            <div>
            <time class="post-modern-time" datetime="2021-08-09">${evento.fecha}</time>
            </div>
        </div>
        <h3 class="post-modern-title">
            <a href="blog-post.html">
                ${evento.titulo}
            </a>
        </h3>
        <a class="post-modern-figure" href="blog-post.html">
            <img src="images/eventos/${evento.portada}" alt="" width="800" height="394"/>
        </a>
        <p class="post-modern-text">
            ${evento.subtitulo}
        </p>
        <a class="post-modern-link"  href="blog-post.html?id=${evento.id}">Mas información</a>
        `;

        article.innerHTML = htmlEvento;


        if (containerArticle) {
            containerElement.appendChild(article);
            arrEventos.push(containerElement)
        } else {
            arrEventos.push(article)
        }

        if (idContainer) {

            let container = document.getElementById(idContainer)

            if (containerArticle) {
                container.appendChild(containerElement);
            } else {
                container.appendChild(article);
            }
        }

    });

    return arrEventos;
}