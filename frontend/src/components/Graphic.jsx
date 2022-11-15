import React from 'react'
import GuaranteedScheduling from './algorithms/GuaranteedScheduling'
import LotteryScheduling from './algorithms/LotteryScheduling'
import MultilevelQueues from './algorithms/MultilevelQueues'
import PriorityPreemtive from './algorithms/PriorityPreemtive'
import PriorityScheduling from './algorithms/PriorityScheduling'
import RoundRobin from './algorithms/RoundRobin'
import ShortestJobFirst from './algorithms/ShortestJobFirst'
import ShortestJobFirstNP from './algorithms/ShortestJobFirstNP'

const Graphic = ({ selectedAlgorithm, processes, setProcesses, quantum }) => {
    const getGraphic = () => {
        switch (selectedAlgorithm) {
            case "1":
                return <ShortestJobFirst processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "2":
                return <PriorityScheduling processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "3":
                return <LotteryScheduling processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "4":
                return <ShortestJobFirstNP processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "5":
                return <RoundRobin processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "6":
                return <PriorityPreemtive processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "7":
                return <MultilevelQueues processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "8":
                return <GuaranteedScheduling processes={processes} setProcesses={setProcesses} quantum={quantum} />
            default:
                break;
        }
    }

    return (
        <table className={`table table-bordered ${(processes.length === 0) && "visually-hidden"}`}>
            {
                processes.length !== 0 &&
                getGraphic()
            }
        </table>
    )
}

export default Graphic