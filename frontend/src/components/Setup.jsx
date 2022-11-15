import React, { useState, useEffect } from 'react'
import AddThreadModal from './AddThreadModal'
import ProcessesTable from './ProcessesTable';

const Inputs = ({ outputRef, setProcessesList, setSelectedAlgorithm, quantum, setQuantum }) => {
    const [threads, setThreads] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [selectedThread, setSelectedThread] = useState("");
    const [showAddThreadModal, setShowAddThreadModal] = useState(false);
    const [data, setData] = useState({ quantum: "", selectedAlgorithm: "1", processingType: '1' })

    useEffect(() => {
        const getThreads = () => {
            fetch("http://localhost:4000/api/languages/hilos")
                .then(respuesta => respuesta.json())
                .then(resultado_final => {
                    setThreads(resultado_final);
                }, error => {
                    console.log(error);
                })
        }
        getThreads();
    }, [])

    useEffect(() => {
        if(selectedThread === ""){
            setProcesses([]);
            return;
        }

        const getProcesses = () => {
            fetch(`http://localhost:4000/api/languages/hilos/${selectedThread}`)
                .then(respuesta => respuesta.json())
                .then(resultado_final => {
                    setProcesses(resultado_final);
                }, error => {
                    console.log(error);
                })
        }
        getProcesses();
    }, [selectedThread]);

    const onSubmit = (e) => {
        e.preventDefault();

        let tempProcessesList = [];
        tempProcessesList = processes.map((item, index) => {
            return {
                id: String.fromCharCode(index + 65),
                name: item.nombreProceso,
                cpu: parseInt(item.cpu),
                priority: parseInt(item.prioridad),
                arrivalTime: parseInt(item.tLlegada),
                tickets: 0,
                movements: [],
                usedTime: 0,
                states: ["Listo"],
            }
        })

        setSelectedAlgorithm(data.selectedAlgorithm);
        setQuantum(data.quantum);
        setProcessesList([...tempProcessesList]);

        outputRef.current?.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className='p-4 bg-white shadow rounded-border mb-4'>
            <label className='small mt-3'><strong>Configuración</strong></label>
            <hr className='mb-2 mt-1' />
            <div className='d-flex flex-row'>
                <div className="col flex-fill me-2" id="divHilosSelect">
                    <label className='small text-muted mt-2'><strong>Hilos</strong></label>
                    <select required onChange={e => (setSelectedThread(e.target.value))} id="listadoDeHilos" className="form-control">
                        <option value="">Selecciona un Hilo</option>
                        {threads.map((item, index) => {
                            return <option key={index} value={item.idHilo}>{item.nombreHilo}</option>
                        })}
                    </select>
                </div>
                <button className="btn btn-secondary mt-auto" onClick={() => setShowAddThreadModal(true)}>Agregar hilo</button>
                <AddThreadModal threads={threads} setThreads={setThreads} showAddThreadModal={showAddThreadModal} setShowAddThreadModal={setShowAddThreadModal} />
            </div>
            <div className='d-flex flex-row'>
                <div className="col-2 me-2">
                    <label className='small text-muted mt-2'><strong>Quantum</strong></label>
                    <input required value={!isNaN(data.quantum) ? data.quantum : ''} onChange={e => { setData({ ...data, quantum: parseInt(e.target.value) }) }} type="number" min={1} className="form-control" placeholder="Ej. 3" />
                </div>
                <div className="col flex-fill me-2">
                    <label className='small text-muted mt-2'><strong>Tipo</strong></label>
                    <select id="tipoAlgoritmo" className="form-control">
                        <option value="1">Procesamiento</option>
                        <option value="2">Memoria</option>
                    </select>
                </div>
                <div className="col flex-fill" >
                    <label className='small text-muted mt-2'><strong>Algoritmo</strong></label>
                    <select value={data.selectedAlgorithm} onChange={e => setData({ ...data, selectedAlgorithm: e.target.value })} className="form-select form-control" name='algorithm'>
                        <option value='1'>Trabajo más corto primero (Por CPU)</option>
                        <option value='2'>Por prioridad</option>
                        <option value='3'>Por sorteo</option>
                        <option value='4'>Trabajo más corto primero (No expropiativo)</option>
                        <option value='5'>Round Robin (Por turno circular)</option>
                        <option value='6'>Por prioridad (Expropiativo)</option>
                        <option value='7'>Multiples colas</option>
                        <option value='8'>Planificación garantizada</option>
                    </select>
                </div>
            </div>
            <div className="d-flex flex-row mt-3">
                <button role={'link'} href='output' className="form-control btn btn-primary" type='submit'>Ejecutar</button>
            </div>
            {processes.length !== 0 &&
                <React.Fragment>
                    <label className='small mt-3'><strong>Procesos a ejecutar</strong></label>
                    <hr className='mb-2 mt-1' />
                    <div className="d-flex flex-row">
                        <ProcessesTable processes={processes} />
                    </div>
                </React.Fragment>
            }
        </form>
    )
}

export default Inputs