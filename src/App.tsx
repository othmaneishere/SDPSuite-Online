import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import React from 'react';
import {
  FileText,
  Settings2,
  Network,
  Files,
  LogOut,
  Trash2,
  BookOpen,
  Users,
  WifiOff,
  CloudCheck,
} from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
            src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
            alt="Business School Logo"
            className="h-16 object-contain"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {!hideMeta && (
        <div className="grid max-w-xl grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <div className="col-span-2 flex flex-col border-b border-gray-200">
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
        <div className="flex items-center gap-10">
          <button
            onClick={onAdminClick}
            className="flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-slate-900"
          >
            <ShieldCheck size={14} /> Admin Access
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
      return (validTabs.includes(saved || '') ? saved : 'PESTEL') as 'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER';
    },
  );
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
  const lastPestelRef = useRef<PESTELData[]>([]);
  const lastMcKinseyRef = useRef<McKinsey7SData>({});
  const lastVrioRef = useRef<VRIORow[]>([]);
  const lastVrioNotesRef = useRef<string>('');
  const lastTowsRef = useRef<TOWSRow[]>([]);
  const lastPorterRef = useRef<PorterRow[]>([]);
  const lastMetaRef = useRef<MetaData | null>(null);

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
  const lastReceivedRef = useRef<string>('');

  // 1. Initial Load: Hybrid Strategy
  useEffect(() => {
    if (!selectedGroup) return;

    const loadData = async () => {
      // Step A: Immediate Local Load (Instant)
      const saved = localStorage.getItem(`sdp_group_${selectedGroup}`);
      if (saved) {
        try {
          const local = JSON.parse(saved);
          if (local.pestel) { setPestelData(local.pestel); lastPestelRef.current = local.pestel; }
          if (local.mckinsey) { setMckinseyData(local.mckinsey); lastMcKinseyRef.current = local.mckinsey; }
          if (local.vrio) { setVrioAnalysisData(local.vrio); lastVrioRef.current = local.vrio; }
          if (local.vrioNotes) { setVrioNotes(local.vrioNotes || ''); lastVrioNotesRef.current = local.vrioNotes || ''; }
          if (local.tows) { setTowsData(local.tows); lastTowsRef.current = local.tows; }
          if (local.porters) { setPortersData(local.porters); lastPorterRef.current = local.porters; }
          if (local.meta) { setMeta(local.meta); lastMetaRef.current = local.meta; }
        } catch (e) {
          console.error('Failed to parse local backup', e);
        }
      }

      // Step B: Cloud Sync (Reliable)
      try {
        const [
          { data: pestel, error: pestelErr },
          { data: vrio, error: vrioErr },
          { data: tows, error: towsErr },
          { data: porter, error: porterErr },
          { data: mckinsey, error: mckinseyErr },
          { data: meta, error: metaErr },
        ] = await Promise.all([
          supabase.from('pestel_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('vrio_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('tows_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('porter_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('mckinsey_rows').select('content').eq('group_id', selectedGroup),
          supabase.from('group_meta').select('content').eq('group_id', selectedGroup).maybeSingle(),
        ]);

        if (pestelErr || vrioErr || towsErr || porterErr || mckinseyErr || metaErr) {
          throw new Error('Supabase fetch error');
        }

        if (pestel && pestel.length > 0) { 
            const data = pestel.map((r: { content: PESTELRow }) => r.content);
            setPestelData(data); lastPestelRef.current = data;
        }
        if (vrio && vrio.length > 0) {
            const data = vrio.map((r: { content: VRIORow }) => r.content);
            setVrioAnalysisData(data); lastVrioRef.current = data;
        }
        if (tows && tows.length > 0) {
            const data = tows.map((r: { content: TOWSRow }) => r.content);
            setTowsData(data); lastTowsRef.current = data;
        }
        if (porter && porter.length > 0) {
            const data = porter.map((r: { content: PorterRow }) => r.content);
            setPortersData(data); lastPorterRef.current = data;
        }
        if (mckinsey && mckinsey.length > 0) {
            const data = mckinsey[0].content;
            setMckinseyData(data); lastMcKinseyRef.current = data;
        }
        if (meta?.content) {
            setMeta(meta.content); lastMetaRef.current = meta.content;
        }
        
        setSyncStatus('synced');
      } catch (err: unknown) {
        const e = err as { message?: string; details?: string };
        const errorMsg = e?.message || e?.details || JSON.stringify(e);
        console.warn(`Supabase fetch failed (${errorMsg}) - entering offline mode.`, err);
        setSyncStatus('offline');
      } finally {
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
      .on('broadcast', { event: 'update_data' }, ({ payload }: { payload: { senderId: string; data: GroupData } }) => {
        try {
          if (!payload || payload.senderId === clientIdRef.current) return;
          const payloadStr = JSON.stringify(payload.data || {});
          if (payloadStr === lastReceivedRef.current) return;
          lastReceivedRef.current = payloadStr;

          const remote: GroupData = payload.data;
          if (remote.pestel) setPestelData(remote.pestel);
          if (remote.mckinsey) setMckinseyData(remote.mckinsey);
          if (remote.vrio) setVrioAnalysisData(remote.vrio);
          if (remote.vrioNotes) setVrioNotes(remote.vrioNotes || '');
          if (remote.tows) setTowsData(remote.tows);
          if (remote.porters) setPortersData(remote.porters);
          if (remote.meta) setMeta(remote.meta);
        } catch (err) {
          console.error('Failed applying remote update', err);
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
  }, [selectedGroup, isLoading]);

  // 3. Auto-save and Broadcast
  useEffect(() => {
    if (isLoading) return;

    const dataToSave = {
      pestel: pestelData,
      mckinsey: mckinseyData,
      vrio: vrioAnalysisData,
      vrioNotes: vrioNotes,
      tows: towsData,
      porters: portersData,
      meta: meta,
    };

    // A. LocalStorage (Immediate safety)
    localStorage.setItem(`sdp_group_${selectedGroup}`, JSON.stringify(dataToSave));

    // B. Realtime Broadcast
    const ch = roomChannelRef.current;
    if (ch) {
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
      updateTimeout.current = setTimeout(() => {
        ch.send({
          type: 'broadcast',
          event: 'update_data',
          payload: { senderId: clientIdRef.current, data: dataToSave },
        });
        updateTimeout.current = null;
      }, 300);
    }

    // C. Database Sync (Persistent Cloud)
    if (dbUpdateTimeout.current) clearTimeout(dbUpdateTimeout.current);

    dbUpdateTimeout.current = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        const tasks = [];

        // Compare and prepare upserts
        if (JSON.stringify(pestelData) !== JSON.stringify(lastPestelRef.current)) {
            tasks.push(supabase.from('pestel_rows').upsert(pestelData.map(d => ({ group_id: selectedGroup, row_key: d.id, content: d }))));
            lastPestelRef.current = pestelData;
        }
        if (JSON.stringify(mckinseyData) !== JSON.stringify(lastMcKinseyRef.current)) {
            tasks.push(supabase.from('mckinsey_rows').upsert({ group_id: selectedGroup, row_key: 'main', content: mckinseyData }));
            lastMcKinseyRef.current = mckinseyData;
        }
        if (JSON.stringify(vrioAnalysisData) !== JSON.stringify(lastVrioRef.current) || vrioNotes !== lastVrioNotesRef.current) {
            tasks.push(supabase.from('vrio_rows').upsert(vrioAnalysisData.map(d => ({ group_id: selectedGroup, row_key: d.id, content: d }))));
            tasks.push(supabase.from('vrio_rows').upsert({ group_id: selectedGroup, row_key: 'notes', content: vrioNotes }));
            lastVrioRef.current = vrioAnalysisData;
            lastVrioNotesRef.current = vrioNotes;
        }
        if (JSON.stringify(towsData) !== JSON.stringify(lastTowsRef.current)) {
            tasks.push(supabase.from('tows_rows').upsert(towsData.map(d => ({ group_id: selectedGroup, row_key: d.section, content: d }))));
            lastTowsRef.current = towsData;
        }
        if (JSON.stringify(portersData) !== JSON.stringify(lastPorterRef.current)) {
            tasks.push(supabase.from('porter_rows').upsert(portersData.map(d => ({ group_id: selectedGroup, row_key: d.force, content: d }))));
            lastPorterRef.current = portersData;
        }
        if (JSON.stringify(meta) !== JSON.stringify(lastMetaRef.current)) {
            tasks.push(supabase.from('meta_data').upsert({ group_id: selectedGroup, content: meta }));
            lastMetaRef.current = meta;
        }

        if (tasks.length > 0) {
            await Promise.all(tasks);
        }

        setSyncStatus('synced');
        setLastSaved(new Date());
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
  ]);


  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const [{ jsPDF }, { toPng, toJpeg }] = await Promise.all([
        import('jspdf'),
        import('html-to-image'),
      ]);
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
      const [{ jsPDF }, { toJpeg }] = await Promise.all([
        import('jspdf'),
        import('html-to-image'),
      ]);
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
          { id: 'opportunities', section: 'opportunities', data: Array(3).fill(''), scores: {}, notes: {} },
          { id: 'threats', section: 'threats', data: Array(3).fill(''), scores: {}, notes: {} },
          { id: 'strengths', section: 'strengths', data: Array(3).fill(''), scores: {}, notes: {} },
          { id: 'weaknesses', section: 'weaknesses', data: Array(3).fill(''), scores: {}, notes: {} },
        ]);
      } else if (activeTab === 'PORTER') {
        setPortersData([
          { id: 'newEntrants', force: 'newEntrants', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
          { id: 'buyers', force: 'buyers', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
          { id: 'suppliers', force: 'suppliers', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
          { id: 'substitutes', force: 'substitutes', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
          { id: 'rivalry', force: 'rivalry', analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 8 }, () => ({ col1: '', col2: '', col3: '', col4: '' })) },
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
    <div className="selection:bg-brand-blue/10 min-h-screen bg-gray-50/50 p-4 font-sans md:p-8">
      <div className="mx-auto flex min-h-[90vh] max-w-[1400px] flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <img
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
              alt="SDP Suite Logo"
              className="h-16 w-auto object-contain"
              crossOrigin="anonymous"
            />
            <div className="mx-2 h-8 w-px bg-gray-100" />
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
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowTopParticipants((s) => !s)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm hover:shadow-md"
              >
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-700">
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
              className="flex cursor-pointer items-center gap-2 px-4 py-2 text-[10px] font-extrabold tracking-[0.2em] text-gray-500 uppercase transition-all hover:text-blue-600"
            >
              <LogOut size={18} />
              <span className="hidden xl:inline">Exit</span>
            </button>
            <div className="mx-1 h-4 w-px bg-gray-200" />
            <button
              onClick={clearData}
              className="cursor-pointer p-2 text-gray-400 transition-all hover:text-red-500"
              title="Clear current worksheet"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={exportPDF}
              disabled={isExporting}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-[10px] font-extrabold tracking-[0.2em] text-white uppercase shadow-md shadow-black/10 transition-all hover:bg-black disabled:opacity-50"
            >
              {isExporting && !isExportingAll ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <FileText size={18} />
              )}
              Page PDF
            </button>
            <button
              onClick={exportAllPDF}
              disabled={isExportingAll}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-[10px] font-extrabold tracking-[0.2em] text-white uppercase shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {isExportingAll ? (
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </span>
              ) : (
                <>
                  <BookOpen size={18} />
                  Full Report
                </>
              )}
            </button>
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

        <div className="relative flex-1 overflow-y-auto bg-white p-8 lg:p-12">
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
                  <div className="rounded-full bg-gray-50 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-gray-400">
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