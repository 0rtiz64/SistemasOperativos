import Footer from "./layout/Footer";
import Input from "./components/Input";
import Modal from 'react-modal';
import '../src/style.css'
import Output from "./components/Output";
import { useRef, useState } from "react";
Modal.setAppElement("#root");

const App = () => {
  const [processesList, setProcessesList] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('1');
  const [processStatesHistory, setProcessStatesHistory] = useState([]);
  const [quantum, setQuantum] = useState("");
  const [statesHistoryTable, setStatesHistoryTable] = useState([]);
  const outputRef = useRef(null);

  return (
    <div className="App">
      <div className='d-flex flex-column container mt-5'>
        <Input
          outputRef={outputRef}
          processesList={processesList}
          setProcessesList={setProcessesList}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
          quantum={quantum}
          setQuantum={setQuantum}
          processStatesHistory={processStatesHistory}
          setProcessStatesHistory={setProcessStatesHistory}
          statesHistoryTable={statesHistoryTable}
          setStatesHistoryTable={setStatesHistoryTable}
        />
        <Output
          statesHistoryTable={statesHistoryTable}
          setStatesHistoryTable={setStatesHistoryTable}
          outputRef={outputRef}
          processes={processesList}
          setProcesses={setProcessesList}
          selectedAlgorithm={selectedAlgorithm}
          quantum={quantum}
          processStatesHistory={processStatesHistory}
          setProcessStatesHistory={setProcessStatesHistory}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
