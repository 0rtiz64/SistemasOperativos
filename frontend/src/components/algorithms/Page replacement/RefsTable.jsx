import React from 'react'

const RefsTable = ({ refs, frames, table, showBits }) => {
    const Frames = () => {
        let foo = [];
        let key = 0;

        for (let i = 0; i < frames; i++) {
            let aux = [];
            aux.push(<th key={i + 100} scope='row' style={{ width: '15%' }}>{i}</th>)

            for (let j = 0; j < table.stacks.length; j++) {
                if (table.stacks[j][i] !== undefined) {
                    aux.push(
                        <td key={key}>
                            <div className='d-flex flex-row justify-content-center'>
                                <div className='text-center me-1'>{table.stacks[j][i].name}</div>
                                {
                                    showBits &&
                                    <div className='d-flex flex-row'>
                                        <div className='text-center me-1 text-primary' style={{ fontSize: '10px' }}>
                                            {table.stacks[j][i].bits.R}
                                        </div>
                                        {/*<div className='text-center text-muted mt-auto me-1' style={{ fontSize: '10px' }}>
                                            {table.stacks[j][i].bits.M}
                                        </div> */}
                                    </div>
                                }
                            </div>
                        </td>
                    )

                } else {
                    aux.push(<td key={key}></td>)
                }
                key++;
            }

            foo.push(<tr key={i}>{aux}</tr>)
        }

        return foo;
    }

    return (
        table.stacks.length !== 0 &&
        <table className='table table-bordered'>
            <thead >
                <tr>
                    <th>Marcos</th>
                    {
                        refs.map((item, index) => {
                            return <th key={index} scope='col'>{item.name}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {Frames()}
                <tr>
                    <td></td>
                    {
                        table.faults.map((item, index) => {
                            return <td key={index} className={`bg-${item === 1 ? 'danger' : 'success'} border flex-fill text-center text-white`}>{item === 1 ? 'x' : '-'}</td>
                        })
                    }
                </tr>
            </tbody>
        </table>
    )
}

export default RefsTable