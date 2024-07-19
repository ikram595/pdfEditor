import PdfEditor from "./components/pdfEditor/Designer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PdfEditor />} />

        {/* 
        <Route path="/editorMain" element={TemplateEditor} /> */}
      </Routes>
    </Router>
  );
}

export default App;
