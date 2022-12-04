import { useEffect } from 'react'

const SecondChance = ({ setTable, refs, frames }) => {
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
                const item = structuredClone(refs[i]);

                let index = queue.findIndex(process => process.name === item.name);
                if (index !== -1) { //Si ya está en la cola
                    queue[index].bits.R = 1;
                    tempFaults[i] = 0;
                } else {
                    if (queue.length === frames) { //Si la cola está llena
                        let tempQueue = structuredClone(queue);
                        let cont = i;

                        while (true) {
                            let index = findLeast(tempQueue);

                            //Si tiene el bit R encencido le damos una segunda oportunidad
                            if (queue[index].bits.R === 1) {
                                queue[index].bits.R = 0;
                                tempQueue[index].arrivalTime = cont;
                            } else { //Si no, la reemplazamos
                                queue.forEach((item) => {
                                    item.bits.R = 0;
                                })

                                queue[index] = { ...item, bits: { R: 1, M: 0 }, arrivalTime: i };
                                break;
                            }
                            cont++;
                        }

                    } else {
                        queue.push({ ...item, bits: { R: 1, M: 0 }, arrivalTime: i });
                    }
                    tempFaults[i] = 1;
                }
                tempStacks.push(structuredClone(queue));
            }
        }
        resolve();
        setTable(table => table = { ...table, stacks: tempStacks, faults: tempFaults });

    }, [frames, refs, setTable]);
    
    return (
        <div></div>
    )
}


export default SecondChance