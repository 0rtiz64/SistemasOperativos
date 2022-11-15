import Footer from "./layout/Footer";
import Inputs from "./components/Setup";
import Modal from 'react-modal';
import '../src/style.css'
import Output from "./components/Output";
import { useRef, useState } from "react";
Modal.setAppElement("#root");

const App = () => {
  const [processesList, setProcessesList] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('1');
  const [quantum, setQuantum] = useState("");
  const outputRef = useRef(null);

  return (
    <div className="App">
      <div className='d-flex flex-column container mt-5'>
        <Inputs
          outputRef={outputRef}
          processesList={processesList}
          setProcessesList={setProcessesList}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
          quantum={quantum}
          setQuantum={setQuantum}
        />
        <Output
          outputRef={outputRef}
          processes={processesList}
          setProcesses={setProcessesList}
          selectedAlgorithm={selectedAlgorithm}
          quantum={quantum}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
