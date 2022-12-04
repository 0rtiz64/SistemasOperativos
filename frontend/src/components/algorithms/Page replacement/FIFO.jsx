import { useEffect } from 'react'

const FIFO = ({ setTable, refs, frames }) => {

    const findLeast = (queue) => {
        let least = queue[0];
        let index = 0;

        queue.forEach((process, i) => {
            if (process.arrivalTime < least.arrivalTime) {
                least = process;
                index = i;
            }
        });

        return index;
    }

    useEffect(() => {
        let queue = [];
        let tempStacks = [];
        let tempFaults = [];

        const resolve = () => {
            for (let i = 0; i < refs.length; i++) {
                const item = refs[i];

                if ((queue.findIndex(process => process.name === item.name) !== -1)) { //Si ya está en la cola
                    tempFaults[i] = 0;
                } else {
                    if (queue.length === frames) { //Si la cola está llena
                        queue[findLeast(queue)] = { ...item, arrivalTime: i };
                    } else {
                        queue.push({ ...item, arrivalTime: i });
                    }
                    tempFaults[i] = 1;
                }
                tempStacks.push(structuredClone(queue));
            }
        }
        resolve();
        setTable(table => table = { ...table, stacks: tempStacks, faults: tempFaults });

    }, [frames, refs, setTable]);
    return(
        <div></div>
    )
}

export default FIFO