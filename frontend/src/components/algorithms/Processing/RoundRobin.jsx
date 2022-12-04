import React, { useEffect, useState } from 'react'
import TableContent from '../../TableContent';



const RoundRobin = ({ setProcessStatesHistory, processes, quantum }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    useEffect(() => {
        if (processes[0].movements.length !== 0) {
            setRows([]);
            return;
        }

        let processStatesHistory = [];


        const resolve = () => {
            let j = 0, time, i;

            let ready = processes.map(item => ({ ...item }));
            ready = ready.sort((process1, process2) => {
                if (process1.arrivalTime > process2.arrivalTime) return 1;
                if (process1.arrivalTime < process2.arrivalTime) return -1;
                return 0;
            })

            let flag = false;
            let seconds = 0;

            for (i = 0; j < processes.length; i = (i + 1) % processes.length) {

                if (ready[i].arrivalTime !== 0 && seconds === 0) {
                    seconds += ready[i].arrivalTime;
                }


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
                if (i === processes.length - 1) {
                    if (!flag) {
                        let it;
                        let diff = 0;
                        for (it = 0; it < processes.length; it++) {
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

            setRows(ready);
        }

        resolve();
        setProcessStatesHistory(processStatesHistory);

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

    }, [processes, quantum, setProcessStatesHistory]);

    return (
        <TableContent greater={greater} rows={rows} processes={processes} />
    )
}

export default RoundRobin