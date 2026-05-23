import { useState } from 'react';
import { Lock, X } from 'lucide-react';

export const PasscodeModal = ({ onAuthenticated, onCancel }: { onAuthenticated: () => void; onCancel: () => void }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (passcode === '1234') {
      setError('');
      localStorage.setItem('sdp_admin_auth', 'true');
      onAuthenticated();
    } else {
      setError('Invalid passcode');
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue text-white p-3 rounded-full">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
          </div>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Enter the admin passcode to access the dashboard.</p>

        <div className="mb-6">
          <input
            type="password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter passcode"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors text-center tracking-widest"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue/90 transition-colors"
          >
            Access
          </button>
        </div>
      </div>
    </div>
  );
};
