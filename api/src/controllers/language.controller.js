import { getConnection } from "./../database/database";
const getProcesos = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * from procesos");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getHilos = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT hilos.idHilo,hilos.nombre as nombreHilo from hilos");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getDetalleHilo = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT hilos.idHilo,hilos.nombre as nombreHilo,procesos.nombreProceso,detallehilo.cpu,detallehilo.prioridad,detallehilo.tLlegada,detallehilo.tSalida from hilos JOIN detallehilo on hilos.idHilo = detallehilo.idHilo JOIN procesos on detallehilo.idProceso = procesos.idproceso WHERE hilos.idHilo = "+id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const saveHilo = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT hilos.idHilo,hilos.nombre as nombreHilo,procesos.nombreProceso,detallehilo.cpu,detallehilo.prioridad,detallehilo.tLlegada,detallehilo.tSalida from hilos JOIN detallehilo on hilos.idHilo = detallehilo.idHilo JOIN procesos on detallehilo.idProceso = procesos.idproceso WHERE hilos.idHilo = ",id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    saveHilo,
    getDetalleHilo,
    getHilos,
    getProcesos
};
