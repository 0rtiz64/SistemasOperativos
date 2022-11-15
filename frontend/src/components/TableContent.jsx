import React from 'react'
import Process from './Process';

const TableContent = ({ greater, rows }) => {
    const Columns = () => {
        let columns = [];
        for (let index = 1; index <= greater; index++) {
            columns.push(<th key={index} className="text-end">{index}</th>);
        }
        return columns;
    }

    return (
        <React.Fragment>
            <thead>
                <tr>
                    <th className="bg-white"><span>Proceso</span></th>
                    {Columns()}
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((process, index) => {
                        return <Process key={index} process={process} list={process.movements} name={process.name} greater={greater} />
                    })
                }
            </tbody>
        </React.Fragment>
    )
}

export default TableContent