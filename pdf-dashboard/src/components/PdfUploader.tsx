import { useState } from "react";

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function PdfUploader({ onFileSelect }: PdfUploaderProps) {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // only allow PDFs
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
      }

      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <label className="block mb-2 font-medium text-gray-700">
        Upload PDF
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600"
      />
      {fileName && (
        <p className="mt-2 text-sm text-green-700">Selected: {fileName}</p>
      )}
    </div>
  );
}
