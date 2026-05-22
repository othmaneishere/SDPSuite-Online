const AccessPage = ({
  onJoin,
}: {
  onJoin: (group: string, name: string, isAdmin: boolean) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleContinue = () => {
    if (showAdminLogin) {
      if (passcode === "0000" && selectedValue) {
        onJoin(selectedValue, "ADMIN", true);
      } else if (passcode !== "0000") {
        alert("Invalid Admin Passcode");
      }
    } else {
      if (selectedValue && fullName.trim()) {
        onJoin(selectedValue, fullName.trim(), false);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2rem] border border-gray-100/50 bg-white p-10 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-inner">
              <img
                src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png"
                alt="Logo"
                className="h-20 w-auto object-contain"
                crossOrigin="anonymous"
                title="Strategic Suite Access"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-3xl font-black tracking-tight text-gray-900">
            Strategic Suite Access
          </h1>
          <p className="mb-10 text-center text-sm font-medium text-gray-500">
            {showAdminLogin
              ? "Administrator Oversight Portal"
              : "Enter your details to access the dashboard"}
          </p>

          {/* Form */}
          <div className="space-y-6">
            {!showAdminLogin ? (
              <div className="space-y-2">
                <label
                  htmlFor="full-name"
                  className="ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
                >
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-4 font-bold text-gray-900 transition-all placeholder:text-gray-300 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100/50"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="passcode"
                  className="ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-red-400"
                >
                  Admin Passcode
                </label>
                <input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full rounded-2xl border-2 border-red-100 bg-red-50/30 px-5 py-4 text-center text-2xl font-black tracking-[0.5em] text-red-600 transition-all placeholder:text-red-100 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100/50"
                />
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="group-select"
                className="ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
              >
                Select Group to {showAdminLogin ? "Monitor" : "Join"}
              </label>
              <select
                id="group-select"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-4 font-bold text-gray-900 shadow-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100/50"
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
              disabled={
                selectedValue === "" ||
                (!showAdminLogin && !fullName.trim()) ||
                (showAdminLogin && passcode.length < 4)
              }
              className={cn(
                "w-full cursor-pointer rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition-all shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30",
                showAdminLogin
                  ? "bg-red-600 shadow-red-200 hover:bg-red-700"
                  : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"
              )}
            >
              {showAdminLogin ? "Enter Admin Dashboard" : "Continue to Dashboard"}
            </button>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setShowAdminLogin(!showAdminLogin)}
                className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900"
              >
                {showAdminLogin ? "← Back to Regular Access" : "Admin Portal"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-300">
              SDP_ACCESS_V1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState<{
    group: string;
    name: string;
    isAdmin: boolean;
  } | null>(() => {
    const group = localStorage.getItem("sdp_selected_group");
    const name = localStorage.getItem("sdp_user_name");
    const isAdmin = localStorage.getItem("sdp_is_admin") === "true";
    return group && name ? { group, name, isAdmin } : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("sdp_selected_group", session.group);
      localStorage.setItem("sdp_user_name", session.name);
      localStorage.setItem("sdp_is_admin", session.isAdmin ? "true" : "false");
    } else {
      localStorage.removeItem("sdp_selected_group");
      localStorage.removeItem("sdp_user_name");
      localStorage.removeItem("sdp_is_admin");
    }
  }, [session]);

  const handleJoin = (group: string, name: string, isAdmin: boolean) => {
    setSession({ group, name, isAdmin });
  };

  return (
    <ErrorBoundary>
      {session ? (
        <AppContent
          key={session.group}
          selectedGroup={session.group}
          userName={session.name}
          isAdmin={session.isAdmin}
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
