import { useState } from 'react';
import { CloudCheck, CloudUpload } from 'lucide-react';
import { cn } from '../lib/utils';

export const ManualSaveButton = ({ onSave, isSyncing }: { onSave: () => Promise<void>; isSyncing: boolean }) => {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    if (status === 'saving' || isSyncing) return;
    
    setStatus('saving');
    try {
      await onSave();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e) {
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={status === 'saving' || isSyncing}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
        status === 'saved' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      {status === 'saving' ? (
        'Saving...'
      ) : status === 'saved' ? (
        <>
          <CloudCheck size={16} /> Saved
        </>
      ) : (
        <>
          <CloudUpload size={16} /> Save Now
        </>
      )}
    </button>
  );
};
