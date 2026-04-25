import { useState } from "react";

const JOBS = [
  { id: 1, title: "Frontend Developer", company: "Vercel", logo: "▲", type: "Full Time", location: "Remote", salary: "$90k–$120k", posted: "2d ago", experience: "Senior", tags: ["React", "TypeScript"], description: "We're looking for a Frontend Developer who loves building fast, beautiful, and user-friendly web apps. You'll work with a talented team to create products used by millions.", responsibilities: ["Build responsive UIs", "Collaborate with designers & devs", "Write clean & maintainable code", "Optimize performance"], offers: ["Competitive salary", "Health & wellness benefits", "Flexible working", "Learning & growth budget"], postedDate: "May 15, 2024" },
  { id: 2, title: "UI/UX Designer", company: "Figma", logo: "◈", type: "Full Time", location: "Hybrid", salary: "$70k–$95k", posted: "1d ago", experience: "Mid Level", tags: ["Figma", "Design Systems"], description: "Join Figma to shape the future of design tools. You'll create intuitive experiences for millions of designers worldwide.", responsibilities: ["Design user interfaces", "Conduct user research", "Create design systems", "Prototype interactions"], offers: ["Stock options", "Remote flexibility", "Top-tier equipment", "Conference budget"], postedDate: "May 16, 2024" },
  { id: 3, title: "Backend Developer", company: "Supabase", logo: "⚡", type: "Full Time", location: "Remote", salary: "$85k–$115k", posted: "3d ago", experience: "Senior", tags: ["Node.js", "PostgreSQL"], description: "Build the infrastructure that powers thousands of apps. Work on open-source tools that developers love.", responsibilities: ["Design APIs", "Optimize databases", "Write scalable services", "Contribute to OSS"], offers: ["Open source culture", "Remote-first", "Annual retreat", "Home office stipend"], postedDate: "May 13, 2024" },
  { id: 4, title: "DevOps Engineer", company: "AWS", logo: "☁", type: "Full Time", location: "Remote", salary: "$95k–$130k", posted: "1d ago", experience: "Senior", tags: ["AWS", "Kubernetes"], description: "Scale cloud infrastructure for millions of users. Automate everything and make deployments a breeze.", responsibilities: ["Manage cloud infra", "CI/CD pipelines", "Monitor systems", "Security hardening"], offers: ["Top-tier pay", "AWS credits", "Certification support", "Flexible hours"], postedDate: "May 15, 2024" },
  { id: 5, title: "Product Manager", company: "Stripe", logo: "◆", type: "Full Time", location: "Hybrid", salary: "$110k–$150k", posted: "2d ago", experience: "Senior", tags: ["Strategy", "Analytics"], description: "Drive product strategy for Stripe's payments platform. Shape the roadmap that powers the internet economy.", responsibilities: ["Define product vision", "Work with eng & design", "Analyze metrics", "Drive launches"], offers: ["Exceptional pay", "Equity package", "Global team", "Impact at scale"], postedDate: "May 14, 2024" },
  { id: 6, title: "Full Stack Developer", company: "Notion", logo: "N", type: "Remote", location: "Remote", salary: "$100k–$140k", posted: "4h ago", experience: "Mid Level", tags: ["React", "Node.js"], description: "Build features that help millions organize their work and life. Ship fast, iterate faster.", responsibilities: ["Full stack features", "Performance tuning", "Code reviews", "Mentoring juniors"], offers: ["Remote-first", "Unlimited PTO", "Learning stipend", "Top hardware"], postedDate: "May 16, 2024" },
  { id: 7, title: "Visual Designer", company: "Loom", logo: "●", type: "Full Time", location: "Remote", salary: "$60k–$85k", posted: "5d ago", experience: "Entry Level", tags: ["Branding", "Motion"], description: "Create stunning visuals for Loom's brand across digital and print. Your work will be seen by millions.", responsibilities: ["Brand design", "Marketing assets", "Motion graphics", "Social content"], offers: ["Growth path", "Creative freedom", "Gear budget", "Friendly team"], postedDate: "May 11, 2024" },
  { id: 8, title: "Product Designer", company: "Canva", logo: "✦", type: "Full Time", location: "Remote", salary: "$80k–$110k", posted: "3d ago", experience: "Mid Level", tags: ["Product Design", "UX Research"], description: "Design tools that empower non-designers to create beautiful things. Join a mission-driven team.", responsibilities: ["End-to-end design", "User testing", "Cross-functional collab", "Design specs"], offers: ["Mission-driven work", "Equity", "Wellness perks", "Global team"], postedDate: "May 13, 2024" },
];

const companyColors = {
  "Vercel": "#fff", "Figma": "#A259FF", "Supabase": "#3ECF8E", "AWS": "#FF9900",
  "Stripe": "#635BFF", "Notion": "#e5e5e5", "Loom": "#FF4154", "Canva": "#00C4CC"
};

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [authMode, setAuthMode] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [applied, setApplied] = useState([]);
  const [applyJob, setApplyJob] = useState(null);
  const [applyForm, setApplyForm] = useState({ name: "", email: "", phone: "", cover: "" });
  const [applySuccess, setApplySuccess] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Application Submitted! You've applied for Frontend Developer at Vercel.", time: "2m ago", icon: "✅" },
    { id: 2, text: "Interview Scheduled! You have an interview for UI/UX Designer at Figma.", time: "1h ago", icon: "📅" },
    { id: 3, text: "Application Update: Your application for Backend Developer is now under review.", time: "3h ago", icon: "🔔" },
  ]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [dashTab, setDashTab] = useState("dashboard");
  const [empTab, setEmpTab] = useState("dashboard");

  const filtered = JOBS.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q));
    const matchLoc = !locationFilter || j.location === locationFilter;
    const matchType = !typeFilter || j.type === typeFilter;
    return matchSearch && matchLoc && matchType;
  });

  const nav = (p) => { setPage(p); setSelectedJob(null); setApplyJob(null); setApplySuccess(false); };

  const handleApply = (job) => {
    if (!loggedIn) { setAuthMode("signup"); return; }
    setApplyJob(job);
    setPage("apply");
  };

  const submitApplication = () => {
    setApplied(prev => [...prev, applyJob]);
    setApplySuccess(true);
    setNotifications(prev => [{ id: Date.now(), text: `Application Submitted! You've applied for ${applyJob.title} at ${applyJob.company}.`, time: "just now", icon: "✅" }, ...prev]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'Syne', 'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }

        .grain {
          position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .glow-orb {
          position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0;
        }

        .nav-link {
          padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 500;
          font-size: 14px; background: transparent; border: none; transition: all 0.2s;
          color: #888; font-family: 'Syne', sans-serif;
        }
        .nav-link:hover { color: #e8e8f0; background: rgba(255,255,255,0.05); }
        .nav-link.active { color: #FFD600; font-weight: 700; background: rgba(255,214,0,0.08); }

        .btn-primary {
          padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 14px;
          cursor: pointer; border: none; background: #FFD600; color: #0a0a0f;
          transition: all 0.2s; font-family: 'Syne', sans-serif;
        }
        .btn-primary:hover { background: #ffe033; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,214,0,0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-ghost {
          padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 14px;
          cursor: pointer; background: transparent; color: #888;
          border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; font-family: 'Syne', sans-serif;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: #e8e8f0; background: rgba(255,255,255,0.04); }

        .btn-secondary {
          padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 14px;
          cursor: pointer; background: rgba(255,255,255,0.06); color: #e8e8f0;
          border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s; font-family: 'Syne', sans-serif;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        .job-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.25s;
        }
        .job-card:hover {
          background: rgba(255,214,0,0.04); border-color: rgba(255,214,0,0.2);
          transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .list-item {
          display: flex; align-items: center; gap: 16px; padding: 20px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s;
        }
        .list-item:hover {
          background: rgba(255,214,0,0.03); border-color: rgba(255,214,0,0.15);
          transform: translateX(4px);
        }

        .filter-opt {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px; border-radius: 8px; cursor: pointer;
          color: #888; font-size: 13px; font-weight: 500; margin-bottom: 4px;
          border: none; width: 100%; text-align: left; background: transparent;
          transition: all 0.15s; font-family: 'Syne', sans-serif;
        }
        .filter-opt:hover { background: rgba(255,255,255,0.04); color: #e8e8f0; }
        .filter-opt.active { background: rgba(255,214,0,0.08); color: #FFD600; font-weight: 700; }

        .dash-nav-item {
          display: flex; align-items: center; gap: 10px; padding: 12px 24px;
          cursor: pointer; color: #666; font-weight: 500; font-size: 14px;
          border-left: 2px solid transparent; transition: all 0.15s;
          font-family: 'Syne', sans-serif;
        }
        .dash-nav-item:hover { color: #e8e8f0; background: rgba(255,255,255,0.03); }
        .dash-nav-item.active { color: #FFD600; background: rgba(255,214,0,0.06); border-left-color: #FFD600; font-weight: 700; }

        .tag {
          display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px;
          font-weight: 600; background: rgba(255,255,255,0.06); color: #888;
          border: 1px solid rgba(255,255,255,0.08); margin-right: 6px; margin-bottom: 6px;
        }
        .tag-yellow { background: rgba(255,214,0,0.12); color: #FFD600; border-color: rgba(255,214,0,0.25); }
        .tag-green { background: rgba(62,207,142,0.12); color: #3ECF8E; border-color: rgba(62,207,142,0.25); }
        .tag-orange { background: rgba(255,107,53,0.12); color: #FF6B35; border-color: rgba(255,107,53,0.25); }
        .tag-purple { background: rgba(162,89,255,0.12); color: #A259FF; border-color: rgba(162,89,255,0.25); }

        .input-field {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 12px 16px; color: #e8e8f0; font-size: 15px;
          font-family: 'Syne', sans-serif; outline: none; margin-bottom: 14px;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: rgba(255,214,0,0.4); }
        .input-field::placeholder { color: #444; }

        textarea.input-field { min-height: 100px; resize: vertical; }

        select.input-field { cursor: pointer; }

        .stat-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 20px 24px; transition: all 0.2s;
        }
        .stat-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px); display: flex; align-items: center;
          justify-content: center; z-index: 200;
        }
        .modal-box {
          background: #13131a; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 40px; width: min(480px, 95vw);
          max-height: 90vh; overflow-y: auto;
        }

        .hero-title {
          font-size: clamp(40px, 6vw, 80px); font-weight: 900;
          letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 20px;
        }

        .search-bar {
          display: flex; gap: 12px; max-width: 680px; margin: 0 auto;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 12px 16px; align-items: center;
          transition: border-color 0.2s;
        }
        .search-bar:focus-within { border-color: rgba(255,214,0,0.3); }

        .search-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #e8e8f0; font-size: 16px; font-family: 'Syne', sans-serif;
        }
        .search-input::placeholder { color: #444; }

        .search-select {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #aaa; padding: 8px 12px; font-size: 14px;
          font-family: 'Syne', sans-serif; outline: none; cursor: pointer;
        }

        .detail-section {
          background: rgba(255,255,255,0.02); border-radius: 14px; padding: 24px;
          margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.04);
        }

        .alert-banner {
          background: rgba(255,214,0,0.06); border: 1px solid rgba(255,214,0,0.15);
          border-radius: 14px; padding: 16px 20px; margin-bottom: 16px;
          display: flex; gap: 12px; align-items: flex-start;
          transition: all 0.2s;
        }
        .alert-banner:hover { background: rgba(255,214,0,0.09); }

        .cta-banner {
          margin: 0 40px 60px;
          background: linear-gradient(135deg, #FFD600 0%, #FF6B35 100%);
          border-radius: 24px; padding: 48px 40px;
          display: flex; justify-content: space-between; align-items: center;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.4s; opacity: 0; }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .pulse { animation: pulse 2s ease-in-out infinite; }

        .logo-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(255,255,255,0.06); display: flex; align-items: center;
          justify-content: center; font-size: 20px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .info-box {
          background: rgba(255,255,255,0.02); border-radius: 14px; padding: 24px;
          border: 1px solid rgba(255,255,255,0.04); align-self: start; position: sticky; top: 80px;
        }

        .back-btn {
          color: #888; font-size: 14px; cursor: pointer; margin-bottom: 24px;
          display: flex; align-items: center; gap: 6px; background: none;
          border: none; font-family: 'Syne', sans-serif; transition: color 0.2s;
        }
        .back-btn:hover { color: #FFD600; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Background effects */}
      <div className="grain" />
      <div className="glow-orb" style={{ width: 600, height: 600, background: "rgba(255,214,0,0.04)", top: -200, right: -100 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: "rgba(255,107,53,0.03)", bottom: 100, left: -100 }} />

      {/* Navbar */}
      <nav style={{ background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("home")}>
          <span style={{ fontSize: 22, color: "#FFD600" }}>⚡</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff" }}>JobHunt</div>
            <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700, letterSpacing: "0.05em", marginTop: -4 }}>No more broke era.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[["home", "Home"], ["jobs", "Hunt Jobs"], ["notifications", "🔔"]].map(([id, label]) => (
            <button key={id} className={`nav-link ${page === id ? "active" : ""}`} onClick={() => nav(id)}>{label}</button>
          ))}
          {loggedIn ? (
            <>
              <button className={`nav-link ${(page === "candidate" || page === "employer") ? "active" : ""}`} onClick={() => nav(userType === "employer" ? "employer" : "candidate")}>Dashboard</button>
              <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => { setLoggedIn(false); setUserType(null); nav("home"); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setAuthMode("login")}>Login</button>
              <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setAuthMode("signup")}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* Pages */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {page === "home" && <HomePage
          nav={nav} search={search} setSearch={setSearch}
          locationFilter={locationFilter} setLocationFilter={setLocationFilter}
          hoveredCard={hoveredCard} setHoveredCard={setHoveredCard}
          setSelectedJob={setSelectedJob}
        />}
        {page === "jobs" && <JobsPage
          nav={nav} search={search} setSearch={setSearch}
          locationFilter={locationFilter} setLocationFilter={setLocationFilter}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          filtered={filtered} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard}
          setSelectedJob={setSelectedJob}
        />}
        {page === "detail" && <DetailPage
          selectedJob={selectedJob} nav={nav} handleApply={handleApply} applied={applied}
        />}
        {page === "apply" && <ApplyPage
          applyJob={applyJob} nav={nav} applyForm={applyForm} setApplyForm={setApplyForm}
          applySuccess={applySuccess} submitApplication={submitApplication}
          setSelectedJob={setSelectedJob} setApplySuccess={setApplySuccess}
        />}
        {page === "candidate" && <CandidateDash
          nav={nav} applied={applied} dashTab={dashTab} setDashTab={setDashTab}
          setLoggedIn={setLoggedIn} setUserType={setUserType}
        />}
        {page === "employer" && <EmployerDash
          nav={nav} empTab={empTab} setEmpTab={setEmpTab}
          setLoggedIn={setLoggedIn} setUserType={setUserType}
        />}
        {page === "notifications" && <NotificationsPage notifications={notifications} />}
      </div>

      {/* Auth Modal */}
      {authMode && (
        <div className="modal-overlay" onClick={() => setAuthMode(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
              {authMode === "login" ? "Welcome back 👋" : "Join JobHunt 🚀"}
            </div>
            <div style={{ color: "#555", marginBottom: 28, fontSize: 14 }}>
              {authMode === "login" ? "Pick up where you left off" : "No more broke era starts here"}
            </div>
            {authMode === "signup" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[["candidate", "🎯 Job Seeker"], ["employer", "🏢 Employer"]].map(([type, label]) => (
                  <button key={type} onClick={() => setUserType(type)} style={{
                    flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${userType === type ? "#FFD600" : "rgba(255,255,255,0.1)"}`,
                    background: userType === type ? "rgba(255,214,0,0.08)" : "transparent",
                    color: userType === type ? "#FFD600" : "#888",
                    fontWeight: 700, fontFamily: "Syne, sans-serif", transition: "all 0.2s"
                  }}>{label}</button>
                ))}
              </div>
            )}
            <input className="input-field" placeholder="Email address" type="email" />
            <input className="input-field" placeholder="Password" type="password" />
            {authMode === "signup" && <input className="input-field" placeholder="Confirm password" type="password" />}
            <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15, borderRadius: 12 }} onClick={() => {
              setLoggedIn(true); setUserType(userType || "candidate"); setAuthMode(null);
              nav(userType === "employer" ? "employer" : "candidate");
            }}>
              {authMode === "login" ? "Login →" : "Create Account →"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16, color: "#555", fontSize: 13 }}>
              {authMode === "login" ? "New here? " : "Already have an account? "}
              <span style={{ color: "#FFD600", cursor: "pointer", fontWeight: 700 }} onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
                {authMode === "login" ? "Sign up" : "Login"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoIcon({ company, logo, size = 44, fontSize = 20, radius = 12 }) {
  const color = companyColors[company] || "#fff";
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize, color, border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
      {logo}
    </div>
  );
}

function Tag({ children, variant = "default" }) {
  const cls = variant === "yellow" ? "tag tag-yellow" : variant === "green" ? "tag tag-green" : variant === "orange" ? "tag tag-orange" : variant === "purple" ? "tag tag-purple" : "tag";
  return <span className={cls}>{children}</span>;
}

function HomePage({ nav, search, setSearch, locationFilter, setLocationFilter, hoveredCard, setHoveredCard, setSelectedJob }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: "80px 40px 60px", textAlign: "center" }}>
        <div className="fade-up fade-up-1" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#FFD600", textTransform: "uppercase", marginBottom: 16 }}>
          <span className="pulse">⚡</span> 230+ Jobs Available
        </div>
        <h1 className="hero-title fade-up fade-up-2">
          No more<br /><span style={{ color: "#FFD600" }}>broke era 🚀</span>
        </h1>
        <p className="fade-up fade-up-3" style={{ color: "#888", fontSize: 18, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
          Hunt jobs. Build skills. Secure the bag.
        </p>
        <div className="search-bar fade-up fade-up-4">
          <span style={{ color: "#555", fontSize: 18 }}>🔍</span>
          <input className="search-input" placeholder="Job title, keyword..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="search-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            <option value="">📍 Location</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
          <button className="btn-primary" onClick={() => nav("jobs")}>HUNT</button>
        </div>
      </div>

      {/* Hot Opportunities */}
      <div style={{ padding: "0 40px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>🔥 Hot Opportunities</span>
          <button className="btn-ghost" onClick={() => nav("jobs")}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {JOBS.slice(0, 4).map((job, i) => (
            <div key={job.id} className={`job-card fade-up fade-up-${Math.min(i + 1, 4)}`}
              onMouseEnter={() => setHoveredCard(job.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => { setSelectedJob(job); nav("detail"); }}>
              <LogoIcon company={job.company} logo={job.logo} />
              <div style={{ height: 16 }} />
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.02em" }}>{job.title}</div>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>{job.company} · {job.location}</div>
              <div>
                <Tag>{job.type}</Tag>
                {job.tags.map(t => <Tag key={t} variant="yellow">{t}</Tag>)}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FFD600", marginTop: 12 }}>{job.salary}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{job.posted}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner">
        <div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#0a0a0f", letterSpacing: "-0.03em" }}>Your dream job is one hunt away.</div>
          <div style={{ color: "rgba(10,10,15,0.7)", marginTop: 8, fontSize: 16 }}>Hunt it. Get it. Live it. 💜</div>
        </div>
        <button style={{ padding: "14px 28px", fontSize: 16, borderRadius: 14, fontWeight: 900, cursor: "pointer", border: "none", background: "#0a0a0f", color: "#FFD600", fontFamily: "Syne, sans-serif", transition: "all 0.2s" }} onClick={() => nav("jobs")}>
          Start Hunting Now →
        </button>
      </div>
    </div>
  );
}

function JobsPage({ nav, search, setSearch, locationFilter, setLocationFilter, typeFilter, setTypeFilter, filtered, hoveredCard, setHoveredCard, setSelectedJob }) {
  const types = ["Full Time", "Part Time", "Contract", "Internship"];
  const locs = ["Remote", "On-site", "Hybrid"];
  const exps = ["Entry Level", "Mid Level", "Senior Level"];
  return (
    <div style={{ display: "flex", gap: 24, padding: "32px 40px" }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f0", marginBottom: 16 }}>FILTERS</div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#555", textTransform: "uppercase", marginBottom: 12 }}>Job Type</div>
          {types.map(t => <button key={t} className={`filter-opt ${typeFilter === t ? "active" : ""}`} onClick={() => setTypeFilter(typeFilter === t ? "" : t)}>{t}</button>)}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#555", textTransform: "uppercase", marginBottom: 12 }}>Location</div>
          {locs.map(l => <button key={l} className={`filter-opt ${locationFilter === l ? "active" : ""}`} onClick={() => setLocationFilter(locationFilter === l ? "" : l)}>{l}</button>)}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#555", textTransform: "uppercase", marginBottom: 12 }}>Experience</div>
          {exps.map(e => <button key={e} className="filter-opt">{e}</button>)}
        </div>
        <button className="btn-ghost" style={{ width: "100%" }} onClick={() => { setTypeFilter(""); setLocationFilter(""); }}>Clear all</button>
      </div>

      {/* List */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 20, color: "#888", fontSize: 14 }}>
          Found <strong style={{ color: "#FFD600" }}>{filtered.length}</strong> jobs 🔥
        </div>
        <div className="search-bar" style={{ maxWidth: "none", marginBottom: 20 }}>
          <span style={{ color: "#555" }}>🔍</span>
          <input className="search-input" placeholder="Hunt jobs..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="search-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            <option value="">📍 Location</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
          <button className="btn-primary">HUNT</button>
        </div>
        {filtered.map(job => (
          <div key={job.id} className="list-item"
            onMouseEnter={() => setHoveredCard(`list${job.id}`)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => { setSelectedJob(job); nav("detail"); }}>
            <LogoIcon company={job.company} logo={job.logo} size={48} fontSize={22} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 2 }}>{job.title}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{job.company} · {job.location} · {job.type}</div>
              <div style={{ marginTop: 8 }}>
                {job.tags.map(t => <Tag key={t} variant="yellow">{t}</Tag>)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: "#FFD600", fontSize: 15 }}>{job.salary}</div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>{job.posted}</div>
              <button className="btn-ghost" style={{ marginTop: 8, padding: "6px 14px", fontSize: 12 }} onClick={e => { e.stopPropagation(); setSelectedJob(job); nav("detail"); }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailPage({ selectedJob, nav, handleApply, applied }) {
  if (!selectedJob) return null;
  const j = selectedJob;
  const isApplied = applied.some(a => a.id === j.id);
  return (
    <div style={{ padding: "32px 40px", maxWidth: 900, margin: "0 auto" }}>
      <button className="back-btn" onClick={() => nav("jobs")}>← Back to jobs</button>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <LogoIcon company={j.company} logo={j.logo} size={56} fontSize={26} radius={14} />
          <div>
            <div style={{ color: "#888", fontSize: 14 }}>{j.company}</div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em" }}>{j.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <Tag>{j.location}</Tag>
          <Tag variant="green">{j.type}</Tag>
          <Tag variant="orange">{j.experience}</Tag>
          <span className="tag tag-yellow" style={{ fontWeight: 800, fontSize: 15 }}>{j.salary}</span>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "14px 32px", fontSize: 16, borderRadius: 14, fontWeight: 900, opacity: isApplied ? 0.6 : 1 }}
          onClick={() => !isApplied && handleApply(j)}
          disabled={isApplied}
        >
          {isApplied ? "✅ Applied" : "🎯 Apply Now"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        <div>
          <div className="detail-section">
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>About the role</div>
            <p style={{ color: "#888", lineHeight: 1.7, fontSize: 15 }}>{j.description}</p>
          </div>
          <div className="detail-section">
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>What you'll do</div>
            {j.responsibilities.map((r, i) => (
              <div key={i} style={{ color: "#888", fontSize: 14, marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: "#FFD600" }}>▸</span>{r}
              </div>
            ))}
          </div>
          <div className="detail-section">
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>What we offer</div>
            {j.offers.map((o, i) => (
              <div key={i} style={{ color: "#888", fontSize: 14, marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: "#3ECF8E" }}>✓</span>{o}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="info-box">
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 20 }}>Job Info</div>
            {[["Posted", j.postedDate], ["Job Type", j.type], ["Experience", "2+ Years"], ["Location", j.location], ["Salary", j.salary]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 13 }}>
                <span style={{ color: "#555", fontWeight: 500 }}>{label}</span>
                <span style={{ color: "#e8e8f0", fontWeight: 600, textAlign: "right" }}>{val}</span>
              </div>
            ))}
            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: 16, padding: 14, fontSize: 15, borderRadius: 12, fontWeight: 900, opacity: isApplied ? 0.6 : 1 }}
              onClick={() => !isApplied && handleApply(j)}
              disabled={isApplied}
            >
              {isApplied ? "✅ Applied" : "🎯 Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplyPage({ applyJob, nav, applyForm, setApplyForm, applySuccess, submitApplication, setSelectedJob, setApplySuccess }) {
  if (!applyJob) return null;
  if (applySuccess) return (
    <div style={{ padding: "40px", maxWidth: 640, margin: "0 auto", textAlign: "center", paddingTop: 80 }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
      <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>Application Submitted!</div>
      <div style={{ color: "#888", fontSize: 16, marginBottom: 32 }}>
        You've applied for <strong style={{ color: "#FFD600" }}>{applyJob.title}</strong> at <strong style={{ color: "#FFD600" }}>{applyJob.company}</strong>. We'll notify you of any updates.
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn-primary" onClick={() => { nav("jobs"); setApplySuccess(false); }}>Hunt More Jobs</button>
        <button className="btn-ghost" onClick={() => { nav("candidate"); setApplySuccess(false); }}>My Dashboard</button>
      </div>
    </div>
  );
  return (
    <div style={{ padding: "40px", maxWidth: 640, margin: "0 auto" }}>
      <button className="back-btn" onClick={() => { setSelectedJob(applyJob); nav("detail"); }}>← Back</button>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 6 }}>Apply for {applyJob.title}</div>
      <div style={{ color: "#888", marginBottom: 32 }}>{applyJob.company} · {applyJob.location} · {applyJob.salary}</div>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Information</div>
        <input className="input-field" placeholder="Full Name" value={applyForm.name} onChange={e => setApplyForm(p => ({ ...p, name: e.target.value }))} />
        <input className="input-field" placeholder="Email Address" type="email" value={applyForm.email} onChange={e => setApplyForm(p => ({ ...p, email: e.target.value }))} />
        <input className="input-field" placeholder="Phone Number" value={applyForm.phone} onChange={e => setApplyForm(p => ({ ...p, phone: e.target.value }))} />
        <textarea className="input-field" placeholder="Tell us why you're the one! ✨" value={applyForm.cover} onChange={e => setApplyForm(p => ({ ...p, cover: e.target.value }))} />
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px", textAlign: "center", marginBottom: 14, cursor: "pointer" }}>
          <div style={{ color: "#555", fontSize: 14 }}>📎 Drop your resume here or <span style={{ color: "#FFD600" }}>browse</span></div>
          <div style={{ color: "#444", fontSize: 12, marginTop: 4 }}>PDF, DOC up to 5MB</div>
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16, borderRadius: 14, fontWeight: 900 }} onClick={submitApplication} disabled={!applyForm.name || !applyForm.email}>
          🚀 Submit Application
        </button>
      </div>
    </div>
  );
}

function CandidateDash({ nav, applied, dashTab, setDashTab, setLoggedIn, setUserType }) {
  const tabs = [["dashboard", "📊 Dashboard"], ["applications", "📋 My Applications"], ["saved", "🔖 Saved Jobs"], ["profile", "👤 Profile"]];
  const stats = [{ n: applied.length || 12, l: "Applications" }, { n: 5, l: "Interviews" }, { n: 3, l: "Offers" }, { n: 2, l: "Saved Jobs" }];
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ width: 220, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "32px 0" }}>
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>👤</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Future CEO 💫</div>
          <div style={{ color: "#555", fontSize: 12 }}>Candidate</div>
        </div>
        {tabs.map(([id, label]) => <div key={id} className={`dash-nav-item ${dashTab === id ? "active" : ""}`} onClick={() => setDashTab(id)}>{label}</div>)}
        <div className="dash-nav-item" style={{ color: "#FF4154", marginTop: 8 }} onClick={() => { setLoggedIn(false); setUserType(null); nav("home"); }}>🚪 Logout</div>
      </div>
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Hey there, Future CEO 💫</div>
        <div style={{ color: "#555", marginBottom: 32, fontSize: 14 }}>Your career journey dashboard</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.l} className="stat-card">
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "#FFD600" }}>{s.n}</div>
              <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {(dashTab === "dashboard" || dashTab === "applications") && (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>{dashTab === "dashboard" ? "Recent Applications" : `All Applications (${applied.length || 3})`}</div>
            {[...applied, ...JOBS.slice(0, 3)].slice(0, dashTab === "dashboard" ? 4 : undefined).map((j, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, marginBottom: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                <LogoIcon company={j.company} logo={j.logo} size={40} fontSize={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{j.title}</div>
                  <div style={{ color: "#555", fontSize: 12 }}>{j.company} · {j.salary}</div>
                </div>
                <Tag variant={i % 3 === 1 ? "yellow" : i % 3 === 2 ? "green" : "default"}>
                  {i % 3 === 1 ? "Interview Scheduled" : i % 3 === 2 ? "Offer Received" : "Under Review"}
                </Tag>
              </div>
            ))}
          </div>
        )}
        {dashTab === "profile" && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ fontWeight: 700, marginBottom: 20 }}>Profile Settings</div>
            <input className="input-field" defaultValue="John Doe" placeholder="Full Name" />
            <input className="input-field" defaultValue="john@example.com" placeholder="Email" />
            <input className="input-field" defaultValue="+1 234 567 8900" placeholder="Phone" />
            <textarea className="input-field" defaultValue="Passionate developer looking for the next challenge." placeholder="Bio / Summary" />
            <button className="btn-primary">Save Changes</button>
          </div>
        )}
        {dashTab === "saved" && (
          <div style={{ color: "#555", fontSize: 14 }}>No saved jobs yet. Start hunting! 🔥</div>
        )}
      </div>
    </div>
  );
}

function EmployerDash({ nav, empTab, setEmpTab, setLoggedIn, setUserType }) {
  const tabs = [["dashboard", "📊 Dashboard"], ["jobs", "💼 Jobs"], ["applications", "📋 Applications"], ["profile", "🏢 Company Profile"]];
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ width: 220, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "32px 0" }}>
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>🏢</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Acme Corp 😎</div>
          <div style={{ color: "#555", fontSize: 12 }}>Employer</div>
        </div>
        {tabs.map(([id, label]) => <div key={id} className={`dash-nav-item ${empTab === id ? "active" : ""}`} onClick={() => setEmpTab(id)}>{label}</div>)}
        <div className="dash-nav-item" style={{ color: "#FF4154" }} onClick={() => { setLoggedIn(false); setUserType(null); nav("home"); }}>🚪 Logout</div>
      </div>
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Welcome back, Boss 😎</div>
        <div style={{ color: "#555", marginBottom: 32, fontSize: 14 }}>Your employer command center</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[{ n: 15, l: "Active Jobs" }, { n: 124, l: "Applications" }, { n: 23, l: "Shortlisted" }, { n: 8, l: "Hired" }].map(s => (
            <div key={s.l} className="stat-card">
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "#FFD600" }}>{s.n}</div>
              <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {empTab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>Recent Job Posts</div>
              {JOBS.slice(0, 3).map((j, i) => (
                <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, marginBottom: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <LogoIcon company={j.company} logo={j.logo} size={40} fontSize={18} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{j.title}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>Posted May {15 - i}, 2024</div>
                  </div>
                  <div style={{ color: "#FFD600", fontWeight: 700, fontSize: 14 }}>{[45, 32, 47][i]} Applications</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>Quick Actions</div>
              <button className="btn-primary" style={{ width: "100%", padding: 14, borderRadius: 12, marginBottom: 10 }}>+ Post a New Job</button>
              <button className="btn-secondary" style={{ width: "100%", padding: 14, borderRadius: 12 }}>View All Jobs</button>
            </div>
          </div>
        )}
        {empTab === "jobs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 700 }}>Your Job Posts</div>
              <button className="btn-primary">+ Post New Job</button>
            </div>
            {JOBS.slice(0, 5).map((j, i) => (
              <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, marginBottom: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{j.title}</div>
                  <div style={{ color: "#555", fontSize: 12 }}>{j.salary} · {j.location}</div>
                </div>
                <Tag variant="green">Active</Tag>
                <div style={{ color: "#FFD600", fontWeight: 700, fontSize: 14 }}>{[45, 32, 47, 28, 19][i]} apps</div>
                <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>Edit</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsPage({ notifications }) {
  return (
    <div style={{ padding: "40px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>🔔 Real-Time Alerts</div>
      {notifications.map(n => (
        <div key={n.id} className="alert-banner">
          <span style={{ fontSize: 22 }}>{n.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#e8e8f0", lineHeight: 1.5 }}>{n.text}</div>
            <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>{n.time}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 20, color: "#555", fontSize: 13, textAlign: "center" }}>Stay updated, always. ⚡</div>
    </div>
  );
}
