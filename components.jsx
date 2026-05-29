/* All UI components for the redesigned portfolio canvas.
   Exposes: Toolbar, Canvas, NodePanel, StatusBar, Minimap to window. */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ── Sizing constants ───────────────────────────────────────────────────── */
const NODE_W = 244;
const NODE_H = 88;
const CAT_W  = 244;
const CAT_H  = 88;

const isCategory = (kind) => kind && kind.startsWith('category-');

const dims = (kind) =>
  isCategory(kind) ? { w: CAT_W, h: CAT_H } : { w: NODE_W, h: NODE_H };

const accentForKind = {
  trigger: '#00C896',     // mint
  branch: '#F5B544',      // amber
  about: '#FF6D5A',       // coral
  loop: '#6E6EF6',        // violet
  action: '#8B93A8',      // muted
  ai: '#6E6EF6',
  data: '#00C896',
  project: '#FF6D5A',
  external: '#8B93A8',
  terminal: '#FF6D5A',
  'category-coral': '#FF6D5A',
  'category-amber': '#F5B544',
  'category-violet': '#6E6EF6',
};

/* ── Icons ──────────────────────────────────────────────────────────────── */
function Icon({ name, size = 18, stroke = 1.75 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'sparkles': return <svg {...props}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z"/></svg>;
    case 'branch':   return <svg {...props}><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8"/><path d="M8 6h4a4 4 0 014 4v0"/><path d="M8 18h4a4 4 0 004-4v0"/></svg>;
    case 'user':     return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case 'loop':     return <svg {...props}><path d="M3 12a9 9 0 019-9c2.5 0 4.8 1 6.4 2.6L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9c-2.5 0-4.8-1-6.4-2.6L3 16"/><path d="M3 21v-5h5"/></svg>;
    case 'briefcase':return <svg {...props}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M3 13h18"/></svg>;
    case 'medal':    return <svg {...props}><path d="M7 3l2 6"/><path d="M17 3l-2 6"/><circle cx="12" cy="15" r="6"/><path d="M9 18l-1 4 4-2 4 2-1-4"/></svg>;
    case 'folder':   return <svg {...props}><path d="M3 6a2 2 0 012-2h4l2 3h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"/></svg>;
    case 'chart':    return <svg {...props}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>;
    case 'mail':     return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>;
    case 'external': return <svg {...props}><path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5"/></svg>;
    case 'play':     return <svg {...props} fill="currentColor" stroke="none"><path d="M6 4l14 8-14 8V4z"/></svg>;
    case 'x':        return <svg {...props}><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>;
    case 'chev-r':   return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chev-l':   return <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case 'minus':    return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'maximize': return <svg {...props}><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>;
    case 'github':   return <svg {...props}><path d="M9 19c-4 1.5-4-2.5-6-3"/><path d="M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6 0-1.4-.4-2.4-1.2-3.2.1-.4.6-1.6-.1-3.2 0 0-1-.3-3.4 1.2a11.5 11.5 0 00-6 0C6.9 2.8 5.9 3.1 5.9 3.1c-.7 1.6-.2 2.8-.1 3.2-.8.8-1.2 1.8-1.2 3.2 0 4.6 2.7 5.7 5.5 6-.4.4-.7 1-.7 2V21"/></svg>;
    case 'cmd':      return <svg {...props}><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M6 9h12"/><path d="M9 6v12"/></svg>;
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg>;
    case 'corner-down-left': return <svg {...props}><path d="M9 10l-5 5 5 5"/><path d="M20 4v7a4 4 0 01-4 4H4"/></svg>;
    case 'arrow-up': return <svg {...props}><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>;
    case 'arrow-down': return <svg {...props}><path d="M12 5v14"/><path d="M5 12l7 7 7-7"/></svg>;
    case 'resume':   return <svg {...props}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>;
    default: return null;
  }
}

function BrandBadge({ letter, bg, fg = '#fff', size = 28 }) {
  return (
    <span style={{
      display: 'grid', placeItems: 'center',
      width: size, height: size, borderRadius: 6,
      background: bg, color: fg,
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontWeight: 700, fontSize: size * 0.46, letterSpacing: '-0.02em',
    }}>{letter}</span>
  );
}

function NodeIcon({ icon, accent, size = 36 }) {
  const brandIcons = {
    n8n:      { letter: 'N', bg: '#F2613C', fg: '#fff' },
    claude:   { letter: 'C', bg: '#D97757', fg: '#fff' },
    groq:     { letter: 'G', bg: '#F55036', fg: '#fff' },
    telegram: { letter: 'T', bg: '#229ED9', fg: '#fff' },
    airtable: { letter: 'A', bg: '#FCB400', fg: '#1A1814' },
    fitme:    { letter: 'F', bg: '#FF6D5A', fg: '#0E1119' },
    excel:    { letter: 'X', bg: '#107C41', fg: '#fff' },
    powerbi:  { letter: 'P', bg: '#F2C811', fg: '#1A1814' },
  };
  if (brandIcons[icon]) {
    const b = brandIcons[icon];
    return <BrandBadge letter={b.letter} bg={b.bg} fg={b.fg} size={size * 0.78} />;
  }
  return (
    <span style={{
      display: 'grid', placeItems: 'center',
      width: size, height: size, borderRadius: 6,
      background: 'rgba(255,255,255,0.04)',
      color: accent,
    }}>
      <Icon name={icon} size={size * 0.5} />
    </span>
  );
}

/* ── Regular workflow node ─────────────────────────────────────────────── */
function WorkflowNode({ node, isActive, isExecuting, bootDelay, onClick }) {
  const accent = accentForKind[node.kind] ?? '#8B93A8';
  if (isCategory(node.kind)) {
    return <CategoryNode node={node} accent={accent} isActive={isActive} isExecuting={isExecuting} bootDelay={bootDelay} onClick={onClick} />;
  }
  return (
    <button
      type="button"
      onClick={() => onClick(node.id)}
      data-node-id={node.id}
      data-kind={node.kind}
      className={'wf-node' + (isActive ? ' is-active' : '') + (node.id === 'branch' ? ' wf-node--entry' : '')}
      style={{
        position: 'absolute',
        left: node.x, top: node.y,
        width: NODE_W, height: NODE_H,
        '--accent': accent,
        '--boot-delay': bootDelay + 'ms',
      }}
      aria-label={`Open node: ${node.label}. ${node.sublabel}`}
      aria-pressed={isActive ? 'true' : 'false'}
    >
      <span className="wf-node__stripe" />
      <span className="wf-node__body">
        <NodeIcon icon={node.icon} accent={accent} size={42} />
        <span className="wf-node__text">
          <span className="wf-node__title">{node.label}</span>
          <span className="wf-node__sub">{node.sublabel}</span>
        </span>
        <span className="wf-node__ports">
          {node.kind === 'branch' ? (
            <>
              <span className="wf-port" style={{ background: accent }} />
              <span className="wf-port" style={{ background: '#5D6680' }} />
            </>
          ) : node.kind === 'terminal' ? null : (
            <span className="wf-port" style={{ background: accent }} />
          )}
        </span>
      </span>
      {isExecuting && <span className="wf-node__pulse" />}
    </button>
  );
}

/* ── Category hub node — larger, top color bar, glow ───────────────────── */
function CategoryNode({ node, accent, isActive, isExecuting, bootDelay, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(node.id)}
      data-node-id={node.id}
      data-kind={node.kind}
      className={'wf-cat' + (isActive ? ' is-active' : '')}
      style={{
        position: 'absolute',
        left: node.x, top: node.y,
        width: CAT_W, height: CAT_H,
        '--accent': accent,
        '--boot-delay': bootDelay + 'ms',
      }}
      aria-label={`Open category: ${node.label}. ${node.sublabel}`}
      aria-pressed={isActive ? 'true' : 'false'}
    >
      <span className="wf-cat__top" />
      <span className="wf-cat__body">
        <span className="wf-cat__icon">
          <NodeIcon icon={node.icon} accent={accent} size={44} />
        </span>
        <span className="wf-cat__text">
          <span className="wf-cat__title">{node.label}</span>
          <span className="wf-cat__sub">{node.sublabel}</span>
        </span>
        <span className="wf-cat__port" style={{ background: accent }} />
      </span>
      {isExecuting && <span className="wf-cat__pulse" />}
    </button>
  );
}

/* ── Edge — bezier with idle traveling dot ─────────────────────────────── */
function WorkflowEdge({ edge, from, to, accent, isHighlighted, showFlow }) {
  const fd = dims(from.kind);
  const td = dims(to.kind);

  const startX = from.x + fd.w;
  const startY =
    edge.port === 'yes' ? from.y + fd.h * 0.32 :
    edge.port === 'no'  ? from.y + fd.h * 0.68 :
    from.y + fd.h / 2;
  const endX = to.x;
  const endY = to.y + td.h / 2;

  const dx = Math.max(60, (endX - startX) / 2);
  const c1x = startX + dx, c1y = startY;
  const c2x = endX - dx,   c2y = endY;

  const d = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;

  // Duration scales with path length so dots travel evenly.
  const len = Math.hypot(endX - startX, endY - startY);
  const dur = (len / 80).toFixed(1) + 's';

  const baseColor = isHighlighted ? accent : '#242B3D';
  const dotColor = accent;

  return (
    <g className="wf-edge" data-edge={edge.id} style={{ '--edge-delay': (edge._i || 0) * 30 + 'ms' }}>
      <path d={d} fill="none" stroke={baseColor} strokeWidth={isHighlighted ? 2.2 : 1.6} strokeLinecap="round" className="wf-edge__path" pathLength="100" strokeDasharray="100" strokeDashoffset="100" />
      {/* Arrow tip */}
      <circle cx={endX} cy={endY} r="3" fill={baseColor} />
      {/* Idle traveling dot */}
      {showFlow && (
        <g className="wf-edge__dot">
          <circle r="2.4" fill={dotColor}>
            <animateMotion dur={dur} repeatCount="indefinite" rotate="auto" path={d} />
          </circle>
          <circle r="5" fill={dotColor} opacity="0.18">
            <animateMotion dur={dur} repeatCount="indefinite" rotate="auto" path={d} />
          </circle>
        </g>
      )}

      {edge.label && (
        <g transform={`translate(${(startX + endX) / 2}, ${(startY + endY) / 2 - 10})`}>
          <rect x="-34" y="-10" width="68" height="20" rx="3" fill="#161B26" stroke="#242B3D" strokeWidth="1" />
          <text textAnchor="middle" dominantBaseline="middle" fill="#8B93A8" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">{edge.label.toUpperCase()}</text>
        </g>
      )}
    </g>
  );
}

/* ── Sticky note ───────────────────────────────────────────────────────── */
function StickyNote({ x, y, rotate = -2, color = 'yellow', children }) {
  const palette = {
    yellow: { bg: '#F5E642', fg: '#1A1814' },
    coral:  { bg: '#FF6D5A', fg: '#0E1119' },
    mint:   { bg: '#00C896', fg: '#0E1119' },
    violet: { bg: '#6E6EF6', fg: '#fff' },
  }[color];
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `rotate(${rotate}deg)`,
      background: palette.bg, color: palette.fg,
      padding: '10px 14px', borderRadius: 3,
      width: 200, fontFamily: '"Fraunces", serif', fontStyle: 'italic',
      fontSize: 13, lineHeight: 1.5,
      boxShadow: '0 4px 14px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
      pointerEvents: 'none', userSelect: 'none',
    }}>
      <span style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
        width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,0,0,0.25)',
      }} />
      {children}
    </div>
  );
}

/* ── Live execution log (RETIRED — see HeadlineCard below.
   Kept for reference; not rendered, and CSS forces display:none) ─────── */
const LOG_WORKFLOWS = [
  { name: 'pitch_deck.workflow',     actions: ['executed · 2.3s', 'extracted 23 fields', 'filed deck · drive']      },
  { name: 'gmail_pdf_sum.workflow',  actions: ['executed · 1.7s', 'summarized · 4 emails', 'piped to telegram']     },
  { name: 'credflow_doc.workflow',   actions: ['escalated · LN-003', 'reminder sent · LN-008', 'digest pushed']     },
  { name: 'startup_outreach.workflow', actions: ['queued · 5 founders', 'enriched · groq · 580ms', 'drafted · 4 mails'] },
  { name: 'sales_audit.dashboard',   actions: ['refresh · 1.1s', 'measures recomputed', 'snapshot · daily']         },
  { name: 'ipo_analysis.notebook',   actions: ['pull · 196 listings', 'cleaned · 0 nulls', 'dashboard · ok']         },
];
function fmtTime(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}
function generateLogLine() {
  const w = LOG_WORKFLOWS[Math.floor(Math.random() * LOG_WORKFLOWS.length)];
  const a = w.actions[Math.floor(Math.random() * w.actions.length)];
  return { id: Math.random().toString(36).slice(2), time: fmtTime(), name: w.name, action: a };
}
function LiveLog() {
  const [lines, setLines] = useState(() => Array.from({ length: 4 }, () => generateLogLine()));
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setLines(prev => [generateLogLine(), ...prev].slice(0, 4));
    }, 3800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={'livelog' + (collapsed ? ' is-collapsed' : '')} data-no-pan>
      <header className="livelog__head" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand log' : 'Collapse log'}>
        <span className="pulse-dot pulse-dot--sm" />
        <span className="livelog__title">live executions</span>
        <span className="livelog__count">{collapsed ? '' : 'tail · ' + lines.length}</span>
        <span className="livelog__chev">{collapsed ? '▾' : '▴'}</span>
      </header>
      {!collapsed && (
        <ul className="livelog__list">
          {lines.map((l, i) => (
            <li key={l.id} className="livelog__row" style={{ '--age': i }}>
              <span className="livelog__time">{l.time}</span>
              <span className="livelog__name">{l.name}</span>
              <span className="livelog__arrow">→</span>
              <span className="livelog__action">{l.action}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Headline card — sits in the canvas top-left where the LiveLog used to.
   Replaces fake telemetry with the one sentence + three proofs that actually
   move the needle in the first 5 seconds. ───────────────────────────────── */
function HeadlineCard() {
  return (
    <aside className="headline" data-no-pan>
      <h1 className="headline__title">
        I build AI workflows that<br />
        <em>do the boring work.</em>
      </h1>
      <p className="headline__proof">
        <span className="headline__proof-dot" style={{ '--c': '#FF6D5A' }} />8 shipped
        <span className="headline__proof-sep">·</span>
        <span className="headline__proof-dot" style={{ '--c': '#F5B544' }} />World Rank #4 ASME
      </p>
    </aside>
  );
}
window.HeadlineCard = HeadlineCard;

/* ── Plain-English overlay — for non-technical viewers (recruiters, family,
   anyone who doesn't know what "n8n" means). Single screen, no jargon. ──── */
function PlainEnglish({ onClose, onJump }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="plain" role="dialog" aria-modal="true">
        <button className="plain__close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>
        <div className="plain__eyebrow">the 30-second read</div>
        <h2 className="plain__h">Hi, I'm Vinayak.</h2>
        <p className="plain__p">
          Final-year B.Tech at Shiv Nadar University. I build software that
          quietly does the boring work for businesses: sending reports, chasing
          missing documents, summarising email. So people don't have to.
        </p>
        <div className="plain__three">
          <div className="plain__row">
            <button type="button" className="plain__row-tag" onClick={() => onJump('p-pitch-deck')} aria-label="Open Pitch Deck Intake" title="Open this build">
              <Icon name="chev-r" size={14} />
            </button>
            <div>
              <strong>Pitch Deck Intake.</strong> Reads investor PDFs that
              arrive in a founder's inbox and pulls the key information into a
              spreadsheet. Saves about <em>four hours a week</em>.
            </div>
          </div>
          <div className="plain__row">
            <button type="button" className="plain__row-tag" onClick={() => onJump('p-gmail-sum')} aria-label="Open Self-Healing Email Agent" title="Open this build">
              <Icon name="chev-r" size={14} />
            </button>
            <div>
              <strong>Self-Healing Email Agent.</strong> Reads my inbox,
              summarises emails and PDF attachments straight to Telegram, and
              <em> fixes itself if any step fails</em>. Runs fully unattended.
            </div>
          </div>
          <div className="plain__row">
            <button type="button" className="plain__row-tag" onClick={() => onJump('p-fitme')} aria-label="Open FitMe" title="Open this build">
              <Icon name="chev-r" size={14} />
            </button>
            <div>
              <strong>FitMe.</strong> A Chrome extension that lets you try on
              clothes from Zara or Amazon using AI. Built solo.
            </div>
          </div>
        </div>
        <p className="plain__p plain__p--small">
          On the side: World Rank #4 at the ASME EFest XR Challenge (robotics),
          and a live e-commerce site I built for the family pharmacy in two weekends.
        </p>
        <div className="plain__cta-row">
          <a className="pill pill--coral" href="https://mail.google.com/mail/?view=cm&fs=1&to=vk408@snu.edu.in" target="_blank" rel="noopener noreferrer">
            <Icon name="mail" size={12} />
            <span>Email me</span>
          </a>
          <a className="pill pill--ghost" href="uploads/Vinayak_Khandelwal_A_Resume.pdf" target="_blank" rel="noopener noreferrer">
            <Icon name="resume" size={12} />
            <span>Resume PDF</span>
          </a>
          <button className="pill pill--ghost" onClick={onClose}>
            <Icon name="chev-r" size={12} />
            <span>Explore the full site</span>
          </button>
        </div>
      </div>
    </>
  );
}
window.PlainEnglish = PlainEnglish;

/* ── Canvas — pan, dot grid, scan line, nodes + edges ──────────────────── */
function Canvas({ activeNodeId, executingNodeId, onNodeClick, bootPhase, bootKey, idleFlow }) {
  const wrapRef = useRef(null);
  const [tx, setTx] = useState({ x: 0, y: 0, s: 0.66 });
  const [isIdle, setIsIdle] = useState(false);
  const drag = useRef(null);
  const glowRaf = useRef(0);
  const glowCoords = useRef({ x: -300, y: -300 });
  const idleTimer = useRef(null);

  // Broadcast tx + viewport so Minimap can draw a viewport rect.
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('canvas-transform', {
      detail: { tx, viewport: { w: rect.width, h: rect.height } },
    }));
  }, [tx]);

  // Listen for minimap-driven pan requests (center on world point).
  useEffect(() => {
    const onPanTo = (e) => {
      const wrap = wrapRef.current; if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const { x, y } = e.detail;
      setTx(p => ({
        ...p,
        x: rect.width / 2 - x * p.s,
        y: rect.height / 2 - y * p.s,
      }));
    };
    window.addEventListener('canvas-pan-to', onPanTo);
    return () => window.removeEventListener('canvas-pan-to', onPanTo);
  }, []);

  // Wheel zoom toward cursor — must be non-passive to call preventDefault.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaMode === 1 ? 0.05 : 0.001;
      const delta = -e.deltaY * factor;
      setTx(p => {
        const newS = Math.max(0.3, Math.min(1.4, p.s * (1 + delta)));
        const rect = wrap.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        return {
          s: newS,
          x: mx - (mx - p.x) * (newS / p.s),
          y: my - (my - p.y) * (newS / p.s),
        };
      });
    };
    wrap.addEventListener('wheel', onWheel, { passive: false });
    return () => wrap.removeEventListener('wheel', onWheel);
  }, []);

  // Centre the workflow on mount.
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const xs = WORKFLOW.nodes.map(n => n.x);
    const ys = WORKFLOW.nodes.map(n => n.y);
    const ws = WORKFLOW.nodes.map(n => n.x + dims(n.kind).w);
    const hs = WORKFLOW.nodes.map(n => n.y + dims(n.kind).h);
    const minX = Math.min(...xs), maxX = Math.max(...ws);
    const minY = Math.min(...ys), maxY = Math.max(...hs);
    const s = Math.min((rect.width - 120) / (maxX - minX), (rect.height - 120) / (maxY - minY), 0.78);
    setTx({
      x: (rect.width  - (maxX - minX) * s) / 2 - minX * s,
      y: (rect.height - (maxY - minY) * s) / 2 - minY * s,
      s,
    });
  }, []);

  const onPointerDown = (e) => {
    if (e.target.closest('[data-no-pan]')) return;
    drag.current = { x0: e.clientX, y0: e.clientY, tx0: tx.x, ty0: tx.y };
    wrapRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    // Cursor-glow position — throttled to rAF
    const wrap = wrapRef.current;
    if (wrap) {
      const r = wrap.getBoundingClientRect();
      glowCoords.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!glowRaf.current) {
        glowRaf.current = requestAnimationFrame(() => {
          glowRaf.current = 0;
          const w = wrapRef.current;
          if (!w) return;
          w.style.setProperty('--mx', glowCoords.current.x + 'px');
          w.style.setProperty('--my', glowCoords.current.y + 'px');
        });
      }
    }
    // Idle-fade reset
    if (isIdle) setIsIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 30000);

    if (!drag.current) return;
    setTx(p => ({ ...p, x: drag.current.tx0 + (e.clientX - drag.current.x0), y: drag.current.ty0 + (e.clientY - drag.current.y0) }));
  };
  const onPointerUp = () => { drag.current = null; };

  const nodeMap = useMemo(() => Object.fromEntries(WORKFLOW.nodes.map(n => [n.id, n])), []);

  // Workflow bounds for SVG sizing
  const bounds = useMemo(() => {
    const xs = WORKFLOW.nodes.map(n => n.x);
    const ys = WORKFLOW.nodes.map(n => n.y);
    const ws = WORKFLOW.nodes.map(n => n.x + dims(n.kind).w);
    const hs = WORKFLOW.nodes.map(n => n.y + dims(n.kind).h);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...ws) - Math.min(...xs), h: Math.max(...hs) - Math.min(...ys) };
  }, []);

  // World width — used for scan line travel
  const worldW = bounds.w + 400;
  const worldH = bounds.h + 400;
  const worldL = bounds.x - 200;
  const worldT = bounds.y - 200;

  // Which nodes have been "lit" by the scan line — passed to each node
  // via a CSS animation triggered by class+delay. The hook for that lives in
  // the global stylesheet (boot scan triggers nodes via per-node css var delay).
  // Boot phase drives root data attribute.

  return (
    <div
      ref={wrapRef}
      className="canvas"
      data-boot={bootPhase}
      data-boot-key={bootKey}
      data-idle={isIdle ? 'true' : 'false'}
      role="region"
      aria-label="Workflow canvas. Click any node to open it. Press slash or Cmd-K to search."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Dot grid */}
      <div className="canvas__grid" style={{
        backgroundSize: `${28 * tx.s}px ${28 * tx.s}px`,
        backgroundPosition: `${tx.x}px ${tx.y}px`,
      }} />

      {/* Cursor-following soft glow */}
      <div className="canvas__glow" />

      {/* Screen-reader landmark heading */}
      <h1 className="sr-only">Vinayak Khandelwal portfolio. Interactive n8n workflow canvas.</h1>

      {/* Headline card */}
      <HeadlineCard />

      {/* Always-visible sticky note pinned to the canvas (never lost in negative space) */}
      <aside className="canvas__concept" data-no-pan aria-hidden="true">
        this whole site is one n8n workflow :)
      </aside>

      {/* Transformed world */}
      <div className="canvas__world" style={{ transform: `translate(${tx.x}px, ${tx.y}px) scale(${tx.s})` }}>
        {/* Edges */}
        <svg key={'edges-' + bootKey} className="canvas__edges" style={{ left: worldL, top: worldT, width: worldW, height: worldH }}>
          <g transform={`translate(${-worldL}, ${-worldT})`}>
            {WORKFLOW.edges.map((edge, i) => {
              const from = nodeMap[edge.from], to = nodeMap[edge.to];
              if (!from || !to) return null;
              // Edge is "live" when execution packet is on either endpoint
              const isExec = executingNodeId && (from.id === executingNodeId || to.id === executingNodeId);
              const isHi = from.id === activeNodeId || to.id === activeNodeId || isCategory(from.kind) || isExec;
              const acc = isExec ? '#FF6D5A'
                        : isCategory(from.kind) ? accentForKind[from.kind]
                        : (from.id === activeNodeId || to.id === activeNodeId) ? '#FF6D5A'
                        : '#242B3D';
              return <WorkflowEdge key={edge.id} edge={{ ...edge, _i: i }} from={from} to={to} accent={acc} isHighlighted={isHi} showFlow={idleFlow && bootPhase === 'done'} />;
            })}
          </g>
        </svg>

        {/* Boot scan line — sweeps across the WORLD */}
        <div key={'scan-' + bootKey} className="canvas__scan" style={{
          left: worldL, top: worldT, width: worldW, height: worldH,
          '--scan-distance': worldW + 'px',
        }}>
          <div className="canvas__scan-line" />
        </div>

        {/* Nodes */}
        <div key={'nodes-' + bootKey} data-no-pan style={{ position: 'relative' }}>
          {WORKFLOW.nodes.map(n => {
            const delay = Math.max(0, ((n.x - bounds.x) / bounds.w) * 1100);
            return (
              <WorkflowNode
                key={n.id}
                node={n}
                isActive={activeNodeId === n.id}
                isExecuting={executingNodeId === n.id}
                bootDelay={delay}
                onClick={onNodeClick}
              />
            );
          })}

          {/* Sticky notes (kept in world; the always-visible note is mounted outside the world transform) */}
          <StickyNote x={-220} y={ 110} rotate={ 2} color="coral">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vk408@snu.edu.in" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', pointerEvents: 'auto' }}>vk408@snu.edu.in</a>
          </StickyNote>
          <StickyNote x={-220} y={280} rotate={-1} color="mint">Delhi NCR · open to internships + freelance</StickyNote>
          <StickyNote x={1380} y={820} rotate={-2} color="violet">the FitMe try-on photo was never worn. AI made it</StickyNote>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="canvas__zoom" data-no-pan>
        <button onClick={() => setTx(p => ({ ...p, s: Math.min(1.4, p.s + 0.1) }))} aria-label="Zoom in"><Icon name="plus" size={14} /></button>
        <button onClick={() => setTx(p => ({ ...p, s: Math.max(0.3, p.s - 0.1) }))} aria-label="Zoom out"><Icon name="minus" size={14} /></button>
        <button onClick={() => {
          const wrap = wrapRef.current; const rect = wrap.getBoundingClientRect();
          const s = 0.66;
          setTx({ x: (rect.width - bounds.w * s) / 2 - bounds.x * s, y: (rect.height - bounds.h * s) / 2 - bounds.y * s, s });
        }} aria-label="Fit"><Icon name="maximize" size={14} /></button>
        <div className="canvas__zoom-label">{Math.round(tx.s * 100)}%</div>
      </div>
    </div>
  );
}

window.Canvas = Canvas;

/* ── Toolbar — clear hierarchy ─────────────────────────────────────────── */
function Toolbar({ onExecute, onBoot, onOpenSearch, onOpenPlain, isExecuting }) {
  return (
    <header className="toolbar">
      <div className="toolbar__left">
        <div className="toolbar__logo" aria-hidden>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8 11 L16 7 M8 13 L16 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="toolbar__meta">
          <div className="toolbar__filename">
            VINAYAK.PORTFOLIO
            <span className="toolbar__version">PORTFOLIO</span>
          </div>
          <div className="toolbar__status">
            <span className="pulse-dot" />
            <span className="toolbar__active">open to work</span>
          </div>
        </div>
      </div>

      <span className="toolbar__sep" aria-hidden />

      <div className="toolbar__name">
        <span className="toolbar__name-display">Vinayak Khandelwal</span>
        <span className="toolbar__name-role">Builder · Analyst</span>
      </div>

      <span className="toolbar__spacer" />

      <div className="toolbar__right">
        <button type="button" onClick={onOpenPlain} className="btn btn--ghost btn--plain" title="The 30-second version, no jargon">
          <Icon name="play" size={11} />
          <span>30-sec read</span>
        </button>
        <a href="uploads/Vinayak_Khandelwal_A_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--resume" title="Open resume PDF">
          <Icon name="resume" size={13} />
          <span>Resume</span>
        </a>
        <a href="https://github.com/CODEVK31" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--icon" aria-label="GitHub" title="GitHub">
          <Icon name="github" size={14} />
        </a>
        <button type="button" className="btn btn--ghost btn--icon" onClick={onOpenSearch} aria-label="Search" title="Search (⌘K)">
          <Icon name="search" size={14} />
        </button>

        <span className="toolbar__sep toolbar__sep--sm" aria-hidden />

        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vk408@snu.edu.in" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--mail-ghost" title="Email Vinayak (opens Gmail)">
          <Icon name="mail" size={12} />
          <span>Email</span>
        </a>

        <button type="button" onClick={onExecute} disabled={isExecuting} className="btn btn--coral btn--tour">
          <Icon name="play" size={12} />
          <span>{isExecuting ? 'Touring…' : 'Take the tour'}</span>
        </button>
      </div>
    </header>
  );
}

window.Toolbar = Toolbar;

/* ── Status bar ────────────────────────────────────────────────────────── */
function StatusBar({ activeNodeLabel }) {
  return (
    <div className="statusbar">
      <div className="statusbar__group">
        <span className="statusbar__item"><span className="pulse-dot pulse-dot--sm" />live</span>
        {activeNodeLabel && <span className="statusbar__item statusbar__item--accent">▸ {activeNodeLabel}</span>}
      </div>
      <div className="statusbar__group">
        <a href="https://www.linkedin.com/in/vinayak-khandelwal-840964200" target="_blank" rel="noopener noreferrer">linkedin</a>
        <a href="https://github.com/CODEVK31" target="_blank" rel="noopener noreferrer">github</a>
      </div>
    </div>
  );
}
window.StatusBar = StatusBar;

/* ── Minimap — interactive (click/drag to pan canvas) ──────────────────── */
function Minimap({ activeNodeId }) {
  const W = 156, H = 96, PAD = 8;
  const svgRef = useRef(null);
  const [view, setView] = useState(null);

  const xs = WORKFLOW.nodes.map(n => n.x);
  const ys = WORKFLOW.nodes.map(n => n.y);
  const ws = WORKFLOW.nodes.map(n => n.x + dims(n.kind).w);
  const hs = WORKFLOW.nodes.map(n => n.y + dims(n.kind).h);
  const minX = Math.min(...xs), maxX = Math.max(...ws);
  const minY = Math.min(...ys), maxY = Math.max(...hs);
  const s = Math.min((W - PAD * 2) / (maxX - minX), (H - PAD * 2) / (maxY - minY));
  const ox = PAD - minX * s, oy = PAD - minY * s;

  useEffect(() => {
    const onTransform = (e) => setView(e.detail);
    window.addEventListener('canvas-transform', onTransform);
    return () => window.removeEventListener('canvas-transform', onTransform);
  }, []);

  // Convert a minimap-local point to a world-coord and broadcast to Canvas.
  const panToFromEvent = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const localX = e.clientX - r.left - ox;
    const localY = e.clientY - r.top - oy;
    const worldX = localX / s;
    const worldY = localY / s;
    window.dispatchEvent(new CustomEvent('canvas-pan-to', { detail: { x: worldX, y: worldY } }));
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    panToFromEvent(e);
    const move = (ev) => panToFromEvent(ev);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // Viewport rect — show the slice of world currently visible in canvas.
  let vp = null;
  if (view) {
    const { tx, viewport } = view;
    const wx = -tx.x / tx.s;
    const wy = -tx.y / tx.s;
    const ww = viewport.w / tx.s;
    const wh = viewport.h / tx.s;
    vp = {
      x: wx * s + ox,
      y: wy * s + oy,
      w: ww * s,
      h: wh * s,
    };
  }

  return (
    <div className="minimap" data-no-pan onPointerDown={onPointerDown} title="Click to pan · drag to scrub">
      <svg ref={svgRef} width={W} height={H}>
        {WORKFLOW.edges.map(e => {
          const from = WORKFLOW.nodes.find(n => n.id === e.from);
          const to   = WORKFLOW.nodes.find(n => n.id === e.to);
          if (!from || !to) return null;
          const acc = isCategory(from.kind) ? accentForKind[from.kind] : '#242B3D';
          const fd = dims(from.kind), td = dims(to.kind);
          const x1 = (from.x + fd.w) * s + ox;
          const y1 = (from.y + fd.h / 2) * s + oy;
          const x2 = to.x * s + ox;
          const y2 = (to.y + td.h / 2) * s + oy;
          return <line key={e.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={acc} strokeWidth={isCategory(from.kind) ? 1.1 : 0.7} opacity={isCategory(from.kind) ? 0.7 : 0.55} />;
        })}
        {WORKFLOW.nodes.map(n => {
          const isActive = n.id === activeNodeId;
          const acc = accentForKind[n.kind] ?? '#5D6680';
          const d = dims(n.kind);
          return (
            <rect key={n.id}
              x={n.x * s + ox} y={n.y * s + oy}
              width={d.w * s} height={d.h * s} rx="1.5"
              fill={acc}
              stroke={isActive ? '#fff' : 'transparent'}
              strokeWidth={isActive ? 0.8 : 0}
              opacity={isActive ? 1 : 0.78}
            />
          );
        })}
        {vp && (
          <rect x={vp.x} y={vp.y} width={vp.w} height={vp.h}
            fill="rgba(255,109,90,0.06)"
            stroke="#FF6D5A"
            strokeWidth="1.2"
            rx="2"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </svg>
      <div className="minimap__label">MINIMAP</div>
    </div>
  );
}
window.Minimap = Minimap;

/* ── Node Modal — centered, n8n-step-inspired layout ───────────────────── */
function NodePanel({ node, onClose, onNavigate, onOpenPlain }) {
  const modalRef = useRef(null);
  const lastFocus = useRef(null);
  if (!node) return null;
  const accent = accentForKind[node.kind] ?? '#8B93A8';

  // Tour-order prev/next
  const tour = WORKFLOW.tour;
  const idx = tour.indexOf(node.id);
  const prevId = idx > 0 ? tour[idx - 1] : null;
  const nextId = idx >= 0 && idx < tour.length - 1 ? tour[idx + 1] : null;
  const prev = prevId ? WORKFLOW.nodes.find(n => n.id === prevId) : null;
  const next = nextId ? WORKFLOW.nodes.find(n => n.id === nextId) : null;

  // Children for hub-style nodes (categories + projects entry + branch fork)
  const isHub = isCategory(node.kind) || node.id === 'projects' || node.id === 'branch';
  let children = [];
  if (isHub) {
    if (node.id === 'branch') {
      const downstream = ['about', 'projects'];
      children = downstream.map(id => WORKFLOW.nodes.find(n => n.id === id)).filter(Boolean);
    } else {
      children = WORKFLOW.edges
        .filter(e => e.from === node.id && e.to !== 'contact')
        .map(e => WORKFLOW.nodes.find(n => n.id === e.to))
        .filter(Boolean);
    }
  }

  // Keyboard: Esc / ← / → + focus trap
  useEffect(() => {
    lastFocus.current = document.activeElement;
    const root = modalRef.current;
    const getFocusables = () => root
      ? Array.from(root.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
          .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
      : [];
    // Initial focus on close button so Esc/Tab is reachable
    const first = getFocusables()[0];
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft'  && prev) { onNavigate(prev.id); return; }
      if (e.key === 'ArrowRight' && next) { onNavigate(next.id); return; }
      if (e.key === 'Tab') {
        const f = getFocusables();
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (lastFocus.current && typeof lastFocus.current.focus === 'function') {
        lastFocus.current.focus();
      }
    };
  }, [prev, next, onClose, onNavigate]);

  const statusColor = ({
    ACTIVE: '#00C896', IDLE: '#5D6680', LIVE: '#00C896',
    READY: '#00C896', COMPLETE: '#6E6EF6',
  })[node.panel.status] ?? '#8B93A8';

  const p = node.panel;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Centered modal wrapped so floating pills can extend outward beyond its edges */}
      <div className="modal-wrap" key={node.id}>
        {/* Floating PREV pill — to the LEFT of the modal, grows outward */}
        {prev ? (
          <button className="modal__side modal__side--prev" onClick={() => onNavigate(prev.id)} aria-label={'Previous: ' + prev.label}
            style={{ '--accent': accentForKind[prev.kind] ?? '#8B93A8' }}>
            <span className="modal__side-expand">
              <span className="modal__side-chev"><Icon name="chev-l" size={16} /></span>
              <span className="modal__side-text">
                <span className="modal__side-label">prev</span>
                <span className="modal__side-name">{prev.label}</span>
              </span>
            </span>
            <span className="modal__side-icon">
              <NodeIcon icon={prev.icon} accent={accentForKind[prev.kind] ?? '#8B93A8'} size={24} />
            </span>
          </button>
        ) : (
          <div className="modal__side modal__side--prev modal__side--empty" aria-label="start of tour">□</div>
        )}

        {/* Floating NEXT pill — to the RIGHT of the modal, grows outward */}
        {next ? (
          <button className="modal__side modal__side--next" onClick={() => onNavigate(next.id)} aria-label={'Next: ' + next.label}
            style={{ '--accent': accentForKind[next.kind] ?? '#8B93A8' }}>
            <span className="modal__side-icon">
              <NodeIcon icon={next.icon} accent={accentForKind[next.kind] ?? '#8B93A8'} size={24} />
            </span>
            <span className="modal__side-expand">
              <span className="modal__side-text">
                <span className="modal__side-label">press <kbd>→</kbd> for next</span>
                <span className="modal__side-name">{next.label}</span>
              </span>
              <span className="modal__side-chev"><Icon name="chev-r" size={16} /></span>
            </span>
          </button>
        ) : (
          <div className="modal__side modal__side--next modal__side--empty" aria-label="end of tour">□</div>
        )}

      <div ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby={`modal-title-${node.id}`} data-id={node.id}>
        {/* Modal HEADER */}
        <header className="modal__head" style={{ '--accent': accent }}>
          <div className="modal__head-stripe" />
          <div className="modal__head-row">
            <div className="modal__icon">
              <NodeIcon icon={node.icon} accent={accent} size={56} />
            </div>
            <div className="modal__head-text">
              <div className="modal__chips">
                <span className="modal__status-chip" style={{ color: statusColor }}>
                  <span className="pulse-dot" style={{ background: statusColor, color: statusColor }} />
                  {p.status}
                </span>
                {p.intro && <span className="modal__intro-chip">{p.intro}</span>}
              </div>
              <h2 id={`modal-title-${node.id}`} className="modal__title">{node.label}</h2>
              <div className="modal__sublabel">{node.sublabel}</div>
            </div>

            {/* Header CTAs — use the free space on the right */}
            {(p.cta || p.secondary || node.id === 'branch' || node.id === 'about') && (
              <div className="modal__head-cta">
                {node.id === 'branch' && (
                  <>
                    <button type="button" className="pill pill--coral" onClick={onOpenPlain}>
                      <Icon name="play" size={12} />
                      <span>30-sec read</span>
                    </button>
                    <a className="pill pill--ghost" href="uploads/Vinayak_Khandelwal_A_Resume.pdf" target="_blank" rel="noopener noreferrer">
                      <Icon name="resume" size={13} />
                      <span>Resume</span>
                    </a>
                  </>
                )}
                {node.id === 'about' && (
                  <button type="button" className="pill pill--coral" onClick={() => onNavigate('projects')}>
                    <Icon name="folder" size={13} />
                    <span>See projects</span>
                    <Icon name="chev-r" size={12} />
                  </button>
                )}
                {p.cta && (
                  <a
                    href={p.cta.url ?? '#'}
                    className="pill pill--coral"
                    target={p.cta.url?.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    <Icon name="play" size={12} />
                    <span>{p.cta.label}</span>
                  </a>
                )}
                {p.secondary && (
                  <a
                    href={p.secondary.url ?? '#'}
                    className="pill pill--ghost"
                    target={p.secondary.url?.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    <Icon name="external" size={13} />
                    <span>{p.secondary.label}</span>
                  </a>
                )}
              </div>
            )}

            <button className="modal__close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
          </div>
        </header>

        {/* Modal BODY — floating prev/next on the sides, content in the middle */}
        <div className="modal__body">
          {/* Summary spans full width */}
          {p.summary && <p className="modal__summary">{p.summary}</p>}

          {/* Child builds — hub nodes show their downstream destinations */}
          {children.length > 0 && (
            <section className="modal__children">
              <header className="modal__section-head">
                <span className="modal__section-label">
                  {node.id === 'branch' ? 'Where would you like to go?'
                   : node.id === 'projects' ? 'Tracks'
                   : 'Builds in this track'}
                </span>
              </header>
              <div className="modal__child-grid">
                {children.map(c => {
                  const cAccent = accentForKind[c.kind] ?? '#8B93A8';
                  return (
                    <button key={c.id} className="modal__child-card" onClick={() => onNavigate(c.id)} style={{ '--accent': cAccent }}>
                      <span className="modal__child-icon">
                        <NodeIcon icon={c.icon} accent={cAccent} size={36} />
                      </span>
                      <span className="modal__child-text">
                        <span className="modal__child-name">{c.label}</span>
                        <span className="modal__child-sub">{c.sublabel}</span>
                      </span>
                      <span className="modal__child-chev"><Icon name="chev-r" size={16} /></span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {node.id === 'branch' && (
            <p className="modal__kbd-tip">Pro tip — press <kbd>⌘K</kbd> (or <kbd>/</kbd>) to jump anywhere.</p>
          )}

          <div className="modal__cols">
            {/* LEFT col — parameters / meta */}
            <aside className="modal__col modal__col--left">
              {p.meta && (
                <Section label="At a glance">
                  <div className="modal__meta">
                    {Object.entries(p.meta).map(([k, v]) => (
                      <div key={k} className="modal__meta-row">
                        <span className="modal__meta-key">{k}</span>
                        <span className="modal__meta-val">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {p.groups && (
                <Section label="Tools & domains">
                  <div className="modal__groups">
                    {p.groups.map(g => (
                      <div key={g.label} className="modal__group">
                        <div className="modal__group-label">{g.label}</div>
                        <div className="modal__pills">
                          {g.items.map(i => <span key={i} className="modal__pill">{i}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </aside>

            {/* RIGHT col — output: highlights / impact / timeline */}
            <section className="modal__col modal__col--right">
              {p.highlights && (
                <Section label="Highlights" accent={accent}>
                  <ul className="modal__hl">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="modal__hl-row">
                        <span className="modal__hl-bullet" style={{ background: accent }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {p.timeline && (
                <Section label="Timeline">
                  <div className="modal__timeline">
                    {p.timeline.map((t, i) => (
                      <div key={i} className="modal__tl-item">
                        <span className="modal__tl-dot" style={{ background: accent }} />
                        <div className="modal__tl-content">
                          <div className="modal__tl-period">{t.period}</div>
                          <div className="modal__tl-role">{t.role}<span className="modal__tl-org"> · {t.org}</span></div>
                          {t.note && <div className="modal__tl-note">{t.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {p.impact && (
                <div className="modal__impact" style={{ '--accent': accent }}>
                  <div className="modal__impact-label">Impact</div>
                  <div className="modal__impact-text">{p.impact}</div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Modal FOOTER — minimal: just progress dots */}
        <footer className="modal__foot">
          <span className="modal__tour-dots" aria-label={`step ${idx+1} of ${tour.length}`}>
            {tour.map((id, i) => (
              <button key={id}
                className={'modal__tour-dot' + (i === idx ? ' is-current' : '') + (i < idx ? ' is-past' : '')}
                onClick={() => onNavigate(id)}
                aria-label={`Go to step ${i+1}`}
              />
            ))}
          </span>
        </footer>
      </div>
      </div>
    </>
  );
}
window.NodePanel = NodePanel;

function Section({ label, accent, children }) {
  return (
    <section className="modal__section">
      <header className="modal__section-head">
        <span className="modal__section-label" style={accent ? { color: accent } : undefined}>{label}</span>
      </header>
      <div className="modal__section-body">{children}</div>
    </section>
  );
}

/* ── Side nav arrow — floating, with preview of dest node ───────────────── */
function NavArrow({ side, node, onClick, disabled }) {
  const accent = node ? (accentForKind[node.kind] ?? '#8B93A8') : '#5D6680';
  return (
    <button
      type="button"
      className={'nav-arrow nav-arrow--' + side + (disabled ? ' is-disabled' : '')}
      onClick={disabled ? undefined : onClick}
      aria-label={node ? ((side === 'left' ? 'Previous: ' : 'Next: ') + node.label) : 'No more'}
      disabled={disabled}
    >
      <span className="nav-arrow__chev" style={!disabled ? { color: accent } : undefined}>
        <Icon name={side === 'left' ? 'chev-l' : 'chev-r'} size={20} />
      </span>
      {node && (
        <span className="nav-arrow__card" style={{ '--accent': accent }}>
          <span className="nav-arrow__label">{side === 'left' ? 'PREV' : 'NEXT'}</span>
          <span className="nav-arrow__name">{node.label}</span>
          <span className="nav-arrow__sub">{node.sublabel}</span>
        </span>
      )}
    </button>
  );
}


/* ────────────────────────────────────────────────────────────────────────
   COMMAND PALETTE — ⌘K / Ctrl+K / "/" to jump to any node
   ──────────────────────────────────────────────────────────────────────── */
function CommandPalette({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const all = WORKFLOW.nodes;
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(n => {
      return n.label.toLowerCase().includes(q)
        || (n.sublabel || '').toLowerCase().includes(q)
        || (n.panel?.summary || '').toLowerCase().includes(q)
        || (n.panel?.intro || '').toLowerCase().includes(q);
    });
  }, [query]);

  useEffect(() => { setIdx(0); }, [query]);
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape')         { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(results.length - 1, i + 1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
      else if (e.key === 'Enter')     {
        e.preventDefault();
        const r = results[idx];
        if (r) { onSelect(r.id); onClose(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onSelect, results, idx]);

  if (!isOpen) return null;

  return (
    <>
      <div className="cmdk-backdrop" onClick={onClose} />
      <div className="cmdk" role="dialog" aria-modal="true">
        <div className="cmdk__head">
          <span className="cmdk__head-icon"><Icon name="search" size={16} /></span>
          <input
            ref={inputRef}
            className="cmdk__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any node. Search by name, summary…"
          />
          <kbd className="cmdk__esc">esc</kbd>
        </div>
        <div className="cmdk__list">
          {results.length === 0 ? (
            <div className="cmdk__empty">
              <span className="cmdk__empty-q">"{query}"</span>
              no matches
            </div>
          ) : (
            results.map((n, i) => {
              const acc = accentForKind[n.kind] ?? '#8B93A8';
              return (
                <button
                  key={n.id}
                  className={'cmdk__item' + (i === idx ? ' is-selected' : '')}
                  onClick={() => { onSelect(n.id); onClose(); }}
                  onMouseEnter={() => setIdx(i)}
                  style={{ '--accent': acc }}
                >
                  <span className="cmdk__item-icon">
                    <NodeIcon icon={n.icon} accent={acc} size={26} />
                  </span>
                  <span className="cmdk__item-text">
                    <span className="cmdk__item-name">{highlight(n.label, query)}</span>
                    <span className="cmdk__item-sub">{n.sublabel}</span>
                  </span>
                  <span className="cmdk__item-kind" style={{ color: acc }}>{n.panel?.type ?? ''}</span>
                  {i === idx && <span className="cmdk__item-hint"><Icon name="corner-down-left" size={14} /></span>}
                </button>
              );
            })
          )}
        </div>
        <footer className="cmdk__foot">
          <span className="cmdk__foot-group">
            <kbd><Icon name="arrow-up" size={9} /></kbd>
            <kbd><Icon name="arrow-down" size={9} /></kbd>
            <span>navigate</span>
          </span>
          <span className="cmdk__foot-group">
            <kbd><Icon name="corner-down-left" size={9} /></kbd>
            <span>open</span>
          </span>
          <span className="cmdk__foot-group">
            <kbd>esc</kbd>
            <span>close</span>
          </span>
          <span className="cmdk__foot-spacer" />
          <span className="cmdk__foot-count">{results.length} of {WORKFLOW.nodes.length} nodes</span>
        </footer>
      </div>
    </>
  );
}
window.CommandPalette = CommandPalette;

/* Substring highlight helper */
function highlight(text, query) {
  if (!query?.trim()) return text;
  const q = query.trim();
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="cmdk__mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   ONBOARDING — cursor-follow hint for the first 8 seconds after boot
   ──────────────────────────────────────────────────────────────────────── */
function OnboardingHint({ active }) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('onboardingSeen') === '1'; }
    catch { return false; }
  });

  useEffect(() => {
    if (!active || dismissed) return;
    const reveal = setTimeout(() => setVisible(true), 200);
    const hide = setTimeout(() => {
      setVisible(false);
      try { localStorage.setItem('onboardingSeen', '1'); } catch {}
    }, 8000);
    return () => { clearTimeout(reveal); clearTimeout(hide); };
  }, [active, dismissed]);

  useEffect(() => {
    if (!visible) return;
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onInteract = () => {
      setVisible(false);
      setDismissed(true);
      try { localStorage.setItem('onboardingSeen', '1'); } catch {}
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('wheel', onInteract, { once: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('wheel', onInteract);
    };
  }, [visible]);

  if (!visible || dismissed) return null;
  return (
    <div className="onboarding-hint" style={{ left: pos.x, top: pos.y }}>
      drag to pan · <span className="onboarding-hint__kbd">scroll</span> to zoom · <span className="onboarding-hint__kbd">⌘K</span> to search
    </div>
  );
}
window.OnboardingHint = OnboardingHint;

/* ────────────────────────────────────────────────────────────────────────
   JSON VIEWER — "Inspect the source" (IDEA A)
   ──────────────────────────────────────────────────────────────────────── */
function syntaxHighlightJson(obj, validNodeIds) {
  const raw = JSON.stringify(obj, null, 2);
  // Escape HTML
  const esc = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Tokenise: strings, numbers, booleans, null
  return esc.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/gi,
    (m, str, colon, kw, num) => {
      if (str !== undefined) {
        if (colon) return `<span class="tok-key">${str}</span>${colon}`;
        const inner = str.slice(1, -1);
        if (validNodeIds.has(inner)) {
          return `"<span class="tok-id" data-node-id="${inner}">${inner}</span>"`;
        }
        return `<span class="tok-str">${str}</span>`;
      }
      if (kw) {
        return `<span class="${kw === 'null' ? 'tok-null' : 'tok-bool'}">${kw}</span>`;
      }
      if (num) return `<span class="tok-num">${num}</span>`;
      return m;
    }
  );
}

function JsonViewer({ onClose, onJumpToNode }) {
  const bodyRef = useRef(null);
  const ids = useMemo(() => new Set(WORKFLOW.nodes.map(n => n.id)), []);
  const html = useMemo(() => syntaxHighlightJson(WORKFLOW, ids), [ids]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onBodyClick = (e) => {
    const t = e.target;
    if (t && t.matches && t.matches('.tok-id')) {
      const id = t.getAttribute('data-node-id');
      onJumpToNode?.(id);
    }
  };

  const lineCount = useMemo(() => html.split('\n').length, [html]);

  return (
    <div className="jsonview" role="dialog" aria-modal="true">
      <header className="jsonview__head">
        <div className="jsonview__title">
          <span className="jsonview__filename">vinayak.portfolio.json</span>
          <span className="jsonview__meta">
            the site itself · <strong>{WORKFLOW.nodes.length}</strong> nodes · <strong>{WORKFLOW.edges.length}</strong> edges · <strong>{lineCount}</strong> lines · click any node id to jump
          </span>
        </div>
        <button className="jsonview__close" onClick={onClose} aria-label="Close source view">
          <Icon name="x" size={16} />
        </button>
      </header>
      <div ref={bodyRef} className="jsonview__body" onClick={onBodyClick}>
        <pre dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
window.JsonViewer = JsonViewer;

/* ────────────────────────────────────────────────────────────────────────
   MOBILE LAYOUT — vertical scroll fallback under 768px
   ──────────────────────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  useEffect(() => {
    document.body.classList.toggle('is-mobile', isMobile);
    return () => document.body.classList.remove('is-mobile');
  }, [isMobile]);
  return isMobile;
}
window.useIsMobile = useIsMobile;

function MobileCard({ node }) {
  const accent = accentForKind[node.kind] ?? '#8B93A8';
  const p = node.panel || {};
  const link = p.cta?.url;
  return (
    <article className="mobile__card" style={{ '--accent': accent }}>
      <span className="mobile__card-stripe" />
      <div className="mobile__card-body">
        <div className="mobile__card-head">
          <div className="mobile__card-icon-wrap">
            <NodeIcon icon={node.icon} accent={accent} size={32} />
          </div>
          <div className="mobile__card-title-block">
            <div className="mobile__card-title">{node.label}</div>
            <div className="mobile__card-sub">{node.sublabel}</div>
          </div>
        </div>
        {p.summary && <p className="mobile__card-summary">{p.summary}</p>}
        {p.impact && <div className="mobile__card-impact">{p.impact}</div>}
        {link && (
          <a className="mobile__card-link" href={link} target="_blank" rel="noopener noreferrer">
            {p.cta.label || 'View'}
          </a>
        )}
      </div>
    </article>
  );
}

function MobileLayout() {
  const branch = WORKFLOW.nodes.find(n => n.id === 'branch');
  const about = WORKFLOW.nodes.find(n => n.id === 'about');
  const skills = WORKFLOW.nodes.find(n => n.id === 'skills');
  const experience = WORKFLOW.nodes.find(n => n.id === 'experience');
  const pors = WORKFLOW.nodes.find(n => n.id === 'pors');
  const contact = WORKFLOW.nodes.find(n => n.id === 'contact');

  // Group projects by category via edges from category nodes.
  const projectIdsByCat = (catId) =>
    WORKFLOW.edges
      .filter(e => e.from === catId && e.to !== 'contact')
      .map(e => WORKFLOW.nodes.find(n => n.id === e.to))
      .filter(Boolean);

  const cats = [
    { node: WORKFLOW.nodes.find(n => n.id === 'n8n_cat'),    projects: projectIdsByCat('n8n_cat') },
    { node: WORKFLOW.nodes.find(n => n.id === 'data_cat'),   projects: projectIdsByCat('data_cat') },
    { node: WORKFLOW.nodes.find(n => n.id === 'claude_cat'), projects: projectIdsByCat('claude_cat') },
  ];

  return (
    <div className="mobile">
      <section className="mobile__hero">
        <div className="mobile__logo" aria-hidden>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8 11 L16 7 M8 13 L16 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="mobile__filename">vinayak.portfolio.json · open to work</div>
        <h1 className="mobile__name">Vinayak Khandelwal</h1>
        <div className="mobile__role">Final-year B.Tech · I ship AI workflows</div>
        <p className="mobile__lede">{branch?.panel?.summary}</p>
        <div className="mobile__cta-row">
          <a className="mobile__cta mobile__cta--coral" href="https://mail.google.com/mail/?view=cm&fs=1&to=vk408@snu.edu.in" target="_blank" rel="noopener noreferrer">
            <Icon name="mail" size={12} /> Email me
          </a>
          <a className="mobile__cta mobile__cta--ghost" href="uploads/Vinayak_Khandelwal_A_Resume.pdf" target="_blank" rel="noopener noreferrer">
            <Icon name="resume" size={12} /> Resume
          </a>
        </div>
      </section>

      {/* Mobile workflow rail — preserves the n8n metaphor on small screens */}
      <section className="mobile__section">
        <div className="mobile__section-label">the workflow</div>
        <h2 className="mobile__h">Pick a path</h2>
        <nav className="mobile-rail" aria-label="Workflow shortcuts">
          {[
            WORKFLOW.nodes.find(n => n.id === 'about'),
            WORKFLOW.nodes.find(n => n.id === 'experience'),
            WORKFLOW.nodes.find(n => n.id === 'n8n_cat'),
            WORKFLOW.nodes.find(n => n.id === 'data_cat'),
            WORKFLOW.nodes.find(n => n.id === 'claude_cat'),
            WORKFLOW.nodes.find(n => n.id === 'contact'),
          ].filter(Boolean).map(n => {
            const acc = accentForKind[n.kind] ?? '#8B93A8';
            return (
              <a key={n.id} className="mobile-rail__item" href={'#' + n.id}
                 style={{ '--accent': acc }}
                 onClick={(e) => {
                   e.preventDefault();
                   const el = document.getElementById('mobile-' + n.id);
                   if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 }}>
                <div className="mobile-rail__title">{n.label}</div>
                <div className="mobile-rail__sub">{n.sublabel}</div>
              </a>
            );
          })}
        </nav>
      </section>

      {about && (
        <section id="mobile-about" className="mobile__section">
          <div className="mobile__section-label">About</div>
          <h2 className="mobile__h">{about.label}</h2>
          <p className="mobile__p">{about.panel.summary}</p>
          {about.panel.highlights && (
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.55 }}>
              {about.panel.highlights.map((h, i) => <li key={i} style={{ marginBottom: 6 }}>{h}</li>)}
            </ul>
          )}
        </section>
      )}

      {skills && skills.panel.groups && (
        <section className="mobile__section">
          <div className="mobile__section-label">Skills</div>
          <h2 className="mobile__h">{skills.label}</h2>
          {skills.panel.groups.map(g => (
            <div key={g.label} className="mobile__skill-group">
              <div className="mobile__skill-label">{g.label}</div>
              <div className="mobile__chip-grid">
                {g.items.map(i => <span key={i} className="mobile__chip">{i}</span>)}
              </div>
            </div>
          ))}
        </section>
      )}

      {experience && experience.panel.timeline && (
        <section id="mobile-experience" className="mobile__section">
          <div className="mobile__section-label">Experience</div>
          <h2 className="mobile__h">{experience.label}</h2>
          {experience.panel.timeline.map((t, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>{t.period}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: 'var(--fg)', marginBottom: 2 }}>{t.role} <span style={{ color: 'var(--fg-muted)', fontFamily: 'Inter Tight, sans-serif', fontSize: 13 }}>· {t.org}</span></div>
              {t.note && <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-muted)', marginTop: 4 }}>{t.note}</div>}
            </div>
          ))}
        </section>
      )}

      {pors && pors.panel.timeline && (
        <section className="mobile__section">
          <div className="mobile__section-label">Positions of Responsibility</div>
          <h2 className="mobile__h">{pors.label}</h2>
          {pors.panel.timeline.map((t, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 2 }}>{t.period}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 15, color: 'var(--fg)' }}>{t.role} <span style={{ color: 'var(--fg-muted)', fontFamily: 'Inter Tight, sans-serif', fontSize: 13 }}>· {t.org}</span></div>
              {t.note && <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--fg-muted)', marginTop: 4 }}>{t.note}</div>}
            </div>
          ))}
        </section>
      )}

      {cats.map(({ node, projects }) => node && (
        <section key={node.id} id={'mobile-' + node.id} className="mobile__section">
          <div className="mobile__section-label">{node.label}</div>
          <h2 className="mobile__h">{node.panel.summary?.split('.')[0] + '.'}</h2>
          {projects.map(p => <MobileCard key={p.id} node={p} />)}
        </section>
      ))}

      {contact && (
        <section id="mobile-contact" className="mobile__section">
          <div className="mobile__section-label">Contact</div>
          <h2 className="mobile__h">Get in touch</h2>
          <p className="mobile__p">{contact.panel.summary}</p>
          <div className="mobile__contact-list">
            {Object.entries(contact.panel.meta || {}).map(([k, v]) => (
              <div key={k} className="mobile__contact-row">
                <span className="mobile__contact-key">{k}</span>
                <span className="mobile__contact-val">{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <a className="mobile__cta mobile__cta--coral" href="https://mail.google.com/mail/?view=cm&fs=1&to=vk408@snu.edu.in" target="_blank" rel="noopener noreferrer">
              <Icon name="mail" size={12} /> Email me
            </a>
          </div>
        </section>
      )}

      <footer className="mobile__footer">
        <div>Vinayak Khandelwal · 2026</div>
        <div style={{ marginTop: 8 }}>
          <a href="https://www.linkedin.com/in/vinayak-khandelwal-840964200" target="_blank" rel="noopener noreferrer">linkedin</a>
          {' · '}
          <a href="https://github.com/CODEVK31" target="_blank" rel="noopener noreferrer">github</a>
        </div>
      </footer>

      {/* Sticky bottom CTA bar */}
      <div className="mobile-stick">
        <a className="pill pill--coral" href="https://mail.google.com/mail/?view=cm&fs=1&to=vk408@snu.edu.in" target="_blank" rel="noopener noreferrer">
          <Icon name="mail" size={12} /> Email Vinayak
        </a>
        <a className="pill pill--ghost" href="uploads/Vinayak_Khandelwal_A_Resume.pdf" target="_blank" rel="noopener noreferrer">
          <Icon name="resume" size={12} /> Resume
        </a>
      </div>
    </div>
  );
}
window.MobileLayout = MobileLayout;
