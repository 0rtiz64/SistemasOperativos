import React from 'react'
import { useEffect, useState } from 'react';
import TableContent from '../TableContent';


const PriorityPreemtive = ({ processes, setProcesses }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    useEffect(() => {
        if (processes[0].movements.length !== 0) {
            setRows([]);
            return;
        }
        let currentTime;

        const addProcessMovement = (running, startTime, finishTime) => {
            let tempProcesses = processes;
            let index = tempProcesses.findIndex(item => item.id === running.id);
            tempProcesses[index].movements.push([startTime, finishTime]);
            setProcesses(tempProcesses);
        }

        //Hacemos una copia de los procesos para trabajar eso y los ordenamos por prioridad y tiempo de llegada
        const processesInfo = processes
            .map((item) => {
                return {
                    id: item.id,
                    arrivalTime: item.arrivalTime,
                    cpu: item.cpu,
                    priority: item.priority,
                };
            })
            .sort((process1, process2) => {
                if (process1.arrivalTime > process2.arrivalTime) return 1;
                if (process1.arrivalTime < process2.arrivalTime) return -1;
                if (process1.priority > process2.priority) return 1;
                if (process1.priority < process2.priority) return -1;
                return 0;
            });

        const readyQueue = [];

        currentTime = processesInfo[0].arrivalTime;
        const unfinishedJobs = [...processesInfo];

        const remainingTime = processesInfo.reduce((acc, process) => {
            acc[process.id] = process.cpu;
            return acc;
        }, {});

        readyQueue.push(unfinishedJobs[0]);
        while (
            Object.values(remainingTime).reduce((acc, cur) => {
                return acc + cur;
            }, 0) &&
            unfinishedJobs.length > 0
        ) {
            let prevIdle = false;
            if (readyQueue.length === 0 && unfinishedJobs.length > 0) {
                prevIdle = true;
                readyQueue.push(unfinishedJobs[0]);
            }

            readyQueue.sort((a, b) => {
                //Los procesos que tenga la misma prioridad se toman por orden de llegada
                if (a.priority > b.priority) return 1;
                if (a.priority < b.priority) return -1;
                return 0;
            });

            const processToExecute = readyQueue[0];

            const processATLessThanBT = [];
            for (let i = 0; i < processesInfo.length; i++) {
                const item = processesInfo[i];
                let curr = currentTime;
                if (prevIdle) {
                    curr = processToExecute.arrivalTime;
                }

                if (
                    item.arrivalTime <= remainingTime[processToExecute.id] + curr &&
                    item !== processToExecute &&
                    !readyQueue.includes(item) &&
                    unfinishedJobs.includes(item)
                ) {
                    processATLessThanBT.push(item);
                }
            }

            let gotInterruption = false;

            for (let i = 0; i < processATLessThanBT.length; i++) {
                const item = processATLessThanBT[i];
                if (prevIdle) {
                    currentTime = processToExecute.arrivalTime;
                }

                const amount = item.arrivalTime - currentTime;

                if (currentTime >= item.arrivalTime) {
                    readyQueue.push(item);
                }

                if (item.priority < processToExecute.priority) {
                    remainingTime[processToExecute.id] -= amount;
                    readyQueue.push(item);
                    const prevCurrentTime = currentTime;
                    currentTime += amount;

                    addProcessMovement(processToExecute, prevCurrentTime, currentTime);

                    gotInterruption = true;
                    break;
                }
            }

            let processToArrive = [];

            for (let i = 0; i < processesInfo.length; i++) {
                if (
                    processesInfo[i].arrivalTime <= currentTime &&
                    processesInfo[i] !== processToExecute &&
                    !readyQueue.includes(processesInfo[i]) &&
                    unfinishedJobs.includes(processesInfo[i])
                ) {
                    processToArrive.push(processesInfo[i]);
                }
            }

            readyQueue.push(...processToArrive);

            if (!gotInterruption) {
                if (prevIdle) {
                    const remainingT = remainingTime[processToExecute.id];
                    remainingTime[processToExecute.id] -= remainingT;
                    currentTime = processToExecute.arrivalTime + remainingT;

                    for (let i = 0; i < processATLessThanBT.length; i++) {
                        const item = processATLessThanBT[i];
                        if (currentTime >= item.arrivalTime) {
                            readyQueue.push(item);
                        }
                    }

                    //Actualizamos los movimientos de ese proceso
                    addProcessMovement(processToExecute, processToExecute.arrivalTime, currentTime);


                } else {
                    const remainingT = remainingTime[processToExecute.id];
                    remainingTime[processToExecute.id] -= remainingT;
                    const prevCurrentTime = currentTime;
                    currentTime += remainingT;

                    for (let i = 0; i < processATLessThanBT.length; i++) {
                        const item = processATLessThanBT[i];
                        if (currentTime >= item.arrivalTime && !readyQueue.includes(item)) {
                            readyQueue.push(item);
                        }
                    }

                    addProcessMovement(processToExecute, prevCurrentTime, currentTime);
                }
            }

            // Movemos el proceso que acabos de ejecutar al final de la cola
            readyQueue.push(readyQueue.shift());

            //Cuando el proceso termine de ejecutarse
            if (remainingTime[processToExecute.id] === 0) {
                const indexToRemoveUJ = unfinishedJobs.indexOf(processToExecute);
                if (indexToRemoveUJ > -1) {
                    unfinishedJobs.splice(indexToRemoveUJ, 1);
                }
                const indexToRemoveRQ = readyQueue.indexOf(processToExecute);
                if (indexToRemoveRQ > -1) {
                    readyQueue.splice(indexToRemoveRQ, 1);
                }
            }
        }

        //Ordenamos en orden de llegada para mostrar en el grafico
        setRows(processes);

        let greater = 0;

        for (let j = 0; j < processes.length; j++) {
          let item = processes[j];
    
          if (item.movements[item.movements.length - 1][1] > greater) {
            greater = item.movements[item.movements.length - 1][1];
          }
        }
    
        setGreater(greater);
    
    }, [processes, setProcesses]);


    return (
        <TableContent greater={greater} rows={rows} processes={processes}/>
      )
}

export default PriorityPreemtive