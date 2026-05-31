import { useState, useEffect, useRef } from 'react';
import { LogOut, Activity, LayoutGrid, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminGroupSelector } from './AdminGroupSelector';
import { AdminTablePreview } from './AdminTablePreview';
import { AdminOverview } from './AdminOverview';
import { GroupData, PESTELRow, VRIORow, TOWSRow, PorterRow, MetaData } from '../../types';
import { cn } from '../../lib/utils';
import { RealtimeChannel } from '@supabase/supabase-js';

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');
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
    };
    loadGroups();
  }, []);

  // Fetch data for all groups when in overview mode or on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const allGroups = [];
      for (let i = 1; i <= 11; i++) allGroups.push(`Group ${i}`);

      const newData: Record<string, GroupData> = {};

      for (const group of allGroups) {
        const [pestel, vrio, tows, porter, mckinsey, meta] = await Promise.all([
          supabase.from('pestel_rows').select('content').eq('group_id', group),
          supabase.from('vrio_rows').select('content').eq('group_id', group),
          supabase.from('tows_rows').select('content').eq('group_id', group),
          supabase.from('porter_rows').select('content').eq('group_id', group),
          supabase.from('mckinsey_rows').select('content').eq('group_id', group),
          supabase.from('meta_data').select('content').eq('group_id', group).maybeSingle(),
        ]);

        newData[group] = {
          pestel: pestel.data?.map((r) => r.content as PESTELRow) || [],
          vrio: vrio.data?.map((r) => r.content as VRIORow) || [],
          vrioNotes: '',
          tows: tows.data?.map((r) => r.content as TOWSRow) || [],
          porters: porter.data?.map((r) => r.content as PorterRow) || [],
          mckinsey: mckinsey.data?.[0]?.content || {},
          meta: (meta.data?.content as MetaData) || {
            module: '',
            cohort: '',
            date: '',
            companyName: '',
            participants: [],
            group: group,
          },
        };
      }
      setGroupsData(newData);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // Subscribe to real-time updates for ALL groups for the overview
  useEffect(() => {
    const allGroups = [];
    for (let i = 1; i <= 11; i++) allGroups.push(`Group ${i}`);

    allGroups.forEach((group) => {
      if (!channelsRef.current.has(group)) {
        const channel = supabase.channel(`room:${group}`);
        channel
          .on(
            'broadcast',
            { event: 'update_data' },
            ({ payload }: { payload: { data: GroupData } }) => {
              setGroupsData((prev) => ({
                ...prev,
                [group]: payload.data,
              }));
            },
          )
          .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const presences = Object.values(state).flat() as { name?: string; client?: string }[];
            const names = presences.map((p) => p?.name || p?.client).filter(Boolean);

            setGroupsData((prev) => {
              if (!prev[group]) return prev;
              return {
                ...prev,
                [group]: {
                  ...prev[group],
                  meta: {
                    ...prev[group].meta,
                    participants: Array.from(new Set(names)) as string[],
                  },
                },
              };
            });
          });

        channel.subscribe();
        channelsRef.current.set(group, channel);
      }
    });

    const currentChannels = channelsRef.current;
    return () => {
      currentChannels.forEach((channel) => channel.unsubscribe());
      currentChannels.clear();
    };
  }, []);

  const handleToggleGroup = (group: string) => {
    const newSelected = new Set<string>();
    newSelected.add(group);
    setSelectedGroups(newSelected);
    setViewMode('detail');
  };

  const handleKickUser = async (userName: string) => {
    const currentGroup = Array.from(selectedGroups)[0];
    if (!currentGroup || !currentGroupData) return;

    if (!confirm(`Are you sure you want to remove ${userName} from the session?`)) {
      return;
    }

    try {
      // 1. Broadcast kick signal
      const channel = channelsRef.current.get(currentGroup);
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'kick_user',
          payload: { userName },
        });
      }

      // 2. Remove from meta_data participants
      const updatedParticipants = (currentGroupData.meta.participants || []).filter(
        (p) => p !== userName,
      );
      const updatedMeta = { ...currentGroupData.meta, participants: updatedParticipants };

      await supabase.from('meta_data').upsert({ group_id: currentGroup, content: updatedMeta });

      // 3. Update local state
      setGroupsData((prev) => ({
        ...prev,
        [currentGroup]: {
          ...prev[currentGroup],
          meta: updatedMeta,
        },
      }));
    } catch (err) {
      console.error('Failed to kick user:', err);
    }
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
      await Promise.all([
        supabase.from('pestel_rows').delete().eq('group_id', currentGroup),
        supabase.from('vrio_rows').delete().eq('group_id', currentGroup),
        supabase.from('tows_rows').delete().eq('group_id', currentGroup),
        supabase.from('porter_rows').delete().eq('group_id', currentGroup),
        supabase.from('mckinsey_rows').delete().eq('group_id', currentGroup),
        supabase.from('meta_data').delete().eq('group_id', currentGroup),
      ]);

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
              src="https://i.ibb.co/WWxYzvmx/pbs-logo.png"
              alt="SDP Suite Logo"
              className="h-32 w-auto object-contain"
            />
            <div className="mx-2 h-10 w-px bg-gray-200" />
            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
              Admin Monitor
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {currentGroup && viewMode === 'detail' && (
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
              <button
                onClick={() => setViewMode('overview')}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all',
                  viewMode === 'overview'
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <LayoutGrid size={16} /> Overview
              </button>
              <button
                onClick={() => setViewMode('detail')}
                disabled={!currentGroup}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all',
                  viewMode === 'detail'
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-600 disabled:opacity-30',
                )}
              >
                <List size={16} /> Group Detail
              </button>
            </div>
          </div>

          <AdminGroupSelector
            groups={groups}
            selectedGroups={selectedGroups}
            onToggleGroup={handleToggleGroup}
          />

          {viewMode === 'detail' && (
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
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {viewMode === 'overview' ? (
            <AdminOverview
              groups={groups}
              groupsData={groupsData}
              onSelectGroup={handleToggleGroup}
            />
          ) : currentGroup ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b-2 border-gray-50 pb-6">
                <div className="flex items-center gap-4">
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

                {/* Participants Management */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {(currentGroupData?.meta?.participants || []).map((p, i) => (
                      <div
                        key={p}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-600 shadow-sm"
                        title={p}
                        style={{ zIndex: 10 - i }}
                      >
                        {p.substring(0, 2).toUpperCase()}
                        <button
                          onClick={() => handleKickUser(p)}
                          className="absolute -top-1 -right-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[8px] text-white shadow-md hover:bg-red-600 group-hover:flex"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {(currentGroupData?.meta?.participants || []).length} Online
                  </span>
                </div>
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
