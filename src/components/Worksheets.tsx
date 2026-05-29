import React from 'react';
import { ChevronDown, Database, Files, Network, FileText, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  PESTELRow,
  McKinsey7SData,
  VRIORow,
  TOWSRow,
  PorterRow,
} from '../types';

export const ConfrontationMatrixGuide = () => (
  <div className="mb-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 print:border-gray-100 print:bg-white">
    <h3 className="mb-8 inline-block border-b-4 border-black pb-1 text-2xl font-black text-black">
      CONFRONTATION MATRIX FAST GUIDE
    </h3>

    <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 text-lg font-bold tracking-tight text-black uppercase">
          <div className="h-6 w-2 bg-black" />
          STEPS TO BUILD THE CONFRONTATION MATRIX
        </h4>

        <div className="space-y-4">
          <section>
            <p className="mb-1 text-sm font-bold tracking-wider uppercase">
              1. Start with your SWOT
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Use your completed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).{' '}
              <span className="font-semibold text-black">This is the input of the matrix.</span>
            </p>
          </section>

          <section>
            <p className="mb-1 text-sm font-bold tracking-wider uppercase">2. Select key factors</p>
            <p className="text-sm leading-relaxed text-gray-600">
              Take the 3 most important items from each category.{' '}
              <span className="font-semibold text-black">
                Keeps the matrix clear and easy to analyze.
              </span>
            </p>
          </section>

          <section>
            <p className="mb-1 text-sm font-bold tracking-wider uppercase">
              3. Build the matrix structure
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Put internal factors (S, W) →{' '}
              <span className="font-semibold text-black">vertically</span>. Put external factors (O,
              T) → <span className="font-semibold text-black">horizontally</span>. You are
              confronting internal vs external.
            </p>
          </section>

          <section>
            <p className="mb-1 text-sm font-bold tracking-wider uppercase">
              4. Analyze each combination
            </p>
            <p className="mb-2 text-sm leading-relaxed text-gray-600 italic underline decoration-gray-200">
              Evaluate how the internal factor performs in the external environment
            </p>
            <div className="space-y-1 border-l-2 border-gray-200 pl-4">
              <p className="text-sm font-medium">• Does it create value?</p>
              <p className="text-sm font-medium">• Does it create risk?</p>
            </div>
          </section>

          <section>
            <p className="mb-1 text-sm font-bold tracking-wider uppercase">
              5. Interpret each pairing (Strategic meaning)
            </p>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              For every combination, ask the strategic question:{' '}
              <span className="bg-gray-100 px-1 text-xs font-semibold text-black uppercase">
                "What does this pairing mean?"
              </span>
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-white p-3">
                <p className="mb-1 text-xs font-bold text-green-700">
                  Strength + Opportunity (S/O)
                </p>
                <p className="text-[11px] text-gray-500">
                  Exploit an opportunity using a strength → aggressive/growth strategy.
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white p-3">
                <p className="mb-1 text-xs font-bold text-blue-700">Strength + Threat (S/T)</p>
                <p className="text-[11px] text-gray-500">
                  Use a strength to counter a threat → defensive strategy.
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white p-3">
                <p className="mb-1 text-xs font-bold text-amber-700">
                  Weakness + Opportunity (W/O)
                </p>
                <p className="text-[11px] text-gray-500">
                  Improve weakness to seize opportunity → improvement strategy.
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white p-3">
                <p className="mb-1 text-xs font-bold text-red-700">Weakness + Threat (W/T)</p>
                <p className="text-[11px] text-gray-500">
                  Address weakness to survive threat → survival strategy.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <h4 className="flex items-center gap-2 text-lg font-bold tracking-tight text-black uppercase">
            <div className="h-6 w-2 bg-black" />
            SCORING & VISUALIZATION
          </h4>

          <div className="space-y-4">
            <section>
              <p className="mb-2 text-sm font-bold">6. Assign scores</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '+2 (Very Positive)',
                  '+1 (Positive)',
                  '0 (Neutral)',
                  '-1 (Negative)',
                  '-2 (Very Negative)',
                ].map((s) => (
                  <span
                    key={s}
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-sm font-bold">7. Highlight results</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#C6E0B4]" />
                  <span>
                    <span className="font-bold text-black">Positive (+1 to +2)</span> =
                    opportunities
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FFF2CC]" />
                  <span>
                    <span className="font-bold text-black">Neutral (0)</span> = no significant
                    impact / limited strategic relevance
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#F4B084]" />
                  <span>
                    <span className="font-bold text-black">Negative (-1 to -2)</span> = problems
                  </span>
                </li>
              </ul>
              <p className="mt-4 border-l-4 border-gray-100 pl-4 text-[11px] leading-relaxed text-gray-400 italic">
                The matrix becomes a visual map of market fit: where to act immediately (positive),
                what to monitor (neutral), and what to fix urgently (negative).
              </p>
            </section>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="mb-4 text-sm font-bold tracking-widest text-black uppercase">
            Key Takeaways
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>Quick overview of market position.</li>
            <li>Don’t need all green → every business has weaknesses.</li>
            <li>Helps adjust marketing, focus on strengths, and address risks.</li>
          </ul>
        </div>

        <div className="rounded-xl bg-black p-4 text-white">
          <h4 className="mb-2 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
            Final Insight & Priorities
          </h4>
          <p className="text-[11px] leading-relaxed opacity-90">
            The confrontation matrix is a fast strategic decision tool that bridges analysis and
            action by turning strategic diagnosis into clear growth and performance priorities. It
            clarifies positioning, highlights gaps, and enables prioritization of impactful
            combinations.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const PESTELWorksheet = ({
  data,
  setData,
}: {
  data: PESTELRow[];
  setData: (d: PESTELRow[]) => void;
}) => {
  const categories = [
    'Political',
    'Economic',
    'Social',
    'Technological',
    'Environmental',
    'Legal',
  ] as const;

  const updateItem = (id: string, field: keyof PESTELRow, value: string) => {
    setData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border-r-2 border-b-2 border-l-2 border-black text-xs md:text-sm">
        <thead>
          <tr className="bg-brand-blue text-black">
            <th className="w-20 border border-black bg-white p-2 md:w-32 md:p-4"></th>
            <th className="w-full border border-black p-2 text-center text-base font-bold md:p-4">
              Description
            </th>
            <th className="w-20 border border-black p-2 text-center font-bold md:w-32 md:p-4">
              Impact
            </th>
            <th className="w-20 border border-black p-2 text-center font-bold md:w-32 md:p-4">
              Probability
            </th>
            <th className="w-32 border border-black p-2 text-center leading-tight font-bold md:w-64 md:p-4">
              Potential as
              <br />
              Opportunity or
              <br />
              Threat
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const item = data.find((d) => d.category === cat) || {
              id: cat,
              category: cat,
              description: '',
              impact: '',
              probability: '',
              potential: '',
            };

            return (
              <tr key={cat} className="group">
                <td className="border border-black bg-gray-50 p-2 text-center align-middle font-bold md:p-4">
                  {cat}
                </td>
                <td className="relative border border-black p-0">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="relative z-10 h-32 w-full translate-z-0 resize-none bg-transparent p-2 text-xs leading-tight whitespace-pre-wrap outline-hidden md:h-40 md:p-4 md:text-sm"
                    placeholder={`Enter ${cat.toLowerCase()} factors...`}
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea
                    value={item.impact}
                    onChange={(e) => updateItem(item.id, 'impact', e.target.value)}
                    className="h-32 w-full resize-none bg-transparent p-1 text-center outline-hidden md:h-40 md:p-2"
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea
                    value={item.probability}
                    onChange={(e) => updateItem(item.id, 'probability', e.target.value)}
                    className="h-32 w-full resize-none bg-transparent p-1 text-center outline-hidden md:h-40 md:p-2"
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea
                    value={item.potential}
                    onChange={(e) => updateItem(item.id, 'potential', e.target.value)}
                    className="h-32 w-full resize-none bg-transparent p-1 text-center outline-hidden md:h-40 md:p-2"
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

export const McKinseyWorksheet = ({
  data,
  setData,
}: {
  data: McKinsey7SData;
  setData: (d: McKinsey7SData) => void;
}) => {
  const elements = [
    { key: 'sharedValues', label: 'Shared Values' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'systems', label: 'Systems' },
    { key: 'style', label: 'Style' },
    { key: 'staff', label: 'Staff' },
    { key: 'skills', label: 'Skills' },
  ] as const;

  const updateGrid = (rowKey: string, colKey: string, value: string) => {
    setData({
      ...data,
      [rowKey]: {
        ...(data[rowKey] || {}),
        [colKey]: value,
      },
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse border-r-2 border-b-2 border-l-2 border-black">
        <thead>
          <tr className="bg-brand-peach">
            <th className="w-24 border border-black bg-white p-2 md:w-40 md:p-4"></th>
            {elements.map((el) => (
              <th
                key={el.key}
                className="w-16 border border-black p-2 text-center text-[8px] font-bold tracking-tight uppercase md:w-24 md:p-4 md:text-[10px]"
              >
                {el.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((rowEl, rowIndex) => (
            <tr key={rowEl.key}>
              <td className="min-h-[64px] border border-black bg-gray-50 p-2 text-center align-middle text-[8px] font-bold tracking-tight uppercase md:min-h-[96px] md:p-4 md:text-[10px]">
                {rowEl.label}
              </td>
              {elements.map((colEl, colIndex) => {
                const isDiagonal = rowIndex === colIndex;
                const cellValue = data[rowEl.key]?.[colEl.key] || '';

                return (
                  <td
                    key={colEl.key}
                    className={cn(
                      'relative min-h-[64px] border border-black p-0 md:min-h-[96px]',
                      isDiagonal && 'bg-brand-peach',
                    )}
                  >
                    <textarea
                      value={cellValue}
                      onChange={(e) => updateGrid(rowEl.key, colEl.key, e.target.value)}
                      className="h-full min-h-[64px] w-full resize-none bg-transparent p-1 text-[8px] leading-tight font-medium outline-hidden md:min-h-[96px] md:p-2 md:text-[10px]"
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

export const MatrixCell = React.memo(
  ({
    score,
    note,
    onScoreChange,
    onNoteChange,
    getBgColor,
    getTextColor,
  }: {
    score: string | number;
    note: string;
    onScoreChange: (val: string) => void;
    onNoteChange: (val: string) => void;
    getBgColor: (s: string | number) => string;
    getTextColor: (s: string | number) => string;
  }) => {
    return (
      <div
        className={cn(
          'flex h-[100px] flex-col border border-gray-400 shadow-sm transition-all duration-300 hover:shadow-md',
          getBgColor(score),
        )}
      >
        {/* Top Section: Dropdown with Custom Styling */}
        <div className="group/cell relative border-b border-gray-400/30 p-1">
          <div className="relative">
            <select
              value={score}
              onChange={(e) => onScoreChange(e.target.value)}
              className={cn(
                'w-full cursor-pointer appearance-none rounded-md border border-black/5 bg-white/40 py-1.5 pr-6 pl-2 text-[10px] font-black tracking-tighter uppercase transition-colors outline-none hover:bg-white/60',
                getTextColor(score),
              )}
            >
              <option value="-2">Very Negative (-2)</option>
              <option value="-1">Negative (-1)</option>
              <option value="0">Neutral (0)</option>
              <option value="1">Positive (+1)</option>
              <option value="2">Very Positive (+2)</option>
            </select>
            <div className="pointer-events-none absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center opacity-50">
              <ChevronDown size={14} className={cn(getTextColor(score))} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Textarea */}
        <div className="flex-1 p-0.5">
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="h-full w-full resize-none bg-transparent p-1.5 text-[10px] leading-tight font-medium transition-colors outline-none placeholder:text-gray-400/50 focus:bg-white/30"
            placeholder="Add strategic notes..."
            rows={2}
          />
        </div>
      </div>
    );
  },
);

export const TOWSWorksheet = ({
  data,
  setData,
}: {
  data: TOWSRow[];
  setData: (d: TOWSRow[]) => void;
}) => {
  // Helper to find or create rows for sections
  const getSection = (section: TOWSRow['section']) => {
    return (Array.isArray(data) ? data : []).find((r) => r.section === section) || {
      id: section,
      section,
      data: ['', '', ''],
      scores: {},
      notes: {},
    };
  };

  const opportunities = getSection('opportunities');
  const threats = getSection('threats');
  const strengths = getSection('strengths');
  const weaknesses = getSection('weaknesses');

  const updateRow = (section: TOWSRow['section'], updatedRow: TOWSRow) => {
    const exists = data.some((r) => r.section === section);
    if (exists) {
      setData(data.map((r) => (r.section === section ? updatedRow : r)));
    } else {
      setData([...data, updatedRow]);
    }
  };

  const updateList = (section: TOWSRow['section'], index: number, value: string) => {
    const row = getSection(section);
    const newData = [...row.data];
    newData[index] = value;
    updateRow(section, { ...row, data: newData });
  };

  const updateScore = (
    rowSection: 'strengths' | 'weaknesses',
    rowIndex: number,
    colSection: 'opportunities' | 'threats',
    colIndex: number,
    value: string,
  ) => {
    const row = getSection(rowSection);
    const finalValue = parseInt(value) || 0;
    
    // The matrix scores are shared, but they are stored in the TOWSRow object.
    // This is a bit ambiguous in the type definition, but we'll assume they are stored in the row object.
    updateRow(rowSection, {
      ...row,
      scores: {
        ...row.scores,
        [`${rowIndex}-${colSection}-${colIndex}`]: finalValue,
      },
    });
  };

  const updateNote = (
    rowSection: 'strengths' | 'weaknesses',
    rowIndex: number,
    colSection: 'opportunities' | 'threats',
    colIndex: number,
    value: string,
  ) => {
    const row = getSection(rowSection);
    updateRow(rowSection, {
      ...row,
      notes: {
        ...row.notes,
        [`${rowIndex}-${colSection}-${colIndex}`]: value,
      },
    });
  };

  const getScore = (
    rowSection: 'strengths' | 'weaknesses',
    rowIndex: number,
    colSection: 'opportunities' | 'threats',
    colIndex: number,
  ) => {
    const row = getSection(rowSection);
    return row.scores[`${rowIndex}-${colSection}-${colIndex}`] ?? 0;
  };

  const getNote = (
    rowSection: 'strengths' | 'weaknesses',
    rowIndex: number,
    colSection: 'opportunities' | 'threats',
    colIndex: number,
  ) => {
    const row = getSection(rowSection);
    return row.notes[`${rowIndex}-${colSection}-${colIndex}`] ?? '';
  };

  const getScoreNumber = (
    rowSection: 'strengths' | 'weaknesses',
    rowIndex: number,
    colSection: 'opportunities' | 'threats',
    colIndex: number,
  ) => {
    const val = getScore(rowSection, rowIndex, colSection, colIndex);
    const num = parseInt(String(val));
    return isNaN(num) ? 0 : num;
  };

  const getRowTotal = (rowSection: 'strengths' | 'weaknesses', rowIndex: number) => {
    let total = 0;
    (['opportunities', 'threats'] as ('opportunities' | 'threats')[]).forEach((colSection) => {
      for (let i = 0; i < 3; i++) {
        total += getScoreNumber(rowSection, rowIndex, colSection, i);
      }
    });
    return total;
  };

  const getColTotal = (colSection: 'opportunities' | 'threats', colIndex: number) => {
    let total = 0;
    (['strengths', 'weaknesses'] as ('strengths' | 'weaknesses')[]).forEach((rowSection) => {
      for (let i = 0; i < 3; i++) {
        total += getScoreNumber(rowSection, i, colSection, colIndex);
      }
    });
    return total;
  };
  
  // ... (getBgColor, getTextColor remain the same, they don't depend on data)
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
    <div className="min-w-[1100px] overflow-x-auto rounded-xl border border-gray-100 bg-white p-12">
      <div className="grid grid-cols-[50px_160px_1fr_20px_1fr_100px] gap-0">
        {/* ROW 1: Opportunities/Threats Headers */}
        <div className="col-span-2" />
        <div className="mx-1 mb-2 border border-black bg-black py-3 text-center text-2xl font-bold tracking-wider text-[#FFD666] uppercase">
          Opportunities
        </div>
        <div /> {/* Gap col */}
        <div className="mx-1 mb-2 border border-black bg-black py-3 text-center text-2xl font-bold tracking-wider text-[#FFD666] uppercase">
          Threats
        </div>
        <div />
        {/* ROW 2: Opportunity/Threat Item Headers */}
        <div className="col-span-2" />
        <div className="mx-1 grid h-36 grid-cols-3 border border-black bg-[#D9D9D9]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-center border-r border-black p-2 last:border-r-0"
            >
              <textarea
                value={opportunities.data[i]}
                onChange={(e) => updateList('opportunities', i, e.target.value)}
                className="flex h-full w-full resize-none items-center justify-center bg-transparent p-1 text-center text-[12px] leading-tight font-bold outline-none"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div /> {/* Gap col */}
        <div className="mx-1 grid h-36 grid-cols-3 border border-black bg-[#D9D9D9]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-center border-r border-black p-2 last:border-r-0"
            >
              <textarea
                value={threats.data[i]}
                onChange={(e) => updateList('threats', i, e.target.value)}
                className="flex h-full w-full resize-none items-center justify-center bg-transparent p-1 text-center text-[12px] leading-tight font-bold outline-none"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="flex items-end justify-center pb-2">
          <span className="vertical-text text-xs font-bold tracking-widest text-[#595959] uppercase">
            Total
          </span>
        </div>
        {/* ROW 3: Strengths Label & Matrix */}
        <div className="vertical-text mx-1 mt-2 flex items-center justify-center border border-black bg-black text-2xl font-bold text-[#FFD666] uppercase">
          Strengths
        </div>
        <div className="mt-2 flex flex-col border-y border-l border-black bg-[#D9D9D9]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-[100px] items-center justify-center border-b border-black p-2 text-center last:border-b-0"
            >
              <textarea
                value={strengths.data[i]}
                onChange={(e) => updateList('strengths', i, e.target.value)}
                className="flex h-full w-full resize-none items-center justify-center bg-transparent p-1 text-center text-[12px] font-bold outline-none"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="mx-1 mt-2 grid grid-cols-3 border border-black">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <MatrixCell
                key={`s-o-${r}-${c}`}
                score={getScore('strengths', r, 'opportunities', c)}
                note={getNote('strengths', r, 'opportunities', c)}
                onScoreChange={(val) => updateScore('strengths', r, 'opportunities', c, val)}
                onNoteChange={(val) => updateNote('strengths', r, 'opportunities', c, val)}
                getBgColor={getBgColor}
                getTextColor={getTextColor}
              />
            )),
          )}
        </div>
        <div /> {/* Gap col */}
        <div className="mx-1 mt-2 grid grid-cols-3 border border-black">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <MatrixCell
                key={`s-t-${r}-${c}`}
                score={getScore('strengths', r, 'threats', c)}
                note={getNote('strengths', r, 'threats', c)}
                onScoreChange={(val) => updateScore('strengths', r, 'threats', c, val)}
                onNoteChange={(val) => updateNote('strengths', r, 'threats', c, val)}
                getBgColor={getBgColor}
                getTextColor={getTextColor}
              />
            )),
          )}
        </div>
        <div className="mt-2 ml-1 flex flex-col border border-black bg-[#C6E0B4]/60">
          {[0, 1, 2].map((i) => {
            const total = getRowTotal('strengths', i);
            return (
              <div
                key={i}
                className={cn(
                  'flex h-[100px] items-center justify-center border-b border-black text-xl font-bold last:border-0',
                  getTextColor(total),
                  total > 0 ? 'bg-[#C6E0B4]' : total < 0 ? 'bg-[#F4B084]' : 'bg-[#FFF2CC]',
                )}
              >
                {total}
              </div>
            );
          })}
        </div>
        {/* ROW 4: Gap row */}
        <div className="col-span-6 h-4" />
        {/* ROW 5: Weaknesses Label & Matrix */}
        <div className="vertical-text mx-1 flex items-center justify-center border border-black bg-black text-2xl font-bold text-[#FFD666] uppercase">
          Weaknesses
        </div>
        <div className="flex flex-col border-y border-l border-black bg-[#D9D9D9]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-[100px] items-center justify-center border-b border-black p-2 text-center last:border-b-0"
            >
              <textarea
                value={weaknesses.data[i]}
                onChange={(e) => updateList('weaknesses', i, e.target.value)}
                className="flex h-full w-full resize-none items-center justify-center bg-transparent p-1 text-center text-[12px] font-bold outline-none"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="mx-1 grid grid-cols-3 border border-black">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <MatrixCell
                key={`w-o-${r}-${c}`}
                score={getScore('weaknesses', r, 'opportunities', c)}
                note={getNote('weaknesses', r, 'opportunities', c)}
                onScoreChange={(val) => updateScore('weaknesses', r, 'opportunities', c, val)}
                onNoteChange={(val) => updateNote('weaknesses', r, 'opportunities', c, val)}
                getBgColor={getBgColor}
                getTextColor={getTextColor}
              />
            )),
          )}
        </div>
        <div /> {/* Gap col */}
        <div className="mx-1 grid grid-cols-3 border border-black">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <MatrixCell
                key={`w-t-${r}-${c}`}
                score={getScore('weaknesses', r, 'threats', c)}
                note={getNote('weaknesses', r, 'threats', c)}
                onScoreChange={(val) => updateScore('weaknesses', r, 'threats', c, val)}
                onNoteChange={(val) => updateNote('weaknesses', r, 'threats', c, val)}
                getBgColor={getBgColor}
                getTextColor={getTextColor}
              />
            )),
          )}
        </div>
        <div className="ml-1 flex flex-col border border-black bg-[#FCE4D6]">
          {[0, 1, 2].map((i) => {
            const total = getRowTotal('weaknesses', i);
            return (
              <div
                key={i}
                className={cn(
                  'flex h-[100px] items-center justify-center border-b border-black text-xl font-bold last:border-0',
                  getTextColor(total),
                  total > 0 ? 'bg-[#C6E0B4]' : total < 0 ? 'bg-[#F4B084]' : 'bg-[#FFF2CC]',
                )}
              >
                {total}
              </div>
            );
          })}
        </div>
        {/* ROW 6: Totals for O and T */}
        <div className="col-span-2 flex items-center justify-center pt-4 text-lg font-bold tracking-widest text-[#595959] uppercase">
          Total
        </div>
        <div className="mx-1 mt-4 grid grid-cols-3 border border-black bg-[#C6E0B4]/40">
          {[0, 1, 2].map((i) => {
            const total = getColTotal('opportunities', i);
            return (
              <div
                key={i}
                className={cn(
                  'flex h-[100px] items-center justify-center border-r border-black text-xl font-bold last:border-r-0',
                  getTextColor(total),
                  total > 0 ? 'bg-[#C6E0B4]' : total < 0 ? 'bg-[#F4B084]' : 'bg-[#FFF2CC]',
                )}
              >
                {total}
              </div>
            );
          })}
        </div>
        <div /> {/* Gap col */}
        <div className="mx-1 mt-4 grid grid-cols-3 border border-black bg-[#FCE4D6]/40">
          {[0, 1, 2].map((i) => {
            const total = getColTotal('threats', i);
            return (
              <div
                key={i}
                className={cn(
                  'flex h-[100px] items-center justify-center border-r border-black text-xl font-bold last:border-r-0',
                  getTextColor(total),
                  total > 0 ? 'bg-[#C6E0B4]' : total < 0 ? 'bg-[#F4B084]' : 'bg-[#FFF2CC]',
                )}
              >
                {total}
              </div>
            );
          })}
        </div>
        <div />
      </div>

      {/* Legend & Explanation */}
      <div className="mt-12 flex items-start gap-12">
        <div className="flex w-64 flex-col border border-black text-xs font-bold shadow-sm">
          <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#F4B084]">
            <span className="p-2 px-4 text-red-900 italic text-shadow-sm">
              Negative / Very Negative
            </span>
            <span className="border-l border-black p-2 text-center">-1 / -2</span>
          </div>
          <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#FFF2CC]">
            <span className="p-2 px-4 text-yellow-800">Neutral</span>
            <span className="border-l border-black p-2 text-center">0</span>
          </div>
          <div className="grid grid-cols-[1fr_60px] bg-[#C6E0B4]">
            <span className="p-2 px-4 text-green-900 italic">Positive / Very Positive</span>
            <span className="border-l border-black p-2 text-center">+1 / +2</span>
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
  setNotes,
}: {
  data: VRIORow[];
  setData: (d: VRIORow[]) => void;
  notes: string;
  setNotes: (n: string) => void;
}) => {
  const updateItem = (id: string, field: keyof VRIORow, value: string) => {
    setData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="space-y-4">
      <h3 className="inline-block border-b-4 border-gray-100 text-2xl font-bold tracking-tight text-gray-900 uppercase">
        VRIO Analysis
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border-2 border-black">
          <thead>
            <tr className="bg-white">
              <th className="border border-black bg-gray-50/50 p-4 text-center text-sm font-bold">
                Resources
              </th>
              <th className="border border-black bg-gray-50/50 p-4 text-center text-sm font-bold">
                Type
              </th>
              <th className="w-1/4 border border-black bg-gray-50/50 p-4 text-center text-sm font-bold">
                Detail
              </th>
              <th className="w-20 border border-black bg-gray-50/50 p-2 text-center text-sm font-bold">
                <div className="text-lg">V</div>
                <div className="text-[10px] leading-tight font-normal lowercase">
                  is it valuable?
                </div>
              </th>
              <th className="w-20 border border-black bg-gray-50/50 p-2 text-center text-sm font-bold">
                <div className="text-lg">R</div>
                <div className="text-[10px] leading-tight font-normal lowercase">is it rare?</div>
              </th>
              <th className="w-20 border border-black bg-gray-50/50 p-2 text-center text-sm font-bold">
                <div className="text-lg">I</div>
                <div className="text-[10px] leading-tight font-normal lowercase">
                  is it hard to imitate?
                </div>
              </th>
              <th className="w-28 border border-black bg-gray-50/50 p-2 text-center text-sm font-bold">
                <div className="text-lg">O</div>
                <div className="text-[10px] leading-tight font-normal">
                  How organized is the company around this?
                </div>
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
                    className="h-full w-full bg-transparent px-4 text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.type}
                    onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                    className="h-full w-full bg-transparent px-4 text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.detail}
                    onChange={(e) => updateItem(item.id, 'detail', e.target.value)}
                    className="h-full w-full bg-transparent px-4 text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.v}
                    onChange={(e) => updateItem(item.id, 'v', e.target.value)}
                    className="h-full w-full bg-transparent text-center text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.r}
                    onChange={(e) => updateItem(item.id, 'r', e.target.value)}
                    className="h-full w-full bg-transparent text-center text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.i}
                    onChange={(e) => updateItem(item.id, 'i', e.target.value)}
                    className="h-full w-full bg-transparent text-center text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.o}
                    onChange={(e) => updateItem(item.id, 'o', e.target.value)}
                    className="h-full w-full bg-transparent text-center text-sm outline-hidden transition-colors focus:bg-blue-50/30"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-hidden rounded-sm border border-black">
        <div className="border-b border-black bg-gray-50 px-4 py-2 text-sm font-bold">Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] w-full translate-z-0 resize-none bg-white p-4 text-sm outline-hidden"
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
        <div className="flex h-56 flex-col items-center border border-gray-200 bg-white p-4 pb-6 text-center">
          <div className="flex flex-1 items-center justify-center">
            <Database size={100} className="text-gray-300" />
          </div>
          <span className="text-sm leading-tight font-bold tracking-tight text-gray-800 uppercase">
            IS IT VALUABLE?
          </span>
        </div>
        <div className="flex h-56 flex-col items-center border border-l-0 border-gray-200 bg-white p-4 pb-6 text-center">
          <div className="flex flex-1 items-center justify-center">
            <Files size={100} className="text-gray-300" />
          </div>
          <span className="text-sm leading-tight font-bold tracking-tight text-gray-800 uppercase">
            IS IT RARE?
          </span>
        </div>
        <div className="flex h-56 flex-col items-center border border-l-0 border-gray-200 bg-white p-4 pb-6 text-center">
          <div className="flex flex-1 items-center justify-center">
            <Network size={100} className="text-gray-300" />
          </div>
          <span className="text-sm leading-tight font-bold tracking-tight text-gray-800 uppercase">
            IS IT DIFFICULT TO IMITATE?
          </span>
        </div>
        <div className="flex h-56 flex-col items-center border border-l-0 border-gray-200 bg-white p-4 pb-6 text-center">
          <div className="flex flex-1 items-center justify-center">
            <Settings2 size={100} className="text-gray-300" />
          </div>
          <span className="px-2 text-center text-sm leading-[1.1] font-bold tracking-tight text-gray-800 uppercase">
            HOW ORGANIZED IS THE COMPANY AROUND THIS
          </span>
        </div>
        <div className="flex h-56 flex-col items-center border border-l-0 border-gray-200 bg-white p-4 pb-6 text-center">
          <div className="flex flex-1 items-center justify-center">
            <FileText size={100} className="text-gray-300" />
          </div>
          <span className="px-4 text-sm leading-tight font-bold tracking-tight text-gray-800 uppercase">
            WHAT IS THE OVERALL RESULT?
          </span>
        </div>
      </div>

      {/* Decision Table */}
      <div className="space-y-4 pt-1">
        {/* Row 1 */}
        <div className="grid h-18 grid-cols-[1fr_1fr_1fr_1fr_1.25fr] overflow-hidden border border-gray-200 bg-gray-50/30">
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-400 bg-white text-2xl font-bold text-red-500">
              ×
            </div>
            <span className="text-lg font-bold text-gray-500">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="flex items-center justify-center border-l border-gray-200 bg-[#FF9B9B] px-6 text-center text-sm leading-tight font-bold">
            Competitive Disadvantage
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid h-18 grid-cols-[1fr_1fr_1fr_1fr_1.25fr] overflow-hidden border border-gray-200 bg-gray-50/30">
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-400 bg-white text-2xl font-bold text-red-500">
              ×
            </div>
            <span className="text-lg font-bold text-gray-500">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="flex items-center justify-center border-l border-gray-200 bg-[#EB9F7D] px-6 text-center text-sm leading-tight font-bold">
            Competitive Parity
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid h-18 grid-cols-[1fr_1fr_1fr_1fr_1.25fr] overflow-hidden border border-gray-200 bg-gray-50/30">
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-400 bg-white text-2xl font-bold text-red-500">
              ×
            </div>
            <span className="text-lg font-bold text-gray-500">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="flex items-center justify-center border-l border-gray-200 bg-[#FFD666] px-6 text-center text-sm leading-tight font-bold">
            Temporary Competitive Advantage
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid h-18 grid-cols-[1fr_1fr_1fr_1fr_1.25fr] overflow-hidden border border-gray-200 bg-gray-50/30">
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 transition-colors focus:bg-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-400 bg-white text-2xl font-bold text-red-500">
              ×
            </div>
            <span className="text-lg font-bold text-gray-500">No</span>
          </div>
          <div className="flex items-center justify-center border-l border-gray-200 bg-[#ADCCD1] px-6 text-center text-sm leading-tight font-bold">
            Unused Competitive Advantage
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid h-18 grid-cols-[1fr_1fr_1fr_1fr_1.25fr] overflow-hidden border border-gray-200 bg-gray-50/30">
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 border-r border-gray-100/50 bg-white/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500 bg-white text-2xl font-bold text-green-500">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-500">Yes</span>
          </div>
          <div className="flex items-center justify-center border-l border-gray-200 bg-[#8EB39F] px-6 text-center text-sm leading-tight font-bold">
            Sustainable Competitive Advantage
          </div>
        </div>
      </div>
    </div>
  );
};

type ForceConfig = {
  title: string;
  color: string;
  textColor: string;
  borderColor: string;
  info: string;
  questions: string[];
  tableHeaders: string[];
  customRows?: string[];
};

export const PortersFiveForces = ({
  data,
  setData,
  activeForce,
  setActiveForce,
}: {
  data: PorterRow[];
  setData: (d: PorterRow[]) => void;
  activeForce: PorterRow['force'];
  setActiveForce: (f: PorterRow['force']) => void;
}) => {
  const forceConfigs: Record<PorterRow['force'], ForceConfig> = {
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
        "Are you well informed about your supplier's product and market? If the market is complicated or hard to understand, you have less bargaining power with your suppliers.",
      ],
      tableHeaders: [
        'List the major inputs needed for your business.',
        'For each input, list possible suppliers.',
        'How can you best work with this supplier to maximize your bargaining power?',
      ],
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
        'Is it difficult for customers to switch from your product to your competitors’ products? If it is relatively easy for your customers to switch, you will have less negotiating power with your customers.',
      ],
      tableHeaders: [
        'List the types of customers that you have or expect to have.',
        'What alternatives might these customers have for your product?',
        'How can you build loyalty for your product or service to reduce customer bargaining power?',
      ],
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
        'Would it be difficult for a new entrant to have enough resources to compete efficiently? For every product, there is a cost-efficient level of production. If challengers can’t achieve that level of production, they won’t be competitive and therefore won’t enter the industry.',
      ],
      tableHeaders: ['Questions to Consider', 'Strategic Response'],
      customRows: [
        'How would a new entrant affect your business?',
        'What will your competitors do if there is a new entrant into your marketplace?',
        'How will you respond to a new competitor?',
      ],
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
        'Are customers loyal to existing products? Even if switching costs are low, customers may have allegiance to a particular brand. If your customers have high brand loyalty to your product you enjoy a weak threat of substitutes.',
      ],
      tableHeaders: [
        'List possible substitutes that your customers could use in place of your product.',
        'How easy would it be for your customer to consider this alternative?',
        'How can you differentiate your products or build customer loyalty to manage the threat of substitutes?',
      ],
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
        'Is it difficult for customers to switch between your product and your competitors’? If customers can easily switch, the market will be more competitive and rivalry is expected to be high as firms vie for each customer’s business.',
      ],
      tableHeaders: [
        'List your major competitors.',
        'What business and growth strategies does this competitor use?',
        'How will this competitor affect your business?',
        'What actions will you take in response to your competitors’ actions?',
      ],
    },
  };

  const currentConfig = forceConfigs[activeForce];
  const currentData = (Array.isArray(data) ? data : []).find((r) => r.force === activeForce) || {
    id: activeForce,
    force: activeForce,
    analysis: '',
    impact: 'Low',
    scorecard: {},
    further: [],
  };

  const updateData = (updatedRow: PorterRow) => {
    const safeData = Array.isArray(data) ? data : [];
    const exists = safeData.some((r) => r.force === activeForce);
    if (exists) {
      setData(safeData.map((r) => (r.force === activeForce ? updatedRow : r)));
    } else {
      setData([...safeData, updatedRow]);
    }
  };

  const updateScorecard = (index: number, val: boolean) => {
    updateData({
      ...currentData,
      scorecard: { ...currentData.scorecard, [index]: val },
    });
  };

  const updateFurther = (rowIndex: number, colKey: string, val: string) => {
    const newFurther = [...currentData.further];
    newFurther[rowIndex] = { ...newFurther[rowIndex], [colKey]: val };
    updateData({ ...currentData, further: newFurther });
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation */}
      <div className="no-print flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-1">
        {Object.entries(forceConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveForce(key as PorterRow['force'])}
            className={cn(
              'cursor-pointer rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all',
              activeForce === key
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                : 'text-gray-400 hover:text-gray-600',
            )}
          >
            {config.title.split('of ').pop()?.split('Among ').pop() || config.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={cn('rounded-2xl border p-6', currentConfig.borderColor, currentConfig.color)}>
        <h3 className={cn('mb-4 text-xl font-black uppercase', currentConfig.textColor)}>
          {currentConfig.title}
        </h3>
        <p className="mb-6 text-sm text-gray-600">{currentConfig.info}</p>
        
        {/* Analysis textarea */}
        <textarea
          value={currentData.analysis}
          onChange={(e) => updateData({ ...currentData, analysis: e.target.value })}
          className="mb-6 h-24 w-full rounded-xl border border-gray-200 bg-white p-4 text-sm"
          placeholder="Enter your analysis here..."
        />

        {/* Scorecard table */}
        <div className="space-y-3 mb-6">
          {currentConfig.questions.map((q, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_auto] items-center gap-6 p-4 bg-white/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                <span className="text-gray-300 mr-3">{idx + 1}.</span>
                {q}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => updateScorecard(idx, true)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 cursor-pointer",
                    currentData.scorecard[idx] === true 
                      ? "bg-green-600 border-green-600 text-white shadow-sm" 
                      : "bg-white border-gray-200 text-gray-400 hover:border-green-500 hover:text-green-600"
                  )}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateScorecard(idx, false)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 cursor-pointer",
                    currentData.scorecard[idx] === false 
                      ? "bg-red-600 border-red-600 text-white shadow-sm" 
                      : "bg-white border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-600"
                  )}
                >
                  No
                </button>
              </div>
            </div>
          ))}
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
                {[0, 1, 2, 3, 4].map((idx) => (
                  <tr key={idx} className="group h-32">
                    {(['col1', 'col2', 'col3', 'col4'] as const).slice(0, currentConfig.tableHeaders.length).map((col, cIdx) => (
                      <td key={col} className="p-0 border-r-2 border-black last:border-0 relative">
                        <textarea
                          value={(currentData.further[idx] as any)?.[col] || ''}
                          onChange={(e) => updateFurther(idx, col, e.target.value)}
                          className="w-full h-full p-6 pt-8 text-xs font-semibold bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                          placeholder={cIdx === 0 ? "Identify..." : "Analysis..."}
                        />
                        {cIdx === 0 && <span className="absolute top-2 left-3 text-[10px] font-black text-gray-200 uppercase group-hover:text-gray-400 transition-colors">#{idx + 1}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
