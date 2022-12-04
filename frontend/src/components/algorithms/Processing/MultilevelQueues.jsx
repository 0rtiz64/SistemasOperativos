import React, { useEffect, useState } from 'react'
import TableContent from '../../TableContent';



const MultilevelQueues = ({ setProcessStatesHistory, processes, setProcesses, quantum }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    const nextProcess = (array, running) => {
        let arrayClon = [...array].filter(item => {
            return item.id !== running.id
        });

        let siguiente = arrayClon[0];

        if (arrayClon.length === 0) {
            return 0;
        }

        arrayClon.forEach((item, index) => {
            if (item.cpu < siguiente.cpu) {
                siguiente = item;
            }
        });

        return array.indexOf(siguiente);
    }


    useEffect(() => {
        if (processes[0].movements.length !== 0) {
            setRows([]);
            return;
        }

        let tempRows = [];
        let ready = processes.map(item => ({ ...item }));  //Lista de listos
        let running = { id: 9999999, priority: 9999999, cpu: 9999999, movements: [] }; //Proceso que se esta ejecutando
        let seconds = 0; //Tiempo de cpu transcurrido
        let blockeds = [];
        let processStatesHistory = [];

        let median = Math.round(ready.length / 2);
        let queue1 = ready.slice(0, median);
        let queue2 = ready.slice(median, ready.length);

        const SJF = (ready) => {
            do {
                let index = 0;
                let flag = false;

                if (blockeds.length === 1 && ready.length === 0) {
                    ready.push({ ...blockeds[0] });
                    running = { ...blockeds[0] };
                    blockeds = [];
                    flag = true;
                } else if (blockeds.length > 1 || (blockeds.length === 1 && blockeds[0].id !== running.id)) {
                    index = nextProcess(blockeds, running);
                    running = { ...blockeds[index] };
                    ready.push({ ...blockeds[index] });
                    blockeds.splice(index, 1);
                    flag = true;
                } else {
                    index = nextProcess(ready, running);
                    running = { ...ready[index] };
                }

                if (flag) processStatesHistory.push({ name: running.name, timeElapse: seconds, state: "Listo" });
                processStatesHistory.push({ name: running.name, timeElapse: seconds, state: "Ejecución" });

                if (quantum <= running.cpu) { //Restamos el tiempo de cpu
                    running.cpu -= quantum;
                    running.movements.push([seconds, seconds + quantum])
                    seconds += quantum;
                } else {
                    running.movements.push([seconds, seconds + running.cpu])
                    seconds += running.cpu;
                    running.cpu = 0;
                }

                let tempProcesses = processes;
                let processesIndex;
                for (let i = 0; i < processes.length; i++) {
                    if (processes[i].id === running.id) {
                        processesIndex = i;
                    }
                }

                tempProcesses[processesIndex].movements = running.movements;

                for (let i = 0; i < ready.length; i++) {
                    if (ready[i].id === running.id) {
                        index = i;
                    }
                }

                if (running.cpu === 0) {
                    tempRows.push(processes[processesIndex]);
                    setRows(tempRows);
                    ready.splice(index, 1);
                    processStatesHistory.push({ name: running.name, timeElapse: seconds, state: "Terminado" });
                } else if (running.cpu > quantum) {
                    blockeds.push({ ...running });
                    ready.splice(index, 1);
                    processStatesHistory.push({ name: running.name, timeElapse: seconds, state: "Bloqueado" });

                } else {
                    ready[index].cpu = running.cpu;
                    processStatesHistory.push({ name: running.name, timeElapse: seconds, state: "Listo" });
                }

                setProcesses(tempProcesses);

            } while (ready.length !== 0 || blockeds.length !== 0);
        }

        const RR = (ready) => {
            let j = 0, time, i;
            let flag = false;

            for (i = 0; j < ready.length; i = (i + 1) % ready.length) {
                if (ready[i].cpu > 0 && seconds >= ready[i].arrivalTime) {
                    if (ready[i].blocked === true) {
                        processStatesHistory.push({ name: ready[i].name, timeElapse: seconds, state: "Listo" });
                        ready[i].blocked = false;
                    }

                    processStatesHistory.push({ name: ready[i].name, timeElapse: seconds, state: "Ejecución" });

                    flag = true;
                    if (ready[i].cpu <= quantum) {
                        time = ready[i].cpu;
                        processStatesHistory.push({ name: ready[i].name, timeElapse: seconds + time, state: "Terminado" });
                    } else {
                        time = quantum;
                        if (ready[i].cpu - quantum <= quantum) processStatesHistory.push({ name: ready[i].name, timeElapse: seconds + time, state: "Listo" });
                    }

                    ready[i].movements.push([seconds, seconds + time])
                    ready[i].cpu -= time;

                    if (ready[i].cpu === 0) {
                        j++;
                    }

                    seconds += time;
                    if (ready[i].cpu > quantum) {
                        ready[i].blocked = true;
                        processStatesHistory.push({ name: ready[i].name, timeElapse: seconds, state: "Bloqueado" });
                    }
                }
                if (i === ready.length - 1) {
                    if (!flag) {
                        let it;
                        let diff = 0;
                        for (it = 0; it < ready.length; it++) {
                            if (seconds < ready[it].arrivalTime) {
                                if (diff === 0) {
                                    diff = ready[it].arrivalTime - seconds;
                                } else if (diff > ready[it].arrivalTime - seconds) {
                                    diff = ready[it].arrivalTime - seconds;
                                }
                            }
                            seconds += diff;
                        }
                    }
                    flag = false;
                }
            }
        }

        SJF(queue1);
        RR(queue2);
        setRows(processes);


        //Ordenamos segun el orden de ejecución
        setRows(rows => rows = rows.sort((process1, process2) => {
            if (process1.movements[0][0] > process2.movements[0][0]) return 1;
            if (process1.movements[0][0] < process2.movements[0][0]) return -1;
            if (process1.movements[process1.movements.length - 1][1] > process2.movements[process2.movements.length - 1][1]) return 1;
            if (process1.movements[process1.movements.length - 1][1] < process2.movements[process2.movements.length - 1][1]) return -1;
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
        setProcessStatesHistory(processStatesHistory);

    }, [processes, setProcesses, quantum, setProcessStatesHistory])

    return (
        <TableContent greater={greater} rows={rows} processes={processes} />
    )
}

export default MultilevelQueues