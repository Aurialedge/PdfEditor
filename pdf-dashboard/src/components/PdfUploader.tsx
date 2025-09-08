import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PdfUploaderProps {
  onFileSelect?: (file: File) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    }
  };

  return (
    <div className="p-4 border rounded">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {file && (
        <button
          onClick={() => navigate("/viewer", { state: { file } })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          View PDF
        </button>
      )}
    </div>
  );
};

export default PdfUploader;
