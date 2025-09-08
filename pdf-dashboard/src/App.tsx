import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PdfUploader from "./components/PdfUploader";
import PdfViewer from "./components/PdfViewer";
import { LiquidChrome } from "./components/LiquidChrome";
import AiPdfExtractor from "./components/AiPdfExtractor";
import ExtractedDataList from "./components/ExtractedDataList";
import ExtractedDataForm from "./components/ExtractedDataForm";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  const location = useLocation();
  const [isViewer, setIsViewer] = useState(false);

  useEffect(() => {
    setIsViewer(location.pathname === '/viewer');
  }, [location]);

  return (
    <div className="app-container">
      <Navigation />
      <div className={`liquid-background ${isViewer ? 'viewer-mode' : ''}`}>
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={1}
          amplitude={0.6}
          interactive={true}
        />
      </div>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/extracted-data" replace />} />
          <Route path="/viewer" element={<PdfViewer />} />
          <Route path="/ai-extract" element={<AiPdfExtractor />} />
          <Route path="/extracted-data" element={<ExtractedDataList />} />
          <Route path="/extracted-data/new" element={<ExtractedDataForm />} />
          <Route path="/extracted-data/edit/:id" element={<ExtractedDataForm isEditing />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
