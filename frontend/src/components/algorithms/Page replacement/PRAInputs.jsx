import React, { useState } from 'react'
import Optimal from './Optimal'
import Clock from './Clock'
import FIFO from './FIFO'
import NRU from './NRU'
import SecondChance from './SecondChance'

const PRAInputs = ({ setTable, refs, setRefs, frames, setFrames }) => {
    const [data, setData] = useState({ refs: '', frames: '', selectedPRA: '1' });
    const [selectedPRA, setSelectedPRA] = useState('1');

    const isDataValid = () => {
        let valid = true;
        let list = data.refs.split(' ');

        list.forEach((item) => {
            if (item === '') {
                valid = false;
            }
        });

        if (isNaN(parseInt(data.frames))) {
            valid = false;
        }

        return valid;
    }

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const execPRA = () => {
        switch (selectedPRA) {
            case "1":
                return <Optimal setTable={setTable} refs={refs} frames={frames} />
            case "2":
                return <FIFO setTable={setTable} refs={refs} frames={frames} />
            case "3":
                return <NRU setTable={setTable} refs={refs} frames={frames} />
            case "4":
                return <SecondChance setTable={setTable} refs={refs} frames={frames} />
            case "5":
                return <Clock setTable={setTable} refs={refs} frames={frames} />
            default:
                break;
        }
    }

    const resolve = () => {
        console.log('s')
        if (isDataValid()) {
            let list = data.refs.split(' ');
            list = list.map((item) => {
                return {
                    name: item,
                    bits: { R: 0, M: 0 },
                    arrivalTime: 0
                }
            });

            setRefs(list)
            setFrames(parseInt(data.frames));
            setSelectedPRA(data.selectedPRA);
        }
    }

    return (

        <div className='d-flex flex-column'>
            {execPRA()}
            <div className='d-flex flex-row mt-4 mb-4'>
                <div className="col-md-2 flex-fill me-2">
                    <label className='small text-muted mt-2'><strong>String de referencias</strong></label>
                    <input className='form-control me-2' onChange={handleInputChange} name='refs' value={data.refs} type={'text'} placeholder='ej. a b c e a' />
                </div>
                <div className="col-md-2 flex-fill me-2">
                    <label className='small text-muted mt-2'><strong>Número de marcos</strong></label>
                    <input className='form-control me-2' onChange={handleInputChange} name='frames' value={data.frames} type={'number'} min='1' placeholder='ej. 3' />
                </div>
                <div className='col-md-3 flex-fill me-2'>
                    <label className='small text-muted mt-2'><strong>Algoritmo</strong></label>
                    <select onChange={e => setData({ ...data, selectedPRA: e.target.value })} className='form-control me-2'>
                        <option value='1'>Optimo</option>
                        <option value='2'>FIFO</option>
                        <option value='3'>NRU</option>
                        <option value='4'>Segunda oportunidad</option>
                        <option value='5'>Reloj</option>
                    </select>
                </div>
            </div>
            <div className='flex-fill'>
                <button onClick={() => resolve()} className='btn btn-primary form-control'>Resolver</button>
            </div>
        </div>
    )
}


export default PRAInputs