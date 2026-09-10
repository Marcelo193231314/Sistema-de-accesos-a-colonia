export class GestorResidentes {
    constructor(edificio) {
        this.edificio = edificio;
    }

    altaResidente(numeroDepto, residente) {
        const depto = this.edificio.obtenerDepartamento(numeroDepto);
        
        const existe = depto.residentes.some(r => r.nombre.toLowerCase() === residente.nombre.toLowerCase());
        if (existe) throw new Error(`${residente.nombre} ya vive en este departamento.`);

        depto.residentes.push(residente);
        return `✅ ${residente.nombre} registrado en depto ${numeroDepto}. ID: ${residente.id}`;
    }

    bajaResidente(idResidente) {
        // Busca en todo el edificio para dar de baja solo con el ID
        for (const [numero, depto] of this.edificio.departamentos.entries()) {
            const index = depto.residentes.findIndex(r => r.id === idResidente);
            if (index !== -1) {
                const nombre = depto.residentes[index].nombre;
                depto.residentes.splice(index, 1);
                return `✅ ${nombre} dado de baja exitosamente.`;
            }
        }
        throw new Error(`No se encontró ningún residente con el ID ${idResidente}.`);
    }
}
