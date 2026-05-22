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

  const lastReceivedData = useRef<string>("");

  // Supabase Collaboration Logic
  useEffect(() => {
  // 1. Global Presence Channel
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

  // 2. Room Channel
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

    // Sync to localStorage as well
    if (payload.pestel)
      localStorage.setItem(
      `sdp_pestel_${selectedGroup}`,
      JSON.stringify(payload.pestel),
      );
    if (payload.mckinsey)
      localStorage.setItem(
      `sdp_mckinsey_${selectedGroup}`,
      JSON.stringify(payload.mckinsey),
      );
    if (payload.vrio)
      localStorage.setItem(
      `sdp_vrio_${selectedGroup}`,
      JSON.stringify(payload.vrio),
      );
    if (payload.vrioNotes !== undefined)
      localStorage.setItem(
      `sdp_vrio_notes_${selectedGroup}`,
      payload.vrioNotes,
      );
    if (payload.tows)
      localStorage.setItem(
      `sdp_tows_${selectedGroup}`,
      JSON.stringify(payload.tows),
      );
    if (payload.porters)
      localStorage.setItem(
      `sdp_porters_${selectedGroup}`,
      JSON.stringify(payload.porters),
      );
    if (payload.meta)
      localStorage.setItem(
      `sdp_meta_${selectedGroup}`,
      JSON.stringify(payload.meta),
      );

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

  // Initial load from DB
  const loadInitialData = async () => {
    const { data, error } = await supabase
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

    // Sync to localStorage on load
    if (content.pestel)
      localStorage.setItem(
      `sdp_pestel_${selectedGroup}`,
      JSON.stringify(content.pestel),
      );
    if (content.mckinsey)
      localStorage.setItem(
      `sdp_mckinsey_${selectedGroup}`,
      JSON.stringify(content.mckinsey),
      );
    if (content.vrio)
      localStorage.setItem(
      `sdp_vrio_${selectedGroup}`,
      JSON.stringify(content.vrio),
      );
    if (content.vrioNotes !== undefined)
      localStorage.setItem(
      `sdp_vrio_notes_${selectedGroup}`,
      content.vrioNotes,
      );
    if (content.tows)
      localStorage.setItem(
      `sdp_tows_${selectedGroup}`,
      JSON.stringify(content.tows),
      );
    if (content.porters)
      localStorage.setItem(
      `sdp_porters_${selectedGroup}`,
      JSON.stringify(content.porters),
      );
    if (content.meta)
      localStorage.setItem(
      `sdp_meta_${selectedGroup}`,
      JSON.stringify(content.meta),
      );

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

  // Save to localStorage immediately
  localStorage.setItem(
    `sdp_pestel_${selectedGroup}`,
    JSON.stringify(pestelData),
  );
  localStorage.setItem(
    `sdp_mckinsey_${selectedGroup}`,
    JSON.stringify(mckinseyData),
  );
  localStorage.setItem(
    `sdp_vrio_${selectedGroup}`,
    JSON.stringify(vrioAnalysisData),
  );
  localStorage.setItem(`sdp_vrio_notes_${selectedGroup}`, vrioNotes);
  localStorage.setItem(`sdp_tows_${selectedGroup}`, JSON.stringify(towsData));
  localStorage.setItem(
    `sdp_porters_${selectedGroup}`,
    JSON.stringify(portersData),
  );
  localStorage.setItem(`sdp_meta_${selectedGroup}`, JSON.stringify(meta));

  // Broadcast live typing (debounced)
  const broadcastTimer = setTimeout(() => {
    if (roomChannelRef.current) {
    roomChannelRef.current.send({
      type: "broadcast",
      event: "update_data",
      payload: currentData,
    });
    }
  }, 100);

  // Debounced save to DB
  const saveTimer = setTimeout(async () => {
    setIsSaving(true);
    await supabase.from("worksheets").upsert(
    {
      id: selectedGroup,
      content: currentData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
    );
    setIsSaving(false);
  }, 2000);

  return () => {
    clearTimeout(broadcastTimer);
    clearTimeout(saveTimer);
  };
  }, [
  pestelData,
  mckinseyData,
  vrioAnalysisData,
  vrioNotes,
  towsData,
  portersData,
  meta,
  selectedGroup,
  ]);

  // Rest of the logic (exporting, clearData, etc.)
  const handlePestelUpdate = (data: PESTELData[]) => setPestelData(data);
  const handleMcKinseyUpdate = (data: McKinsey7SData) => setMckinseyData(data);
  const handleVrioUpdate = (data: VRIOAnalysisData[]) =>
  setVrioAnalysisData(data);
  const handleTowsUpdate = (data: TOWSMatrixData) => setTowsData(data);
  const handlePortersUpdate = (data: PortersFiveForcesData) =>
  setPortersData(data);
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
    const forces = [
      "suppliers",
      "buyers",
      "newEntrants",
      "substitutes",
      "rivalry",
    ] as const;
    let isFirstPage = true;

    for (const force of forces) {
      const section = Array.from(
      printRef.querySelectorAll(".print-section"),
      ).find((s) =>
      s
        .querySelector("h2")
        ?.textContent?.toUpperCase()
        .includes(`PORTER'S 5 FORCES: ${force.toUpperCase()}`),
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
