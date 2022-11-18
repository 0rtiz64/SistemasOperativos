import React from 'react'
import Details from './Details'
import Graphic from './Graphic'

const Output = ({ outputRef, selectedAlgorithm, processes, setProcesses, quantum }) => {
    
    return (
        <React.Fragment>
            <div ref={outputRef} className='p-3 bg-white border shadow rounded-border' id="output">

                <label className='small mt-3'><strong>Resultados</strong></label>
                <hr className='mb-2 mt-1' />

                <section className='d-flex flex-column mt-2'>
                    <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                        <button className="nav-link text-dark active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Tabla</button>
                        <button className="nav-link text-dark" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Detalles</button>
                        <button className="nav-link text-dark" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Gráfico</button>
                    </div>
                    {
                        processes.length !== 0 ?
                        <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                            <table className="table table-sm table-bordered" >
                                <thead className='bg-light'>
                                    <tr>
                                        <th className='text-center'>#</th>
                                        <th className='small'>Nombre del proceso</th>
                                        <th className='small'>Tiempo (s)</th>
                                        <th className='small'>Estado</th>
                                    </tr>
                                </thead>
                                <tbody className='border-1'>

                                </tbody>
                            </table>
                        </div>

                        <div className="tab-pane fade mt-2 table-responsive " id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                            <Graphic selectedAlgorithm={selectedAlgorithm} processes={processes} setProcesses={setProcesses} quantum={quantum} />
                        </div>

                        <div className="tab-pane fade table-responsive" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <Details processes={processes}/>
                        </div>
                    </div>
                    :
                    <div className='text-center text-muted m-3'>
                        La tabla, gráfica y estadísticas se mostraran aquí.
                    </div>    
                }

                </section>
            </div>

        </React.Fragment>
    )
}

export default Output