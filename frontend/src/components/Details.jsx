import React, { useEffect, useState } from 'react'

const Details = ({ processes }) => {
    const [statistics, setStatistics] = useState({ firstOneRunned: null, lastOneRunned: null, lastOneFinished: null, avgWaitingTime: null });

    useEffect(() => {
        if (processes[0] === undefined) return;

        let firstOneRunned = processes[0];
        let lastOneRunned = processes[0];
        let lastOneFinished = processes[0];

        const firstLast = () => {
            if (processes.length === 0) return;

            for (let i = 0; i < processes.length; i++) {
                let item = processes[i];

                if (item.movements[0][0] < firstOneRunned.movements[0][0]) {
                    firstOneRunned = item;
                }

                if (item.movements[0][0] > lastOneRunned.movements[0][0]) {
                    lastOneRunned = item;
                }

                if (item.movements[item.movements.length - 1][1] > lastOneFinished.movements[lastOneFinished.movements.length - 1][1]) {
                    lastOneFinished = item;
                }
            }

            return { firstOneRunned, lastOneRunned, lastOneFinished }
        }
        
        setStatistics(firstLast())

    }, [processes])


    return (
        <table className="table table-sm table-bordered">
            <tbody align={'left'}>
                <tr>
                    <th className='w-50'>
                        Primero en ejecutarse
                    </th>
                    <td className='w-50'>
                        {statistics.firstOneRunned !== null && statistics.firstOneRunned.name}
                    </td>
                </tr>
                <tr>
                    <th>
                        Ultimo en ejecutarse
                    </th>
                    <td>
                        {statistics.lastOneRunned !== null && statistics.lastOneRunned.name}
                    </td>
                </tr>
                <tr>
                    <th>
                        Ultimo en terminar
                    </th>
                    <td>
                        {statistics.lastOneFinished !== null && statistics.lastOneFinished.name}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Details