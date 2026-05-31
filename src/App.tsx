import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import React from 'react';
import { ManualSaveButton } from './components/ManualSaveButton';
import {
  FileText,
  Settings2,
  Network,
  Files,
  LogOut,
  Trash,
  Trash2,
  Bomb,
  BookOpen,
  Users,
  WifiOff,
  CloudCheck,
} from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { toPng, toJpeg } from 'html-to-image';
import { supabase } from './lib/supabase';
import { PasscodeModal, AdminDashboard } from './components/Admin';
import { cn } from './lib/utils';
import {
  MetaData,
  PESTELData,
  PESTELRow,
  McKinsey7SData,
  VRIORow,
  TOWSRow,
  PorterRow,
  GroupData,
  PortersFiveForcesData,
} from './types';

import {
  PESTELWorksheet,
  McKinseyWorksheet,
  VRIOFramework,
  VRIOAnalysisTable,
  TOWSWorksheet,
  PortersFiveForces,
  ConfrontationMatrixGuide,
} from './components/Worksheets';

// Error Boundary Component for stability
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong.</h1>
          <p className="mb-8 text-gray-600">
            We've encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-blue hover:bg-brand-blue/90 cursor-pointer rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CorporateHeader = ({
  meta,
  setMeta,
  selectedGroup,
  hideMeta = false,
  participants = [],
  isAdmin = false,
  onRemoveParticipant,
}: {
  meta: MetaData;
  setMeta: (m: MetaData) => void;
  selectedGroup?: string | null;
  hideMeta?: boolean;
  participants?: string[];
  isAdmin?: boolean;
  onRemoveParticipant?: (name: string) => void;
}) => {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col items-start justify-between gap-4 border-b-2 border-gray-100 pb-8 md:flex-row',
        hideMeta && 'mb-4 border-none',
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/WWxYzvmx/pbs-logo.png"
            alt="Business School Logo"
            className="h-24 object-contain md:h-48"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {!hideMeta && (
        <div className="grid w-full max-w-xl grid-cols-1 gap-x-12 gap-y-2 text-sm sm:grid-cols-2">
          <div className="col-span-1 flex flex-col border-b border-gray-200 sm:col-span-2">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Module
            </span>
            <span className="font-semibold text-black">Strategic Development Project (SDP)</span>
          </div>
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Cohort
            </span>
            <span className="font-semibold text-black">MA27</span>
          </div>
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Group
            </span>
            <span className="font-semibold text-black">{selectedGroup || 'Group 1'}</span>
          </div>
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Date
            </span>
            <span className="font-semibold text-black">05 - 06 June 2026</span>
          </div>
          <div className="col-span-2 flex flex-col border-b border-gray-200">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Company Name
            </span>
            <input
              className="w-full border-b border-dashed border-gray-300 bg-transparent font-semibold text-gray-700 outline-hidden"
              placeholder="Enter company name..."
              type="text"
              value={meta.companyName}
              onChange={(e) => setMeta({ ...meta, companyName: e.target.value })}
            />
          </div>
          <div className="col-span-2 flex flex-col border-b border-gray-200">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Participants
            </span>
            <div className="mt-1 font-semibold text-gray-700">
              {(participants || []).length > 0 ? (
                <div className="flex flex-col gap-1">
                  {(participants || []).map((p) => (
                    <div key={p} className="flex items-center justify-between">
                      <span className="truncate text-sm">{p}</span>
                      {isAdmin && onRemoveParticipant && (
                        <button
                          onClick={() => onRemoveParticipant(p)}
                          className="ml-2 text-xs text-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400">No participants yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import {
  AuthLayout,
  AuthInput,
  AuthSelect,
  AuthButton,
  User,
  ShieldCheck,
  ArrowRight,
} from './components/Auth/AuthUI';

const AccessPage = ({
  onSelectGroup,
  onAdminClick,
}: {
  onSelectGroup: (group: string, name: string) => void;
  onAdminClick: () => void;
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [fullName, setFullName] = useState(() => localStorage.getItem('sdp_user_name') || '');

  const handleContinue = () => {
    if (selectedValue && fullName.trim()) {
      try {
        localStorage.setItem('sdp_user_name', fullName.trim());
      } catch {
        /* ignore */
      }
      onSelectGroup(selectedValue, fullName.trim());
    }
  };

  return (
    <AuthLayout
      title="Workspace Access"
      subtitle="Initialize your team assignment."
      footer={
        <div className="flex w-full justify-center pt-4">
          <button
            onClick={onAdminClick}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-10 py-5 text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase shadow-xl transition-all active:scale-95 hover:bg-slate-900 hover:text-white"
          >
            <ShieldCheck size={18} /> Admin Access
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <AuthInput
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            icon={<User size={18} />}
          />

          <AuthSelect
            label="Assigned Group"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="">Choose your team...</option>
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i + 1} value={`Group ${i + 1}`}>
                Group {i + 1}
              </option>
            ))}
          </AuthSelect>
        </div>

        <div className="pt-2">
          <AuthButton
            onClick={handleContinue}
            disabled={!selectedValue || !fullName.trim()}
            variant="primary"
            icon={<ArrowRight size={18} />}
          >
            Enter Workspace
          </AuthButton>
        </div>
      </div>
    </AuthLayout>
  );
};

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(() => {
    return localStorage.getItem('sdp_selected_group');
  });
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('sdp_admin_auth') === 'true';
  });
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem('sdp_selected_group', selectedGroup);
    } else {
      localStorage.removeItem('sdp_selected_group');
    }
  }, [selectedGroup]);

  // Unified navigation logic
  useEffect(() => {
    const path = location.pathname;

    if (!selectedGroup && path !== '/access' && !isAdminMode) {
      navigate('/access', { replace: true });
    } else if (selectedGroup && path !== '/workspace' && !isAdminMode) {
      navigate('/workspace', { replace: true });
    }
  }, [selectedGroup, isAdminMode, location.pathname, navigate]);

  const handleSelectGroup = (group: string, name?: string) => {
    if (name) {
      try {
        localStorage.setItem('sdp_user_name', name);
      } catch {
        /* ignore */
      }
    }
    setSelectedGroup(group);
    navigate('/workspace');
  };

  const handleAdminAuthenticated = () => {
    setIsAdminMode(true);
    setShowPasscodeModal(false);
    localStorage.setItem('sdp_admin_auth', 'true');
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    localStorage.removeItem('sdp_admin_auth');
    navigate('/access');
  };

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/access"
            element={
              <AccessPage
                onSelectGroup={handleSelectGroup}
                onAdminClick={() => setShowPasscodeModal(true)}
              />
            }
          />

          <Route
            path="/workspace"
            element={
              selectedGroup ? (
                <AppContent
                  key={selectedGroup}
                  selectedGroup={selectedGroup}
                  isAdmin={isAdminMode}
                  onExit={() => {
                    setSelectedGroup(null);
                    navigate('/access');
                  }}
                />
              ) : (
                <Navigate to="/access" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              isAdminMode ? (
                <AdminDashboard onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/access" replace />
              )
            }
          />

          <Route path="/" element={<Navigate to="/access" replace />} />
        </Routes>
      </AnimatePresence>

      {showPasscodeModal && (
        <PasscodeModal
          onAuthenticated={handleAdminAuthenticated}
          onCancel={() => setShowPasscodeModal(false)}
        />
      )}
    </ErrorBoundary>
  );
}

function AppContent({
  selectedGroup,
  onExit,
  isAdmin,
}: {
  selectedGroup: string;
  onExit: () => void;
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>(
    () => {
      const saved = localStorage.getItem(`sdp_tab_${selectedGroup}`);
      const validTabs = ['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER'];
      return (validTabs.includes(saved || '') ? saved : 'PESTEL') as
        | 'PESTEL'
        | 'McKinsey'
        | 'VRIO'
        | 'TOWS'
        | 'PORTER';
    },
  );

  useEffect(() => {
    localStorage.setItem(`sdp_tab_${selectedGroup}`, activeTab);
  }, [activeTab, selectedGroup]);
  const [activeForce, setActiveForce] = useState<keyof PortersFiveForcesData>('suppliers');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopParticipants, setShowTopParticipants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Core Worksheet State
  const [pestelData, setPestelData] = useState<PESTELData[]>(
    ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map((cat) => ({
      id: cat,
      category: cat as PESTELData['category'],
      description: '',
      impact: '',
      probability: '',
      potential: '',
    })),
  );
  const [mckinseyData, setMckinseyData] = useState<McKinsey7SData>({});
  const [vrioAnalysisData, setVrioAnalysisData] = useState<VRIORow[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: `res-${i}`,
      resource: '',
      type: '',
      detail: '',
      v: '',
      r: '',
      i: '',
      o: '',
    })),
  );
  const [vrioNotes, setVrioNotes] = useState('');
  const [towsData, setTowsData] = useState<TOWSRow[]>([]);
  const [portersData, setPortersData] = useState<PorterRow[]>([]);
  const [meta, setMeta] = useState<MetaData>({
    module: '',
    cohort: '',
    date: '',
    companyName: '',
    participants: [],
    group: selectedGroup || '',
  });

  // Collaboration Refs
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const dbUpdateTimeout = useRef<NodeJS.Timeout | null>(null);
  const clientIdRef = useRef<string | null>(null);
  const displayNameRef = useRef<string | null>(null);

  // Refs for tracking changes
  const cloudLastPestelRef = useRef<PESTELData[]>([]);
  const cloudLastMcKinseyRef = useRef<McKinsey7SData>({});
  const cloudLastVrioRef = useRef<VRIORow[]>([]);
  const cloudLastVrioNotesRef = useRef<string>('');
  const cloudLastTowsRef = useRef<TOWSRow[]>([]);
  const cloudLastPorterRef = useRef<PorterRow[]>([]);
  const cloudLastMetaRef = useRef<MetaData | null>(null);

  // Refs for tracking broadcasts (to avoid loops)
  const broadcastLastPestelRef = useRef<string>('');
  const broadcastLastMcKinseyRef = useRef<string>('');
  const broadcastLastVrioRef = useRef<string>('');
  const broadcastLastTowsRef = useRef<string>('');
  const broadcastLastPorterRef = useRef<string>('');
  const broadcastLastMetaRef = useRef<string>('');

  // Initialize collaboration IDs once on mount
  useEffect(() => {
    let id = localStorage.getItem('sdp_client_id');
    if (!id) {
      id = 'user-' + Math.random().toString(36).slice(2, 9);
      try {
        localStorage.setItem('sdp_client_id', id);
      } catch {
        /* ignore */
      }
    }
    clientIdRef.current = id;

    const name = localStorage.getItem('sdp_user_name');
    displayNameRef.current = (name as string) || id || 'guest';
  }, []);

  const roomChannelRef = useRef<RealtimeChannel | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Initial Load: Hybrid Strategy
  useEffect(() => {
    if (!selectedGroup) return;

    const loadData = async () => {
      // Step A: Immediate Local Load (Instant)
      const saved = localStorage.getItem(`sdp_group_${selectedGroup}`);
      if (saved) {
        try {
          const local = JSON.parse(saved);
          if (local.pestel) setPestelData(local.pestel);
          if (local.mckinsey) setMckinseyData(local.mckinsey);
          if (local.vrio) setVrioAnalysisData(local.vrio);
          if (local.vrioNotes) setVrioNotes(local.vrioNotes || '');
          if (local.tows) setTowsData(local.tows);
          if (local.porters) setPortersData(local.porters);
          if (local.meta) setMeta(local.meta);
          
          // Note: We don't update last*Refs here yet because we want 
          // to compare this local data with cloud data later.
        } catch (e) {
          console.error('Failed to parse local backup', e);
        }
      }

      // Step B: Cloud Sync (Reliable)
      try {
        const mergePestel = (fetched: PESTELRow[]) => {
          const defaults = ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(cat => ({
            id: cat, category: cat as PESTELRow['category'], description: '', impact: '', probability: '', potential: ''
          }));
          return defaults.map(d => fetched.find(f => f.id === d.id) || d);
        };

        const mergeTOWS = (fetched: TOWSRow[]) => {
          const sections = ['opportunities', 'threats', 'strengths', 'weaknesses'] as const;
          const defaults = sections.map(s => ({ section: s, data: ['', '', ''], scores: {}, notes: {} } as TOWSRow));
          return defaults.map(d => fetched.find(f => f.section === d.section) || d);
        };

        const mergePorter = (fetched: PorterRow[]) => {
          const forces = ['newEntrants', 'buyers', 'suppliers', 'substitutes', 'rivalry'] as const;
          const defaults = forces.map(f => ({ force: f, analysis: '', impact: 'Low', scorecard: {}, further: [] } as PorterRow));
          return defaults.map(d => fetched.find(f => f.force === d.force) || d);
        };

        const [
          { data: pestel, error: pestelErr },
          { data: vrio, error: vrioErr },
          { data: tows, error: towsErr },
          { data: porter, error: porterErr },
          { data: mckinsey, error: mckinseyErr },
          { data: metaRes, error: metaErr },
        ] = await Promise.all([
          supabase.from('pestel_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('vrio_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('tows_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('porter_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('mckinsey_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('meta_data').select('content').eq('group_id', selectedGroup).maybeSingle(),
        ]);

        if (pestelErr || vrioErr || towsErr || porterErr || mckinseyErr || metaErr) {
          throw new Error('Supabase fetch error');
        }

        // Only update state if cloud data actually exists for each category
        // This prevents wiping out local data with defaults if cloud is empty
        if (pestel && pestel.length > 0) {
          const fetchedData = pestel.map((r: { content: PESTELRow }) => r.content);
          const merged = mergePestel(fetchedData);
          setPestelData(merged);
          cloudLastPestelRef.current = merged;
          broadcastLastPestelRef.current = JSON.stringify(merged);
        }
        
        if (vrio && vrio.length > 0) {
          const fetchedData = vrio.map((r: { content: VRIORow }) => r.content);
          setVrioAnalysisData(fetchedData);
          cloudLastVrioRef.current = fetchedData;
          broadcastLastVrioRef.current = JSON.stringify({ data: fetchedData, notes: vrioNotes });
        }
        
        if (tows && tows.length > 0) {
          const fetchedData = tows.map((r: { content: TOWSRow }) => r.content);
          const merged = mergeTOWS(fetchedData);
          setTowsData(merged);
          cloudLastTowsRef.current = merged;
          broadcastLastTowsRef.current = JSON.stringify(merged);
        }
        
        if (porter && porter.length > 0) {
          const fetchedData = porter.map((r: { content: PorterRow }) => r.content);
          const merged = mergePorter(fetchedData);
          setPortersData(merged);
          cloudLastPorterRef.current = merged;
          broadcastLastPorterRef.current = JSON.stringify(merged);
        }
        
        if (mckinsey && mckinsey.length > 0) {
          const data = mckinsey[0].content;
          setMckinseyData(data);
          cloudLastMcKinseyRef.current = data;
          broadcastLastMcKinseyRef.current = JSON.stringify(data);
        }
        
        if (metaRes?.content) {
          setMeta(metaRes.content);
          cloudLastMetaRef.current = metaRes.content;
          broadcastLastMetaRef.current = JSON.stringify(metaRes.content);
          if (metaRes.content.vrioNotes) {
            setVrioNotes(metaRes.content.vrioNotes);
            cloudLastVrioNotesRef.current = metaRes.content.vrioNotes;
          }
        }

        setSyncStatus('synced');
      } catch (err: unknown) {
        const e = err as { message?: string; details?: string };
        const errorMsg = e?.message || e?.details || JSON.stringify(e);
        console.warn(`Supabase fetch failed (${errorMsg}) - entering offline mode.`, err);
        setSyncStatus('offline');
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedGroup]);

  // 2. Realtime Subscription
  useEffect(() => {
    if (!selectedGroup || isLoading) return;

    if (roomChannelRef.current) {
      try {
        roomChannelRef.current.unsubscribe();
      } catch {
        /* ignore */
      }
      roomChannelRef.current = null;
    }

    const channel = supabase.channel(`room:${selectedGroup}`, {
      config: { presence: { key: clientIdRef.current ?? undefined } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          const presences = Object.values(state).flat() as { name?: string; client?: string }[];
          const names = presences.map((p) => p?.name || p?.client).filter(Boolean);
          setMeta(
            (prev) => ({ ...(prev || {}), participants: Array.from(new Set(names)) }) as MetaData,
          );
        } catch (err) {
          console.error('Presence parse error', err);
        }
      })
      .on('broadcast', { event: 'update_pestel' }, ({ payload }) => {
        if (payload?.senderId === clientIdRef.current) return;
        const stringified = JSON.stringify(payload.data);
        if (stringified === broadcastLastPestelRef.current) return;
        
        setPestelData(payload.data);
        cloudLastPestelRef.current = payload.data;
        broadcastLastPestelRef.current = stringified;
      })
      .on('broadcast', { event: 'update_mckinsey' }, ({ payload }) => {
        if (payload?.senderId === clientIdRef.current) return;
        const stringified = JSON.stringify(payload.data);
        if (stringified === broadcastLastMcKinseyRef.current) return;
        
        setMckinseyData(payload.data);
        cloudLastMcKinseyRef.current = payload.data;
        broadcastLastMcKinseyRef.current = stringified;
      })
      .on('broadcast', { event: 'update_vrio' }, ({ payload }) => {
        if (payload?.senderId === clientIdRef.current) return;
        const stringified = JSON.stringify(payload.data);
        if (stringified === broadcastLastVrioRef.current) return;
        
        setVrioAnalysisData(payload.data.data);
        setVrioNotes(payload.data.notes || '');
        cloudLastVrioRef.current = payload.data.data;
        cloudLastVrioNotesRef.current = payload.data.notes || '';
        broadcastLastVrioRef.current = stringified;
      })
      .on('broadcast', { event: 'update_tows' }, ({ payload }) => {
        if (payload?.senderId === clientIdRef.current) return;
        const stringified = JSON.stringify(payload.data);
        if (stringified === broadcastLastTowsRef.current) return;
        
        setTowsData(payload.data);
        cloudLastTowsRef.current = payload.data;
        broadcastLastTowsRef.current = stringified;
      })
      .on('broadcast', { event: 'update_porter' }, ({ payload }) => {
        if (payload?.senderId === clientIdRef.current) return;
        const stringified = JSON.stringify(payload.data);
        if (stringified === broadcastLastPorterRef.current) return;
        
        setPortersData(payload.data);
        cloudLastPorterRef.current = payload.data;
        broadcastLastPorterRef.current = stringified;
      })
      .on('broadcast', { event: 'update_meta' }, ({ payload }) => {
        if (payload?.senderId === clientIdRef.current) return;
        const stringified = JSON.stringify(payload.data);
        if (stringified === broadcastLastMetaRef.current) return;
        
        setMeta(payload.data);
        cloudLastMetaRef.current = payload.data;
        broadcastLastMetaRef.current = stringified;
      })
      .on('broadcast', { event: 'kick_user' }, ({ payload }) => {
        if (
          payload.userName === displayNameRef.current ||
          payload.clientId === clientIdRef.current
        ) {
          onExit();
          alert('You have been removed from the session by an administrator.');
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          try {
            await channel.track({
              name: displayNameRef.current,
              online_at: new Date().toISOString(),
            });
          } catch (e) {
            console.warn('Failed to track presence', e);
          }
        }
      });

    roomChannelRef.current = channel;

    return () => {
      try {
        channel.unsubscribe();
      } catch {
        /* ignore */
      }
      roomChannelRef.current = null;
    };
  }, [selectedGroup, isLoading, onExit]);

  // Ref for manual save tracking
  const [isSyncing, setIsSyncing] = useState(false);

  const forceSave = React.useCallback(async () => {
    if (!selectedGroup) return;
    
    setSyncStatus('syncing');
    setIsSyncing(true);
    const tasks = [];
    const updates: { key: string, data: any }[] = [];

    try {
      // Compare and prepare upserts
      if (JSON.stringify(pestelData) !== JSON.stringify(cloudLastPestelRef.current)) {
        tasks.push(
          supabase
            .from('pestel_rows')
            .upsert(pestelData.map((d) => ({ group_id: selectedGroup, row_key: d.id, content: d })), { onConflict: 'group_id,row_key' })
            .then(r => { if (r.error) throw r.error; return r; })
        );
        updates.push({ key: 'pestel', data: pestelData });
      }
      
      if (JSON.stringify(mckinseyData) !== JSON.stringify(cloudLastMcKinseyRef.current)) {
        tasks.push(
          supabase
            .from('mckinsey_rows')
            .upsert({ group_id: selectedGroup, content: mckinseyData }, { onConflict: 'group_id' })
            .then(r => { if (r.error) throw r.error; return r; })
        );
        updates.push({ key: 'mckinsey', data: mckinseyData });
      }
      
      if (JSON.stringify(vrioAnalysisData) !== JSON.stringify(cloudLastVrioRef.current)) {
        tasks.push(
          supabase
            .from('vrio_rows')
            .upsert(
              vrioAnalysisData.map((d) => ({ group_id: selectedGroup, row_key: d.id, content: d })),
              { onConflict: 'group_id,row_key' }
            )
            .then(r => { if (r.error) throw r.error; return r; })
        );
        updates.push({ key: 'vrio', data: vrioAnalysisData });
      }

      if (JSON.stringify(towsData) !== JSON.stringify(cloudLastTowsRef.current)) {
        tasks.push(
          supabase
            .from('tows_rows')
            .upsert(
              towsData.map((d) => ({ group_id: selectedGroup, row_key: d.section, content: d })),
              { onConflict: 'group_id,row_key' }
            )
            .then(r => { if (r.error) throw r.error; return r; })
        );
        updates.push({ key: 'tows', data: towsData });
      }

      if (JSON.stringify(portersData) !== JSON.stringify(cloudLastPorterRef.current)) {
        tasks.push(
          supabase
            .from('porter_rows')
            .upsert(
              portersData.map((d) => ({ group_id: selectedGroup, row_key: d.force, content: d })),
              { onConflict: 'group_id,row_key' }
            )
            .then(r => { if (r.error) throw r.error; return r; })
        );
        updates.push({ key: 'porter', data: portersData });
      }
      
      // 4. Meta & VRIO Notes (Consolidated to prevent overwrites)
      const metaChanged = JSON.stringify(meta) !== JSON.stringify(cloudLastMetaRef.current);
      const vrioNotesChanged = vrioNotes !== cloudLastVrioNotesRef.current;

      if (metaChanged || vrioNotesChanged) {
        const consolidatedMeta = { 
          ...meta, 
          vrioNotes, 
          group: selectedGroup 
        };
        
        tasks.push(
          supabase
            .from('meta_data')
            .upsert({ group_id: selectedGroup, content: consolidatedMeta }, { onConflict: 'group_id' })
            .then(r => { 
              if (r.error) throw r.error; 
              return r; 
            })
        );
        
        updates.push(
          { key: 'meta', data: meta },
          { key: 'vrioNotes', data: vrioNotes }
        );
      }

      if (tasks.length > 0) {
        await Promise.all(tasks);
        
        // Update refs ONLY after successful save
        updates.forEach(u => {
          if (u.key === 'pestel') cloudLastPestelRef.current = u.data;
          if (u.key === 'mckinsey') cloudLastMcKinseyRef.current = u.data;
          if (u.key === 'vrio') cloudLastVrioRef.current = u.data;
          if (u.key === 'vrioNotes') cloudLastVrioNotesRef.current = u.data;
          if (u.key === 'tows') cloudLastTowsRef.current = u.data;
          if (u.key === 'porter') cloudLastPorterRef.current = u.data;
          if (u.key === 'meta') cloudLastMetaRef.current = u.data;
        });
        setLastSaved(new Date());
      }
      setSyncStatus('synced');
    } catch (err) {
      console.error('Manual/Auto save failed:', err);
      setSyncStatus('offline');
    } finally {
      setIsSyncing(false);
    }
  }, [
    pestelData,
    mckinseyData,
    vrioAnalysisData,
    vrioNotes,
    towsData,
    portersData,
    meta,
    selectedGroup,
  ]);

  // 3. Auto-save and Broadcast
  useEffect(() => {
    if (isLoading || !isInitialized) return;

    // A. LocalStorage (Immediate safety)
    localStorage.setItem(`sdp_group_${selectedGroup}`, JSON.stringify({
      pestel: pestelData,
      mckinsey: mckinseyData,
      vrio: vrioAnalysisData,
      vrioNotes,
      tows: towsData,
      porters: portersData,
      meta,
    }));

    // B. Realtime Broadcast
    const ch = roomChannelRef.current;
    if (ch && updateTimeout.current) clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      if (!ch) return;
      
      const broadcast = (event: string, data: any) => {
        ch.send({ type: 'broadcast', event, payload: { senderId: clientIdRef.current, data } });
      };

      if (JSON.stringify(pestelData) !== broadcastLastPestelRef.current) {
        broadcast('update_pestel', pestelData);
        broadcastLastPestelRef.current = JSON.stringify(pestelData);
      }
      if (JSON.stringify(mckinseyData) !== broadcastLastMcKinseyRef.current) {
        broadcast('update_mckinsey', mckinseyData);
        broadcastLastMcKinseyRef.current = JSON.stringify(mckinseyData);
      }
      const vrioCombined = JSON.stringify({ data: vrioAnalysisData, notes: vrioNotes });
      if (vrioCombined !== broadcastLastVrioRef.current) {
        broadcast('update_vrio', { data: vrioAnalysisData, notes: vrioNotes });
        broadcastLastVrioRef.current = vrioCombined;
      }
      if (JSON.stringify(towsData) !== broadcastLastTowsRef.current) {
        broadcast('update_tows', towsData);
        broadcastLastTowsRef.current = JSON.stringify(towsData);
      }
      if (JSON.stringify(portersData) !== broadcastLastPorterRef.current) {
        broadcast('update_porter', portersData);
        broadcastLastPorterRef.current = JSON.stringify(portersData);
      }
      if (JSON.stringify(meta) !== broadcastLastMetaRef.current) {
        broadcast('update_meta', meta);
        broadcastLastMetaRef.current = JSON.stringify(meta);
      }
      updateTimeout.current = null;
    }, 300);

    // C. Database Sync (Persistent Cloud)
    if (dbUpdateTimeout.current) clearTimeout(dbUpdateTimeout.current);

    dbUpdateTimeout.current = setTimeout(async () => {
      try {
        await forceSave();
      } catch (err) {
        console.warn('Cloud save failed - progress saved locally', err);
        setSyncStatus('offline');
      }
      dbUpdateTimeout.current = null;
    }, 3000);
  }, [
    pestelData,
    mckinseyData,
    vrioAnalysisData,
    vrioNotes,
    towsData,
    portersData,
    meta,
    selectedGroup,
    isLoading,
    isInitialized,
    forceSave,
  ]);

  // 4. Auto-retry sync on reconnection
  useEffect(() => {
    const handleOnline = () => {
      console.log("DEBUG: Connection restored, triggering sync...");
      forceSave();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [forceSave]);

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const printRef = document.getElementById('full-report-print-container');
      if (!printRef) throw new Error('Print container not found');
      const originalPrintDisplay = printRef.style.display;
      printRef.style.display = 'block';

      if (activeTab === 'PORTER') {
        const forces = ['suppliers', 'buyers', 'newEntrants', 'substitutes', 'rivalry'] as const;
        let isFirstPage = true;
        for (const force of forces) {
          const section = Array.from(printRef.querySelectorAll('.print-section')).find((s) =>
            s
              .querySelector('h2')
              ?.textContent?.toUpperCase()
              .includes(`PORTER'S 5 FORCES: ${force.toUpperCase()}`),
          ) as HTMLElement;
          if (section) {
            section.style.display = 'block';
            const imgData = await toJpeg(section, {
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              cacheBust: true,
            });
            if (!isFirstPage) pdf.addPage();
            isFirstPage = false;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgRatio = imgProps.width / imgProps.height;
            const pageRatio = pageWidth / pageHeight;
            let finalWidth, finalHeight;
            if (imgRatio > pageRatio) {
              finalWidth = pageWidth;
              finalHeight = pageWidth / imgRatio;
            } else {
              finalHeight = pageHeight;
              finalWidth = pageHeight * imgRatio;
            }
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;
            pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
            section.style.display = 'none';
          }
        }
        pdf.save(`Porters_Five_Forces_Full_${meta.companyName || 'Export'}.pdf`);
      } else {
        const section = Array.from(printRef.querySelectorAll('.print-section')).find((s) => {
          const h2Text = s.querySelector('h2')?.textContent?.toUpperCase() || '';
          if (activeTab === 'PESTEL') return h2Text.includes('PESTEL ANALYSIS');
          if (activeTab === 'McKinsey') return h2Text.includes('MCKINSEY 7-S FRAMEWORK');
          if (activeTab === 'VRIO') return h2Text.includes('VRIO FRAMEWORK');
          if (activeTab === 'TOWS') return h2Text.includes('CONFRONTATION MATRIX');
          return false;
        }) as HTMLElement;

        if (section) {
          section.style.display = 'block';
          const imgData = await toPng(section, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            cacheBust: true,
          });
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgProps = pdf.getImageProperties(imgData);
          const imgRatio = imgProps.width / imgProps.height;
          const pageRatio = pageWidth / pageHeight;
          let finalWidth, finalHeight;
          if (imgRatio > pageRatio) {
            finalWidth = pageWidth;
            finalHeight = pageWidth / imgRatio;
          } else {
            finalHeight = pageHeight;
            finalWidth = pageHeight * imgRatio;
          }
          const x = (pageWidth - finalWidth) / 2;
          const y = (pageHeight - finalHeight) / 2;
          pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
          pdf.save(`${activeTab}_Worksheet_${meta.companyName || 'Export'}.pdf`);
          section.style.display = 'none';
        }
      }
      printRef.style.display = originalPrintDisplay;
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllPDF = async () => {
    setIsExporting(true);
    setIsExportingAll(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const printRef = document.getElementById('full-report-print-container');
      if (!printRef) throw new Error('Print container not found');
      const originalPrintDisplay = printRef.style.display;
      printRef.style.display = 'block';
      const sections = printRef.querySelectorAll('.print-section');
      let isFirstPage = true;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        section.style.display = 'block';
        const imgData = await toJpeg(section, {
          quality: 0.92,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
        if (!isFirstPage) pdf.addPage();
        isFirstPage = false;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;
        const pageRatio = pageWidth / pageHeight;
        let finalWidth, finalHeight;
        if (imgRatio > pageRatio) {
          finalWidth = pageWidth;
          finalHeight = pageWidth / imgRatio;
        } else {
          finalHeight = pageHeight;
          finalWidth = pageHeight * imgRatio;
        }
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;
        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
        section.style.display = 'none';
      }
      pdf.save(`Full_Strategy_Report_${meta.companyName || 'Export'}.pdf`);
      printRef.style.display = originalPrintDisplay;
    } catch (error) {
      console.error('Export all failed:', error);
    } finally {
      setIsExporting(false);
      setIsExportingAll(false);
    }
  };

  const destroyAllGroupData = async () => {
    if (!selectedGroup) return;
    
    const confirm1 = confirm("⚠️ DANGER: This will PERMANENTLY DELETE ALL data for this group across ALL worksheets. This cannot be undone. Are you sure?");
    if (!confirm1) return;
    
    const confirm2 = confirm("FINAL WARNING: Are you absolutely certain you want to destroy all data for group: " + selectedGroup + "?");
    if (!confirm2) return;

    setIsLoading(true);
    setSyncStatus('syncing');

    try {
      // 1. Delete from Supabase
      const tables = ['pestel_rows', 'vrio_rows', 'tows_rows', 'porter_rows', 'mckinsey_rows', 'meta_data'];
      await Promise.all(
        tables.map(table => supabase.from(table).delete().eq('group_id', selectedGroup))
      );

      // 2. Clear Local Storage
      localStorage.removeItem(`sdp_group_${selectedGroup}`);

      // 3. Reset Local State to Defaults
      setPestelData(['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(cat => ({
        id: cat, category: cat as PESTELRow['category'], description: '', impact: '', probability: '', potential: ''
      })));
      setMckinseyData({});
      setVrioAnalysisData(Array.from({ length: 8 }, (_, i) => ({
        id: `res-${i}`, resource: '', type: '', detail: '', v: '', r: '', i: '', o: ''
      })));
      setVrioNotes('');
      setTowsData([
        { id: 'opportunities', section: 'opportunities', data: ['', '', ''], scores: {}, notes: {} },
        { id: 'threats', section: 'threats', data: ['', '', ''], scores: {}, notes: {} },
        { id: 'strengths', section: 'strengths', data: ['', '', ''], scores: {}, notes: {} },
        { id: 'weaknesses', section: 'weaknesses', data: ['', '', ''], scores: {}, notes: {} }
      ]);
      setPortersData([
        { id: 'newEntrants', force: 'newEntrants', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
        { id: 'buyers', force: 'buyers', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
        { id: 'suppliers', force: 'suppliers', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
        { id: 'substitutes', force: 'substitutes', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
        { id: 'rivalry', force: 'rivalry', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) }
      ]);
      setMeta({ 
        module: '', 
        cohort: '', 
        date: new Date().toISOString().split('T')[0], 
        companyName: '', 
        participants: meta.participants || [], 
        group: selectedGroup 
      });

      // Update refs to match empty state
      cloudLastPestelRef.current = [];
      cloudLastMcKinseyRef.current = {};
      cloudLastVrioRef.current = [];
      cloudLastVrioNotesRef.current = '';
      cloudLastTowsRef.current = [];
      cloudLastPorterRef.current = [];
      cloudLastMetaRef.current = null;
      
      broadcastLastPestelRef.current = '';
      broadcastLastMcKinseyRef.current = '';
      broadcastLastVrioRef.current = '';
      broadcastLastTowsRef.current = '';
      broadcastLastPorterRef.current = '';
      broadcastLastMetaRef.current = '';

      setSyncStatus('synced');
      alert('Group data destroyed successfully.');
    } catch (err) {
      console.error('Destroy failed:', err);
      alert('Failed to destroy data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    if (confirm('Clear all data for this worksheet?')) {
      if (activeTab === 'PESTEL') {
        setPestelData(
          ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(
            (cat) => ({
              id: cat,
              category: cat as PESTELData['category'],
              description: '',
              impact: '',
              probability: '',
              potential: '',
            }),
          ),
        );
      } else if (activeTab === 'McKinsey') {
        setMckinseyData({});
      } else if (activeTab === 'VRIO') {
        setVrioAnalysisData(
          Array.from({ length: 8 }, (_, i) => ({
            id: `res-${i}`,
            resource: '',
            type: '',
            detail: '',
            v: '',
            r: '',
            i: '',
            o: '',
          })),
        );
        setVrioNotes('');
      } else if (activeTab === 'TOWS') {
        setTowsData([
          {
            id: 'opportunities',
            section: 'opportunities',
            data: Array(3).fill(''),
            scores: {},
            notes: {},
          },
          { id: 'threats', section: 'threats', data: Array(3).fill(''), scores: {}, notes: {} },
          { id: 'strengths', section: 'strengths', data: Array(3).fill(''), scores: {}, notes: {} },
          {
            id: 'weaknesses',
            section: 'weaknesses',
            data: Array(3).fill(''),
            scores: {},
            notes: {},
          },
        ]);
      } else if (activeTab === 'PORTER') {
        setPortersData([
          {
            id: 'newEntrants',
            force: 'newEntrants',
            analysis: '',
            impact: 'Medium',
            scorecard: {},
            further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })),
          },
          {
            id: 'buyers',
            force: 'buyers',
            analysis: '',
            impact: 'Medium',
            scorecard: {},
            further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })),
          },
          {
            id: 'suppliers',
            force: 'suppliers',
            analysis: '',
            impact: 'Medium',
            scorecard: {},
            further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })),
          },
          {
            id: 'substitutes',
            force: 'substitutes',
            analysis: '',
            impact: 'Medium',
            scorecard: {},
            further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })),
          },
          {
            id: 'rivalry',
            force: 'rivalry',
            analysis: '',
            impact: 'Medium',
            scorecard: {},
            further: Array.from({ length: 8 }, () => ({ col1: '', col2: '', col3: '', col4: '' })),
          },
        ]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="border-brand-blue mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-xs font-bold tracking-widest text-gray-900 uppercase">
            Loading Strategy Workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="selection:bg-brand-blue/10 min-h-screen bg-gray-50/50 p-2 font-sans md:p-8">
      <div className="mx-auto flex min-h-[90vh] max-w-[1400px] flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-2xl shadow-gray-200/50 md:rounded-[32px]">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-100 bg-white p-4 md:flex-row md:p-6">
          <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-start">
            <img
              src="https://i.ibb.co/WWxYzvmx/pbs-logo.png"
              alt="SDP Suite Logo"
              className="h-24 w-auto object-contain md:h-48"
              crossOrigin="anonymous"
            />
            <div className="mx-2 hidden h-8 w-px bg-gray-100 md:block" />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {syncStatus === 'synced' ? (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-2 py-1 text-[9px] font-black tracking-tighter text-green-600 uppercase">
                      <CloudCheck size={12} /> Cloud Saved
                    </div>
                    {lastSaved && (
                      <span className="mt-0.5 ml-1 text-[8px] font-bold text-gray-400">
                        {lastSaved.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                ) : syncStatus === 'syncing' ? (
                  <div className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[9px] font-black tracking-tighter text-blue-600 uppercase">
                    <div className="h-2 w-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />{' '}
                    Saving...
                  </div>
                ) : (
                  <div className="flex animate-pulse items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-[9px] font-black tracking-tighter text-amber-600 uppercase">
                    <WifiOff size={12} /> Offline Mode
                  </div>
                )}
              </div>
              <ManualSaveButton onSave={forceSave} isSyncing={isSyncing} />
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 md:w-auto md:gap-3">
            <div className="relative">
              <button
                onClick={() => setShowTopParticipants((s) => !s)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5 text-gray-700 shadow-sm hover:shadow-md md:px-3 md:py-2"
              >
                <Users className="h-4 w-4 text-green-600 md:h-5 md:w-5" />
                <span className="text-sm font-semibold text-gray-700">
                  {(meta.participants || []).length}
                </span>
              </button>
              {showTopParticipants && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-xs text-gray-500">Online users</div>
                  <ul className="max-h-40 space-y-1 overflow-auto text-sm">
                    {(meta.participants || []).length > 0 ? (
                      (meta.participants || []).map((p) => (
                        <li key={p} className="truncate">
                          {p}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No one else online</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to exit this session?')) onExit();
              }}
              className="flex cursor-pointer items-center gap-2 px-2 py-2 text-[9px] font-extrabold tracking-[0.1em] text-gray-500 uppercase transition-all hover:text-blue-600 md:px-4 md:text-[10px] md:tracking-[0.2em]"
            >
              <LogOut size={16} />
              <span className="hidden xl:inline">Exit</span>
            </button>
            <div className="mx-0.5 h-4 w-px bg-gray-200 md:mx-1" />
            <div className="flex items-center gap-0.5 md:gap-1">
              <button
                onClick={clearData}
                className="cursor-pointer p-1 text-gray-400 transition-all hover:text-red-500 md:p-2"
                title="Clear current worksheet"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={destroyAllGroupData}
                className="cursor-pointer border-l border-gray-100 p-1 text-red-200 transition-all hover:text-red-600 md:p-2"
                title="DESTROY ALL GROUP DATA"
              >
                <Trash size={16} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <button
                onClick={exportPDF}
                disabled={isExporting}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-[9px] font-extrabold tracking-[0.1em] text-white uppercase shadow-md shadow-black/10 transition-all hover:bg-black disabled:opacity-50 md:px-4 md:text-[10px] md:tracking-[0.2em]"
              >
                {isExporting && !isExportingAll ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <FileText size={16} />
                )}
                <span className="hidden sm:inline">Page PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={exportAllPDF}
                disabled={isExportingAll}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-[9px] font-extrabold tracking-[0.1em] text-white uppercase shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 disabled:opacity-50 md:px-5 md:text-[10px] md:tracking-[0.2em]"
              >
                {isExportingAll ? (
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span className="hidden sm:inline">Generating...</span>
                  </span>
                ) : (
                  <>
                    <BookOpen size={16} />
                    <span className="hidden sm:inline">Full Report</span>
                    <span className="sm:hidden">Full</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-2 md:p-4">
          <div className="no-scrollbar flex max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('PESTEL')}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-6',
                activeTab === 'PESTEL'
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-800',
              )}
            >
              <FileText size={18} /> PESTEL Analysis
            </button>
            <button
              onClick={() => setActiveTab('McKinsey')}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-6',
                activeTab === 'McKinsey'
                  ? 'bg-brand-peach text-gray-900 shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-800',
              )}
            >
              <Settings2 size={18} /> McKinsey 7-S
            </button>
            <button
              onClick={() => setActiveTab('VRIO')}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-6',
                activeTab === 'VRIO'
                  ? 'bg-[#1f2937] text-white shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-800',
              )}
            >
              <FileText size={18} /> VRIO Framework
            </button>
            <button
              onClick={() => setActiveTab('TOWS')}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-6',
                activeTab === 'TOWS'
                  ? 'bg-yellow-200 text-gray-900 shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-800',
              )}
            >
              <Network size={18} /> Confrontation Matrix
            </button>
            <button
              onClick={() => setActiveTab('PORTER')}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all md:px-6',
                activeTab === 'PORTER'
                  ? 'bg-[#4f39f6] text-white shadow-md'
                  : 'bg-transparent text-gray-500 hover:text-gray-800',
              )}
            >
              <Files size={18} /> Porter's 5 Forces
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto bg-white p-4 md:p-8 lg:p-12">
          <div className="mx-auto max-w-6xl">
            <div
              ref={containerRef}
              className="worksheet-container relative overflow-hidden bg-white"
            >
              <CorporateHeader
                meta={meta}
                setMeta={setMeta}
                selectedGroup={selectedGroup}
                participants={meta.participants}
                isAdmin={isAdmin}
                onRemoveParticipant={(name: string) =>
                  setMeta({
                    ...meta,
                    participants: (meta.participants || []).filter((p: string) => p !== name),
                  })
                }
              />
              {activeTab === 'TOWS' && <ConfrontationMatrixGuide />}
              <div className="mb-12">
                <div className="flex items-end justify-between border-b-2 border-gray-50 pb-6">
                  <h2
                    className={cn(
                      'inline-block text-4xl font-black tracking-tighter text-gray-900 uppercase',
                      activeTab === 'VRIO'
                        ? 'border-b-[12px] border-black pb-2'
                        : activeTab === 'TOWS'
                          ? 'border-b-[12px] border-[#FFD666] pb-2'
                          : activeTab === 'PORTER'
                            ? 'border-b-[12px] border-indigo-600 pb-2'
                            : '',
                    )}
                  >
                    {activeTab === 'PESTEL'
                      ? 'PESTEL Analysis'
                      : activeTab === 'McKinsey'
                        ? 'McKinsey 7-S Framework'
                        : activeTab === 'VRIO'
                          ? 'VRIO Framework'
                          : activeTab === 'TOWS'
                            ? 'Confrontation Matrix'
                            : "Porter's Five Forces"}
                  </h2>
                  <div className="rounded-full bg-gray-50 px-3 py-1 font-sans text-[10px] font-bold tracking-widest text-gray-400">
                    FRAMEWORK_ID:{' '}
                    {activeTab === 'PESTEL'
                      ? 'ENV_MACRO_01'
                      : activeTab === 'McKinsey'
                        ? 'ORG_ALIG_02'
                        : activeTab === 'VRIO'
                          ? 'COMP_ADV_03'
                          : activeTab === 'TOWS'
                            ? 'STRAT_MAT_04'
                            : 'IND_COMP_05'}
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {activeTab === 'PESTEL' ? (
                    <PESTELWorksheet data={pestelData} setData={setPestelData} />
                  ) : activeTab === 'McKinsey' ? (
                    <McKinseyWorksheet data={mckinseyData} setData={setMckinseyData} />
                  ) : activeTab === 'VRIO' ? (
                    <div className="space-y-12">
                      <VRIOFramework />
                      <VRIOAnalysisTable
                        data={vrioAnalysisData}
                        setData={setVrioAnalysisData}
                        notes={vrioNotes}
                        setNotes={setVrioNotes}
                      />
                    </div>
                  ) : activeTab === 'TOWS' ? (
                    <div className="space-y-12">
                      <TOWSWorksheet data={towsData} setData={setTowsData} />
                    </div>
                  ) : (
                    <PortersFiveForces
                      data={portersData}
                      setData={setPortersData}
                      activeForce={activeForce}
                      setActiveForce={setActiveForce}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div id="full-report-print-container" className="hidden" aria-hidden="true">
        <div className="print-section w-[297mm] bg-white p-12">
          <CorporateHeader
            meta={meta}
            setMeta={setMeta}
            selectedGroup={selectedGroup}
            participants={meta.participants}
          />
          <h2 className="mb-8 border-b-8 border-gray-100 pb-2 text-4xl font-bold tracking-tight text-gray-900 uppercase">
            PESTEL Analysis
          </h2>
          <PESTELWorksheet data={pestelData} setData={() => {}} />
        </div>
        <div className="print-section w-[297mm] bg-white p-12">
          <CorporateHeader
            meta={meta}
            setMeta={setMeta}
            selectedGroup={selectedGroup}
            participants={meta.participants}
          />
          <h2 className="mb-8 border-b-8 border-gray-100 pb-2 text-4xl font-bold tracking-tight text-gray-900 uppercase">
            McKinsey 7-S Framework
          </h2>
          <McKinseyWorksheet data={mckinseyData} setData={() => {}} />
        </div>
        <div className="print-section w-[297mm] bg-white p-12">
          <CorporateHeader
            meta={meta}
            setMeta={setMeta}
            selectedGroup={selectedGroup}
            participants={meta.participants}
          />
          <h2 className="mb-8 border-b-8 border-gray-100 pb-2 text-4xl font-bold tracking-tight text-gray-900 uppercase">
            VRIO Framework
          </h2>
          <VRIOFramework />
          <div className="mt-8">
            <VRIOAnalysisTable
              data={vrioAnalysisData}
              setData={() => {}}
              notes={vrioNotes}
              setNotes={() => {}}
            />
          </div>
        </div>
        {(['suppliers', 'buyers', 'newEntrants', 'substitutes', 'rivalry'] as const).map(
          (force) => (
            <div key={force} className="print-section w-[297mm] bg-white p-12">
              <CorporateHeader
                meta={meta}
                setMeta={setMeta}
                selectedGroup={selectedGroup}
                participants={meta.participants}
              />
              <h2 className="mb-8 border-b-8 border-indigo-600 pb-2 text-4xl font-bold tracking-tight text-gray-900 uppercase">
                Porter's 5 Forces: {force.toUpperCase()}
              </h2>
              <PortersFiveForces
                data={portersData}
                setData={() => {}}
                activeForce={force}
                setActiveForce={() => {}}
              />
            </div>
          ),
        )}
        <div className="print-section w-[297mm] bg-white p-12">
          <CorporateHeader
            meta={meta}
            setMeta={setMeta}
            selectedGroup={selectedGroup}
            participants={meta.participants}
          />
          <ConfrontationMatrixGuide />
          <div className="mt-8">
            <h2 className="mb-8 border-b-[12px] border-[#FFD666] pb-2 text-4xl font-bold tracking-tight text-gray-900 uppercase">
              Confrontation Matrix
            </h2>
            <TOWSWorksheet data={towsData} setData={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
