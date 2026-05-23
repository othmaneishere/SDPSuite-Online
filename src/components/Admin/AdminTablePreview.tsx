import { PESTELWorksheet, McKinseyWorksheet, VRIOAnalysisTable } from '../Worksheets';
import { PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from '../../types';

export const AdminTablePreview = ({ 
  activeTab, 
  pestelData, 
  mckinseyData, 
  vrioAnalysisData, 
  vrioNotes, 
  towsData, 
  portersData,
  meta,
  setMeta
}: { 
  activeTab: string;
  pestelData: PESTELData[];
  mckinseyData: McKinsey7SData;
  vrioAnalysisData: VRIOAnalysisData[];
  vrioNotes: string;
  towsData: TOWSMatrixData;
  portersData: PortersFiveForcesData;
  meta?: any;
  setMeta?: (m: any) => void;
}) => {
  return (
    <div className="space-y-8">
      {activeTab === 'pestel' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">PESTEL Analysis</h3>
          <PESTELWorksheet data={pestelData} setData={() => {}} />
        </div>
      )}

      {activeTab === 'mckinsey' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">McKinsey 7S</h3>
          <McKinseyWorksheet data={mckinseyData} setData={() => {}} />
        </div>
      )}

      {activeTab === 'vrio' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">VRIO Analysis</h3>
          <VRIOAnalysisTable data={vrioAnalysisData} setData={() => {}} notes={vrioNotes} setNotes={() => {}} />
        </div>
      )}

      {activeTab === 'tows' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">TOWS Matrix</h3>
          <div className="text-sm text-gray-600">
            <p><strong>Opportunities:</strong> {towsData.opportunities?.filter(o => o).length || 0}</p>
            <p><strong>Threats:</strong> {towsData.threats?.filter(t => t).length || 0}</p>
            <p><strong>Strengths:</strong> {towsData.strengths?.filter(s => s).length || 0}</p>
            <p><strong>Weaknesses:</strong> {towsData.weaknesses?.filter(w => w).length || 0}</p>
          </div>
        </div>
      )}

      {activeTab === 'porters' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Porter's Five Forces</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(portersData).map(([force, data]: any) => (
              <div key={force} className="p-3 border border-gray-200 rounded">
                <p className="font-semibold capitalize">{force}</p>
                <p className="text-gray-600 text-xs">Impact: {data.impact || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
