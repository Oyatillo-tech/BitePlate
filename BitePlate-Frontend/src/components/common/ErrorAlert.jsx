import { X, AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
    return (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-danger rounded-lg p-4 flex items-start gap-4 shadow-lg max-w-md animate-pulse">
            <AlertCircle className="text-danger flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
                <p className="font-semibold text-danger">Error</p>
                <p className="text-gray-700">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
                <X size={20} />
            </button>
        </div>
    );
}