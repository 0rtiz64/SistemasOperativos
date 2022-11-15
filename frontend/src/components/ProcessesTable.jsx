import React from 'react'

const ProcessesTable = ({ processes }) => {
    return (
        <table className="table table-sm table-bordered" >
            <thead className='bg-light'>
                <tr>
                    <th className='text-center'>#</th>
                    <th className='small'>Nombre</th>
                    <th className='small'>Tiempo de llegada</th>
                    <th className='small'>Ráfaga de CPU</th>
                    <th className='small'>Prioridad</th>
                </tr>
            </thead>
            <tbody className='border-1'>
                {processes.map((item, index) => {
                    return (
                        <tr key={index}>
                            <th className='text-center'>{index + 1}</th>
                            <td>{item.nombreProceso}</td>
                            <td>{item.tLlegada}</td>
                            <td>{item.cpu}</td>
                            <td>{item.prioridad}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>

    )
}

export default ProcessesTable