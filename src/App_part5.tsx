        )}
      >
        <FileText size={18} /> VRIO Framework
      </button>
      {/* TOWS/Confrontation Matrix */}
      <button
        onClick={() => setActiveTab("TOWS")}
        className={cn(
        "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
        activeTab === "TOWS"
          ? "bg-yellow-200 text-gray-900 shadow-md"
          : "bg-transparent text-gray-500 hover:text-gray-800",
        )}
      >
        <Network size={18} /> Confrontation Matrix
      </button>
      {/* Porter's */}
      <button
        onClick={() => setActiveTab("PORTER")}
        className={cn(
        "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
        activeTab === "PORTER"
          ? "bg-[#4f39f6] text-white shadow-md"
          : "bg-transparent text-gray-500 hover:text-gray-800",
        )}
      >
        <Files size={18} /> Porter's 5 Forces
      </button>
      </div>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white relative">
      <div className="max-w-6xl mx-auto">
      {/* Header with Title and Metadata */}
      <div
        ref={containerRef}
        className="worksheet-container relative overflow-hidden bg-white"
      >
        <CorporateHeader
        meta={meta}
        setMeta={setMeta}
        selectedGroup={selectedGroup}
        hideMeta={false}
        participants={activeParticipants}
        totalSiteUsers={totalSiteUsers}
        />

        {activeTab === "TOWS" && <ConfrontationMatrixGuide />}
        <div className="mb-12">
        <div className="flex items-end justify-between border-b-2 border-gray-50 pb-6">
          <h2
          className={cn(
            "text-4xl font-black uppercase tracking-tighter text-gray-900 inline-block",
            activeTab === "VRIO"
            ? "border-b-[12px] border-black pb-2"
            : activeTab === "TOWS"
              ? "border-b-[12px] border-[#FFD666] pb-2"
              : activeTab === "PORTER"
              ? "border-b-[12px] border-indigo-600 pb-2"
              : "",
          )}
          >
          {activeTab === "PESTEL"
            ? "PESTEL Analysis"
            : activeTab === "McKinsey"
            ? "McKinsey 7-S Framework"
            : activeTab === "VRIO"
              ? "VRIO Framework"
              : activeTab === "TOWS"
              ? "Confrontation Matrix"
              : "Porter's Five Forces"}
          </h2>
          <div className="text-[10px] font-mono text-gray-400 font-bold tracking-widest bg-gray-50 px-3 py-1 rounded-full">
          FRAMEWORK_ID:{" "}
          {activeTab === "PESTEL"
            ? "ENV_MACRO_01"
            : activeTab === "McKinsey"
            ? "ORG_ALIG_02"
            : activeTab === "VRIO"
              ? "COMP_ADV_03"
              : activeTab === "TOWS"
              ? "STRAT_MAT_04"
              : "IND_COMP_05"}
          </div>
        </div>
        </div>

        <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {activeTab === "PESTEL" ? (
          <PESTELWorksheet
            data={pestelData}
            setData={handlePestelUpdate}
          />
          ) : activeTab === "McKinsey" ? (
          <McKinseyWorksheet
            data={mckinseyData}
            setData={handleMcKinseyUpdate}
          />
          ) : activeTab === "VRIO" ? (
          <div className="space-y-12">
            <VRIOFramework />
            <VRIOAnalysisTable
            data={vrioAnalysisData}
            setData={handleVrioUpdate}
            notes={vrioNotes}
            setNotes={setVrioNotes}
            />{" "}
          </div>
          ) : activeTab === "TOWS" ? (
          <div className="space-y-12">
            <TOWSWorksheet
            data={towsData}
            setData={handleTowsUpdate}
            meta={meta}
            setMeta={handleMetaUpdate}
            />
          </div>
          ) : (
          <PortersFiveForces
            data={portersData}
            setData={handlePortersUpdate}
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

    {/* Hidden container for full report generation */}
    <div
    id="full-report-print-container"
    className="hidden"
    aria-hidden="true"
    >
    <div className="print-section bg-white p-12 w-[297mm]">
      <CorporateHeader
      meta={meta}
      setMeta={setMeta}
      selectedGroup={selectedGroup}
      />
      <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">
      PESTEL Analysis
      </h2>
      <PESTELWorksheet data={pestelData} setData={() => {}} />
    </div>
    <div className="print-section bg-white p-12 w-[297mm]">
      <CorporateHeader
      meta={meta}
      setMeta={setMeta}
      selectedGroup={selectedGroup}
      />
      <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">
      McKinsey 7-S Framework
      </h2>
      <McKinseyWorksheet data={mckinseyData} setData={() => {}} />
    </div>
    <div className="print-section bg-white p-12 w-[297mm]">
      <CorporateHeader
      meta={meta}
      setMeta={setMeta}
      selectedGroup={selectedGroup}
      />
      <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">
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
    {(
      [
      "suppliers",
      "buyers",
      "newEntrants",
      "substitutes",
      "rivalry",
      ] as const
    ).map((force) => (
      <div key={force} className="print-section bg-white p-12 w-[297mm]">
      <CorporateHeader
        meta={meta}
        setMeta={setMeta}
        selectedGroup={selectedGroup}
      />
      <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-indigo-600 pb-2 mb-8">
        Porter's 5 Forces: {force.toUpperCase()}
      </h2>
      <PortersFiveForces
        data={portersData}
        setData={() => {}}
        activeForce={force}
        setActiveForce={() => {}}
      />
      </div>
    ))}
    <div className="print-section bg-white p-12 w-[297mm]">
      <ConfrontationMatrixGuide />
      <div className="mt-8">
      <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-[12px] border-[#FFD666] pb-2 mb-8">
        Confrontation Matrix
      </h2>
      <TOWSWorksheet
        data={towsData}
        setData={() => {}}
        meta={meta}
        setMeta={() => {}}
      />
      </div>
    </div>
    </div>
  </div>
  );
}

const MatrixCell = React.memo(
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
      "border border-gray-400 h-[100px] flex flex-col transition-all duration-300 shadow-sm hover:shadow-md",
      getBgColor(score),
    )}
    >
    {/* Top Section: Dropdown with Custom Styling */}
    <div className="border-b border-gray-400/30 p-1 relative group/cell">
      <div className="relative">
      <select
        value={score}
        onChange={(e) => onScoreChange(e.target.value)}
        className={cn(
        "w-full bg-white/40 hover:bg-white/60 transition-colors font-black text-[10px] uppercase tracking-tighter outline-none cursor-pointer py-1.5 pl-2 pr-6 appearance-none border border-black/5 rounded-md",
        getTextColor(score),
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
  },
);

const TOWSWorksheet = ({
  data,
  setData,
  meta,
  setMeta,
}: {
  data: TOWSMatrixData;
  setData: (d: TOWSMatrixData) => void;
  meta: MetaData;
  setMeta: (m: MetaData) => void;
}) => {
  const updateList = (
  type: "opportunities" | "threats" | "strengths" | "weaknesses",
  index: number,
  value: string,
  ) => {
  const newList = [...data[type]];
  newList[index] = value;
  setData({ ...data, [type]: newList });
  };

  const updateScore = (
  rowType: "strengths" | "weaknesses",
  rowIndex: number,
  colType: "opportunities" | "threats",
  colIndex: number,
  value: string,
  ) => {
  let finalValue: number = parseInt(value);
  if (isNaN(finalValue)) finalValue = 0;

  setData({
    ...data,
    scores: {
    ...data.scores,
    [`${rowType}-${rowIndex}-${colType}-${colIndex}`]: finalValue,
    },
  });
  };

  const updateNote = (
  rowType: "strengths" | "weaknesses",
  rowIndex: number,
  colType: "opportunities" | "threats",
  colIndex: number,
  value: string,
  ) => {
  setData({
    ...data,
    notes: {
    ...data.notes,
    [`${rowType}-${rowIndex}-${colType}-${colIndex}`]: value,
    },
  });
  };

  const getScore = (
  rowType: "strengths" | "weaknesses",
  rowIndex: number,
  colType: "opportunities" | "threats",
  colIndex: number,
  ) => {
  return data.scores[`${rowType}-${rowIndex}-${colType}-${colIndex}`] ?? 0;
  };

  const getNote = (
  rowType: "strengths" | "weaknesses",
  rowIndex: number,
  colType: "opportunities" | "threats",
  colIndex: number,
  ) => {
  return data.notes[`${rowType}-${rowIndex}-${colType}-${colIndex}`] ?? "";
  };

  const getScoreNumber = (
  rowType: "strengths" | "weaknesses",
  rowIndex: number,
  colType: "opportunities" | "threats",
  colIndex: number,
  ) => {
  const val = getScore(rowType, rowIndex, colType, colIndex);
  const num = parseInt(String(val));
  return isNaN(num) ? 0 : num;
  };

  const getRowTotal = (
  rowType: "strengths" | "weaknesses",
  rowIndex: number,
  ) => {
  let total = 0;
  ["opportunities", "threats"].forEach((colType) => {
    for (let i = 0; i < 3; i++) {
    total += getScoreNumber(rowType, rowIndex, colType as any, i);
    }
  });
  return total;
  };

  const getColTotal = (
  colType: "opportunities" | "threats",
  colIndex: number,
  ) => {
  let total = 0;
  ["strengths", "weaknesses"].forEach((rowType) => {
    for (let i = 0; i < 3; i++) {
    total += getScoreNumber(rowType as any, i, colType, colIndex);
    }
  });
  return total;
  };

  const getBgColor = (scoreValue: string | number) => {
  const score = parseInt(String(scoreValue));
  if (isNaN(score)) return "bg-white";
  if (score >= 1) return "bg-[#C6E0B4]"; // Green
  if (score === 0) return "bg-[#FFF2CC]"; // Beige/Yellow
  if (score <= -1) return "bg-[#F4B084]"; // Red/Orange
  return "bg-white";
  };

  const getTextColor = (scoreValue: string | number) => {
  const score = parseInt(String(scoreValue));
  if (isNaN(score)) return "text-gray-700";
  if (score > 0) return "text-[#385623]";
  if (score < 0) return "text-[#843C0C]";
  return "text-gray-700";
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
      {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="border-r border-black last:border-r-0 p-2 flex items-center justify-center"
      >
        <textarea
        value={data.opportunities[i]}
        onChange={(e) => updateList("opportunities", i, e.target.value)}
        className="w-full h-full text-[12px] leading-tight text-center font-bold bg-transparent outline-none resize-none flex items-center justify-center p-1"
        placeholder="..."
        />
      </div>
      ))}
    </div>
    <div /> {/* Gap col */}
    <div className="grid grid-cols-3 border border-black h-36 bg-[#D9D9D9] mx-1">
      {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="border-r border-black last:border-r-0 p-2 flex items-center justify-center"
      >
        <textarea
        value={data.threats[i]}
        onChange={(e) => updateList("threats", i, e.target.value)}
        className="w-full h-full text-[12px] leading-tight text-center font-bold bg-transparent outline-none resize-none flex items-center justify-center p-1"
        placeholder="..."
        />
      </div>
      ))}
    </div>
    <div className="flex items-end justify-center pb-2">
      <span className="font-bold text-xs uppercase tracking-widest text-[#595959] vertical-text">
      Total
      </span>
    </div>
    {/* ROW 3: Strengths Label & Matrix */}
    <div className="bg-black text-[#FFD666] flex items-center justify-center font-bold text-2xl uppercase vertical-text mt-2 mx-1 border border-black">
      Strengths
    </div>
    <div className="flex flex-col bg-[#D9D9D9] mt-2 border-y border-l border-black">
      {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-[100px] border-b border-black last:border-b-0 p-2 flex items-center justify-center text-center"
      >
        <textarea
        value={data.strengths[i]}
        onChange={(e) => updateList("strengths", i, e.target.value)}
        className="w-full h-full text-[12px] font-bold bg-transparent outline-none resize-none text-center flex items-center justify-center p-1"
        placeholder="..."
        />
      </div>
      ))}
    </div>
    <div className="grid grid-cols-3 mt-2 border border-black mx-1">
      {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <MatrixCell
        key={`s-o-${r}-${c}`}
        score={getScore("strengths", r, "opportunities", c)}
        note={getNote("strengths", r, "opportunities", c)}
        onScoreChange={(val) =>
          updateScore("strengths", r, "opportunities", c, val)
        }
        onNoteChange={(val) =>
          updateNote("strengths", r, "opportunities", c, val)
        }
        getBgColor={getBgColor}
        getTextColor={getTextColor}
        />
      )),
      )}
    </div>
    <div /> {/* Gap col */}
    <div className="grid grid-cols-3 mt-2 border border-black mx-1">
      {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <MatrixCell
        key={`s-t-${r}-${c}`}
        score={getScore("strengths", r, "threats", c)}
        note={getNote("strengths", r, "threats", c)}
        onScoreChange={(val) =>
          updateScore("strengths", r, "threats", c, val)
        }
        onNoteChange={(val) =>
          updateNote("strengths", r, "threats", c, val)
        }
        getBgColor={getBgColor}
        getTextColor={getTextColor}
        />
      )),
      )}
    </div>
    <div className="flex flex-col bg-[#C6E0B4]/60 mt-2 border border-black ml-1">
      {[0, 1, 2].map((i) => {
      const total = getRowTotal("strengths", i);
      return (
        <div
        key={i}
        className={cn(
          "h-[100px] flex items-center justify-center font-bold text-xl border-b border-black last:border-0",
          getTextColor(total),
          total > 0
          ? "bg-[#C6E0B4]"
          : total < 0
            ? "bg-[#F4B084]"
            : "bg-[#FFF2CC]",
        )}
        >
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
      {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-[100px] border-b border-black last:border-b-0 p-2 flex items-center justify-center text-center"
      >
        <textarea
        value={data.weaknesses[i]}
        onChange={(e) => updateList("weaknesses", i, e.target.value)}
        className="w-full h-full text-[12px] font-bold bg-transparent outline-none resize-none text-center flex items-center justify-center p-1"
        placeholder="..."
        />
      </div>
      ))}
    </div>
    <div className="grid grid-cols-3 border border-black mx-1">
      {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <MatrixCell
        key={`w-o-${r}-${c}`}
        score={getScore("weaknesses", r, "opportunities", c)}
        note={getNote("weaknesses", r, "opportunities", c)}
        onScoreChange={(val) =>
          updateScore("weaknesses", r, "opportunities", c, val)
        }
        onNoteChange={(val) =>
          updateNote("weaknesses", r, "opportunities", c, val)
        }
        getBgColor={getBgColor}
        getTextColor={getTextColor}
        />
      )),
      )}
    </div>
    <div /> {/* Gap col */}
    <div className="grid grid-cols-3 border border-black mx-1">
      {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <MatrixCell
        key={`w-t-${r}-${c}`}
        score={getScore("weaknesses", r, "threats", c)}
        note={getNote("weaknesses", r, "threats", c)}
        onScoreChange={(val) =>
          updateScore("weaknesses", r, "threats", c, val)
        }
        onNoteChange={(val) =>
          updateNote("weaknesses", r, "threats", c, val)
        }
        getBgColor={getBgColor}
        getTextColor={getTextColor}
        />
      )),
      )}
    </div>
    <div className="flex flex-col bg-[#FCE4D6] border border-black ml-1">
      {[0, 1, 2].map((i) => {
      const total = getRowTotal("weaknesses", i);
      return (
        <div
        key={i}
        className={cn(
          "h-[100px] flex items-center justify-center font-bold text-xl border-b border-black last:border-0",
          getTextColor(total),
          total > 0
          ? "bg-[#C6E0B4]"
          : total < 0
            ? "bg-[#F4B084]"
            : "bg-[#FFF2CC]",
        )}
        >
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
      {[0, 1, 2].map((i) => {
      const total = getColTotal("opportunities", i);
      return (
        <div
        key={i}
        className={cn(
          "h-[100px] flex items-center justify-center font-bold text-xl border-r border-black last:border-r-0",
          getTextColor(total),
          total > 0
          ? "bg-[#C6E0B4]"
          : total < 0
            ? "bg-[#F4B084]"
            : "bg-[#FFF2CC]",
        )}
        >
        {total}
        </div>
      );
      })}
    </div>
    <div /> {/* Gap col */}
    <div className="grid grid-cols-3 mt-4 mx-1 border border-black bg-[#FCE4D6]/40">
      {[0, 1, 2].map((i) => {
      const total = getColTotal("threats", i);
      return (
        <div
        key={i}
        className={cn(
          "h-[100px] flex items-center justify-center font-bold text-xl border-r border-black last:border-r-0",
          getTextColor(total),
          total > 0
          ? "bg-[#C6E0B4]"
          : total < 0
            ? "bg-[#F4B084]"
            : "bg-[#FFF2CC]",
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
    <div className="mt-12 flex gap-12 items-start">
    <div className="flex flex-col w-64 border border-black text-xs font-bold shadow-sm">
      <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#F4B084]">
      <span className="p-2 px-4 text-red-900 italic text-shadow-sm">
        Negative / Very Negative
      </span>
      <span className="p-2 text-center border-l border-black">
        -1 / -2
      </span>
      </div>
      <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#FFF2CC]">
      <span className="p-2 px-4 text-yellow-800">Neutral</span>
      <span className="p-2 text-center border-l border-black">0</span>
      </div>
      <div className="grid grid-cols-[1fr_60px] bg-[#C6E0B4]">
      <span className="p-2 px-4 text-green-900 italic">
        Positive / Very Positive
      </span>
      <span className="p-2 text-center border-l border-black">
        +1 / +2
      </span>
      </div>
    </div>
    </div>
  </div>
  );
};

const VRIOAnalysisTable = ({
  data,
  setData,
  notes,
  setNotes,
}: {
  data: VRIOAnalysisData[];
  setData: (d: VRIOAnalysisData[]) => void;
  notes: string;
  setNotes: (n: string) => void;
}) => {
  const updateItem = (
  id: string,
  field: keyof VRIOAnalysisData,
  value: string,
  ) => {
  setData(
    data.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
  );
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
        <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50">
        Resources
        </th>
        <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50">
        Type
        </th>
        <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50 w-1/4">
        Detail
        </th>
        <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
        <div className="text-lg">V</div>
        <div className="text-[10px] font-normal leading-tight lowercase">
          is it valuable?
        </div>
        </th>
        <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
        <div className="text-lg">R</div>
        <div className="text-[10px] font-normal leading-tight lowercase">
          is it rare?
        </div>
        </th>
        <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
        <div className="text-lg">I</div>
        <div className="text-[10px] font-normal leading-tight lowercase">
          is it hard to imitate?
        </div>
        </th>
        <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-28">
        <div className="text-lg">O</div>
        <div className="text-[10px] font-normal leading-tight">
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
          onChange={(e) =>
            updateItem(item.id, "resource", e.target.value)
          }
          className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        <td className="border border-black p-0">
          <input
          type="text"
          value={item.type}
          onChange={(e) =>
            updateItem(item.id, "type", e.target.value)
          }
          className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        <td className="border border-black p-0">
          <input
          type="text"
          value={item.detail}
          onChange={(e) =>
            updateItem(item.id, "detail", e.target.value)
          }
          className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        <td className="border border-black p-0">
          <input
          type="text"
          value={item.v}
          onChange={(e) => updateItem(item.id, "v", e.target.value)}
          className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        <td className="border border-black p-0">
          <input
          type="text"
          value={item.r}
          onChange={(e) => updateItem(item.id, "r", e.target.value)}
          className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        <td className="border border-black p-0">
          <input
          type="text"
          value={item.i}
          onChange={(e) => updateItem(item.id, "i", e.target.value)}
          className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        <td className="border border-black p-0">
          <input
          type="text"
          value={item.o}
          onChange={(e) => updateItem(item.id, "o", e.target.value)}
          className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
          />
        </td>
        </tr>
      ))}
      </tbody>
    </table>
    </div>
    <div className="border border-black rounded-sm overflow-hidden">
    <div className="bg-gray-50 border-b border-black px-4 py-2 text-sm font-bold">
      Notes
    </div>
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
const VRIOFramework = () => {
  return (
  <div className="space-y-4">
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] gap-0">
    <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center">
      <div className="flex-1 flex items-center justify-center">
      <Database size={100} className="text-gray-300" />
      </div>
      <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight">
      IS IT VALUABLE?
      </span>
    </div>
    <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
      <div className="flex-1 flex items-center justify-center">
      <Files size={100} className="text-gray-300" />
      </div>
      <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight">
      IS IT RARE?
      </span>
    </div>
    <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
      <div className="flex-1 flex items-center justify-center">
      <Network size={100} className="text-gray-300" />
      </div>
      <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight">
      IS IT DIFFICULT TO IMITATE?
      </span>
    </div>
    <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
      <div className="flex-1 flex items-center justify-center">
      <Settings2 size={100} className="text-gray-300" />
      </div>
      <span className="text-sm font-bold uppercase tracking-tight text-center leading-[1.1] text-gray-800 px-2">
      HOW ORGANIZED IS THE COMPANY AROUND THIS
      </span>
    </div>
    <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-56 bg-white text-center border-l-0">
      <div className="flex-1 flex items-center justify-center">
      <FileText size={100} className="text-gray-300" />
      </div>
      <span className="text-sm font-bold uppercase tracking-tight text-gray-800 leading-tight px-4">
      WHAT IS THE OVERALL RESULT?
      </span>
    </div>
    </div>

    {/* Decision Table */}
    <div className="space-y-4 pt-1">
    {/* Row 1 */}
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
      <div className="flex items-center justify-center gap-4 bg-white/80">
      <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">
        ×
      </div>
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
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80">
      <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">
        ×
      </div>
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
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80">
      <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">
        ×
      </div>
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
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 focus:bg-white transition-colors">
      <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">
        ×
      </div>
      <span className="text-gray-500 font-bold text-lg">No</span>
      </div>
      <div className="bg-[#ADCCD1] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
      Unused Competitive Advantage
      </div>
    </div>

    {/* Row 5 */}
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
      <span className="text-gray-500 font-bold text-lg">Yes</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
      <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">
        ✓
      </div>
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

const PortersFiveForces = ({
  data,
  setData,
  activeForce,
  setActiveForce,
}: {
  data: PortersFiveForcesData;
  setData: (d: PortersFiveForcesData) => void;
  activeForce: keyof PortersFiveForcesData;
  setActiveForce: (f: keyof PortersFiveForcesData) => void;
}) => {
  const forceConfigs = {
  suppliers: {
    title: "Bargaining Power of Suppliers",
    color: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    info: "This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.",
    questions: [
    "Are there a large number of potential input suppliers? The greater number of suppliers of your needed inputs, the more control you will have.",
    "Are the products that you need to purchase for your business ordinary? You have more control when the products you need from a supplier are not unique.",
    "Do your purchases from suppliers represent a large portion of their business? If your purchases are a relatively large portion of your supplier’s business, you will have more power to lower costs or improve product features.",
    "Would it be difficult for your suppliers to enter your business, sell directly to your customers, and become your direct competitor? The easier it is to start a new business, the more likely it is that you will have competitors.",
    "Can you easily switch to substitute products from other suppliers? If it is relatively easy to switch to substitute products, you will have more negotiating room with your suppliers.",
    "Are you well informed about your supplier's product and market? If the market is complicated or hard to understand, you have less bargaining power with your suppliers.",
    ],
    tableHeaders: [
    "List the major inputs needed for your business.",
    "For each input, list possible suppliers.",
    "How can you best work with this supplier to maximize your bargaining power?",
    ],
  },
  buyers: {
    title: "Bargaining Power of Buyers",
    color: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    info: "This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.",
    questions: [
    "Do you have enough customers such that losing one isn’t critical to your success? The smaller the number of customers, the more dependent you are on each one of them.",
    "Does your product represent a small expense for your customers? If your product is a relatively large expense for your customers, they’ll expend more effort negotiating with you to lower price or improve product features.",
    "Are customers uninformed about your product and market? If your market is complicated or hard to understand, buyers have less control.",
    "Is your product unique? If your product is homogenous or the same as your competitors’, buyers have more bargaining power.",
    "Would it be difficult for buyers to integrate backward in the supply chain, purchase a competitor providing the products you provide, and compete directly with you? The less likely a customer will enter your industry, the more bargaining power you have.",
    "Is it difficult for customers to switch from your product to your competitors’ products? If it is relatively easy for your customers to switch, you will have less negotiating power with your customers.",
    ],
    tableHeaders: [
    "List the types of customers that you have or expect to have.",
    "What alternatives might these customers have for your product?",
    "How can you build loyalty for your product or service to reduce customer bargaining power?",
    ],
  },
  newEntrants: {
    title: "Threat of New Entrants",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    info: "This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.",
    questions: [
    "Do you have a unique process that has been protected? For example, if you are a technology-based company with patent protection for your research investments, you enjoy some barriers to entry.",
    "Are customers loyal to your brand? If your customers are loyal to your brand, a new product, even if identical, would face a formidable battle to win over loyal customers.",
    "Are there high start-up costs for your business? The greater the capital requirements, the lower the threat of new competition.",
    "Are the assets needed to run your business unique? Others will be more reluctant to enter the market if the technology or equipment cannot be converted into other uses if the venture fails.",
    "Is there a process or procedure critical to your business? The more difficult it is to learn the business, the greater the entry barrier.",
    "Will a new competitor have difficulty acquiring/obtaining needed inputs? Current distribution channels may make it difficult for a new business to acquire/obtain inputs as readily as existing businesses.",
    "Will a new competitor have any difficulty acquiring/obtaining customers? If current distribution channels make it difficult for a new business to acquire/obtain new customers, you will enjoy a barrier to entry.",
    "Would it be difficult for a new entrant to have enough resources to compete efficiently? For every product, there is a cost-efficient level of production. If challengers can’t achieve that level of production, they won’t be competitive and therefore won’t enter the industry.",
    ],
    tableHeaders: ["Questions to Consider", "Strategic Response"],
    customRows: [
    "How would a new entrant affect your business?",
    "What will your competitors do if there is a new entrant into your marketplace?",
    "How will you respond to a new competitor?",
    ],
  },
  substitutes: {
    title: "Threat of Substitutes",
    color: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    info: "This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.",
    questions: [
    "Does your product compare favorably to possible substitutes? If another product offers more features or benefits to customers, or if their price is lower, customers may decide that the other product is a better value.",
    "Is it costly for your customers to switch to another product? When customers experience a loss of productivity if they switch to another product, the threat of substitutes is weaker.",
    "Are customers loyal to existing products? Even if switching costs are low, customers may have allegiance to a particular brand. If your customers have high brand loyalty to your product you enjoy a weak threat of substitutes.",
    ],
    tableHeaders: [
    "List possible substitutes that your customers could use in place of your product.",
    "How easy would it be for your customer to consider this alternative?",
    "How can you differentiate your products or build customer loyalty to manage the threat of substitutes?",
    ],
  },
  rivalry: {
    title: "Rivalry Among Competitors",
    color: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    info: "This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.",
    questions: [
    "Is there a small number of competitors? Often the greater the number of players, the more intense the rivalry. However, rivalry can occasionally be intense when one or more firms are vying for market leader positions.",
    "Is there a clear leader in your market? Rivalry intensifies if companies have similar shares of the market, leading to a struggle for market leadership.",
    "Is your market growing? In a growing market, firms are able to grow revenues simply because of the expanding market. In a stagnant or declining market, companies often fight intensely for a smaller and smaller market.",
    "Do you have low fixed costs? With high fixed costs, companies must sell more products to cover these high costs.",
    "Can you store your product to sell at the best times? High storage costs or perishable products result in a situation where firms must sell product as soon as possible, increasing rivalry among firms.",
    "Are your competitors pursuing a low growth strategy? You will have more intense rivalries if your competitors are more aggressive. In contrast, if your competitors are following a strategy of milking profits in a mature market, you will enjoy less rivalry.",
    "Is your product unique? Firms that produce products that are very similar will compete mostly on price, so rivalry is expected to be high.",
    "Is it easy for competitors to abandon their product? If exit costs are high, a company may remain in business even if it is not profitable.",
    "Is it difficult for customers to switch between your product and your competitors’? If customers can easily switch, the market will be more competitive and rivalry is expected to be high as firms vie for each customer’s business.",
    ],
    tableHeaders: [
    "List your major competitors.",
    "What business and growth strategies does this competitor use?",
    "How will this competitor affect your business?",
    "What actions will you take in response to your competitors’ actions?",
    ],
  },
  };

  const currentConfig = forceConfigs[activeForce];
  const currentData = data[activeForce];

  const updateScorecard = (index: number, val: boolean) => {
  setData({
    ...data,
    [activeForce]: {
    ...currentData,
    scorecard: { ...currentData.scorecard, [index]: val },
    },
  });
  };

  const updateFurther = (rowIndex: number, colKey: string, val: string) => {
  const newFurther = [...currentData.further];
  newFurther[rowIndex] = { ...newFurther[rowIndex], [colKey]: val };
  setData({
    ...data,
    [activeForce]: { ...currentData, further: newFurther },
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
        : "text-gray-400 hover:text-gray-600",
      )}
      >
      {config.title.split("of ").pop()?.split("Among ").pop() ||
        config.title}
      </button>
    ))}
    </div>

    <div
    className={cn(
      "p-12 rounded-[40px] border shadow-2xl space-y-12 transition-all",
      currentConfig.color,
      currentConfig.borderColor,
    )}
    >
    {/* Header */}
    <div className="flex flex-col gap-2">
      <h2
      className={cn(
        "text-3xl font-black uppercase italic tracking-tighter",
        currentConfig.textColor,
      )}
      >
      {currentConfig.title}
      </h2>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
      Strategic Assessment Worksheet
      </p>
    </div>

    {/* Self Assessment Scorecard */}
    <div className="space-y-6">
      <div className="flex items-center gap-4">
      <h3 className="text-lg font-black uppercase italic text-gray-900">
        Self Assessment Scorecard
      </h3>
      <div className="h-px flex-1 bg-gray-100" />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed italic border-l-4 border-gray-200 pl-4">
      {(currentConfig as any).info}
      </p>
      <div className="space-y-2">
      {currentConfig.questions.map((q, idx) => (
        <div
        key={idx}
        className="flex items-center gap-6 p-3 bg-white/40 rounded-xl border border-white/60 hover:bg-white/80 transition-all group"
        >
        <div className="flex gap-2">
          <button
          onClick={() => updateScorecard(idx, true)}
          className={cn(
            "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border-2 cursor-pointer",
            currentData.scorecard[idx] === true
            ? "bg-green-600 border-green-600 text-white shadow-sm"
            : "bg-white border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-600",
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
            : "bg-white border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-600",
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
      <h3 className="text-lg font-black uppercase italic text-gray-900">
        Further Assessment
      </h3>
      <div className="h-px flex-1 bg-gray-100" />
      </div>
      <div className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-lg">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b-2 border-black">
        <tr>
          {currentConfig.tableHeaders.map((h, i) => (
          <th
            key={i}
            className="p-4 text-[10px] font-black uppercase tracking-[0.1em] text-gray-900 border-r-2 border-black last:border-0 text-center leading-tight"
          >
            {h}
          </th>
          ))}
        </tr>
        </thead>
        <tbody className="divide-y-2 divide-black">
        {activeForce === "newEntrants" && "customRows" in currentConfig
          ? (currentConfig as any).customRows.map(
            (q: string, idx: number) => (
            <tr key={idx} className="group">
              <td className="p-6 text-[11px] font-black text-gray-900 w-1/3 bg-gray-50 border-r-2 border-black uppercase tracking-tight leading-tight italic">
              {q}
              </td>
              <td className="p-0">
              <textarea
                value={currentData.further[idx]?.col2 || ""}
                onChange={(e) =>
                updateFurther(idx, "col2", e.target.value)
                }
                className="w-full h-32 p-6 text-sm font-medium bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                placeholder="Analysis and strategic response..."
              />
              </td>
            </tr>
            ),
          )
          : currentData.further.map((row, idx) => (
            <tr key={idx} className="group h-32">
            {["col1", "col2", "col3", "col4"]
              .slice(0, currentConfig.tableHeaders.length)
              .map((col, cIdx) => (
              <td
                key={col}
                className="p-0 border-r-2 border-black last:border-0 relative"
              >
                <textarea
                value={(row as any)[col] || ""}
                onChange={(e) =>
                  updateFurther(idx, col, e.target.value)
                }
                className="w-full h-full p-6 pt-8 text-xs font-semibold bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                placeholder={
                  cIdx === 0 ? "Identify..." : "Analysis..."
                }
                />
                {cIdx === 0 && (
                <span className="absolute top-2 left-3 text-[10px] font-black text-gray-200 uppercase group-hover:text-gray-400 transition-colors">
                  #{idx + 1}
                </span>
                )}
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
