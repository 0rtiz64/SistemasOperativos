import React, { useEffect, useState } from 'react'
import Details from './Details'
import Graphic from './Graphic'

const Output = ({ statesHistoryTable, setStatesHistoryTable, processStatesHistory, setProcessStatesHistory, outputRef, selectedAlgorithm, processes, setProcesses, quantum }) => {
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        if (showTable) {
            if (processStatesHistory.length === 0) {
                return;
            }

            const interval = setInterval(function () {
                if (processStatesHistory.length === 0) {
                    return;
                }
                let temp = [...statesHistoryTable];
                temp.push(processStatesHistory[0]);
                setStatesHistoryTable(temp)

                let t = [...processStatesHistory];
                t.splice(0, 1);
                setProcessStatesHistory(t);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [statesHistoryTable, setProcessStatesHistory, processStatesHistory, setStatesHistoryTable, showTable]);

    return (
        <React.Fragment>
            <div ref={outputRef} className='p-3 bg-white border shadow rounded-border' id="output">

                <label className='small mt-3'><strong>Resultados</strong></label>
                <hr className='mb-2 mt-1' />
                {
                    processes.length !== 0 ?

                        <section className='d-flex flex-column mt-2'>
                            <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                                <button className="nav-link text-dark active" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Gráfico</button>
                                <button onClick={() => setShowTable(true)} className="nav-link text-dark" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Tabla</button>
                                <button className="nav-link text-dark" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Detalles</button>
                            </div>

                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show mt-2 table-responsive active" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                    <Graphic setProcessStatesHistory={setProcessStatesHistory} selectedAlgorithm={selectedAlgorithm} processes={processes} setProcesses={setProcesses} quantum={quantum} />
                                </div>

                                <div className="tab-pane fade" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="d-flex flex-row justify-content-center">
                                        <div className='col-md-10 col table-responsive'>
                                            {showTable &&
                                                <table className="table table-sm table-bordered table-striped" >
                                                    <thead align={'center'} className='bg-light'>
                                                        <tr>
                                                            <th style={{ width: '5%' }} scope="col" className='small text-center'>#</th>
                                                            <th style={{ width: '20%' }} scope="col" className='small'>Nombre del proceso</th>
                                                            <th style={{ width: '20%' }} scope="col" className='small'>Tiempo (s)</th>
                                                            <th style={{ width: '10%' }} scope="col" className='small'>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='border-1' id='slider' align={'center'}>
                                                        {
                                                            statesHistoryTable.map((item, index) => {
                                                                return <tr className='slide-in' key={index} >
                                                                    <th className='text-center'>{index + 1}</th>
                                                                    <td className='col'>{item.name}</td>
                                                                    <td className='small'>{item.timeElapse}</td>
                                                                    <td className='small'>
                                                                        <div className='w-100 d-flex'>
                                                                            {
                                                                                item.state === 'Listo' &&
                                                                                <span className='bg-primary text-center flex-fill rounded-1 text-white p-1'><strong>{item.state}</strong></span>
                                                                            }{
                                                                                item.state === 'Bloqueado' &&
                                                                                <span className='bg-danger text-center flex-fill rounded-1 text-white p-1'><strong>{item.state}</strong></span>
                                                                            }{
                                                                                item.state === 'Ejecución' &&
                                                                                <span className='bg-success text-center flex-fill rounded-1 text-white p-1'><strong>{item.state}</strong></span>
                                                                            }{
                                                                                item.state === 'Terminado' &&
                                                                                <span className='bg-secondary text-center flex-fill rounded-1 text-white p-1'><strong>{item.state}</strong></span>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className='table-responsive d-flex flex-row justify-content-center'>
                                        <div className='col-md-8 col'>
                                            <Details processes={processes} quantum={quantum} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </section>
                        :
                        <div className='text-center text-muted mt-4'>
                            La tabla, gráfica y estadísticas se mostraran aquí.
                        </div>
                }

            </div>

        </React.Fragment>
    )
}

export default Output