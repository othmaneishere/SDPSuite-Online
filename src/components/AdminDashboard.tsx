import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Users, Database } from 'lucide-react';

export default function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data, error } = await supabase
        .from('worksheets')
        .select('*');
      
      if (error) {
        console.error('Error fetching admin data:', error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };
    
    fetchAllData();

    // Subscribe to all changes
    const channel = supabase
      .channel('admin-db-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'worksheets'
      }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setData(prev => prev.filter(item => item.id !== payload.old.id));
        } else if (payload.new) {
          setData(prev => {
            const index = prev.findIndex(item => item.id === payload.new.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = payload.new;
              return updated;
            } else {
              return [...prev, payload.new];
            }
          });
        }
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
        <button onClick={onExit} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Exit Admin</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((group) => (
            <div key={group.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users size={20} /> {group.id}
              </h2>
              <p className="text-xs text-gray-500 mb-4">Last Updated: {new Date(group.updated_at).toLocaleString()}</p>
              <pre className="text-[10px] bg-gray-50 p-4 rounded overflow-auto max-h-64">
                {JSON.stringify(group.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
