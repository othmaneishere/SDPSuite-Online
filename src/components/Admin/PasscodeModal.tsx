import { useState } from 'react';
import { Lock, X } from 'lucide-react';

export const PasscodeModal = ({
  onAuthenticated,
  onCancel,
}: {
  onAuthenticated: () => void;
  onCancel: () => void;
}) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue rounded-full p-3 text-white">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <p className="mb-6 text-gray-600">Enter the admin passcode to access the dashboard.</p>

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
            className="focus:border-brand-blue w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center tracking-widest transition-colors focus:outline-none"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-brand-blue hover:bg-brand-blue/90 flex-1 rounded-lg px-4 py-3 font-semibold text-white transition-colors"
          >
            Access
          </button>
        </div>
      </div>
    </div>
  );
};
