import React from 'react';
import { ChevronDown, Database, Files, Network, FileText, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData, MetaData } from '../types';

export const StrategicSummary = ({ 
  pestelData, 
  mckinseyData, 
  vrioData, 
  towsData, 
  portersData 
}: { 
  pestelData: PESTELData[];
  mckinseyData: McKinsey7SData;
  vrioData: VRIOAnalysisData[];
  towsData: TOWSMatrixData;
  portersData: PortersFiveForcesData;
}) => {
  const highImpactPestel = pestelData.filter(d => d.impact === 'High' || d.impact === 'Very High');
  const sustainableResources = vrioData.filter(d => d.v === 'Yes' && d.r === 'Yes' && d.i === 'Yes' && d.o === 'Yes');
  
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* PESTEL Insights */}
        <div className="p-6 bg-white border-2 border-brand-blue/20 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-blue mb-4 flex items-center gap-2">
            <FileText size={16} /> Key Macro Factors
          </h3>
          <div className="space-y-3">
            {highImpactPestel.length > 0 ? (
              highImpactPestel.map(d => (
                <div key={d.id} className="p-3 bg-brand-blue/5 rounded-xl border border-brand-blue/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-brand-blue uppercase">{d.category}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-brand-blue text-white rounded-full font-black uppercase">{d.impact}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium line-clamp-2">{d.description || 'No description provided'}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No high impact factors identified in PESTEL.</p>
            )}
          </div>
        </div>

        {/* VRIO Insights */}
        <div className="p-6 bg-white border-2 border-gray-900/10 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
            <Database size={16} /> Strategic Assets
          </h3>
          <div className="space-y-3">
            {sustainableResources.length > 0 ? (
              sustainableResources.map(d => (
                <div key={d.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-gray-900 truncate">{d.resource}</span>
                  </div>
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-tighter">Sustainable Competitive Advantage</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No sustainable advantages identified in VRIO.</p>
            )}
          </div>
        </div>

        {/* Porters Insights */}
        <div className="p-6 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
            <Network size={16} /> Industry Forces
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(portersData).map(([key, force]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter",
                  force.impact === 'High' ? "bg-red-100 text-red-600" : 
                  force.impact === 'Medium' ? "bg-amber-100 text-amber-600" : 
                  "bg-green-100 text-green-600"
                )}>
                  {force.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOWS Strategic Directions */}
      <div className="p-8 bg-yellow-50/30 border-2 border-yellow-200 rounded-[32px] shadow-sm">
        <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-8 flex items-center gap-2">
          <Network size={20} className="text-yellow-500" /> Strategic Priorities (TOWS)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Aggressive Opportunities (S-O)
            </h4>
            <div className="space-y-2">
              {Object.entries(towsData.scores).filter(([k]) => k.startsWith('s') && k.includes('-o')).slice(0, 3).map(([key, val]) => (
                <div key={key} className="p-3 bg-white border border-green-100 rounded-xl">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium italic underline decoration-green-100">{towsData.notes[key] || 'No specific action defined.'}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Survival Threats (W-T)
            </h4>
            <div className="space-y-2">
              {Object.entries(towsData.scores).filter(([k]) => k.startsWith('w') && k.includes('-t')).slice(0, 3).map(([key, val]) => (
                <div key={key} className="p-3 bg-white border border-red-100 rounded-xl">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium italic underline decoration-red-100">{towsData.notes[key] || 'No specific action defined.'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfrontationMatrixGuide = () => (
  <div className="mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-200 print:bg-white print:border-gray-100">
    <h3 className="font-black text-2xl mb-8 text-black border-b-4 border-black inline-block pb-1">
      CONFRONTATION MATRIX FAST GUIDE
    </h3>
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h4 className="font-bold text-lg text-black uppercase tracking-tight flex items-center gap-2">
          <div className="w-2 h-6 bg-black" />
          STEPS TO BUILD THE CONFRONTATION MATRIX
        </h4>
        
        <div className="space-y-4">
          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">1. Start with your SWOT</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Use your completed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). <span className="font-semibold text-black">This is the input of the matrix.</span>
            </p>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">2. Select key factors</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Take the 3 most important items from each category. <span className="font-semibold text-black">Keeps the matrix clear and easy to analyze.</span>
            </p>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">3. Build the matrix structure</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Put internal factors (S, W) → <span className="font-semibold text-black">vertically</span>. Put external factors (O, T) → <span className="font-semibold text-black">horizontally</span>. You are confronting internal vs external.
            </p>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">4. Analyze each combination</p>
            <p className="text-gray-600 leading-relaxed text-sm mb-2 italic underline decoration-gray-200">
              Evaluate how the internal factor performs in the external environment
            </p>
            <div className="pl-4 border-l-2 border-gray-200 space-y-1">
              <p className="text-sm font-medium">• Does it create value?</p>
              <p className="text-sm font-medium">• Does it create risk?</p>
            </div>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">5. Interpret each pairing (Strategic meaning)</p>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              For every combination, ask the strategic question: <span className="font-semibold text-black text-xs uppercase bg-gray-100 px-1">"What does this pairing mean?"</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-green-700">Strength + Opportunity (S/O)</p>
                <p className="text-[11px] text-gray-500">Exploit an opportunity using a strength → aggressive/growth strategy.</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-blue-700">Strength + Threat (S/T)</p>
                <p className="text-[11px] text-gray-500">Use a strength to counter a threat → defensive strategy.</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-amber-700">Weakness + Opportunity (W/O)</p>
                <p className="text-[11px] text-gray-500">Improve weakness to seize opportunity → improvement strategy.</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-red-700">Weakness + Threat (W/T)</p>
                <p className="text-[11px] text-gray-500">Address weakness to survive threat → survival strategy.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <h4 className="font-bold text-lg text-black uppercase tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-black" />
            SCORING & VISUALIZATION
          </h4>
          
          <div className="space-y-4">
            <section>
              <p className="font-bold text-sm mb-2">6. Assign scores</p>
              <div className="flex flex-wrap gap-2">
                {['+2 (Very Positive)', '+1 (Positive)', '0 (Neutral)', '-1 (Negative)', '-2 (Very Negative)'].map(s => (
                  <span key={s} className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">{s}</span>
                ))}
              </div>
            </section>

            <section>
              <p className="font-bold text-sm mb-2">7. Highlight results</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C6E0B4]" />
                  <span><span className="font-bold text-black">Positive (+1 to +2)</span> = opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFF2CC]" />
                  <span><span className="font-bold text-black">Neutral (0)</span> = no significant impact / limited strategic relevance</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F4B084]" />
                  <span><span className="font-bold text-black">Negative (-1 to -2)</span> = problems</span>
                </li>
              </ul>
              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed italic border-l-4 border-gray-100 pl-4">
                The matrix becomes a visual map of market fit: where to act immediately (positive), what to monitor (neutral), and what to fix urgently (negative).
              </p>
            </section>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="font-bold text-sm text-black uppercase tracking-widest mb-4">Key Takeaways</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Quick overview of market position.</li>
            <li>Don’t need all green → every business has weaknesses.</li>
            <li>Helps adjust marketing, focus on strengths, and address risks.</li>
          </ul>
        </div>

        <div className="p-4 bg-black text-white rounded-xl">
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-2 text-gray-400">Final Insight & Priorities</h4>
          <p className="text-[11px] leading-relaxed opacity-90">
            The confrontation matrix is a fast strategic decision tool that bridges analysis and action by turning strategic diagnosis into clear growth and performance priorities. It clarifies positioning, highlights gaps, and enables prioritization of impactful combinations.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const PESTELWorksheet = ({ data, setData }: { data: PESTELData[]; setData: (d: PESTELData[]) => void }) => {
  const categories = ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'] as const;

  const updateItem = (id: string, field: keyof PESTELData, value: string) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black text-xs md:text-sm">
        <thead>
          <tr className="bg-brand-blue text-black">
            <th className="w-20 md:w-32 border border-black p-2 md:p-4 bg-white"></th>
            <th className="border border-black p-2 md:p-4 text-center font-bold text-base w-full">Description</th>
            <th className="w-20 md:w-32 border border-black p-2 md:p-4 text-center font-bold">Impact</th>
            <th className="w-20 md:w-32 border border-black p-2 md:p-4 text-center font-bold">Probability</th>
            <th className="w-32 md:w-64 border border-black p-2 md:p-4 text-center font-bold leading-tight">
              Potential as<br />
              Opportunity or<br />
              Threat
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const item = data.find(d => d.category === cat) || {
              id: cat,
              category: cat,
              description: '',
              impact: '',
              probability: '',
              potential: ''
            };
            
            return (
              <tr key={cat} className="group">
                <td className="border border-black p-2 md:p-4 font-bold text-center bg-gray-50 align-middle">
                  {cat}
                </td>
                <td className="border border-black p-0 relative">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full h-32 md:h-40 p-2 md:p-4 bg-transparent outline-hidden resize-none translate-z-0 relative z-10 text-xs md:text-sm leading-tight whitespace-pre-wrap"
                    placeholder={`Enter ${cat.toLowerCase()} factors...`}
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea 
                    value={item.impact}
                    onChange={(e) => updateItem(item.id, 'impact', e.target.value)}
                    className="w-full h-32 md:h-40 p-1 md:p-2 text-center outline-hidden resize-none bg-transparent"
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea 
                    value={item.probability}
                    onChange={(e) => updateItem(item.id, 'probability', e.target.value)}
                    className="w-full h-32 md:h-40 p-1 md:p-2 text-center outline-hidden resize-none bg-transparent"
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea 
                    value={item.potential}
                    onChange={(e) => updateItem(item.id, 'potential', e.target.value)}
                    className="w-full h-32 md:h-40 p-1 md:p-2 text-center outline-hidden resize-none bg-transparent"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const McKinseyWorksheet = ({ data, setData }: { data: McKinsey7SData; setData: (d: McKinsey7SData) => void }) => {
  const elements = [
    { key: 'sharedValues', label: 'Shared Values' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'systems', label: 'Systems' },
    { key: 'style', label: 'Style' },
    { key: 'staff', label: 'Staff' },
    { key: 'skills', label: 'Skills' }
  ] as const;

  const updateGrid = (rowKey: string, colKey: string, value: string) => {
    setData({
      ...data,
      [rowKey]: {
        ...(data[rowKey] || {}),
        [colKey]: value
      }
    });
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black table-auto">
        <thead>
          <tr className="bg-brand-peach">
            <th className="w-24 md:w-40 border border-black p-2 md:p-4 bg-white"></th>
            {elements.map(el => (
              <th key={el.key} className="border border-black p-2 md:p-4 text-center font-bold text-[8px] md:text-[10px] uppercase tracking-tight w-16 md:w-24">
                {el.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((rowEl, rowIndex) => (
            <tr key={rowEl.key}>
              <td className="border border-black p-2 md:p-4 font-bold text-center bg-gray-50 text-[8px] md:text-[10px] uppercase tracking-tight align-middle min-h-[64px] md:min-h-[96px]">
                {rowEl.label}
              </td>
              {elements.map((colEl, colIndex) => {
                const isDiagonal = rowIndex === colIndex;
                const cellValue = data[rowEl.key]?.[colEl.key] || '';
                
                return (
                  <td 
                    key={colEl.key} 
                    className={cn(
                      "border border-black p-0 relative min-h-[64px] md:min-h-[96px]",
                      isDiagonal && "bg-brand-peach"
                    )}
                  >
                    <textarea
                      value={cellValue}
                      onChange={(e) => updateGrid(rowEl.key, colEl.key, e.target.value)}
                      className="w-full h-full min-h-[64px] md:min-h-[96px] p-1 md:p-2 bg-transparent outline-hidden resize-none text-[8px] md:text-[10px] leading-tight font-medium"
                      placeholder="..."
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const MatrixCell = React.memo(({
  score,
  note,
  onScoreChange,
  onNoteChange,
  getBgColor,
  getTextColor
}: {
  score: string | number;
  note: string;
  onScoreChange: (val: string) => void;
  onNoteChange: (val: string) => void;
  getBgColor: (s: string | number) => string;
  getTextColor: (s: string | number) => string;
}) => {
  return (
    <div className={cn(
      "border border-gray-400 h-[100px] flex flex-col transition-all duration-300 shadow-sm hover:shadow-md", 
      getBgColor(score)
    )}>
      {/* Top Section: Dropdown with Custom Styling */}
      <div className="border-b border-gray-400/30 p-1 relative group/cell">
        <div className="relative">
          <select
            value={score}
            onChange={(e) => onScoreChange(e.target.value)}
            className={cn(
              "w-full bg-white/40 hover:bg-white/60 transition-colors font-black text-[10px] uppercase tracking-tighter outline-none cursor-pointer py-1.5 pl-2 pr-6 appearance-none border border-black/5 rounded-md",
              getTextColor(score)
            )}
          >
            <option value="-2">Very Negative (-2)</option>
            <option value="-1">Negative (-1)</option>
            <option value="0">Neutral (0)</option>
            <option value="1">Positive (+1)</option>
            <option value="2">Very Positive (+2)</option>
          </select>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 flex items-center">
            <ChevronDown size={14} className={cn(getTextColor(score))} />
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Textarea */}
      <div className="flex-1 p-0.5">
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full h-full p-1.5 text-[10px] leading-tight bg-transparent outline-none resize-none placeholder:text-gray-400/50 font-medium focus:bg-white/30 transition-colors"
          placeholder="Add strategic notes..."
          rows={2}
        />
      </div>
    </div>
  );
});

export const TOWSWorksheet = ({ data, setData, meta, setMeta }: { data: TOWSMatrixData; setData: (d: TOWSMatrixData) => void; meta: MetaData; setMeta: (m: MetaData) => void }) => {
  const updateList = (type: 'opportunities' | 'threats' | 'strengths' | 'weaknesses', index: number, value: string) => {
    const newList = [...data[type]];
    newList[index] = value;
    setData({ ...data, [type]: newList });
  };

  const updateScore = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number, value: string) => {
    let finalValue: number = parseInt(value);
    if (isNaN(finalValue)) finalValue = 0;
    
    setData({
      ...data,
      scores: {
        ...data.scores,
        [`${rowType}-${rowIndex}-${colType}-${colIndex}`]: finalValue
      }
    });
  };

  const updateNote = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number, value: string) => {
    setData({
      ...data,
      notes: {
        ...data.notes,
        [`${rowType}-${rowIndex}-${colType}-${colIndex}`]: value
      }
    });
  };

  const getScore = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number) => {
    return data.scores[`${rowType}-${rowIndex}-${colType}-${colIndex}`] ?? 0;
  };

  const getNote = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number) => {
    return data.notes[`${rowType}-${rowIndex}-${colType}-${colIndex}`] ?? "";
  };

  const getScoreNumber = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number) => {
    const val = getScore(rowType, rowIndex, colType, colIndex);
    const num = parseInt(String(val));
    return isNaN(num) ? 0 : num;
  };

  const getRowTotal = (rowType: 'strengths' | 'weaknesses', rowIndex: number) => {
    let total = 0;
    ['opportunities', 'threats'].forEach((colType) => {
      for (let i = 0; i < 3; i++) {
        total += getScoreNumber(rowType, rowIndex, colType as any, i);
      }
    });
    return total;
  };

  const getColTotal = (colType: 'opportunities' | 'threats', colIndex: number) => {
    let total = 0;
    ['strengths', 'weaknesses'].forEach((rowType) => {
      for (let i = 0; i < 3; i++) {
        total += getScoreNumber(rowType as any, i, colType, colIndex);
      }
    });
    return total;
  };

  const getBgColor = (scoreValue: string | number) => {
    const score = parseInt(String(scoreValue));
    if (isNaN(score)) return 'bg-white';
    if (score >= 1) return 'bg-[#C6E0B4]'; // Green
    if (score === 0) return 'bg-[#FFF2CC]'; // Beige/Yellow
    if (score <= -1) return 'bg-[#F4B084]'; // Red/Orange
    return 'bg-white';
  };

  const getTextColor = (scoreValue: string | number) => {
    const score = parseInt(String(scoreValue));
    if (isNaN(score)) return 'text-gray-700';
    if (score > 0) return 'text-[#385623]';
    if (score < 0) return 'text-[#843C0C]';
    return 'text-gray-700';
  };

  return (
    <div className="bg-white p-12 rounded-xl border border-gray-100 overflow-x-auto min-w-[1100px]">
      <div className="grid grid-cols-[50px_160px_1fr_20px_1fr_100px] gap-0">
        
        {/* ROW 1: Opportunities/Threats Headers */}
        <div className="col-span-2" />
        <div className="bg-black text-[#FFD666] py-3 text-center font-bold text-2xl uppercase tracking-wider mb-2 mx-1 border border-black">
          Opportunities
        </div>
        <div /> {/* Gap col */}
        <div className="bg-black text-[#FFD666] py-3 text-center font-bold text-2xl uppercase tracking-wider mb-2 mx-1 border border-black">
          Threats
        </div>
        <div />

        {/* ROW 2: Opportunity/Threat Item Headers */}
        <div className="col-span-2" />
        <div className="grid grid-cols-3 border border-black h-36 bg-[#D9D9D9] mx-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-r border-black last:border-r-0 p-2 flex items-center justify-center">
              <textarea
                value={data.opportunities[i]}
                onChange={(e) => updateList('opportunities', i, e.target.value)}
                className="w-full h-full text-[12px] leading-tight text-center font-bold bg-transparent outline-none resize-none flex items-center justify-center p-1"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 border border-black h-36 bg-[#D9D9D9] mx-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-r border-black last:border-r-0 p-2 flex items-center justify-center">
              <textarea
                value={data.threats[i]}
                onChange={(e) => updateList('threats', i, e.target.value)}
                className="w-full h-full text-[12px] leading-tight text-center font-bold bg-transparent outline-none resize-none flex items-center justify-center p-1"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="flex items-end justify-center pb-2">
          <span className="font-bold text-xs uppercase tracking-widest text-[#595959] vertical-text">Total</span>
        </div>

        {/* ROW 3: Strengths Label & Matrix */}
        <div className="bg-black text-[#FFD666] flex items-center justify-center font-bold text-2xl uppercase vertical-text mt-2 mx-1 border border-black">
          Strengths
        </div>
        <div className="flex flex-col bg-[#D9D9D9] mt-2 border-y border-l border-black">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[100px] border-b border-black last:border-b-0 p-2 flex items-center justify-center text-center">
              <textarea
                value={data.strengths[i]}
                onChange={(e) => updateList('strengths', i, e.target.value)}
                className="w-full h-full text-[12px] font-bold bg-transparent outline-none resize-none text-center flex items-center justify-center p-1"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 mt-2 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => (
            <MatrixCell 
              key={`s-o-${r}-${c}`} 
              score={getScore('strengths', r, 'opportunities', c)}
              note={getNote('strengths', r, 'opportunities', c)}
              onScoreChange={(val) => updateScore('strengths', r, 'opportunities', c, val)}
              onNoteChange={(val) => updateNote('strengths', r, 'opportunities', c, val)}
              getBgColor={getBgColor}
              getTextColor={getTextColor}
            />
          )))}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 mt-2 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => (
            <MatrixCell 
              key={`s-t-${r}-${c}`} 
              score={getScore('strengths', r, 'threats', c)}
              note={getNote('strengths', r, 'threats', c)}
              onScoreChange={(val) => updateScore('strengths', r, 'threats', c, val)}
              onNoteChange={(val) => updateNote('strengths', r, 'threats', c, val)}
              getBgColor={getBgColor}
              getTextColor={getTextColor}
            />
          )))}
        </div>
        <div className="flex flex-col bg-[#C6E0B4]/60 mt-2 border border-black ml-1">
          {[0, 1, 2].map(i => {
            const total = getRowTotal('strengths', i);
            return (
              <div key={i} className={cn("h-[100px] flex items-center justify-center font-bold text-xl border-b border-black last:border-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>

        {/* ROW 4: Gap row */}
        <div className="h-4 col-span-6" />

        {/* ROW 5: Weaknesses Label & Matrix */}
        <div className="bg-black text-[#FFD666] flex items-center justify-center font-bold text-2xl uppercase vertical-text border border-black mx-1">
          Weaknesses
        </div>
        <div className="flex flex-col bg-[#D9D9D9] border-y border-l border-black">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[100px] border-b border-black last:border-b-0 p-2 flex items-center justify-center text-center">
              <textarea
                value={data.weaknesses[i]}
                onChange={(e) => updateList('weaknesses', i, e.target.value)}
                className="w-full h-full text-[12px] font-bold bg-transparent outline-none resize-none text-center flex items-center justify-center p-1"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => (
            <MatrixCell 
              key={`w-o-${r}-${c}`} 
              score={getScore('weaknesses', r, 'opportunities', c)}
              note={getNote('weaknesses', r, 'opportunities', c)}
              onScoreChange={(val) => updateScore('weaknesses', r, 'opportunities', c, val)}
              onNoteChange={(val) => updateNote('weaknesses', r, 'opportunities', c, val)}
              getBgColor={getBgColor}
              getTextColor={getTextColor}
            />
          )))}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => (
            <MatrixCell 
              key={`w-t-${r}-${c}`} 
              score={getScore('weaknesses', r, 'threats', c)}
              note={getNote('weaknesses', r, 'threats', c)}
              onScoreChange={(val) => updateScore('weaknesses', r, 'threats', c, val)}
              onNoteChange={(val) => updateNote('weaknesses', r, 'threats', c, val)}
              getBgColor={getBgColor}
              getTextColor={getTextColor}
            />
          )))}
        </div>
        <div className="flex flex-col bg-[#FCE4D6] border border-black ml-1">
          {[0, 1, 2].map(i => {
            const total = getRowTotal('weaknesses', i);
            return (
              <div key={i} className={cn("h-[100px] flex items-center justify-center font-bold text-xl border-b border-black last:border-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>

        {/* ROW 6: Totals for O and T */}
        <div className="col-span-2 pt-4 flex items-center justify-center font-bold text-[#595959] uppercase tracking-widest text-lg">
          Total
        </div>
        <div className="grid grid-cols-3 mt-4 mx-1 border border-black bg-[#C6E0B4]/40">
          {[0, 1, 2].map(i => {
            const total = getColTotal('opportunities', i);
            return (
              <div key={i} className={cn("h-[100px] flex items-center justify-center font-bold text-xl border-r border-black last:border-r-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 mt-4 mx-1 border border-black bg-[#FCE4D6]/40">
          {[0, 1, 2].map(i => {
            const total = getColTotal('threats', i);
            return (
              <div key={i} className={cn("h-[100px] flex items-center justify-center font-bold text-xl border-r border-black last:border-r-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>
        <div />
      </div>

      {/* Legend & Explanation */}
      <div className="mt-12 flex gap-12 items-start">
        <div className="flex flex-col w-64 border border-black text-xs font-bold shadow-sm">
          <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#F4B084]">
            <span className="p-2 px-4 text-red-900 italic text-shadow-sm">Negative / Very Negative</span>
            <span className="p-2 text-center border-l border-black">-1 / -2</span>
          </div>
          <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#FFF2CC]">
            <span className="p-2 px-4 text-yellow-800">Neutral</span>
            <span className="p-2 text-center border-l border-black">0</span>
          </div>
          <div className="grid grid-cols-[1fr_60px] bg-[#C6E0B4]">
            <span className="p-2 px-4 text-green-900 italic">Positive / Very Positive</span>
            <span className="p-2 text-center border-l border-black">+1 / +2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VRIOAnalysisTable = ({ 
  data, 
  setData, 
  notes, 
  setNotes 
}: { 
  data: VRIOAnalysisData[]; 
  setData: (d: VRIOAnalysisData[]) => void;
  notes: string;
  setNotes: (n: string) => void;
}) => {
  const updateItem = (id: string, field: keyof VRIOAnalysisData, value: string) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold uppercase tracking-tight text-gray-900 border-b-4 border-gray-100 inline-block">
        VRIO Analysis
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black table-fixed">
          <thead>
            <tr className="bg-white">
              <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50">Resources</th>
              <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50">Type</th>
              <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50 w-1/4">Detail</th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
                <div className="text-lg">V</div>
                <div className="text-[10px] font-normal leading-tight lowercase">is it valuable?</div>
              </th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
                <div className="text-lg">R</div>
                <div className="text-[10px] font-normal leading-tight lowercase">is it rare?</div>
              </th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
                <div className="text-lg">I</div>
                <div className="text-[10px] font-normal leading-tight lowercase">is it hard to imitate?</div>
              </th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-28">
                <div className="text-lg">O</div>
                <div className="text-[10px] font-normal leading-tight">How organized is the company around this?</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="h-12">
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.resource}
                    onChange={(e) => updateItem(item.id, 'resource', e.target.value)}
                    className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.type}
                    onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                    className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.detail}
                    onChange={(e) => updateItem(item.id, 'detail', e.target.value)}
                    className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.v}
                    onChange={(e) => updateItem(item.id, 'v', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.r}
                    onChange={(e) => updateItem(item.id, 'r', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.i}
                    onChange={(e) => updateItem(item.id, 'i', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.o}
                    onChange={(e) => updateItem(item.id, 'o', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border border-black rounded-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-black px-4 py-2 text-sm font-bold">Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[120px] p-4 text-sm bg-white outline-hidden resize-none translate-z-0"
          placeholder="Enter additional analysis notes here..."
        />
      </div>
    </div>
  );
};

export const VRIOFramework = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] gap-0">
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center">
          <div className="flex-1 flex items-center justify-center">
            <Database size={100} className="text-gray-300" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight">IS IT VALUABLE?</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <Files size={100} className="text-gray-300" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight">IS IT RARE?</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <Network size={100} className="text-gray-300" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight">IS IT DIFFICULT TO IMITATE?</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <Settings2 size={100} className="text-gray-300" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight text-center leading-[1.1] text-gray-800 px-2">HOW ORGANIZED IS THE COMPANY AROUND THIS</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <FileText size={100} className="text-gray-300" />
          </div>
          <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight px-4">WHAT IS THE OVERALL RESULT?</span>
        </div>
      </div>

      {/* Decision Table */}
      <div className="space-y-4 pt-1">
        {/* Row 1 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-[#FF9B9B] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Competitive Disadvantage
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-[#EB9F7D] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Competitive Parity
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-[#FFD666] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Temporary Competitive Advantage
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 focus:bg-white transition-colors">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-[#ADCCD1] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Unused Competitive Advantage
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="bg-[#8EB39F] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Sustainable Competitive Advantage
          </div>
        </div>
      </div>
    </div>
  );
};

export const PortersFiveForces = ({ 
  data, 
  setData, 
  activeForce, 
  setActiveForce 
}: { 
  data: PortersFiveForcesData; 
  setData: (d: PortersFiveForcesData) => void;
  activeForce: keyof PortersFiveForcesData;
  setActiveForce: (f: keyof PortersFiveForcesData) => void;
}) => {
  const forceConfigs = {
    suppliers: {
      title: 'Bargaining Power of Suppliers',
      color: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Are there a large number of potential input suppliers? The greater number of suppliers of your needed inputs, the more control you will have.',
        'Are the products that you need to purchase for your business ordinary? You have more control when the products you need from a supplier are not unique.',
        'Do your purchases from suppliers represent a large portion of their business? If your purchases are a relatively large portion of your supplier’s business, you will have more power to lower costs or improve product features.',
        'Would it be difficult for your suppliers to enter your business, sell directly to your customers, and become your direct competitor? The easier it is to start a new business, the more likely it is that you will have competitors.',
        'Can you easily switch to substitute products from other suppliers? If it is relatively easy to switch to substitute products, you will have more negotiating room with your suppliers.',
        'Are you well informed about your supplier\'s product and market? If the market is complicated or hard to understand, you have less bargaining power with your suppliers.'
      ],
      tableHeaders: [
        'List the major inputs needed for your business.',
        'For each input, list possible suppliers.',
        'How can you best work with this supplier to maximize your bargaining power?'
      ]
    },
    buyers: {
      title: 'Bargaining Power of Buyers',
      color: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Do you have enough customers such that losing one isn’t critical to your success? The smaller the number of customers, the more dependent you are on each one of them.',
        'Does your product represent a small expense for your customers? If your product is a relatively large expense for your customers, they’ll expend more effort negotiating with you to lower price or improve product features.',
        'Are customers uninformed about your product and market? If your market is complicated or hard to understand, buyers have less control.',
        'Is your product unique? If your product is homogenous or the same as your competitors’, buyers have more bargaining power.',
        'Would it be difficult for buyers to integrate backward in the supply chain, purchase a competitor providing the products you provide, and compete directly with you? The less likely a customer will enter your industry, the more bargaining power you have.',
        'Is it difficult for customers to switch from your product to your competitors’ products? If it is relatively easy for your customers to switch, you will have less negotiating power with your customers.'
      ],
      tableHeaders: [
        'List the types of customers that you have or expect to have.',
        'What alternatives might these customers have for your product?',
        'How can you build loyalty for your product or service to reduce customer bargaining power?'
      ]
    },
    newEntrants: {
      title: 'Threat of New Entrants',
      color: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Do you have a unique process that has been protected? For example, if you are a technology-based company with patent protection for your research investments, you enjoy some barriers to entry.',
        'Are customers loyal to your brand? If your customers are loyal to your brand, a new product, even if identical, would face a formidable battle to win over loyal customers.',
        'Are there high start-up costs for your business? The greater the capital requirements, the lower the threat of new competition.',
        'Are the assets needed to run your business unique? Others will be more reluctant to enter the market if the technology or equipment cannot be converted into other uses if the venture fails.',
        'Is there a process or procedure critical to your business? The more difficult it is to learn the business, the greater the entry barrier.',
        'Will a new competitor have difficulty acquiring/obtaining needed inputs? Current distribution channels may make it difficult for a new business to acquire/obtain inputs as readily as existing businesses.',
        'Will a new competitor have any difficulty acquiring/obtaining customers? If current distribution channels make it difficult for a new business to acquire/obtain new customers, you will enjoy a barrier to entry.',
        'Would it be difficult for a new entrant to have enough resources to compete efficiently? For every product, there is a cost-efficient level of production. If challengers can’t achieve that level of production, they won’t be competitive and therefore won’t enter the industry.'
      ],
      tableHeaders: [
        'Questions to Consider',
        'Strategic Response'
      ],
      customRows: [
        'How would a new entrant affect your business?',
        'What will your competitors do if there is a new entrant into your marketplace?',
        'How will you respond to a new competitor?'
      ]
    },
    substitutes: {
      title: 'Threat of Substitutes',
      color: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Does your product compare favorably to possible substitutes? If another product offers more features or benefits to customers, or if their price is lower, customers may decide that the other product is a better value.',
        'Is it costly for your customers to switch to another product? When customers experience a loss of productivity if they switch to another product, the threat of substitutes is weaker.',
        'Are customers loyal to existing products? Even if switching costs are low, customers may have allegiance to a particular brand. If your customers have high brand loyalty to your product you enjoy a weak threat of substitutes.'
      ],
      tableHeaders: [
        'List possible substitutes that your customers could use in place of your product.',
        'How easy would it be for your customer to consider this alternative?',
        'How can you differentiate your products or build customer loyalty to manage the threat of substitutes?'
      ]
    },
    rivalry: {
      title: 'Rivalry Among Competitors',
      color: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Is there a small number of competitors? Often the greater the number of players, the more intense the rivalry. However, rivalry can occasionally be intense when one or more firms are vying for market leader positions.',
        'Is there a clear leader in your market? Rivalry intensifies if companies have similar shares of the market, leading to a struggle for market leadership.',
        'Is your market growing? In a growing market, firms are able to grow revenues simply because of the expanding market. In a stagnant or declining market, companies often fight intensely for a smaller and smaller market.',
        'Do you have low fixed costs? With high fixed costs, companies must sell more products to cover these high costs.',
        'Can you store your product to sell at the best times? High storage costs or perishable products result in a situation where firms must sell product as soon as possible, increasing rivalry among firms.',
        'Are your competitors pursuing a low growth strategy? You will have more intense rivalries if your competitors are more aggressive. In contrast, if your competitors are following a strategy of milking profits in a mature market, you will enjoy less rivalry.',
        'Is your product unique? Firms that produce products that are very similar will compete mostly on price, so rivalry is expected to be high.',
        'Is it easy for competitors to abandon their product? If exit costs are high, a company may remain in business even if it is not profitable.',
        'Is it difficult for customers to switch between your product and your competitors’? If customers can easily switch, the market will be more competitive and rivalry is expected to be high as firms vie for each customer’s business.'
      ],
      tableHeaders: [
        'List your major competitors.',
        'What business and growth strategies does this competitor use?',
        'How will this competitor affect your business?',
        'What actions will you take in response to your competitors’ actions?'
      ]
    }
  };

  const currentConfig = forceConfigs[activeForce];
  const currentData = data[activeForce];

  const updateScorecard = (index: number, val: boolean) => {
    setData({
      ...data,
      [activeForce]: {
        ...currentData,
        scorecard: { ...currentData.scorecard, [index]: val }
      }
    });
  };

  const updateFurther = (rowIndex: number, colKey: string, val: string) => {
    const newFurther = [...currentData.further];
    newFurther[rowIndex] = { ...newFurther[rowIndex], [colKey]: val };
    setData({
      ...data,
      [activeForce]: { ...currentData, further: newFurther }
    });
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl no-print">
        {Object.entries(forceConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveForce(key as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
              activeForce === key 
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {config.title.split('of ').pop()?.split('Among ').pop() || config.title}
          </button>
        ))}
      </div>

      <div className={cn("p-12 rounded-[40px] border shadow-2xl space-y-12 transition-all", currentConfig.color, currentConfig.borderColor)}>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className={cn("text-3xl font-black uppercase italic tracking-tighter", currentConfig.textColor)}>
            {currentConfig.title}
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Strategic Assessment Worksheet
          </p>
        </div>

        {/* Self Assessment Scorecard */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black uppercase italic text-gray-900">Self Assessment Scorecard</h3>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed italic border-l-4 border-gray-200 pl-4">
            {(currentConfig as any).info}
          </p>
          <div className="space-y-2">
            {currentConfig.questions.map((q, idx) => (
              <div key={idx} className="flex items-center gap-6 p-3 bg-white/40 rounded-xl border border-white/60 hover:bg-white/80 transition-all group">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateScorecard(idx, true)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border-2 cursor-pointer",
                      currentData.scorecard[idx] === true 
                        ? "bg-green-600 border-green-600 text-white shadow-sm" 
                        : "bg-white border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-600"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => updateScorecard(idx, false)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border-2 cursor-pointer",
                      currentData.scorecard[idx] === false 
                        ? "bg-red-600 border-red-600 text-white shadow-sm" 
                        : "bg-white border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-600"
                    )}
                  >
                    No
                  </button>
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-tight">
                  <span className="text-gray-300 mr-2">{idx + 1}.</span>
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Further Assessment Table */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black uppercase italic text-gray-900">Further Assessment</h3>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  {currentConfig.tableHeaders.map((h, i) => (
                    <th key={i} className="p-4 text-[10px] font-black uppercase tracking-[0.1em] text-gray-900 border-r-2 border-black last:border-0 text-center leading-tight">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {activeForce === 'newEntrants' && 'customRows' in currentConfig ? (
                  (currentConfig as any).customRows.map((q: string, idx: number) => (
                    <tr key={idx} className="group">
                      <td className="p-6 text-[11px] font-black text-gray-900 w-1/3 bg-gray-50 border-r-2 border-black uppercase tracking-tight leading-tight italic">
                        {q}
                      </td>
                      <td className="p-0">
                        <textarea
                          value={currentData.further[idx]?.col2 || ''}
                          onChange={(e) => updateFurther(idx, 'col2', e.target.value)}
                          className="w-full h-32 p-6 text-sm font-medium bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                          placeholder="Analysis and strategic response..."
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  currentData.further.map((row, idx) => (
                    <tr key={idx} className="group h-32">
                      {['col1', 'col2', 'col3', 'col4'].slice(0, currentConfig.tableHeaders.length).map((col, cIdx) => (
                        <td key={col} className="p-0 border-r-2 border-black last:border-0 relative">
                          <textarea
                            value={(row as any)[col] || ''}
                            onChange={(e) => updateFurther(idx, col, e.target.value)}
                            className="w-full h-full p-6 pt-8 text-xs font-semibold bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                            placeholder={cIdx === 0 ? "Identify..." : "Analysis..."}
                          />
                          {cIdx === 0 && <span className="absolute top-2 left-3 text-[10px] font-black text-gray-200 uppercase group-hover:text-gray-400 transition-colors">#{idx + 1}</span>}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
