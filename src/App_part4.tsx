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
    pdf.save(
      `Porters_Five_Forces_Full_${meta.companyName || "Export"}.pdf`,
    );
    } else {
    // Find the section by matching the title or a data attribute
    const section = Array.from(
      printRef.querySelectorAll(".print-section"),
    ).find((s) => {
      const h2Text =
      s.querySelector("h2")?.textContent?.toUpperCase() || "";
      if (activeTab === "PESTEL") return h2Text.includes("PESTEL ANALYSIS");
      if (activeTab === "McKinsey")
      return h2Text.includes("MCKINSEY 7-S FRAMEWORK");
      if (activeTab === "VRIO") return h2Text.includes("VRIO FRAMEWORK");
      if (activeTab === "TOWS")
      return h2Text.includes("CONFRONTATION MATRIX");
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
      pdf.save(
      `${activeTab}_Worksheet_${meta.companyName || "Export"}.pdf`,
      );
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
      [
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
      })),
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
      })),
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
          onlineParticipantsCount > 0
            ? "bg-green-500 animate-pulse"
            : "bg-gray-300",
          )}
        />
        <div
          className={cn(
          "w-2 h-2 rounded-full border border-white",
          totalSiteUsers > 0 ? "bg-indigo-500" : "bg-gray-300",
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
          confirm(
          "Are you sure you want to exit this session? You will return to the group selection page.",
          )
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
        Page PDF
      </button>

      {/* Export Full Report Button */}
      <button
        onClick={exportAllPDF}
        disabled={isExportingAll}
        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 disabled:opacity-50 cursor-pointer"
        title="Download all frameworks as multi-page PDF"
      >
        {isExportingAll ? (
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Generating...
        </span>
        ) : (
        <>
          <BookOpen size={18} />
          Full Report
        </>
        )}
      </button>
      </div>
    </div>

    {/* Navigation Bar */}
    <div className="flex items-center justify-center p-2 md:p-4">
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
      {/* PESTEL */}
      <button
        onClick={() => setActiveTab("PESTEL")}
        className={cn(
        "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
        activeTab === "PESTEL"
          ? "bg-brand-blue text-white shadow-md"
          : "bg-transparent text-gray-500 hover:text-gray-800",
        )}
      >
        <FileText size={18} /> PESTEL Analysis
      </button>
      {/* McKinsey */}
      <button
        onClick={() => setActiveTab("McKinsey")}
        className={cn(
        "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
        activeTab === "McKinsey"
          ? "bg-brand-peach text-gray-900 shadow-md"
          : "bg-transparent text-gray-500 hover:text-gray-800",
        )}
      >
        <Settings2 size={18} /> McKinsey 7-S
      </button>
      {/* VRIO */}
      <button
        onClick={() => setActiveTab("VRIO")}
        className={cn(
        "px-4 md:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
        activeTab === "VRIO"
          ? "bg-[#1f2937] text-white shadow-md"
          : "bg-transparent text-gray-500 hover:text-gray-800",
