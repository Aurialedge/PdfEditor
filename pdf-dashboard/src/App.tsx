import { Routes, Route } from "react-router-dom";
import PdfUploader from "./components/PdfUploader";
import PdfViewer from "./components/PdfViewer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PdfUploader />} />
      <Route path="/viewer" element={<PdfViewer />} />
    </Routes>
  );
}

export default App;
