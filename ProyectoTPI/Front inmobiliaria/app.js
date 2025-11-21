
    // Buscador
    const API_BASE_URL = "https://localhost:7098/api/Inquilino/Buscador";
    const DASHBOARD_BASE = "https://localhost:7098/api/Dashboard";

    // Altas
    const API_CONTRATOS_SIMPLE = "https://localhost:7098/api/Contrato/Simple";
    const API_INQUILINOS_SIMPLE = "https://localhost:7098/api/Inquilino/Simple";
    const API_PROPIETARIOS_SIMPLE = "https://localhost:7098/api/Propietario/Simple";
    const API_RECIBOS_SIMPLE = "https://localhost:7098/api/Recibo/Simple";
    const API_LIQUIDACIONES_SIMPLE = "https://localhost:7098/api/Liquidacion/Simple";
    const API_INQUILINO_BASE = "https://localhost:7098/api/Inquilino";
    const API_PROPIETARIO_BASE = "https://localhost:7098/api/Propietario";
    const API_CONTRATO_BASE = "https://localhost:7098/api/Contrato";



    // Endpoints para CRUD --  listado de inquilinos
    const API_INQUILINOS_TODOS = `${API_INQUILINO_BASE}/Todos`;

    // ======================================================
    //  BUSCADOR
    // ======================================================

    const inputTexto = document.getElementById("textoBuscado");
    const selectTabla = document.getElementById("tabla");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultadosContainer = document.getElementById("resultados-container");
    
const btnGuardarInquilino = document.getElementById("btn-guardar-inquilino");


    // Acciones en la tabla de resultados del buscador (Inquilinos)
    if (resultadosContainer) {
        resultadosContainer.addEventListener("click", async (e) => {

            // --- CONTRATOS ---
    const btnEliminarContrato = e.target.closest("[data-eliminar-contrato]");
    if (btnEliminarContrato) {
        const id = btnEliminarContrato.getAttribute("data-eliminar-contrato");
        await eliminarContrato(id);
        await manejarBusqueda();
        return;
    }

    async function eliminarContrato(id) {
        if (!confirm("¿Seguro que querés eliminar este contrato?")) return;

        try {
            const resp = await fetch(`${API_CONTRATO_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`HTTP ${resp.status}: ${txt}`);
            }

            alert("Contrato eliminado correctamente.");

            // para referenciar dashboard
            if (typeof cargarDashboard === "function") {
                await cargarDashboard();
            }
        } catch (err) {
            console.error("Error eliminando contrato:", err);
            //alert("Error al eliminar contrato. Revisá consola para más detalle.");
        }
    }


    const btnEditarContrato = e.target.closest("[data-editar-contrato]");
    if (btnEditarContrato) {
        const id = btnEditarContrato.getAttribute("data-editar-contrato");

        alert(`Edición de contrato ${id} aún no está implementada.`);
        return;
    }

            // --- INQUILINOS ---
            const btnEliminarInq = e.target.closest("[data-eliminar-inq]");
            if (btnEliminarInq) {
                const id = btnEliminarInq.getAttribute("data-eliminar-inq");
                await eliminarInquilino(id);
                await manejarBusqueda();
                return;
            }

            const btnEditarInq = e.target.closest("[data-editar-inq]");
            if (btnEditarInq) {
                abrirModalInquilinoEdicion({
                    id: btnEditarInq.dataset.editarInq,
                    nombre: btnEditarInq.dataset.nombre,
                    apellido: btnEditarInq.dataset.apellido,
                    telefono: btnEditarInq.dataset.telefono,
                    mail: btnEditarInq.dataset.mail
                });
                return;
            }

            // --- PROPIETARIOS ---
            const btnEliminarProp = e.target.closest("[data-eliminar-prop]");
            if (btnEliminarProp) {
                const id = btnEliminarProp.getAttribute("data-eliminar-prop");
                await eliminarPropietario(id);
                await manejarBusqueda();
                return;
            }

            const btnEditarProp = e.target.closest("[data-editar-prop]");
            if (btnEditarProp) {
                abrirModalPropietarioEdicion({
                    id: btnEditarProp.dataset.editarProp,
                    nombre: btnEditarProp.dataset.nombre,
                    apellido: btnEditarProp.dataset.apellido,
                    telefono: btnEditarProp.dataset.telefono,
                    mail: btnEditarProp.dataset.mail
                });
                return;
            }

            // --- INMUEBLES ---
            const btnEliminarInm = e.target.closest("[data-eliminar-inmueble]");
            if (btnEliminarInm) {
                const id = btnEliminarInm.getAttribute("data-eliminar-inmueble");
                await eliminarInmueble(id);
                await manejarBusqueda();
                return;
            }

            const btnEditarInm = e.target.closest("[data-editar-inmueble]");
    if (btnEditarInm) {
        abrirModalInmuebleEdicion({
            id: btnEditarInm.dataset.editarInmueble,
            nombre: btnEditarInm.dataset.nombre,
            descripcion: btnEditarInm.dataset.descripcion,
            propietario: btnEditarInm.dataset.propietario,
            precioAlq: btnEditarInm.dataset.precioalq,
            precioVenta: btnEditarInm.dataset.precioventa
        });
        return;
    }
    });  
    }    
    function abrirModalInmuebleEdicion(data) {
        const { id, nombre, descripcion, propietario, precioAlq, precioVenta } = data;

        const form = document.getElementById("form-inmueble");

        form.dataset.modo = "editar";
        form.dataset.id = id;

        document.getElementById("titulo-modal-inmueble").textContent =
            "Editar inmueble";

        document.getElementById("inm-nombre").value = nombre || "";
        document.getElementById("inm-descripcion").value = descripcion || "";
        document.getElementById("inm-propietario").value = propietario || "";
        document.getElementById("inm-precio-alquiler").value = precioAlq || "";
        document.getElementById("inm-precio-venta").value = precioVenta || "";

        abrirModal(document.getElementById("modal-inmueble"));
    }
    const formInmueble = document.getElementById("form-inmueble");

    if (formInmueble) {
        formInmueble.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = formInmueble.dataset.id;

            const dto = {
                nombreInmueble: document.getElementById("inm-nombre").value.trim(),
                descripcion: document.getElementById("inm-descripcion").value.trim(),
                propietario: document.getElementById("inm-propietario").value.trim(),
                precioAlquiler: Number(document.getElementById("inm-precio-alquiler").value),
                precioVenta: Number(document.getElementById("inm-precio-venta").value)
            };

            try {
                const resp = await fetch(`${API_INMUEBLE_BASE}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);

                alert("Inmueble actualizado correctamente.");

                cerrarModal(document.getElementById("modal-inmueble"));

                // refrescar tabla o buscador
                if (
                    selectTabla.value === "Inmuebles" &&
                    inputTexto.value.trim().length > 0
                ) {
                    manejarBusqueda();
                }
            } catch (err) {
                console.error("Error editando inmueble:", err);
                alert("Error al editar inmueble.");
            }
        });
    }


    if (btnBuscar) {
        btnBuscar.addEventListener("click", manejarBusqueda);
    }async function manejarBusqueda() {
        const textoBuscado = inputTexto.value.trim();
        const tablaSeleccionada = selectTabla.value;

        if (!textoBuscado) {
            alert("Por favor, introduce un texto para buscar.");
            return;
        }

        const url = `${API_BASE_URL}?texto=${encodeURIComponent(
            textoBuscado
        )}&tabla=${encodeURIComponent(tablaSeleccionada)}`;

        resultadosContainer.innerHTML = "<p>Cargando resultados...</p>";

        try {
            const respuesta = await fetch(url);

            if (!respuesta.ok) {
                const errorData = await respuesta
                    .json()
                    .catch(() => ({ Mensaje: `Error ${respuesta.status}` }));
                throw new Error(errorData.Mensaje || `Error en la API: Código ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            if (tablaSeleccionada === "Inquilinos") {
        renderizarResultadosInquilinos(datos);
    } else if (tablaSeleccionada === "Propietarios") {
        renderizarResultadosPropietarios(datos);
    } else if (tablaSeleccionada === "Inmuebles") {
        renderizarResultadosInmuebles(datos);
    } else if (tablaSeleccionada === "Contratos") {
        renderizarResultadosContratos(datos);   
    } else {
        renderizarResultados(datos, tablaSeleccionada);
    }

        } catch (error) {
            console.error("Fallo en la comunicación con la API:", error);
            resultadosContainer.innerHTML = `<p class="error">⚠️ Error de búsqueda: ${error.message}. Asegúrate que el backend C# esté corriendo.</p>`;
        }
    }

function prepararModalInquilinoParaCrear() {
    if (!formInquilino || !modalInquilino) return;

    formInquilino.dataset.modo = "crear";
    delete formInquilino.dataset.id;

    const titulo = modalInquilino.querySelector("h2");
    if (titulo) titulo.textContent = "Nuevo inquilino";

    if (btnGuardarInquilino)
        btnGuardarInquilino.textContent = "Crear inquilino";

    formInquilino.reset();
}
function abrirModalInquilinoEdicion({ id, nombre, apellido, telefono, mail }) {
    if (!formInquilino || !modalInquilino) return;

    formInquilino.dataset.modo = "editar";
    formInquilino.dataset.id = id;

    const titulo = modalInquilino.querySelector("h2");
    if (titulo) titulo.textContent = "Editar inquilino";

    if (btnGuardarInquilino)
        btnGuardarInquilino.textContent = "Guardar cambios";

    document.getElementById("inq-nombre").value = nombre ?? "";
    document.getElementById("inq-apellido").value = apellido ?? "";
    document.getElementById("inq-telefono").value = telefono ?? "";
    document.getElementById("inq-mail").value = mail ?? "";

    abrirModal(modalInquilino);
}

    function renderizarResultadosContratos(datos) {
        if (!resultadosContainer) return;

        if (!Array.isArray(datos) || datos.length === 0) {
            resultadosContainer.innerHTML = `
                <p>No se encontraron coincidencias en la tabla <strong>Contratos</strong>.</p>`;
            return;
        }

        let html = `<h3>${datos.length} resultados encontrados en Contratos</h3>`;
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Id contrato</th>
                        <th>Nombre Propietario</th>
                        <th>Apellido Propietario</th>
                        <th>Nombre Inquilino</th>
                        <th>Apellido Inquilino</th>
                        <th>Nombre inmueble</th>
                        <th style="width: 140px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        datos.forEach(row => {
            const idContrato =
                row.Id_contrato ?? row.ID_Contrato ?? row.idContrato ?? row.id ?? "-";

            const nombreProp =
                row.Nombre_Propietario ?? row.nombrePropietario ?? row.NombrePropietario ?? "";

            const apellidoProp =
                row.Apellido_Propietario ?? row.apellidoPropietario ?? row.ApellidoPropietario ?? "";

            const nombreInq =
                row.Nombre_Inquilino ?? row.nombreInquilino ?? row.NombreInquilino ?? "";

            const apellidoInq =
                row.Apellido_Inquilino ?? row.apellidoInquilino ?? row.ApellidoInquilino ?? "";

            const nombreInm =
                row.Nombre_Inmueble ?? row.nombre_Inmueble ?? row.nombreInmueble ?? "";

            html += `
                <tr>
                    <td>${idContrato}</td>
                    <td>${nombreProp}</td>
                    <td>${apellidoProp}</td>
                    <td>${nombreInq}</td>
                    <td>${apellidoInq}</td>
                    <td>${nombreInm}</td>
                    <td>
                        <button
                            class="btn-secondary btn-sm"
                            data-editar-contrato="${idContrato}">
                            Editar
                        </button>
                        <button
                            class="btn-primary btn-sm"
                            data-eliminar-contrato="${idContrato}">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        resultadosContainer.innerHTML = html;
    }

    function renderizarInquilinosEnTabla(datos) {
        const tbody = document.getElementById("tabla-inquilinos-body");
        if (!tbody) return;

        if (!Array.isArray(datos) || datos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">No se encontraron inquilinos.</td>
                </tr>`;
            return;
        }

        tbody.innerHTML = "";

        datos.forEach(row => {
            const id = row.idInquilino ?? row.ID_Inquilino ?? row.id ?? "-";
            const nombre = row.nombre ?? row.Nombre ?? "";
            const apellido = row.apellido ?? row.Apellido ?? "";
            const telefono = row.telefono ?? row.Telefono ?? "";
            const mail = row.mailContacto ?? row.Mail_Contacto ?? "";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${id}</td>
                <td>${nombre}</td>
                <td>${apellido}</td>
                <td>${telefono}</td>
                <td>${mail}</td>
                <td>
                    <button class="btn-secondary btn-sm" data-editar="${id}">Editar</button>
                    <button class="btn-primary btn-sm" data-eliminar="${id}">Borrar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Acciones de borrar 
        tbody.onclick = async (e) => {
            const target = e.target;
            if (target.matches("[data-eliminar]")) {
                const id = target.getAttribute("data-eliminar");
                await eliminarInquilino(id);
            }
        };

        // Que el usuario vea directamente la tabla de resultados
        const seccion = document.getElementById("listado-inquilinos");
        if (seccion) {
            seccion.scrollIntoView({ behavior: "smooth" });
        }
    }
    function renderizarResultadosPropietarios(datos) {
        if (!resultadosContainer) return;

        if (!Array.isArray(datos) || datos.length === 0) {
            resultadosContainer.innerHTML = `
                <p>No se encontraron coincidencias en la tabla <strong>Propietarios</strong>.</p>`;
            return;
        }

        let html = `<h3>${datos.length} resultados encontrados en Propietarios</h3>`;
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Mail</th>
                        <th style="width: 140px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        datos.forEach(row => {
            const id        = row.ID_Propietario ?? row.idPropietario ?? row.id ?? "-";
            const nombre    = row.Nombre        ?? row.nombre        ?? "";
            const apellido  = row.Apellido      ?? row.apellido      ?? "";
            const telefono  = row.Telefono      ?? row.telefono      ?? "";
            const mail      = row.Mail_Contacto ?? row.mailContacto  ?? "";

            html += `
                <tr>
                    <td>${id}</td>
                    <td>${nombre}</td>
                    <td>${apellido}</td>
                    <td>${telefono}</td>
                    <td>${mail}</td>
                    <td>
                        <button
                            class="btn-secondary btn-sm"
                            data-editar-prop="${id}"
                            data-nombre="${nombre}"
                            data-apellido="${apellido}"
                            data-telefono="${telefono}"
                            data-mail="${mail}"
                        >
                            Editar
                        </button>
                        <button class="btn-primary btn-sm" data-eliminar-prop="${id}">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        resultadosContainer.innerHTML = html;
    }

    function renderizarResultados(datos, tabla) {
        if (!resultadosContainer) return;

        if (!datos || datos.length === 0) {
            resultadosContainer.innerHTML = `<p>No se encontraron coincidencias en la tabla <strong>${tabla}</strong>.</p>`;
            return;
        }

        // columnas excluidas
        const columnasProhibidas = [
            "Calle",
            "Numeracion",
            "barrio",
            "localidad",
            "provincia",
            "Tipo Documento",
            "Tipo_Documento",
            "tipoDocumento",
            "TipoDocumento",
            "Ambientes",
            "Descripcion"
        ];

        // filtro de columnas segun lo que llego desde la API
        let columnas = Object.keys(datos[0]).filter(
            c => !columnasProhibidas.includes(c)
        );

        let html = `<h3>${datos.length} resultados encontrados en ${tabla}</h3>`;
        html += "<table><thead><tr>";

        columnas.forEach((col) => {
            const nombreFormateado = col.replace(/([A-Z])/g, " $1").trim();
            html += `<th>${nombreFormateado}</th>`;
        });

        html += "</tr></thead><tbody>";

        datos.forEach((fila) => {
            html += "<tr>";
            columnas.forEach((col) => {
                let valor = fila[col];

                if (valor === null || valor === undefined) {
                    valor = "-";
                } else if (
                    typeof valor === "string" &&
                    valor.match(/^\d{4}-\d{2}-\d{2}T/)
                ) {
                    valor = new Date(valor).toLocaleDateString();
                }

                html += `<td>${valor}</td>`;
            });
            html += "</tr>";
        });

        html += "</tbody></table>";
        resultadosContainer.innerHTML = html;
    }

    function renderizarResultadosInquilinos(datos) {
        if (!resultadosContainer) return;

        if (!Array.isArray(datos) || datos.length === 0) {
            resultadosContainer.innerHTML = `
                <p>No se encontraron coincidencias en la tabla <strong>Inquilinos</strong>.</p>`;
            return;
        }

        let html = `<h3>${datos.length} resultados encontrados en Inquilinos</h3>`;
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Mail</th>
                        <th>C B U</th>
                        <th style="width: 140px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        datos.forEach(row => {
            const id = row.ID_Inquilino ?? row.idInquilino ?? row.id ?? "-";
            const nombre = row.Nombre ?? row.nombre ?? "";
            const apellido = row.Apellido ?? row.apellido ?? "";
            const telefono = row.Telefono ?? row.telefono ?? "";
            const mail = row.Mail_Contacto ?? row.mailContacto ?? "";
            const cbu = row.CBU ?? row.cbu ?? "";

            html += `
                <tr>
                    <td>${id}</td>
                    <td>${nombre}</td>
                    <td>${apellido}</td>
                    <td>${telefono}</td>
                    <td>${mail}</td>
                    <td>${cbu}</td>
                    <td>
                        <button class="btn-secondary btn-sm" data-editar-inq="${id}">Editar</button>
                        <button class="btn-primary btn-sm" data-eliminar-inq="${id}">Borrar</button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        resultadosContainer.innerHTML = html;
    }
    function renderizarResultadosInmuebles(datos) {
        if (!resultadosContainer) return;

        if (!Array.isArray(datos) || datos.length === 0) {
            resultadosContainer.innerHTML = `
                <p>No se encontraron coincidencias en la tabla <strong>Inmuebles</strong>.</p>`;
            return;
        }

        let html = `<h3>${datos.length} resultados encontrados en Inmuebles</h3>`;
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre inmueble</th>
                        <th>Descripción</th>
                        <th>Propietario</th>
                        <th>Precio alquiler</th>
                        <th>Precio venta</th>
                        <th style="width: 140px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        datos.forEach(row => {
            const id = row.ID_Inmueble ?? row.idInmueble ?? row.id ?? "-";
            const nombre = row.Nombre_Inmueble ?? row.nombre_Inmueble ?? row.nombre ?? "";
            const descripcion = row.Descripcion ?? row.descripcion ?? "";
            const propietario = row.Propietario ?? row.propietario ?? "";
            const precioAlq = row.Precio_Alquiler ?? row.precio_Alquiler ?? row.precioAlquiler ?? "";
            const precioVenta = row.Precio_Venta ?? row.precio_Venta ?? row.precioVenta ?? "";

            html += `
                <tr>
                    <td>${id}</td>
                    <td>${nombre}</td>
                    <td>${descripcion}</td>
                    <td>${propietario}</td>
                    <td>${precioAlq}</td>
                    <td>${precioVenta}</td>
                    <td>
                        <button
                            class="btn-secondary btn-sm"
                            data-editar-inmueble="${id}"
                            data-nombre="${nombre}"
                            data-descripcion="${descripcion}"
                            data-propietario="${propietario}"
                            data-precioalq="${precioAlq}"
                            data-precioventa="${precioVenta}"
                        >
                            Editar
                        </button>
                        <button class="btn-primary btn-sm" data-eliminar-inmueble="${id}">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        resultadosContainer.innerHTML = html;
    }
    async function eliminarInmueble(id) {
        if (!confirm("¿Seguro que querés borrar este inmueble?")) return;

        try {
            const resp = await fetch(`${API_INMUEBLE_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`HTTP ${resp.status}: ${txt}`);
            }

            alert("Inmueble eliminado correctamente.");
            if (typeof cargarInmueblesTabla === "function") {
                await cargarInmueblesTabla();
            }

            
            if (
                selectTabla &&
                inputTexto &&
                selectTabla.value === "Inmuebles" &&
                inputTexto.value.trim() !== ""
            ) {
                await manejarBusqueda();
            }
        } catch (err) {
            console.error("Error eliminando inmueble:", err);
           //alert("Error al eliminar inmueble. Revisá consola para más detalle.");
        }
    }

    // ======================================================
    //  DASHBOARD INMOBILIARIA
    // ======================================================

    const cardDeudoresCount = document.getElementById("card-deudores-count");
    const cardRecibosCount = document.getElementById("card-recibos-count");
    const cardSinDeuda = document.getElementById("card-sin-deuda");
    const cardTotalRegistros = document.getElementById("card-total-registros");

    let dashboardChart = null;
    let pieAdminsChart = null;
    let pieVentasChart = null;

    async function cargarDashboard() {
        try {
            const [countDeudores, countRecibos, countSinDeuda] = await Promise.all([
                cargarDeudoresDashboard(),
                cargarRecibosDashboard(),
                obtenerInquilinosSinDeuda()
            ]);

            if (cardSinDeuda) cardSinDeuda.textContent = countSinDeuda;
            if (cardTotalRegistros) cardTotalRegistros.textContent = countDeudores + countSinDeuda;

            renderDashboardChart({
                deudores: countDeudores,
                sinDeuda: countSinDeuda,
                recibos: countRecibos
            });
        } catch (error) {
            console.error("Error cargando dashboard:", error);
        }
    }

    async function cargarDeudoresDashboard() {
        const url = `${DASHBOARD_BASE}/InquilinosConDeuda`;

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const datos = await resp.json();

            if (cardDeudoresCount) cardDeudoresCount.textContent = datos.length;
            return datos.length;
        } catch (error) {
            console.error("Error al cargar deudores:", error);
            if (cardDeudoresCount) cardDeudoresCount.textContent = "-";
            return 0;
        }
    }

    async function cargarRecibosDashboard() {
        const url = `${DASHBOARD_BASE}/RecibosUltimosTresMeses`;

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const datos = await resp.json();

            if (cardRecibosCount) cardRecibosCount.textContent = datos.length;
            return datos.length;
        } catch (error) {
            console.error("Error al cargar recibos:", error);
            if (cardRecibosCount) cardRecibosCount.textContent = "-";
            return 0;
        }
    }

    async function obtenerInquilinosSinDeuda() {
        const url = `${DASHBOARD_BASE}/InquilinosSinDeuda`;

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const numero = await resp.json();
            if (cardSinDeuda) cardSinDeuda.textContent = numero;

            return numero;
        } catch (error) {
            console.error("Error al cargar inquilinos sin deuda:", error);
            if (cardSinDeuda) cardSinDeuda.textContent = "-";
            return 0;
        }
    }

    // Solo mostramos 2 barras (deuda / sin deuda)
    function renderDashboardChart(totales) {
        const canvas = document.getElementById("dashboard-chart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (dashboardChart) {
            dashboardChart.destroy();
        }

        dashboardChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Inq. con deuda", "Inq. sin deuda"],
                datasets: [
                    {
                        label: "Cantidad",
                        data: [totales.deudores, totales.sinDeuda],
                        borderWidth: 1,
                        backgroundColor: "#c4a874"
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: "#4a3a20" },
                        grid: { display: false }
                    },
                    y: {
                        ticks: {
                            color: "#6b5a36",
                            precision: 0
                        },
                        grid: { color: "rgba(148, 115, 60, 0.15)" },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // ===============================
    //  Graficos de torta por localidad
    // ===============================
    async function cargarDashboardLocalidades() {
        try {
            const [adminsResp, ventasResp] = await Promise.all([
                fetch(`${DASHBOARD_BASE}/AdministracionesPorLocalidad`),
                fetch(`${DASHBOARD_BASE}/VentasPorLocalidad`)
            ]);

            if (!adminsResp.ok) throw new Error(`HTTP ${adminsResp.status} en AdministracionesPorLocalidad`);
            if (!ventasResp.ok) throw new Error(`HTTP ${ventasResp.status} en VentasPorLocalidad`);

            const admins = await adminsResp.json();
            const ventas = await ventasResp.json();

            renderPieChart("pie-admins", admins, "Administraciones por localidad", "cantidadInmuebles");
            renderPieChart("pie-ventas", ventas, "Ventas por localidad", "cantidadVentas");
        } catch (error) {
            console.error("Error cargando dashboards de localidades:", error);
        }
    }

    function renderResumenVentasLocalidad(data) {
        const cont = document.getElementById("resumen-ventas-localidad");
        if (!cont) return;

        if (!Array.isArray(data) || data.length === 0) {
            cont.innerHTML = `
                <h3>Importe por localidad</h3>
                <p class="resumen-subtitle">No hay ventas registradas.</p>
            `;
            return;
        }

        cont.innerHTML = `
            <h3>Importe por localidad</h3>
            <p class="resumen-subtitle">Total de ventas por zona</p>
        `;

        data.forEach(item => {
            const localidad = item.localidad ?? item.Localidad ?? "Sin localidad";

            
            const rawTotal =
                item.total ??
                item.Total ??
                item.montoTotal ??
                item.MontoTotal ??
                item.importe ??
                item.Importe ??
                0;

            const total = Number(rawTotal) || 0;

            const montoFormateado = total.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0
            });

            const row = document.createElement("div");
            row.className = "resumen-row";
            row.innerHTML = `
                <span class="resumen-localidad">${localidad}</span>
                <span class="resumen-monto">${montoFormateado}</span>
            `;
            cont.appendChild(row);
        });
    }


    function renderPieChart(canvasId, data, titulo, campoCantidad) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Etiquetas
        const labels = data.map(d => d.localidad || d.Localidad || "Sin localidad");

        // Valores convertidos a numeros
        const values = data.map(d => {
            const v = d[campoCantidad] ?? d.Cantidad ?? d.cantidad ?? 0;
            return Number(v) || 0;
        });

        // Paleta 
        const warmBeigeColors = [
            "#a78f63",
            "#8c6e39",
            "#6b5225",
            "#473818",
            "#d4c7a8",
            "#bfae86",
            "#c0955a",
            "#dac39a",
            "#c7b285",
            "#f0e0c3"
        ];

        const bgColors = labels.map((_, idx) => warmBeigeColors[idx % warmBeigeColors.length]);

        const existing = canvasId === "pie-admins" ? pieAdminsChart : pieVentasChart;
        if (existing) existing.destroy();

        const chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: bgColors,
                        borderColor: "#f9f3e7",
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "#4a3a20",
                            boxWidth: 20
                        }
                    },
                    title: {
                        display: false
                    }
                }
            }
        });

        if (canvasId === "pie-admins") {
            pieAdminsChart = chart;
        } else {
            pieVentasChart = chart;
        }
    }

    // ======================================================
    //  LISTADO Y BORRADO DE INQUILINOS
    // ======================================================


    async function eliminarInquilino(id) {
        if (!confirm("¿Seguro que querés eliminar este inquilino?")) return;

        try {
            const resp = await fetch(`${API_INQUILINO_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`HTTP ${resp.status}: ${txt}`);
            }

            alert("Inquilino eliminado.");
            await cargarInquilinosTabla();
            await cargarDashboard(); // actualizar tarjetas
        } catch (err) {
            console.error("Error al eliminar inquilino:", err);
            //alert("Error al eliminar inquilino. Revisá consola para más detalle.");
        }
    }

    // =====================================================
    //  ALTAS: MODALES Y POST
    // ======================================================

    // Helpers para abrir/cerrar modales
    function abrirModal(modal) {
        if (!modal) return;
        modal.classList.remove("hidden");
    }
    function prepararModalInquilinoParaCrear() {
        if (!formInquilino || !modalInquilino) return;

        formInquilino.dataset.modo = "crear";
        delete formInquilino.dataset.id;

        const titulo = modalInquilino.querySelector("h2");
        if (titulo) titulo.textContent = "Nuevo inquilino";

        formInquilino.reset();
    }

    function abrirModalInquilinoEdicion({ id, nombre, apellido, telefono, mail }) {
        if (!formInquilino || !modalInquilino) return;

        formInquilino.dataset.modo = "editar";
        formInquilino.dataset.id = id;

        const titulo = modalInquilino.querySelector("h2");
        if (titulo) titulo.textContent = "Editar inquilino";

        document.getElementById("inq-nombre").value = nombre ?? "";
        document.getElementById("inq-apellido").value = apellido ?? "";
        document.getElementById("inq-telefono").value = telefono ?? "";
        document.getElementById("inq-mail").value = mail ?? "";

        abrirModal(modalInquilino);
    }

    function cerrarModal(modal) {
        if (!modal) return;
        modal.classList.add("hidden");
    }

    function prepararModalPropietarioParaCrear() {
        if (!formPropietario || !modalPropietario) return;

        formPropietario.dataset.modo = "crear";
        delete formPropietario.dataset.id;

        const titulo = modalPropietario.querySelector("h2");
        if (titulo) titulo.textContent = "Nuevo propietario";

        formPropietario.reset();
    }

    function abrirModalPropietarioEdicion({ id, nombre, apellido, telefono, mail }) {
        if (!formPropietario || !modalPropietario) return;

        formPropietario.dataset.modo = "editar";
        formPropietario.dataset.id = id;

        const titulo = modalPropietario.querySelector("h2");
        if (titulo) titulo.textContent = "Editar propietario";

        document.getElementById("prop-nombre").value = nombre ?? "";
        document.getElementById("prop-apellido").value = apellido ?? "";
        document.getElementById("prop-telefono").value = telefono ?? "";
        document.getElementById("prop-mail").value = mail ?? "";

        abrirModal(modalPropietario);
    }


    // Botones del header
    const btnNuevoContrato = document.getElementById("btn-nuevo-contrato");
    const btnNuevoInquilino = document.getElementById("btn-nuevo-inquilino");
    const btnNuevoPropietario = document.getElementById("btn-nuevo-propietario");
    const btnNuevoRecibo = document.getElementById("btn-nuevo-recibo");
    const btnNuevaLiquidacion = document.getElementById("btn-nueva-liquidacion");

    // Modales
    const modalContrato = document.getElementById("modal-contrato");
    const modalInquilino = document.getElementById("modal-inquilino");
    const modalPropietario = document.getElementById("modal-propietario");
    const modalRecibo = document.getElementById("modal-recibo");
    const modalLiquidacion = document.getElementById("modal-liquidacion");

    // Formularios
    const formContrato = document.getElementById("form-nuevo-contrato");
    const formInquilino = document.getElementById("form-nuevo-inquilino");
    const formPropietario = document.getElementById("form-nuevo-propietario");
    const formRecibo = document.getElementById("form-nuevo-recibo");
    const formLiquidacion = document.getElementById("form-nueva-liquidacion");

    // Abrir modales
    if (btnNuevoContrato) {
        btnNuevoContrato.addEventListener("click", () => abrirModal(modalContrato));
    }
    if (btnNuevoInquilino) {
        btnNuevoInquilino.addEventListener("click", () => {
            prepararModalInquilinoParaCrear();
            abrirModal(modalInquilino);
        });
    }

    if (btnNuevoPropietario) {
        btnNuevoPropietario.addEventListener("click", () => {
            prepararModalPropietarioParaCrear();
            abrirModal(modalPropietario);
        });
    }

    if (btnNuevoRecibo) {
        btnNuevoRecibo.addEventListener("click", () => abrirModal(modalRecibo));
    }
    if (btnNuevaLiquidacion) {
        btnNuevaLiquidacion.addEventListener("click", () => abrirModal(modalLiquidacion));
    }

    // Cerrar modales (backdrop + botones con data-close-modal)
    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-close-modal]")) {
            const modals = [modalContrato, modalInquilino, modalPropietario, modalRecibo, modalLiquidacion];
            modals.forEach(cerrarModal);
        }
    });

    // ----- Alta contrato simple -----
    if (formContrato) {
    formContrato.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputProp = document.getElementById("contrato-propietario");
        const inputInq  = document.getElementById("contrato-inquilino");
        const inputInm  = document.getElementById("contrato-inmueble");

        const dtoContrato = {
            idPropietario: Number(inputProp?.dataset.id || 0),
            idInquilino:  Number(inputInq?.dataset.id  || 0),
            idInmueble:   Number(inputInm?.dataset.id  || 0)
        };

        if (!dtoContrato.idPropietario || !dtoContrato.idInquilino || !dtoContrato.idInmueble) {
            alert("Tenés que seleccionar propietario, inquilino e inmueble de la lista (no solo escribir el texto).");
            return;
        }

        try {
            const resp = await fetch(API_CONTRATOS_SIMPLE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dtoContrato)
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                throw new Error(`Error HTTP ${resp.status}: ${errorText}`);
            }

            alert("Contrato creado correctamente.");
            formContrato.reset();

            inputProp.dataset.id = "";
            inputInq.dataset.id  = "";
            inputInm.dataset.id  = "";

            cerrarModal(modalContrato);
        } catch (err) {
            console.error("Error creando contrato:", err);
            //alert("Error al crear contrato. Revisá consola para más detalle.");
        }
    });
}



    // ----- Alta inquilino simple -----
    // ----- Alta / Edición inquilino -----
    if (formInquilino) {
        formInquilino.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dto = {
                nombre: document.getElementById("inq-nombre").value.trim(),
                apellido: document.getElementById("inq-apellido").value.trim(),
                telefono: document.getElementById("inq-telefono").value.trim(),
                mailContacto: document.getElementById("inq-mail").value.trim()
            };

            const modo = formInquilino.dataset.modo === "editar" ? "editar" : "crear";
            let url, method;

            if (modo === "editar" && formInquilino.dataset.id) {
                // PUT api/Inquilino/{id}
                url = `${API_INQUILINO_BASE}/${formInquilino.dataset.id}`;
                method = "PUT";
            } else {
                // POST simple
                url = API_INQUILINOS_SIMPLE;
                method = "POST";
            }

            try {
                const resp = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    throw new Error(`Error HTTP ${resp.status}: ${errorText}`);
                }

                alert(
                    modo === "editar"
                        ? "Inquilino actualizado correctamente."
                        : "Inquilino creado correctamente."
                );

                formInquilino.reset();
                formInquilino.dataset.modo = "crear";
                delete formInquilino.dataset.id;

                const titulo = modalInquilino?.querySelector("h2");
                if (titulo) titulo.textContent = "Nuevo inquilino";

                cerrarModal(modalInquilino);

                // refrescar tabla de abajo
                await cargarInquilinosTabla();

                // si el buscador esta en Inquilinos, refrescar resultados
                if (
                    selectTabla &&
                    inputTexto &&
                    selectTabla.value === "Inquilinos" &&
                    inputTexto.value.trim() !== ""
                ) {
                    await manejarBusqueda();
                }
            } catch (err) {
                console.error("Error guardando inquilino:", err);
                //alert("Error al guardar inquilino. Revisá consola para más detalle.");
            }
        });
    }


    // ----- Alta propietario simple -----
    // ----- Alta / Edición propietario -----
    if (formPropietario) {
        formPropietario.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dto = {
                nombre: document.getElementById("prop-nombre").value.trim(),
                apellido: document.getElementById("prop-apellido").value.trim(),
                telefono: document.getElementById("prop-telefono").value.trim(),
                mailContacto: document.getElementById("prop-mail").value.trim()
            };

            const modo = formPropietario.dataset.modo === "editar" ? "editar" : "crear";
            let url, method;

            if (modo === "editar" && formPropietario.dataset.id) {
                url = `${API_PROPIETARIO_BASE}/${formPropietario.dataset.id}`; // PUT
                method = "PUT";
            } else {
                url = API_PROPIETARIOS_SIMPLE; // POST
                method = "POST";
            }

            try {
                const resp = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    throw new Error(`Error HTTP ${resp.status}: ${errorText}`);
                }

                alert(
                    modo === "editar"
                        ? "Propietario actualizado correctamente."
                        : "Propietario creado correctamente."
                );

                formPropietario.reset();
                formPropietario.dataset.modo = "crear";
                delete formPropietario.dataset.id;

                const titulo = modalPropietario?.querySelector("h2");
                if (titulo) titulo.textContent = "Nuevo propietario";

                cerrarModal(modalPropietario);

                
                if (typeof cargarPropietariosTabla === "function") {
                    await cargarPropietariosTabla();
                }

                // si el buscador esta en Propietarios, refrescar resultados
                if (
                    selectTabla &&
                    inputTexto &&
                    selectTabla.value === "Propietarios" &&
                    inputTexto.value.trim() !== ""
                ) {
                    await manejarBusqueda();
                }
            } catch (err) {
                console.error("Error guardando propietario:", err);
                //alert("Error al guardar propietario. Revisá consola para más detalle.");
            }
        });
    }

    // ----- Alta recibo simple -----
    if (formRecibo) {
        formRecibo.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dto = {
                fecha: document.getElementById("recibo-fecha").value,
                idInquilino: Number(document.getElementById("recibo-idInquilino").value),
                idPropietario: Number(document.getElementById("recibo-idPropietario").value),
                idDetalleInmueble: Number(document.getElementById("recibo-idDetalleInmueble").value),
                idTipoPago: Number(document.getElementById("recibo-idTipoPago").value),
                montoTotal: Number(document.getElementById("recibo-monto").value),
                estadoRecibo: document.getElementById("recibo-estado").value.trim()
            };

            try {
                const resp = await fetch(API_RECIBOS_SIMPLE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    throw new Error(`Error HTTP ${resp.status}: ${errorText}`);
                }

                alert("Recibo creado correctamente.");
                formRecibo.reset();
                cerrarModal(modalRecibo);
            } catch (err) {
                console.error("Error creando recibo:", err);
                //alert("Error al crear recibo. Revisá consola para más detalle.");
            }
        });
    }

    // ----- Alta liquidación simple -----
    if (formLiquidacion) {
        formLiquidacion.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dto = {
                idPropietario: Number(document.getElementById("liq-idPropietario").value),
                periodo: document.getElementById("liq-periodo").value, // tipo month
                montoTotal: Number(document.getElementById("liq-montoTotal").value),
                observaciones: document.getElementById("liq-observaciones").value.trim()
            };

            try {
                const resp = await fetch(API_LIQUIDACIONES_SIMPLE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    throw new Error(`Error HTTP ${resp.status}: ${errorText}`);
                }

                alert("Liquidación creada correctamente.");
                formLiquidacion.reset();
                cerrarModal(modalLiquidacion);
            } catch (err) {
                console.error("Error creando liquidación:", err);
                //alert("Error al crear liquidación. Revisá consola para más detalle.");
            }
        });
    }

    // ======================================================
    //  AUTOCOMPLETAR CONTRATO
    // ======================================================

    async function buscarPropietarios(texto) {
        const r = await fetch(`https://localhost:7098/api/Propietario/Buscar?texto=${encodeURIComponent(texto)}`);
        return await r.json();
    }

    async function eliminarPropietario(id) {
        if (!confirm("¿Seguro que querés borrar este propietario?")) return;

        try {
            const resp = await fetch(`${API_PROPIETARIO_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`HTTP ${resp.status}: ${txt}`);
            }

            alert("Propietario eliminado correctamente.");

            if (typeof cargarPropietariosTabla === "function") {
                await cargarPropietariosTabla();
            }

            if (
                selectTabla &&
                inputTexto &&
                selectTabla.value === "Propietarios" &&
                inputTexto.value.trim() !== ""
            ) {
                await manejarBusqueda();
            }
        } catch (err) {
            console.error("Error eliminando propietario:", err);
            //alert("Error al eliminar propietario. Revisá consola para más detalle.");
        }
    }

    document.getElementById("contrato-propietario").addEventListener("input", async (e) => {
    const texto = e.target.value.trim();
    const lista = document.getElementById("lista-propietarios");

    if (texto.length < 2) {
        lista.style.display = "none";
        return;
    }

    const resultados = await buscarPropietarios(texto);
    lista.innerHTML = "";
    lista.style.display = "block";

    resultados.forEach(r => {
        const id = r.idPropietario ?? r.ID_Propietario ?? r.id ?? 0;
        const nombre = r.nombre ?? r.Nombre ?? "";
        const apellido = r.apellido ?? r.Apellido ?? "";
        const label = `${nombre} ${apellido}`.trim() || `Propietario #${id}`;

        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = label;

        item.onclick = () => {
            e.target.value = label;
            e.target.dataset.id = id;       
            lista.style.display = "none";
        };

        lista.appendChild(item);
    });
});


    async function buscarInquilinos(texto) {
        const r = await fetch(`https://localhost:7098/api/Inquilino/Buscar?texto=${encodeURIComponent(texto)}`);
        return await r.json();
    }

   document.getElementById("contrato-inquilino").addEventListener("input", async (e) => {
    const texto = e.target.value.trim();
    const lista = document.getElementById("lista-inquilinos");

    if (texto.length < 2) {
        lista.style.display = "none";
        return;
    }

    const resultados = await buscarInquilinos(texto);
    lista.innerHTML = "";
    lista.style.display = "block";

    resultados.forEach(r => {
        const id = r.idInquilino ?? r.ID_Inquilino ?? r.id ?? 0;
        const nombre = r.nombre ?? r.Nombre ?? "";
        const apellido = r.apellido ?? r.Apellido ?? "";
        const label = `${nombre} ${apellido}`.trim() || `Inquilino #${id}`;

        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = label;

        item.onclick = () => {
            e.target.value = label;
            e.target.dataset.id = id;    
            lista.style.display = "none";
        };

        lista.appendChild(item);
    });
});


    async function buscarInmuebles(texto) {
    const r = await fetch(`https://localhost:7098/api/Propiedad/Buscar?texto=${encodeURIComponent(texto)}`);
    if (!r.ok) {
        console.error("Error buscando inmuebles:", r.status);
        return [];
    }
    return await r.json();
}



   document.getElementById("contrato-inmueble").addEventListener("input", async (e) => {
    const texto = e.target.value.trim();
    const lista = document.getElementById("lista-inmuebles");

    if (texto.length < 2) {
        lista.style.display = "none";
        return;
    }

    const resultados = await buscarInmuebles(texto);
    lista.innerHTML = "";
    lista.style.display = "block";

    resultados.forEach(r => {
        const id = r.id ?? r.idInmueble ?? r.ID_Inmueble ?? 0;
        const direccion = r.direccion ?? r.Direccion ?? "";

        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = direccion;      

        item.onclick = () => {
            e.target.value = direccion;    
            e.target.dataset.id = id;
            lista.style.display = "none";
        };

        lista.appendChild(item);
    });
});



    async function cargarVentasPorLocalidad() {
        const resp = await fetch(`${API_BASE}/Dashboard/VentasPorLocalidad`);
        if (!resp.ok) {
            console.error('Error al obtener ventas por localidad');
            return;
        }
        const data = await resp.json(); // [{ localidad, cantidad, total }, ...]

        const labels = data.map(x => x.localidad);
        const values = data.map(x => x.cantidad);  

        // Pie chart
        renderPieChart('pie-ventas', labels, values);

        // Panel lateral con los montos
        const cont = document.getElementById('resumen-ventas-localidad');
        if (!cont) return;

        cont.innerHTML = `
            <h3>Importe por localidad</h3>
            <p style="margin:0 0 .5rem;">Total de ventas por zona:</p>
        `;

        data.forEach(item => {
            const row = document.createElement('div');
            row.className = 'ventas-row';

            const totalFormateado = item.total.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                maximumFractionDigits: 0
            });

            row.innerHTML = `
                <span class="ventas-loc">${item.localidad}</span>
                <span class="ventas-money">${totalFormateado}</span>
            `;

            cont.appendChild(row);
        });
    }
function generarPdfRecibo(datos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.text("RECIBO DE ALQUILER", 105, 20, { align: "center" });

    doc.setFontSize(12);
    const fechaHoy = new Date().toLocaleDateString("es-AR");
    doc.text(`Fecha de emisión: ${fechaHoy}`, 20, 30);

    // Datos principales
    let y = 45;

    const linea = (label, value) => {
        doc.text(`${label}: ${value ?? ""}`, 20, y);
        y += 8;
    };

    linea("Fecha", datos.fecha || "-");
    linea("Id inquilino", datos.idInquilino || "-");
    linea("Id propietario", datos.idPropietario || "-");
    linea("Id detalle inmueble", datos.idDetalleInmueble || "-");
    linea("Id tipo pago", datos.idTipoPago || "-");

    const monto = Number(datos.montoTotal || 0).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
    linea("Monto total", monto);

    linea("Estado", datos.estadoRecibo || "-");

    // Pie
    y += 10;
    doc.text("Firma:", 20, y);
    doc.line(40, y + 0.5, 100, y + 0.5);

    // Guardar/descargar
    const nombreArchivo = `Recibo_${datos.idInquilino || ""}_${datos.fecha || ""}.pdf`;
    doc.save(nombreArchivo.replace(/[^\w\-\.]/g, "_"));
}

if (formRecibo) {
    formRecibo.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dto = {
            fecha: document.getElementById("recibo-fecha").value,
            idInquilino: Number(document.getElementById("recibo-idInquilino").value),
            idPropietario: Number(document.getElementById("recibo-idPropietario").value),
            idDetalleInmueble: Number(document.getElementById("recibo-idDetalleInmueble").value),
            idTipoPago: Number(document.getElementById("recibo-idTipoPago").value),
            montoTotal: Number(document.getElementById("recibo-monto").value),
            estadoRecibo: document.getElementById("recibo-estado").value.trim()
        };

        try {
            const resp = await fetch(API_RECIBOS_SIMPLE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                throw new Error(`Error HTTP ${resp.status}: ${errorText}`);
            }

            alert("Recibo creado correctamente.");

            // Generar el PDF con los mismos datos del formulario
            generarPdfRecibo(dto);

            formRecibo.reset();
            cerrarModal(modalRecibo);
        } catch (err) {
            console.error("Error creando recibo:", err);
            alert("Error al crear recibo. Revisá consola para más detalle.");
        }
    });
}


    // ======================================================
    //   INICIALIZACIÓN
    // ======================================================
    window.addEventListener("DOMContentLoaded", () => {
        cargarDashboard();
        cargarDashboardLocalidades();
        
    });
