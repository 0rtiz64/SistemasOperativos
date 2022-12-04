import React from 'react'
import { useEffect, useState } from 'react';
import TableContent from '../../TableContent';

const GuaranteedScheduling = ({ setProcessStatesHistory, processes, setProcesses, quantum }) => {
  const [rows, setRows] = useState([]);
  const [greater, setGreater] = useState([]);

  const nextProcess = (readyQueue, timeElapse) => {
    let alredyArrived = readyQueue.filter(item => item.arrivalTime <= timeElapse);
    let nonArrived = readyQueue.filter(item => item.arrivalTime > timeElapse);

    let next = alredyArrived[0];
    if (timeElapse === 0 && alredyArrived.length !== 0) {
      return [{ ...next }, timeElapse]
    } else if (timeElapse === 0 && nonArrived.length !== 0) {
      next = nonArrived[0];
      timeElapse = nonArrived[0].arrivalTime;
      return [{ ...next }, timeElapse]
    }


    for (let i = 0; i < alredyArrived.length; i++) {
      let item = alredyArrived[i];
      let ratio1 = item.usedTime / (timeElapse / readyQueue.length);
      let ratio2 = next.usedTime / (timeElapse / readyQueue.length);

      if (ratio1 < ratio2) next = item;
    }

    if (alredyArrived.length === 0 && nonArrived.length !== 0) {
      next = nonArrived[0];
      timeElapse = nonArrived[0].arrivalTime;
    }

    return [{ ...next }, timeElapse];
  }

  useEffect(() => {
    if (processes[0].movements.length !== 0) {
      setRows([]);
      return;
    }

    let processStatesHistory = [];

    const resolve = () => {
      let readyQueue = processes.map(item => { return { ...item } });

      readyQueue = readyQueue.sort((process1, process2) => {
        if (process1.arrivalTime > process2.arrivalTime) return 1;
        if (process1.arrivalTime < process2.arrivalTime) return -1;
        return 0;
      })

      let timeElapse = 0;
      let runningProcess;

      do {
        let aux = nextProcess(readyQueue, timeElapse);
        runningProcess = aux[0];
        timeElapse = aux[1];

        processStatesHistory.push({ name: runningProcess.name, timeElapse, state: "Ejecución" });

        //Al proceso le asignamos el tiempo de quantum
        let time;
        if (runningProcess.cpu <= quantum) {
          time = timeElapse + runningProcess.cpu;
          runningProcess.cpu = 0;
          runningProcess.usedTime += runningProcess.cpu;
        } else {
          time = timeElapse + quantum;
          runningProcess.cpu -= quantum;
          runningProcess.usedTime += quantum;
        }

        runningProcess.movements.push([timeElapse, time]);
        timeElapse = time;

        //Aqui actualizamos ese proceso en la lista de procesos para graficar
        let processesIndex;
        for (let i = 0; i < processes.length; i++) {
          if (processes[i].id === runningProcess.id) {
            processesIndex = i;
          }
        }

        let tempProcesses = processes;
        tempProcesses[processesIndex].movements = runningProcess.movements;
        setProcesses(tempProcesses);

        //Modificamos ese proceso en la cola de listos
        let index;
        for (let i = 0; i < readyQueue.length; i++) {
          if (readyQueue[i].id === runningProcess.id) {
            index = i;
          }
        }

        if (runningProcess.cpu === 0) {
          readyQueue.splice(index, 1);
          processStatesHistory.push({ name: runningProcess.name, timeElapse, state: "Terminado" });
        } else {
          readyQueue[index] = runningProcess;
          processStatesHistory.push({ name: runningProcess.name, timeElapse, state: "Listo" });
        }
      } while (readyQueue.length !== 0);
    }

    resolve();
    setProcessStatesHistory(processStatesHistory);

    setRows(processes);
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

  }, [processes, setProcesses, quantum, setProcessStatesHistory])


  return (
    <TableContent greater={greater} rows={rows} processes={processes} />
  )
}

export default GuaranteedScheduling