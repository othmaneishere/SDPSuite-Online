import { useState, useEffect, useRef } from 'react';
import { LogOut, Users, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminGroupSelector } from './AdminGroupSelector';
import { AdminTablePreview } from './AdminTablePreview';
import { PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData, MetaData } from '../../types';
import { cn } from '../../lib/utils';

export interface GroupData {
  pestel: PESTELData[];
  mckinsey: McKinsey7SData;
  vrio: VRIOAnalysisData[];
  vrioNotes: string;
  tows: TOWSMatrixData;
  porters: PortersFiveForcesData;
  meta: MetaData;
}

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>('PESTEL');
  const [groupsData, setGroupsData] = useState<Record<string, GroupData>>({});
  const [loading, setLoading] = useState(true);
  const channelsRef = useRef<Map<string, any>>(new Map());

  // Load all available groups
  useEffect(() => {
    const loadGroups = () => {
      const allGroups: string[] = [];
      for (let i = 1; i <= 11; i++) {
        allGroups.push(`Group ${i}`);
      }
      setGroups(allGroups);
      setLoading(false);
    };
    loadGroups();
  }, []);

  // Fetch data from DB whenever a group is selected
  useEffect(() => {
    const fetchSelectedData = async () => {
      const groupList = Array.from(selectedGroups);
      if (groupList.length === 0) return;

      const { data, error } = await supabase
        .from('group_data')
        .select('group_id, data')
        .in('group_id', groupList);

      if (data) {
        const newData: Record<string, GroupData> = {};
        data.forEach(row => {
          newData[row.group_id] = row.data;
        });
        setGroupsData(prev => ({ ...prev, ...newData }));
      }
    };

    fetchSelectedData();
  }, [selectedGroups]);

  // Subscribe to real-time updates for persistence
  useEffect(() => {
    selectedGroups.forEach(group => {
      if (!channelsRef.current.has(group)) {
        const channel = supabase.channel(`room:${group}`);
        channel.on('broadcast', { event: 'update_data' }, ({ payload }: any) => {
          setGroupsData(prev => ({
            ...prev,
            [group]: payload.data
          }));
        });
        channel.subscribe();
        channelsRef.current.set(group, channel);
      }
    });

    return () => {
      channelsRef.current.forEach((channel, group) => {
        if (!selectedGroups.has(group)) {
          channel.unsubscribe();
          channelsRef.current.delete(group);
        }
      });
    };
  }, [selectedGroups]);

  const handleToggleGroup = (group: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(group)) {
      newSelected.delete(group);
    } else {
      newSelected.clear(); // Only allow one group at a time (Single View)
      newSelected.add(group);
    }
    setSelectedGroups(newSelected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const currentGroup = Array.from(selectedGroups)[0];
  const currentGroupData = currentGroup ? groupsData[currentGroup] : undefined;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden min-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <img src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" alt="SDP Suite Logo" className="h-16 w-auto object-contain" />
            <div className="h-10 w-px bg-gray-200 mx-2" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Admin Monitor</h1>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Navigation/Selector */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
          <AdminGroupSelector groups={groups} selectedGroups={selectedGroups} onToggleGroup={handleToggleGroup} />
          
          <div className="flex justify-center mt-6">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 overflow-x-auto">
              {(['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                    activeTab === tab ? "bg-brand-blue text-white shadow-md" : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  {tab === 'PORTER' ? "Porter's 5 Forces" : tab === 'TOWS' ? 'Confrontation Matrix' : tab === 'McKinsey' ? 'McKinsey 7-S' : `${tab} Analysis`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
          {currentGroup ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-gray-50 pb-6">
                <div className="w-3 h-10 bg-brand-blue rounded-full" />
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{currentGroup}</h2>
                {currentGroupData?.meta?.companyName && (
                  <span className="text-gray-400 text-xl font-bold">— {currentGroupData.meta.companyName}</span>
                )}
              </div>
              <AdminTablePreview activeTab={activeTab} data={currentGroupData} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20">
              <Activity size={64} className="text-gray-200 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Group Selected</h3>
              <p className="text-gray-500 max-w-sm">Select a group from the list above to monitor their strategic worksheets in real-time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
