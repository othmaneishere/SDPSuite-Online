import { useEffect, useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PESTELWorksheet, McKinseyWorksheet, VRIOAnalysisTable } from './components/Worksheets';

const supabase = createClient();

export default function ProfessorDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>('PESTEL');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '1234') setIsAuthorized(true);
    else { alert('Incorrect code.'); setCode(''); }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    const fetchGroups = async () => {
      const { data } = await supabase.from('groups').select('*');
      if (data) setGroups(data);
    };
    fetchGroups();
    const channel = supabase.channel('schema-db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, () => fetchGroups()).subscribe();
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

  const content = selectedGroup?.content;

  return (
    <div className="min-h-screen bg-gray-100 flex h-screen overflow-hidden">
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Groups</h2>
        {groups.map(g => (
            <button key={g.group_id} onClick={() => setSelectedGroup(g)} className={`w-full p-3 mb-1 rounded-lg text-left transition-colors ${selectedGroup?.group_id === g.group_id ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>
                <p className="font-bold text-sm">{g.group_id}</p>
            </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        {selectedGroup ? (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-black">{selectedGroup.group_id}</h1>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        { (['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase", activeTab === tab ? "bg-white shadow" : "")}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                    {activeTab === 'PESTEL' && <PESTELWorksheet data={content?.pestel || []} setData={() => {}} />}
                    {activeTab === 'McKinsey' && <McKinseyWorksheet data={content?.mckinsey || {}} setData={() => {}} />}
                    {activeTab === 'VRIO' && <VRIOAnalysisTable data={content?.vrio || []} setData={() => {}} />}
                    {activeTab !== 'PESTEL' && activeTab !== 'McKinsey' && activeTab !== 'VRIO' && (
                        <pre className="text-xs font-mono bg-gray-50 p-4 rounded border overflow-x-auto">{JSON.stringify(content?.[activeTab.toLowerCase()], null, 2)}</pre>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-bold">Select a group</div>
        )}
      </div>
    </div>
  );
}
