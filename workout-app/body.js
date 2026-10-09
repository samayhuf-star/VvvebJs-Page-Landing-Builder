/* Animated side-view figure + highlighted muscle map. */
const PO = (sh,hip,knee,foot,elbow,hand,knee2,foot2) => ({sh,hip,knee,foot,elbow,hand,knee2:knee2||knee,foot2:foot2||foot});
const STAND = PO([100,42],[100,78],[100,106],[100,134],[100,64],[102,88]);

const POSES = {
  squat:    [PO([100,42],[100,78],[100,106],[100,134],[112,58],[130,52]),
             PO([103,70],[78,100],[124,104],[104,134],[120,76],[138,72])],
  lunge:    [STAND,
             PO([100,66],[100,100],[130,104],[132,134],[100,88],[102,112],[78,124],[60,134])],
  hinge:    [PO([100,42],[100,78],[100,106],[100,134],[100,66],[104,92]),
             PO([118,86],[68,74],[76,106],[80,134],[122,104],[122,122])],
  press:    [PO([100,42],[100,78],[100,106],[100,134],[112,60],[108,42]),
             PO([100,42],[100,78],[100,106],[100,134],[104,22],[104,2])],
  raise:    [PO([100,42],[100,78],[100,106],[100,134],[100,66],[104,90]),
             PO([100,42],[100,78],[100,106],[100,134],[124,46],[146,42])],
  curl:     [PO([100,42],[100,78],[100,106],[100,134],[104,66],[108,92]),
             PO([100,42],[100,78],[100,106],[100,134],[104,66],[124,48])],
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
  calf:     [PO([100,42],[100,78],[100,106],[100,134],[100,64],[102,88]),
             PO([100,34],[100,70],[100,98],[100,124],[100,56],[102,80])],
  wallsit:  [PO([104,50],[104,92],[144,94],[144,134],[122,78],[138,90]),
             PO([104,50],[104,93],[144,95],[144,134],[122,78],[138,91])],
  run:      [PO([100,42],[100,78],[126,86],[118,108],[116,62],[132,50],[100,108],[98,134]),
             PO([100,42],[100,78],[100,108],[98,134],[84,64],[76,80],[126,86],[118,108])],
};
const LYING = new Set(['bench','superman','crunch','legraise','bridge']);

const lerp = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
function mix(A,B,t){ const o={}; for(const k in A) o[k]=lerp(A[k],B[k],t); return o; }
const NS = 'http://www.w3.org/2000/svg';

/* Draw/animate a figure inside `host`. Returns {stop()}. */
function mountFigure(host, ex){
  const [A,B] = POSES[ex.pat] || POSES.squat;
  const prim = new Set(ex.p);
  const legs = ['quads','glutes','hamstrings','calves'].some(m=>prim.has(m));
  const arms = ['biceps','triceps','shoulders','forearms'].some(m=>prim.has(m));
  const trunk = ['chest','abs','obliques','lats','traps','lowerback'].some(m=>prim.has(m));
  host.innerHTML = '';
  const svg = document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox','0 -6 200 148'); svg.setAttribute('class','figure'); svg.setAttribute('role','img');
  svg.setAttribute('aria-label', ex.name+' demonstration');
  const mk = (tag,attrs,parent=svg) => { const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); parent.appendChild(e); return e; };
  mk('line',{x1:6,y1:138,x2:194,y2:138,class:'ground'});
  if (ex.pat==='pullup') mk('line',{x1:70,y1:12,x2:130,y2:12,class:'bar'});
  if (ex.pat==='wallsit') mk('line',{x1:100,y1:0,x2:100,y2:138,class:'wall'});
  const line = (cls) => mk('polyline',{points:'',class:'limb '+cls});
  const farLeg = line('far'+(legs?' hot':'')), farArm = line('far'+(arms?' hot':''));
  const leg = line(legs?'hot':''), torso = line(trunk?'hot torso':'torso'), arm = line(arms?'hot':'');
  const head = mk('circle',{r:9,class:'head'});
  const pts = a => a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  function draw(J){
    leg.setAttribute('points',pts([J.hip,J.knee,J.foot]));
    farLeg.setAttribute('points',pts([J.hip,J.knee2,J.foot2]));
    torso.setAttribute('points',pts([J.hip,J.sh]));
    arm.setAttribute('points',pts([J.sh,J.elbow,J.hand]));
    farArm.setAttribute('points',pts([J.sh,[J.elbow[0]-4,J.elbow[1]+1],[J.hand[0]-4,J.hand[1]+1]]));
    const dx=J.sh[0]-J.hip[0], dy=J.sh[1]-J.hip[1], d=Math.hypot(dx,dy)||1;
    head.setAttribute('cx',J.sh[0]+dx/d*14); head.setAttribute('cy',J.sh[1]+dy/d*14);
  }
  host.appendChild(svg);
  let raf, t0 = performance.now();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame(now){
    const ph = ((now-t0)/3200)%1;                 // 3.2 s loop: down, hold, up, hold
    const k = ph<.4 ? ph/.4 : ph<.5 ? 1 : ph<.9 ? 1-(ph-.5)/.4 : 0;
    const e = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
    draw(mix(A,B,e));
    raf = requestAnimationFrame(frame);
  }
  if (reduce) draw(A); else raf = requestAnimationFrame(frame);
  return { stop(){ cancelAnimationFrame(raf); } };
}

/* Front/back muscle map. Regions: [id, view(f|b), shape, attrs] */
const MAP = [
  ['shoulders','fb','ellipse',{cx:29,cy:44,rx:8,ry:7}],['shoulders','fb','ellipse',{cx:71,cy:44,rx:8,ry:7}],
  ['chest','f','ellipse',{cx:41,cy:57,rx:9.5,ry:8}],['chest','f','ellipse',{cx:59,cy:57,rx:9.5,ry:8}],
  ['abs','f','rect',{x:43,y:67,width:14,height:30,rx:5}],
  ['obliques','f','ellipse',{cx:36,cy:84,rx:4,ry:12}],['obliques','f','ellipse',{cx:64,cy:84,rx:4,ry:12}],
  ['biceps','f','ellipse',{cx:23,cy:64,rx:4.5,ry:10}],['biceps','f','ellipse',{cx:77,cy:64,rx:4.5,ry:10}],
  ['triceps','b','ellipse',{cx:23,cy:64,rx:4.5,ry:10}],['triceps','b','ellipse',{cx:77,cy:64,rx:4.5,ry:10}],
  ['forearms','fb','ellipse',{cx:20,cy:90,rx:4,ry:12}],['forearms','fb','ellipse',{cx:80,cy:90,rx:4,ry:12}],
  ['quads','f','ellipse',{cx:41,cy:130,rx:9,ry:22}],['quads','f','ellipse',{cx:59,cy:130,rx:9,ry:22}],
  ['calves','fb','ellipse',{cx:39,cy:174,rx:5.5,ry:17}],['calves','fb','ellipse',{cx:61,cy:174,rx:5.5,ry:17}],
  ['traps','b','path',{d:'M50 33 L36 42 Q50 56 64 42 Z'}],
  ['lats','b','ellipse',{cx:38,cy:68,rx:8,ry:14}],['lats','b','ellipse',{cx:62,cy:68,rx:8,ry:14}],
  ['lowerback','b','rect',{x:43,y:80,width:14,height:16,rx:4}],
  ['glutes','b','ellipse',{cx:42,cy:106,rx:9,ry:8}],['glutes','b','ellipse',{cx:58,cy:106,rx:9,ry:8}],
  ['hamstrings','b','ellipse',{cx:41,cy:134,rx:8.5,ry:20}],['hamstrings','b','ellipse',{cx:59,cy:134,rx:8.5,ry:20}],
];
const SILHOUETTE = '<circle cx="50" cy="15" r="10"/><rect x="45" y="24" width="10" height="9"/>' +
  '<path d="M31 36 H69 L66 100 H34 Z"/><rect x="16" y="40" width="12" height="52" rx="6"/><rect x="72" y="40" width="12" height="52" rx="6"/>' +
  '<path d="M33 98 H67 L64 148 H36 Z"/><rect x="33" y="146" width="14" height="46" rx="6"/><rect x="53" y="146" width="14" height="46" rx="6"/>';

function muscleMap(ex){
  const p = new Set(ex.p), s = new Set(ex.s);
  const view = v => {
    const regions = MAP.filter(m=>m[1].includes(v)).map(([id,,shape,a])=>{
      const cls = p.has(id)?'m-pri':s.has(id)?'m-sec':'m-off';
      const attrs = Object.entries(a).map(([k,x])=>`${k}="${x}"`).join(' ');
      return `<${shape} ${attrs} class="${cls}"><title>${MUSCLE_NAMES[id]}</title></${shape}>`;
    }).join('');
    return `<figure><svg viewBox="0 0 100 196" class="mmap" role="img" aria-label="${v==='f'?'Front':'Back'} muscle map"><g class="sil">${SILHOUETTE}</g>${regions}</svg><figcaption>${v==='f'?'Front':'Back'}</figcaption></figure>`;
  };
  return `<div class="mmaps">${view('f')}${view('b')}</div>`;
}
