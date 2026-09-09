export class GestorVisitas {
    constructor(edificio) {
        this.edificio = edificio;
        this.visitasActivas = new Map();
        this.invitacionesPendientes = new Map();
    }

    // 1. Residente pre-autoriza a alguien
    crearInvitacion(visita) {
        const depto = this.edificio.obtenerDepartamento(visita.departamentoDestino);
        if (depto.residentes.length === 0) {
            throw new Error(`El depto ${visita.departamentoDestino} está vacío.`);
        }
        
        this.invitacionesPendientes.set(visita.id, visita);
        depto.historialVisitas.push(visita);
        
        return `✅ Invitación generada. Comparte el código: ${visita.id}`;
    }

    // 2. Caseta: Visita llega con código pre-aprobado
    validarInvitacion(idVisita) {
        if (!this.invitacionesPendientes.has(idVisita)) {
            throw new Error(`El código ${idVisita} no existe o ya fue utilizado.`);
        }

        const visita = this.invitacionesPendientes.get(idVisita);
        visita.estado = "En el edificio";
        visita.horaEntrada = new Date().toLocaleTimeString();

        this.invitacionesPendientes.delete(idVisita);
        this.visitasActivas.set(visita.id, visita);

        return `✅ Código válido. Acceso autorizado a ${visita.nombre} al depto ${visita.departamentoDestino}.`;
    }

    // 3. Caseta: Llegan a tocar sin aviso previo
    registrarWalkIn(visita) {
        const depto = this.edificio.obtenerDepartamento(visita.departamentoDestino);
        if (depto.residentes.length === 0) {
            throw new Error(`Nadie vive en el ${visita.departamentoDestino}. Acceso denegado.`);
        }

        visita.estado = "En el edificio (Sin previo aviso)";
        visita.horaEntrada = new Date().toLocaleTimeString();

        depto.historialVisitas.push(visita);
        this.visitasActivas.set(visita.id, visita);
        return `✅ Registro manual exitoso. ${visita.nombre} ha ingresado.`;
    }

    // 4. Caseta: Marcar salida
    registrarSalida(idVisita) {
        if (!this.visitasActivas.has(idVisita)) {
            throw new Error(`La visita ${idVisita} no está en el edificio.`);
        }
        
        const visita = this.visitasActivas.get(idVisita);
        visita.estado = "Finalizada";
        visita.horaSalida = new Date().toLocaleTimeString();
        this.visitasActivas.delete(idVisita); 
        
        return `✅ Salida registrada para ${visita.nombre}.`;
    }

    obtenerVisitasActivas() {
        return Array.from(this.visitasActivas.values());
    }

    obtenerVisitasPorDepto(numeroDepto) {
        const depto = this.edificio.obtenerDepartamento(numeroDepto);
        return depto.historialVisitas;
    }
}
