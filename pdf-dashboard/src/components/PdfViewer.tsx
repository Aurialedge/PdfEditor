import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiDownload, FiPrinter, FiRotateCw } from "react-icons/fi";
import styles from "./PdfViewer.module.css";

const PdfViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState("document.pdf");

  useEffect(() => {
    const file = location.state?.file;
    if (file) {
      setFileName(file.name || "document.pdf");
      try {
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        setIsLoading(false);
        return () => URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error creating object URL:", err);
        setError("Failed to load PDF. The file may be corrupted or in an unsupported format.");
        setIsLoading(false);
      }
    } else {
      setError("No PDF file provided");
      setIsLoading(false);
    }
  }, [location.state]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setError("Failed to load PDF. The file may be corrupted or in an unsupported format.");
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!fileUrl) return;
    
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const rotatePdf = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  if (error) {
    return (
      <div className={styles.viewerContainer}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Error Loading PDF</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className={`${styles.actionButton} ${styles.primary}`}
            style={{ marginTop: '1rem' }}
          >
            <FiArrowLeft className="mr-2" />
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewerContainer}>
      <div className={styles.viewerHeader}>
        <h1 className={styles.viewerTitle}>{fileName}</h1>
        <div className={styles.viewerActions}>
          <button 
            onClick={() => navigate('/')} 
            className={styles.actionButton}
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <button 
            onClick={handleDownload} 
            className={styles.actionButton}
            title="Download PDF"
          >
            <FiDownload className="mr-2" />
            Download
          </button>
          <button 
            onClick={handlePrint} 
            className={styles.actionButton}
            title="Print PDF"
          >
            <FiPrinter className="mr-2" />
            Print
          </button>
          <button 
            onClick={rotatePdf} 
            className={styles.actionButton}
            title="Rotate 90°"
          >
            <FiRotateCw className="mr-2" />
            Rotate
          </button>
          <div className={styles.zoomControls}>
            <button 
              onClick={zoomOut} 
              className={styles.zoomButton}
              disabled={scale <= 0.5}
              title="Zoom Out"
            >
              −
            </button>
            <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
            <button 
              onClick={zoomIn} 
              className={styles.zoomButton}
              disabled={scale >= 2}
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={styles.pdfContainer}>
        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading PDF...</p>
          </div>
        )}
        {fileUrl && (
          <iframe 
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className={styles.pdfFrame}
            title="PDF Viewer"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease-in-out',
              width: `${100 / scale}%`,
              height: `${100 / scale}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
