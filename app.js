/* ═══════════════════════════════════════════════════════════
   BH / ADVERSARIAL — portfolio script
   ═══════════════════════════════════════════════════════════ */

(() => {
  const T = window.__TWEAKS__ || {};
  const root = document.documentElement;

  /* ── apply initial tweak values ──────────────────────────── */
  const applyTweaks = () => {
    root.style.setProperty('--accent', T.accent);
    document.body.dataset.theme = T.theme || 'obsidian';
    document.body.classList.toggle('no-grain', !T.grain);
    document.body.classList.toggle('no-cursor', !T.cursor_trail);
  };
  applyTweaks();

  /* ═════════════ BOOT ═════════════ */
  const bootLines = [
    ['establishing secure channel ........................',' [<span class="ok">OK</span>]'],
    ['handshake · tls 1.3 · curve25519 ...................',' [<span class="ok">OK</span>]'],
    ['verifying operator fingerprint .....................',' [<span class="ok">OK</span>]'],
    ['loading bh/adversarial portfolio v1.4.0 ............',' [<span class="ok">OK</span>]'],
    ['mounting /dev/identity .............................',' [<span class="ok">OK</span>]'],
    ['redacting classified engagements ...................',' [<span class="wrn">5</span>]'],
    ['ready. welcome, analyst.                             ',' [<span class="ok">✓</span>]'],
  ];
  const bootLog = document.getElementById('bootLog');
  const bootBar = document.getElementById('bootBar');
  const bootPct = document.getElementById('bootPct');
  const bootEl = document.getElementById('boot');

  let bi = 0;
  const tickBoot = () => {
    if (bi < bootLines.length) {
      bootLog.innerHTML += bootLines[bi][0] + bootLines[bi][1] + '\n';
      bi++;
      const pct = Math.floor((bi / bootLines.length) * 100);
      bootBar.style.right = (100 - pct) + '%';
      bootPct.textContent = String(pct).padStart(2,'0') + '%';
      setTimeout(tickBoot, 180 + Math.random() * 140);
    } else {
      setTimeout(() => bootEl.classList.add('gone'), 450);
    }
  };
  setTimeout(tickBoot, 250);

  /* ═════════════ HUD CLOCKS & READOUTS ═════════════ */
  const hudTime = document.getElementById('hudTime');
  const footTime = document.getElementById('footTime');
  const latOut = document.getElementById('latOut');
  const traceOut = document.getElementById('traceOut');
  const buildHash = document.getElementById('buildHash');

  const hex = (n) => Array.from({length:n}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
  buildHash.textContent = hex(7);

  const tickClock = () => {
    const d = new Date();
    const t = d.toISOString().replace('T',' ').slice(0,19) + 'Z';
    if (hudTime) hudTime.textContent = t.slice(11, 19);
    if (footTime) footTime.textContent = t;
  };
  setInterval(tickClock, 1000); tickClock();

  const tickLat = () => {
    latOut.textContent = (7 + Math.random() * 6).toFixed(1) + 'ms';
    traceOut.textContent = '0x' + hex(6);
  };
  setInterval(tickLat, 1400); tickLat();

  /* ═════════════ ENTROPY SPARK ═════════════ */
  const spark = document.getElementById('spark');
  if (spark) {
    const sctx = spark.getContext('2d');
    const data = new Array(40).fill(0).map(() => Math.random());
    const drawSpark = () => {
      data.shift(); data.push(Math.random() * 0.8 + 0.2);
      sctx.clearRect(0,0,spark.width,spark.height);
      sctx.strokeStyle = getComputedStyle(root).getPropertyValue('--accent').trim();
      sctx.lineWidth = 1;
      sctx.beginPath();
      data.forEach((v, i) => {
        const x = (i / (data.length-1)) * spark.width;
        const y = spark.height - v * spark.height;
        i ? sctx.lineTo(x, y) : sctx.moveTo(x, y);
      });
      sctx.stroke();
    };
    setInterval(drawSpark, 160); drawSpark();
  }

  /* ═════════════ HERO AMBIENT LATTICE ═════════════ */
  const fc = document.getElementById('fieldCanvas');
  if (fc) {
    const fctx = fc.getContext('2d');
    let W, H, pts, beam = 0;
    const resizeF = () => {
      const r = fc.getBoundingClientRect();
      W = fc.width = r.width * devicePixelRatio;
      H = fc.height = r.height * devicePixelRatio;
      pts = [];
      const cols = Math.max(20, Math.floor(W / 70));
      const rows = Math.max(14, Math.floor(H / 70));
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        pts.push({ x: x/(cols-1)*W, y: y/(rows-1)*H, ox: 0, oy: 0, p: Math.random()*Math.PI*2 });
      }
    };
    resizeF();
    window.addEventListener('resize', resizeF);
    let mx = 0, my = 0;
    document.getElementById('hero')?.addEventListener('mousemove', (e) => {
      const r = fc.getBoundingClientRect();
      mx = (e.clientX - r.left) * devicePixelRatio;
      my = (e.clientY - r.top) * devicePixelRatio;
    });
    const accent = () => getComputedStyle(root).getPropertyValue('--accent').trim();
    const drawField = (t) => {
      fctx.clearRect(0,0,W,H);
      beam = (beam + 1) % (H + 200);
      // scanning beam
      const grad = fctx.createLinearGradient(0, beam - 80, 0, beam + 80);
      grad.addColorStop(0,  'rgba(214,255,92,0)');
      grad.addColorStop(0.5,'rgba(214,255,92,0.06)');
      grad.addColorStop(1,  'rgba(214,255,92,0)');
      fctx.fillStyle = grad;
      fctx.fillRect(0, beam - 80, W, 160);

      fctx.fillStyle = accent();
      pts.forEach((p) => {
        p.p += 0.008;
        p.ox = Math.sin(p.p + t*0.0004) * 6;
        p.oy = Math.cos(p.p + t*0.0004) * 6;
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx*dx + dy*dy);
        const pull = Math.max(0, 1 - d / 260);
        const x = p.x + p.ox - dx * pull * 0.2;
        const y = p.y + p.oy - dy * pull * 0.2;
        fctx.globalAlpha = 0.15 + pull * 0.7;
        fctx.fillRect(x-0.6, y-0.6, 1.4, 1.4);
      });
      fctx.globalAlpha = 1;
      requestAnimationFrame(drawField);
    };
    requestAnimationFrame(drawField);
  }

  /* ═════════════ ATTACK-SURFACE GRAPH ═════════════ */
  const gc = document.getElementById('graphCanvas');
  if (gc) {
    const ctx = gc.getContext('2d');
    const gNodes = document.getElementById('gNodes');
    const gEdges = document.getElementById('gEdges');
    const gHover = document.getElementById('gHover');
    let W, H;
    const nodeDefs = [
      { id:'root',   label:'MODEL CORE',          kind:'critical', r:10 },
      { id:'pinj',   label:'Prompt injection',    kind:'critical' },
      { id:'tool',   label:'Tool-use hijack',     kind:'critical' },
      { id:'mem',    label:'Memory poisoning',    kind:'structural'},
      { id:'coll',   label:'Agent collusion',     kind:'structural'},
      { id:'exfil',  label:'Context exfiltration',kind:'structural'},
      { id:'jail',   label:'Jailbreak corpora',   kind:'research' },
      { id:'align',  label:'Alignment drift',     kind:'research' },
      { id:'cov',    label:'Covert channels',     kind:'structural'},
      { id:'grad',   label:'Gradient leakage',    kind:'research' },
      { id:'rag',    label:'RAG poisoning',       kind:'critical' },
      { id:'spec',   label:'Specification gaming',kind:'research' },
      { id:'sand',   label:'Sandbox escape',      kind:'critical' },
      { id:'overs',  label:'Oversight evasion',   kind:'structural'},
    ];
    const edges = [
      ['root','pinj'],['root','tool'],['root','mem'],['root','jail'],['root','align'],
      ['pinj','tool'],['pinj','rag'],['tool','sand'],['tool','coll'],
      ['mem','exfil'],['mem','rag'],['coll','overs'],['exfil','cov'],
      ['jail','align'],['align','spec'],['spec','overs'],['grad','exfil'],
      ['cov','sand'],['align','grad'],
    ];
    let nodes = [];

    const layout = () => {
      const r = gc.getBoundingClientRect();
      W = gc.width  = r.width * devicePixelRatio;
      H = gc.height = r.height * devicePixelRatio;
      const cx = W/2, cy = H/2;
      nodes = nodeDefs.map((d, i) => {
        if (d.id === 'root') return { ...d, x: cx, y: cy, vx:0, vy:0 };
        const ang = (i / (nodeDefs.length-1)) * Math.PI * 2;
        const rad = Math.min(W,H) * 0.33;
        return { ...d, x: cx + Math.cos(ang)*rad, y: cy + Math.sin(ang)*rad, vx:0, vy:0 };
      });
    };
    layout();
    window.addEventListener('resize', layout);

    gNodes.textContent = nodeDefs.length;
    gEdges.textContent = edges.length;

    const nodeById = (id) => nodes.find(n => n.id === id);

    let mx = -9999, my = -9999, hover = null;
    gc.addEventListener('mousemove', (e) => {
      const r = gc.getBoundingClientRect();
      mx = (e.clientX - r.left) * devicePixelRatio;
      my = (e.clientY - r.top)  * devicePixelRatio;
    });
    gc.addEventListener('mouseleave', () => { mx=-9999; my=-9999; hover=null; gHover.textContent='—'; });

    const colorFor = (k) => {
      if (k === 'critical')   return getComputedStyle(root).getPropertyValue('--accent').trim();
      if (k === 'structural') return '#9fa7b3';
      return '#4d5360';
    };

    const step = (t) => {
      // physics — soft spring to target + mouse repulsion
      nodes.forEach(n => {
        if (n.id === 'root') return;
        n.vx *= 0.88; n.vy *= 0.88;
        const tx = n.x, ty = n.y;
        const dmx = n.x - mx, dmy = n.y - my;
        const dm = Math.sqrt(dmx*dmx + dmy*dmy);
        if (dm < 200) {
          n.vx += (dmx/dm) * (1 - dm/200) * 3;
          n.vy += (dmy/dm) * (1 - dm/200) * 3;
        }
        n.x += n.vx; n.y += n.vy;
      });

      ctx.clearRect(0,0,W,H);
      // edges
      ctx.lineWidth = 1;
      edges.forEach(([a,b]) => {
        const A = nodeById(a), B = nodeById(b);
        const hot = hover && (hover.id===a || hover.id===b);
        ctx.strokeStyle = hot ? colorFor('critical') : 'rgba(237,236,230,0.12)';
        ctx.globalAlpha = hot ? 0.9 : 1;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // pulse from root
      const pulse = (Math.sin(t*0.001) + 1) / 2;
      ctx.strokeStyle = colorFor('critical');
      ctx.globalAlpha = 0.25 * (1 - pulse);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nodes[0].x, nodes[0].y, 20 + pulse * 80, 0, Math.PI*2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // nodes
      let best = null, bestD = Infinity;
      nodes.forEach(n => {
        const dx = n.x - mx, dy = n.y - my;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 34 * devicePixelRatio && d < bestD) { best = n; bestD = d; }
      });
      hover = best;
      gHover.textContent = hover ? hover.label : '—';

      nodes.forEach(n => {
        const base = n.id === 'root' ? 7 : 4;
        const isHot = hover === n;
        const c = colorFor(n.kind);
        // halo
        ctx.fillStyle = c;
        ctx.globalAlpha = isHot ? 0.18 : 0.08;
        ctx.beginPath(); ctx.arc(n.x, n.y, (base + 12) * devicePixelRatio, 0, Math.PI*2); ctx.fill();
        // core
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, base * devicePixelRatio, 0, Math.PI*2); ctx.fill();

        // label
        if (isHot || n.id === 'root') {
          ctx.fillStyle = '#EDECE6';
          ctx.font = `${11 * devicePixelRatio}px JetBrains Mono, monospace`;
          ctx.fillText(n.label, n.x + 12*devicePixelRatio, n.y + 4*devicePixelRatio);
        }
      });

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ═════════════ LIVE LOG TICKER ═════════════ */
  const logList = document.getElementById('logList');
  if (logList) {
    const msgs = [
      ['ok',  'eval run #4712 complete — 1,284 prompts, 17 anomalies'],
      ['ok',  'probe/07 spawned sub-agent · sandbox=strict'],
      ['wrn', 'jailbreak score delta exceeded baseline (+0.14)'],
      ['ok',  'lattice corpus synced · 2,118,033 rows'],
      ['err', 'tool-call escape attempt blocked · vector #31'],
      ['ok',  'glassbox snapshot posted to /interp/0a93f'],
      ['wrn', 'observed self-reference loop — 3 turns, contained'],
      ['ok',  'report NIGHTGLASS-R4 sealed · PGP 0xA1F3'],
      ['ok',  'adversary model re-weighted · lr=3e-5'],
      ['err', 'CVE-2026-04411 filed upstream'],
      ['ok',  'corpus dedup · 41,093 dupes removed'],
      ['wrn', 'drift detected — attention head 14.3'],
      ['ok',  'handshake · client=analyst-02 · verified'],
      ['ok',  'probe/07 iteration complete · reward=0.872'],
    ];
    const pushLog = () => {
      if (!T.live_logs) return;
      const [lv, txt] = msgs[Math.floor(Math.random()*msgs.length)];
      const d = new Date();
      const t = d.toISOString().slice(11,19);
      const li = document.createElement('li');
      li.innerHTML = `<span class="t">${t}</span><span class="lv-${lv}">${lv.toUpperCase()}</span> ${txt}`;
      logList.prepend(li);
      while (logList.children.length > 16) logList.removeChild(logList.lastChild);
    };
    for (let i=0;i<10;i++) pushLog();
    setInterval(pushLog, 1500);
  }

  /* ═════════════ CURSOR + TRAIL ═════════════ */
  const cursor = document.getElementById('cursor');
  const cursorLabel = document.getElementById('cursorLabel');
  if (cursor) {
    let x = 0, y = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      cursor.style.transform = `translate3d(${x-20}px, ${y-20}px, 0)`;
      // trail dot
      if (T.cursor_trail && Math.hypot(tx-x, ty-y) > 0.5) {
        const d = document.createElement('span');
        d.style.cssText = `position:fixed;left:${tx-2}px;top:${ty-2}px;width:4px;height:4px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:9988;opacity:0.8;transition:opacity 0.6s, transform 0.6s;`;
        document.body.appendChild(d);
        requestAnimationFrame(() => { d.style.opacity = '0'; d.style.transform = 'scale(0.2)'; });
        setTimeout(() => d.remove(), 650);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hot = 'a, button, .case, .contact__card, .note, input, select, [data-hot]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hot)) {
        cursor.classList.add('hot');
        const el = e.target.closest(hot);
        cursorLabel.textContent = el.dataset.label || (el.tagName === 'A' ? 'open' : 'interact');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(hot)) {
        cursor.classList.remove('hot');
      }
    });
  }

  /* ═════════════ SECTION REVEAL ═════════════ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section__head, .case, .note, .contact__card, .about__grid').forEach(el => io.observe(el));

  /* ═════════════ TWEAKS PANEL ═════════════ */
  const tw = document.getElementById('tweaks');
  const twClose = document.getElementById('tweaksClose');
  const twAccent = document.getElementById('twAccent');
  const twName = document.getElementById('twName');
  const twRole = document.getElementById('twRole');
  const twTagline = document.getElementById('twTagline');
  const twGrain = document.getElementById('twGrain');
  const twCursor = document.getElementById('twCursor');
  const twLogs = document.getElementById('twLogs');
  const twTheme = document.getElementById('twTheme');

  const syncInputs = () => {
    twAccent.value = T.accent;
    twName.value = T.name;
    twRole.value = T.role;
    twTagline.value = T.tagline;
    twGrain.checked = !!T.grain;
    twCursor.checked = !!T.cursor_trail;
    twLogs.checked = !!T.live_logs;
    twTheme.value = T.theme || 'obsidian';
  };
  syncInputs();

  const postTweak = (edits) => {
    Object.assign(T, edits);
    applyTweaks();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch(_) {}
  };

  twAccent.addEventListener('input', (e) => postTweak({ accent: e.target.value }));
  twName.addEventListener('input', (e) => postTweak({ name: e.target.value }));
  twRole.addEventListener('input', (e) => postTweak({ role: e.target.value }));
  twTagline.addEventListener('input', (e) => postTweak({ tagline: e.target.value }));
  twGrain.addEventListener('change', (e) => postTweak({ grain: e.target.checked }));
  twCursor.addEventListener('change', (e) => postTweak({ cursor_trail: e.target.checked }));
  twLogs.addEventListener('change', (e) => postTweak({ live_logs: e.target.checked }));
  twTheme.addEventListener('change', (e) => postTweak({ theme: e.target.value }));

  /* edit-mode host protocol */
  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || !d.type) return;
    if (d.type === '__activate_edit_mode')   tw.hidden = false;
    if (d.type === '__deactivate_edit_mode') tw.hidden = true;
  });
  twClose.addEventListener('click', () => { tw.hidden = true; });
  setTimeout(() => {
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(_) {}
  }, 400);

})();
