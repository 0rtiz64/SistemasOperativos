import React from 'react'

const Statistics = ({ table, refs }) => {
    return (
        <div className='d-flex flex-column'>
            <div>
                Fallos: {table.faults.filter(item => item === 1).length}
            </div>
            <div>
                Aciertos: {refs.length - table.faults.filter(item => item === 1).length}
            </div>
            <div>
                Probabilidad de fallos: {(table.faults.filter(item => item === 1).length / refs.length).toFixed(2)}
            </div>
            <div>
                Rendimiento: {(1 - (table.faults.filter(item => item === 1).length / refs.length)).toFixed(2)}
            </div>

        </div>
    )
}

export default Statistics