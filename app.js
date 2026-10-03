const app=document.getElementById("app");
const STORE="scape_phone_v4";
const emojiIcons={sun:"🌞",university:"📚",meal:"🍽️",rest:"☕",tasks:"📝",gaming:"🎮",sleep:"🌙",running:"🏃",work:"💼",music:"🎵",study:"📖",meditation:"🧘",shopping:"🛒",home:"🏠",medicine:"💊",art:"🎨"};
const defaultActivities=[
{time:"07:00",name:"Levantarse",icon:"sun"},{time:"08:00",name:"Universidad",icon:"university"},{time:"13:00",name:"Almuerzo",icon:"meal"},{time:"14:00",name:"Universidad",icon:"university"},{time:"17:00",name:"Descanso",icon:"rest"},{time:"18:00",name:"Tareas",icon:"tasks"},{time:"21:00",name:"Tiempo libre",icon:"gaming"},{time:"23:00",name:"Dormir",icon:"sleep"}];
const socialApps=[["Instagram","instagram.png"],["Facebook","facebook.png"],["WhatsApp","whatsapp.png"],["TikTok","tiktok.png"]];
const defaultData={user:{name:"Santiago",occupation:"Estudiante"},selectedDays:["Lunes"],schedules:{},notifications:true,dark:false,supervised:{Instagram:true,Facebook:false,WhatsApp:true,TikTok:true},social:{active:false,name:"Instagram",until:0,sessionStart:0,minutes:0},activityEnd:0,stats:{day:{redes:"1h 12m",bars:[55]},week:{redes:"8h 24m",bars:[45,75,60,100,82,38,52]},month:{redes:"32h 18m",bars:[55,78,62,92]}}};
let data=load(),currentDay=(data.selectedDays&&data.selectedDays[0])||"Lunes",timerId=null,socialTick=null,clockTick=null,selectedIcon="sun",statsMode="week";
if(!data.schedules||Object.keys(data.schedules).length===0){data.schedules={};(data.selectedDays||["Lunes"]).forEach(d=>data.schedules[d]=JSON.parse(JSON.stringify(defaultActivities)));save()}
function load(){try{let s=JSON.parse(localStorage.getItem(STORE));let d=JSON.parse(JSON.stringify(defaultData));if(s){Object.assign(d,s);d.user=Object.assign({},defaultData.user,s.user||{});d.supervised=Object.assign({},defaultData.supervised,s.supervised||{});d.social=Object.assign({},defaultData.social,s.social||{});d.stats=Object.assign({},defaultData.stats,s.stats||{});d.schedules=s.schedules||{}}return d}catch(e){return JSON.parse(JSON.stringify(defaultData))}}
function save(){localStorage.setItem(STORE,JSON.stringify(data))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function emojiIcon(k){return `<span class="emoji-box">${emojiIcons[k]||"✨"}</span>`}
function R(body,nav=false){app.innerHTML=`<div class="screen">${body}</div>`+(nav?navBar():"");applyTheme()}
function back(fn){return `<button class="back" onclick="${fn}()">‹</button>`}
function navBar(){let items=[["casa_noprecionada.png","casa_precionada.png","Inicio","home"],["soleado_noprecionada.png","soleado_precionada.png","Mi día","day"],["estadistico_noprecionada.png","estadistico_precionada.png","Estadísticos","stats"],["perfil_noprecionada.png","perfil_precionada.png","Mi perfil","profile"]];let active=location.hash.replace("#","")||"home";return `<div class="nav">${items.map(x=>`<button onclick="go('${x[3]}')"><img src="assets/${active==x[3]?x[1]:x[0]}"><span>${x[2]}</span></button>`).join("")}</div>`}
function go(p){location.hash=p;({home,day,stats,profile}[p]||home)()}
window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"home"));
function applyTheme(){document.documentElement.classList.toggle("dark",!!data.dark)}
function toast(m){let t=document.createElement("div");t.className="toast";t.textContent=m;app.appendChild(t);setTimeout(()=>t.remove(),1400)}
function welcome(){stopSocial();location.hash="";R(`<div class="center"><img class="logo" src="assets/Logo.jpeg"><div class="brand">Scape phone</div><p>Organiza tu tiempo y decide<br>cuando conectarte</p><button class="btn" onclick="register()">Crear cuenta</button><button class="btn gray" onclick="login()">Inicia sesión</button></div>`)}
function login(){stopSocial();R(`<div class="center"><img class="logo" src="assets/Logo.jpeg" style="margin-top:45px"><div class="brand">Iniciar sesión</div><div class="field" style="text-align:left"><label>Correo electrónico</label><input id="lemail" type="email" placeholder="correo@ejemplo.com"></div><div class="field" style="text-align:left"><label>Contraseña</label><input id="lpass" type="password" placeholder="••••••••"></div><button class="btn" onclick="doLogin()">Iniciar sesión</button><button class="btn outline" onclick="welcome()">Crear cuenta</button></div>`)}
function doLogin(){home()}
function register(){R(`${back("welcome")}<h1>Bienvenido/a</h1><div class="row"><div class="field"><label>Nombre</label><input id="rname" value="${esc(data.user.name)}"></div><div class="field"><label>Apellido</label><input></div></div><div class="row"><div class="field"><label>Fecha de nacimiento</label><input type="date"></div><div class="field"><label>Ocupación</label><select><option>Estudiante</option><option>Trabajador/a</option></select></div></div><div class="field"><label>Correo electrónico</label><input type="email"></div><div class="field"><label>Contraseña</label><input type="password"></div><div class="field"><label>Código de verificación</label><input></div><button class="btn" onclick="saveRegistration()">Crear cuenta</button>`)}
function saveRegistration(){data.user.name=document.getElementById("rname").value.trim()||"Santiago";data.user.occupation="Estudiante";save();days()}
function days(){R(`${back("register")}<h1>¿Cómo es tu semana?</h1><p>Configura los días que serás acompañado</p>${["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map(d=>`<label class="check"><input type="checkbox" value="${d}" ${data.selectedDays.includes(d)?"checked":""}>${d}</label>`).join("")}<button class="btn" onclick="saveSelectedDays()">Continuar</button>`)}
function saveSelectedDays(){
  const previous=[...(data.selectedDays||[])];
  const selected=[...document.querySelectorAll(".check input:checked")].map(x=>x.value);
  const s=selected.length?selected:["Lunes"];
  const removed=previous.filter(d=>!s.includes(d));
  removed.forEach(d=>{delete data.schedules[d]});
  s.forEach(d=>{if(!data.schedules[d])data.schedules[d]=[]});
  data.selectedDays=s;
  if(!s.includes(currentDay)) currentDay=s[0];
  save();organize()
}
function getSchedule(d=currentDay){if(!data.selectedDays.includes(d))return [];if(!data.schedules[d])data.schedules[d]=[];return data.schedules[d]}
function pills(){let ds=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],ls=["L","M","M","J","V","S","D"];return `<div class="pills">${ds.filter(d=>data.selectedDays.includes(d)).map(d=>{const i=ds.indexOf(d);return `<button class="pill ${currentDay===d?"on":""}" onclick="selectDay('${d}')">${ls[i]}</button>`}).join("")}</div>`}
function selectDay(d){if(!data.selectedDays.includes(d))return;currentDay=d;save();location.hash==="#day"?day():organize()}
function activityList(){return getSchedule().map((a,i)=>`<div class="activity"><b>${a.time}</b>${emojiIcon(a.icon)}<span>${esc(a.name)}</span><span class="x" onclick="removeActivity(${i})">×</span></div>`).join("")}
function organize(){R(`${back("days")}<h1>Organiza tu horario</h1>${pills()}${activityList()}<button class="add" onclick="openAddModal()">＋ Agregar actividad</button><button class="btn" onclick="home()">Crear mi cuenta</button>`)}
function day(){R(`<h1>Mi día</h1>${pills()}${activityList()}<button class="add" onclick="openAddModal()">＋ Agregar actividad</button>`,true)}
function openAddModal(){let ks=Object.keys(emojiIcons);app.insertAdjacentHTML("beforeend",`<div class="overlay" id="addOverlay"><div class="modal" style="text-align:left"><div class="modal-head"><button class="back" onclick="closeAddModal()">‹</button></div><h2>Agregar actividad</h2><label class="small">Íconos</label><div class="icon-grid">${ks.map(k=>`<button class="activity-icon ${k===selectedIcon?"selected":""}" onclick="pickActivityIcon('${k}',this)">${emojiIcons[k]}</button>`).join("")}</div><div class="field"><label>Nombre</label><input id="an" placeholder="Ej. Estudiar"></div><div class="field"><label>Hora de inicio</label><input id="at" type="time" value="18:00"></div><button class="btn" onclick="saveNewActivity()">Agregar actividad</button></div></div>`)}
function pickActivityIcon(k,el){selectedIcon=k;document.querySelectorAll(".activity-icon").forEach(x=>x.classList.remove("selected"));el.classList.add("selected")}
function closeAddModal(){document.getElementById("addOverlay")?.remove()}
function saveNewActivity(){let n=document.getElementById("an").value.trim()||"Nueva actividad",t=document.getElementById("at").value||"18:00";getSchedule().push({time:t,name:n,icon:selectedIcon});getSchedule().sort((a,b)=>a.time.localeCompare(b.time));save();closeAddModal();location.hash==="#day"?day():organize()}
function removeActivity(i){getSchedule().splice(i,1);save();location.hash==="#day"?day():organize()}
function getDayName(date=new Date()){return ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][date.getDay()]}
function getEffectiveDay(){
  const today=getDayName();
  return data.selectedDays.includes(today)?today:(data.selectedDays[0]||today);
}
function getCurrentActivityInfo(d=currentDay){
  const schedule=[...getSchedule(d)].sort((a,b)=>a.time.localeCompare(b.time));
  if(!schedule.length) return null;
  const now=new Date();
  const minutes=now.getHours()*60+now.getMinutes()+now.getSeconds()/60;
  let current=null,next=null;
  for(let i=0;i<schedule.length;i++){
    const [h,m]=schedule[i].time.split(":").map(Number), start=h*60+m;
    if(start<=minutes){current={...schedule[i],start,index:i}}
  }
  if(current){next=schedule[current.index+1]||null}else{next=schedule[0]}
  let remaining=null;
  if(current){
    let endMinutes=next?(()=>{const [h,m]=next.time.split(":").map(Number);return h*60+m})():24*60;
    remaining=Math.max(0,Math.round((endMinutes-minutes)*60));
  }
  return {activity:current,next,remaining,hasSchedule:true};
}
function formatElapsed(minutes){const total=Math.max(0,Math.floor(minutes*60));return format(total)}

function home(){
  clearInterval(timerId);
  currentDay=getEffectiveDay();
  const info=getCurrentActivityInfo(currentDay);
  const todayIsSelected=data.selectedDays.includes(getDayName());
  let card="", nextCard="", socialCard="";
  if(!todayIsSelected || !info || !info.hasSchedule){
    card=`<div class="purple-card empty-activity"><span style="background:#aaa8f6;border-radius:12px;padding:3px 10px;font-size:10px">Ahora</span><h2>No tienes actividades asignadas</h2><p>Hoy no tienes actividades programadas.</p></div>`;
  }else if(!info.activity){
    card=`<div class="purple-card empty-activity"><span style="background:#aaa8f6;border-radius:12px;padding:3px 10px;font-size:10px">Ahora</span><h2>No tienes una actividad en este momento</h2><p>Revisa tu próxima actividad.</p></div>`;
  }else{
    card=`<div class="purple-card"><span style="background:#aaa8f6;border-radius:12px;padding:3px 10px;font-size:10px">Ahora</span><div class="current-activity"><span class="current-icon">${emojiIcons[info.activity.icon]||"✨"}</span><div><h2>${esc(info.activity.name)}</h2><div>Tiempo restante</div><b id="homeCountdown" style="font-size:24px">${format(info.remaining)}</b></div></div></div>`;
  }
  if(info?.next){
    const [h,m]=info.next.time.split(":").map(Number);
    nextCard=`<div class="next"><b>Próxima actividad</b><span style="float:right">${info.next.time}</span><br><span class="small">${emojiIcons[info.next.icon]||"✨"} ${esc(info.next.name)}</span></div>`;
  }
  if(data.social.active && data.social.minutes>=1){
    socialCard=`<div class="card social-time-card"><span class="small">Tiempo en redes</span><br><b>Llevas ${formatElapsed(data.social.minutes)} conectado.</b><br><span class="small">Recuerda volver a tu actividad cuando termine tu tiempo.</span></div>`;
  }
  R(`<div class="header"><span class="brand">Scape phone</span><img class="bell" src="assets/${data.notifications?"campana_llena.png":"campana_vacia.png"}" onclick="notificationsPage()"></div><h1>Buenos días, ${esc(data.user.name)}</h1>${card}${nextCard}${socialCard}<button class="btn outline social-home-btn" onclick="socials()">Entrar a redes sociales</button>`,true);
  if(info?.activity) startHomeCountdown(info.remaining);
  startClock();
}
function startHomeCountdown(seconds){
  clearInterval(timerId);
  let remaining=Math.max(0,seconds);
  const tick=()=>{
    const e=document.getElementById("homeCountdown");
    if(!e){clearInterval(timerId);return}
    e.textContent=format(remaining);
    if(remaining<=0){clearInterval(timerId);home();return}
    remaining--;
  };
  tick();timerId=setInterval(tick,1000);
}
function startClock(){
  clearInterval(clockTick);
  const update=()=>{
    const el=document.getElementById("deviceClock");
    if(!el)return;
    const now=new Date();
    el.textContent=now.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit",hour12:false});
  };
  update();clockTick=setInterval(update,1000);
}

function stats(){let s=data.stats[statsMode],title=statsMode==="day"?"Hoy":statsMode==="week"?"25 Ago - 31 Ago":"Agosto 2026",labels=statsMode==="day"?["Hoy"]:statsMode==="week"?["L","M","M","J","V","S","D"]:["S1","S2","S3","S4"];R(`<div class="stats-tabs"><button class="${statsMode==="day"?"on":""}" onclick="setStats('day')">Día</button><button class="${statsMode==="week"?"on":""}" onclick="setStats('week')">Semana</button><button class="${statsMode==="month"?"on":""}" onclick="setStats('month')">Mes</button></div><p class="small">${title}　›</p><div class="card"><span class="small">Tiempo en redes</span><h2>${s.redes}</h2><div class="chart">${s.bars.map((h,i)=>`<div class="barwrap"><div class="bar ${i===3||statsMode==="day"?"hot":""}" style="height:${Math.max(24,h)}px"></div></div>`).join("")}</div><div class="days-labels">${labels.map(x=>`<span>${x}</span>`).join("")}</div></div><div class="card">${modeRows()}</div>`,true)}
function setStats(m){statsMode=m;stats()}
function modeRows(){let rows=statsMode==="day"?[["Clase","2h 30m",35],["Tareas","1h 20m",20],["Descanso","45m",12],["Redes","1h 12m",18]]:statsMode==="week"?[["Clase","18h 30m",80],["Tareas","6h 20m",48],["Descanso","4h 15m",34],["Redes","8h 24m",55]]:[["Clase","76h 10m",82],["Tareas","27h 45m",49],["Descanso","18h 20m",36],["Redes","32h 18m",58]];return rows.map(r=>`<div class="statrow"><b>${r[0]}</b><span style="float:right">${r[1]}</span><div class="track"><i style="width:${r[2]}%"></i></div></div>`).join("")}
function profile(){let initial=(data.user.name||"S").charAt(0).toUpperCase();R(`<h1>Perfil</h1><div class="profile-head"><div class="initial">${esc(initial)}</div><div><b>${esc(data.user.name)}</b><br><span class="small">${esc(data.user.occupation)}</span></div></div>${settingRow("📅","Mi rutina semanal","day")}${settingRow("📱","Aplicaciones supervisadas","supervised")}${settingRow("🔔","Notificaciones","notificationsPage")}${settingRow("🎨","Apariencia","appearance")}${settingRow("❓","Ayuda","faq")}${settingRow("📋","Cerrar sesión","logout")}`,true)}
function settingRow(icon,label,target){return `<div class="setting" onclick="${target==="logout"?"logout()":target==="day"?"go('day')":target+"()"}"><div class="setting-left"><span class="emoji-box">${icon}</span><span>${label}</span></div><span class="arrow">›</span></div>`}
function supervised(){R(`${back("profile")}<h1>Aplicaciones supervisadas</h1><p>Activa las aplicaciones que Scape phone tendrá en cuenta.</p>${socialApps.map(([n,img])=>`<div class="supervised"><div class="app-info"><img src="assets/social/${img}"><b>${n}</b></div><button class="toggle ${data.supervised[n]?"on":""}" onclick="toggleApp('${n}',this)"></button></div>`).join("")}<button class="btn" onclick="profile()">Guardar</button>`)}
function toggleApp(n,el){data.supervised[n]=!data.supervised[n];save();el.classList.toggle("on",data.supervised[n])}
function notificationsPage(){R(`${back("profile")}<h1>Notificaciones</h1><div class="notice"><div class="notice-icon">${emojiIcon("university")}</div><div><b>Hora de Universidad</b><br><span class="small">Tu actividad empieza en 10 minutos.</span><br><span class="small">hace 5m</span></div><span class="dot"></span></div><div class="notice"><div class="notice-icon">${emojiIcon("work")}</div><div><b>Tiempo en redes agotado</b><br><span class="small">Tu tiempo libre de redes terminó.</span><br><span class="small">hace 1h</span></div><span class="dot"></span></div><div class="notice"><div class="notice-icon">${emojiIcon("art")}</div><div><b>Consejo de Scape phone</b><br><span class="small">Llevas 3 días cumpliendo tu rutina. ¡Sigue así!</span><br><span class="small">ayer</span></div></div>`)}
function appearance(){R(`${back("profile")}<h1>Apariencia</h1><div class="card"><b>Modo noche</b><p>Usa un fondo oscuro en toda la aplicación.</p><button class="toggle ${data.dark?"on":""}" onclick="toggleDark(this)"></button></div>`)}
function toggleDark(el){data.dark=!data.dark;save();applyTheme();el.classList.toggle("on",data.dark)}
function faq(){let qs=[["¿Cómo agrego una actividad?","En Mi día u Organiza tu horario, pulsa + Agregar actividad, elige un icono, nombre y hora."],["¿Puedo cambiar los días?","Sí. Selecciona el día en el horario y agrega o elimina sus actividades."],["¿Qué pasa cuando entro a una red social?","Scape phone muestra un aviso cuando termina el tiempo configurado para redes."],["¿Puedo dar 5 minutos más?","Sí. El botón abre el temporizador y luego puedes volver a la red social."],["¿Dónde cambio las aplicaciones supervisadas?","En Perfil > Aplicaciones supervisadas puedes activarlas o desactivarlas."]];R(`${back("profile")}<h1>Preguntas frecuentes</h1>${qs.map(q=>`<div class="faq" onclick="this.classList.toggle('open')"><b>${q[0]}</b><span style="float:right">›</span><div class="answer">${q[1]}</div></div>`).join("")}`)}
function logout(){stopSocial();login()}
function socials(){
  const elapsed=data.social.active ? formatElapsed((Date.now()-data.social.sessionStart)/60000) : "00:00:00";
  const remaining=data.social.active ? format(Math.max(0,Math.ceil((data.social.until-Date.now())/1000))) : "05:00";
  const activeCard=data.social.active?`<div class="card social-session-card"><b>Sesión en ${esc(data.social.name)}</b><div class="small">Llevas <strong id="socialElapsed">${elapsed}</strong> conectado.</div><div class="small">Tiempo restante: <strong id="socialRemaining">${remaining}</strong></div><button class="btn outline" onclick="returnToActivity()">Volver a Scape phone</button></div>`:"";
  R(`<div class="social-bg">
    <button class="scape-return" onclick="returnToActivity()"><img src="assets/Logo.jpeg" alt="Scape phone"><span>Volver a Scape phone</span></button>
    <h1>Redes sociales</h1>${activeCard}
    <p style="color:#fff;text-align:center;font-size:11px">Puedes volver a Scape phone cuando quieras. El tiempo de uso continúa contando.</p>
    <div class="social-grid">${socialApps.map(([n,img])=>`<div class="social-app" onclick="openSocial('${n}')"><img src="assets/social/${img}" alt="${n}"></div>`).join("")}</div>
    <div id="socialNotice"></div>
  </div>`);
  if(data.social.active) startSocialTick();
}
function currentActivityForNotice(){
  const d=getEffectiveDay();
  const info=getCurrentActivityInfo(d);
  return info?.activity || null;
}
function sendSystemNotification(name){
  try{
    if("Notification" in window){
      const message=currentActivityForNotice();
      const body=message?`Ahora deberías estar en: ${message.name}. Puedes volver a Scape phone cuando quieras.`:"No tienes una actividad asignada en este momento.";
      if(Notification.permission==="granted") new Notification("Scape phone",{body,icon:"assets/Logo.jpeg"});
      else if(Notification.permission!=="denied") Notification.requestPermission().then(p=>{if(p==="granted")new Notification("Scape phone",{body,icon:"assets/Logo.jpeg"})}).catch(()=>{});
    }
  }catch(e){}
}
function showSocialNotice(name){
  const host=document.getElementById("socialNotice");
  const activity=currentActivityForNotice();
  if(!host)return;
  const content=activity?`<div class="social-notice"><img src="assets/Logo.jpeg"><div><b>Scape phone</b><br><span>Deberías estar en <strong>${esc(activity.name)}</strong>.</span><small>El tiempo en ${esc(name)} ya comenzó a contar.</small></div><button onclick="returnToActivity()">Volver</button></div>`:`<div class="social-notice"><img src="assets/Logo.jpeg"><div><b>Scape phone</b><br><span>No tienes actividades asignadas.</span><small>Puedes volver cuando quieras.</small></div><button onclick="returnToActivity()">Volver</button></div>`;
  host.innerHTML=content;
  setTimeout(()=>{const n=document.querySelector('.social-notice');if(n)n.classList.add('hide')},9000);
  sendSystemNotification(name);
}
function realSocialUrl(name){
  return {Instagram:"https://www.instagram.com/",Facebook:"https://www.facebook.com/",WhatsApp:"https://web.whatsapp.com/",TikTok:"https://www.tiktok.com/"}[name];
}
function openSocial(name){
  if(!data.supervised[name]){toast(name+" no está supervisada");return}
  startSocial(name);
  socials();
  showSocialNotice(name);
  const url=realSocialUrl(name);
  if(url){
    const tab=window.open(url,"_blank","noopener,noreferrer");
    if(!tab){toast("El navegador bloqueó la nueva pestaña. Permite ventanas emergentes para abrir "+name);return}
    toast("Abriendo "+name+" en otra pestaña");
  }
  updateSocialSessionUI();
}
function startSocial(name){
  const now=Date.now();
  const sameSession=data.social.active && data.social.name===name && data.social.sessionStart>0;
  data.social.active=true;
  data.social.name=name;
  if(!sameSession){
    data.social.sessionStart=now;
    data.social.until=now+300000;
    data.social.minutes=0;
  }
  save();
  startSocialTick();
}
function startSocialTick(){
  clearInterval(socialTick);
  if(!data.social.active)return;
  const tick=()=>{
    if(!data.social.active)return;
    data.social.minutes=Math.max(0,(Date.now()-data.social.sessionStart)/60000);
    save();
    updateSocialSessionUI();
    if(Date.now()>=data.social.until && !document.getElementById("socialWarning")) showExternalReturnWarning();
  };
  tick();
  socialTick=setInterval(tick,1000);
}
function updateSocialSessionUI(){
  const e=document.getElementById("socialElapsed");
  const r=document.getElementById("socialRemaining");
  if(e && data.social.active)e.textContent=formatElapsed(data.social.minutes);
  if(r && data.social.active)r.textContent=format(Math.max(0,Math.ceil((data.social.until-Date.now())/1000)));
}
function checkExternalSocialTime(){
  if(!data.social.active)return;
  data.social.minutes=Math.max(0,(Date.now()-data.social.sessionStart)/60000);
  save();
  updateSocialSessionUI();
  if(Date.now()>=data.social.until && !document.getElementById("socialWarning")) showExternalReturnWarning();
}
function showExternalReturnWarning(){
  if(document.hidden)return;
  showWarning();
}
function socialPage(name){
  let img=socialApps.find(x=>x[0]===name)?.[1]||"instagram.png";
  R(`<div class="social-page"><button class="scape-mini-return" onclick="returnToActivity()"><img src="assets/Logo.jpeg"> Scape phone</button><div class="ig-top"><img src="assets/social/${img}" style="width:24px;height:24px;object-fit:contain;vertical-align:middle">　${name}</div><div class="ig-story"><div class="story"></div><div class="story"></div><div class="story"></div><div class="story"></div></div><div class="ig-post"><div class="postbox"><b>${esc(name)}</b><br><span class="small">Red social simulada dentro de Scape phone</span></div></div><div class="ig-bottom"><span>⌂</span><span>◉</span><span>⌕</span><span>♡</span><span>♙</span></div><button class="btn" style="position:absolute;bottom:68px;left:15px;width:calc(100% - 30px);opacity:.92" onclick="openSocial('${name}')">Abrir ${esc(name)} real</button><div id="socialPageNotice"></div></div>`);
  startSocialTick();
  setTimeout(()=>showSocialPageNotice(name),50);
}
function showSocialPageNotice(name){
  const host=document.getElementById("socialPageNotice");
  const activity=currentActivityForNotice();
  if(!host)return;
  host.innerHTML=`<div class="social-page-notice"><img src="assets/Logo.jpeg"><div><b>Scape phone</b><br><span>${activity?`Deberías estar en <strong>${esc(activity.name)}</strong>.`:`No tienes actividades asignadas.`}</span></div><button onclick="returnToActivity()">Volver</button></div>`;
  sendSystemNotification(name);
}
function showWarning(force=false){
  if(document.getElementById("socialWarning"))return;
  if(force){data.social.until=Date.now();save()}
  const info=getCurrentActivityInfo();
  const a=info?.activity;
  const content=a?`<div class="card"><div style="display:flex;align-items:center;justify-content:center;gap:8px"><span class="emoji-box">${emojiIcons[a.icon]||"✨"}</span><b>${esc(a.name)}</b></div></div><p class="small">Tu tiempo de esta actividad continúa.</p>`:`<div class="card"><b>No tienes actividades asignadas</b></div>`;
  app.insertAdjacentHTML("beforeend",`<div class="overlay" id="socialWarning"><div class="modal"><img class="logo" src="assets/Logo.jpeg"><h2>Parece que estás<br>en ${esc(data.social.name)}</h2><p class="small">Actualmente debes estar:</p>${content}<button class="btn" onclick="returnToActivity()">Volver a mi actividad</button><button class="btn outline" onclick="fiveMore()">5 minutos más</button></div></div>`)
}
function returnToActivity(){stopSocial();go("home")}
function fiveMore(){data.social.until=Date.now()+300000;data.social.sessionStart=Date.now();data.social.active=true;save();document.getElementById("socialWarning")?.remove();timerScreen()}
function timerScreen(){
  let remain=Math.max(0,data.social.until-Date.now());
  R(`<div class="social-bg"><div class="modal" style="margin-top:100px"><h2>Tiempo</h2><div class="timer-circle"><strong id="socialCountdown">${format(Math.ceil(remain/1000))}</strong><span class="small">Tiempo restante</span></div><div class="card">□ Cuando termine te avisaré para regresar a tu actividad</div><button class="btn" onclick="leaveTimerToSocial()">Salir ahora</button></div></div>`);
  clearInterval(timerId);
  timerId=setInterval(()=>{
    let left=Math.max(0,data.social.until-Date.now()),e=document.getElementById("socialCountdown");
    if(e)e.textContent=format(Math.ceil(left/1000));
    if(left<=0){clearInterval(timerId);data.social.until=Date.now();save();socialPage(data.social.name);showWarning()}
  },250)
}
function leaveTimerToSocial(){clearInterval(timerId);socialPage(data.social.name);startSocialTick()}

function stopSocial(){data.social.active=false;data.social.until=0;data.social.sessionStart=0;save();clearInterval(socialTick);clearInterval(timerId)}
function format(s){s=Math.max(0,Math.floor(s));return `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkExternalSocialTime()});
window.addEventListener("focus",checkExternalSocialTime);
if(data.social.active){startSocialTick();}
startClock();let start=location.hash.slice(1);if(start==="home")home();else if(start==="day")day();else if(start==="stats")stats();else if(start==="profile")profile();else welcome();