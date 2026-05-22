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
    hideMeta && "border-none mb-4",
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

const ConfrontationMatrixGuide = () => (
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
      <p className="font-bold text-sm mb-1 uppercase tracking-wider">
        1. Start with your SWOT
      </p>
      <p className="text-gray-600 leading-relaxed text-sm">
        Use your completed SWOT analysis (Strengths, Weaknesses,
        Opportunities, Threats).{" "}
        <span className="font-semibold text-black">
        This is the input of the matrix.
        </span>
      </p>
      </section>

      <section>
      <p className="font-bold text-sm mb-1 uppercase tracking-wider">
        2. Select key factors
      </p>
      <p className="text-gray-600 leading-relaxed text-sm">
        Take the 3 most important items from each category.{" "}
        <span className="font-semibold text-black">
        Keeps the matrix clear and easy to analyze.
        </span>
      </p>
      </section>

      <section>
      <p className="font-bold text-sm mb-1 uppercase tracking-wider">
        3. Build the matrix structure
      </p>
      <p className="text-gray-600 leading-relaxed text-sm">
        Put internal factors (S, W) →{" "}
        <span className="font-semibold text-black">vertically</span>. Put
        external factors (O, T) →{" "}
        <span className="font-semibold text-black">horizontally</span>.
        You are confronting internal vs external.
      </p>
      </section>

      <section>
      <p className="font-bold text-sm mb-1 uppercase tracking-wider">
        4. Analyze each combination
      </p>
      <p className="text-gray-600 leading-relaxed text-sm mb-2 italic underline decoration-gray-200">
        Evaluate how the internal factor performs in the external
        environment
      </p>
      <div className="pl-4 border-l-2 border-gray-200 space-y-1">
        <p className="text-sm font-medium">• Does it create value?</p>
        <p className="text-sm font-medium">• Does it create risk?</p>
      </div>
      </section>

      <section>
      <p className="font-bold text-sm mb-1 uppercase tracking-wider">
        5. Interpret each pairing (Strategic meaning)
      </p>
      <p className="text-gray-600 leading-relaxed text-sm mb-4">
        For every combination, ask the strategic question:{" "}
        <span className="font-semibold text-black text-xs uppercase bg-gray-100 px-1">
        "What does this pairing mean?"
        </span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-white border border-gray-100 rounded-lg">
        <p className="font-bold text-xs mb-1 text-green-700">
          Strength + Opportunity (S/O)
        </p>
        <p className="text-[11px] text-gray-500">
          Exploit an opportunity using a strength → aggressive/growth
          strategy.
        </p>
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-lg">
        <p className="font-bold text-xs mb-1 text-blue-700">
          Strength + Threat (S/T)
        </p>
        <p className="text-[11px] text-gray-500">
          Use a strength to counter a threat → defensive strategy.
        </p>
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-lg">
        <p className="font-bold text-xs mb-1 text-amber-700">
          Weakness + Opportunity (W/O)
        </p>
        <p className="text-[11px] text-gray-500">
          Improve weakness to seize opportunity → improvement
          strategy.
        </p>
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-lg">
        <p className="font-bold text-xs mb-1 text-red-700">
          Weakness + Threat (W/T)
        </p>
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
      <h4 className="font-bold text-lg text-black uppercase tracking-tight flex items-center gap-2">
      <div className="w-2 h-6 bg-black" />
      SCORING & VISUALIZATION
      </h4>

      <div className="space-y-4">
      <section>
        <p className="font-bold text-sm mb-2">6. Assign scores</p>
        <div className="flex flex-wrap gap-2">
        {[
          "+2 (Very Positive)",
          "+1 (Positive)",
          "0 (Neutral)",
          "-1 (Negative)",
          "-2 (Very Negative)",
        ].map((s) => (
          <span
          key={s}
          className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600"
          >
          {s}
          </span>
        ))}
        </div>
      </section>

      <section>
        <p className="font-bold text-sm mb-2">7. Highlight results</p>
        <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#C6E0B4]" />
          <span>
          <span className="font-bold text-black">
            Positive (+1 to +2)
          </span>{" "}
          = opportunities
          </span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FFF2CC]" />
          <span>
          <span className="font-bold text-black">Neutral (0)</span> =
          no significant impact / limited strategic relevance
          </span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F4B084]" />
          <span>
          <span className="font-bold text-black">
            Negative (-1 to -2)
          </span>{" "}
          = problems
          </span>
        </li>
        </ul>
        <p className="text-[11px] text-gray-400 mt-4 leading-relaxed italic border-l-4 border-gray-100 pl-4">
        The matrix becomes a visual map of market fit: where to act
        immediately (positive), what to monitor (neutral), and what to
        fix urgently (negative).
        </p>
      </section>
      </div>
    </div>

    <div className="pt-6 border-t border-gray-200">
      <h4 className="font-bold text-sm text-black uppercase tracking-widest mb-4">
      Key Takeaways
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
      <li>Quick overview of market position.</li>
      <li>Don’t need all green → every business has weaknesses.</li>
      <li>
        Helps adjust marketing, focus on strengths, and address risks.
      </li>
      </ul>
    </div>

    <div className="p-4 bg-black text-white rounded-xl">
      <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-2 text-gray-400">
      Final Insight & Priorities
      </h4>
      <p className="text-[11px] leading-relaxed opacity-90">
      The confrontation matrix is a fast strategic decision tool that
      bridges analysis and action by turning strategic diagnosis into
      clear growth and performance priorities. It clarifies positioning,
      highlights gaps, and enables prioritization of impactful
      combinations.
      </p>
    </div>
    </div>
  </div>
  </div>
);

