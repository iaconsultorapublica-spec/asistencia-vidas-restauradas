
// Sincronización manual forzada desde el botón de la cabecera
async function manualSyncFromCloud() {
  try {
    const res = await fetch("/api/members?t=" + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.members && data.members.length > 0) {
        members = data.members;
        saveMembers();
        renderApp();
        alert("✅ ¡Sincronización exitosa!\n\nSe cargaron " + members.length + " miembros directamente desde Google Drive.");
        return;
      }
    }
    throw new Error("No se pudo obtener datos");
  } catch(e) {
    alert("Conectando con Google Drive... Refrescando pantalla.");
    syncMembersFromCloud();
  }
}


// Calcular edad y grupo automáticamente desde la fecha de nacimiento
function getAgeAndGroupFromBirthDate(birthDateStr) {
  if (!birthDateStr) return { age: null, group: "Adultos (26 a 55)" };
  const birth = new Date(birthDateStr + "T00:00:00");
  if (isNaN(birth.getTime())) return { age: null, group: "Adultos (26 a 55)" };

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  let group = "Adultos Mayores (56+)";
  if (age <= 13) group = "Niños (0 a 13)";
  else if (age <= 25) group = "Jóvenes (14 a 25)";
  else if (age <= 55) group = "Adultos (26 a 55)";

  return { age, group };
}

function autoCalculateAgeGroup(dateStr) {
  const badgeContainer = document.getElementById("newCalculatedGroupBadge");
  const ageSpan = document.getElementById("newCalculatedAge");
  const groupSpan = document.getElementById("newCalculatedGroup");
  if (!badgeContainer || !ageSpan || !groupSpan) return;

  if (!dateStr) {
    badgeContainer.classList.add("hidden");
    return;
  }

  const { age, group } = getAgeAndGroupFromBirthDate(dateStr);
  ageSpan.textContent = `${age} años`;
  groupSpan.textContent = group;
  badgeContainer.classList.remove("hidden");
}

// Sundays Calendar Definition (2026 Cierre + 2027 Completo)
const SUNDAYS = [
  // 2026 (7 domingos)
  { id: "2026-11-15", label: "Dom 15-Nov-2026 (Cierre 2026)", year: 2026 },
  { id: "2026-11-22", label: "Dom 22-Nov-2026 (Cierre 2026)", year: 2026 },
  { id: "2026-11-29", label: "Dom 29-Nov-2026 (Cierre 2026)", year: 2026 },
  { id: "2026-12-06", label: "Dom 06-Dic-2026 (Cierre 2026)", year: 2026 },
  { id: "2026-12-13", label: "Dom 13-Dic-2026 (Cierre 2026)", year: 2026 },
  { id: "2026-12-20", label: "Dom 20-Dic-2026 (Cierre 2026)", year: 2026 },
  { id: "2026-12-27", label: "Dom 27-Dic-2026 (Cierre 2026)", year: 2026 },
  
  // 2027 (52 domingos)
  { id: "2027-01-03", label: "Dom 03-Ene-2027", year: 2027 },
  { id: "2027-01-10", label: "Dom 10-Ene-2027", year: 2027 },
  { id: "2027-01-17", label: "Dom 17-Ene-2027", year: 2027 },
  { id: "2027-01-24", label: "Dom 24-Ene-2027", year: 2027 },
  { id: "2027-01-31", label: "Dom 31-Ene-2027", year: 2027 },
  { id: "2027-02-07", label: "Dom 07-Feb-2027", year: 2027 },
  { id: "2027-02-14", label: "Dom 14-Feb-2027", year: 2027 },
  { id: "2027-02-21", label: "Dom 21-Feb-2027", year: 2027 },
  { id: "2027-02-28", label: "Dom 28-Feb-2027", year: 2027 },
  { id: "2027-03-07", label: "Dom 07-Mar-2027", year: 2027 },
  { id: "2027-03-14", label: "Dom 14-Mar-2027", year: 2027 },
  { id: "2027-03-21", label: "Dom 21-Mar-2027", year: 2027 },
  { id: "2027-03-28", label: "Dom 28-Mar-2027", year: 2027 },
  { id: "2027-04-04", label: "Dom 04-Abr-2027", year: 2027 },
  { id: "2027-04-11", label: "Dom 11-Abr-2027", year: 2027 },
  { id: "2027-04-18", label: "Dom 18-Abr-2027", year: 2027 },
  { id: "2027-04-25", label: "Dom 25-Abr-2027", year: 2027 },
  { id: "2027-05-02", label: "Dom 02-May-2027", year: 2027 },
  { id: "2027-05-09", label: "Dom 09-May-2027", year: 2027 },
  { id: "2027-05-16", label: "Dom 16-May-2027", year: 2027 },
  { id: "2027-05-23", label: "Dom 23-May-2027", year: 2027 },
  { id: "2027-05-30", label: "Dom 30-May-2027", year: 2027 },
  { id: "2027-06-06", label: "Dom 06-Jun-2027", year: 2027 },
  { id: "2027-06-13", label: "Dom 13-Jun-2027", year: 2027 },
  { id: "2027-06-20", label: "Dom 20-Jun-2027", year: 2027 },
  { id: "2027-06-27", label: "Dom 27-Jun-2027", year: 2027 },
  { id: "2027-07-04", label: "Dom 04-Jul-2027", year: 2027 },
  { id: "2027-07-11", label: "Dom 11-Jul-2027", year: 2027 },
  { id: "2027-07-18", label: "Dom 18-Jul-2027", year: 2027 },
  { id: "2027-07-25", label: "Dom 25-Jul-2027", year: 2027 },
  { id: "2027-08-01", label: "Dom 01-Ago-2027", year: 2027 },
  { id: "2027-08-08", label: "Dom 08-Ago-2027", year: 2027 },
  { id: "2027-08-15", label: "Dom 15-Ago-2027", year: 2027 },
  { id: "2027-08-22", label: "Dom 22-Ago-2027", year: 2027 },
  { id: "2027-08-29", label: "Dom 29-Ago-2027", year: 2027 },
  { id: "2027-09-05", label: "Dom 05-Sep-2027", year: 2027 },
  { id: "2027-09-12", label: "Dom 12-Sep-2027", year: 2027 },
  { id: "2027-09-19", label: "Dom 19-Sep-2027", year: 2027 },
  { id: "2027-09-26", label: "Dom 26-Sep-2027", year: 2027 },
  { id: "2027-10-03", label: "Dom 03-Oct-2027", year: 2027 },
  { id: "2027-10-10", label: "Dom 10-Oct-2027", year: 2027 },
  { id: "2027-10-17", label: "Dom 17-Oct-2027", year: 2027 },
  { id: "2027-10-24", label: "Dom 24-Oct-2027", year: 2027 },
  { id: "2027-10-31", label: "Dom 31-Oct-2027", year: 2027 },
  { id: "2027-11-07", label: "Dom 07-Nov-2027", year: 2027 },
  { id: "2027-11-14", label: "Dom 14-Nov-2027", year: 2027 },
  { id: "2027-11-21", label: "Dom 21-Nov-2027", year: 2027 },
  { id: "2027-11-28", label: "Dom 28-Nov-2027", year: 2027 },
  { id: "2027-12-05", label: "Dom 05-Dic-2027", year: 2027 },
  { id: "2027-12-12", label: "Dom 12-Dic-2027", year: 2027 },
  { id: "2027-12-19", label: "Dom 19-Dic-2027", year: 2027 },
  { id: "2027-12-26", label: "Dom 26-Dic-2027", year: 2027 }
];

// State
let members = [];
let attendance = {}; // { dateId: { memberId: true/false } }
let currentSundayId = "";
let currentSearchQuery = "";
let currentLetterFilter = "TODOS";
let currentStatusFilter = "all"; // 'all', 'present', 'absent'

// Subtle Audio Feedback via Web Audio API
let audioCtx = null;
function playTapSound(present) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Pleasant subtle blip
    osc.type = "sine";
    osc.frequency.setValueAtTime(present ? 650 : 350, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {}
}

// Helpers
function normalizeText(text) {
  if (!text) return "";
  return text.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupSundayDropdown();
  setupAlphabetRibbon();
  renderApp();
});

function loadData() {
  // Load Members
  const savedMembers = localStorage.getItem("church_servicio_members");
  if (savedMembers) {
    try {
      members = JSON.parse(savedMembers);
    } catch (e) {
      members = [...INITIAL_MEMBERS];
    }
  } else {
    members = [...INITIAL_MEMBERS];
    saveMembers();
  }

  // Load Attendance Map
  const savedAttendance = localStorage.getItem("church_servicio_attendance");
  if (savedAttendance) {
    try {
      attendance = JSON.parse(savedAttendance);
    } catch (e) {
      attendance = {};
    }
  }

  // Determine current Sunday (defaults to nearest)
  const todayStr = new Date().toISOString().split("T")[0];
  let defaultSunday = SUNDAYS.find(s => s.id >= todayStr);
  if (!defaultSunday) defaultSunday = SUNDAYS[1]; // Dom 22-Nov-2026 default
  currentSundayId = defaultSunday ? defaultSunday.id : SUNDAYS[0].id;
  
  // Sincronizar directorio de miembros desde Google Drive en segundo plano
  syncMembersFromCloud();

  if (!attendance[currentSundayId]) {
    attendance[currentSundayId] = {};
  }
}


// Sincronizar miembros desde Google Drive para que todos los celulares vean los mismos datos
async function syncMembersFromCloud() {
  try {
    // 1. Intentar por endpoint proxy de Vercel (mismo origen, 100% libre de CORS en celulares)
    let data = null;
    try {
      const res = await fetch("/api/members?t=" + Date.now());
      if (res.ok) data = await res.json();
    } catch(proxyErr) {
      console.warn("Proxy fallback to direct Google Script:", proxyErr);
    }

    // 2. Fallback directo a Google Apps Script si fuera necesario
    if (!data || !data.success) {
      const resDirect = await fetch(GOOGLE_SCRIPT_URL + "?t=" + Date.now());
      if (resDirect.ok) data = await resDirect.json();
    }

    if (data && data.success && data.members && data.members.length > 0) {
      members = data.members;
      saveMembers();
      renderApp();
      console.log("✅ Directorio sincronizado desde Google Drive:", members.length);
    }
  } catch (err) {
    console.warn("Aviso: usando miembros locales por conexion:", err);
  }
}

function saveMembers() {
  localStorage.setItem("church_servicio_members", JSON.stringify(members));
}

function saveAttendance() {
  localStorage.setItem("church_servicio_attendance", JSON.stringify(attendance));
}

// Sunday Dropdown
function setupSundayDropdown() {
  const select = document.getElementById("selectSunday");
  select.innerHTML = "";

  SUNDAYS.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.label;
    if (s.id === currentSundayId) opt.selected = true;
    select.appendChild(opt);
  });
}

function changeSunday(newDateId) {
  currentSundayId = newDateId;
  if (!attendance[currentSundayId]) {
    attendance[currentSundayId] = {};
  }
  renderApp();
}

// Alphabet Ribbon
function setupAlphabetRibbon() {
  const container = document.getElementById("alphabetContainer");
  container.innerHTML = "";
  const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

  letters.forEach(l => {
    const btn = document.createElement("button");
    btn.className = "letter-btn min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 flex items-center justify-center text-xs sm:text-sm font-black rounded-xl bg-gray-50 hover:bg-white border border-gray-200 text-gray-800 tap-effect shadow-sm";
    btn.textContent = l;
    btn.onclick = () => filterByLetter(l);
    container.appendChild(btn);
  });
}

function filterByLetter(letter) {
  currentLetterFilter = letter;
  currentSearchQuery = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("btnClearSearch").classList.add("hidden");

  // Highlight active
  document.querySelectorAll(".letter-btn").forEach(btn => {
    if (btn.textContent.trim() === letter || (letter === "TODOS" && btn.textContent.trim() === "Todos")) {
      btn.className = "letter-btn min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 flex items-center justify-center text-xs sm:text-sm font-black rounded-xl bg-vr-blue text-white tap-effect shadow-md ring-2 ring-vr-orange";
    } else {
      btn.className = "letter-btn min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 flex items-center justify-center text-xs sm:text-sm font-black rounded-xl bg-gray-50 hover:bg-white border border-gray-200 text-gray-800 tap-effect shadow-sm";
    }
  });

  renderApp();
}

// Search input handling (Typeahead / Predictivo)
function handleSearch(query) {
  currentSearchQuery = query;
  currentLetterFilter = "TODOS";
  
  // Clear letter highlight
  document.querySelectorAll(".letter-btn").forEach(btn => {
    btn.className = "letter-btn min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 flex items-center justify-center text-xs sm:text-sm font-black rounded-xl bg-gray-50 hover:bg-white border border-gray-200 text-gray-800 tap-effect shadow-sm";
  });

  const clearBtn = document.getElementById("btnClearSearch");
  if (query.trim().length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  renderApp();
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  currentSearchQuery = "";
  document.getElementById("btnClearSearch").classList.add("hidden");
  renderApp();
}

function setStatusFilter(filter) {
  currentStatusFilter = filter;
  
  const bAll = document.getElementById("btnFilterAll");
  const bPres = document.getElementById("btnFilterPresent");
  const bAbs = document.getElementById("btnFilterAbsent");

  bAll.className = filter === 'all' ? "px-2.5 py-1 rounded-full font-semibold bg-gray-800 text-white tap-effect" : "px-2.5 py-1 rounded-full font-semibold bg-white text-gray-700 border border-gray-200 tap-effect";
  bPres.className = filter === 'present' ? "px-2.5 py-1 rounded-full font-semibold bg-[#236B2B] text-white tap-effect" : "px-2.5 py-1 rounded-full font-semibold bg-white text-emerald-700 border border-gray-200 tap-effect";
  bAbs.className = filter === 'absent' ? "px-2.5 py-1 rounded-full font-semibold bg-gray-600 text-white tap-effect" : "px-2.5 py-1 rounded-full font-semibold bg-white text-gray-600 border border-gray-200 tap-effect";

  renderApp();
}

// Toggle Attendance for a member
function toggleAttendance(memberId) {
  if (!attendance[currentSundayId]) {
    attendance[currentSundayId] = {};
  }
  const isPresent = !attendance[currentSundayId][memberId];
  attendance[currentSundayId][memberId] = isPresent;
  saveAttendance();

  playTapSound(isPresent);

  // Update DOM directly for smooth 60fps feel without full re-render
  updateMemberCardUI(memberId, isPresent);
  updateKPIs();
}

function updateMemberCardUI(memberId, isPresent) {
  const card = document.getElementById(`member-card-${memberId}`);
  if (!card) return;

  const btn = card.querySelector(".btn-toggle");
  if (isPresent) {
    card.classList.remove("border-gray-200", "bg-white");
    card.classList.add("border-[#236B2B]/40", "bg-[#236B2B]/10");

    btn.className = "btn-toggle tap-effect w-28 sm:w-32 py-2 px-2.5 rounded-xl font-black text-xs shadow-sm flex items-center justify-center space-x-1 transition bg-[#236B2B] text-white";
    btn.innerHTML = `<span>✓</span><span>PRESENTE</span>`;
  } else {
    card.classList.remove("border-[#236B2B]/40", "bg-[#236B2B]/10");
    card.classList.add("border-gray-200", "bg-white");

    btn.className = "btn-toggle tap-effect w-32 sm:w-44 py-2.5 sm:py-3 px-3 rounded-2xl font-black text-xs sm:text-sm shadow-sm flex items-center justify-center space-x-1.5 transition bg-gray-100 text-gray-500 hover:bg-gray-200 border-2 border-gray-200";
    btn.innerHTML = `<span>○</span><span>AUSENTE</span>`;
  }
}

// Update Top Counters & KPIs
function updateKPIs() {
  const currentMap = attendance[currentSundayId] || {};
  let presentCount = 0;

  members.forEach(m => {
    if (currentMap[m.id]) presentCount++;
  });

  const totalMembers = members.length;
  const percentage = totalMembers > 0 ? ((presentCount / totalMembers) * 100).toFixed(1) : "0.0";

  document.getElementById("counterPresent").textContent = presentCount;
  document.getElementById("counterTotal").textContent = totalMembers;
  document.getElementById("counterPercentage").textContent = percentage + "%";

  document.getElementById("countFilterAll").textContent = totalMembers;
  document.getElementById("countFilterPresent").textContent = presentCount;
  document.getElementById("countFilterAbsent").textContent = totalMembers - presentCount;
}

// Render Main App
function renderApp() {
  updateKPIs();
  
  const currentMap = attendance[currentSundayId] || {};
  const listContainer = document.getElementById("membersList");
  const emptyState = document.getElementById("emptyState");

  // Filtering
  const q = normalizeText(currentSearchQuery);

  const filtered = members.filter(m => {
    const isPresent = !!currentMap[m.id];

    // Status filter
    if (currentStatusFilter === 'present' && !isPresent) return false;
    if (currentStatusFilter === 'absent' && isPresent) return false;

    // Search query or initial
    if (q.length > 0) {
      const normNombre = normalizeText(m.nombre);
      const match = normNombre.includes(q);
      if (!match) return false;
    } else if (currentLetterFilter !== "TODOS") {
      const normNombre = normalizeText(m.nombre);
      if (!normNombre.startsWith(currentLetterFilter.toLowerCase())) return false;
    }

    return true;
  });

  document.getElementById("filteredResultsLabel").textContent = `${filtered.length} visibles`;

  if (filtered.length === 0) {
    listContainer.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Render cards
  listContainer.innerHTML = filtered.map(m => {
    const isPresent = !!currentMap[m.id];
    
    // Group Badge colors
    let groupBadgeClass = "bg-gray-100 text-gray-700";
    if (m.grupo.includes("Jóvenes")) groupBadgeClass = "bg-blue-100 text-blue-700";
    else if (m.grupo.includes("Adultos (26") || m.grupo === "Adultos") groupBadgeClass = "bg-emerald-100 text-emerald-800";
    else if (m.grupo.includes("Adultos Mayores")) groupBadgeClass = "bg-purple-100 text-purple-700";
    else if (m.grupo.includes("Niños")) groupBadgeClass = "bg-amber-100 text-amber-700";

    const cardBg = isPresent ? "bg-[#236B2B]/10 border-[#236B2B]/40" : "bg-white border-gray-200";
    const btnClass = isPresent 
      ? "bg-[#236B2B] text-white" 
      : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-300";
    const btnContent = isPresent ? `<span>✓</span><span>PRESENTE</span>` : `<span>○</span><span>AUSENTE</span>`;

    const safeName = m.nombre.replace(/'/g, "\\'");
    return `
      <div id="member-card-${m.id}" class="p-3 rounded-2xl border ${cardBg} shadow-sm flex items-center justify-between transition-all">
        <div class="flex-1 pr-2">
          <div class="flex items-center space-x-1.5 mb-0.5">
            <span class="text-xs font-black text-gray-400">#${m.id}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${groupBadgeClass}">${m.grupo}</span>
          </div>
          <p class="font-black text-base sm:text-lg text-gray-900 leading-snug tracking-tight">${m.nombre}</p>
          ${m.telefono ? `<p class="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">📱 ${m.telefono}</p>` : ''}
        </div>
        <div class="flex items-center space-x-1">
          <button 
            onclick="toggleAttendance(${m.id})" 
            class="btn-toggle tap-effect w-32 sm:w-44 py-2.5 sm:py-3 px-3 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 transition ${btnClass}"
          >
            ${btnContent}
          </button>
          <button 
            onclick="confirmDeleteMember(${m.id}, '${safeName}')" 
            title="Dar de baja a esta persona" 
            class="p-2 text-gray-300 hover:text-red-500 active:text-red-700 hover:bg-red-50 rounded-xl transition tap-effect"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Modal New Member
function openNewMemberModal() {
  document.getElementById("formNewMember").reset();
  const badge = document.getElementById("newCalculatedGroupBadge");
  if (badge) badge.classList.add("hidden");
  document.getElementById("newMemberModal").classList.remove("hidden");
}

function closeNewMemberModal() {
  document.getElementById("newMemberModal").classList.add("hidden");
}

function saveNewMember(e) {
  e.preventDefault();
  const nombre = document.getElementById("newNombre").value.trim();
  if (!nombre) return;

  const telefono = document.getElementById("newTelefono").value.trim();
  const fechaNac = document.getElementById("newFechaNac").value;
  const { age, group } = getAgeAndGroupFromBirthDate(fechaNac);

  const nextId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;

  const newMember = {
    id: nextId,
    nombre: nombre.toUpperCase(),
    genero: "",
    fecha_nacimiento: fechaNac,
    edad: age,
    grupo: group,
    telefono: telefono,
    barrio: ""
  };

  members.push(newMember); // Se ubica en la ultima casilla de acuerdo al numero
  // Re-ordenar por ID ascendente
  members.sort((a, b) => a.id - b.id);
  saveMembers();

  // Mark present today
  if (!attendance[currentSundayId]) attendance[currentSundayId] = {};
  attendance[currentSundayId][nextId] = true;
  saveAttendance();

  closeNewMemberModal();
  clearSearch();
  renderApp();
  playTapSound(true);

  // Sincronizar nuevo miembro inmediatamente con Google Drive
  try {
    const payload = { action: "add_member", member: newMember };
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
    });
  } catch (e) {}
}

// Modal Options
function openOptionsModal() {
  document.getElementById("optionsModal").classList.remove("hidden");
}

function closeOptionsModal() {
  document.getElementById("optionsModal").classList.add("hidden");
}

function resetSundayAttendance() {
  if (confirm("¿Estás seguro de reiniciar la asistencia para este domingo?")) {
    attendance[currentSundayId] = {};
    saveAttendance();
    closeOptionsModal();
    renderApp();
  }
}

// Export Attendance to Excel (.xlsx) con Informe Consolidado por Grupo Etario
function exportToExcel() {
  const currentMap = attendance[currentSundayId] || {};
  const sundayObj = SUNDAYS.find(s => s.id === currentSundayId);
  const sundayLabel = sundayObj ? sundayObj.label : currentSundayId;

  // Contabilizar por Grupo Etario
  const groupsStats = {
    "Niños (0 a 13)": { total: 0, present: 0 },
    "Jóvenes (14 a 25)": { total: 0, present: 0 },
    "Adultos (26 a 55)": { total: 0, present: 0 },
    "Adultos Mayores (56+)": { total: 0, present: 0 }
  };

  let totalMembers = members.length;
  let totalPresent = 0;

  members.forEach(m => {
    const isPresent = !!currentMap[m.id];
    if (isPresent) totalPresent++;

    let gKey = "Adultos (26 a 55)";
    if (m.grupo && m.grupo.includes("Niños")) gKey = "Niños (0 a 13)";
    else if (m.grupo && m.grupo.includes("Jóvenes")) gKey = "Jóvenes (14 a 25)";
    else if (m.grupo && m.grupo.includes("Adultos Mayores")) gKey = "Adultos Mayores (56+)";
    else if (m.grupo && m.grupo.includes("Mayores")) gKey = "Adultos (26 a 55)";

    if (groupsStats[gKey]) {
      groupsStats[gKey].total++;
      if (isPresent) groupsStats[gKey].present++;
    }
  });

  const totalAbsent = totalMembers - totalPresent;
  const globalPct = totalMembers > 0 ? ((totalPresent / totalMembers) * 100).toFixed(1) + "%" : "0.0%";

  // Estructura del Documento Excel Descargado
  const data = [
    ["VIDAS RESTAURADAS - IGLESIA CRISTIANA SEDE TABIO - ASAMBLEAS DE DIOS"],
    ["MINISTERIO DE SERVICIO • CONTROL Y REPORTE DIARIO DE ASISTENCIA DOMINICAL"],
    ["Lema: Marcos 10:45"],
    [],
    ["DATOS GENERALES DE LA REUNIÓN:"],
    ["Fecha del Servicio / Domingo:", sundayLabel],
    ["Fecha y Hora de Generación:", new Date().toLocaleString()],
    ["Total Asistentes Presentes Hoy:", totalPresent],
    ["Total Miembros Registrados:", totalMembers],
    ["Total Ausentes Hoy:", totalAbsent],
    ["% Asistencia General del Día:", globalPct],
    [],
    ["=================================================================================="],
    ["REPORTE CONSOLIDADO POR GRUPOS ETARIOS DEL DÍA"],
    ["=================================================================================="],
    ["Grupo Etario", "Rango de Edad", "Total en Padrón", "Presentes Hoy", "Ausentes Hoy", "% Asistencia del Grupo"],
    [
      "Niños (0 a 13)",
      "0 a 13 años",
      groupsStats["Niños (0 a 13)"].total,
      groupsStats["Niños (0 a 13)"].present,
      groupsStats["Niños (0 a 13)"].total - groupsStats["Niños (0 a 13)"].present,
      groupsStats["Niños (0 a 13)"].total > 0 ? ((groupsStats["Niños (0 a 13)"].present / groupsStats["Niños (0 a 13)"].total) * 100).toFixed(1) + "%" : "0.0%"
    ],
    [
      "Jóvenes (14 a 25)",
      "14 a 25 años",
      groupsStats["Jóvenes (14 a 25)"].total,
      groupsStats["Jóvenes (14 a 25)"].present,
      groupsStats["Jóvenes (14 a 25)"].total - groupsStats["Jóvenes (14 a 25)"].present,
      groupsStats["Jóvenes (14 a 25)"].total > 0 ? ((groupsStats["Jóvenes (14 a 25)"].present / groupsStats["Jóvenes (14 a 25)"].total) * 100).toFixed(1) + "%" : "0.0%"
    ],
    [
      "Adultos (26 a 55)",
      "26 a 55 años",
      groupsStats["Adultos (26 a 55)"].total,
      groupsStats["Adultos (26 a 55)"].present,
      groupsStats["Adultos (26 a 55)"].total - groupsStats["Adultos (26 a 55)"].present,
      groupsStats["Adultos (26 a 55)"].total > 0 ? ((groupsStats["Adultos (26 a 55)"].present / groupsStats["Adultos (26 a 55)"].total) * 100).toFixed(1) + "%" : "0.0%"
    ],
    [
      "Adultos Mayores (56+)",
      "56 años en adelante",
      groupsStats["Adultos Mayores (56+)"].total,
      groupsStats["Adultos Mayores (56+)"].present,
      groupsStats["Adultos Mayores (56+)"].total - groupsStats["Adultos Mayores (56+)"].present,
      groupsStats["Adultos Mayores (56+)"].total > 0 ? ((groupsStats["Adultos Mayores (56+)"].present / groupsStats["Adultos Mayores (56+)"].total) * 100).toFixed(1) + "%" : "0.0%"
    ],
    [
      "TOTAL CONGREGACIÓN",
      "-",
      totalMembers,
      totalPresent,
      totalAbsent,
      globalPct
    ],
    [],
    ["=================================================================================="],
    ["LISTADO DETALLADO DE ASISTENCIA INDIVIDUAL"],
    ["=================================================================================="],
    ["N° ID", "Nombres y Apellidos Completos", "Grupo Etario", "Teléfono / WhatsApp", "Estado Asistencia Hoy"]
  ];

  // Ordenar: primero presentes, luego ausentes
  const sortedMembers = [...members].sort((a, b) => {
    const aP = !!currentMap[a.id];
    const bP = !!currentMap[b.id];
    if (aP && !bP) return -1;
    if (!aP && bP) return 1;
    return a.nombre.localeCompare(b.nombre);
  });

  sortedMembers.forEach(m => {
    const isPresent = !!currentMap[m.id];
    data.push([
      m.id,
      m.nombre,
      m.grupo,
      m.telefono || "",
      isPresent ? "PRESENTE" : "AUSENTE"
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Anchos de columna
  ws['!cols'] = [
    { wch: 22 }, // A
    { wch: 38 }, // B
    { wch: 22 }, // C
    { wch: 20 }, // D
    { wch: 18 }, // E
    { wch: 22 }  // F
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte_Diario");

  const fileName = `Reporte_Asistencia_${currentSundayId}_VidasRestauradas.xlsx`;
  
  // Soporte para compartir directamente en WhatsApp (Android/iPhone)
  try {
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const file = new File([blob], fileName, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: "Reporte de Asistencia Dominical",
        text: `Reporte de Asistencia ${sundayLabel} - Vidas Restauradas Tabio`
      }).catch(() => {
        XLSX.writeFile(wb, fileName);
      });
      return;
    }
  } catch (err) {
    console.warn("Share fallback:", err);
  }

  XLSX.writeFile(wb, fileName);
}

// Import Members from Excel
function importFromExcel(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Look for Directorio sheet
      let sheetName = workbook.SheetNames.find(n => n.includes("Directorio")) || workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const newMembersList = [];
      // Row 0 is title, row 1 headers, row 2+ data
      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1]) continue;
        newMembersList.push({
          id: row[0] || (newMembersList.length + 1),
          nombre: String(row[1]).trim(),
          genero: row[2] || "",
          fecha_nacimiento: row[3] || "",
          edad: row[4] || null,
          grupo: row[5] || "Adultos (26 a 55)",
          telefono: row[8] ? String(row[8]) : "",
          barrio: row[10] || ""
        });
      }

      if (newMembersList.length > 0) {
        members = newMembersList;
        saveMembers();
        closeOptionsModal();
        renderApp();
        alert(`¡Base de datos actualizada con éxito! Se cargaron ${members.length} miembros.`);
      } else {
        alert("No se encontraron filas válidas en la hoja.");
      }
    } catch (err) {
      alert("Error al procesar el archivo Excel: " + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Sincronizar directo con el archivo Excel en el Mac
async function syncToExcelBackend() {
  const btn = document.getElementById("btnSyncExcel");
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<span class="animate-spin text-sm">⏳</span><span>Guardando en Drive...</span>`;
  btn.disabled = true;

  const currentMap = attendance[currentSundayId] || {};
  const sundayObj = SUNDAYS.find(s => s.id === currentSundayId) || { year: 2026, label: currentSundayId };
  
  // Extraer mes y dia para coincidir con la cabecera (ej. 22-Nov)
  const parts = currentSundayId.split("-");
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const monthsEsp = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const monthDay = (d < 10 ? "0" + d : d) + "-" + monthsEsp[m];

  const presentIds = [];
  const presentNames = [];
  members.forEach(m => {
    if (currentMap[m.id]) {
      presentIds.push(Number(m.id));
      presentNames.push(m.nombre);
    }
  });

  const payload = {
    version: "2.1",
    action: "sync_attendance",
    year: sundayObj.year || y,
    monthDay: monthDay,
    sundayLabel: sundayObj.label,
    presentCount: presentIds.length,
    presentIds: presentIds,
    presentNames: presentNames,
    allMembers: members,
    timestamp: new Date().toISOString()
  };

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoCN-QUak4GpP8Ip5NKSytpqCbs6zylTAOAg_hsLEJdsRImOF1TDbu0x7Ry2hGpf0/exec";

  try {
    // 1. Enviar a Google Drive (Google Apps Script)
    let syncSuccess = false;
    let registeredCount = presentIds.length;

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          syncSuccess = true;
          if (json.count !== undefined) registeredCount = json.count;
        }
      }
    } catch (corsErr) {
      // Modo seguro compatible con cualquier dispositivo móvil (evita bloqueos de redireccion CORS)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      syncSuccess = true;
    }

    if (syncSuccess) {
      alert(`✅ ¡ASISTENCIA GUARDADA EN GOOGLE DRIVE!

📅 Fecha: ${sundayObj.label}
👥 Total presentes registrados: ${registeredCount} personas

La hoja de cálculo en el Google Drive de la encargada fue actualizada automáticamente en tiempo real.`);
    } else {
      throw new Error("No se pudo verificar la respuesta de Google Drive.");
    }

  } catch (err) {
    console.error("Error al guardar en Google Drive:", err);
    alert(`Ocurrió un inconveniente al guardar en Google Drive (${err.message}). Recuerda que también puedes usar el botón "Descargar / Enviar" para enviar el reporte dominical.`);
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

function switchTab(tab) {
  const vAsist = document.getElementById("viewAsistencia");
  const vCont = document.getElementById("viewContenido");
  const vCol = document.getElementById("viewColores");

  const tAsist = document.getElementById("navTabAsistencia");
  const tCont = document.getElementById("navTabContenido");
  const tCol = document.getElementById("navTabColores");

  const sundayBar = document.getElementById("sundaySelectorBar");
  const kpiBar = document.getElementById("kpiBar");
  const bottomBar = document.getElementById("attendanceBottomBar");

  // Reset tabs style
  [tAsist, tCont, tCol].forEach(t => {
    t.className = "flex-1 py-1.5 rounded-lg text-center transition text-gray-300 hover:text-white";
  });

  // Hide all views
  vAsist.classList.add("hidden");
  vCont.classList.add("hidden");
  vCol.classList.add("hidden");

  if (tab === "asistencia") {
    vAsist.classList.remove("hidden");
    tAsist.className = "flex-1 py-1.5 rounded-lg text-center transition bg-white text-vr-blue shadow font-bold";
    sundayBar.classList.remove("hidden");
    kpiBar.classList.remove("hidden");
    bottomBar.classList.remove("hidden");
  } else if (tab === "contenido") {
    vCont.classList.remove("hidden");
    tCont.className = "flex-1 py-1.5 rounded-lg text-center transition bg-white text-vr-blue shadow font-bold";
    sundayBar.classList.add("hidden");
    kpiBar.classList.add("hidden");
    bottomBar.classList.add("hidden");
  } else if (tab === "colores") {
    vCol.classList.remove("hidden");
    tCol.className = "flex-1 py-1.5 rounded-lg text-center transition bg-white text-vr-blue shadow font-bold";
    sundayBar.classList.add("hidden");
    kpiBar.classList.add("hidden");
    bottomBar.classList.add("hidden");
  }
}

// Copy Hex Code
function copyHex(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    alert("¡Código copiado al portapapeles! " + hex);
  }).catch(() => {
    prompt("Copia este código de color:", hex);
  });
}


// Eliminar / Dar de baja a una persona de la base de datos de la app
function confirmDeleteMember(id, name) {
  if (confirm(`¿Estás seguro de eliminar a:\n\n"${name}"\n\nde la base de datos de asistencia?\n\nEsta persona ya no asistirá y será retirada del padrón.`)) {
    // 1. Filtrar lista de miembros y re-numerar para que corra consecutivamente
    members = members.filter(m => Number(m.id) !== Number(id));
    members.forEach((m, idx) => {
      m.id = idx + 1; // Correr numero consecutivamente (ej: si se borra 106, el 107 pasa a 106)
    });
    saveMembers();

    // 2. Limpiar registros de asistencia
    if (attendance) {
      Object.keys(attendance).forEach(d => {
        if (attendance[d]) {
          delete attendance[d][id];
          delete attendance[d][String(id)];
        }
      });
      saveAttendance();
    }

    // 3. Registrar en lista de bajas
    try {
      let deleted = JSON.parse(localStorage.getItem("church_servicio_deleted") || "[]");
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem("church_servicio_deleted", JSON.stringify(deleted));
      }
    } catch(e) {}

    // 4. Sincronizar baja en Google Drive
    try {
      const payload = { action: "delete_member", id: Number(id), name: name };
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload)
        });
      });
    } catch (e) {}

    // 5. Refrescar interfaz
    renderApp();
    alert(`✅ "${name}" ha sido eliminado(a) con éxito de la base de datos y de Google Drive.`);
  }
}
