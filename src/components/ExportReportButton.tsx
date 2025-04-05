import React, { useState } from 'react';
import { Button } from './ui/button';
import { Icons } from './ui/Icons';
import { ExportReportDialog } from './ExportReportDialog';

interface ExportReportButtonProps {
  data?: any;
  type?: 'staff' | 'performance' | 'training' | 'financial';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const ExportReportButton: React.FC<ExportReportButtonProps> = ({
  data,
  type = 'staff',
  variant = 'outline',
  size = 'default',
  className
}) => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleExport = (format: string, options: any) => {
    // In a real application, this would dispatch a notification
    console.log('Report Export Started', { format, options });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowExportDialog(true)}
      >
        <Icons.Download className="w-4 h-4 mr-2" />
        Export Report
      </Button>

      <ExportReportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        data={data}
        type={type}
      />
    </>
  );
};
