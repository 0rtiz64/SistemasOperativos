import { useEffect } from 'react'

const Clock = ({ setTable, refs, frames }) => {
    useEffect(() => {
        let queue = [];
        let pointer = 0;
        let tempStacks = [];
        let tempFaults = [];


        const resolve = () => {
            let flag2 = false;

            for (let i = 0; i < refs.length; i++) {
                let flag = false;

                if (pointer >= frames) {
                    pointer = 0
                    flag = true;
                };

                const item = { ...refs[i] };

                let index = queue.findIndex(process => process.name === item.name);
                if (index !== -1) { //Si ya está en la cola
                    queue[index].bits.R = 1;
                    tempFaults[i] = 0;

                    if (!flag && queue.length === frames) {
                        pointer++;
                        flag2 = true;
                    }

                    if (flag2 === true && pointer === 0) {
                        pointer++;
                        flag2 = false;
                    }
                } else {
                    if (queue.length === frames) { //Si la cola está llena
                        while (true) { //Operación de reloj
                            if (pointer === frames) pointer = 0

                            if (queue[pointer].bits.R === 0) {
                                queue[pointer] = { ...item, arrivalTime: i };
                                queue[pointer].bits.R = 1;
                                break;
                            } else {
                                queue[pointer].bits.R = 0;
                            }

                            pointer++;
                        }
                    } else {
                        queue[pointer] = { ...item, arrivalTime: i };
                        queue[pointer].bits.R = 1;
                        pointer++;
                    }
                    tempFaults[i] = 1;
                }

                tempStacks.push(structuredClone(queue));
                console.log(pointer + 1, structuredClone(queue))
            }
        }

        resolve();
        setTable(table => table = { ...table, stacks: tempStacks, faults: tempFaults });

    }, [frames, refs, setTable]);

    return (
        <div></div>
    )
}

export default Clock