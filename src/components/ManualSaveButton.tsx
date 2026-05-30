import { useState } from 'react';
import { CloudCheck, CloudUpload } from 'lucide-react';
import { cn } from '../lib/utils';

export const ManualSaveButton = ({
  onSave,
  isSyncing,
}: {
  onSave: () => Promise<void>;
  isSyncing: boolean;
}) => {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    if (status === 'saving' || isSyncing) return;

    setStatus('saving');
    try {
      await onSave();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={status === 'saving' || isSyncing}
      title={status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : 'Save Now'}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-lg transition-all',
        status === 'saved'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-900',
      )}
    >
      {status === 'saving' ? (
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      ) : status === 'saved' ? (
        <CloudCheck size={14} />
      ) : (
        <CloudUpload size={14} />
      )}
    </button>
  );
};
