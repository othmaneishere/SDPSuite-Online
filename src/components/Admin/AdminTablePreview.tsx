import { 
  PESTELWorksheet, 
  McKinseyWorksheet, 
  VRIOAnalysisTable, 
  VRIOFramework, 
  TOWSWorksheet, 
  PortersFiveForces,
  StrategicSummary
} from '../Worksheets';
import { PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from '../../types';
import { useState } from 'react';

export const AdminTablePreview = ({ 
  activeTab, 
  data 
}: { 
  activeTab: string; 
  data: any;
}) => {
  const [activeForce, setActiveForce] = useState<keyof PortersFiveForcesData>('suppliers');

  if (!data) return <div className="p-8 text-center text-gray-500 italic">No data available for this group</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
          {activeTab === 'PESTEL' ? 'PESTEL Analysis' : 
           activeTab === 'McKinsey' ? 'McKinsey 7-S Framework' : 
           activeTab === 'VRIO' ? 'VRIO Framework' :
           activeTab === 'TOWS' ? 'Confrontation Matrix' :
           activeTab === 'SUMMARY' ? 'Strategic Summary' :
           "Porter's Five Forces"}
        </h2>
      </div>
      
      <div className="p-8 overflow-auto">
        {activeTab === 'SUMMARY' && (
          <StrategicSummary 
            pestelData={data.pestel || []}
            mckinseyData={data.mckinsey || {}}
            vrioData={data.vrio || []}
            towsData={data.tows || { opportunities: [], threats: [], strengths: [], weaknesses: [], scores: {}, notes: {} }}
            portersData={data.porters || {
              newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
            }}
          />
        )}

        {activeTab === 'PESTEL' && (
          <PESTELWorksheet data={data.pestel || []} setData={() => {}} />
        )}
        
        {activeTab === 'McKinsey' && (
          <McKinseyWorksheet data={data.mckinsey || {}} setData={() => {}} />
        )}
        
        {activeTab === 'VRIO' && (
          <div className="space-y-12">
            <VRIOFramework />
            <VRIOAnalysisTable 
              data={data.vrio || []} 
              setData={() => {}} 
              notes={data.vrioNotes || ''} 
              setNotes={() => {}} 
            />
          </div>
        )}
        
        {activeTab === 'TOWS' && (
          <TOWSWorksheet 
            data={data.tows || { opportunities: [], threats: [], strengths: [], weaknesses: [], scores: {}, notes: {} }} 
            setData={() => {}} 
            meta={data.meta || {}} 
            setMeta={() => {}} 
          />
        )}
        
        {activeTab === 'PORTER' && (
          <PortersFiveForces 
            data={data.porters || {
              newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
              rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: [] },
            }} 
            setData={() => {}} 
            activeForce={activeForce} 
            setActiveForce={setActiveForce} 
          />
        )}
      </div>
    </div>
  );
};
