import { useEffect, useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Lock, Users, RefreshCw } from 'lucide-react';

const supabase = createClient();

export default function ProfessorDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '1234') {
      setIsAuthorized(true);
    } else {
      alert('Incorrect code.');
      setCode('');
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*');
      if (error) console.error(error);
      else setGroups(data || []);
      setLoading(false);
    };

    fetchGroups();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'groups' }, (payload) => {
        setGroups((prev) => prev.map((g) => (g.group_id === payload.new.group_id ? payload.new : g)));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAccess} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-blue/10 p-4 rounded-full">
                <Lock className="text-brand-blue" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Professor Login</h2>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-6 text-center text-lg font-bold outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
          />
          <button type="submit" className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-lg hover:bg-brand-blue/90 transition-all">
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-gray-900">Professor Dashboard</h1>
            <button onClick={() => window.location.reload()} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:text-brand-blue">
                <RefreshCw size={20} />
            </button>
        </div>
        
        {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold">Loading groups...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
                <div key={group.group_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gray-100 p-3 rounded-xl">
                            <Users size={20} className="text-gray-500" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{group.group_id}</h3>
                    </div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Last Updated</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(group.created_at).toLocaleString()}</p>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
