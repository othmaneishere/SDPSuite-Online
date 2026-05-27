import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import React from 'react';
import { FileText, Settings2, Network, Files, ChevronDown, LogOut, Trash2, BookOpen, Users, Lock, WifiOff, CloudCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { PasscodeModal, AdminDashboard } from './components/Admin';
import { AuthPage } from './components/Auth/AuthPage';
import { jsPDF } from 'jspdf';
import { toPng, toJpeg } from 'html-to-image';
import { cn } from './lib/utils';
import { MetaData, PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from './types';
import { Session } from '@supabase/supabase-js';

import { 
  PESTELWorksheet, 
  McKinseyWorksheet, 
  VRIOFramework, 
  VRIOAnalysisTable, 
  TOWSWorksheet, 
  PortersFiveForces,
  ConfrontationMatrixGuide
} from './components/Worksheets';

// Error Boundary Component for stability
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong.</h1>
          <p className="text-gray-600 mb-8">We've encountered an unexpected error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg hover:bg-brand-blue/90 transition-all cursor-pointer"
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
  onRemoveParticipant
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
    <div className={cn("flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-100 pb-8 mb-8 gap-4", hideMeta && "border-none mb-4")}>
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
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm max-w-xl">
          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Module</span>
            <span className="font-semibold text-black">Strategic Development Project (SDP)</span>
          </div>
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Cohort</span>
            <span className="font-semibold text-black">MA27</span>
          </div>
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Group</span>
            <span className="font-semibold text-black">{selectedGroup || 'Group 1'}</span>
          </div>
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Date</span>
            <span className="font-semibold text-black">05 - 06 June 2026</span>
          </div>
          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Company Name</span>
            <input
              className="font-semibold text-gray-700 outline-hidden bg-transparent border-b border-dashed border-gray-300 w-full"
              placeholder="Enter company name..."
              type="text"
              value={meta.companyName}
              onChange={(e) => setMeta({...meta, companyName: e.target.value})}
            />
          </div>
          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Participants</span>
            <div className="font-semibold text-gray-700 mt-1">
              {(participants || []).length > 0 ? (
                <div className="flex flex-col gap-1">
                  {(participants || []).map(p => (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm truncate">{p}</span>
                      {isAdmin && onRemoveParticipant && (
                        <button onClick={() => onRemoveParticipant(p)} className="text-red-500 text-xs ml-2">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No participants yet</div>
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
  Cloud,
  User,
  ShieldCheck,
  ArrowRight
} from './components/Auth/AuthUI';

const AccessPage = ({ 
  onSelectGroup, 
  onAdminClick, 
  isGuest, 
  onSignIn 
}: { 
  onSelectGroup: (group: string, name: string) => void; 
  onAdminClick: () => void, 
  isGuest?: boolean, 
  onSignIn?: () => void 
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [fullName, setFullName] = useState(() => localStorage.getItem('sdp_user_name') || '');

  const handleContinue = () => {
    if (selectedValue && fullName.trim()) {
      try { localStorage.setItem('sdp_user_name', fullName.trim()); } catch (e) { /* ignore */ }
      onSelectGroup(selectedValue, fullName.trim());
    }
  };

  return (
    <AuthLayout
      title="Workspace Access"
      subtitle={isGuest ? "You are exploring in Local Mode." : "Initialize your team assignment."}
      footer={
        <div className="flex items-center gap-10">
          <button
            onClick={isGuest ? onSignIn : () => supabase.auth.signOut()}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isGuest ? <><Cloud size={14} /> Cloud Portal</> : <><LogOut size={14} /> Sign Out</>}
          </button>
          <button
            onClick={onAdminClick}
            className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors flex items-center gap-2 cursor-pointer"
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
  const [session, setSession] = useState<Session | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(() => {
    return localStorage.getItem('sdp_selected_group');
  });
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('sdp_admin_auth') === 'true';
  });
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setSelectedGroup(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem('sdp_selected_group', selectedGroup);
    } else {
      localStorage.removeItem('sdp_selected_group');
    }
  }, [selectedGroup]);

  // Unified navigation logic
  useEffect(() => {
    if (initializing) return;

    const isGuest = localStorage.getItem('sdp_guest_mode') === 'true';
    const hasAuth = !!session || isGuest;
    const path = location.pathname;

    if (!hasAuth && path !== '/auth') {
      navigate('/auth', { replace: true });
    } else if (hasAuth && !selectedGroup && path !== '/access' && !isAdminMode) {
      navigate('/access', { replace: true });
    } else if (selectedGroup && path !== '/workspace' && !isAdminMode) {
      navigate('/workspace', { replace: true });
    }
  }, [session, selectedGroup, initializing, isAdminMode, location.pathname]);

  const handleSelectGroup = (group: string, name?: string) => {
    if (name) {
      try { localStorage.setItem('sdp_user_name', name); } catch (e) { /* ignore */ }
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

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/auth" element={
            <AuthPage onGuestMode={() => {
              localStorage.setItem('sdp_guest_mode', 'true');
              navigate('/access');
            }} />
          } />
          
          <Route path="/access" element={
            <AccessPage 
              onSelectGroup={handleSelectGroup}
              onAdminClick={() => setShowPasscodeModal(true)}
              isGuest={!session}
              onSignIn={() => {
                localStorage.removeItem('sdp_guest_mode');
                navigate('/auth');
              }}
            />
          } />

          <Route path="/workspace" element={
            selectedGroup ? (
              <AppContent 
                key={selectedGroup} 
                selectedGroup={selectedGroup} 
                isAdmin={isAdminMode}
                isGuest={!session}
                onExit={() => {
                  setSelectedGroup(null);
                  navigate('/access');
                }} 
              />
            ) : <Navigate to="/access" replace />
          } />

          <Route path="/admin" element={
            isAdminMode ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : <Navigate to="/access" replace />
          } />

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

function AppContent({ selectedGroup, onExit, isAdmin, isGuest }: { selectedGroup: string; onExit: () => void; isAdmin: boolean; isGuest?: boolean }) {
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>(() => {
    const saved = localStorage.getItem(`sdp_tab_${selectedGroup}`);
    return (saved as any) || 'PESTEL';
  });
  const [activeForce, setActiveForce] = useState<keyof PortersFiveForcesData>('suppliers');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopParticipants, setShowTopParticipants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Core Worksheet State
  const [pestelData, setPestelData] = useState<PESTELData[]>(['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(cat => ({
    id: cat,
    category: cat as any,
    description: '',
    impact: '',
    probability: '',
    potential: ''
  })));
  const [mckinseyData, setMckinseyData] = useState<McKinsey7SData>({});
  const [vrioAnalysisData, setVrioAnalysisData] = useState<VRIOAnalysisData[]>(Array.from({ length: 8 }, (_, i) => ({
    id: `res-${i}`,
    resource: '',
    type: '',
    detail: '',
    v: '',
    r: '',
    i: '',
    o: ''
  })));
  const [vrioNotes, setVrioNotes] = useState('');
  const [towsData, setTowsData] = useState<TOWSMatrixData>({
    opportunities: Array(3).fill(''),
    threats: Array(3).fill(''),
    strengths: Array(3).fill(''),
    weaknesses: Array(3).fill(''),
    scores: {},
    notes: {}
  });
  const [portersData, setPortersData] = useState<PortersFiveForcesData>({
    newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
    buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 8 }, () => ({ col1: '', col2: '', col3: '', col4: '' })) },
  });
  const [meta, setMeta] = useState<MetaData>({
    module: '',
    cohort: '',
    date: '',
    companyName: '',
    participants: [],
    group: selectedGroup || ''
  });

  // Collaboration Refs
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const dbUpdateTimeout = useRef<NodeJS.Timeout | null>(null);
  const clientIdRef = useRef<string | null>(null);
  if (!clientIdRef.current) {
    let id = localStorage.getItem('sdp_client_id');
    if (!id) {
      id = 'user-' + Math.random().toString(36).slice(2, 9);
      try { localStorage.setItem('sdp_client_id', id); } catch (e) { /* ignore */ }
    }
    clientIdRef.current = id;
  }

  const displayNameRef = useRef<string | null>(null);
  if (!displayNameRef.current) {
    const name = localStorage.getItem('sdp_user_name');
    displayNameRef.current = (name as string) || clientIdRef.current || 'guest';
  }

  const roomChannelRef = useRef<any>(null);
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
          if (local.pestel) setPestelData(local.pestel);
          if (local.mckinsey) setMckinseyData(local.mckinsey);
          if (local.vrio) setVrioAnalysisData(local.vrio);
          if (local.vrioNotes) setVrioNotes(local.vrioNotes || '');
          if (local.tows) setTowsData(local.tows);
          if (local.porters) setPortersData(local.porters);
          if (local.meta) setMeta(local.meta);
        } catch (e) { console.error('Failed to parse local backup', e); }
      }

      // Step B: Cloud Sync (Reliable)
      try {
        const { data, error } = await supabase
          .from('group_data')
          .select('data')
          .eq('group_id', selectedGroup)
          .maybeSingle();

        if (error) {
          console.error('Supabase fetch error:', error);
          throw error;
        }

        if (data?.data) {
          const remote = data.data;
          if (remote.pestel) setPestelData(remote.pestel);
          if (remote.mckinsey) setMckinseyData(remote.mckinsey);
          if (remote.vrio) setVrioAnalysisData(remote.vrio);
          if (remote.vrioNotes) setVrioNotes(remote.vrioNotes || '');
          if (remote.tows) setTowsData(remote.tows);
          if (remote.porters) setPortersData(remote.porters);
          if (remote.meta) setMeta(remote.meta);
          setSyncStatus('synced');
        } else {
          setSyncStatus('synced');
        }
      } catch (err: any) {
        const errorMsg = err?.message || err?.details || JSON.stringify(err);
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
      try { roomChannelRef.current.unsubscribe(); } catch (e) { /* ignore */ }
      roomChannelRef.current = null;
    }

    const channel = supabase.channel(`room:${selectedGroup}`, {
      config: { presence: { key: clientIdRef.current ?? undefined } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          const presences = Object.values(state).flat() as any[];
          const names = presences.map(p => p?.name || p?.client).filter(Boolean);
          setMeta(prev => ({ ...(prev || {}), participants: Array.from(new Set(names)) } as MetaData));
        } catch (err) {
          console.error('Presence parse error', err);
        }
      })
      .on('broadcast', { event: 'update_data' }, ({ payload }: any) => {
        try {
          if (!payload || payload.senderId === clientIdRef.current) return;
          const payloadStr = JSON.stringify(payload.data || {});
          if (payloadStr === lastReceivedRef.current) return;
          lastReceivedRef.current = payloadStr;
          
          const remote = payload.data || {};
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
            await channel.track({ name: displayNameRef.current, online_at: new Date().toISOString() });
          } catch (e) {
            console.warn('Failed to track presence', e);
          }
        }
      });

    roomChannelRef.current = channel;

    return () => {
      try { channel.unsubscribe(); } catch (e) { /* ignore */ }
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
      meta: meta
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
          payload: { senderId: clientIdRef.current, data: dataToSave }
        });
        updateTimeout.current = null;
      }, 300);
    }

    // C. Database Sync (Persistent Cloud)
    if (dbUpdateTimeout.current) clearTimeout(dbUpdateTimeout.current);
    setSyncStatus('syncing');
    dbUpdateTimeout.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('group_data')
          .upsert({ 
            group_id: selectedGroup, 
            data: dataToSave,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        setSyncStatus('synced');
      } catch (err) {
        console.warn('Cloud save failed - progress saved locally', err);
        setSyncStatus('offline');
      }
      dbUpdateTimeout.current = null;
    }, 3000);

  }, [pestelData, mckinseyData, vrioAnalysisData, vrioNotes, towsData, portersData, meta, selectedGroup, isLoading]);

  const exportPDF = async () => {
    setIsExporting(true);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    try {
      const printRef = document.getElementById('full-report-print-container');
      if (!printRef) throw new Error('Print container not found');
      const originalPrintDisplay = printRef.style.display;
      printRef.style.display = 'block';

      if (activeTab === 'PORTER') {
        const forces = ['suppliers', 'buyers', 'newEntrants', 'substitutes', 'rivalry'] as const;
        let isFirstPage = true;
        for (const force of forces) {
          const section = Array.from(printRef.querySelectorAll('.print-section')).find(s => 
            s.querySelector('h2')?.textContent?.toUpperCase().includes(`PORTER'S 5 FORCES: ${force.toUpperCase()}`)
          ) as HTMLElement;
          if (section) {
            section.style.display = 'block';
            const imgData = await toJpeg(section, { 
              quality: 0.95, 
              pixelRatio: 2, 
              backgroundColor: '#ffffff',
              cacheBust: true
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
        const section = Array.from(printRef.querySelectorAll('.print-section')).find(s => {
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
            cacheBust: true
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
        }      }
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
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    try {
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
          cacheBust: true
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
        setPestelData(['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(cat => ({
          id: cat,
          category: cat as any,
          description: '',
          impact: '',
          probability: '',
          potential: ''
        })));
      } else if (activeTab === 'McKinsey') {
        setMckinseyData({});
      } else if (activeTab === 'VRIO') {
        setVrioAnalysisData(Array.from({ length: 8 }, (_, i) => ({
          id: `res-${i}`,
          resource: '',
          type: '',
          detail: '',
          v: '',
          r: '',
          i: '',
          o: ''
        })));
        setVrioNotes('');
      } else if (activeTab === 'TOWS') {
        setTowsData({
          opportunities: Array(3).fill(''),
          threats: Array(3).fill(''),
          strengths: Array(3).fill(''),
          weaknesses: Array(3).fill(''),
          scores: {},
          notes: {}
        });
      } else if (activeTab === 'PORTER') {
        setPortersData({
          newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
          buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
          suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
          substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
          rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 8 }, () => ({ col1: '', col2: '', col3: '', col4: '' })) },
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-gray-900 uppercase tracking-widest text-xs">Loading Strategy Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans selection:bg-brand-blue/10">
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <img src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" alt="SDP Suite Logo" className="h-16 w-auto object-contain" crossOrigin="anonymous" />
            <div className="h-8 w-px bg-gray-100 mx-2" />
            <div className="flex items-center gap-2">
              {syncStatus === 'synced' ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-tighter border border-green-100">
                  <CloudCheck size={12} /> Cloud Saved
                </div>
              ) : syncStatus === 'syncing' ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter border border-blue-100">
                  <div className="w-2 h-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> Saving...
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-tighter border border-amber-100 animate-pulse">
                  <WifiOff size={12} /> Local Mode
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowTopParticipants(s => !s)} className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">{(meta.participants || []).length}</span>
              </button>
              {showTopParticipants && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                  <div className="text-xs text-gray-500 mb-2">Online users</div>
                  <ul className="text-sm max-h-40 overflow-auto space-y-1">
                    {(meta.participants || []).length > 0 ? (meta.participants || []).map(p => (<li key={p} className="truncate">{p}</li>)) : (<li className="text-gray-400">No one else online</li>)}
                  </ul>
                </div>
              )}
            </div>
            <button onClick={() => { if (confirm('Are you sure you want to exit this session?')) onExit(); }} className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-blue-600 transition-all cursor-pointer font-extrabold text-[10px] uppercase tracking-[0.2em]">
              <LogOut size={18} />
              <span className="hidden xl:inline">Exit</span>
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button onClick={clearData} className="p-2 text-gray-400 hover:text-red-500 transition-all cursor-pointer" title="Clear current worksheet">
              <Trash2 size={20} />
            </button>
            <button onClick={exportPDF} disabled={isExporting} className="px-4 py-2 bg-gray-900 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-black transition-all shadow-md shadow-black/10 disabled:opacity-50 cursor-pointer">
              {isExporting && !isExportingAll ? (<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />) : (<FileText size={18} />)}
              Page PDF
            </button>
            <button onClick={exportAllPDF} disabled={isExportingAll} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 disabled:opacity-50 cursor-pointer">
              {isExportingAll ? (<span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</span>) : (<><BookOpen size={18} />Full Report</>)}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center p-2 md:p-4">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
            <button onClick={() => setActiveTab('PESTEL')} className={cn("px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer", activeTab === 'PESTEL' ? "bg-brand-blue text-white shadow-md" : "bg-transparent text-gray-500 hover:text-gray-800")}><FileText size={18} /> PESTEL Analysis</button>
            <button onClick={() => setActiveTab('McKinsey')} className={cn("px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer", activeTab === 'McKinsey' ? "bg-brand-peach text-gray-900 shadow-md" : "bg-transparent text-gray-500 hover:text-gray-800")}><Settings2 size={18} /> McKinsey 7-S</button>
            <button onClick={() => setActiveTab('VRIO')} className={cn("px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer", activeTab === 'VRIO' ? "bg-[#1f2937] text-white shadow-md" : "bg-transparent text-gray-500 hover:text-gray-800")}><FileText size={18} /> VRIO Framework</button>
            <button onClick={() => setActiveTab('TOWS')} className={cn("px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer", activeTab === 'TOWS' ? "bg-yellow-200 text-gray-900 shadow-md" : "bg-transparent text-gray-500 hover:text-gray-800")}><Network size={18} /> Confrontation Matrix</button>
            <button onClick={() => setActiveTab('PORTER')} className={cn("px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer", activeTab === 'PORTER' ? "bg-[#4f39f6] text-white shadow-md" : "bg-transparent text-gray-500 hover:text-gray-800")}><Files size={18} /> Porter's 5 Forces</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white relative">
          <div className="max-w-6xl mx-auto">
            <div ref={containerRef} className="worksheet-container relative overflow-hidden bg-white">
              <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={meta.group} participants={meta.participants} isAdmin={isAdmin} onRemoveParticipant={(name: string) => setMeta({...meta, participants: (meta.participants || []).filter((p: string) => p !== name)})} />
              {activeTab === 'TOWS' && <ConfrontationMatrixGuide />}
              <div className="mb-12">
                <div className="flex items-end justify-between border-b-2 border-gray-50 pb-6">
                  <h2 className={cn("text-4xl font-black uppercase tracking-tighter text-gray-900 inline-block", activeTab === 'VRIO' ? "border-b-[12px] border-black pb-2" : activeTab === 'TOWS' ? "border-b-[12px] border-[#FFD666] pb-2" : activeTab === 'PORTER' ? "border-b-[12px] border-indigo-600 pb-2" : "")}>
                    {activeTab === 'PESTEL' ? 'PESTEL Analysis' : activeTab === 'McKinsey' ? 'McKinsey 7-S Framework' : activeTab === 'VRIO' ? 'VRIO Framework' : activeTab === 'TOWS' ? 'Confrontation Matrix' : "Porter's Five Forces"}
                  </h2>
                  <div className="text-[10px] font-mono text-gray-400 font-bold tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                    FRAMEWORK_ID: {activeTab === 'PESTEL' ? 'ENV_MACRO_01' : activeTab === 'McKinsey' ? 'ORG_ALIG_02' : activeTab === 'VRIO' ? 'COMP_ADV_03' : activeTab === 'TOWS' ? 'STRAT_MAT_04' : 'IND_COMP_05'}
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                  {activeTab === 'PESTEL' ? (
                    <PESTELWorksheet data={pestelData} setData={setPestelData} />
                  ) : activeTab === 'McKinsey' ? (
                    <McKinseyWorksheet data={mckinseyData} setData={setMckinseyData} />
                  ) : activeTab === 'VRIO' ? (
                    <div className="space-y-12">
                      <VRIOFramework />
                      <VRIOAnalysisTable data={vrioAnalysisData} setData={setVrioAnalysisData} notes={vrioNotes} setNotes={setVrioNotes} />
                    </div>
                  ) : activeTab === 'TOWS' ? (
                    <div className="space-y-12">
                      <TOWSWorksheet data={towsData} setData={setTowsData} meta={meta} setMeta={setMeta} />
                    </div>
                  ) : (
                    <PortersFiveForces data={portersData} setData={setPortersData} activeForce={activeForce} setActiveForce={setActiveForce} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div id="full-report-print-container" className="hidden" aria-hidden="true">
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={meta.group} participants={meta.participants} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">PESTEL Analysis</h2>
          <PESTELWorksheet data={pestelData} setData={() => {}} />
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={meta.group} participants={meta.participants} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">McKinsey 7-S Framework</h2>
          <McKinseyWorksheet data={mckinseyData} setData={() => {}} />
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={meta.group} participants={meta.participants} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">VRIO Framework</h2>
          <VRIOFramework />
          <div className="mt-8">
            <VRIOAnalysisTable data={vrioAnalysisData} setData={() => {}} notes={vrioNotes} setNotes={() => {}} />
          </div>
        </div>
        {(['suppliers', 'buyers', 'newEntrants', 'substitutes', 'rivalry'] as const).map(force => (
          <div key={force} className="print-section bg-white p-12 w-[297mm]">
            <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={meta.group} participants={meta.participants} />
            <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-indigo-600 pb-2 mb-8">Porter's 5 Forces: {force.toUpperCase()}</h2>
            <PortersFiveForces data={portersData} setData={() => {}} activeForce={force} setActiveForce={() => {}} />
          </div>
        ))}
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={meta.group} participants={meta.participants} />
          <ConfrontationMatrixGuide />
          <div className="mt-8">
            <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-[12px] border-[#FFD666] pb-2 mb-8">Confrontation Matrix</h2>
            <TOWSWorksheet data={towsData} setData={() => {}} meta={meta} setMeta={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}