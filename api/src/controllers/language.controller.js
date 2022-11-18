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




const insertHilo = async (req, res) => {

    try {
            
        
        let procesos = req.body.procesos;
        let nombreHilo =req.body.nombreHilo;
        
        

        const connection = await getConnection();
        //Insert Hilo Encabezado
        const result = await connection.query("INSERT INTO hilos (nombre,fechaCreacion,estado) VALUES ('"+nombreHilo+"', now(),1 ) ");
      
         //Tomar ult id
         const result2 = await connection.query("SELECT MAX(idHilo) as idHilo FROM hilos");
         const id = result2[0].idHilo; 
      
     

        
        //Insertar Procesos
        procesos.map((proceso)=>{
            const result3 =  connection.query("INSERT INTO detallehilo (idProceso,cpu,prioridad,estado,idHilo,tLlegada) VALUES ("+proceso.idProceso+","+proceso.cpu+","+proceso.prioridad+",1,"+id+","+proceso.tiempoLlegada+")");
        });


        res.json({ message: "Hilo Guardado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getDetalleHilo,
    getHilos,
    getProcesos,
    insertHilo
};
