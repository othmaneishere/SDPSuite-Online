import { useState, useEffect, useRef } from 'react';
import { LogOut, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminGroupSelector } from './AdminGroupSelector';
import { AdminTablePreview } from './AdminTablePreview';
import { GroupData } from '../../types';
import { cn } from '../../lib/utils';
import { RealtimeChannel } from '@supabase/supabase-js';

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>(
    'PESTEL',
  );
  const [groupsData, setGroupsData] = useState<Record<string, GroupData>>({});
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());

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

      const { data } = await supabase
        .from('group_data')
        .select('group_id, data')
        .in('group_id', groupList);

      if (data) {
        const newData: Record<string, GroupData> = {};
        data.forEach((row) => {
          newData[row.group_id] = row.data;
        });
        setGroupsData((prev) => ({ ...prev, ...newData }));
      }
    };

    fetchSelectedData();
  }, [selectedGroups]);

  // Subscribe to real-time updates for persistence
  useEffect(() => {
    selectedGroups.forEach((group) => {
      if (!channelsRef.current.has(group)) {
        const channel = supabase.channel(`room:${group}`);
        channel.on('broadcast', { event: 'update_data' }, ({ payload }: { payload: { data: GroupData } }) => {
          setGroupsData((prev) => ({
            ...prev,
            [group]: payload.data,
          }));
        });
        channel.subscribe();
        channelsRef.current.set(group, channel);
      }
    });

    const channels = channelsRef.current;

    return () => {
      channels.forEach((channel, group) => {
        if (!selectedGroups.has(group)) {
          channel.unsubscribe();
          channels.delete(group);
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

  const handleClearGroupData = async () => {
    const currentGroup = Array.from(selectedGroups)[0];
    if (!currentGroup) return;

    if (
      !confirm(
        `Are you sure you want to PERMANENTLY CLEAR all data for ${currentGroup}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('group_data').delete().eq('group_id', currentGroup);

      if (error) throw error;

      // Broadcast empty data to reset any online users in that group
      const channel = channelsRef.current.get(currentGroup);
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'update_data',
          payload: { senderId: 'admin', data: {} },
        });
      }

      setGroupsData((prev) => {
        const next = { ...prev };
        delete next[currentGroup];
        return next;
      });

      alert(`${currentGroup} data has been cleared.`);
    } catch (err) {
      console.error('Failed to clear data:', err);
      alert('Error clearing data. Please check console.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="border-brand-blue mb-4 inline-block h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="font-semibold text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const currentGroup = Array.from(selectedGroups)[0];
  const currentGroupData = currentGroup ? groupsData[currentGroup] : undefined;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 font-sans md:p-8">
      <div className="mx-auto flex min-h-[90vh] max-w-[1400px] flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <img
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
              alt="SDP Suite Logo"
              className="h-16 w-auto object-contain"
            />
            <div className="mx-2 h-10 w-px bg-gray-200" />
            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
              Admin Monitor
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {currentGroup && (
              <button
                onClick={handleClearGroupData}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-3 text-[10px] font-bold tracking-widest text-red-400 uppercase transition-all hover:text-red-600"
              >
                {isDeleting ? 'Clearing...' : 'Clear Group Data'}
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3 text-[10px] font-black tracking-[0.2em] text-red-600 uppercase transition-all hover:bg-red-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation/Selector */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-6">
          <AdminGroupSelector
            groups={groups}
            selectedGroups={selectedGroups}
            onToggleGroup={handleToggleGroup}
          />

          <div className="mt-6 flex justify-center">
            <div className="flex overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {(['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'rounded-lg px-6 py-2 text-sm font-bold whitespace-nowrap transition-all',
                    activeTab === tab
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-800',
                  )}
                >
                  {tab === 'PORTER'
                    ? "Porter's 5 Forces"
                    : tab === 'TOWS'
                      ? 'Confrontation Matrix'
                      : tab === 'McKinsey'
                        ? 'McKinsey 7-S'
                        : `${tab} Analysis`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {currentGroup ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-gray-50 pb-6">
                <div className="bg-brand-blue h-10 w-3 rounded-full" />
                <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase">
                  {currentGroup}
                </h2>
                {currentGroupData?.meta?.companyName && (
                  <span className="text-xl font-bold text-gray-400">
                    — {currentGroupData.meta.companyName}
                  </span>
                )}
              </div>
              <AdminTablePreview activeTab={activeTab} data={currentGroupData} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-20 text-center">
              <Activity size={64} className="mb-6 text-gray-200" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">No Group Selected</h3>
              <p className="max-w-sm text-gray-500">
                Select a group from the list above to monitor their strategic worksheets in
                real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
