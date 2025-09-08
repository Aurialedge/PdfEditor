import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiFile, FiEye } from "react-icons/fi";
import styles from "./PdfUploader.module.css";

interface PdfUploaderProps {
  onFileSelect?: (file: File) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        handleFileChange(selectedFile);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={styles.uploaderContainer}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Animated background shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>
      <div className={`${styles.shape} ${styles.shape3}`}></div>
      
      <div className="relative z-10">
        <h2 className={styles.uploaderTitle}>Upload PDF Document</h2>
        <p className={styles.uploaderDescription}>
          Drag and drop your PDF file here, or click the button below to browse files.
          We support PDF files up to 10MB in size.
        </p>
        
        <input 
          ref={fileInputRef}
          type="file" 
          accept="application/pdf" 
          onChange={handleInputChange}
          className={styles.fileInput}
        />
        
        <div className="mt-6">
          <button 
            onClick={handleClick}
            className={styles.uploadButton}
          >
            <FiUpload className="mr-2" />
            Select PDF File
          </button>
        </div>
      
      {file ? (
        <div className="mt-8 transition-all duration-300 ease-in-out transform">
          <div className={styles.fileInfo}>
            <FiFile className={styles.fileIcon} />
            <div className="text-left">
              <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
              <p className="text-sm text-gray-500">
                {((file.size / (1024 * 1024))).toFixed(2)} MB • PDF Document
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/viewer", { state: { file } })}
              className={styles.viewButton}
            >
              <FiEye className="mr-2" />
              View PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <FiUpload className="text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-700">
              No file selected
            </span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PdfUploader;
