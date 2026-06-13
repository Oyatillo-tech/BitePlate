import { CheckCircle, X } from 'lucide-react';

export default function SuccessAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
      <div className="flex items-start gap-2">
        <CheckCircle className="text-success flex-shrink-0 mt-0.5" size={16} />
        <p className="text-sm text-green-800">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-green-400 hover:text-green-600">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
