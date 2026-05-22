  data,
  setData,
}: {
  data: PESTELData[];
  setData: (d: PESTELData[]) => void;
}) => {
  const categories = [
  "Political",
  "Economic",
  "Social",
  "Technological",
  "Environmental",
  "Legal",
  ] as const;

  const updateItem = (id: string, field: keyof PESTELData, value: string) => {
  setData(
    data.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
  );
  };

  return (
  <div className="overflow-x-auto w-full">
    <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black text-xs md:text-sm">
    <thead>
      <tr className="bg-brand-blue text-black">
      <th className="w-20 md:w-32 border border-black p-2 md:p-4 bg-white"></th>
      <th className="border border-black p-2 md:p-4 text-center font-bold text-base w-full">
        Description
      </th>
      <th className="w-20 md:w-32 border border-black p-2 md:p-4 text-center font-bold">
        Impact
      </th>
      <th className="w-20 md:w-32 border border-black p-2 md:p-4 text-center font-bold">
        Probability
      </th>
      <th className="w-32 md:w-64 border border-black p-2 md:p-4 text-center font-bold leading-tight">
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
        description: "",
        impact: "",
        probability: "",
        potential: "",
      };

      return (
        <tr key={cat} className="group">
        <td className="border border-black p-2 md:p-4 font-bold text-center bg-gray-50 align-middle">
          {cat}
        </td>
        <td className="border border-black p-0 relative">
          <textarea
          value={item.description}
          onChange={(e) =>
            updateItem(item.id, "description", e.target.value)
          }
          className="w-full h-32 md:h-40 p-2 md:p-4 bg-transparent outline-none resize-none relative z-10 text-xs md:text-sm leading-tight whitespace-pre-wrap"
          placeholder={`Enter ${cat.toLowerCase()} factors...`}
          />
        </td>
        <td className="border border-black p-0">
          <textarea
          value={item.impact}
          onChange={(e) =>
            updateItem(item.id, "impact", e.target.value)
          }
          className="w-full h-32 md:h-40 p-1 md:p-2 text-center outline-hidden resize-none bg-transparent"
          />
        </td>
        <td className="border border-black p-0">
          <textarea
          value={item.probability}
          onChange={(e) =>
            updateItem(item.id, "probability", e.target.value)
          }
          className="w-full h-32 md:h-40 p-1 md:p-2 text-center outline-hidden resize-none bg-transparent"
          />
        </td>
        <td className="border border-black p-0">
          <textarea
          value={item.potential}
          onChange={(e) =>
            updateItem(item.id, "potential", e.target.value)
          }
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

const McKinseyWorksheet = ({
  data,
  setData,
}: {
  data: McKinsey7SData;
  setData: (d: McKinsey7SData) => void;
}) => {
  const elements = [
  { key: "sharedValues", label: "Shared Values" },
  { key: "strategy", label: "Strategy" },
  { key: "structure", label: "Structure" },
  { key: "systems", label: "Systems" },
  { key: "style", label: "Style" },
  { key: "staff", label: "Staff" },
  { key: "skills", label: "Skills" },
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
  <div className="overflow-x-auto w-full">
    <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black table-auto">
    <thead>
      <tr className="bg-brand-peach">
      <th className="w-24 md:w-40 border border-black p-2 md:p-4 bg-white"></th>
      {elements.map((el) => (
        <th
        key={el.key}
        className="border border-black p-2 md:p-4 text-center font-bold text-[8px] md:text-[10px] uppercase tracking-tight w-16 md:w-24"
        >
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
        const cellValue = data[rowEl.key]?.[colEl.key] || "";

        return (
          <td
          key={colEl.key}
          className={cn(
            "border border-black p-0 relative min-h-[64px] md:min-h-[96px]",
            isDiagonal && "bg-brand-peach",
          )}
          >
          <textarea
            value={cellValue}
            onChange={(e) =>
            updateGrid(rowEl.key, colEl.key, e.target.value)
            }
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

const AccessPage = ({
  onJoin,
}: {
  onJoin: (group: string, name: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [fullName, setFullName] = useState("");

  const handleContinue = () => {
  if (selectedValue && fullName.trim()) {
    onJoin(selectedValue, fullName.trim());
  }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 font-sans">
    <div className="w-full max-w-md">
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
      {/* Logo */}
      <div className="flex justify-center mb-8">
      <img
        src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
        alt="Logo"
        className="h-24 w-auto object-contain"
        crossOrigin="anonymous"
        title="Welcome to SDP Suite Online Access"
      />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black text-gray-900 text-center mb-2 tracking-tight">
      SDP Suite Online Access
      </h1>
      <p className="text-center text-gray-600 text-sm mb-8">
      Enter your details to access the dashboard
      </p>

      {/* Form */}
      <div className="space-y-6">
      <div>
        <label
        htmlFor="full-name"
        className="block text-sm font-bold uppercase tracking-tight text-gray-900 mb-3"
        >
        Full Name
        </label>
        <input
        id="full-name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter your full name"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
        />
      </div>

      <div>
        <label
        htmlFor="group-select"
        className="block text-sm font-bold uppercase tracking-tight text-gray-900 mb-3"
        >
        Select Group
        </label>
        <select
        id="group-select"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white cursor-pointer hover:border-gray-300"
        >
        <option value="">-- Choose a group --</option>
        {Array.from({ length: 11 }, (_, i) => (
          <option key={i + 1} value={`Group ${i + 1}`}>
          Group {i + 1}
          </option>
        ))}
        </select>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedValue || !fullName.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer uppercase tracking-tight"
      >
        Continue to Dashboard
      </button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-8 font-mono tracking-widest">
      SDP_ACCESS_V1.0
      </p>
    </div>
    </div>
  </div>
  );
};

export default function App() {
  const [session, setSession] = useState<{
  group: string;
  name: string;
  } | null>(() => {
  const group = localStorage.getItem("sdp_selected_group");
  const name = localStorage.getItem("sdp_user_name");
  return group && name ? { group, name } : null;
  });

  useEffect(() => {
  if (session) {
    localStorage.setItem("sdp_selected_group", session.group);
    localStorage.setItem("sdp_user_name", session.name);
  } else {
    localStorage.removeItem("sdp_selected_group");
    localStorage.removeItem("sdp_user_name");
  }
  }, [session]);

  const handleJoin = (group: string, name: string) => {
  setSession({ group, name });
  };

  return (
  <ErrorBoundary>
    {session ? (
    <AppContent
      key={session.group}
      selectedGroup={session.group}
      userName={session.name}
      onExit={() => {
      setSession(null);
      }}
    />
    ) : (
    <AccessPage onJoin={handleJoin} />
    )}
  </ErrorBoundary>
  );
}

import { supabase } from "./lib/supabase";

function AppContent({
  selectedGroup,
  userName,
  onExit,
}: {
  selectedGroup: string;
  userName: string;
  onExit: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
  "PESTEL" | "McKinsey" | "VRIO" | "TOWS" | "PORTER"
  >(() => {
  const saved = localStorage.getItem(`sdp_tab_${selectedGroup}`);
  return (saved as any) || "PESTEL";
  });

  const [activeForce, setActiveForce] =
  useState<keyof PortersFiveForcesData>("suppliers");
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [onlineParticipantsCount, setOnlineParticipantsCount] =
  useState<number>(0);
  const [totalSiteUsers, setTotalSiteUsers] = useState<number>(0);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRemoteUpdate = useRef(false);
  const roomChannelRef = useRef<any>(null);

  // Data states with localStorage initialization
  const [pestelData, setPestelData] = useState<PESTELData[]>(() => {
  const saved = localStorage.getItem(`sdp_pestel_${selectedGroup}`);
  if (saved) return JSON.parse(saved);
  return [
    "Political",
    "Economic",
    "Social",
    "Technological",
    "Environmental",
    "Legal",
  ].map((cat) => ({
    id: cat,
    category: cat as any,
    description: "",
    impact: "",
    probability: "",
    potential: "",
  }));
  });

  const [mckinseyData, setMckinseyData] = useState<McKinsey7SData>(() => {
  const saved = localStorage.getItem(`sdp_mckinsey_${selectedGroup}`);
  return saved ? JSON.parse(saved) : {};
  });

  const [vrioAnalysisData, setVrioAnalysisData] = useState<VRIOAnalysisData[]>(
  () => {
    const saved = localStorage.getItem(`sdp_vrio_${selectedGroup}`);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 8 }, (_, i) => ({
    id: `res-${i}`,
    resource: "",
    type: "",
    detail: "",
    v: "",
    r: "",
    i: "",
    o: "",
    }));
  },
  );

