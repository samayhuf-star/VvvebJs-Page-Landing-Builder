/* Full-body anatomical-style figure, animated. Working muscles are drawn red (secondary: lighter red).
   Front view for upright moves, side view for floor / bent-over moves. */
const NS = 'http://www.w3.org/2000/svg';
const add = (a,b) => [a[0]+b[0], a[1]+b[1]], sub = (a,b) => [a[0]-b[0], a[1]-b[1]], mul = (a,k) => [a[0]*k, a[1]*k];
const len = a => Math.hypot(a[0], a[1]), norm = a => { const l = len(a) || 1; return [a[0]/l, a[1]/l]; };
const lerp = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
const ang = a => Math.atan2(a[1], a[0]) * 180 / Math.PI;
const f1 = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);

/* ---------- poses ---------- */
const mir = p => [200-p[0], p[1]];
/* front pose: S shoulder-centre, H hip-centre, left-side e/h/k/f given, right side mirrored unless supplied */
function FP(S,H,eL,hL,kL,fL,R){ R = R || {}; return { S,H,eL,hL,kL,fL, eR:R.e||mir(eL), hR:R.h||mir(hL), kR:R.k||mir(kL), fR:R.f||mir(fL) }; }
/* side pose: near limbs + far leg */
const PO = (sh,hip,knee,foot,elbow,hand,knee2,foot2) => ({ sh,hip,knee,foot,elbow,hand,knee2:knee2||knee,foot2:foot2||foot });

const POSES = {
  /* ---- front view ---- */
  squat:  [FP([100,40],[100,77],[85,60],[94,48],[88,106],[84,132]),
           FP([100,60],[100,98],[85,80],[94,68],[72,112],[80,132])],
  press:  [FP([100,40],[100,77],[76,54],[82,36],[90,106],[88,132]),
           FP([100,40],[100,77],[86,22],[88,4],[90,106],[88,132])],
  raise:  [FP([100,40],[100,77],[78,60],[76,80],[90,106],[88,132]),
           FP([100,40],[100,77],[64,43],[46,42],[90,106],[88,132])],
  curl:   [FP([100,40],[100,77],[81,62],[79,86],[90,106],[88,132]),
           FP([100,40],[100,77],[82,62],[87,46],[90,106],[88,132])],
  calf:   [FP([100,40],[100,77],[82,62],[80,86],[90,106],[88,131]),
           FP([100,33],[100,70],[82,55],[80,79],[90,99],[88,123])],
  run:    [FP([100,40],[100,77],[82,62],[80,84],[92,90],[91,112],{e:[118,56],h:[112,44],k:[110,106],f:[112,132]}),
           FP([100,40],[100,77],[82,56],[88,44],[90,106],[88,132],{e:[118,62],h:[120,84],k:[108,90],f:[109,112]})],
  jack:   [FP([100,40],[100,77],[82,62],[82,86],[95,106],[94,132]),
           FP([100,34],[100,71],[72,22],[66,4],[78,100],[64,124])],
  /* ---- side view (facing right) ---- */
  lunge:    [PO([100,42],[100,78],[100,106],[100,134],[100,64],[102,88]),
             PO([100,66],[100,100],[130,104],[132,134],[100,88],[102,112],[78,124],[60,134])],
  hinge:    [PO([100,42],[100,78],[100,106],[100,134],[100,66],[104,92]),
             PO([118,86],[68,74],[76,106],[80,134],[122,104],[122,122])],
  extension:[PO([100,46],[100,80],[100,106],[100,134],[100,24],[84,40]),
             PO([100,46],[100,80],[100,106],[100,134],[100,24],[100,2])],
  row:      [PO([120,84],[72,76],[86,106],[82,134],[124,104],[124,124]),
             PO([120,84],[72,76],[86,106],[82,134],[96,92],[120,102])],
  pushup:   [PO([148,90],[90,100],[60,114],[30,130],[150,110],[150,130]),
             PO([148,114],[90,116],[60,122],[30,130],[168,120],[150,130])],
  pike:     [PO([134,90],[96,56],[66,92],[40,130],[145,108],[145,130]),
             PO([146,106],[96,56],[66,92],[40,130],[162,118],[145,130])],
  bench:    [PO([110,122],[62,122],[50,98],[42,130],[116,110],[108,96]),
             PO([110,122],[62,122],[50,98],[42,130],[108,102],[108,70])],
  superman: [PO([130,126],[80,126],[55,126],[30,126],[152,126],[174,126]),
             PO([130,118],[80,126],[55,118],[30,108],[152,112],[174,104])],
  pullup:   [PO([100,56],[100,94],[100,112],[100,128],[100,36],[100,14]),
             PO([100,26],[100,64],[100,82],[100,98],[112,22],[100,14])],
  crunch:   [PO([128,126],[72,126],[102,100],[114,130],[132,116],[124,106]),
             PO([116,102],[72,126],[102,100],[114,130],[122,94],[112,92])],
  legraise: [PO([130,126],[72,126],[42,126],[12,126],[100,128],[80,128]),
             PO([130,126],[72,126],[74,98],[74,66],[100,128],[80,128])],
  plank:    [PO([140,102],[90,110],[60,119],[30,130],[146,130],[152,130]),
             PO([140,100],[90,106],[60,116],[30,130],[146,130],[152,130])],
  climber:  [PO([148,90],[90,100],[60,114],[30,130],[150,110],[150,130],[114,108],[102,128]),
             PO([148,90],[90,100],[114,108],[102,128],[150,110],[150,130],[60,114],[30,130])],
  bridge:   [PO([152,128],[110,128],[82,104],[62,134],[140,132],[124,132]),
             PO([152,122],[110,100],[82,104],[62,134],[140,128],[124,130])],
  wallsit:  [PO([104,50],[104,92],[144,94],[144,134],[122,78],[138,90]),
             PO([104,50],[104,93],[144,95],[144,134],[122,78],[138,91])],
};
const FRONT = new Set(['squat','press','raise','curl','calf','run','jack']);
const SUPINE = new Set(['bench','crunch','legraise','bridge']);

function mix(A,B,t){ const o = {}; for (const k in A) o[k] = lerp(A[k], B[k], t); return o; }

/* ---------- shape helpers (return SVG strings) ---------- */
function smooth(p){
  const n = p.length, m = i => lerp(p[i%n], p[(i+1)%n], .5);
  let s = 'M' + f1(m(n-1));
  for (let i = 0; i < n; i++) s += 'Q' + f1(p[i]) + ' ' + f1(m(i));
  return s + 'Z';
}
function prof(pf,t){
  for (let i = 1; i < pf.length; i++) if (t <= pf[i][0]) { const a = pf[i-1], b = pf[i], k = (t-a[0])/((b[0]-a[0])||1); return a[1]+(b[1]-a[1])*k; }
  return pf[pf.length-1][1];
}
/* tapered bone from A to B; pf = [[t, halfWidth]...]; off = offset vector for the centre line */
function bone(A,B,pf,cls,off){
  const d = norm(sub(B,A)), n = [-d[1], d[0]], N = 8, L = [], R = [];
  off = off || [0,0];
  for (let i = 0; i <= N; i++) { const t = i/N, c = add(lerp(A,B,t), off), w = prof(pf,t); L.push(add(c, mul(n,w))); R.push(sub(c, mul(n,w))); }
  const cap0 = sub(add(A,off), mul(d, prof(pf,0)*.85)), cap1 = add(add(B,off), mul(d, prof(pf,1)*.85));
  return `<path class="${cls}" d="${smooth([cap0, ...L, cap1, ...R.reverse()])}"/>`;
}
/* muscle belly along part of a bone */
function belly(A,B,t0,t1,w,cls,off){
  return bone(lerp(A,B,t0), lerp(A,B,t1), [[0,w*.55],[.16,w*.95],[.5,w],[.84,w*.85],[1,w*.45]], cls, off);
}
const ell = (c,rx,ry,a,cls) => `<ellipse class="${cls}" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx}" ry="${ry}" transform="rotate(${a.toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})"/>`;

/* ---------- joints for each view ---------- */
function jointsFront(p){
  const S = p.S, H = p.H, u = norm(sub(S,H)), n = [-u[1], u[0]], down = mul(u,-2);
  return { v:'f', S, H, u, n, L:len(sub(S,H)),
    arms:[{ s:add(add(S,mul(n,-16)),down), e:p.eL, h:p.hL }, { s:add(add(S,mul(n,16)),down), e:p.eR, h:p.hR }],
    legs:[{ h:add(H,mul(n,-9)), k:p.kL, a:p.fL }, { h:add(H,mul(n,9)), k:p.kR, a:p.fR }] };
}
function jointsSide(p, sg){
  const S = p.sh, H = p.hip, u = norm(sub(S,H)), sh = [-3,1];
  return { v:'s', S, H, u, L:len(sub(S,H)), sg,
    arms:[{ s:S, e:p.elbow, h:p.hand }, { s:S, e:add(p.elbow,sh), h:add(p.hand,sh) }],
    legs:[{ h:H, k:p.knee, a:p.foot }, { h:H, k:p.knee2, a:p.foot2 }] };
}

/* ---------- body ---------- */
const W = {
  f: { torso:[[0,15],[.14,15.5],[.45,11.5],[.8,11],[1,12.5]], thigh:[[0,9.5],[.35,8.6],[1,5.4]], shin:[[0,5.2],[.28,5.8],[1,3.2]], uarm:[[0,4.9],[.5,4.5],[1,3.5]], farm:[[0,3.7],[.3,4],[1,2.7]] },
  s: { torso:[[0,8],[.14,9.6],[.45,8],[.75,7.6],[1,8.6]], thigh:[[0,9],[.4,8.2],[1,5.4]], shin:[[0,5.2],[.3,5.8],[1,3.2]], uarm:[[0,4.4],[.5,4.5],[1,3.5]], farm:[[0,3.6],[.3,3.9],[1,2.7]] },
};
function legBody(J,leg,cls){
  const w = W[J.v], s = bone(leg.h, leg.k, w.thigh, cls) + bone(leg.k, leg.a, w.shin, cls);
  if (J.v === 'f') return s + ell(add(leg.a,[0,3.5]), 4.2, 5.2, 0, cls);
  return s + bone(add(leg.a,[-1,-1]), add(leg.a,[8,1.5]), [[0,2.8],[1,2]], cls);
}
function armBody(J,arm,cls){
  const w = W[J.v];
  return bone(arm.s, arm.e, w.uarm, cls) + bone(arm.e, arm.h, w.farm, cls) + `<circle class="${cls}" cx="${arm.h[0].toFixed(1)}" cy="${arm.h[1].toFixed(1)}" r="3.1"/>`;
}
const antOf = (J,A,B) => { const d = norm(sub(B,A)); return mul([d[1], -d[0]], J.sg); };

/* ---------- muscles ---------- */
const MU = {
  f: {
    chest:     J => { const pt = J.S ; return [-1,1].map(s => ell(add(lerp(J.S,J.H,.2), mul(J.n, s*8.6)), 9.4, 7.8, ang(J.n), 'M')); },
    abs:       J => [.46,.59,.72].flatMap(t => [-1,1].map(s => ell(add(lerp(J.S,J.H,t), mul(J.n, s*3.6)), 3.5, 3.9, ang(J.n), 'M'))),
    obliques:  J => [-1,1].map(s => ell(add(lerp(J.S,J.H,.62), mul(J.n, s*10.4)), 9, 2.6, ang(J.u), 'M')),
    lats:      J => [-1,1].map(s => ell(add(lerp(J.S,J.H,.36), mul(J.n, s*12.6)), 8, 2.8, ang(J.u), 'M')),
    traps:     J => [-1,1].map(s => ell(add(add(J.S, mul(J.u,4)), mul(J.n, s*9)), 8, 3.2, ang(J.n)+s*-22, 'M')),
    shoulders: J => J.arms.map(a => ell(add(a.s,[0,1]), 9, 9.4, 0, 'M')),
    biceps:    J => J.arms.map(a => belly(a.s, a.e, .06, .9, 5.2, 'M')),
    forearms:  J => J.arms.map(a => belly(a.e, a.h, .05, .9, 4.2, 'M')),
    quads:     J => J.legs.map(l => belly(l.h, l.k, .04, .95, 9.4, 'M')),
    calves:    J => J.legs.map(l => belly(l.k, l.a, .06, .78, 6, 'M')),
  },
  s: {
    shoulders: J => [ell(J.arms[0].s, 7.2, 7.6, 0, 'M')],
    chest:     J => { const a = mul(norm([-J.u[1], J.u[0]]), -J.sg); return [ell(add(lerp(J.S,J.H,.2), mul(a,3)), 8, 6.2, ang(J.u), 'M')]; },
    abs:       J => { const a = mul(norm([-J.u[1], J.u[0]]), -J.sg); return [ell(add(lerp(J.S,J.H,.58), mul(a,3.4)), 10, 4.4, ang(J.u), 'M')]; },
    obliques:  J => [ell(lerp(J.S,J.H,.6), 8, 3.6, ang(J.u), 'M')],
    lats:      J => { const a = mul(norm([-J.u[1], J.u[0]]), -J.sg); return [ell(sub(lerp(J.S,J.H,.34), mul(a,3.2)), 11, 4.6, ang(J.u), 'M')]; },
    traps:     J => { const a = mul(norm([-J.u[1], J.u[0]]), -J.sg); return [ell(sub(lerp(J.S,J.H,.07), mul(a,2.6)), 8, 4.2, ang(J.u), 'M')]; },
    lowerback: J => { const a = mul(norm([-J.u[1], J.u[0]]), -J.sg); return [ell(sub(lerp(J.S,J.H,.72), mul(a,3.6)), 8, 4, ang(J.u), 'M')]; },
    glutes:    J => { const a = mul(norm([-J.u[1], J.u[0]]), -J.sg), l = J.legs[0]; return [ell(add(sub(J.H, mul(a,5)), mul(norm(sub(l.k,l.h)),3)), 8.6, 8.6, 0, 'M')]; },
    biceps:    J => { const a = J.arms[0]; return [belly(a.s, a.e, .12, .86, 3.6, 'M', mul(antOf(J,a.s,a.e), 1.3))]; },
    triceps:   J => { const a = J.arms[0]; return [belly(a.s, a.e, .12, .86, 3.6, 'M', mul(antOf(J,a.s,a.e), -1.3))]; },
    forearms:  J => { const a = J.arms[0]; return [belly(a.e, a.h, .08, .86, 3, 'M')]; },
    quads:     J => { const l = J.legs[0]; return [belly(l.h, l.k, .04, .95, 8.4, 'M', mul(antOf(J,l.h,l.k), 1.6))]; },
    hamstrings:J => { const l = J.legs[0]; return [belly(l.h, l.k, .04, .95, 8.2, 'M', mul(antOf(J,l.h,l.k), -1.8))]; },
    calves:    J => { const l = J.legs[0]; return [belly(l.k, l.a, .06, .76, 5.8, 'M', mul(antOf(J,l.k,l.a), -1.2))]; },
  },
};
const LEGM = ['quads','hamstrings','calves'], ARMM = ['shoulders','biceps','triceps','forearms'];
function muscles(J, ids, cls, groups){
  return ids.filter(id => groups.includes(id) && MU[J.v][id]).map(id => MU[J.v][id](J).join('').replace(/class="M"/g, `class="${cls}"`)).join('');
}

function drawFigure(J, ex){
  const pri = ex.p, sec = ex.s.filter(m => !pri.includes(m));
  const layer = groups => muscles(J, sec, 'ms', groups) + muscles(J, pri, 'mp', groups);
  const TORSO = ['chest','abs','obliques','lats','traps','lowerback','glutes'];
  let s = '';
  const [nearL, farL] = J.v === 's' ? [J.legs[0], J.legs[1]] : [null, null];
  if (J.v === 's') s += armBody(J, J.arms[1], 'fr') + legBody(J, farL, 'fr') + legBody(J, nearL, 'bd') + layer(LEGM);
  else s += J.legs.map(l => legBody(J, l, 'bd')).join('') + layer(LEGM);
  const T0 = add(J.S, mul(J.u, 2)), neckTop = add(J.S, mul(J.u, 9));
  s += bone(neckTop, T0, [[0,3.6],[1,4.2]], 'bd');
  s += bone(T0, J.H, W[J.v].torso, 'bd') + layer(TORSO);
  s += (J.v === 's' ? armBody(J, J.arms[0], 'bd') : J.arms.map(a => armBody(J, a, 'bd')).join('')) + layer(ARMM);
  /* head */
  const hc = add(J.S, mul(J.u, 15.5)), ha = ang(J.u) + 90, back = J.v === 's' ? mul(norm([J.u[1], -J.u[0]]), -J.sg * -1.8) : [0,0];
  s += ell(add(add(hc, mul(J.u,1.6)), back), 7.4, 8.8, ha, 'hr') + ell(hc, 7.2, 8.4, ha, 'bd');
  if (J.v === 's') { const nose = add(hc, mul(norm([-J.u[1], J.u[0]]), -J.sg * 7.6)); s += `<circle class="bd" cx="${nose[0].toFixed(1)}" cy="${nose[1].toFixed(1)}" r="1.6"/>`; }
  /* weights */
  if (ex.eq === 'db') {
    if (ex.pat === 'squat') { const c = lerp(J.arms[0].h, J.arms[1].h, .5); s += `<circle class="pr" cx="${c[0].toFixed(1)}" cy="${(c[1]+2).toFixed(1)}" r="6.6"/><path class="prs" d="M${(c[0]-3.5).toFixed(1)} ${(c[1]-3.5).toFixed(1)}q3.5-5 7 0"/>`; }
    else (J.v === 's' ? [J.arms[0]] : J.arms).forEach(a => { s += `<circle class="pr" cx="${a.h[0].toFixed(1)}" cy="${a.h[1].toFixed(1)}" r="3.6"/>`; });
  }
  return s;
}

/* Draw/animate a figure inside `host`. Returns {stop()}. */
function mountFigure(host, ex){
  const pose = POSES[ex.pat] || POSES.squat, front = FRONT.has(ex.pat), sg = SUPINE.has(ex.pat) ? -1 : 1;
  const [A,B] = pose;
  host.innerHTML = '';
  const svg = document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox', front ? '36 -4 128 148' : '0 -4 200 148'); svg.setAttribute('class','figure'); svg.setAttribute('role','img');
  svg.setAttribute('aria-label', ex.name + ' demonstration; working muscles shown in red');
  svg.innerHTML = `<defs>
    <linearGradient id="bg" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="170" y2="0"><stop offset="0" stop-color="#f7f8fb"/><stop offset=".55" stop-color="#e3e7ee"/><stop offset="1" stop-color="#c4ccd8"/></linearGradient>
    <linearGradient id="mr" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="170" y2="0"><stop offset="0" stop-color="#ff6a58"/><stop offset=".6" stop-color="#dc2f22"/><stop offset="1" stop-color="#a81b12"/></linearGradient></defs>
    <ellipse cx="100" cy="138" rx="${front ? 46 : 78}" ry="3.2" class="shadow"/>
    ${ex.pat === 'pullup' ? '<line x1="68" y1="12" x2="132" y2="12" class="barl"/>' : ''}
    ${ex.pat === 'wallsit' ? '<line x1="95" y1="-4" x2="95" y2="138" class="walll"/>' : ''}
    <g id="fig"></g>`;
  host.appendChild(svg);
  const g = svg.querySelector('#fig');
  const draw = p => { g.innerHTML = drawFigure(front ? jointsFront(p) : jointsSide(p, sg), ex); };
  let raf; const t0 = performance.now();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame(now){
    const ph = ((now-t0)/3200)%1;                 // 3.2 s loop: down, hold, up, hold
    const k = ph<.4 ? ph/.4 : ph<.5 ? 1 : ph<.9 ? 1-(ph-.5)/.4 : 0;
    draw(mix(A,B, k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2));
    raf = requestAnimationFrame(frame);
  }
  if (reduce) draw(A); else raf = requestAnimationFrame(frame);
  return { stop(){ cancelAnimationFrame(raf); } };
}
