import { useState } from "react";

/* ─── Task definitions ─────────────────────────────────────────────────── */
const TASKS = [
  {
    id: "linkedin",
    label: "LinkedIn Post",
    description: "~200-word post with hashtags, ready to publish.",
    icon: "💼",
    color: "#8B5CF6",
    num: "I",
  },
  {
    id: "twitter",
    label: "Twitter / X Thread",
    description: "5-tweet thread — hook first, value throughout.",
    icon: "𝕏",
    color: "#A855F7",
    num: "II",
  },
  {
    id: "email",
    label: "Email Newsletter",
    description: "Subject line, preview text, and a 150-word body.",
    icon: "✉",
    color: "#9333EA",
    num: "III",
  },
  {
    id: "video",
    label: "Video Script",
    description: "60-second spoken script: hook, points, call to action.",
    icon: "▶",
    color: "#7C3AED",
    num: "IV",
  },
  {
    id: "seo",
    label: "SEO Meta Copy",
    description: "Page title, meta description, and 5 keywords.",
    icon: "⊕",
    color: "#6D28D9",
    num: "V",
  },
];

const SAMPLE = `Artificial intelligence is transforming how small businesses operate. From automating customer support with chatbots to generating marketing copy in seconds, AI tools are leveling the playing field between startups and enterprise giants. Business owners who once needed entire teams for content, customer service, and data analysis can now accomplish these tasks with a single AI subscription. The key is knowing which tools to use and how to integrate them into your existing workflow without disrupting what already works. In 2025, the businesses that thrive will be those that treat AI not as a replacement for human creativity, but as a force multiplier for it.`;

/* ─── Char feedback ────────────────────────────────────────────────────── */
function CharFeedback({ count }) {
  if (count === 0)    return <span style={f.dim}>Paste anything — articles, posts, notes</span>;
  if (count < 50)     return <span style={f.warn}>Too short — {50 - count} more characters needed</span>;
  if (count < 300)    return <span style={f.ok}>Good length</span>;
  if (count < 1200)   return <span style={f.great}>Great — rich content produces richer outputs</span>;
  return               <span style={f.ok}>{count.toLocaleString()} characters</span>;
}
const f = {
  dim:   { color: "#3A3455", fontFamily: "mono", fontSize: "11px" },
  warn:  { color: "#9333EA", fontFamily: "mono", fontSize: "11px" },
  ok:    { color: "#7C3AED", fontFamily: "mono", fontSize: "11px" },
  great: { color: "#A855F7", fontFamily: "mono", fontSize: "11px" },
};

/* ─── Main app ─────────────────────────────────────────────────────────── */
export default function App() {
  const [input, setInput]       = useState("");
  const [results, setResults]   = useState({});
  const [statuses, setStatuses] = useState({});
  const [running, setRunning]   = useState(false);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied]     = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const allSettled = Object.keys(statuses).length === TASKS.length &&
    TASKS.every((t) => statuses[t.id] === "done" || statuses[t.id] === "error");

  const runAgent = async () => {
    if (input.trim().length < 50 || running) return;
    setRunning(true);
    setResults({});
    setGlobalError(null);
    setExpanded({});
    setStatuses(TASKS.reduce((acc, t) => ({ ...acc, [t.id]: "running" }), {}));

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      const data = await res.json();
      const newStatuses = {};
      const newResults  = {};
      TASKS.forEach((t) => {
        const text = data.results[t.id] || "No output generated.";
        newStatuses[t.id] = text.startsWith("Error:") ? "error" : "done";
        newResults[t.id]  = text;
      });
      setResults(newResults);
      setStatuses(newStatuses);
    } catch (e) {
      setGlobalError(e.message);
      const errStatuses = {};
      const errResults  = {};
      TASKS.forEach((t) => {
        errStatuses[t.id] = "error";
        errResults[t.id]  = `Error: ${e.message}`;
      });
      setStatuses(errStatuses);
      setResults(errResults);
    }

    setRunning(false);
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const canRun = input.trim().length >= 50 && !running;
  const showResults = Object.keys(statuses).length > 0;

  return (
    <div style={s.root}>
      <div style={s.grain} />
      <div style={s.ambientGlow} />

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.navDot} />
          <span style={s.navLogo}>REPURPOSE</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header style={s.hero}>
        <p style={s.eyebrow}>— Content Intelligence —</p>
        <h1 style={s.title}>
          One piece of content.
          <br />
          <em style={s.titleItalic}>Five platforms.</em>
        </h1>
        <p style={s.sub}>
          Paste any blog post, article, or idea. The agent writes your LinkedIn post,
          Twitter thread, email newsletter, video script, and SEO copy — all at once, in seconds.
        </p>

        {/* Steps */}
        <div style={s.steps} className="steps-row">
          {[
            { n: "I",   t: "Paste your content" },
            { n: "II",  t: "Click Generate" },
            { n: "III", t: "Copy and publish" },
          ].map((step, i, arr) => (
            <div key={i} style={s.stepWrap}>
              <div style={s.step} className="step-inner">
                <span style={s.stepRoman}>{step.n}</span>
                <span style={s.stepLabel}>{step.t}</span>
              </div>
              {i < arr.length - 1 && <span style={s.stepArrow} className="step-arrow">→</span>}
            </div>
          ))}
        </div>
      </header>

      {/* ── What you'll get ── */}
      {!showResults && (
        <section style={s.previewSection}>
          <div style={s.dividerRow}>
            <span style={s.dividerLine} />
            <span style={s.dividerLabel}>WHAT YOU'LL GET</span>
            <span style={s.dividerLine} />
          </div>
          <div style={s.previewGrid} className="preview-grid">
            {TASKS.map((task) => (
              <div key={task.id} style={{ ...s.previewCard, borderTopColor: task.color }}>
                <div style={s.previewTop}>
                  <span style={{ ...s.previewRoman, color: task.color }}>{task.num}</span>
                  <span style={s.previewIcon}>{task.icon}</span>
                </div>
                <div style={s.previewLabel}>{task.label}</div>
                <div style={s.previewDesc}>{task.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Input ── */}
      <section style={s.inputSection}>
        <div style={s.inputCard} className="input-card">
          <div style={s.inputBar}>
            <span style={s.inputLabel}>YOUR CONTENT</span>
            <button style={s.sampleBtn} data-try onClick={() => setInput(SAMPLE)}>
              Try an example ↗
            </button>
          </div>

          <textarea
            style={s.textarea}
            placeholder="Paste your article, blog post, newsletter draft, or any long-form content here. The more context you give, the better the outputs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={7}
          />

          <div style={s.inputFooter}>
            <CharFeedback count={input.length} />
            <button
              style={{
                ...s.genBtn,
                opacity: canRun ? 1 : 0.4,
                cursor: canRun ? "pointer" : "not-allowed",
              }}
              onClick={runAgent}
              disabled={!canRun}
            >
              {running ? (
                <span style={s.btnInner}><span style={s.spinner} /> Working on it...</span>
              ) : (
                <span style={s.btnInner}><span>▶</span> Generate All Five</span>
              )}
            </button>
          </div>

          {running && (
            <div style={s.progressBar}>
              <div style={s.progressFill} />
            </div>
          )}

          {globalError && (
            <div style={s.errorBox}>
              <span>⚠</span> {globalError}
            </div>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      {showResults && (
        <section style={s.resultsSection}>
          <div style={s.dividerRow}>
            <span style={s.dividerLine} />
            <span style={s.dividerLabel}>
              {allSettled ? "YOUR OUTPUTS — READY TO USE" : "GENERATING — TASKS COMPLETING IN REAL TIME"}
            </span>
            <span style={s.dividerLine} />
          </div>

          {/* Mini pipeline status bar */}
          <div style={s.pipelineRow}>
            {TASKS.map((task) => {
              const st = statuses[task.id];
              return (
                <div key={task.id} style={s.pipelineItem}>
                  <div
                    style={{
                      ...s.pipelineDot,
                      background:
                        st === "done"    ? task.color
                        : st === "running" ? "transparent"
                        : st === "error"   ? "#4B1D1D"
                        : "#18132A",
                      border: `2px solid ${
                        st === "done"    ? task.color
                        : st === "running" ? task.color
                        : st === "error"   ? "#6B2020"
                        : "#2A2040"
                      }`,
                      boxShadow: st === "running" ? `0 0 10px ${task.color}88` : "none",
                    }}
                  >
                    {st === "done"    && <span style={{ fontSize: "9px" }}>✓</span>}
                    {st === "running" && <span style={s.dotSpinner} />}
                    {st === "error"   && <span style={{ fontSize: "9px" }}>✕</span>}
                  </div>
                  <span
                    style={{
                      ...s.pipelineLabel,
                      color: st === "done" ? task.color : "#3A3055",
                    }}
                  >
                    {task.num}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={s.resultsStack}>
            {TASKS.map((task, idx) => {
              const st      = statuses[task.id];
              const text    = results[task.id];
              const isExp   = !!expanded[task.id];
              const isCopy  = copied === task.id;
              const isError = st === "error";
              const PREV    = 300;
              const isLong  = text && text.length > PREV;

              return (
                <div
                  key={task.id}
                  className="result-card"
                  style={{
                    ...s.resultCard,
                    borderLeftColor: task.color,
                    animationDelay: `${idx * 50}ms`,
                    opacity: st === "running" ? 0.7 : 1,
                  }}
                >
                  {/* Header */}
                  <div style={s.cardHead}>
                    <div style={s.cardHeadLeft}>
                      <span style={{ ...s.cardIcon, color: task.color }}>{task.icon}</span>
                      <div>
                        <div style={s.cardTitle}>{task.label}</div>
                        <div style={{ ...s.cardNum, color: task.color + "88" }}>{task.num} of V</div>
                      </div>
                    </div>
                    <span
                      style={{
                        ...s.statusBadge,
                        background: isError ? "#2A0A0A"
                          : st === "done" ? task.color + "1A"
                          : "#18132A",
                        color: isError ? "#9B1A1A"
                          : st === "done" ? task.color
                          : "#4B4065",
                        borderColor: isError ? "#4B0A0A"
                          : st === "done" ? task.color + "44"
                          : "#2A2040",
                      }}
                    >
                      {st === "running" ? "Generating..." : st === "done" ? "Ready" : "Error"}
                    </span>
                  </div>

                  <div style={{ ...s.cardRule, background: task.color + "1A" }} />

                  {/* Body */}
                  {st === "running" ? (
                    <div style={s.cardLoading}>
                      <span style={s.loadingSpinner} />
                      <span style={s.loadingText}>Writing your {task.label.toLowerCase()}...</span>
                    </div>
                  ) : (
                    <>
                      <p
                        style={{
                          ...s.cardText,
                          color: isError ? "#7A4A4A" : "#7C6FA8",
                        }}
                      >
                        {isExp || !isLong ? text : text.slice(0, PREV) + "…"}
                      </p>

                      {isLong && !isError && (
                        <button
                          data-expand
                          style={{ ...s.expandBtn, color: task.color }}
                          onClick={() => setExpanded((e) => ({ ...e, [task.id]: !e[task.id] }))}
                        >
                          {isExp ? "▲  Collapse" : "▼  Read full output"}
                        </button>
                      )}

                      {!isError && (
                        <button
                          data-copy
                          style={{
                            ...s.copyBtn,
                            background:   isCopy ? task.color : "transparent",
                            borderColor:  task.color + (isCopy ? "FF" : "44"),
                            color:        isCopy ? "#fff" : task.color,
                          }}
                          onClick={() => copyText(text, task.id)}
                        >
                          {isCopy ? "✓  Copied to clipboard!" : "Copy to clipboard"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {allSettled && (
            <div style={s.regenRow}>
              <button style={s.regenBtn} data-regen onClick={runAgent}>
                ↺  Generate again with same content
              </button>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerLine} />
        <div style={s.footerInner} className="footer-inner">
          <span style={s.footerLogo}>REPURPOSE</span>
          <span style={s.footerMeta}>
            Claude Haiku 4.5 · Runs via local server · API key in .env
          </span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #07070A; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07070A; }
        ::-webkit-scrollbar-thumb { background: #2D1B69; border-radius: 2px; }

        textarea:focus {
          outline: none !important;
          border-color: #7C3AED !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12) !important;
        }
        textarea::placeholder { color: #2A2040; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { transform:translateX(-100%); } 100% { transform:translateX(400%); } }
        @keyframes glow    { 0%,100% { opacity:.35; } 50% { opacity:.7; } }
        @keyframes pulse   { 0%,100% { opacity:.5; } 50% { opacity:1; } }

        button[data-try]:hover    { background:#1A1428 !important; color:#8B5CF6 !important; border-color:#4C3080 !important; }
        button[data-regen]:hover  { color:#8B5CF6 !important; border-color:#4C3080 !important; }
        button[data-expand]:hover { opacity:1 !important; }
        button[data-copy]:hover   { opacity:.85; }

        @media (max-width: 768px) {
          .preview-grid { grid-template-columns: repeat(2,1fr) !important; }
          .input-card   { padding: 20px !important; }
          .result-card  { padding: 18px 20px !important; }
          .steps-row    { gap:4px !important; }
          .step-inner   { padding:0 14px !important; }
          .footer-inner { flex-direction:column; align-items:flex-start; gap:8px; }
        }
        @media (max-width: 480px) {
          .preview-grid { grid-template-columns: 1fr !important; }
          .steps-row    { flex-direction:column; align-items:center; gap:16px; }
          .step-arrow   { display:none !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Styles ───────────────────────────────────────────────────────────── */
const mono = "'JetBrains Mono', monospace";
const serif = "'Playfair Display', serif";
const sans  = "'Syne', sans-serif";

const s = {
  root: {
    minHeight: "100vh",
    background: "#07070A",
    color: "#EDE9FE",
    fontFamily: sans,
    overflowX: "hidden",
    position: "relative",
  },

  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
    opacity: 0.55,
    pointerEvents: "none",
    zIndex: 0,
  },

  ambientGlow: {
    position: "absolute",
    top: "-300px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "900px",
    height: "700px",
    background: "radial-gradient(ellipse at 50% 30%, rgba(76,29,149,.28) 0%, rgba(124,58,237,.08) 45%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
    animation: "glow 6s ease-in-out infinite",
  },

  /* Nav */
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 48px",
    borderBottom: "1px solid #13101C",
    position: "relative",
    zIndex: 10,
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  navDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#7C3AED",
    boxShadow: "0 0 8px #7C3AED",
  },
  navLogo: {
    fontFamily: sans,
    fontWeight: 800,
    fontSize: "13px",
    letterSpacing: "0.3em",
    color: "#C4B5FD",
  },

  /* Hero */
  hero: {
    position: "relative",
    zIndex: 1,
    padding: "96px 24px 72px",
    maxWidth: "860px",
    margin: "0 auto",
    textAlign: "center",
  },
  eyebrow: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "0.25em",
    color: "#4C3A80",
    marginBottom: "32px",
  },
  title: {
    fontFamily: serif,
    fontSize: "clamp(52px,7.5vw,96px)",
    fontWeight: 900,
    lineHeight: 1.04,
    letterSpacing: "-0.025em",
    color: "#F3EEFF",
    marginBottom: "28px",
  },
  titleItalic: { fontStyle: "italic", color: "#A855F7", fontWeight: 700 },
  sub: {
    fontSize: "16px",
    lineHeight: 1.75,
    color: "#5A5370",
    maxWidth: "520px",
    margin: "0 auto 52px",
  },

  /* Steps */
  steps: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  stepWrap: { display: "flex", alignItems: "center" },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 32px",
    gap: "6px",
  },
  stepRoman: { fontFamily: serif, fontSize: "22px", fontWeight: 700, color: "#7C3AED", lineHeight: 1 },
  stepLabel: { fontFamily: mono, fontSize: "10px", letterSpacing: "0.08em", color: "#4B4065" },
  stepArrow: { color: "#2D2540", fontSize: "14px", flexShrink: 0 },

  /* Section divider */
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "36px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(to right, transparent, #1E1630)",
  },
  dividerLabel: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "0.2em",
    color: "#3D3060",
    flexShrink: 0,
  },

  /* Preview cards */
  previewSection: {
    maxWidth: "860px",
    margin: "0 auto 80px",
    padding: "0 24px",
    position: "relative",
    zIndex: 1,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
  },
  previewCard: {
    background: "#0C0A14",
    border: "1px solid #18132A",
    borderTop: "2px solid",
    borderRadius: "6px",
    padding: "20px 16px",
  },
  previewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  previewRoman: { fontFamily: serif, fontSize: "18px", fontWeight: 700, lineHeight: 1 },
  previewIcon:  { fontSize: "14px", opacity: 0.6 },
  previewLabel: {
    fontFamily: sans,
    fontWeight: 700,
    fontSize: "11px",
    color: "#EDE9FE",
    marginBottom: "6px",
  },
  previewDesc: {
    fontFamily: mono,
    fontSize: "10px",
    lineHeight: 1.6,
    color: "#3A3055",
  },

  /* Input */
  inputSection: {
    maxWidth: "780px",
    margin: "0 auto 72px",
    padding: "0 24px",
    position: "relative",
    zIndex: 1,
  },
  inputCard: {
    background: "#0C0A14",
    border: "1px solid #1E1630",
    borderRadius: "10px",
    padding: "28px",
    boxShadow: "0 0 60px rgba(76,29,149,.08), 0 0 0 1px rgba(124,58,237,.06)",
  },
  inputBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  inputLabel: { fontFamily: mono, fontSize: "10px", letterSpacing: "0.2em", color: "#4C3A80" },
  sampleBtn: {
    background: "none",
    border: "1px solid #2A2040",
    color: "#5B4890",
    fontSize: "11px",
    padding: "5px 14px",
    cursor: "pointer",
    fontFamily: mono,
    borderRadius: "100px",
    letterSpacing: "0.05em",
    transition: "all .15s",
  },
  textarea: {
    width: "100%",
    background: "#09080F",
    border: "1px solid #1A1428",
    color: "#C4B5FD",
    fontSize: "14px",
    lineHeight: 1.8,
    padding: "18px 20px",
    resize: "vertical",
    fontFamily: mono,
    borderRadius: "6px",
    transition: "border-color .2s, box-shadow .2s",
    display: "block",
    minHeight: "160px",
  },
  inputFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    flexWrap: "wrap",
    gap: "12px",
  },
  genBtn: {
    background: "linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #8B5CF6 100%)",
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: sans,
    letterSpacing: "0.08em",
    borderRadius: "6px",
    boxShadow: "0 4px 24px rgba(124,58,237,.35)",
    flexShrink: 0,
    transition: "opacity .2s",
  },
  btnInner: { display: "flex", alignItems: "center", gap: "10px" },
  spinner: {
    display: "inline-block",
    width: "13px",
    height: "13px",
    border: "2px solid rgba(255,255,255,.2)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin .75s linear infinite",
    flexShrink: 0,
  },
  progressBar: {
    marginTop: "20px",
    height: "2px",
    background: "#18132A",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "40%",
    background: "linear-gradient(90deg, transparent, #7C3AED, #A855F7, transparent)",
    animation: "shimmer 1.8s ease-in-out infinite",
  },
  errorBox: {
    marginTop: "14px",
    padding: "12px 16px",
    background: "rgba(109,40,217,.08)",
    border: "1px solid rgba(109,40,217,.2)",
    borderRadius: "6px",
    color: "#A78BFA",
    fontFamily: mono,
    fontSize: "12px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  /* Results */
  resultsSection: {
    maxWidth: "780px",
    margin: "0 auto 80px",
    padding: "0 24px",
    position: "relative",
    zIndex: 1,
  },

  /* Pipeline */
  pipelineRow: {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    marginBottom: "32px",
  },
  pipelineItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  pipelineDot: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    transition: "all .4s",
  },
  dotSpinner: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    border: "2px solid rgba(255,255,255,.15)",
    borderTopColor: "#A855F7",
    borderRadius: "50%",
    animation: "spin .75s linear infinite",
  },
  pipelineLabel: {
    fontFamily: serif,
    fontSize: "11px",
    fontWeight: 700,
    transition: "color .4s",
  },

  resultsStack: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  resultCard: {
    background: "#0C0A14",
    border: "1px solid #1E1630",
    borderLeft: "3px solid",
    borderRadius: "8px",
    padding: "24px 28px",
    animation: "fadeUp .4s ease both",
    transition: "opacity .3s",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  cardHeadLeft: { display: "flex", alignItems: "center", gap: "14px" },
  cardIcon:  { fontSize: "20px", lineHeight: 1, flexShrink: 0 },
  cardTitle: { fontFamily: sans, fontWeight: 700, fontSize: "15px", color: "#E9D5FF", letterSpacing: "-0.01em" },
  cardNum:   { fontFamily: serif, fontSize: "11px", marginTop: "2px", letterSpacing: "0.05em" },
  statusBadge: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "0.12em",
    padding: "4px 10px",
    borderRadius: "100px",
    border: "1px solid",
    flexShrink: 0,
    transition: "all .3s",
  },
  cardRule: { height: "1px", marginBottom: "16px", borderRadius: "1px" },

  cardLoading: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 0",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid #2A2040",
    borderTopColor: "#7C3AED",
    borderRadius: "50%",
    animation: "spin .75s linear infinite",
    flexShrink: 0,
  },
  loadingText: {
    fontFamily: mono,
    fontSize: "12px",
    color: "#4B4065",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  cardText: {
    fontFamily: mono,
    fontSize: "13px",
    lineHeight: 1.85,
    whiteSpace: "pre-wrap",
  },
  expandBtn: {
    display: "block",
    marginTop: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "0.08em",
    opacity: 0.75,
    padding: 0,
    transition: "opacity .15s",
  },
  copyBtn: {
    display: "block",
    marginTop: "18px",
    padding: "10px 22px",
    border: "1px solid",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "0.1em",
    fontWeight: 500,
    transition: "all .18s",
  },

  regenRow: { display: "flex", justifyContent: "center", marginTop: "32px" },
  regenBtn: {
    background: "none",
    border: "1px solid #2A2040",
    color: "#5B4890",
    padding: "10px 24px",
    cursor: "pointer",
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "0.1em",
    borderRadius: "100px",
    transition: "all .2s",
  },

  /* Footer */
  footer: { position: "relative", zIndex: 1, padding: "0 48px 48px" },
  footerLine: { height: "1px", background: "#13101C", marginBottom: "28px" },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  footerLogo: { fontFamily: sans, fontWeight: 800, fontSize: "11px", letterSpacing: "0.3em", color: "#2D2048" },
  footerMeta: { fontFamily: mono, fontSize: "10px", letterSpacing: "0.06em", color: "#211B35" },
};
