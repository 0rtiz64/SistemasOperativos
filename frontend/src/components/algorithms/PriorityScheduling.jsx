import React, { useEffect, useState } from 'react'
import TableContent from '../TableContent';


const PriorityScheduling = ({ processes, setProcesses, quantum }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    const nextProcess = (array, running) => {
        let arrayClon = [...array].filter(item => {
            return item.id !== running.id
        });

        let next = arrayClon[0];

        if (arrayClon.length === 0) {
            return 0;
        }

        arrayClon.forEach((item, index) => {
            if (item.priority < next.priority) {
                next = item;
            }
        });

        return array.indexOf(next);
    }

    useEffect(() => {
        if (processes[0].movements.length !== 0) {
            setRows([]);
            return;
        }

        const resolve = () => {
            let tempRows = [];
            let ready = processes.map(item => ({ ...item }));  //Lista de listos
            let running = { id: 9999999, priority: 9999999, cpu: 9999999, movements: [] }; //Proceso que se esta ejecutando
            let seconds = 0; //Tiempo de cpu transcurrido
            let blockeds = [];

            do {
                let index = 0;

                if (blockeds.length === 1 && ready.length === 0) {
                    ready.push({ ...blockeds[0] });
                    running = { ...blockeds[0] };
                    blockeds = [];
                } else if (blockeds.length > 1 || (blockeds.length === 1 && blockeds[0].id !== running.id)) {
                    index = nextProcess(blockeds, running);
                    running = { ...blockeds[index] };
                    ready.push({ ...blockeds[index] });
                    blockeds.splice(index, 1);
                } else {
                    index = nextProcess(ready, running);
                    running = { ...ready[index] };
                }

                if (quantum <= running.cpu) { //Restamos el tiempo de cpu
                    running.cpu -= quantum;
                    running.movements.push([seconds, seconds + quantum])
                    seconds += quantum;
                } else {
                    running.movements.push([seconds, seconds + running.cpu])
                    seconds += running.cpu;
                    running.cpu = 0;
                }

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

                if (running.cpu === 0) {
                    tempRows.push(processes[processesIndex]);
                    setRows(tempRows);
                    ready.splice(index, 1);
                } else if (running.cpu > quantum) {
                    blockeds.push({ ...running });
                    ready.splice(index, 1);
                } else {
                    ready[index].cpu = running.cpu;
                }

            } while (ready.length !== 0 || blockeds.length !== 0);
        }

        resolve();

        //Ordenamos segun el orden de ejecución
        setRows(rows => rows = rows.sort((process1, process2) => {
            if (process1.movements[0][0] > process2.movements[0][0]) return 1;
            if (process1.movements[0][0] < process2.movements[0][0]) return -1;
            if (process1.movements[process1.movements.length - 1][1] < process2.movements[process2.movements.length - 1][1]) return 1;
            if (process1.movements[process1.movements.length - 1][1] > process2.movements[process2.movements.length - 1][1]) return -1;
            return 0;
        }))
        
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
        <TableContent greater={greater} rows={rows} processes={processes} />
    )
}

export default PriorityScheduling