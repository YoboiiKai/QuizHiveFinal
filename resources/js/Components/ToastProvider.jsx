import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  const { flash } = usePage().props;
  
  useEffect(() => {
    // Display success messages
    if (flash?.success) {
      toast.success(flash.success);
    }
    
    // Display error messages
    if (flash?.error) {
      toast.error(flash.error);
    }
    
    // Handle Laravel validation errors from withErrors()
    if (flash?.errors && Object.keys(flash.errors).length > 0) {
      const errorMessage = Object.values(flash.errors)
        .flat()
        .join('\n');
      
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
    
    // Legacy flash message handling
    if (flash?.message) {
      toast.success(flash.message);
    }
  }, [flash]);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default toast options
        duration: 5000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        // Customize successful toast
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #dcfce7',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        },
        // Customize error toast
        error: {
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fee2e2',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
