import { useState, useEffect, useRef } from 'react';
import { LogOut, RefreshCw, Users, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminGroupSelector } from './AdminGroupSelector';
import { AdminTablePreview } from './AdminTablePreview';
import { AdminMonitor } from './AdminMonitor';
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
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  const [activeTab, setActiveTab] = useState('pestel');
  const [groupsData, setGroupsData] = useState<Record<string, GroupData>>({});
  const [loading, setLoading] = useState(true);
  const [liveActivity, setLiveActivity] = useState<Map<string, { user: string; action: string; timestamp: number }>>(new Map());
  const channelsRef = useRef<Map<string, any>>(new Map());

  // Load all available groups from localStorage
  useEffect(() => {
    const loadGroups = () => {
      const allGroups: string[] = [];
      for (let key in localStorage) {
        if (key.startsWith('sdp_group_')) {
          const groupName = key.replace('sdp_group_', '');
          allGroups.push(groupName);
        }
      }
      setGroups(allGroups.sort());
      setLoading(false);
    };

    loadGroups();
  }, []);

  // Load group data when selected
  useEffect(() => {
    const loadGroupData = () => {
      const data: Record<string, GroupData> = {};
      
      selectedGroups.forEach(group => {
        try {
          const saved = localStorage.getItem(`sdp_group_${group}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            data[group] = {
              pestel: parsed.pestel || [],
              mckinsey: parsed.mckinsey || {},
              vrio: parsed.vrio || [],
              vrioNotes: parsed.vrioNotes || '',
              tows: parsed.tows || { opportunities: [], threats: [], strengths: [], weaknesses: [], scores: {}, notes: {} },
              porters: parsed.porters || {},
              meta: parsed.meta || { module: '', cohort: '', date: '', companyName: '', participants: [], group: '' }
            };
          }
        } catch (e) {
          console.error(`Failed to load group ${group}`, e);
        }
      });

      setGroupsData(data);
    };

    loadGroupData();
  }, [selectedGroups]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (selectedGroups.size === 0) return;

    selectedGroups.forEach(group => {
      if (!channelsRef.current.has(group)) {
        const channel = supabase.channel(`room:${group}`, {
          config: { broadcast: { self: true } }
        });

        channel.on('broadcast', { event: 'update_data' }, ({ payload }: any) => {
          setGroupsData(prev => ({
            ...prev,
            [group]: {
              pestel: payload.data.pestel || [],
              mckinsey: payload.data.mckinsey || {},
              vrio: payload.data.vrio || [],
              vrioNotes: payload.data.vrioNotes || '',
              tows: payload.data.tows || { opportunities: [], threats: [], strengths: [], weaknesses: [], scores: {}, notes: {} },
              porters: payload.data.porters || {},
              meta: payload.data.meta || { module: '', cohort: '', date: '', companyName: '', participants: [], group: '' }
            }
          }));

          // Update live activity
          setLiveActivity(prev => {
            const newActivity = new Map(prev);
            newActivity.set(`${group}-update`, {
              user: payload.payload.senderId || 'Unknown',
              action: `Updating data in ${group}`,
              timestamp: Date.now()
            });
            return newActivity;
          });
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
      if (viewMode === 'single') {
        newSelected.clear();
      }
      newSelected.add(group);
    }
    setSelectedGroups(newSelected);
  };

  const currentGroupData = selectedGroups.size > 0 
    ? groupsData[Array.from(selectedGroups)[0]] 
    : undefined;

  const tabs = [
    { id: 'pestel', label: 'PESTEL' },
    { id: 'mckinsey', label: 'McKinsey 7S' },
    { id: 'vrio', label: 'VRIO' },
    { id: 'tows', label: 'TOWS' },
    { id: 'porters', label: "Porter's Forces" }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue text-white p-3 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time monitoring of all groups</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">{groups.length} Total Groups</div>
              <div className="text-xs text-gray-500">{selectedGroups.size} Viewing</div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Group Selector */}
        <AdminGroupSelector
          groups={groups}
          selectedGroups={selectedGroups}
          onToggleGroup={handleToggleGroup}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Activity Monitor */}
        {selectedGroups.size > 0 && (
          <AdminMonitor 
            selectedGroups={selectedGroups}
            liveActivity={liveActivity}
            groupsData={groupsData}
          />
        )}

        {/* Content Area */}
        {selectedGroups.size === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No group selected</h3>
            <p className="text-gray-500">Select a group from the dropdown above to view and monitor their data</p>
          </div>
        ) : viewMode === 'single' && currentGroupData ? (
          <div className="space-y-6">
            {/* Group Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {Array.from(selectedGroups)[0]}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Company</span>
                  <p className="text-gray-900 font-semibold">{currentGroupData.meta.companyName || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Cohort</span>
                  <p className="text-gray-900 font-semibold">{currentGroupData.meta.cohort || 'MA27'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Date</span>
                  <p className="text-gray-900 font-semibold">{currentGroupData.meta.date || '05 - 06 June 2026'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Participants</span>
                  <p className="text-gray-900 font-semibold">{currentGroupData.meta.participants?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap",
                      activeTab === tab.id
                        ? 'border-brand-blue text-brand-blue bg-brand-blue/5'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AdminTablePreview
                  activeTab={activeTab}
                  pestelData={currentGroupData.pestel}
                  mckinseyData={currentGroupData.mckinsey}
                  vrioAnalysisData={currentGroupData.vrio}
                  vrioNotes={currentGroupData.vrioNotes}
                  towsData={currentGroupData.tows}
                  portersData={currentGroupData.porters}
                  meta={currentGroupData.meta}
                  setMeta={() => {}}
                />
              </div>
            </div>
          </div>
        ) : viewMode === 'multi' && selectedGroups.size > 0 ? (
          <div className="space-y-8">
            {Array.from(selectedGroups).map(group => {
              const data = groupsData[group];
              if (!data) return null;
              
              return (
                <div key={group} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">{group}</h3>
                    <div className="flex gap-8 mt-2 text-sm">
                      <span className="text-gray-600"><strong>Company:</strong> {data.meta.companyName || 'Not set'}</span>
                      <span className="text-gray-600"><strong>Participants:</strong> {data.meta.participants?.length || 0}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Current Data Preview</h4>
                    
                    {/* Mini tab view for multi-view */}
                    <div className="space-y-4">
                      {data.pestel.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-semibold text-sm text-gray-700 mb-2">PESTEL Progress</h5>
                          <p className="text-sm text-gray-600">{data.pestel.length} factors defined</p>
                        </div>
                      )}
                      {Object.keys(data.mckinsey).length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-semibold text-sm text-gray-700 mb-2">McKinsey 7S Progress</h5>
                          <p className="text-sm text-gray-600">{Object.keys(data.mckinsey).length} elements started</p>
                        </div>
                      )}
                      {data.vrio.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-semibold text-sm text-gray-700 mb-2">VRIO Analysis Progress</h5>
                          <p className="text-sm text-gray-600">{data.vrio.length} resources analyzed</p>
                        </div>
                      )}
                      {data.tows.opportunities.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-semibold text-sm text-gray-700 mb-2">TOWS Matrix Progress</h5>
                          <p className="text-sm text-gray-600">
                            {data.tows.opportunities.length} opportunities, {data.tows.threats.length} threats
                          </p>
                        </div>
                      )}
                      {Object.keys(data.porters).length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-semibold text-sm text-gray-700 mb-2">Porter's Forces Progress</h5>
                          <p className="text-sm text-gray-600">Framework started</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
