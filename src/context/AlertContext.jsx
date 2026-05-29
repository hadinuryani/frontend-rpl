import { createContext, useContext, useState, useRef } from 'react';
import { IconCheck, IconAlertTriangle, IconInfo, IconX } from '../components/Icons';

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm'
    variant: 'info', // 'success' | 'error' | 'warning' | 'info'
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Batal',
  });

  const resolveRef = useRef(null);

  const showAlert = (message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({
        isOpen: true,
        type: 'alert',
        variant: options.variant || 'info',
        title: options.title || 'Informasi',
        message: message,
        confirmText: options.confirmText || 'OK',
        cancelText: 'Batal',
      });
    });
  };

  const showConfirm = (message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({
        isOpen: true,
        type: 'confirm',
        variant: options.variant || 'warning',
        title: options.title || 'Konfirmasi',
        message: message,
        confirmText: options.confirmText || 'Ya',
        cancelText: options.cancelText || 'Batal',
      });
    });
  };

  const handleConfirm = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  };

  const handleCancel = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  };

  const getIcon = () => {
    switch (dialog.variant) {
      case 'success':
        return <div className="alert-dialog-icon alert-success-icon"><IconCheck size={28} /></div>;
      case 'error':
        return <div className="alert-dialog-icon alert-error-icon"><IconX size={28} /></div>;
      case 'warning':
        return <div className="alert-dialog-icon alert-warning-icon"><IconAlertTriangle size={28} /></div>;
      default:
        return <div className="alert-dialog-icon alert-info-icon"><IconInfo size={28} /></div>;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {dialog.isOpen && (
        <div className="alert-dialog-overlay" onClick={dialog.type === 'alert' ? handleConfirm : undefined}>
          <div className="alert-dialog-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="alert-dialog-body">
              {getIcon()}
              <div className="alert-dialog-content">
                <h3>{dialog.title}</h3>
                <p>{dialog.message}</p>
              </div>
            </div>
            <div className="alert-dialog-footer">
              {dialog.type === 'confirm' && (
                <button className="btn btn-secondary btn-sm alert-btn-cancel" onClick={handleCancel}>
                  {dialog.cancelText}
                </button>
              )}
              <button 
                className={`btn btn-sm alert-btn-confirm ${
                  dialog.variant === 'error' ? 'btn-danger' : 
                  dialog.variant === 'warning' ? 'btn-danger' : 'btn-primary'
                }`}
                onClick={handleConfirm}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
