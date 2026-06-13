import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="text-danger flex-shrink-0 mt-0.5" size={16} />
        <p className="text-sm text-red-800">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
