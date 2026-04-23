/* ============================================================
   KIMA Beauty Lounge — App Logic v2.1
   ✦ Duration-aware slot blocking
   ✦ Staff selection (all services + nails-only staff)
   ✦ QR code with full booking card data
   ✦ WhatsApp share from confirmation
   ✦ Updated logo faithful to uploaded image
   ============================================================ */

'use strict';

const App = {
  lang: localStorage.getItem('kima_lang') || 'ar',
  theme: localStorage.getItem('kima_theme') || 'dark',
  data: null,
  selectedService: null,
  selectedSlot: null,
  copyClickCount: 0,
  copyClickTimer: null,
};

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  applyTheme(App.theme);
  applyLang(App.lang);
  renderAll();
  initScrollBehaviors();
  initNavbar();
  exposeGlobals();
});

/* ── Data ── */
async function loadData() {
  try {
    const res = await fetch('data.json');
    App.data = await res.json();
  } catch (e) {
    console.error('data.json load failed', e);
    App.data = { meta:{}, translations:{ar:{},fr:{}}, services:[], packs:[], testimonials:[], staff:[] };
  }
}

/* ── Theme ── */
function applyTheme(theme) {
  App.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('kima_theme', theme);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() { applyTheme(App.theme === 'dark' ? 'light' : 'dark'); }

/* ── Language ── */
function applyLang(lang) {
  App.lang = lang;
  localStorage.setItem('kima_lang', lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  document.body.setAttribute('dir', dir);
  const btn = document.getElementById('btn-lang');
  if (btn) btn.textContent = lang === 'ar' ? 'FR' : 'AR';
  const fab = document.getElementById('wa-fab-label');
  if (fab) fab.textContent = lang === 'ar' ? 'تواصلي معنا' : 'Nous contacter';
}
function toggleLang() { applyLang(App.lang === 'ar' ? 'fr' : 'ar'); renderAll(); }
function t(key) { return App.data?.translations?.[App.lang]?.[key] || key; }

/* ══════════════════════════════════════════
   LOGO — Faithful recreation of uploaded image
   White circle · gold line-art woman facing left
   hair in elegant updo with loose strands
   Bold black "KIMA" · gold script "Beauty Lounge"
══════════════════════════════════════════ */
function kimaLogo(height = 48) {
  const w = height;
  const h = Math.round(height * 1.18);
  return `<svg viewBox="0 0 200 236" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <!-- Circle -->
  <circle cx="100" cy="100" r="96" fill="#ffffff" stroke="#c9a84c" stroke-width="2"/>
  <!-- Gold line-art: woman profile facing left, hair up with loose waves -->
  <g fill="none" stroke="#c9a84c" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main head silhouette -->
    <path stroke-width="1.8" d="
      M 82 30
      C 72 28, 60 34, 54 44
      C 48 54, 48 66, 52 76
      C 54 82, 55 86, 53 92
      C 51 98, 48 104, 50 110
      C 52 116, 60 118, 68 117
      C 70 124, 72 130, 75 134
    "/>
    <!-- Chin & jaw -->
    <path stroke-width="1.6" d="M 52 76 C 57 85, 64 90, 72 91 C 78 92, 84 90, 88 85"/>
    <!-- Nose -->
    <path stroke-width="1.4" d="M 54 66 C 52 70, 52 74, 55 77"/>
    <!-- Lips -->
    <path stroke-width="1.5" d="M 58 86 C 62 89, 67 89, 70 87"/>
    <!-- Eye -->
    <path stroke-width="1.4" d="M 58 60 C 62 57, 67 57, 70 60"/>
    <circle cx="64" cy="60" r="1.5" fill="#c9a84c" stroke="none"/>
    <!-- Ear -->
    <path stroke-width="1.4" d="M 50 72 C 47 74, 47 80, 50 82"/>
    <!-- Neck & shoulder -->
    <path stroke-width="1.8" d="M 68 117 C 70 124, 72 132, 74 136 C 80 148, 95 152, 110 148 C 118 145, 124 138, 126 130"/>
    <!-- Hair top — updo bun structure -->
    <path stroke-width="1.8" d="
      M 82 30
      C 88 24, 98 20, 108 22
      C 118 24, 126 32, 128 42
      C 130 52, 126 62, 120 68
    "/>
    <!-- Bun itself -->
    <path stroke-width="1.7" d="
      M 108 22
      C 116 18, 128 18, 136 24
      C 144 30, 146 42, 140 52
      C 136 58, 128 62, 120 62
      C 114 62, 108 58, 106 52
      C 104 46, 106 38, 112 34
    "/>
    <!-- Bun inner curl -->
    <path stroke-width="1.3" d="M 116 28 C 126 26, 134 32, 132 42 C 130 50, 122 54, 116 50"/>
    <!-- Loose hair strands falling -->
    <path stroke-width="1.6" d="M 120 62 C 124 72, 126 84, 122 94 C 118 104, 112 112, 110 120"/>
    <path stroke-width="1.4" d="M 128 56 C 134 68, 136 82, 132 96 C 130 104, 124 112, 120 120"/>
    <path stroke-width="1.2" d="M 136 50 C 144 64, 144 82, 138 96 C 134 106, 126 114, 122 124"/>
    <!-- Side strands near face -->
    <path stroke-width="1.3" d="M 86 32 C 82 42, 80 52, 82 62"/>
    <path stroke-width="1.2" d="M 90 28 C 88 38, 86 50, 88 62"/>
  </g>
  <!-- KIMA - bold black serif -->
  <text x="100" y="186" font-family="'Playfair Display', 'Times New Roman', Georgia, serif"
    font-size="52" font-weight="900" text-anchor="middle" fill="#111111" letter-spacing="4">KIMA</text>
  <!-- Beauty Lounge - gold italic script -->
  <text x="100" y="210" font-family="'Cormorant Garamond', 'Palatino Linotype', Georgia, serif"
    font-size="19" font-weight="400" font-style="italic" text-anchor="middle" fill="#c9a84c" letter-spacing="2">Beauty Lounge</text>
</svg>`;
}

/* ── Render All ── */
function renderAll() {
  renderNavbar();
  renderHero();
  renderServices();
  renderBookingForm();
  renderTestimonials();
  renderPacks();
  renderContact();
  renderFooter();
}

/* ── NAVBAR ── */
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-logo kima-logo sm">${kimaLogo(44)}</div>
    <ul class="nav-links">
      <li><a href="#hero" class="active" onclick="scrollToSection('hero');return false;">${t('home')}</a></li>
      <li><a href="#services" onclick="scrollToSection('services');return false;">${t('services')}</a></li>
      <li><a href="#packs" onclick="scrollToSection('packs');return false;">${t('packs')}</a></li>
      <li><a href="#booking" onclick="scrollToSection('booking');return false;">${t('booking')}</a></li>
      <li><a href="#contact" onclick="scrollToSection('contact');return false;">${t('contact')}</a></li>
    </ul>
    <div class="nav-controls">
      <button class="btn-theme" id="btn-theme" onclick="toggleTheme()" aria-label="Toggle theme">${App.theme === 'dark' ? '☀️' : '🌙'}</button>
      <button class="btn-lang" id="btn-lang" onclick="toggleLang()">${App.lang === 'ar' ? 'FR' : 'AR'}</button>
      <button class="btn-book-nav" onclick="scrollToSection('booking')">${t('bookNow')}</button>
      <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMobileNav()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  // sync mobile nav
  const mobileLinks = document.getElementById('mobile-nav-links');
  if (mobileLinks) mobileLinks.innerHTML = nav.querySelector('.nav-links').innerHTML;
}

function toggleMobileNav() {
  document.getElementById('nav-overlay')?.classList.toggle('open');
  document.getElementById('nav-hamburger')?.classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('nav-overlay')?.classList.remove('open');
  document.getElementById('nav-hamburger')?.classList.remove('open');
}
function scrollToSection(id) {
  closeMobileNav();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── HERO ── */
function renderHero() {
  const section = document.getElementById('hero');
  if (!section) return;
  section.innerHTML = `
    <div class="hero-bg"></div>
    <div class="hero-particles"></div>
    <div class="hero-content">
      <div class="hero-logo-wrap">
        <div class="hero-logo-ring"></div>
        <div class="hero-logo-ring"></div>
        <div class="kima-logo lg">${kimaLogo(160)}</div>
      </div>
      <h1 class="hero-title">KIMA Beauty Lounge</h1>
      <p class="hero-subtitle-ar">${App.data.meta.taglineAr}</p>
      <p class="hero-subtitle-fr">${App.data.meta.taglineFr}</p>
      <div class="urgency-badge">${t('urgencyBadge')}</div>
      <div class="hero-ctas" style="margin-top:1.5rem;">
        <button class="btn-primary" onclick="scrollToSection('booking')">${t('bookAppointment')}</button>
        <button class="btn-ghost" onclick="scrollToSection('packs')">${t('discoverPacks')}</button>
      </div>
    </div>
    <div class="trust-bar container">
      <div class="trust-item"><span class="val">✨ +500</span><span class="lab">${t('trustClients')}</span></div>
      <div class="trust-item"><span class="val">⭐ 4.9</span><span class="lab">${t('trustRating')}</span></div>
      <div class="trust-item"><span class="val">🏆 4</span><span class="lab">${t('trustExperience')}</span></div>
      <div class="trust-item"><span class="val">💛</span><span class="lab">${t('trustExclusive')}</span></div>
    </div>
  `;
}

/* ── SERVICES ── */
function renderServices() {
  const section = document.getElementById('services');
  if (!section || !App.data.services) return;
  const isAr = App.lang === 'ar';
  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">${t('ourServices')}</h2>
        <div class="gold-divider"></div>
      </div>
      <div class="services-grid">
        ${App.data.services.map(s => `
          <div class="service-card reveal" onclick="selectServiceAndBook(${s.id})">
            <div class="service-img-wrap">
              <img src="${s.image}" alt="${isAr ? s.nameAr : s.nameFr}" loading="lazy"/>
              <div class="badge-category">${s.icon}</div>
              <div class="badge-price">${isAr ? s.priceLabel : s.priceLabelFr}</div>
            </div>
            <div class="service-body">
              <div class="service-icon">${s.icon}</div>
              <div class="service-name">${isAr ? s.nameAr : s.nameFr}</div>
              <div class="service-desc">${isAr ? s.descAr : s.descFr}</div>
              <div class="service-duration">⏱ ${s.duration} ${t('minutes')}</div>
              <button class="btn-service">${t('bookService')}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  initRevealObserver();
}

function selectServiceAndBook(serviceId) {
  App.selectedService = serviceId;
  scrollToSection('booking');
  setTimeout(() => {
    const sel = document.getElementById('form-service');
    if (sel) { sel.value = serviceId; onServiceChange(); }
  }, 650);
}

/* ════════════════════════════════════════════
   BOOKING FORM — with staff + duration-aware slots
════════════════════════════════════════════ */
function renderBookingForm() {
  const section = document.getElementById('booking');
  if (!section) return;
  const isAr = App.lang === 'ar';

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">${t('bookAppointment')}</h2>
        <div class="gold-divider"></div>
      </div>
      <div class="booking-layout">
        <div class="booking-deco reveal">
          <div class="booking-deco-logo kima-logo md">${kimaLogo(90)}</div>
          <div class="booking-quote">
            <blockquote>${isAr
              ? '"كل امرأة تستحق لحظة من الرفاهية والجمال الحقيقي"'
              : '"Chaque femme mérite un moment de luxe et de beauté authentique"'}</blockquote>
            <cite>— KIMA Beauty Lounge</cite>
          </div>
        </div>
        <div class="booking-form-wrap reveal">
          <div class="booking-form-title">${t('bookAppointment')}</div>

          <div class="form-group">
            <label class="form-label" for="form-name">${t('fullName')}</label>
            <input class="form-input" type="text" id="form-name" placeholder="${isAr ? 'اسمك الكامل' : 'Votre nom complet'}" required/>
          </div>

          <div class="form-group">
            <label class="form-label" for="form-phone">${t('phone')}</label>
            <input class="form-input" type="tel" id="form-phone" placeholder="06XXXXXXXX" required/>
          </div>

          <div class="form-group">
            <label class="form-label" for="form-service">${t('selectService')}</label>
            <select class="form-select" id="form-service" onchange="onServiceChange()">
              <option value="">${isAr ? '— اختيار الخدمة —' : '— Choisir un service —'}</option>
              ${App.data.services.map(s => `<option value="${s.id}">${isAr ? s.nameAr : s.nameFr} — ${s.duration}${t('minutes')} (${isAr ? s.priceLabel : s.priceLabelFr})</option>`).join('')}
              <hr/>
              ${App.data.packs.map(p => `<option value="pack-${p.id}">${isAr ? p.nameAr : p.nameFr} (${isAr ? p.priceLabel : p.priceLabelFr})</option>`).join('')}
            </select>
          </div>

          <div class="form-group" id="staff-group">
            <label class="form-label" for="form-staff">${t('selectStaff')}</label>
            <select class="form-select" id="form-staff" onchange="renderSlots()">
              <option value="any">${t('anyStaff')}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="form-date">${t('selectDate')}</label>
            <input class="form-input" type="date" id="form-date" onchange="renderSlots()"/>
          </div>

          <div class="form-group">
            <label class="form-label">${t('selectTime')}</label>
            <div id="slot-note" style="font-size:0.78rem;color:var(--gold);margin-bottom:0.5rem;display:none;">${t('slotNote')}</div>
            <div class="slots-grid" id="slots-grid">
              <div style="color:var(--text-secondary);font-size:0.85rem;grid-column:1/-1;padding:0.5rem;">
                ${isAr ? 'اختاري الخدمة والتاريخ أولاً' : 'Choisissez d\'abord le service et la date'}
              </div>
            </div>
          </div>

          <button class="btn-confirm" id="btn-confirm" onclick="submitBooking()">
            <span class="btn-text">${t('confirm')}</span>
            <div class="spinner"></div>
          </button>
        </div>
      </div>
    </div>
  `;

  // date constraints
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    const today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
    const max = new Date(); max.setMonth(max.getMonth() + 3);
    dateInput.max = max.toISOString().split('T')[0];
  }

  if (App.selectedService) {
    const sel = document.getElementById('form-service');
    if (sel) { sel.value = App.selectedService; onServiceChange(); }
  }
  initRevealObserver();
}

/* Called when service changes → update staff list */
function onServiceChange() {
  const svcVal = document.getElementById('form-service')?.value;
  const staffSel = document.getElementById('form-staff');
  const slotNote = document.getElementById('slot-note');
  if (!staffSel) return;

  if (slotNote) slotNote.style.display = svcVal ? 'block' : 'none';

  // Determine category
  const svcObj = App.data.services.find(s => String(s.id) === String(svcVal));
  const category = svcObj?.category || null;

  // Filter staff
  const eligible = (App.data.staff || []).filter(st => {
    if (!category) return true;
    return st.specialties.includes(category);
  });

  const isAr = App.lang === 'ar';
  staffSel.innerHTML = `<option value="any">${t('anyStaff')}</option>` +
    eligible.map(st => `<option value="${st.id}">${st.emoji} ${isAr ? st.nameAr : st.nameFr} — ${isAr ? st.roleAr : st.roleFr}</option>`).join('');

  renderSlots();
}

/* ════════════════════════════════════════════
   SLOTS — Duration-aware blocking
   Logic: a slot S is BLOCKED if any existing booking B satisfies:
     B.start < S.end  AND  B.end > S.start
   where S.end = S + selectedDuration
════════════════════════════════════════════ */
function generateAllSlots() {
  const slots = [];
  for (let h = 10; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 20 && m > 30) break;
      slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    }
  }
  return slots; // 10:00 … 20:30
}

function timeToMin(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minToTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function getSelectedDuration() {
  const svcVal = document.getElementById('form-service')?.value;
  if (!svcVal) return 30;
  const svcObj = App.data.services.find(s => String(s.id) === String(svcVal));
  if (svcObj) return svcObj.duration;
  const packObj = App.data.packs.find(p => `pack-${p.id}` === svcVal);
  return packObj?.duration || 60;
}

function getBookings() {
  return JSON.parse(localStorage.getItem('kima_v2') || '[]');
}

/* Returns true if slot [slotStart, slotStart+duration) overlaps with any booking */
function isSlotBlocked(date, slotStart, duration, staffId) {
  const bookings = getBookings().filter(b => b.date === date && b.status !== 'cancelled');
  const slotStartMin = timeToMin(slotStart);
  const slotEndMin = slotStartMin + duration;
  const SALON_CLOSE = timeToMin('21:00');

  // Can't start if service would run past 21:00
  if (slotEndMin > SALON_CLOSE) return true;

  for (const b of bookings) {
    // Staff filter: if a specific staff was selected, only check that staff's bookings
    if (staffId && staffId !== 'any' && b.staff && b.staff !== 'any' && b.staff !== staffId) continue;
    // If booking has specific staff and we're checking specific staff, skip non-matching
    const bStart = timeToMin(b.time);
    const bEnd = bStart + (b.duration || 30);
    // Overlap check: [slotStart, slotEnd) overlaps [bStart, bEnd)
    if (slotStartMin < bEnd && slotEndMin > bStart) return true;
  }
  return false;
}

function renderSlots() {
  const dateInput = document.getElementById('form-date');
  const grid = document.getElementById('slots-grid');
  const staffVal = document.getElementById('form-staff')?.value || 'any';
  if (!grid || !dateInput) return;

  const date = dateInput.value;
  if (!date) {
    grid.innerHTML = `<div style="color:var(--text-secondary);font-size:0.85rem;grid-column:1/-1;padding:0.5rem;">${App.lang==='ar'?'اختاري التاريخ أولاً':'Choisissez d\'abord la date'}</div>`;
    return;
  }

  const d = new Date(date + 'T12:00:00');
  if (d.getDay() === 0) {
    grid.innerHTML = `<div style="color:var(--danger);grid-column:1/-1;padding:0.5rem;">🚫 ${App.lang==='ar'?'الأحد: الصالون مغلق':'Dimanche: Salon fermé'}</div>`;
    return;
  }

  const duration = getSelectedDuration();
  const slots = generateAllSlots();
  App.selectedSlot = null;

  // Calculate available
  const slotStates = slots.map(slot => {
    const blocked = isSlotBlocked(date, slot, duration, staffVal);
    return { slot, blocked };
  });

  const availableSlots = slotStates.filter(s => !s.blocked);
  const lastTwo = availableSlots.slice(-2).map(s => s.slot);

  grid.innerHTML = slotStates.map(({ slot, blocked }) => {
    const isLast = !blocked && lastTwo.includes(slot);
    const endMin = timeToMin(slot) + duration;
    const endTime = minToTime(endMin);
    let cls = blocked ? 'booked' : (isLast ? 'last-slot' : 'available');
    const clickAttr = blocked ? 'disabled' : `onclick="selectSlot('${slot}', this)"`;
    return `
      <button class="slot-pill ${cls}" ${clickAttr} data-slot="${slot}" title="${App.lang==='ar'?'ينتهي':'Fin'}: ${endTime}">
        <span class="slot-time">${slot}</span>
        ${!blocked ? `<span class="slot-end">→ ${endTime}</span>` : `<span class="slot-end">✕</span>`}
        ${isLast ? '<span class="slot-fire">🔥</span>' : ''}
      </button>`;
  }).join('');
}

function selectSlot(slot, el) {
  App.selectedSlot = slot;
  document.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
}

/* ── Save booking ── */
function saveBooking(booking) {
  const bookings = getBookings();
  booking.id = `KIMA-${Date.now()}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
  booking.status = 'confirmed';
  booking.createdAt = new Date().toISOString();
  bookings.push(booking);
  localStorage.setItem('kima_v2', JSON.stringify(bookings));
  return booking;
}

function getServiceName(svcVal) {
  const isAr = App.lang === 'ar';
  const s = App.data.services.find(s => String(s.id) === String(svcVal));
  if (s) return isAr ? s.nameAr : s.nameFr;
  const p = App.data.packs.find(p => `pack-${p.id}` === svcVal);
  if (p) return isAr ? p.nameAr : p.nameFr;
  return svcVal;
}

function getStaffName(staffId) {
  if (!staffId || staffId === 'any') return App.lang === 'ar' ? 'أي عاملة متاحة' : 'Toute esthéticienne';
  const s = (App.data.staff || []).find(s => s.id === staffId);
  if (!s) return staffId;
  return App.lang === 'ar' ? `${s.emoji} ${s.nameAr}` : `${s.emoji} ${s.nameFr}`;
}

/* ── Submit ── */
async function submitBooking() {
  const name    = document.getElementById('form-name')?.value?.trim();
  const phone   = document.getElementById('form-phone')?.value?.trim();
  const service = document.getElementById('form-service')?.value;
  const date    = document.getElementById('form-date')?.value;
  const staffId = document.getElementById('form-staff')?.value || 'any';
  const slot    = App.selectedSlot;
  const isAr    = App.lang === 'ar';

  if (!name || !phone || !service || !date || !slot) {
    alert(isAr ? 'يرجى ملء جميع الحقول واختيار موعد' : 'Veuillez remplir tous les champs et choisir un créneau');
    return;
  }

  const duration = getSelectedDuration();
  if (isSlotBlocked(date, slot, duration, staffId)) {
    alert(isAr ? 'هذا الموعد أصبح محجوزاً، اختاري موعداً آخر.' : 'Ce créneau est maintenant indisponible, choisissez-en un autre.');
    renderSlots();
    return;
  }

  const btn = document.getElementById('btn-confirm');
  btn.classList.add('loading'); btn.disabled = true;
  await new Promise(r => setTimeout(r, 850));

  const booking = saveBooking({ name, phone, service, date, time: slot, duration, staff: staffId, lang: App.lang });

  btn.classList.remove('loading'); btn.disabled = false;
  showConfirmationModal(booking);
  renderSlots();
}

/* ════════════════════════════════════════════
   CONFIRMATION MODAL
   Full booking card + QR code with all data
   + WhatsApp send button
════════════════════════════════════════════ */
function showConfirmationModal(booking) {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  const isAr   = App.lang === 'ar';
  const svcName = getServiceName(booking.service);
  const staffName = getStaffName(booking.staff);
  const endMin  = timeToMin(booking.time) + (booking.duration || 30);
  const endTime = minToTime(endMin);

  const dateObj = new Date(booking.date + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Full text for WhatsApp
  const waText = isAr
    ? `🌸 *KIMA Beauty Lounge*\n\n✅ *بطاقة الحجز المؤكد*\n\n📋 رقم الحجز: ${booking.id}\n👤 الاسم: ${booking.name}\n📞 الهاتف: ${booking.phone}\n✂️ الخدمة: ${svcName}\n👩 العاملة: ${staffName}\n📅 التاريخ: ${dateFormatted}\n⏰ الوقت: ${booking.time} ← ${endTime}\n📍 حي مولاي عبد الله / شارع القدس\n\n💛 نتطلع لاستقبالكِ!`
    : `🌸 *KIMA Beauty Lounge*\n\n✅ *Carte de Réservation Confirmée*\n\n📋 N°: ${booking.id}\n👤 Nom: ${booking.name}\n📞 Tél: ${booking.phone}\n✂️ Service: ${svcName}\n👩 Esthéticienne: ${staffName}\n📅 Date: ${dateFormatted}\n⏰ Heure: ${booking.time} → ${endTime}\n📍 Hay Moulay Abdellah / Rue Al Qods\n\n💛 Nous vous attendons!`;

  const waUrl = `${App.data.meta.whatsapp}?text=${encodeURIComponent(waText)}`;

  // QR data — full booking card as JSON string
  const qrData = JSON.stringify({
    salon: 'KIMA Beauty Lounge',
    id: booking.id,
    name: booking.name,
    phone: booking.phone,
    service: svcName,
    staff: staffName,
    date: booking.date,
    time: booking.time,
    end: endTime,
    address: isAr ? 'حي مولاي عبد الله / شارع القدس' : 'Hay Moulay Abdellah, Casablanca'
  });

  document.getElementById('modal-inner').innerHTML = `
    <div class="modal-watermark"><div style="width:280px;">${kimaLogo(280)}</div></div>
    <button class="modal-close" onclick="closeModal()">&times;</button>

    <svg class="check-circle" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="34"/>
      <path d="M20 36 L30 46 L52 24"/>
    </svg>

    <div class="modal-title">${t('bookingConfirmed')}</div>

    <!-- Full booking card -->
    <div class="booking-card">
      <div class="booking-card-row">
        <span class="lbl">${isAr ? 'رقم الحجز' : 'N° Réservation'}</span>
        <span class="val booking-id">${booking.id}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${t('name')}</span>
        <span class="val">${booking.name}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${isAr ? 'الهاتف' : 'Tél'}</span>
        <span class="val">${booking.phone}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${t('service')}</span>
        <span class="val">${svcName}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${t('staffLabel')}</span>
        <span class="val">${staffName}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${t('date')}</span>
        <span class="val">${dateFormatted}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${t('time')}</span>
        <span class="val">🕐 ${booking.time} <span style="color:var(--text-secondary);font-size:0.82em;">← ${isAr?'ينتهي':'fin'}</span> ${endTime}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${isAr ? 'المدة' : 'Durée'}</span>
        <span class="val">${booking.duration} ${t('minutes')}</span>
      </div>
      <div class="booking-card-row">
        <span class="lbl">${isAr ? 'العنوان' : 'Adresse'}</span>
        <span class="val" style="font-size:0.8rem;">${isAr ? App.data.meta.addressAr : App.data.meta.addressFr}</span>
      </div>
    </div>

    <!-- QR Code -->
    <div id="qr-container"></div>
    <div style="font-size:0.72rem;color:var(--text-secondary);margin-top:0.4rem;margin-bottom:0.75rem;">
      ${isAr ? 'امسحي الكود للحصول على تفاصيل الحجز' : 'Scanner pour obtenir les détails de réservation'}
    </div>

    <!-- Actions -->
    <div class="modal-actions">
      <button class="btn-wa" onclick="window.open('${waUrl}','_blank')">
        💬 ${t('shareWhatsApp')}
      </button>
      <button class="btn-dl" onclick="downloadQR()">⬇ ${t('downloadQR')}</button>
    </div>
  `;

  modal.classList.add('open');

  // Generate QR with full card data
  setTimeout(() => {
    const qrContainer = document.getElementById('qr-container');
    if (qrContainer && typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      new QRCode(qrContainer, {
        text: qrData,
        width: 164,
        height: 164,
        colorDark: '#c9a84c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }, 350);
}

function closeModal() {
  document.getElementById('booking-modal')?.classList.remove('open');
}

function downloadQR() {
  const canvas = document.querySelector('#qr-container canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'kima-booking-qr.png';
  link.click();
}

/* ── TESTIMONIALS ── */
function renderTestimonials() {
  const section = document.getElementById('testimonials');
  if (!section) return;
  const isAr = App.lang === 'ar';
  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">${t('testimonials')}</h2>
        <div class="gold-divider"></div>
      </div>
      <div class="testimonials-grid">
        ${App.data.testimonials.map(r => `
          <div class="testimonial-card reveal">
            <div class="testimonial-avatar">${r.name.charAt(0)}</div>
            <div class="testimonial-stars">${'★'.repeat(r.rating)}</div>
            <p class="testimonial-text">"${isAr ? r.textAr : r.textFr}"</p>
            <div class="testimonial-author">${isAr ? r.name : r.nameFr}</div>
            <div class="testimonial-service">${isAr ? r.serviceAr : r.serviceFr}</div>
          </div>`).join('')}
      </div>
    </div>`;
  initRevealObserver();
}

/* ── PACKS ── */
function renderPacks() {
  const section = document.getElementById('packs');
  if (!section) return;
  const isAr = App.lang === 'ar';

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">${t('ourPacks')}</h2>
        <div class="gold-divider"></div>
      </div>
      <div class="packs-grid">
        ${App.data.packs.map(p => `
          <div class="pack-card ${p.featured?'featured':''} reveal">
            ${p.featured ? `<div class="featured-ribbon">⭐ ${isAr?p.tagAr:p.tagFr} ⭐</div>` : ''}
            <div class="pack-image-wrap">
              <img src="${p.image}" alt="${isAr?p.nameAr:p.nameFr}" loading="lazy"/>
              ${!p.featured ? `<div class="pack-tag-badge">${isAr?p.tagAr:p.tagFr}</div>` : ''}
            </div>
            <div class="pack-body">
              <div class="pack-name">${isAr?p.nameAr:p.nameFr}</div>
              <div class="pack-pricing">
                <span class="pack-price">${isAr?p.priceLabel:p.priceLabelFr}</span>
                <span class="pack-original">${p.originalPriceLabel}</span>
                <span class="pack-savings">${isAr?p.savingsAr:p.savingsFr}</span>
              </div>
              <ul class="pack-services">
                ${(isAr?p.servicesAr:p.servicesFr).map(s=>`<li>${s}</li>`).join('')}
              </ul>
              <div class="pack-duration">${isAr?p.durationAr:p.durationFr}</div>
              <div class="pack-ctas">
                <button class="btn-pack-book" onclick="bookPack('${p.id}')">${t('bookPack')}</button>
                <a class="btn-pack-wa" href="${App.data.meta.whatsapp}" target="_blank">💬 ${t('contactUs')}</a>
              </div>
            </div>
          </div>`).join('')}
      </div>

      <div class="faq-section reveal">
        ${[
          {q:t('faq1Q'),a:t('faq1A')},
          {q:t('faq2Q'),a:t('faq2A')},
          {q:t('faq3Q'),a:t('faq3A')}
        ].map((f,i)=>`
          <div class="faq-item" id="faq-${i}">
            <button class="faq-q" onclick="toggleFaq(${i})"><span>${f.q}</span><span class="arrow">▼</span></button>
            <div class="faq-a"><p>${f.a}</p></div>
          </div>`).join('')}
      </div>
      <div class="custom-pack-banner reveal">
        ${t('customPack')} <a href="${App.data.meta.whatsapp}" target="_blank">💬 WhatsApp</a>
      </div>
    </div>`;
  initRevealObserver();
}

function bookPack(packId) {
  App.selectedService = `pack-${packId}`;
  scrollToSection('booking');
  setTimeout(() => {
    const sel = document.getElementById('form-service');
    if (sel) { sel.value = `pack-${packId}`; onServiceChange(); }
  }, 650);
}

function toggleFaq(idx) { document.getElementById(`faq-${idx}`)?.classList.toggle('open'); }

/* ── CONTACT ── */
function renderContact() {
  const section = document.getElementById('contact');
  if (!section) return;
  const isAr = App.lang === 'ar';
  const m = App.data.meta;
  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">${t('contactTitle')}</h2>
        <div class="gold-divider"></div>
      </div>
      <div class="contact-grid">
        <div class="contact-info reveal">
          <h3>${t('contactTitle')}</h3>
          <div class="contact-item"><span class="contact-icon">📍</span><span>${isAr?m.addressAr:m.addressFr}</span></div>
          <div class="contact-item"><span class="contact-icon">📞</span><a href="tel:${m.phone}">${m.phone}</a></div>
          <div class="contact-item"><span class="contact-icon">⏰</span><span>${isAr?m.hoursAr:m.hoursFr}<br/>${isAr?m.closedAr:m.closedFr}</span></div>
          <div class="contact-item"><span class="contact-icon">💬</span><a href="${m.whatsapp}" target="_blank">WhatsApp</a></div>
          <div style="margin-top:1.5rem;">
            <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.75rem;">${t('followUs')}</div>
            <div class="social-links">
              <a class="social-btn" href="${m.instagram}" target="_blank">📸 ${m.instagramHandle}</a>
              <a class="social-btn" href="${m.tiktok}" target="_blank">🎵 ${m.tiktokHandle}</a>
            </div>
          </div>
        </div>
        <div class="map-placeholder reveal">
          <p>${isAr?m.addressAr:m.addressFr}</p>
          <a class="social-btn" href="https://maps.google.com?q=Hay+Moulay+Abdellah+Casablanca+Morocco" target="_blank">🗺 ${isAr?'فتح الخريطة':'Ouvrir la carte'}</a>
        </div>
      </div>
    </div>`;
  initRevealObserver();
}

/* ── FOOTER ── */
function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="kima-logo md">${kimaLogo(60)}</div>
      <div class="footer-copy">
        <span class="copy-trigger" id="copy-trigger" onclick="handleCopyClick()">©</span>
        2025 KIMA Beauty Lounge — ${t('rights')}
      </div>
      <div>
        <a href="${App.data.meta.instagram}" target="_blank" style="margin:0 0.5rem;color:var(--text-secondary);">📸</a>
        <a href="${App.data.meta.tiktok}" target="_blank" style="margin:0 0.5rem;color:var(--text-secondary);">🎵</a>
        <a href="${App.data.meta.whatsapp}" target="_blank" style="margin:0 0.5rem;color:var(--text-secondary);">💬</a>
      </div>
    </div>`;
}

/* ── ADMIN TRIGGER (5 clicks © ) ── */
function handleCopyClick() {
  App.copyClickCount++;
  clearTimeout(App.copyClickTimer);
  App.copyClickTimer = setTimeout(() => { App.copyClickCount = 0; }, 2000);
  if (App.copyClickCount >= 5) { App.copyClickCount = 0; openPasswordModal(); }
}
function openPasswordModal() {
  const m = document.getElementById('pw-modal');
  if (m) { m.classList.add('open'); document.getElementById('pw-input')?.focus(); document.getElementById('pw-error').textContent = ''; document.getElementById('pw-input').value = ''; }
}
function closePasswordModal() { document.getElementById('pw-modal')?.classList.remove('open'); }
function submitPassword() {
  const val = document.getElementById('pw-input')?.value;
  if (val === App.data.meta.adminPassword) { closePasswordModal(); openAdmin(); }
  else { document.getElementById('pw-error').textContent = App.lang==='ar' ? '❌ كلمة المرور خاطئة' : '❌ Mot de passe incorrect'; }
}

/* ── ADMIN ── */
function openAdmin() {
  const screen = document.getElementById('admin-screen');
  if (screen) { screen.classList.add('active'); renderAdminSidebar(); switchAdminPanel('overview'); }
}
function closeAdmin() { document.getElementById('admin-screen')?.classList.remove('active'); }

function renderAdminSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  if (!sidebar) return;
  sidebar.innerHTML = `
    <div class="admin-logo">
      <div class="kima-logo sm">${kimaLogo(36)}</div>
      <div class="admin-logo-text">Admin</div>
    </div>
    <ul class="admin-nav">
      ${[['overview','📊',t('overview')],['appointments','📅',t('appointments')],['analytics','📈',t('analytics')]].map(([id,icon,label])=>`
        <li><button class="admin-nav-btn" id="nav-${id}" onclick="switchAdminPanel('${id}')">${icon} ${label}</button></li>`).join('')}
    </ul>
    <button class="admin-logout" onclick="closeAdmin()">↩ ${t('logout')}</button>`;
}

function switchAdminPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`panel-${id}`)?.classList.add('active');
  document.getElementById(`nav-${id}`)?.classList.add('active');
  renderAdminPanel(id);
}

function statusBadge(status) {
  const map = { confirmed:t('confirmed'), pending:t('pending'), completed:t('completed'), cancelled:t('cancelled') };
  return `<span class="status-badge ${status}">${map[status]||status}</span>`;
}

function renderAdminPanel(id) {
  const bookings = getBookings();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate()-30);

  const svcCount = {};
  bookings.forEach(b => { svcCount[b.service]=(svcCount[b.service]||0)+1; });
  const topSvc = Object.entries(svcCount).sort((a,b)=>b[1]-a[1])[0];
  const topName = topSvc ? getServiceName(topSvc[0]) : '—';

  if (id === 'overview') {
    document.getElementById('panel-overview').innerHTML = `
      <div class="admin-panel-title">📊 ${t('overview')}</div>
      <div class="overview-cards">
        <div class="ov-card"><div class="ov-card-label">${t('todayBookings')}</div><div class="ov-card-value">${bookings.filter(b=>b.date===today).length}</div></div>
        <div class="ov-card"><div class="ov-card-label">${t('weekBookings')}</div><div class="ov-card-value">${bookings.filter(b=>new Date(b.date)>=weekAgo).length}</div></div>
        <div class="ov-card"><div class="ov-card-label">${t('monthBookings')}</div><div class="ov-card-value">${bookings.filter(b=>new Date(b.date)>=monthAgo).length}</div></div>
        <div class="ov-card"><div class="ov-card-label">${t('topService')}</div><div class="ov-card-value" style="font-size:0.95rem;padding-top:0.2rem;">${topName}</div></div>
      </div>
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:1.5rem;">
        <div style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:1rem;">${App.lang==='ar'?'آخر الحجوزات':'Dernières réservations'}</div>
        ${bookings.slice(-5).reverse().map(b=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0;border-bottom:1px solid var(--border);font-size:0.85rem;gap:0.5rem;flex-wrap:wrap;">
            <span><strong>${b.name}</strong></span>
            <span style="color:var(--text-secondary);">${getServiceName(b.service)}</span>
            <span style="color:var(--gold);">${b.date} ${b.time}</span>
            ${statusBadge(b.status)}
          </div>`).join('')||`<div style="color:var(--text-secondary);">${App.lang==='ar'?'لا توجد حجوزات':'Aucune réservation'}</div>`}
      </div>`;
  }

  if (id === 'appointments') renderAppointmentsPanel(bookings);
  if (id === 'analytics') renderAnalyticsPanel(bookings);
}

function renderAppointmentsPanel(bookings) {
  const panel = document.getElementById('panel-appointments');
  if (!panel) return;
  panel.innerHTML = `
    <div class="admin-panel-title">📅 ${t('appointments')}</div>
    <div class="admin-filters">
      <input class="admin-filter-input" type="text" id="filter-search" placeholder="${t('search')}" oninput="filterAppointments()"/>
      <input class="admin-filter-input" type="date" id="filter-date" onchange="filterAppointments()"/>
      <select class="admin-filter-input" id="filter-status" onchange="filterAppointments()">
        <option value="">${App.lang==='ar'?'كل الحالات':'Tous les statuts'}</option>
        <option value="confirmed">${t('confirmed')}</option>
        <option value="pending">${t('pending')}</option>
        <option value="completed">${t('completed')}</option>
        <option value="cancelled">${t('cancelled')}</option>
      </select>
      <button class="action-btn" onclick="exportToWhatsApp()" style="border-color:var(--green-wa);color:var(--green-wa);">💬 ${t('exportWA')}</button>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>#</th><th>${t('name')}</th><th>${App.lang==='ar'?'الهاتف':'Tél'}</th>
            <th>${t('service')}</th><th>${t('staffLabel')}</th>
            <th>${t('date')}</th><th>${t('time')}</th>
            <th>${App.lang==='ar'?'المدة':'Durée'}</th>
            <th>${t('status')}</th><th>${t('actions')}</th>
          </tr>
        </thead>
        <tbody id="appointments-tbody"></tbody>
      </table>
    </div>`;
  renderAppointmentsTable(bookings);
}

function renderAppointmentsTable(bookings) {
  const tbody = document.getElementById('appointments-tbody');
  if (!tbody) return;
  tbody.innerHTML = bookings.length ? bookings.slice().reverse().map((b,i)=>`
    <tr>
      <td style="color:var(--text-secondary);font-size:0.78rem;">${bookings.length-i}</td>
      <td><strong>${b.name}</strong></td>
      <td><a href="tel:${b.phone}" style="color:var(--gold);">${b.phone}</a></td>
      <td style="font-size:0.83rem;">${getServiceName(b.service)}</td>
      <td style="font-size:0.83rem;">${getStaffName(b.staff)}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
      <td style="color:var(--text-secondary);">${b.duration||30}${App.lang==='ar'?' د':'m'}</td>
      <td>${statusBadge(b.status)}</td>
      <td style="white-space:nowrap;">
        ${b.status!=='completed'?`<button class="action-btn" onclick="updateBooking('${b.id}','completed')" title="${t('completed')}">✔</button>`:''}
        ${b.status!=='cancelled'?`<button class="action-btn" onclick="updateBooking('${b.id}','cancelled')" title="${t('cancelled')}">✕</button>`:''}
        <button class="action-btn del" onclick="deleteBooking('${b.id}')" title="Delete">🗑</button>
      </td>
    </tr>`).join('')
    : `<tr><td colspan="10" style="text-align:center;color:var(--text-secondary);padding:2rem;">${App.lang==='ar'?'لا توجد حجوزات':'Aucune réservation'}</td></tr>`;
}

function filterAppointments() {
  let b = getBookings();
  const s = document.getElementById('filter-search')?.value?.toLowerCase();
  const d = document.getElementById('filter-date')?.value;
  const st = document.getElementById('filter-status')?.value;
  if (s) b = b.filter(x=>x.name.toLowerCase().includes(s)||x.phone.includes(s));
  if (d) b = b.filter(x=>x.date===d);
  if (st) b = b.filter(x=>x.status===st);
  renderAppointmentsTable(b);
}

function updateBooking(id, status) {
  const b = getBookings();
  const item = b.find(x=>x.id===id);
  if (item) { item.status=status; localStorage.setItem('kima_v2',JSON.stringify(b)); renderAppointmentsPanel(b); }
}

function deleteBooking(id) {
  if (!confirm(App.lang==='ar'?'حذف الحجز؟':'Supprimer?')) return;
  const b = getBookings().filter(x=>x.id!==id);
  localStorage.setItem('kima_v2',JSON.stringify(b));
  renderAppointmentsPanel(b);
}

function exportToWhatsApp() {
  const b = getBookings().filter(x=>x.status!=='cancelled');
  if (!b.length) return;
  const isAr = App.lang==='ar';
  const text = b.map(x=>`📋 ${x.id}\n👤 ${x.name} | 📞 ${x.phone}\n✂️ ${getServiceName(x.service)}\n👩 ${getStaffName(x.staff)}\n📅 ${x.date} ${x.time} (${x.duration||30}${isAr?'د':'m'})\n✅ ${x.status}`).join('\n\n---\n\n');
  window.open(`${App.data.meta.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
}

function renderAnalyticsPanel(bookings) {
  const panel = document.getElementById('panel-analytics');
  if (!panel) return;
  const isAr = App.lang==='ar';
  const days = isAr ? ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] : ['Lun','Mar','Mer','Jeu','Ven','Sam'];
  const dayCounts = [1,2,3,4,5,6].map(d=>bookings.filter(b=>new Date(b.date).getDay()===d).length);
  const maxDay = Math.max(...dayCounts,1);
  const svcCount = {};
  bookings.forEach(b=>{svcCount[b.service]=(svcCount[b.service]||0)+1;});
  const topServices = Object.entries(svcCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxSvc = Math.max(...topServices.map(s=>s[1]),1);
  const totalRev = bookings.filter(b=>b.status!=='cancelled').reduce((acc,b)=>{
    const s = App.data.services.find(s=>String(s.id)===String(b.service));
    return acc+(s?parseInt(s.price):100);
  },0);
  panel.innerHTML = `
    <div class="admin-panel-title">📈 ${t('analytics')}</div>
    <div class="analytics-section">
      <div class="chart-card">
        <div class="chart-title">${t('weeklyChart')}</div>
        ${days.map((d,i)=>`
          <div class="bar-row">
            <div class="bar-label">${d}</div>
            <div class="bar-track"><div class="bar-fill" data-width="${Math.round(dayCounts[i]/maxDay*100)}" style="width:0"></div></div>
            <div class="bar-val">${dayCounts[i]}</div>
          </div>`).join('')}
      </div>
      <div class="chart-card">
        <div class="chart-title">${t('popularServices')}</div>
        ${topServices.map(([s,c])=>`
          <div class="bar-row">
            <div class="bar-label" style="width:90px;font-size:0.72rem;">${getServiceName(s).substring(0,12)}</div>
            <div class="bar-track"><div class="bar-fill" data-width="${Math.round(c/maxSvc*100)}" style="width:0"></div></div>
            <div class="bar-val">${c}</div>
          </div>`).join('')||`<div style="color:var(--text-secondary);font-size:0.88rem;">${isAr?'لا بيانات':'Pas de données'}</div>`}
        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);">
          <div class="chart-title" style="margin-bottom:0.5rem;">${t('revenueEst')}</div>
          <div style="font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:var(--gold);">${totalRev.toLocaleString()} <span style="font-size:0.9rem;">${t('currency')}</span></div>
        </div>
      </div>
    </div>`;
  setTimeout(()=>{ document.querySelectorAll('.bar-fill').forEach(b=>{b.style.width=(b.dataset.width||0)+'%';}); },100);
}

/* ── Observers & Nav ── */
function initNavbar() {
  window.addEventListener('scroll', ()=>{
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY>60);
  });
}

function initRevealObserver() {
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>obs.observe(el));
}

function initScrollBehaviors() {
  initRevealObserver();
  document.getElementById('booking-modal')?.addEventListener('click', e=>{ if(e.target===e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Enter' && document.getElementById('pw-modal')?.classList.contains('open')) submitPassword(); });
}

/* ── Expose all globals ── */
function exposeGlobals() {
  const fns = { toggleTheme,toggleLang,toggleMobileNav,closeMobileNav,scrollToSection,
    selectServiceAndBook,onServiceChange,renderSlots,selectSlot,submitBooking,
    closeModal,downloadQR,bookPack,toggleFaq,handleCopyClick,openPasswordModal,
    closePasswordModal,submitPassword,closeAdmin,switchAdminPanel,
    filterAppointments,updateBooking,deleteBooking,exportToWhatsApp };
  Object.assign(window, fns);
}
