import { Departamento } from './Modelos.js';

export class Edificio {
    constructor() {
        this.departamentos = new Map();
        this.inicializarEdificio();
    }

    inicializarEdificio() {
        const pisos = 5;
        const deptosPorPiso = 4;

        for (let piso = 1; piso <= pisos; piso++) {
            for (let depto = 1; depto <= deptosPorPiso; depto++) {
                const numeroDepto = (piso * 100) + depto;
                this.departamentos.set(numeroDepto, new Departamento(numeroDepto));
            }
        }
    }

    obtenerDepartamento(numero) {
        if (!this.departamentos.has(numero)) {
            throw new Error(`El departamento ${numero} no existe. Los válidos son del 101 al 504.`);
        }
        return this.departamentos.get(numero);
    }

    obtenerDepartamentosDisponibles() {
        const vacios = [];
        for (const [numero, depto] of this.departamentos.entries()) {
            if (depto.residentes.length === 0) vacios.push(numero);
        }
        return vacios;
    }

    // NUEVO: Extraer todos los residentes para la tabla del Administrador
    obtenerTodosLosResidentes() {
        let todos = [];
        for (const [numero, depto] of this.departamentos.entries()) {
            depto.residentes.forEach(res => {
                todos.push({ depto: numero, ...res });
            });
        }
        return todos;
    }
}
