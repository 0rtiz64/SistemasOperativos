import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import TableContent from '../TableContent';

const LotteryScheduling = ({ processes, setProcesses, quantum }) => {
    const [rows, setRows] = useState([]);
    const [greater, setGreater] = useState([]);

    const shareTickets = (list) => {
        //El total de tickets a repartir va a ser 5 veces la cantidad de procesos
        let toShareTickets = list.length * 5;

        //El porcentaje de tickets a dar a cada proceso por unidad de prioridad
        let sharePercentage = 0;

        list.forEach(item => {
            sharePercentage += item.priority;
        })

        sharePercentage = 1 / sharePercentage;

        let tempProcesses = list.map(item => ({ ...item }));
        let newGlobalTickets = 0;

        tempProcesses.forEach(item => {
            newGlobalTickets += Math.round(item.priority * sharePercentage * toShareTickets);
            item.tickets = newGlobalTickets;
        })


        return [tempProcesses, newGlobalTickets];
    }

    const findWinner = (list, globalTickets) => {
        if (list.length === 1) {
            return 0;
        }

        //Genera un número aleatorio entre 1 y la cantidad de tickets
        const lotteryWinner = Math.floor(Math.random() * globalTickets) + 1;
        let sum = 0;

        for (let index = 0; index < list.length; index++) {
            sum += list[index].tickets;
            if (sum >= lotteryWinner) {
                return index;
            }
        }
    }

    useEffect(() => {
        return;
    }, [setProcesses])


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
            let globalTickets = ready.length * 5;

            let shareTicketsResults = shareTickets(ready);
            ready = shareTicketsResults[0];
            globalTickets = shareTicketsResults[1];

            do {
                const winner = findWinner(ready, globalTickets);
                running = { ...ready[winner] };

                if (quantum <= running.cpu) { //Restamos el tiempo de cpu
                    running.cpu -= quantum;
                    running.movements.push([seconds, seconds + quantum])
                    seconds += quantum;
                } else {
                    running.movements.push([seconds, seconds + running.cpu])
                    seconds += running.cpu;
                    running.cpu = 0;
                }

                //Agregamos el movimiento
                let processesIndex;
                for (let i = 0; i < processes.length; i++) {
                    if (processes[i].id === running.id) {
                        processesIndex = i;
                    }
                }

                let tempProcesses = processes;
                tempProcesses[processesIndex].movements = running.movements;
                setProcesses(tempProcesses);

                let index = 0;

                for (let i = 0; i < ready.length; i++) {
                    if (ready[i].id === running.id) {
                        index = i;
                    }
                }

                if (running.cpu === 0) {
                    tempRows.push(processes[processesIndex]);
                    setRows(tempRows);
                    ready.splice(index, 1);

                    shareTicketsResults = shareTickets(ready);
                    ready = shareTicketsResults[0];
                    globalTickets = shareTicketsResults[1];
                } else {
                    ready[index].cpu = running.cpu;
                }

            } while (ready.length !== 0 || blockeds.length !== 0) //Seguir iterando mientras haya algun proceso
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

export default LotteryScheduling