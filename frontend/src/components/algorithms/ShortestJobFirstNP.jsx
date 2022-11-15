import React, { useEffect, useState } from 'react'
import TableContent from '../TableContent';


const ShortestJobFirstNP = ({ processes, setProcesses, quantum }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    const nextProcess = (array) => {
        let next = { ...array[0] };
        let index = 0;

        if (array.length === 0) {
            return index;
        }

        array.forEach((item, i) => {
            if (item.arrivalTime < next.arrivalTime) {
                index = i;
            }
        });

        return index;
    }

    useEffect(() => {
        if (isNaN(quantum) || isNaN( processes[0].cpu)) {
            setRows([]);
            return;
        }

        const resolve = () => {
            let tempRows = [];
            let ready = processes.map(item => ({ ...item }));  //Lista de listos
            let seconds = 0; //Tiempo de cpu transcurrido
            let running;

            do {
                let index = 0;
                running = { ...ready[nextProcess(ready)] };

                running.movements.push([seconds, seconds + running.cpu])
                seconds += running.cpu;
                running.cpu = 0;

                let processesIndex;
                for (let i = 0; i < processes.length; i++) {
                    if (processes[i].id === running.id) {
                        processesIndex = i;
                    }
                }

                let tempProcesses = processes;
                tempProcesses[processesIndex].movements = running.movements;
                setProcesses(tempProcesses);

                for (let i = 0; i < ready.length; i++) {
                    if (ready[i].id === running.id) {
                        index = i;
                    }
                }

                tempRows.push(processes[processesIndex]);
                setRows(tempRows);
                ready.splice(index, 1);

            } while (ready.length !== 0);
        }

        resolve();

        let greater = 0;

        for (let j = 0; j < processes.length; j++) {
          let item = processes[j];
    
          if (item.movements[item.movements.length - 1][1] > greater) {
            greater = item.movements[item.movements.length - 1][1];
          }
        }
    
        setGreater(greater);    
    }, [processes, setProcesses, quantum])


    return (
        <TableContent greater={greater} rows={rows} processes={processes}/>
      )
}

export default ShortestJobFirstNP