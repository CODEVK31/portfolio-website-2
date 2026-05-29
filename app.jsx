/* App — top-level state, boot sequence, command palette, URL deep-link, execution animation. */
const { useState, useEffect, useCallback, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "panelStyle": "editorial",
  "toolbarStyle": "hierarchy",
  "categoryStyle": "color-coded",
  "bootStyle": "scan-line",
  "canvasStyle": "refined",
  "idleFlow": true,
  "autoOpenHello": true,
  "background": "ink"
}/*EDITMODE-END*/;

/* Fast mode (?fast=1) — skip the boot animation entirely.
   Use case: pasting the link in a DM where the recipient has 10 seconds. */
const IS_FAST_MODE = typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('fast') === '1';

/* Repeat-visit fast path: if a visitor has seen the boot in the last 24h, skip it. */
const BOOT_SEEN_KEY = 'vk_boot_seen_at';
const SHOULD_SKIP_BOOT = (() => {
  if (typeof window === 'undefined') return false;
  try {
    const ts = parseInt(window.sessionStorage.getItem(BOOT_SEEN_KEY) || '0', 10);
    if (!ts) {
      const dayTs = parseInt(window.localStorage.getItem(BOOT_SEEN_KEY) || '0', 10);
      return dayTs && (Date.now() - dayTs) < 24 * 60 * 60 * 1000;
    }
    return true;
  } catch { return false; }
})();

/* Read a node id from the URL hash, if any. */
function readNodeFromHash() {
  const m = window.location.hash.match(/#node=([a-z0-9_-]+)/i);
  if (!m) return null;
  return WORKFLOW.nodes.some(n => n.id === m[1]) ? m[1] : null;
}

function App() {
  const isMobile = window.useIsMobile(768);
  return isMobile ? <window.MobileLayout /> : <DesktopApp />;
}

function DesktopApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const initialFromHash = useRef(readNodeFromHash()).current;
  const [activeNodeId, setActiveNodeId] = useState(initialFromHash);
  const [bootPhase, setBootPhase] = useState('idle');
  const [bootKey, setBootKey] = useState(0);
  const [executingNodeId, setExecutingNodeId] = useState(null);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [plainOpen, setPlainOpen] = useState(false);
  const timerRef = useRef([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const runBoot = useCallback((opts = {}) => {
    clearTimers();
    setActiveNodeId(null);
    setExecutingNodeId(null);
    setBootKey(k => k + 1);

    // Fast mode or repeat-visit fast path — skip the 1.95s scan/edges/pulse choreography.
    if ((IS_FAST_MODE || SHOULD_SKIP_BOOT) && !opts.force) {
      setBootPhase('done');
      const push = (fn, ms) => timerRef.current.push(setTimeout(fn, ms));
      const hashNode = readNodeFromHash();
      if (hashNode) {
        setActiveNodeId(hashNode);
      } else if (t.autoOpenHello && !opts.skipAutoOpen) {
        push(() => setActiveNodeId('branch'), 600);
      }
      return;
    }

    setBootPhase('scanning');
    const push = (fn, ms) => timerRef.current.push(setTimeout(fn, ms));
    push(() => setBootPhase('edges'),  1250);
    push(() => setBootPhase('pulse'),  1650);
    push(() => {
      setBootPhase('done');
      try {
        const now = String(Date.now());
        window.sessionStorage.setItem(BOOT_SEEN_KEY, now);
        window.localStorage.setItem(BOOT_SEEN_KEY, now);
      } catch {}
      const hashNode = readNodeFromHash();
      if (hashNode) {
        setActiveNodeId(hashNode);
      } else if (t.autoOpenHello && !opts.skipAutoOpen) {
        push(() => setActiveNodeId('branch'), 3650);
      }
    }, 1950);
  }, [t.autoOpenHello]);

  /* Guided tour — opens each node's modal in tour order, ~5s per node.
     Clicking any node, closing the modal, or pressing Esc aborts the tour. */
  const runExecution = useCallback(() => {
    clearTimers();
    setExecutingNodeId(null);

    const tour = WORKFLOW.tour;
    const stepMs = 5000;
    const push = (fn, ms) => timerRef.current.push(setTimeout(fn, ms));

    tour.forEach((id, i) => {
      push(() => {
        setActiveNodeId(id);
        setExecutingNodeId(id);
      }, i * stepMs);
    });
    push(() => setExecutingNodeId(null), tour.length * stepMs);
  }, []);

  // Initial boot
  useEffect(() => {
    runBoot({ skipAutoOpen: !!initialFromHash });
    return () => clearTimers();
  }, []);

  // URL hash <-> activeNodeId sync
  useEffect(() => {
    const hash = activeNodeId ? `#node=${activeNodeId}` : '';
    if (window.location.hash !== hash) {
      const url = window.location.pathname + window.location.search + hash;
      window.history.replaceState(null, '', url);
    }
  }, [activeNodeId]);

  // Back/forward navigation
  useEffect(() => {
    const onHash = () => {
      const id = readNodeFromHash();
      setActiveNodeId(id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Global keyboard: ⌘K / Ctrl+K / `/` opens command palette
  useEffect(() => {
    const onKey = (e) => {
      const isInput = e.target.matches?.('input, textarea, [contenteditable]');
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCmdkOpen(o => !o);
      } else if (e.key === '/' && !isInput && !cmdkOpen) {
        e.preventDefault();
        setCmdkOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdkOpen]);

  const handleNodeClick = useCallback((id) => {
    if (bootPhase !== 'done') return;
    clearTimers();
    setExecutingNodeId(null);
    setActiveNodeId((cur) => cur === id ? null : id);
  }, [bootPhase]);

  const handleNavigate = useCallback((id) => {
    clearTimers();
    setExecutingNodeId(null);
    setActiveNodeId(id);
  }, []);

  const activeNode = activeNodeId
    ? WORKFLOW.nodes.find(n => n.id === activeNodeId)
    : null;

  return (
    <div className="app" data-bg={t.background} data-canvas-style={t.canvasStyle} data-boot-style={t.bootStyle} data-category-style={t.categoryStyle} data-toolbar-style={t.toolbarStyle} data-panel-style={t.panelStyle} data-executing={executingNodeId ? 'true' : 'false'}>
      <Toolbar
        onExecute={runExecution}
        onBoot={runBoot}
        onOpenSearch={() => setCmdkOpen(true)}
        onOpenPlain={() => setPlainOpen(true)}
        isExecuting={!!executingNodeId || bootPhase === 'scanning'}
      />

      <main className="app__main">
        <Canvas
          activeNodeId={activeNodeId}
          executingNodeId={executingNodeId}
          onNodeClick={handleNodeClick}
          bootPhase={bootPhase}
          bootKey={bootKey}
          idleFlow={t.idleFlow}
        />
        <Minimap activeNodeId={activeNodeId} />
        <button
          type="button"
          className="jsonview-trigger"
          onClick={() => setSourceOpen(true)}
          title="View the JSON this site is built from"
        >
          {'</>'} View source
        </button>
        {activeNode && <NodePanel node={activeNode} onClose={() => { clearTimers(); setExecutingNodeId(null); setActiveNodeId(null); }} onNavigate={handleNavigate} onOpenPlain={() => setPlainOpen(true)} />}
        {sourceOpen && (
          <JsonViewer
            onClose={() => setSourceOpen(false)}
            onJumpToNode={(id) => { setSourceOpen(false); setActiveNodeId(id); }}
          />
        )}
        {plainOpen && <PlainEnglish onClose={() => setPlainOpen(false)} onJump={(id) => { setPlainOpen(false); setActiveNodeId(id); }} />}
      </main>

      <StatusBar activeNodeLabel={activeNode?.label} />

      <OnboardingHint active={bootPhase === 'done' && !activeNodeId && !cmdkOpen && !sourceOpen} />

      <CommandPalette
        isOpen={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        onSelect={(id) => setActiveNodeId(id)}
      />

      <TweaksPanel title="Portfolio Tweaks">
        <TweakSection title="Background">
          <TweakRadio label="Tone"
            value={t.background}
            onChange={v => setTweak('background', v)}
            options={[
              { label: 'Midnight (current)', value: 'midnight' },
              { label: 'Ink (cooler)', value: 'ink' },
              { label: 'Onyx (deeper)', value: 'onyx' },
              { label: 'Deep navy', value: 'deep-navy' },
              { label: 'Warm coal', value: 'warm-coal' },
            ]} />
        </TweakSection>

        <TweakSection title="Actions">
          <TweakButton onClick={runExecution}>▶  Execute workflow (live)</TweakButton>
          <TweakButton onClick={() => runBoot()}>↻  Replay boot</TweakButton>
          <TweakButton onClick={() => setCmdkOpen(true)}>⌘K · open command palette</TweakButton>
        </TweakSection>

        <TweakSection title="Boot animation">
          <TweakRadio label="Boot style"
            value={t.bootStyle}
            onChange={v => setTweak('bootStyle', v)}
            options={[
              { label: 'Scan-line', value: 'scan-line' },
              { label: 'Sequential', value: 'sequential' },
            ]} />
          <TweakToggle label="Idle data-flow on edges" value={t.idleFlow} onChange={v => setTweak('idleFlow', v)} />
        </TweakSection>

        <TweakSection title="Modal demo">
          <TweakButton onClick={() => setActiveNodeId('branch')}>Open · entry (Hello, I'm Vinayak)</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('branch')}>Open · branch (fork)</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('skills')}>Open · skills</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('experience')}>Open · experience</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('n8n_cat')}>Open · n8n category</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('p-pitch-deck')}>Open · pitch deck</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('p-credflow')}>Open · credflow</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('p-sales')}>Open · sales audit</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('p-fitme')}>Open · FitMe</TweakButton>
          <TweakButton onClick={() => setActiveNodeId('contact')}>Open · contact (terminal)</TweakButton>
          <TweakToggle label="Auto-open entry after boot" value={t.autoOpenHello} onChange={v => setTweak('autoOpenHello', v)} />
        </TweakSection>

        <TweakSection title="Variants (before/after)">
          <TweakRadio label="Category Nodes"
            value={t.categoryStyle}
            onChange={v => setTweak('categoryStyle', v)}
            options={[
              { label: 'Color-coded', value: 'color-coded' },
              { label: 'Before', value: 'before' },
            ]} />
          <TweakRadio label="Toolbar"
            value={t.toolbarStyle}
            onChange={v => setTweak('toolbarStyle', v)}
            options={[
              { label: 'Hierarchy', value: 'hierarchy' },
              { label: 'Before', value: 'before' },
            ]} />
          <TweakRadio label="Canvas QoL"
            value={t.canvasStyle}
            onChange={v => setTweak('canvasStyle', v)}
            options={[
              { label: 'Refined', value: 'refined' },
              { label: 'Before', value: 'before' },
            ]} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
