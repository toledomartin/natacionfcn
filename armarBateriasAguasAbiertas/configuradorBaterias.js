// =====================================================
// CONFIGURADOR DE BATERIAS - AGUAS ABIERTAS
// =====================================================

// Estado actual de las baterías en edición
let bateriasEnEdicion = [];

// Tipo de categorías aficionados seleccionado: "completa" o "reducida"
let tipoAficionados = localStorage.getItem("tipoAficionados") || "reducida";

// Grupos de categorías organizados
const gruposCategorias = {
    "categoriasNatacion": {
        nombre: "Categorias Natacion",
        categorias: [...categoriasNatacion, "ELITE NATACION"]
    },
    "categoriasAficionados": {
        nombre: "Categorias Aficionados",
        categorias: categoriasAficionados
    },
    "categoriasAficionadosReducida": {
        nombre: "Categorias Aficionados Reducida",
        categorias: categoriasAficionadosReducida
    }
};

// Función para obtener las categorías de aficionados según el tipo seleccionado
function obtenerCategoriasAficionados() {
    return tipoAficionados === "completa" ? categoriasAficionados : categoriasAficionadosReducida;
}

// Formatos predefinidos disponibles
const formatosPredefinidos = {
    "tres_baterias": tres_baterias,
    "cuatro_baterias": cuatro_baterias,
    "cinco_baterias": cinco_baterias
};

// =====================================================
// FUNCIONES DE PERSISTENCIA
// =====================================================

function cargarConfiguracionBaterias() {
    const guardado = localStorage.getItem("configuracionBaterias");
    if (guardado) {
        try {
            return JSON.parse(guardado);
        } catch (e) {
            console.error("Error al cargar configuración:", e);
        }
    }
    return clonarBaterias(tres_baterias);
}

function guardarConfiguracionBaterias(config) {
    localStorage.setItem("configuracionBaterias", JSON.stringify(config));
}

function clonarBaterias(baterias) {
    return JSON.parse(JSON.stringify(baterias));
}

// =====================================================
// EXPORTAR / IMPORTAR CONFIGURACIÓN
// =====================================================

function exportarConfiguracion() {
    const config = {
        tipoAficionados: tipoAficionados,
        baterias: bateriasEnEdicion
    };

    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracion_baterias.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importarConfiguracion() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const config = JSON.parse(event.target.result);

                if (config.tipoAficionados) {
                    tipoAficionados = config.tipoAficionados;
                    localStorage.setItem("tipoAficionados", tipoAficionados);
                    actualizarSelectorTipoAficionados();
                }

                if (config.baterias && Array.isArray(config.baterias)) {
                    bateriasEnEdicion = config.baterias;
                    renderizarEditor();
                    alert("Configuración importada correctamente");
                } else {
                    alert("El archivo no contiene una configuración válida");
                }
            } catch (error) {
                console.error("Error al importar:", error);
                alert("Error al leer el archivo. Asegúrese de que sea un JSON válido.");
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// =====================================================
// GESTIÓN DE TIPO DE AFICIONADOS
// =====================================================

function cambiarTipoAficionados(nuevoTipo) {
    if (nuevoTipo === tipoAficionados) return;

    const categoriasAntiguas = tipoAficionados === "completa" ? categoriasAficionados : categoriasAficionadosReducida;
    const categoriasNuevas = nuevoTipo === "completa" ? categoriasAficionados : categoriasAficionadosReducida;

    // Limpiar categorías incompatibles de todas las configuraciones
    let cambiosRealizados = 0;
    bateriasEnEdicion.forEach(bateria => {
        bateria.data.forEach(config => {
            if (config.categoria) {
                const categoriasOriginales = config.categoria.length;
                // Filtrar: mantener categorías de natación + ELITE + las nuevas de aficionados
                config.categoria = config.categoria.filter(cat => {
                    // Si es categoría de natación o ELITE, mantener
                    if (categoriasNatacion.includes(cat) || cat === "ELITE NATACION") {
                        return true;
                    }
                    // Si es categoría de aficionados, solo mantener si está en las nuevas
                    return categoriasNuevas.includes(cat);
                });
                cambiosRealizados += categoriasOriginales - config.categoria.length;
            }
        });
    });

    tipoAficionados = nuevoTipo;
    localStorage.setItem("tipoAficionados", tipoAficionados);

    renderizarEditor();

    if (cambiosRealizados > 0) {
        alert(`Se eliminaron ${cambiosRealizados} categorías incompatibles con el nuevo tipo de aficionados.`);
    }
}

function actualizarSelectorTipoAficionados() {
    const selector = document.getElementById("tipoAficionadosSelect");
    if (selector) {
        selector.value = tipoAficionados;
    }
}

// =====================================================
// VALIDACIÓN DE DUPLICADOS
// =====================================================

function validarDuplicados() {
    const combinaciones = new Map();
    const errores = [];

    bateriasEnEdicion.forEach((bateria, bIndex) => {
        bateria.data.forEach((config, cIndex) => {
            if (!config.nivel || !config.categoria || !config.genero) return;

            config.nivel.forEach(nivel => {
                config.categoria.forEach(categoria => {
                    config.genero.forEach(genero => {
                        const clave = `${config.distancia}-${nivel}-${categoria}-${genero}`;

                        if (combinaciones.has(clave)) {
                            const original = combinaciones.get(clave);
                            errores.push({
                                mensaje: `${config.distancia}m - ${nivel} - ${categoria} - ${genero}`,
                                ubicacion1: `Bateria ${original.bateria}, Config ${original.config}`,
                                ubicacion2: `Bateria ${bIndex + 1}, Config ${cIndex + 1}`
                            });
                        } else {
                            combinaciones.set(clave, {
                                bateria: bIndex + 1,
                                config: cIndex + 1
                            });
                        }
                    });
                });
            });
        });
    });

    return errores;
}

function mostrarErroresDuplicados(errores) {
    const container = document.getElementById("erroresDuplicados");
    if (!container) return;

    if (errores.length === 0) {
        container.classList.add("hidden");
        container.innerHTML = "";
        return;
    }

    container.classList.remove("hidden");
    container.innerHTML = `
        <h4>Se encontraron ${errores.length} configuraciones duplicadas:</h4>
        <ul>
            ${errores.map(e => `
                <li>
                    <strong>${e.mensaje}</strong><br>
                    <small>Aparece en: ${e.ubicacion1} y ${e.ubicacion2}</small>
                </li>
            `).join('')}
        </ul>
        <p><strong>Debe corregir los duplicados antes de guardar.</strong></p>
    `;
}

// =====================================================
// FUNCIONES DE RENDERIZADO
// =====================================================

function renderizarEditor() {
    const container = document.getElementById("bateriasEditor");
    if (!container) return;

    container.innerHTML = "";

    bateriasEnEdicion.forEach((bateria, index) => {
        container.appendChild(renderizarBateria(bateria, index));
    });

    // Limpiar errores al re-renderizar
    const erroresContainer = document.getElementById("erroresDuplicados");
    if (erroresContainer) {
        erroresContainer.classList.add("hidden");
    }

    // Actualizar selector de tipo de aficionados
    actualizarSelectorTipoAficionados();
}

function renderizarBateria(bateria, bateriaIndex) {
    const div = document.createElement("div");
    div.className = "bateria-card";
    div.innerHTML = `
        <div class="bateria-header">
            <h3>Bateria ${bateriaIndex + 1}</h3>
            <div class="bateria-hora">
                <label>Horario:</label>
                <input type="text"
                       value="${bateria.hora || ''}"
                       placeholder="ej: 09.30"
                       onchange="actualizarHoraBateria(${bateriaIndex}, this.value)">
            </div>
            <button class="btn-eliminar" onclick="eliminarBateria(${bateriaIndex})" title="Eliminar bateria">
                X
            </button>
        </div>
        <div class="configuraciones-container" id="configs-${bateriaIndex}">
            ${bateria.data.map((config, configIndex) =>
                renderizarConfiguracionHTML(config, bateriaIndex, configIndex)
            ).join('')}
        </div>
        <button class="btn-agregar-config" onclick="agregarConfiguracion(${bateriaIndex})">
            + Agregar Configuracion
        </button>
    `;
    return div;
}

function renderizarConfiguracionHTML(config, bateriaIndex, configIndex) {
    const nivelesSeleccionados = config.nivel || [];
    const categoriasSeleccionadas = config.categoria || [];
    const generosSeleccionados = config.genero || [];

    // Categorías de natación (incluye ELITE NATACION)
    const categoriasNatacionConElite = [...categoriasNatacion, "ELITE NATACION"];

    // Categorías de aficionados según el tipo seleccionado
    const categoriasAficionadosActual = obtenerCategoriasAficionados();

    return `
        <div class="configuracion-card" id="config-${bateriaIndex}-${configIndex}">
            <div class="config-header">
                <span>Configuracion ${configIndex + 1}</span>
                <button class="btn-eliminar-config" onclick="eliminarConfiguracion(${bateriaIndex}, ${configIndex})">
                    X
                </button>
            </div>

            <div class="config-row">
                <div class="config-field">
                    <label>Distancia (mts):</label>
                    <input type="number"
                           value="${config.distancia || ''}"
                           placeholder="ej: 1500"
                           onchange="actualizarConfiguracion(${bateriaIndex}, ${configIndex}, 'distancia', parseInt(this.value))">
                </div>
            </div>

            <div class="config-row">
                <div class="config-field">
                    <label>Niveles:</label>
                    <div class="checkbox-group">
                        ${niveles.map(nivel => `
                            <label class="checkbox-label">
                                <input type="checkbox"
                                       ${nivelesSeleccionados.includes(nivel) ? 'checked' : ''}
                                       onchange="toggleNivel(${bateriaIndex}, ${configIndex}, '${nivel}', this.checked)">
                                ${nivel}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="config-row">
                <div class="config-field">
                    <label>Generos:</label>
                    <div class="checkbox-group">
                        ${generos.map(genero => `
                            <label class="checkbox-label">
                                <input type="checkbox"
                                       ${generosSeleccionados.includes(genero) ? 'checked' : ''}
                                       onchange="toggleGenero(${bateriaIndex}, ${configIndex}, '${genero}', this.checked)">
                                ${genero}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="config-row">
                <div class="config-field categorias-section">
                    <label>Categorias:</label>

                    <!-- Botones de grupos -->
                    <div class="grupos-categorias">
                        <button type="button" class="btn-grupo"
                                onclick="seleccionarGrupo(${bateriaIndex}, ${configIndex}, 'categoriasNatacion')">
                            + Natacion
                        </button>
                        <button type="button" class="btn-grupo"
                                onclick="seleccionarGrupoAficionados(${bateriaIndex}, ${configIndex})">
                            + Aficionados
                        </button>
                        <button type="button" class="btn-limpiar"
                                onclick="deseleccionarTodasCategorias(${bateriaIndex}, ${configIndex})">
                            Limpiar
                        </button>
                    </div>

                    <!-- Grupo: Categorías Natación -->
                    <div class="categoria-grupo">
                        <div class="categoria-grupo-header">Categorias Natacion</div>
                        <div class="categorias-checkboxes" id="categorias-natacion-${bateriaIndex}-${configIndex}">
                            ${categoriasNatacionConElite.map(cat => `
                                <label class="categoria-checkbox-label">
                                    <input type="checkbox"
                                           value="${cat}"
                                           data-grupo="natacion"
                                           ${categoriasSeleccionadas.includes(cat) ? 'checked' : ''}
                                           onchange="toggleCategoria(${bateriaIndex}, ${configIndex}, '${cat}', this.checked)">
                                    ${cat}
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Grupo: Categorías Aficionados -->
                    <div class="categoria-grupo">
                        <div class="categoria-grupo-header">
                            Categorias Aficionados ${tipoAficionados === "completa" ? "(Completa)" : "(Reducida)"}
                        </div>
                        <div class="categorias-checkboxes" id="categorias-aficionados-${bateriaIndex}-${configIndex}">
                            ${categoriasAficionadosActual.map(cat => `
                                <label class="categoria-checkbox-label">
                                    <input type="checkbox"
                                           value="${cat}"
                                           data-grupo="aficionados"
                                           ${categoriasSeleccionadas.includes(cat) ? 'checked' : ''}
                                           onchange="toggleCategoria(${bateriaIndex}, ${configIndex}, '${cat}', this.checked)">
                                    ${cat}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =====================================================
// FUNCIONES DE EDICIÓN
// =====================================================

function actualizarHoraBateria(bateriaIndex, hora) {
    bateriasEnEdicion[bateriaIndex].hora = hora;
}

function actualizarConfiguracion(bateriaIndex, configIndex, campo, valor) {
    bateriasEnEdicion[bateriaIndex].data[configIndex][campo] = valor;
}

function toggleNivel(bateriaIndex, configIndex, nivel, checked) {
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];
    if (!config.nivel) config.nivel = [];

    if (checked && !config.nivel.includes(nivel)) {
        config.nivel.push(nivel);
    } else if (!checked) {
        config.nivel = config.nivel.filter(n => n !== nivel);
    }
}

function toggleGenero(bateriaIndex, configIndex, genero, checked) {
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];
    if (!config.genero) config.genero = [];

    if (checked && !config.genero.includes(genero)) {
        config.genero.push(genero);
    } else if (!checked) {
        config.genero = config.genero.filter(g => g !== genero);
    }
}

function toggleCategoria(bateriaIndex, configIndex, categoria, checked) {
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];
    if (!config.categoria) config.categoria = [];

    if (checked && !config.categoria.includes(categoria)) {
        config.categoria.push(categoria);
    } else if (!checked) {
        config.categoria = config.categoria.filter(c => c !== categoria);
    }
}

function seleccionarGrupo(bateriaIndex, configIndex, grupoKey) {
    const grupo = gruposCategorias[grupoKey];
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];
    if (!config.categoria) config.categoria = [];

    grupo.categorias.forEach(cat => {
        if (!config.categoria.includes(cat)) {
            config.categoria.push(cat);
        }
    });

    actualizarCheckboxesCategorias(bateriaIndex, configIndex);
}

function seleccionarGrupoAficionados(bateriaIndex, configIndex) {
    const categoriasAficionadosActual = obtenerCategoriasAficionados();
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];
    if (!config.categoria) config.categoria = [];

    categoriasAficionadosActual.forEach(cat => {
        if (!config.categoria.includes(cat)) {
            config.categoria.push(cat);
        }
    });

    actualizarCheckboxesCategorias(bateriaIndex, configIndex);
}

function deseleccionarTodasCategorias(bateriaIndex, configIndex) {
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];
    config.categoria = [];

    actualizarCheckboxesCategorias(bateriaIndex, configIndex);
}

function actualizarCheckboxesCategorias(bateriaIndex, configIndex) {
    const config = bateriasEnEdicion[bateriaIndex].data[configIndex];

    // Actualizar checkboxes de natación
    const containerNatacion = document.getElementById(`categorias-natacion-${bateriaIndex}-${configIndex}`);
    if (containerNatacion) {
        const checkboxes = containerNatacion.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = config.categoria.includes(checkbox.value);
        });
    }

    // Actualizar checkboxes de aficionados
    const containerAficionados = document.getElementById(`categorias-aficionados-${bateriaIndex}-${configIndex}`);
    if (containerAficionados) {
        const checkboxes = containerAficionados.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = config.categoria.includes(checkbox.value);
        });
    }
}

// =====================================================
// FUNCIONES DE AGREGAR/ELIMINAR
// =====================================================

function agregarBateria() {
    bateriasEnEdicion.push({
        hora: "",
        data: [{
            distancia: 0,
            nivel: [],
            categoria: [],
            genero: ["FEMENINO", "MASCULINO"]
        }]
    });
    renderizarEditor();
}

function eliminarBateria(index) {
    if (bateriasEnEdicion.length <= 1) {
        alert("Debe haber al menos una bateria");
        return;
    }
    if (confirm(`¿Eliminar Bateria ${index + 1}?`)) {
        bateriasEnEdicion.splice(index, 1);
        renderizarEditor();
    }
}

function agregarConfiguracion(bateriaIndex) {
    bateriasEnEdicion[bateriaIndex].data.push({
        distancia: 0,
        nivel: [],
        categoria: [],
        genero: ["FEMENINO", "MASCULINO"]
    });
    renderizarEditor();
}

function eliminarConfiguracion(bateriaIndex, configIndex) {
    const bateria = bateriasEnEdicion[bateriaIndex];
    if (bateria.data.length <= 1) {
        alert("Cada bateria debe tener al menos una configuracion");
        return;
    }
    if (confirm(`¿Eliminar Configuracion ${configIndex + 1}?`)) {
        bateria.data.splice(configIndex, 1);
        renderizarEditor();
    }
}

// =====================================================
// FUNCIONES DE FORMATO PREDEFINIDO
// =====================================================

function cargarFormatoPredefinido(nombreFormato) {
    const formato = formatosPredefinidos[nombreFormato];
    if (formato) {
        bateriasEnEdicion = clonarBaterias(formato);
        renderizarEditor();
    }
}

// =====================================================
// FUNCIONES DE GUARDADO Y RESET
// =====================================================

function guardarConfiguracion() {
    // Primero validar campos básicos
    for (let i = 0; i < bateriasEnEdicion.length; i++) {
        const bateria = bateriasEnEdicion[i];
        if (!bateria.hora) {
            alert(`La Bateria ${i + 1} no tiene horario definido`);
            return;
        }
        for (let j = 0; j < bateria.data.length; j++) {
            const config = bateria.data[j];
            if (!config.distancia || config.distancia <= 0) {
                alert(`La Configuracion ${j + 1} de la Bateria ${i + 1} no tiene distancia valida`);
                return;
            }
            if (!config.nivel || config.nivel.length === 0) {
                alert(`La Configuracion ${j + 1} de la Bateria ${i + 1} no tiene niveles seleccionados`);
                return;
            }
            if (!config.categoria || config.categoria.length === 0) {
                alert(`La Configuracion ${j + 1} de la Bateria ${i + 1} no tiene categorias seleccionadas`);
                return;
            }
            if (!config.genero || config.genero.length === 0) {
                alert(`La Configuracion ${j + 1} de la Bateria ${i + 1} no tiene generos seleccionados`);
                return;
            }
        }
    }

    // Validar duplicados
    const errores = validarDuplicados();
    if (errores.length > 0) {
        mostrarErroresDuplicados(errores);
        alert(`Se encontraron ${errores.length} configuraciones duplicadas. Debe corregirlas antes de guardar.`);
        return;
    }

    guardarConfiguracionBaterias(bateriasEnEdicion);
    localStorage.setItem("tipoAficionados", tipoAficionados);
    mostrarErroresDuplicados([]);
    alert("Configuracion guardada correctamente");
}

function resetearConfiguracion() {
    if (confirm("¿Resetear la configuracion a los valores por defecto? Se perderan los cambios guardados.")) {
        localStorage.removeItem("configuracionBaterias");
        localStorage.removeItem("tipoAficionados");
        tipoAficionados = "reducida";
        bateriasEnEdicion = clonarBaterias(tres_baterias);
        renderizarEditor();
        alert("Configuracion reseteada");
    }
}

// =====================================================
// INICIALIZACIÓN
// =====================================================

function inicializarConfigurador() {
    // Cargar tipo de aficionados
    tipoAficionados = localStorage.getItem("tipoAficionados") || "reducida";

    // Cargar configuración guardada o usar default
    bateriasEnEdicion = cargarConfiguracionBaterias();

    // Renderizar el editor
    renderizarEditor();

    // Configurar evento del selector de tipo de aficionados
    const tipoAficionadosSelect = document.getElementById("tipoAficionadosSelect");
    if (tipoAficionadosSelect) {
        tipoAficionadosSelect.value = tipoAficionados;
        tipoAficionadosSelect.addEventListener("change", (e) => {
            cambiarTipoAficionados(e.target.value);
        });
    }

    // Configurar eventos de los botones
    const btnCargarFormato = document.getElementById("btnCargarFormato");
    if (btnCargarFormato) {
        btnCargarFormato.addEventListener("click", () => {
            const select = document.getElementById("formatoPredefinido");
            if (select.value) {
                cargarFormatoPredefinido(select.value);
            } else {
                alert("Seleccione un formato predefinido");
            }
        });
    }

    const btnAgregarBateria = document.getElementById("btnAgregarBateria");
    if (btnAgregarBateria) {
        btnAgregarBateria.addEventListener("click", agregarBateria);
    }

    const btnGuardarConfiguracion = document.getElementById("btnGuardarConfiguracion");
    if (btnGuardarConfiguracion) {
        btnGuardarConfiguracion.addEventListener("click", guardarConfiguracion);
    }

    const btnResetearConfiguracion = document.getElementById("btnResetearConfiguracion");
    if (btnResetearConfiguracion) {
        btnResetearConfiguracion.addEventListener("click", resetearConfiguracion);
    }

    const btnExportarConfig = document.getElementById("btnExportarConfig");
    if (btnExportarConfig) {
        btnExportarConfig.addEventListener("click", exportarConfiguracion);
    }

    const btnImportarConfig = document.getElementById("btnImportarConfig");
    if (btnImportarConfig) {
        btnImportarConfig.addEventListener("click", importarConfiguracion);
    }
}

// Función para obtener las baterías actuales (usada por script.js)
function obtenerBateriasConfiguradas() {
    const guardado = localStorage.getItem("configuracionBaterias");
    if (guardado) {
        try {
            return JSON.parse(guardado);
        } catch (e) {
            console.error("Error al obtener baterías configuradas:", e);
        }
    }
    return tres_baterias;
}
