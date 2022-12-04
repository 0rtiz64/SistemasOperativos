import React from 'react'
import PRAInputs from './algorithms/Page replacement/PRAInputs';
import PSAInputs from './algorithms/Processing/PSAInputs';

const Input = ({ setTable, setType, type, refs, setRefs, frames, setFrames, setProcessStatesHistory, setStatesHistoryTable, outputRef, setProcessesList, setSelectedAlgorithm, setQuantum }) => {

    return (
        <section className='p-4 bg-white shadow rounded-border mb-4'>
            <label className='small mt-3'><strong>Configuración</strong></label>
            <hr className='mb-2 mt-1' />
            <div className="col flex-fill me-2">
                <label className='small text-muted mt-2'><strong>Tipo</strong></label>
                <select onChange={(e) => setType(e.target.value)} id="tipoAlgoritmo" className="form-control">
                    <option value="1">Procesamiento</option>
                    <option value="2">Memoria</option>
                </select>
            </div>
            {
                type === '1'
                &&
                <PSAInputs
                    outputRef={outputRef}
                    setProcessesList={setProcessesList}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                    setQuantum={setQuantum}
                    setProcessStatesHistory={setProcessStatesHistory}
                    setStatesHistoryTable={setStatesHistoryTable}
                />
            }

            {
                type === '2' &&
                <PRAInputs
                    setTable={setTable}
                    refs={refs}
                    setRefs={setRefs}
                    frames={frames}
                    setFrames={setFrames}
                />
            }
        </section>
    )
}

export default Input