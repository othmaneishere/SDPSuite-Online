import {
  useState,
  useEffect,
  useRef,
  Component,
  ErrorInfo,
  ReactNode,
} from "react";
import React from "react";
import {
  FileText,
  Settings2,
  Network,
  Files,
  ChevronDown,
  LogOut,
  Trash2,
  BookOpen,
  Database,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import { cn } from "@/src/lib/utils";
import {
  MetaData,
  PESTELData,
  McKinsey7SData,
  VRIOAnalysisData,
  TOWSMatrixData,
  PortersFiveForcesData,
} from "./types";
import {
  PESTELWorksheet,
  McKinseyWorksheet,
  VRIOAnalysisTable,
} from "./components/Worksheets";
import { supabase } from "./lib/supabase";

// Small VRIOFramework placeholder component (previously missing) to avoid runtime ReferenceError
const VRIOFramework = ({ notes, setNotes }: { notes?: string; setNotes?: (s: string) => void }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold tracking-tight text-gray-900">VRIO Framework</h2>
    <p className="text-sm text-gray-500">Assess resources using Value, Rarity, Imitability and Organization. Use the table below to record resources and notes.</p>
  </div>
);

// Error Boundary Component for stability
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong.
          </h1>
          <p className="text-gray-600 mb-8">
            We've encountered an unexpected error. Please try refreshing the
            page.
          </p>
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

// Components
const CorporateHeader = ({
  meta,
  setMeta,
  selectedGroup,
  hideMeta = false,
  participants = [],
  totalSiteUsers = 0,
}: {
  meta: MetaData;
  setMeta: (m: MetaData) => void;
  selectedGroup?: string | null;
  hideMeta?: boolean;
  participants?: string[];
  totalSiteUsers?: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row justify-between border-b-2 border-gray-100 pb-8 mb-8 gap-8",
        hideMeta && "border-none mb-4"
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
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm max-w-xl">
          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
              Module
            </span>
            <span className="font-semibold text-black">
              Strategic Development Project (SDP)
            </span>
          </div>

          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
              Cohort
            </span>
            <span className="font-semibold text-black">MA27</span>
          </div>

          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
              Group
            </span>
            <span className="font-semibold text-black">
              {selectedGroup || "-"}
            </span>
          </div>

          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
              Date
            </span>
            <span className="font-semibold text-black">05 - 06 June 2026</span>
          </div>

          <div className="flex flex-col border-b border-gray-200 col-span-2 relative">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
              Company Name
            </span>
            <input
              type="text"
              value={meta.companyName}
              onChange={(e) =>
                setMeta({ ...meta, companyName: e.target.value })
              }
              className="font-semibold text-gray-700 outline-hidden bg-transparent border-b border-dashed border-gray-300 w-full"
              placeholder="Enter company name..."
            />
          </div>

          <div className="flex flex-col col-span-2 mt-4 pt-2 border-t border-gray-100">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">
              Participants:
            </span>
            <div className="flex flex-wrap gap-2">
              {participants.length > 0 ? (
                participants.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold border border-blue-100"
                  >
                    {p}
                  </span>
                ))
              ) : (
                <span className="text-gray-300 text-[10px] italic">
                  No active participants...
                </span>
              )}
            </div>
          </div>
        </div>
      )}
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
          <div className="flex justify-center mb-8">
            <img
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
              alt="Logo"
              className="h-24 w-auto object-contain"
              crossOrigin="anonymous"
              title="Welcome to SDP Suite Online Access"
            />
          </div>
          <h1 className="text-3xl font-black text-gray-900 text-center mb-2 tracking-tight">
            Strategic Suite Access
          </h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            Enter your details to access the dashboard
          </p>

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
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
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
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white cursor-pointer hover:border-gray-300"
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

          <p className="text-center text-xs text-gray-400 mt-8 font-mono tracking-widest">
            SDP_ACCESS_V1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState<{ group: string, name: string } | null>(() => {
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

  const [activeForce, setActiveForce] = useState<
    keyof PortersFiveForcesData
  >("suppliers");
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [onlineParticipantsCount, setOnlineParticipantsCount] = useState<number>(0);
  const [totalSiteUsers, setTotalSiteUsers] = useState<number>(0);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRemoteUpdate = useRef(false);
  const roomChannelRef = useRef<any>(null);
  const lastReceivedData = useRef<string>("");

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

  const [vrioAnalysisData, setVrioAnalysisData] = useState<VRIOAnalysisData[]>(() => {
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
  });

  const [vrioNotes, setVrioNotes] = useState(() => {
    return localStorage.getItem(`sdp_vrio_notes_${selectedGroup}`) || "";
  });

  const [towsData, setTowsData] = useState<TOWSMatrixData>(() => {
    const saved = localStorage.getItem(`sdp_tows_${selectedGroup}`);
    if (saved) return JSON.parse(saved);
    return {
      opportunities: Array(3).fill(""),
      threats: Array(3).fill(""),
      strengths: Array(3).fill(""),
      weaknesses: Array(3).fill(""),
      scores: {},
      notes: {},
    };
  });

  const [portersData, setPortersData] = useState<PortersFiveForcesData>(() => {
    const saved = localStorage.getItem(`sdp_porters_${selectedGroup}`);
    if (saved) return JSON.parse(saved);
    return {
      newEntrants: {
        analysis: "",
        impact: "Medium",
        scorecard: {},
        further: Array.from({ length: 3 }, () => ({
          col1: "",
          col2: "",
          col3: "",
        })),
      },
      buyers: {
        analysis: "",
        impact: "Medium",
        scorecard: {},
        further: Array.from({ length: 5 }, () => ({
          col1: "",
          col2: "",
          col3: "",
        })),
      },
      suppliers: {
        analysis: "",
        impact: "Medium",
        scorecard: {},
        further: Array.from({ length: 5 }, () => ({
          col1: "",
          col2: "",
          col3: "",
        })),
      },
      substitutes: {
        analysis: "",
        impact: "Medium",
        scorecard: {},
        further: Array.from({ length: 5 }, () => ({
          col1: "",
          col2: "",
          col3: "",
        })),
      },
      rivalry: {
        analysis: "",
        impact: "Medium",
        scorecard: {},
        further: Array.from({ length: 8 }, () => ({
          col1: "",
          col2: "",
          col3: "",
          col4: "",
        })),
      },
    };
  });

  const [meta, setMeta] = useState<MetaData>(() => {
    const saved = localStorage.getItem(`sdp_meta_${selectedGroup}`);
    if (saved) return JSON.parse(saved);
    return {
      module: "",
      cohort: "",
      date: "",
      companyName: "",
      participants: [],
      group: selectedGroup,
    };
  });

  // Supabase Collaboration Logic
  useEffect(() => {
    const globalChannel = supabase.channel("global:presence");
    globalChannel
      .on("presence", { event: "sync" }, () => {
        const state = globalChannel.presenceState();
        setTotalSiteUsers(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await globalChannel.track({ online_at: new Date().toISOString() });
        }
      });

    const roomChannel = supabase.channel(`room:${selectedGroup}`, {
      config: {
        presence: {
          key: selectedGroup,
        },
      },
    });
    roomChannelRef.current = roomChannel;

    roomChannel
      .on("presence", { event: "sync" }, () => {
        const state = roomChannel.presenceState();
        const presences = Object.values(state).flat() as any[];
        const names = presences.map((p) => p.name).filter(Boolean);
        setActiveParticipants([...new Set(names)]);
        setOnlineParticipantsCount(Object.keys(state).length);
      })
      .on("broadcast", { event: "update_data" }, ({ payload }) => {
        const payloadStr = JSON.stringify(payload);
        if (payloadStr === lastReceivedData.current) return;

        lastReceivedData.current = payloadStr;
        isRemoteUpdate.current = true;

        if (payload.pestel) setPestelData(payload.pestel);
        if (payload.mckinsey) setMckinseyData(payload.mckinsey);
        if (payload.vrio) setVrioAnalysisData(payload.vrio);
        if (payload.vrioNotes !== undefined) setVrioNotes(payload.vrioNotes);
        if (payload.tows) setTowsData(payload.tows);
        if (payload.porters) setPortersData(payload.porters);
        if (payload.meta) setMeta(payload.meta);

        if (payload.pestel)
          localStorage.setItem(
            `sdp_pestel_${selectedGroup}`,
            JSON.stringify(payload.pestel)
          );
        if (payload.mckinsey)
          localStorage.setItem(
            `sdp_mckinsey_${selectedGroup}`,
            JSON.stringify(payload.mckinsey)
          );
        if (payload.vrio)
          localStorage.setItem(
            `sdp_vrio_${selectedGroup}`,
            JSON.stringify(payload.vrio)
          );
        if (payload.vrioNotes !== undefined)
          localStorage.setItem(`sdp_vrio_notes_${selectedGroup}`, payload.vrioNotes);
        if (payload.tows)
          localStorage.setItem(`sdp_tows_${selectedGroup}`, JSON.stringify(payload.tows));
        if (payload.porters)
          localStorage.setItem(
            `sdp_porters_${selectedGroup}`,
            JSON.stringify(payload.porters)
          );
        if (payload.meta)
          localStorage.setItem(`sdp_meta_${selectedGroup}`, JSON.stringify(payload.meta));

        setTimeout(() => {
          isRemoteUpdate.current = false;
        }, 100);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await roomChannel.track({
            name: userName,
            online_at: new Date().toISOString(),
          });
        }
      });

    const loadInitialData = async () => {
      const { data } = await supabase
        .from("worksheets")
        .select("content")
        .eq("id", selectedGroup)
        .single();

      if (data && data.content) {
        const content = data.content;
        const contentStr = JSON.stringify(content);
        lastReceivedData.current = contentStr;
        isRemoteUpdate.current = true;

        if (content.pestel) setPestelData(content.pestel);
        if (content.mckinsey) setMckinseyData(content.mckinsey);
        if (content.vrio) setVrioAnalysisData(content.vrio);
        if (content.vrioNotes !== undefined) setVrioNotes(content.vrioNotes);
        if (content.tows) setTowsData(content.tows);
        if (content.porters) setPortersData(content.porters);
        if (content.meta) setMeta(content.meta);

        if (content.pestel)
          localStorage.setItem(`sdp_pestel_${selectedGroup}`, JSON.stringify(content.pestel));
        if (content.mckinsey)
          localStorage.setItem(`sdp_mckinsey_${selectedGroup}`, JSON.stringify(content.mckinsey));
        if (content.vrio)
          localStorage.setItem(`sdp_vrio_${selectedGroup}`, JSON.stringify(content.vrio));
        if (content.vrioNotes !== undefined)
          localStorage.setItem(`sdp_vrio_notes_${selectedGroup}`, content.vrioNotes);
        if (content.tows)
          localStorage.setItem(`sdp_tows_${selectedGroup}`, JSON.stringify(content.tows));
        if (content.porters)
          localStorage.setItem(`sdp_porters_${selectedGroup}`, JSON.stringify(content.porters));
        if (content.meta)
          localStorage.setItem(`sdp_meta_${selectedGroup}`, JSON.stringify(content.meta));

        setTimeout(() => {
          isRemoteUpdate.current = false;
        }, 100);
      }
    };

    loadInitialData();

    return () => {
      supabase.removeChannel(globalChannel);
      supabase.removeChannel(roomChannel);
    };
  }, [selectedGroup, userName]);

  // Broadcast and Save updates
  useEffect(() => {
    if (isRemoteUpdate.current) return;

    const currentData = {
      pestel: pestelData,
      mckinsey: mckinseyData,
      vrio: vrioAnalysisData,
      vrioNotes: vrioNotes,
      tows: towsData,
      porters: portersData,
      meta: meta,
    };

    const dataStr = JSON.stringify(currentData);
    if (dataStr === lastReceivedData.current) return;

    localStorage.setItem(`sdp_pestel_${selectedGroup}`, JSON.stringify(pestelData));
    localStorage.setItem(`sdp_mckinsey_${selectedGroup}`, JSON.stringify(mckinseyData));
    localStorage.setItem(`sdp_vrio_${selectedGroup}`, JSON.stringify(vrioAnalysisData));
    localStorage.setItem(`sdp_vrio_notes_${selectedGroup}`, vrioNotes);
    localStorage.setItem(`sdp_tows_${selectedGroup}`, JSON.stringify(towsData));
    localStorage.setItem(`sdp_porters_${selectedGroup}`, JSON.stringify(portersData));
    localStorage.setItem(`sdp_meta_${selectedGroup}`, JSON.stringify(meta));

    const broadcastTimer = setTimeout(() => {
      if (roomChannelRef.current) {
        roomChannelRef.current.send({
          type: "broadcast",
          event: "update_data",
          payload: currentData,
        });
      }
    }, 100);

    const saveTimer = setTimeout(async () => {
      setIsSaving(true);
      await supabase
        .from("worksheets")
        .upsert(
          {
            id: selectedGroup,
            content: currentData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      setIsSaving(false);
    }, 2000);

    return () => {
      clearTimeout(broadcastTimer);
      clearTimeout(saveTimer);
    };
  }, [pestelData, mckinseyData, vrioAnalysisData, vrioNotes, towsData, portersData, meta, selectedGroup]);

  // Rest of the logic (exporting, clearData, etc.)
  const handlePestelUpdate = (data: PESTELData[]) => setPestelData(data);
  const handleMcKinseyUpdate = (data: McKinsey7SData) => setMckinseyData(data);
  const handleVrioUpdate = (data: VRIOAnalysisData[]) => setVrioAnalysisData(data);
  const handleTowsUpdate = (data: TOWSMatrixData) => setTowsData(data);
  const handlePortersUpdate = (data: PortersFiveForcesData) => setPortersData(data);
  const handleMetaUpdate = (data: MetaData) => setMeta(data);

  const exportPDF = async () => {
    setIsExporting(true);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    try {
      const printRef = document.getElementById("full-report-print-container");
      if (!printRef) throw new Error("Print container not found");

      const originalPrintDisplay = printRef.style.display;
      printRef.style.display = "block";

      if (activeTab === "PORTER") {
        const forces = ["suppliers", "buyers", "newEntrants", "substitutes", "rivalry"] as const;
        let isFirstPage = true;

        for (const force of forces) {
          const section = Array.from(printRef.querySelectorAll(".print-section")).find((s) =>
            s.querySelector("h2")?.textContent?.toUpperCase().includes(`PORTER'S 5 FORCES: ${force.toUpperCase()}`)
          ) as HTMLElement;

          if (section) {
            section.style.display = "block";
            const imgData = await toJpeg(section, {
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: "#ffffff",
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
            pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
            section.style.display = "none";
          }
        }
        pdf.save(`Porters_Five_Forces_Full_${meta.companyName || "Export"}.pdf`);
      } else {
        const section = Array.from(printRef.querySelectorAll(".print-section")).find((s) => {
          const h2Text = s.querySelector("h2")?.textContent?.toUpperCase() || "";
          if (activeTab === "PESTEL") return h2Text.includes("PESTEL ANALYSIS");
          if (activeTab === "McKinsey") return h2Text.includes("MCKINSEY 7-S FRAMEWORK");
          if (activeTab === "VRIO") return h2Text.includes("VRIO FRAMEWORK");
          if (activeTab === "TOWS") return h2Text.includes("CONFRONTATION MATRIX");
          return false;
        }) as HTMLElement;

        if (section) {
          section.style.display = "block";
          const imgData = await toPng(section, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
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

          pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
          pdf.save(`${activeTab}_Worksheet_${meta.companyName || "Export"}.pdf`);
          section.style.display = "none";
        }
      }
      printRef.style.display = originalPrintDisplay;
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllPDF = async () => {
    setIsExporting(true);
    setIsExportingAll(true);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    try {
      const printRef = document.getElementById("full-report-print-container");
      if (!printRef) throw new Error("Print container not found");

      const originalPrintDisplay = printRef.style.display;
      printRef.style.display = "block";

      const sections = printRef.querySelectorAll(".print-section");
      let isFirstPage = true;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        section.style.display = "block";

        const imgData = await toJpeg(section, {
          quality: 0.92,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
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
        pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
        section.style.display = "none";
      }

      pdf.save(`Full_Strategy_Report_${meta.companyName || "Export"}.pdf`);
      printRef.style.display = originalPrintDisplay;
    } catch (error) {
      console.error("Export all failed:", error);
    } finally {
      setIsExporting(false);
      setIsExportingAll(false);
    }
  };

  const clearData = () => {
    if (confirm("Clear all data for this worksheet?")) {
      if (activeTab === "PESTEL") {
        setPestelData(
          ["Political", "Economic", "Social", "Technological", "Environmental", "Legal"].map((cat) => ({
            id: cat,
            category: cat as any,
            description: "",
            impact: "",
            probability: "",
            potential: "",
          }))
        );
      } else if (activeTab === "McKinsey") {
        setMckinseyData({});
      } else if (activeTab === "VRIO") {
        setVrioAnalysisData(
          Array.from({ length: 8 }, (_, i) => ({
            id: `res-${i}`,
            resource: "",
            type: "",
            detail: "",
            v: "",
            r: "",
            i: "",
            o: "",
          }))
        );
        setVrioNotes("");
      } else if (activeTab === "TOWS") {
        setTowsData({
          opportunities: Array(3).fill(""),
          threats: Array(3).fill(""),
          strengths: Array(3).fill(""),
          weaknesses: Array(3).fill(""),
          scores: {},
          notes: {},
        });
      } else if (activeTab === "PORTER") {
        setPortersData({
          newEntrants: {
            analysis: "",
            impact: "Medium",
            scorecard: {},
            further: Array.from({ length: 3 }, () => ({ col1: "", col2: "", col3: "" })),
          },
          buyers: {
            analysis: "",
            impact: "Medium",
            scorecard: {},
            further: Array.from({ length: 5 }, () => ({ col1: "", col2: "", col3: "" })),
          },
          suppliers: {
            analysis: "",
            impact: "Medium",
            scorecard: {},
            further: Array.from({ length: 5 }, () => ({ col1: "", col2: "", col3: "" })),
          },
          substitutes: {
            analysis: "",
            impact: "Medium",
            scorecard: {},
            further: Array.from({ length: 5 }, () => ({ col1: "", col2: "", col3: "" })),
          },
          rivalry: {
            analysis: "",
            impact: "Medium",
            scorecard: {},
            further: Array.from({ length: 8 }, () => ({ col1: "", col2: "", col3: "", col4: "" })),
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans selection:bg-brand-blue/10">
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[90vh] flex flex-col">
        {/* Top Header Row: Logo and Actions */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <img
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
              alt="SDP Suite Logo"
              className="h-16 w-auto object-contain"
              crossOrigin="anonymous"
              title="Welcome to Strategic Suite Access"
            />
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/80 transition-all group/status relative cursor-default"
              title={`Group: ${onlineParticipantsCount} users | Site-wide: ${totalSiteUsers} users`}
            >
              <div className="flex -space-x-1.5 overflow-hidden">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full border border-white",
                    onlineParticipantsCount > 0 ? "bg-green-500 animate-pulse" : "bg-gray-300"
                  )}
                />
                <div
                  className={cn(
                    "w-2 h-2 rounded-full border border-white",
                    totalSiteUsers > 0 ? "bg-indigo-500" : "bg-gray-300"
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter leading-none">
                  {onlineParticipantsCount} Group
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter leading-none mt-0.5">
                  {totalSiteUsers} Total
                </span>
              </div>
            </div>

            {isSaving && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                  Saving...
                </span>
              </div>
            )}

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <button
              onClick={() => {
                if (
                  confirm("Are you sure you want to exit this session? You will return to the group selection page.")
                ) {
                  onExit();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-blue-600 transition-all cursor-pointer font-extrabold text-[10px] uppercase tracking-[0.2em]"
              title="Exit Session"
            >
              <LogOut size={18} />
              <span className="hidden xl:inline">Exit</span>
            </button>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <button
              onClick={clearData}
              className="p-2 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              title="Clear current worksheet"
            >
              <Trash2 size={20} />
            </button>

            {/* Export Current Page Button */}
            <button
              onClick={exportPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-black transition-all shadow-md shadow-black/10 disabled:opacity-50 cursor-pointer"
              title="Download current page as PDF"
            >
              {isExporting && !isExportingAll ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileText size={18} />
              )}
              <span className="hidden xl:inline">Export Page</span>
            </button>
            <button
              onClick={exportAllPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              title="Download full report as PDF"
            >
              {isExporting && isExportingAll ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Files size={18} />
              )}
              <span className="hidden xl:inline">Export All</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-6 overflow-x-auto border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveTab("PESTEL")}
            className={cn(
              "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === "PESTEL"
                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <BookOpen size={18} /> PESTEL
          </button>
          <button
            onClick={() => setActiveTab("McKinsey")}
            className={cn(
              "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === "McKinsey"
                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Settings2 size={18} /> McKinsey 7-S
          </button>
          <button
            onClick={() => setActiveTab("VRIO")}
            className={cn(
              "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === "VRIO"
                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Database size={18} /> VRIO Framework
          </button>
          <button
            onClick={() => setActiveTab("TOWS")}
            className={cn(
              "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === "TOWS"
                ? "bg-yellow-200 text-gray-900 shadow-md"
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Network size={18} /> Confrontation Matrix
          </button>
          <button
            onClick={() => setActiveTab("PORTER")}
            className={cn(
              "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
              activeTab === "PORTER"
                ? "bg-[#4f39f6] text-white shadow-md"
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Files size={18} /> Porter's 5 Forces
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white relative">
          <div className="max-w-6xl mx-auto">
            <div ref={containerRef} className="worksheet-container relative overflow-hidden bg-white">
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
                            : ""
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
                    <PESTELWorksheet data={pestelData} setData={handlePestelUpdate} />
                  ) : activeTab === "McKinsey" ? (
                    <McKinseyWorksheet data={mckinseyData} setData={handleMcKinseyUpdate} />
                  ) : activeTab === "VRIO" ? (
                    <div className="space-y-12">
                      <VRIOFramework />
                      <VRIOAnalysisTable
                        data={vrioAnalysisData}
                        setData={handleVrioUpdate}
                        notes={vrioNotes}
                        setNotes={setVrioNotes}
                      />
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
      <div id="full-report-print-container" className="hidden" aria-hidden="true">
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={selectedGroup} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">
            PESTEL Analysis
          </h2>
          <PESTELWorksheet data={pestelData} setData={() => {}} />
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={selectedGroup} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">
            McKinsey 7-S Framework
          </h2>
          <McKinseyWorksheet data={mckinseyData} setData={() => {}} />
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={selectedGroup} />
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
        {["suppliers", "buyers", "newEntrants", "substitutes", "rivalry"].map((force) => (
          <div key={force} className="print-section bg-white p-12 w-[297mm]">
            <CorporateHeader meta={meta} setMeta={setMeta} selectedGroup={selectedGroup} />
            <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-indigo-600 pb-2 mb-8">
              Porter's 5 Forces: {force.toUpperCase()}
            </h2>
            <PortersFiveForces
              data={portersData}
              setData={() => {}}
              activeForce={force as any}
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
            <TOWSWorksheet data={towsData} setData={() => {}} meta={meta} setMeta={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ... rest of the helper components (TOWSWorksheet, MatrixCell, etc.) ...
