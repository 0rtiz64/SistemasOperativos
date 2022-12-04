import { useEffect } from 'react'

const NRU = ({ setTable, refs, frames }) => {
    const toReplaceIndex = (queue, refs, step) => {
        let index = 0;
        let longest = -1;

        for (let i = 0; i < queue.length; i++) {
            let cont = 0;

            for (let j = step - 1; j > 0; j--) {
                if (refs[j].name !== queue[i].name) cont++;
                else break;
            }

            if (cont > longest) {
                index = i;
                longest = cont;
            }
        }

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
                        queue[toReplaceIndex(queue, refs, i)] = { ...item, arrivalTime: i };
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

export default NRU