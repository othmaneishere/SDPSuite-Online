import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { MetaData, PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from '../types';
import { FileText, Settings2, Network, Files, ChevronDown, Trash2, BookOpen, Database, Users, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import React from 'react';

// Re-using sub-components... (will be extracted in a real refactor, keeping here for now)

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { MetaData, PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from '../types';
import { FileText, Settings2, Network, Files, Trash2, BookOpen, Database, Users, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';

export default function WorksheetViewer({ 
  selectedGroup, 
  fullName, 
  onExit,
  readOnly = false 
}: { 
  selectedGroup: string; 
  fullName: string; 
  onExit: () => void;
  readOnly?: boolean;
}) {
  const [participants, setParticipants] = useState<string[]>([]);
  const [onlineTotal, setOnlineTotal] = useState<number>(0);
  const [pestelData, setPestelData] = useState<PESTELData[]>([]);
  const [mckinseyData, setMckinseyData] = useState<McKinsey7SData>({});
  const [vrioAnalysisData, setVrioAnalysisData] = useState<VRIOAnalysisData[]>([]);
  const [vrioNotes, setVrioNotes] = useState('');
  const [towsData, setTowsData] = useState<TOWSMatrixData>({ opportunities: Array(3).fill(''), threats: Array(3).fill(''), strengths: Array(3).fill(''), weaknesses: Array(3).fill(''), scores: {}, notes: {} });
  const [portersData, setPortersData] = useState<PortersFiveForcesData>({
    newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
    buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 8 }, () => ({ col1: '', col2: '', col3: '', col4: '' })) },
  });
  const [meta, setMeta] = useState<MetaData>({ module: '', cohort: '', date: '', companyName: '', participants: [] });
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>('PESTEL');
  const [activeForce, setActiveForce] = useState<keyof PortersFiveForcesData>('suppliers');

  // Real-time Sync and Data Management
  useEffect(() => {
    if (!selectedGroup) return;

    // Fetch initial data
    const fetchData = async () => {
      const { data } = await supabase.from('worksheets').select('data').eq('id', selectedGroup);
      if (data && data.length > 0) {
        const parsed = data[0].data;
        if (parsed.pestel) setPestelData(parsed.pestel);
        if (parsed.mckinsey) setMckinseyData(parsed.mckinsey);
        if (parsed.vrio) setVrioAnalysisData(parsed.vrio);
        if (parsed.tows) setTowsData(parsed.tows);
        if (parsed.porters) setPortersData(parsed.porters);
        if (parsed.meta) setMeta(parsed.meta);
        if (parsed.vrioNotes) setVrioNotes(parsed.vrioNotes);
      }
    };
    fetchData();

    // Subscribe to real-time changes
    const channel = supabase.channel('db-changes').on('postgres_changes', { 
        event: '*', schema: 'public', table: 'worksheets', filter: `id=eq.${selectedGroup}` 
      }, (payload) => {
        if (payload.new && payload.new.data) {
          const newData = payload.new.data;
          if (newData.pestel) setPestelData(newData.pestel);
          if (newData.mckinsey) setMckinseyData(newData.mckinsey);
          if (newData.vrio) setVrioAnalysisData(newData.vrio);
          if (newData.tows) setTowsData(newData.tows);
          if (newData.porters) setPortersData(newData.porters);
          if (newData.meta) setMeta(newData.meta);
          if (newData.vrioNotes) setVrioNotes(newData.vrioNotes);
        }
      }).subscribe();
    return () => { channel.unsubscribe(); };
  }, [selectedGroup]);

  // Read-only check for updates
  const updateState = (setter: (val: any) => void, data: any) => {
    if (readOnly) return;
    setter(data);
    // Add broadcast logic here if needed
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">{readOnly ? 'Read-Only Mode' : 'Live Mode'}</h2>
        {/* Render Worksheet content here... using readOnly prop to disable inputs */}
        <p className="text-gray-500">Worksheet content for {selectedGroup} displayed here.</p>
    </div>
  );
}
