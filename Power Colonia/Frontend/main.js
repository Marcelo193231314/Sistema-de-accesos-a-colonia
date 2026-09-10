import { Residente, Visita } from './Modelos.js';
import { Edificio } from './Edificio.js';
import { GestorResidentes } from './GestorResidentes.js';
import { GestorVisitas } from './GestorVisitas.js';

const miEdificio = new Edificio();
const controlResidentes = new GestorResidentes(miEdificio);
const controlVisitas = new GestorVisitas(miEdificio);

// --- FUNCIONES DE RENDERIZADO VISUAL ---
function actualizarUIAdmin() {
    const disponibles = miEdificio.obtenerDepartamentosDisponibles();
    const contDisp = document.getElementById('listaDisponibles');
    contDisp.innerHTML = disponibles.length === 0 ? '<span class="text-muted">Lleno</span>' : disponibles.map(num => `<span class="chip">${num}</span>`).join('');

    const todosRes = miEdificio.obtenerTodosLosResidentes();
    const tbodyRes = document.getElementById('tablaResidentes');
    tbodyRes.innerHTML = todosRes.length === 0 ? '<tr><td colspan="4" class="text-center">Sin habitantes</td></tr>' : todosRes.map(r => `
        <tr><td><strong>${r.depto}</strong></td><td><small>${r.id}</small></td><td>${r.nombre}</td><td><button onclick="window.darDeBaja('${r.id}')" class="btn-danger btn-sm">Baja</button></td></tr>
    `).join('');
}

function actualizarUICaseta() {
    const activas = controlVisitas.obtenerVisitasActivas();
    const tbodyVis = document.getElementById('tablaVisitasActivas');
    
    tbodyVis.innerHTML = activas.length === 0 ? '<tr><td colspan="4" class="text-center">No hay visitas dentro</td></tr>' : activas.map(v => `
        <tr><td>${v.nombre}</td><td><strong>${v.departamentoDestino}</strong></td><td>${v.horaEntrada}</td><td><button onclick="window.marcarSalida('${v.id}')" class="btn-warning btn-sm">Salió</button></td></tr>
    `).join('');
}

window.darDeBaja = (id) => {
    if(confirm('¿Eliminar residente?')) { controlResidentes.bajaResidente(id); actualizarUIAdmin(); }
};

window.marcarSalida = (id) => {
    controlVisitas.registrarSalida(id); actualizarUICaseta();
};

actualizarUIAdmin();
actualizarUICaseta();

// --- EVENTOS DE ADMINISTRADOR ---
document.getElementById('formResidente').addEventListener('submit', (e) => {
    e.preventDefault();
    const msj = document.getElementById('mensajeResidente');
    try {
        const idGenerado = 'R-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const res = new Residente(idGenerado, document.getElementById('resNombre').value, document.getElementById('resTel').value);
        msj.innerHTML = `<span style="color: green;">${controlResidentes.altaResidente(parseInt(document.getElementById('resDepto').value), res)}</span>`;
        e.target.reset(); actualizarUIAdmin();
    } catch (error) { msj.innerHTML = `<span style="color: red;">${error.message}</span>`; }
});

// --- EVENTOS DE CASETA ---
// 1. Validar Código (Visitante Pre-aprobado)
document.getElementById('formValidarCodigo').addEventListener('submit', (e) => {
    e.preventDefault();
    const msj = document.getElementById('mensajeValidacion');
    try {
        const codigo = document.getElementById('codigoAcceso').value.trim();
        msj.innerHTML = `<span style="color: green;">${controlVisitas.validarInvitacion(codigo)}</span>`;
        e.target.reset(); actualizarUICaseta();
    } catch (error) { msj.innerHTML = `<span style="color: red;">${error.message}</span>`; }
});

// 2. Registro Manual (Visitante Sorpresa)
document.getElementById('formVisitaWalkIn').addEventListener('submit', (e) => {
    e.preventDefault();
    const msj = document.getElementById('mensajeVisitaWalkIn');
    try {
        const idVis = 'V-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const vis = new Visita(idVis, document.getElementById('visNombre').value, parseInt(document.getElementById('visDepto').value), document.getElementById('visTipo').value);
        msj.innerHTML = `<span style="color: green;">${controlVisitas.registrarWalkIn(vis)}</span>`;
        e.target.reset(); actualizarUICaseta();
    } catch (error) { msj.innerHTML = `<span style="color: red;">${error.message}</span>`; }
});

// --- EVENTOS DEL RESIDENTE ---
// 1. Crear Invitación
document.getElementById('formCrearInvitacion').addEventListener('submit', (e) => {
    e.preventDefault();
    const msj = document.getElementById('mensajeInvitacion');
    try {
        const idInv = 'V-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const vis = new Visita(idInv, document.getElementById('invNombre').value, parseInt(document.getElementById('invDepto').value), document.getElementById('invTipo').value);
        msj.innerHTML = `<span style="color: green; font-weight: bold;">${controlVisitas.crearInvitacion(vis)}</span>`;
        e.target.reset();
    } catch (error) { msj.innerHTML = `<span style="color: red;">${error.message}</span>`; }
});

// 2. Ver Historial
document.getElementById('formMisVisitas').addEventListener('submit', (e) => {
    e.preventDefault();
    const contenedor = document.getElementById('listaMisVisitas');
    try {
        const misVisitas = controlVisitas.obtenerVisitasPorDepto(parseInt(document.getElementById('miNumDepto').value));
        contenedor.innerHTML = misVisitas.length === 0 ? '<p class="text-center text-muted">Aún no tienes visitas en el historial.</p>' : misVisitas.map(v => `
            <div style="border-left: 4px solid ${v.estado === 'Esperando llegada' ? '#ffc107' : (v.estado === 'Finalizada' ? '#6c757d' : '#28a745')}; padding: 10px; background: #f8f9fa; margin-bottom: 10px; border-radius: 4px;">
                <strong>${v.nombre}</strong> <small>(${v.id})</small><br>
                <small>Estado: <strong>${v.estado}</strong> ${v.horaEntrada ? `| Entró: ${v.horaEntrada}` : ''} ${v.horaSalida ? `| Salió: ${v.horaSalida}` : ''}</small>
            </div>
        `).reverse().join(''); // Reverse para ver los más recientes arriba
    } catch (error) { contenedor.innerHTML = `<p style="color: red;">${error.message}</p>`; }
});
