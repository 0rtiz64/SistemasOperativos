import React, { useEffect, useState } from 'react'
import TableContent from '../TableContent';


const RoundRobin = ({ processes, quantum }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    useEffect(() => {
        if (processes[0].movements.length !== 0) {
            setRows([]);
            return;
        }

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
                    flag = true;
                    if (ready[i].cpu <= quantum) {
                        time = ready[i].cpu;
                    } else {
                        time = quantum;
                    }

                    ready[i].movements.push([seconds, seconds + time])
                    ready[i].cpu -= time;

                    if (ready[i].cpu === 0) {
                        j++;
                    }

                    seconds += time;
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

        let greater = 0;

        for (let j = 0; j < processes.length; j++) {
            let item = processes[j];

            if (item.movements[item.movements.length - 1][1] > greater) {
                greater = item.movements[item.movements.length - 1][1];
            }
        }

        setGreater(greater);

    }, [processes, quantum]);

    return (
        <TableContent greater={greater} rows={rows} processes={processes} />
    )
}

export default RoundRobin