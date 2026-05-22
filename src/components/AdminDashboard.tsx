import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users } from 'lucide-react';
// Assuming AppContent is imported from App.tsx. 
// If it cannot be imported directly, we'd need to lift the AppContent component 
// to a separate file or handle the logic here.
// For now, I will assume AppContent needs to be accessible.

// In a real-world scenario, you would refactor AppContent to a separate component file.
// For this task, I will mock the viewing functionality.

export default function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [groups, setGroups] = useState<any[]>([]);
  const [viewingGroup, setViewingGroup] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from('worksheets').select('id, updated_at');
      setGroups(data || []);
    };
    fetchGroups();
  }, []);

  return viewingGroup ? (
    // This is where you would render the AppContent with read-only props.
    // For now, displaying a placeholder view to confirm functionality.
    <div className="p-8">
      <button onClick={() => setViewingGroup(null)} className="mb-4 px-4 py-2 bg-gray-900 text-white rounded-lg">Back to Admin List</button>
      <h2 className="text-2xl font-bold">Viewing {viewingGroup} (Read-Only)</h2>
      {/* 
        You would pass 'fullName="Admin (Observer)"' and 
        handle read-only state within AppContent here.
      */}
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">Admin Dashboard - Group Monitor</h1>
        <button onClick={onExit} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Exit Admin</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users size={20} /> {group.id}
            </h2>
            <p className="text-xs text-gray-500 mb-4">Last Updated: {new Date(group.updated_at).toLocaleString()}</p>
            <button 
              onClick={() => setViewingGroup(group.id)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Monitor Live
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
