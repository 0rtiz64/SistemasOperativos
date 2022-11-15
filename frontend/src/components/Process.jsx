import React, { useState } from 'react'
import { useEffect } from 'react';

const Process = ({ list, name, greater }) => {
    const [row, setRow] = useState([]);
    const [color, setColor] = useState();

    useEffect(() => {
        setColor((Math.floor(Math.random() * 9999999)));
    }, [])

    useEffect(() => {
        if (list === undefined ) {
            return;
        }

        const tick = () => {
            let cont = 0;
            let tempRow = []

            list.forEach((tick) => {
                if (tick[0] !== 0) {
                    for (let i = cont; i < tick[0]; i++) {
                        tempRow[i] = 0;
                    }
                }

                if (tick[0] === tick[1]) {
                    tempRow[tick[0]] = 1;
                } else {
                    for (let i = tick[0]; i < tick[1]; i++) {
                        tempRow[i] = 1;
                    }
                }

                cont = tick[1];
            })

            for (let i = tempRow.length; i < greater; i++) {
                tempRow.push(0);
            }
            setRow(tempRow);
        }

        tick();
    }, [list, greater]);

    return (
        <tr>
            <th className="bg-white">
                {name}
            </th>
            {
                row.map((item, index) => {
                    if (item !== 0) {
                        return <td key={index} style={{ backgroundColor: `hsl(${color},50%,50%)` }}></td>
                    } else {
                        return <td key={index}></td>
                    }
                })
            }
        </tr>
    )
}

export default Process