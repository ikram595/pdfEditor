import { useState } from "react";
import PdfEditor from "./components/pdfEditor/Designer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EditorV7 from "./components/editorV7/EditorV7";
function App() {
  const [pdfs, setPdfs] = useState([]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PdfEditor />} />
        <Route path="/v7" element={<EditorV7 />} />

        {/* 
        <Route path="/editorMain" element={TemplateEditor} /> */}
      </Routes>
    </Router>
  );
}

export default App;
