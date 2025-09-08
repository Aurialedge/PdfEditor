import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PdfViewer: React.FC = () => {
  const location = useLocation();
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    const file = location.state?.file;
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [location.state]);

  if (!fileUrl) return <p>No PDF file provided</p>;

  return (
    <div className="mt-4 w-full h-[600px] border">
      <iframe src={fileUrl} width="100%" height="100%" title="PDF Viewer" />
    </div>
  );
};

export default PdfViewer;
