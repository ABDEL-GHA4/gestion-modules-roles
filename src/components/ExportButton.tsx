
import React from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "../utils/exportToExcel";

interface ExportButtonProps<T> {
  data: T[];
  filename: string;
}

const ExportButton = <T,>({ data, filename }: ExportButtonProps<T>) => {
  const handleExport = () => {
    exportToExcel(data, filename);
  };

  return (
    <Button onClick={handleExport} className="ml-auto flex items-center gap-2">
      <Download size={16} />
      <span>Exporter Excel</span>
    </Button>
  );
};

export default ExportButton;
