/* FitCoach - personal trainer app. Everything is stored locally in the browser. */
const KEY = 'fitcoach.v1';
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2,'0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayISO = () => iso(new Date());
const addDays = (s,n) => { const d = new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return iso(d); };
const fmtDate = s => new Date(s+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
const byId = id => EXERCISES.find(e => e.id === id);

/* ---------- state ---------- */
let S = load();
function load(){
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return { history:[], progress:{}, food:{}, sleep:{}, weights:[], ...s }; } catch(e){}
  return { profile:null, history:[], progress:{}, food:{}, sleep:{}, weights:[] };
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){ toast('Could not save - storage is full or blocked'); } }

/* ---------- units ---------- */
const imperial = () => S.profile && S.profile.units === 'imperial';
const wDisp = kg => imperial() ? Math.round(kg*2.20462*10)/10 : Math.round(kg*10)/10;
const wKg = v => imperial() ? v/2.20462 : v;
const wUnit = () => imperial() ? 'lb' : 'kg';

/* ---------- targets ---------- */
function targets(p){
  const bmr = 10*p.weight + 6.25*p.height - 5*p.age + (p.sex === 'm' ? 5 : -161);
  const tdee = bmr * (1.3 + 0.04*p.days);
  const adj = p.goal === 'lose' ? -Math.min(500, tdee*0.2) : p.goal === 'build' ? 250 : 0;
  const kcal = Math.round(Math.max(p.sex === 'm' ? 1500 : 1200, tdee + adj) / 10) * 10;
  const protein = Math.round(p.weight * (p.goal === 'lose' ? 2.0 : 1.8));
  const fat = Math.round(0.27*kcal/9);
  const carbs = Math.max(0, Math.round((kcal - protein*4 - fat*9)/4));
  const sleep = p.age < 18 ? 9 : p.age >= 65 ? 7.5 : 8;
  return { kcal, protein, fat, carbs, sleep, tdee:Math.round(tdee) };
}

/* ---------- workout planner ---------- */
const SLOTS = {
  full:  ['quads','chest','back','posterior','shoulders','core'],
  upper: ['chest','back','shoulders','biceps','triceps','core'],
  lower: ['quads','posterior','quads','calves','core'],
  push:  ['chest','shoulders','triceps','chest','core'],
  pull:  ['back','back','biceps','posterior','core'],
};
const SPLITS = {
  2: [['Full Body A','full'],['Full Body B','full']],
  3: [['Full Body A','full'],['Full Body B','full'],['Full Body C','full']],
  4: [['Upper Body','upper'],['Lower Body','lower'],['Upper Body','upper'],['Lower Body','lower']],
  5: [['Push','push'],['Pull','pull'],['Legs','lower'],['Upper Body','upper'],['Lower Body','lower']],
  6: [['Push','push'],['Pull','pull'],['Legs','lower'],['Push','push'],['Pull','pull'],['Legs','lower']],
};
const WEEKDAYS = { 2:[2,5], 3:[1,3,5], 4:[1,2,4,5], 5:[1,2,3,5,6], 6:[1,2,3,4,5,6] };
const sessionCount = () => S.history.length;

function allowed(ex, p){ return ex.eq === 'none' || (ex.eq === 'db' && p.equip.includes('db')) || (ex.eq === 'bar' && p.equip.includes('bar')); }

function buildWorkout(p, k, recovery){
  const split = SPLITS[p.days], [name, kind] = split[k % split.length];
  const v = Math.floor(k / split.length) + (k % split.length);
  let slots = SLOTS[kind].slice();
  const n = clamp(Math.round((p.minutes - 8)/6), 3, 7);
  const core = slots.filter(s => s === 'core'), main = slots.filter(s => s !== 'core');
  slots = main.slice(0, Math.max(1, n - core.length)).concat(core);
  const used = new Set(), picks = [];
  slots.forEach((slot,i) => {
    const c = EXERCISES.filter(e => e.focus === slot && allowed(e,p) && e.lvl <= p.level && !used.has(e.id));
    if (!c.length) return;
    const ex = c[(v + i) % c.length]; used.add(ex.id); picks.push(ex);
  });
  if (p.goal === 'lose' && !used.has('climber')) picks.push(byId('climber'));
  const baseSets = { 1:2, 2:3, 3:4 }[p.level];
  const sets = Math.max(2, (p.goal === 'lose' ? Math.max(3, baseSets) : baseSets) - (recovery ? 1 : 0));
  const rest = ({ build:75, fit:60, lose:40 }[p.goal]) + (recovery ? 15 : 0);
  const items = picks.map(ex => {
    const prog = S.progress[ex.id] || {};
    let [lo,hi] = ex.r;
    if (ex.unit === 'sec') { lo += 5*(prog.bump||0); hi += 5*(prog.bump||0); }
    else if (ex.eq !== 'db') {
      if (p.goal === 'lose') { lo += 2; hi += 3; }
      lo += 2*(prog.bump||0); hi += 2*(prog.bump||0);
    } else if (p.goal === 'lose') { lo += 2; hi += 3; }
    return { id:ex.id, sets: ex.unit === 'sec' ? Math.min(sets,3) : sets, lo, hi, rest: ex.unit === 'sec' ? 30 : rest, weight: prog.weight || null };
  });
  const est = Math.round(5 + items.reduce((t,i) => t + i.sets*((byId(i.id).unit === 'sec' ? i.hi : i.hi*3.5) + i.rest)/60, 0));
  return { name, kind, items, est, k };
}

function weekPlan(p){
  const out = []; let k = sessionCount();
  const doneToday = S.history.some(h => h.date === todayISO());
  for (let i = 0; i < 7; i++){
    const date = addDays(todayISO(), i), wd = new Date(date+'T12:00:00').getDay();
    if (!WEEKDAYS[p.days].includes(wd)) { out.push({ date, rest:true }); continue; }
    if (i === 0 && doneToday) { out.push({ date, done:true, name:S.history.filter(h=>h.date===date).slice(-1)[0].name }); continue; }
    out.push({ date, name:SPLITS[p.days][k % SPLITS[p.days].length][0], k }); k++;
  }
  return out;
}

/* ---------- derived data ---------- */
const sleepLast = () => S.sleep[todayISO()] || null;
const isRecovery = () => { const s = sleepLast(); return !!(s && s.hours < 6); };
const dayFood = d => S.food[d] || [];
const dayTotals = d => dayFood(d).reduce((t,f) => ({ kcal:t.kcal+f.kcal, p:t.p+f.p, c:t.c+f.c, f:t.f+f.f }), { kcal:0,p:0,c:0,f:0 });
const weekSessions = () => { const start = addDays(todayISO(), -((new Date().getDay()+6)%7)); return S.history.filter(h => h.date >= start).length; };

function coachMessage(){
  const p = S.profile, t = targets(p), sl = sleepLast(), tot = dayTotals(todayISO()), hour = new Date().getHours();
  const msgs = [];
  if (!sl) msgs.push('Log last night\'s sleep so I can tune today\'s intensity.');
  else if (sl.hours < 6) msgs.push(`You slept only ${sl.hours.toFixed(1)} h. I\'ve switched today\'s session to <b>recovery mode</b>: one fewer set and longer rests. Aim for ${t.sleep} h tonight.`);
  else if (sl.hours >= t.sleep - .5) msgs.push(`Great sleep (${sl.hours.toFixed(1)} h) - you\'re primed to push hard today.`);
  else msgs.push(`${sl.hours.toFixed(1)} h of sleep is a bit short of your ${t.sleep} h goal. Train as planned, but keep form strict.`);
  if (hour >= 14 && tot.kcal === 0) msgs.push('Nothing logged for food yet today - add your meals so calories stay on target.');
  else if (tot.protein !== undefined && hour >= 18 && tot.p < t.protein*0.6) msgs.push(`Protein is at ${Math.round(tot.p)} g of ${t.protein} g - include a protein-rich dinner.`);
  const wk = weekSessions();
  msgs.push(wk >= p.days ? `Weekly target hit: ${wk}/${p.days} sessions. Outstanding.` : `${wk}/${p.days} sessions done this week.`);
  return msgs;
}

/* ---------- UI helpers ---------- */
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('show'), 2600); }
let figure = null;
function stopFigure(){ if (figure) { figure.stop(); figure = null; } }
const chips = ex => ex.p.map(m=>`<span class="chip pri">${MUSCLE_NAMES[m]}</span>`).join('') + ex.s.map(m=>`<span class="chip sec">${MUSCLE_NAMES[m]}</span>`).join('');
const repText = it => byId(it.id).unit === 'sec' ? `${it.sets} × ${it.hi}s` : `${it.sets} × ${it.lo}–${it.hi} reps`;

/* ---------- tabs ---------- */
let tab = 'today', eatDate = todayISO();
function go(t){ tab = t; render(); window.scrollTo(0,0); }
function render(){
  stopFigure();
  if (!S.profile) tab = 'me';
  document.querySelectorAll('nav button').forEach(b => { b.classList.toggle('on', b.dataset.tab === tab); b.disabled = !S.profile; });
  const v = $('#view');
  v.innerHTML = ({ today:viewToday, plan:viewPlan, eat:viewEat, sleep:viewSleep, me:viewMe })[tab]();
  if (tab === 'me' && S.profile) bindMe();
}

/* ---------- Today ---------- */
function viewToday(){
  const p = S.profile, t = targets(p), plan = weekPlan(p), td = plan[0], tot = dayTotals(todayISO()), sl = sleepLast();
  const rec = isRecovery();
  let card;
  if (td.done) card = `<section class="card hero done"><h2>Workout complete ✓</h2><p>${esc(td.name)} is in the books. Eat well, hydrate and sleep ${t.sleep} h.</p></section>`;
  else if (td.rest) {
    const next = plan.find(d => !d.rest && !d.done);
    card = `<section class="card hero"><h2>Rest day</h2><p>Muscles grow while you recover. Take a 20–30 min walk and stretch.${next ? ` Next up: <b>${esc(next.name)}</b> on ${fmtDate(next.date)}.` : ''}</p><button class="btn ghost" data-act="start-anyway">Train anyway</button></section>`;
  } else card = workoutCard(buildWorkout(p, td.k, rec), rec, 'Today');
  const msgs = coachMessage().map(m=>`<li>${m}</li>`).join('');
  return `
  <header class="top"><div><h1>Hi ${esc(p.name || 'there')} 👋</h1><p class="muted">${fmtDate(todayISO())}</p></div></header>
  <section class="card coach"><div class="avatar" aria-hidden="true">🏋️</div><div><h3>Your coach says</h3><ul>${msgs}</ul></div></section>
  ${card}
  <div class="stats">
    <button class="stat" data-go="eat"><span class="k">Calories</span><b>${Math.round(tot.kcal)}</b><span class="muted">of ${t.kcal} kcal</span><i class="bar"><u style="width:${clamp(tot.kcal/t.kcal*100,0,100)}%"></u></i></button>
    <button class="stat" data-go="sleep"><span class="k">Sleep</span><b>${sl ? sl.hours.toFixed(1)+' h' : '–'}</b><span class="muted">goal ${t.sleep} h</span><i class="bar"><u style="width:${sl ? clamp(sl.hours/t.sleep*100,0,100) : 0}%"></u></i></button>
    <button class="stat" data-go="plan"><span class="k">This week</span><b>${weekSessions()}/${p.days}</b><span class="muted">sessions</span><i class="bar"><u style="width:${clamp(weekSessions()/p.days*100,0,100)}%"></u></i></button>
  </div>`;
}
function workoutCard(w, rec, label){
  const list = w.items.map(it => { const ex = byId(it.id); return `<li><button class="row" data-ex="${ex.id}"><span><b>${esc(ex.name)}</b><small>${ex.p.map(m=>MUSCLE_NAMES[m]).join(', ')}</small></span><em>${repText(it)}</em></button></li>`; }).join('');
  return `<section class="card hero"><span class="badge">${label}${rec ? ' · recovery mode' : ''}</span><h2>${esc(w.name)}</h2>
  <p class="muted">${w.items.length} exercises · about ${w.est} min · rest ${w.items[0] ? w.items[0].rest : 60}s between sets</p>
  <ul class="list">${list}</ul><button class="btn" data-act="start" data-k="${w.k}">Start workout</button></section>`;
}

/* ---------- Plan ---------- */
let libFilter = 'all';
function viewPlan(){
  const p = S.profile, plan = weekPlan(p), rec = isRecovery();
  const days = plan.map((d,i) => {
    if (d.rest) return `<li class="day rest"><b>${fmtDate(d.date)}</b><span>Rest / light walk</span></li>`;
    if (d.done) return `<li class="day"><b>${fmtDate(d.date)}</b><span>${esc(d.name)} ✓</span></li>`;
    return `<li class="day"><details><summary><b>${fmtDate(d.date)}</b><span>${esc(d.name)}</span></summary><ul class="list">${buildWorkout(p,d.k,i===0&&rec).items.map(it=>{const ex=byId(it.id);return `<li><button class="row" data-ex="${ex.id}"><span><b>${esc(ex.name)}</b><small>${ex.p.map(m=>MUSCLE_NAMES[m]).join(', ')}</small></span><em>${repText(it)}</em></button></li>`;}).join('')}</ul></details></li>`;
  }).join('');
  const groups = ['all','chest','back','shoulders','biceps','triceps','quads','posterior','calves','core','cardio'];
  const lib = EXERCISES.filter(e => libFilter === 'all' || e.focus === libFilter);
  return `<header class="top"><h1>Training plan</h1></header>
  <p class="muted">${p.days} days/week · ${p.minutes} min · ${({lose:'fat loss',build:'muscle gain',fit:'general fitness'})[p.goal]}. The plan adapts as you progress and sleep.</p>
  <ul class="week">${days}</ul>
  <h2 class="hd">Exercise library</h2>
  <div class="pills">${groups.map(g=>`<button class="pill ${g===libFilter?'on':''}" data-lib="${g}">${g[0].toUpperCase()+g.slice(1)}</button>`).join('')}</div>
  <ul class="list">${lib.map(ex=>`<li><button class="row" data-ex="${ex.id}"><span><b>${esc(ex.name)}</b><small>${ex.p.map(m=>MUSCLE_NAMES[m]).join(', ')}${ex.eq==='db'?' · dumbbells':ex.eq==='bar'?' · pull-up bar':''}</small></span><em>›</em></button></li>`).join('')}</ul>`;
}

/* ---------- Exercise detail modal (also reused by the player) ---------- */
function exerciseBody(ex){
  return `<div class="stage" id="stage"></div>${muscleMap(ex)}<div class="chips">${chips(ex)}</div>
  <ol class="cues">${ex.cues.map(c=>`<li>${esc(c)}</li>`).join('')}</ol>${ex.tip ? `<p class="tip">💡 ${esc(ex.tip)}</p>` : ''}`;
}
function openExercise(id){
  const ex = byId(id), m = $('#modal');
  m.innerHTML = `<div class="sheet"><button class="x" data-act="close" aria-label="Close">×</button><h2>${esc(ex.name)}</h2>${exerciseBody(ex)}</div>`;
  m.hidden = false; stopFigure(); figure = mountFigure($('#stage'), ex);
}
function closeModal(){ $('#modal').hidden = true; $('#modal').innerHTML = ''; if (!P.on) stopFigure(); }

/* ---------- Eat ---------- */
let foodQuery = '';
function ring(pct, label, sub){
  const r = 52, c = 2*Math.PI*r, off = c*(1-clamp(pct,0,1));
  return `<svg viewBox="0 0 130 130" class="ring"><circle cx="65" cy="65" r="${r}" class="trk"/><circle cx="65" cy="65" r="${r}" class="val" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 65 65)"/><text x="65" y="63" text-anchor="middle" class="big">${label}</text><text x="65" y="82" text-anchor="middle" class="sub">${sub}</text></svg>`;
}
function viewEat(){
  const p = S.profile, t = targets(p), tot = dayTotals(eatDate), items = dayFood(eatDate);
  const burned = S.history.filter(h => h.date === eatDate).reduce((s,h) => s + h.kcal, 0);
  const left = t.kcal - tot.kcal;
  const macro = (n,v,g,cls) => `<div class="macro"><span>${n}</span><i class="bar ${cls}"><u style="width:${clamp(v/g*100,0,100)}%"></u></i><small>${Math.round(v)} / ${g} g</small></div>`;
  const meals = ['Breakfast','Lunch','Dinner','Snack'].map(m => {
    const f = items.map((x,i)=>({...x,i})).filter(x => x.meal === m);
    if (!f.length) return '';
    return `<h3>${m} <small>${Math.round(f.reduce((s,x)=>s+x.kcal,0))} kcal</small></h3><ul class="list">${f.map(x=>`<li class="food"><span><b>${esc(x.name)}</b><small>${Math.round(x.p)}P · ${Math.round(x.c)}C · ${Math.round(x.f)}F</small></span><em>${Math.round(x.kcal)}</em><button class="del" data-del="${x.i}" aria-label="Remove ${esc(x.name)}">×</button></li>`).join('')}</ul>`;
  }).join('');
  const q = foodQuery.toLowerCase();
  const res = FOODS.filter(f => !q || f[0].toLowerCase().includes(q)).slice(0,8);
  const h = new Date().getHours(), defMeal = h < 10 ? 'Breakfast' : h < 15 ? 'Lunch' : h < 20 ? 'Dinner' : 'Snack';
  return `<header class="top"><h1>Nutrition</h1></header>
  <div class="datenav"><button data-act="eat-prev" aria-label="Previous day">‹</button><b>${eatDate === todayISO() ? 'Today' : fmtDate(eatDate)}</b><button data-act="eat-next" aria-label="Next day" ${eatDate >= todayISO() ? 'disabled' : ''}>›</button></div>
  <section class="card eatsum">${ring(tot.kcal/t.kcal, Math.abs(Math.round(left)), left >= 0 ? 'kcal left' : 'kcal over')}
    <div class="macros">${macro('Protein',tot.p,t.protein,'p')}${macro('Carbs',tot.c,t.carbs,'c')}${macro('Fat',tot.f,t.fat,'f')}${burned ? `<p class="muted">🔥 Workout burned ~${Math.round(burned)} kcal</p>` : ''}</div></section>
  ${meals || '<p class="muted center">Nothing logged yet.</p>'}
  <h2 class="hd">Add food</h2>
  <label class="sr" for="fq">Search foods</label><input id="fq" type="search" placeholder="Search foods (e.g. chicken, rice)…" value="${esc(foodQuery)}" autocomplete="off">
  <label class="inline">Meal <select id="meal">${['Breakfast','Lunch','Dinner','Snack'].map(m=>`<option ${m===defMeal?'selected':''}>${m}</option>`).join('')}</select></label>
  <ul class="list" id="foodres">${res.map(f=>`<li><button class="row" data-food="${FOODS.indexOf(f)}"><span><b>${esc(f[0])}</b><small>${f[2]}P · ${f[3]}C · ${f[4]}F</small></span><em>${f[1]} kcal +</em></button></li>`).join('') || '<li class="muted">No match - use custom entry below.</li>'}</ul>
  <details class="card"><summary>Custom entry</summary>
    <form id="customfood" class="form"><label>Name<input name="name" required maxlength="60"></label>
    <div class="grid4"><label>Calories<input name="kcal" type="number" min="0" max="5000" required></label><label>Protein g<input name="p" type="number" min="0" max="500" step="0.1"></label><label>Carbs g<input name="c" type="number" min="0" max="800" step="0.1"></label><label>Fat g<input name="f" type="number" min="0" max="500" step="0.1"></label></div>
    <button class="btn">Add</button></form></details>
  <p class="muted small">Daily target ${t.kcal} kcal (maintenance ≈ ${t.tdee}). Estimates only - not medical advice.</p>`;
}
function addFood(name,kcal,p,c,f){
  const meal = ($('#meal') || {}).value || 'Snack';
  (S.food[eatDate] = S.food[eatDate] || []).push({ name, kcal, p, c, f, meal });
  save(); render(); toast(`Added ${name}`);
}

/* ---------- Sleep ---------- */
function viewSleep(){
  const t = targets(S.profile), days = [...Array(7)].map((_,i) => addDays(todayISO(), i-6));
  const rows = days.map(d => S.sleep[d] || null), logged = rows.filter(Boolean);
  const avg = logged.length ? logged.reduce((s,x)=>s+x.hours,0)/logged.length : 0;
  const debt = logged.reduce((s,x)=>s+Math.max(0,t.sleep-x.hours),0);
  const max = Math.max(10, ...logged.map(x=>x.hours));
  const bars = days.map((d,i) => { const r = rows[i], h = r ? r.hours : 0;
    return `<div class="col"><div class="barv" title="${r ? h.toFixed(1)+' h' : 'no data'}"><u class="${h && h < t.sleep-1 ? 'low' : ''}" style="height:${h/max*100}%"></u><s style="bottom:${t.sleep/max*100}%"></s></div><small>${h ? h.toFixed(1) : '–'}</small><small class="muted">${new Date(d+'T12:00:00').toLocaleDateString(undefined,{weekday:'narrow'})}</small></div>`; }).join('');
  const cur = S.sleep[todayISO()] || {};
  const tip = !logged.length ? 'Log a few nights and I\'ll personalise your training and recovery.' : avg < t.sleep-1 ? 'You\'re running a sleep deficit. Keep a fixed bedtime, no screens 30 min before bed, and avoid caffeine after 2pm.' : avg < t.sleep ? 'Close! Try going to bed 20–30 minutes earlier.' : 'Excellent consistency. Sleep is your best recovery tool - keep it up.';
  return `<header class="top"><h1>Sleep</h1></header>
  <section class="card"><div class="sleepstats"><div><b>${avg ? avg.toFixed(1) : '–'} h</b><span class="muted">7-day avg</span></div><div><b>${t.sleep} h</b><span class="muted">goal</span></div><div><b>${debt.toFixed(1)} h</b><span class="muted">week debt</span></div></div>
  <div class="chart" role="img" aria-label="Sleep hours for the last 7 days">${bars}</div></section>
  <p class="tip">💡 ${tip}</p>
  <h2 class="hd">Log last night</h2>
  <form id="sleepform" class="card form"><div class="grid2"><label>Bedtime<input type="time" name="bed" value="${cur.bed||'23:00'}" required></label><label>Wake-up<input type="time" name="wake" value="${cur.wake||'07:00'}" required></label></div>
  <label>Sleep quality <output id="qout">${cur.q||3}</output>/5<input type="range" name="q" min="1" max="5" value="${cur.q||3}"></label>
  <button class="btn">Save</button></form>`;
}

/* ---------- Me / profile ---------- */
function viewMe(){
  const p = S.profile || { name:'', sex:'m', age:30, height:175, weight:75, goal:'build', level:1, days:3, minutes:45, equip:[], units:'metric' };
  const imp = p.units === 'imperial';
  const hv = imp ? Math.round(p.height/2.54) : p.height, wv = imp ? Math.round(p.weight*2.20462*10)/10 : p.weight;
  const sel = (n,v,opts) => `<select name="${n}">${opts.map(([k,l])=>`<option value="${k}" ${String(k)===String(v)?'selected':''}>${l}</option>`).join('')}</select>`;
  const t = S.profile ? targets(p) : null;
  const hist = S.history.slice().reverse().slice(0,10).map(h=>`<li class="day"><b>${fmtDate(h.date)}</b><span>${esc(h.name)} · ${h.dur} min · ${h.kcal} kcal</span></li>`).join('');
  const wl = S.weights.slice(-6).reverse().map(w=>`<li class="day"><b>${fmtDate(w.date)}</b><span>${wDisp(w.kg)} ${wUnit()}</span></li>`).join('');
  return `<header class="top"><h1>${S.profile ? 'Profile' : 'Welcome - let\'s set up your trainer'}</h1></header>
  <form id="profile" class="card form">
    <label>Name<input name="name" value="${esc(p.name)}" maxlength="30"></label>
    <div class="grid2"><label>Units${sel('units',p.units,[['metric','Metric (kg, cm)'],['imperial','Imperial (lb, in)']])}</label><label>Sex${sel('sex',p.sex,[['m','Male'],['f','Female']])}</label></div>
    <div class="grid3"><label>Age<input name="age" type="number" min="13" max="90" value="${p.age}" required></label><label>Height (${imp?'in':'cm'})<input name="height" type="number" min="${imp?40:100}" max="${imp?96:250}" step="any" value="${hv}" required></label><label>Weight (${imp?'lb':'kg'})<input name="weight" type="number" min="${imp?66:30}" max="${imp?660:300}" step="any" value="${wv}" required></label></div>
    <label>Main goal${sel('goal',p.goal,[['lose','Lose fat'],['build','Build muscle'],['fit','Get fitter / stay healthy']])}</label>
    <label>Experience${sel('level',p.level,[[1,'Beginner'],[2,'Intermediate'],[3,'Advanced']])}</label>
    <div class="grid2"><label>Days per week${sel('days',p.days,[2,3,4,5,6].map(n=>[n,n+' days']))}</label><label>Session length${sel('minutes',p.minutes,[20,30,40,45,60,75,90].map(n=>[n,n+' min']))}</label></div>
    <fieldset><legend>Equipment (bodyweight is always included)</legend><label class="chk"><input type="checkbox" name="equip" value="db" ${p.equip.includes('db')?'checked':''}> Dumbbells</label><label class="chk"><input type="checkbox" name="equip" value="bar" ${p.equip.includes('bar')?'checked':''}> Pull-up bar</label></fieldset>
    <button class="btn">${S.profile ? 'Save changes' : 'Build my plan'}</button>
    <p class="muted small">Not medical advice. If you have an injury or health condition, check with a professional first.</p></form>
  ${t ? `<section class="card"><h3>Your daily targets</h3><p>${t.kcal} kcal · ${t.protein} g protein · ${t.carbs} g carbs · ${t.fat} g fat · ${t.sleep} h sleep</p></section>
  <h2 class="hd">Body weight</h2><form id="wform" class="inline-form"><input name="w" type="number" step="any" min="1" placeholder="Today (${wUnit()})" required aria-label="Weight in ${wUnit()}"><button class="btn">Log</button></form><ul class="week">${wl}</ul>
  <h2 class="hd">Recent workouts</h2><ul class="week">${hist || '<li class="muted">No workouts yet.</li>'}</ul>
  <div class="row-btns"><button class="btn ghost" data-act="export">Export data</button><button class="btn danger" data-act="reset">Reset everything</button></div>` : ''}`;
}
function bindMe(){}
function saveProfile(form){
  const fd = new FormData(form), g = n => fd.get(n), units = g('units');
  const prev = S.profile;
  const w = parseFloat(g('weight')), h = parseFloat(g('height'));
  const p = { name:g('name').trim(), units, sex:g('sex'), age:clamp(parseInt(g('age'),10)||30,13,90),
    height: Math.round(units === 'imperial' ? h*2.54 : h), weight: Math.round((units === 'imperial' ? w/2.20462 : w)*10)/10,
    goal:g('goal'), level:parseInt(g('level'),10), days:parseInt(g('days'),10), minutes:parseInt(g('minutes'),10), equip:fd.getAll('equip') };
  S.profile = p;
  if (!prev || prev.weight !== p.weight) S.weights.push({ date:todayISO(), kg:p.weight });
  save(); toast(prev ? 'Profile saved' : 'Your plan is ready!'); tab = 'today'; render();
}

/* ---------- Workout player ---------- */
const P = { on:false, w:null, i:0, sets:[], t0:0, timer:null };
function startWorkout(k){
  const w = buildWorkout(S.profile, k, isRecovery());
  if (!w.items.length) return toast('No exercises available for your equipment');
  P.on = true; P.w = w; P.i = 0; P.t0 = Date.now(); stopTimer();
  P.sets = w.items.map(it => [...Array(it.sets)].map(() => ({ reps: byId(it.id).unit === 'sec' ? it.hi : it.lo, weight: it.weight, done:false })));
  $('#player').hidden = false; document.body.classList.add('lock'); renderPlayer();
}
function renderPlayer(){
  const w = P.w, it = w.items[P.i], ex = byId(it.id), sec = ex.unit === 'sec', db = ex.eq === 'db', last = P.i === w.items.length-1;
  const rows = P.sets[P.i].map((s,n) => `<li class="set ${s.done?'done':''}" data-n="${n}"><span class="sn">Set ${n+1}</span>
    <div class="step"><button data-step="-1" aria-label="Decrease">−</button><output>${s.reps}${sec?'s':''}</output><button data-step="1" aria-label="Increase">+</button></div>
    ${db ? `<label class="wt"><input type="number" inputmode="decimal" step="any" min="0" value="${s.weight ? wDisp(s.weight) : ''}" placeholder="${wUnit()}" data-wt aria-label="Weight in ${wUnit()}"></label>` : ''}
    ${sec && !s.done ? `<button class="go" data-hold>Start</button>` : ''}
    <button class="ok" data-done aria-label="${s.done?'Undo set':'Complete set'}">${s.done?'✓':'○'}</button></li>`).join('');
  $('#player').innerHTML = `<div class="ptop"><button class="x" data-act="quit" aria-label="Quit workout">×</button><div class="pbar"><u style="width:${(P.i)/w.items.length*100}%"></u></div><small>${P.i+1}/${w.items.length}</small></div>
  <div class="pscroll"><h2>${esc(ex.name)}</h2><p class="target">${repText(it)} · rest ${it.rest}s${db && it.weight ? ` · last ${wDisp(it.weight)} ${wUnit()}` : ''}</p>${exerciseBody(ex)}
  <h3>Your sets</h3><ul class="sets">${rows}</ul></div>
  <div class="pnav"><button class="btn ghost" data-act="prev" ${P.i===0?'disabled':''}>Back</button><button class="btn" data-act="next">${last?'Finish workout':'Next exercise'}</button></div>`;
  stopFigure(); figure = mountFigure($('#stage'), ex);
}
function stopTimer(){ clearInterval(P.timer); P.timer = null; $('#timerbar').hidden = true; }
function countdown(sec, label, done){
  stopTimer(); let left = sec; const bar = $('#timerbar'); bar.hidden = false;
  const paint = () => { bar.innerHTML = `<span>${label}</span><b>${Math.floor(left/60)}:${pad(left%60)}</b><button data-act="t-add">+15s</button><button data-act="t-skip">Skip</button>`; };
  P.add = () => { left += 15; paint(); }; paint();
  P.timer = setInterval(() => { left--; if (left <= 0) { stopTimer(); beep(); done && done(); } else paint(); }, 1000);
  P.skip = () => { stopTimer(); done && done(); };
}
function beep(){ try { navigator.vibrate && navigator.vibrate(200); const c = new (window.AudioContext||window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); g.gain.value = .15; o.frequency.value = 880; o.start(); o.stop(c.currentTime+.18); } catch(e){} }
function completeSet(n){
  const it = P.w.items[P.i], s = P.sets[P.i][n];
  s.done = !s.done; renderPlayer();
  if (s.done) {
    const lastSet = P.sets[P.i].every(x=>x.done), lastEx = P.i === P.w.items.length-1;
    if (!(lastSet && lastEx)) countdown(it.rest, lastSet ? 'Rest - next exercise' : 'Rest', null);
    else stopTimer();
  }
}
function finishWorkout(){
  stopTimer();
  const p = S.profile, mins = Math.max(1, Math.round((Date.now()-P.t0)/60000));
  const met = { lose:6.5, build:5, fit:5.5 }[p.goal] * (isRecovery() ? .85 : 1);
  const kcal = Math.round(met * p.weight * (mins/60));
  let volume = 0, sets = 0; const notes = [];
  P.w.items.forEach((it,i) => {
    const ex = byId(it.id), done = P.sets[i].filter(s=>s.done);
    if (!done.length) return;
    sets += done.length;
    done.forEach(s => { if (s.weight) volume += s.weight*s.reps; });
    const prog = S.progress[ex.id] = S.progress[ex.id] || { bump:0, weight:null };
    const hitAll = done.length === it.sets && done.every(s => s.reps >= it.hi);
    if (ex.eq === 'db') {
      const top = Math.max(0, ...done.map(s=>s.weight||0));
      if (top) { prog.weight = hitAll ? top + 2 : top; if (hitAll) notes.push(`${ex.name}: go up to ${wDisp(prog.weight)} ${wUnit()} next time`); }
    } else if (hitAll) { prog.bump = Math.min(4, (prog.bump||0)+1); notes.push(`${ex.name}: target raised to ${ex.unit==='sec' ? it.hi+5+'s' : (it.hi+2)+' reps'}`); }
  });
  if (!sets) { toast('No sets logged - workout not saved'); return quit(true); }
  S.history.push({ date:todayISO(), name:P.w.name, dur:mins, kcal, sets, volume:Math.round(volume) });
  save(); P.on = false; stopFigure(); document.body.classList.remove('lock');
  $('#player').innerHTML = `<div class="pscroll center"><div class="trophy">🏆</div><h2>Workout complete!</h2>
  <div class="stats"><div class="stat"><span class="k">Time</span><b>${mins}</b><span class="muted">min</span></div><div class="stat"><span class="k">Burned</span><b>${kcal}</b><span class="muted">kcal est.</span></div><div class="stat"><span class="k">Sets</span><b>${sets}</b><span class="muted">${volume ? Math.round(wDisp(volume))+' '+wUnit()+' lifted' : 'done'}</span></div></div>
  ${notes.length ? `<section class="card"><h3>Progression</h3><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}
  <p class="muted">Eat protein within a couple of hours and get ${targets(p).sleep} h of sleep tonight.</p><button class="btn" data-act="close-player">Done</button></div>`;
}
function quit(force){
  if (!force && !confirm('Quit this workout? Progress will not be saved.')) return;
  stopTimer(); P.on = false; stopFigure(); $('#player').hidden = true; $('#player').innerHTML = ''; document.body.classList.remove('lock'); render();
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button, summary'); if (!t) return;
  if (t.dataset.tab) return go(t.dataset.tab);
  if (t.dataset.go) return go(t.dataset.go);
  if (t.dataset.ex) return openExercise(t.dataset.ex);
  if (t.dataset.lib) { libFilter = t.dataset.lib; return render(); }
  if (t.dataset.food) { const f = FOODS[+t.dataset.food]; return addFood(f[0], f[1], f[2], f[3], f[4]); }
  if (t.dataset.del !== undefined) { S.food[eatDate].splice(+t.dataset.del,1); save(); return render(); }
  if (P.on && t.closest('#player')) {
    const li = t.closest('.set'), n = li && +li.dataset.n;
    if (t.dataset.step) { const s = P.sets[P.i][n], ex = byId(P.w.items[P.i].id); s.reps = Math.max(1, s.reps + (+t.dataset.step)*(ex.unit==='sec'?5:1)); return renderPlayer(); }
    if (t.dataset.done !== undefined) return completeSet(n);
    if (t.dataset.hold !== undefined) { const s = P.sets[P.i][n]; return countdown(s.reps, 'Hold!', () => { if (!s.done) completeSet(n); }); }
  }
  switch (t.dataset.act) {
    case 'start': return startWorkout(+t.dataset.k);
    case 'start-anyway': return startWorkout(sessionCount());
    case 'close': return closeModal();
    case 'next': if (P.i < P.w.items.length-1) { P.i++; stopTimer(); renderPlayer(); $('.pscroll').scrollTop = 0; } else finishWorkout(); return;
    case 'prev': if (P.i > 0) { P.i--; stopTimer(); renderPlayer(); } return;
    case 'quit': return quit();
    case 'close-player': $('#player').hidden = true; $('#player').innerHTML = ''; return render();
    case 't-add': return P.add && P.add();
    case 't-skip': return P.skip && P.skip();
    case 'eat-prev': eatDate = addDays(eatDate,-1); return render();
    case 'eat-next': if (eatDate < todayISO()) { eatDate = addDays(eatDate,1); render(); } return;
    case 'export': { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'})); a.download = 'fitcoach-data.json'; a.click(); return; }
    case 'reset': if (confirm('Delete all your data on this device?')) { localStorage.removeItem(KEY); S = load(); render(); } return;
  }
});
document.addEventListener('change', e => {
  if (P.on && e.target.matches('[data-wt]')) {
    const n = +e.target.closest('.set').dataset.n, v = parseFloat(e.target.value);
    P.sets[P.i].forEach((s,i) => { if (i >= n && !s.done) s.weight = v > 0 ? wKg(v) : null; });
    renderPlayer();
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'fq') { foodQuery = e.target.value; const pos = e.target.selectionStart; const keep = $('#meal').value; render(); const f = $('#fq'); f.focus(); f.setSelectionRange(pos,pos); $('#meal').value = keep; }
  if (e.target.name === 'q') $('#qout').textContent = e.target.value;
});
document.addEventListener('submit', e => {
  e.preventDefault(); const f = e.target;
  if (f.id === 'profile') return saveProfile(f);
  if (f.id === 'customfood') { const d = new FormData(f); return addFood(d.get('name').trim(), +d.get('kcal')||0, +d.get('p')||0, +d.get('c')||0, +d.get('f')||0); }
  if (f.id === 'wform') { const v = parseFloat(new FormData(f).get('w')); if (!(v > 0)) return; const kg = Math.round(wKg(v)*10)/10; S.weights.push({ date:todayISO(), kg }); S.profile.weight = kg; save(); toast('Weight logged'); return render(); }
  if (f.id === 'sleepform') {
    const d = new FormData(f), [bh,bm] = d.get('bed').split(':').map(Number), [wh,wm] = d.get('wake').split(':').map(Number);
    let mins = (wh*60+wm) - (bh*60+bm); if (mins <= 0) mins += 1440;
    S.sleep[todayISO()] = { bed:d.get('bed'), wake:d.get('wake'), hours:mins/60, q:+d.get('q') };
    save(); toast(`Logged ${(mins/60).toFixed(1)} h of sleep`); render();
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
