import React, { useEffect } from 'react'
import { useState } from 'react';
import Modal from 'react-modal';
import ProcessesTable from './ProcessesTable';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '25%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '15px',
    },
};

const AddThreadModal = ({ showAddThreadModal, setShowAddThreadModal, threads, setThreads }) => {
    const [data, setData] = useState({ threadName: '', process: '', arrivalTime: '', cpu: '', priority: '' });
    const [processes, setProcesses] = useState([]);
    const [thread, setThread] = useState([]);

    const handleInputChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const getProcesses = () => {
            fetch("http://localhost:4000/api/languages/procesos")
                .then(respuesta => respuesta.json())
                .then(resultado_final => {
                    setProcesses(resultado_final);
                }, error => {
                    console.log(error);
                })
        }
        getProcesses();
    }, [])

    const addToThread = (e) => {
        e.preventDefault();

        let tempThread = [...thread];
        tempThread.push({
            idProceso: data.process,
            nombreProceso: processes.find((item) => item.idproceso === parseInt(data.process)).nombreProceso,
            tLlegada: data.arrivalTime !== "" ? parseInt(data.arrivalTime) : 0,
            cpu: parseInt(data.cpu),
            prioridad: data.arrivalTime !== "" ? parseInt(data.priority) : 1
        });
        setThread(tempThread);

        setProcesses([...processes].filter(item => item.idproceso !== parseInt(data.process)));

        setData({
            ...data,
            process: '',
            arrivalTime: '',
            cpu: '',
            priority: ''
        })
    }

    const addThread = async (e) => {
        e.preventDefault();

        let payload = { nombreHilo: data.threadName, procesos: thread } //Data para el fetch

        await fetch('http://localhost:4000/api/languages/hilos', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
            if(res.status === 200){
                window.location.reload(false);
            }
        })
    }


    return (
        <Modal style={customStyles} isOpen={showAddThreadModal} closeTimeoutMS={500} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true} onRequestClose={() => setShowAddThreadModal(false)}>
            <div className="modal-header mb-2">
                <h5 className="modal-title">Crear Hilo</h5>
                <button type="button" className="btn btn-close" onClick={() => setShowAddThreadModal(false)} />
            </div>

            <div className="modal-body d-flex flex-column">

                <label className='small'><strong>Hilo</strong></label>
                <hr className='m-0' />
                <form id='addThread' onSubmit={e => addThread(e)} className='d-flex flex-row'>
                    <div className="flex-fill">
                        <label className='small text-muted mt-3'>Nombre del Hilo</label>
                        <input required onChange={(e) => handleInputChange(e)} value={data.threadName} name='threadName' type="text" className="form-control" placeholder="Ej. Hilo 1" />
                    </div>
                </form>

                <form id='addProcess' onSubmit={(e) => addToThread(e)} className="d-flex flex-column">
                    <label className='small mt-3'><strong>Procesos del hilo</strong></label>
                    <hr className='m-0' />
                    <div className='d-flex flex-column flex-md-row mt-1 mt-md-3'>
                        <div className='d-flex flex-row flex-fill`'>
                            <div className="col me-2">
                                <label className='small text-muted'>Proceso</label>
                                <select required onChange={(e) => handleInputChange(e)} value={data.process} name='process' data-live-search="true" id="selectProcesos" className="form-control">
                                    <option value="">Seleccione un proceso</option>
                                    {processes.map((item, index) => {
                                        return <option key={index + 1} value={item.idproceso}>{item.nombreProceso}</option>
                                    })}
                                </select>
                            </div>
                            <div className="col me-2">
                                <label className='small text-muted'>Tiempo de llegada</label>
                                <input onChange={(e) => handleInputChange(e)} min="0" value={data.arrivalTime} name='arrivalTime' type="number" id="prioridadProcessRegister" className="form-control" placeholder="Ej. 0" />
                            </div>
                        </div>
                        <div className='d-flex flex-row flex-fill'>
                            <div className="col me-2">
                                <label className='small text-muted'>Ráfaga de CPU</label>
                                <input required onChange={(e) => handleInputChange(e)} min="1" value={data.cpu} name='cpu' type="number" id="cpuProcessRegister" className="form-control" placeholder="Ej. 4" />
                            </div>
                            <div className="col">
                                <label className='small text-muted'>Prioridad</label>
                                <input onChange={(e) => handleInputChange(e)} min="1" value={data.priority} name='priority' type="number" id="prioridadProcessRegister" className="form-control" placeholder="Ej. 1" />
                            </div>
                        </div>
                    </div>
                    <button type='submit' id='submitProcess' form='addProcess' className="btn btn-secondary col-md-12 mt-3 mb-2">Agregar Proceso</button>

                    <div className='d-flex flex-row table-responsive mt-2 table-wrapper '>
                        <ProcessesTable processes={thread} />
                    </div>

                </form>
            </div>


            <div className="modal-footer">
                <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddThreadModal(false)} >Cerrar</button>
                <button form='addThread' id='addThreadBtn' type="submit" className="btn btn-primary">Guardar Hilo</button>
            </div>
        </Modal>
    )
}

export default AddThreadModal