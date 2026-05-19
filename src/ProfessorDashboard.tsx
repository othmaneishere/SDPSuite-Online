import { useEffect, useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Lock, Users, RefreshCw, Activity, FileText } from 'lucide-react';

const supabase = createClient();

export default function ProfessorDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '1234') setIsAuthorized(true);
    else { alert('Incorrect code.'); setCode(''); }
  };

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchGroups = async () => {
      const { data, error } = await supabase.from('groups').select('*');
      if (error) console.error(error);
      else setGroups(data || []);
      setLoading(false);
    };

    fetchGroups();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, (payload) => {
        fetchGroups(); // Refresh all to ensure we have latest content
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAccess} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
          <div className="flex justify-center mb-6"><Lock className="text-brand-blue" size={32} /></div>
          <h2 className="text-2xl font-bold text-center mb-6">Professor Login</h2>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter access code" className="w-full p-4 bg-gray-50 border rounded-2xl mb-6 text-center text-lg font-bold outline-none" />
          <button type="submit" className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-lg">Access Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex gap-8">
      {/* Sidebar - Group List */}
      <div className="w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[calc(100vh-4rem)] overflow-y-auto">
        <h2 className="text-xl font-black mb-6">Groups</h2>
        {groups.map(g => (
            <button key={g.group_id} onClick={() => setSelectedGroup(g)} className={`w-full p-4 mb-2 rounded-xl text-left ${selectedGroup?.group_id === g.group_id ? 'bg-brand-blue text-white' : 'hover:bg-gray-50'}`}>
                <p className="font-bold">{g.group_id}</p>
                <p className="text-xs opacity-70">Updated: {new Date(g.created_at).toLocaleTimeString()}</p>
            </button>
        ))}
      </div>

      {/* Main Panel */}
      <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-[calc(100vh-4rem)] overflow-y-auto">
        {selectedGroup ? (
            <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                    <h1 className="text-3xl font-black text-gray-900">{selectedGroup.group_id} Monitoring</h1>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Activity size={12}/> Live</span>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl border">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><FileText size={18}/> Live Content</h3>
                        <pre className="text-xs font-mono bg-white p-4 rounded border overflow-x-auto h-96">{JSON.stringify(selectedGroup.content, null, 2)}</pre>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={18}/> Participants</h3>
                        <div className="space-y-2">
                            {selectedGroup.content?.meta?.participants?.map((p:string) => (
                                <div key={p} className="p-3 bg-white rounded border text-sm font-bold">{p}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-bold">Select a group to view live monitoring</div>
        )}
      </div>
    </div>
  );
}
