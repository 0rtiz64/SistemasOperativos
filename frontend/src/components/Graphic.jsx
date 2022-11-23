import React from 'react'
import GuaranteedScheduling from './algorithms/GuaranteedScheduling'
import LotteryScheduling from './algorithms/LotteryScheduling'
import MultilevelQueues from './algorithms/MultilevelQueues'
import PriorityPreemtive from './algorithms/PriorityPreemtive'
import PriorityScheduling from './algorithms/PriorityScheduling'
import RoundRobin from './algorithms/RoundRobin'
import ShortestJobFirst from './algorithms/ShortestJobFirst'
import ShortestJobFirstNP from './algorithms/ShortestJobFirstNP'

const Graphic = ({ setProcessStatesHistory, selectedAlgorithm, processes, setProcesses, quantum }) => {
    const getGraphic = () => {
        switch (selectedAlgorithm) {
            case "1":
                return <ShortestJobFirst setProcessStatesHistory={setProcessStatesHistory} processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "2":
                return <PriorityScheduling setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "3":
                return <LotteryScheduling setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "4":
                return <ShortestJobFirstNP setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "5":
                return <RoundRobin setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "6":
                return <PriorityPreemtive setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "7":
                return <MultilevelQueues setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            case "8":
                return <GuaranteedScheduling setProcessStatesHistory={setProcessStatesHistory}  processes={processes} setProcesses={setProcesses} quantum={quantum} />
            default:
                break;
        }
    }

    return (
        <table className={`block-column table table-bordered ${(processes.length === 0) && "visually-hidden"}`}>
            {
                processes.length !== 0 &&
                getGraphic()
            }
        </table>
    )
}

export default Graphic