import { useState } from 'react'
import Pdfupload from './components/PdfUploader.tsx'
import PdfViewer from './components/PdfViewer.tsx'
import './App.css'

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleFileUpload = (file: File) => {
    setPdfFile(file)
  }

  return (
    <div className="App">
      <h1>PDF Editor</h1>
      <Pdfupload onFileUpload={handleFileUpload} />
      {pdfFile && <PdfViewer file={pdfFile} />}
    </div>
  )
}

export default App
