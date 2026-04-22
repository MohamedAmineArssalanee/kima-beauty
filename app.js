/* ============================================================
   KIMA Beauty Lounge — App Logic v2.0
   ============================================================ */

'use strict';

/* ── State ── */
const App = {
  lang: localStorage.getItem('kima_lang') || 'ar',
  theme: localStorage.getItem('kima_theme') || 'dark',
  data: null,
  currentView: 'main', // 'main' | 'packs' | 'admin'
  selectedService: null,
  selectedSlot: null,
  selectedDate: null,
  copyClickCount: 0,
  copyClickTimer: null,
  adminAuthenticated: false,
};

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  applyTheme(App.theme);
  applyLang(App.lang);
  renderAll();
  initScrollBehaviors();
  initNavbar();
  initAdminTrigger();
});

/* ── Load JSON Data ── */
async function loadData() {
  try {
    const res = await fetch('data.json');
    App.data = await res.json();
  } catch {
    // Fallback: data should be bundled
    console.error('Could not load data.json');
    App.data = { meta: {}, translations: { ar: {}, fr: {} }, services: [], packs: [], testimonials: [] };
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

function toggleTheme() {
  applyTheme(App.theme === 'dark' ? 'light' : 'dark');
}

/* ── Language ── */
function applyLang(lang) {
  App.lang = lang;
  localStorage.setItem('kima_lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  const btn = document.getElementById('btn-lang');
  if (btn) btn.textContent = lang === 'ar' ? 'FR' : 'AR';
}

function toggleLang() {
  applyLang(App.lang === 'ar' ? 'fr' : 'ar');
  renderAll();
}

function t(key) {
  return (App.data?.translations?.[App.lang]?.[key]) || key;
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

/* ── LOGO SVG ── */
function kimaLogo(size = 48) {
  const scale = size / 180;
  return `<svg viewBox="0 0 180 220" width="${size}" height="${Math.round(220 * scale)}" xmlns="http://www.w3.org/2000/svg">
    <!-- Circle background -->
    <circle cx="90" cy="90" r="86" fill="white" stroke="#c9a84c" stroke-width="2.5"/>
    <!-- Feminine profile silhouette -->
    <g fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <!-- Head outline -->
      <path d="M75 38 C65 38 55 46 53 58 C51 68 53 76 58 82 C60 85 60 89 58 93 C55 98 50 102 52 108 C54 112 60 113 66 112"/>
      <!-- Neck -->
      <path d="M66 112 C68 118 70 122 72 126"/>
      <!-- Chin & jaw -->
      <path d="M58 82 C62 88 68 92 72 92 C76 92 82 90 86 86"/>
      <!-- Nose -->
      <path d="M58 70 C57 72 57 75 59 77"/>
      <!-- Lips -->
      <path d="M62 85 C65 87 68 87 70 85"/>
      <!-- Eye area -->
      <path d="M58 62 C61 60 65 60 67 62"/>
      <!-- Hair flowing back -->
      <path d="M75 38 C82 32 92 30 100 32 C110 35 116 42 118 50 C120 58 118 66 114 72"/>
      <!-- Hair bun -->
      <path d="M100 32 C106 28 114 26 120 30 C128 35 130 44 126 52 C124 58 118 62 114 66 C110 70 108 76 110 82"/>
      <path d="M114 56 C120 54 126 56 128 62 C130 68 126 74 120 76 C116 78 112 76 110 72"/>
      <!-- Flowing strands -->
      <path d="M110 72 C116 80 118 90 114 98 C112 104 108 108 106 112"/>
      <path d="M118 68 C124 76 126 86 124 96 C122 104 118 110 114 116"/>
      <path d="M122 74 C130 84 132 96 128 108"/>
      <!-- Shoulder hint -->
      <path d="M72 126 C74 132 78 136 86 138 C92 140 98 138 104 134 C108 130 112 124 114 116"/>
    </g>
    <!-- KIMA text -->
    <text x="90" y="168" font-family="'Playfair Display', Georgia, serif" font-size="42" font-weight="900" text-anchor="middle" fill="#1a1209" letter-spacing="3">KIMA</text>
    <!-- Beauty Lounge script -->
    <text x="90" y="188" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" font-weight="400" font-style="italic" text-anchor="middle" fill="#c9a84c" letter-spacing="1.5">Beauty Lounge</text>
  </svg>`;
}

/* ── NAVBAR ── */
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const isAr = App.lang === 'ar';
  nav.innerHTML = `
    <div class="nav-logo kima-logo sm">${kimaLogo(44)}</div>
    <ul class="nav-links">
      <li><a href="#hero" class="active" onclick="scrollToSection('hero')">${t('home')}</a></li>
      <li><a href="#services" onclick="scrollToSection('services')">${t('services')}</a></li>
      <li><a href="#packs" onclick="scrollToSection('packs')">${t('packs')}</a></li>
      <li><a href="#booking" onclick="scrollToSection('booking')">${t('booking')}</a></li>
      <li><a href="#contact" onclick="scrollToSection('contact')">${t('contact')}</a></li>
    </ul>
    <div class="nav-controls">
      <button class="btn-theme" id="btn-theme" onclick="toggleTheme()" aria-label="Toggle theme">${App.theme === 'dark' ? '☀️' : '🌙'}</button>
      <button class="btn-lang" id="btn-lang" onclick="toggleLang()">${isAr ? 'FR' : 'AR'}</button>
      <button class="btn-book-nav" onclick="scrollToSection('booking')">${t('bookNow')}</button>
      <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMobileNav()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
}

function toggleMobileNav() {
  const overlay = document.getElementById('nav-overlay');
  const burger = document.getElementById('nav-hamburger');
  if (!overlay) return;
  overlay.classList.toggle('open');
  burger.classList.toggle('open');
}

function closeMobileNav() {
  const overlay = document.getElementById('nav-overlay');
  const burger = document.getElementById('nav-hamburger');
  if (overlay) overlay.classList.remove('open');
  if (burger) burger.classList.remove('open');
}

function scrollToSection(id) {
  closeMobileNav();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (sel) {
      sel.value = serviceId;
      sel.dispatchEvent(new Event('change'));
    }
  }, 600);
}

/* ── BOOKING ── */
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
            <blockquote>${isAr ? '"كل امرأة تستحق لحظة من الرفاهية والجمال الحقيقي"' : '"Chaque femme mérite un moment de luxe et de beauté authentique"'}</blockquote>
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
            <input class="form-input" type="tel" id="form-phone" placeholder="${isAr ? '06XXXXXXXX' : '06XXXXXXXX'}" required/>
          </div>
          <div class="form-group">
            <label class="form-label" for="form-service">${t('selectService')}</label>
            <select class="form-select" id="form-service">
              <option value="">${isAr ? '— اختيار الخدمة —' : '— Choisir un service —'}</option>
              ${App.data.services.map(s => `<option value="${s.id}">${isAr ? s.nameAr : s.nameFr} (${isAr ? s.priceLabel : s.priceLabelFr})</option>`).join('')}
              <option value="pack-glow">${isAr ? 'باقة Glow ✨' : 'Pack Glow ✨'}</option>
              <option value="pack-bride">${isAr ? 'باقة العروس 👰' : 'Pack Mariée 👰'}</option>
              <option value="pack-hammam">${isAr ? 'باقة الاسترخاء 🛁' : 'Pack Détente 🛁'}</option>
              <option value="pack-monthly">${isAr ? 'الاشتراك الشهري 👑' : 'Abonnement Mensuel 👑'}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="form-date">${t('selectDate')}</label>
            <input class="form-input" type="date" id="form-date" onchange="renderSlots()"/>
          </div>
          <div class="form-group">
            <label class="form-label">${t('selectTime')}</label>
            <div class="slots-grid" id="slots-grid">
              <div style="color:var(--text-secondary);font-size:0.85rem;grid-column:1/-1;padding:0.5rem;">${isAr ? 'اختاري التاريخ أولاً' : 'Choisissez d\'abord la date'}</div>
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

  // Set date min/max
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    const today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
    dateInput.addEventListener('change', () => {
      // Check if Sunday
      const d = new Date(dateInput.value);
      if (d.getDay() === 0) {
        alert(App.lang === 'ar' ? 'الأحد: الصالون مغلق' : 'Dimanche: Salon fermé');
        dateInput.value = '';
        return;
      }
    });
  }

  if (App.selectedService) {
    const sel = document.getElementById('form-service');
    if (sel) sel.value = App.selectedService;
  }

  initRevealObserver();
}

/* ── TIME SLOTS ── */
function generateSlots() {
  const slots = [];
  for (let h = 10; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 20 && m > 30) break;
      const hStr = String(h).padStart(2, '0');
      const mStr = String(m).padStart(2, '0');
      slots.push(`${hStr}:${mStr}`);
    }
  }
  return slots; // 22 slots
}

function isSlotTaken(date, time) {
  const bookings = JSON.parse(localStorage.getItem('kima_v2') || '[]');
  return bookings.some(b => b.date === date && b.time === time && b.status !== 'cancelled');
}

function renderSlots() {
  const dateInput = document.getElementById('form-date');
  const grid = document.getElementById('slots-grid');
  if (!grid || !dateInput) return;

  const date = dateInput.value;
  if (!date) return;

  const d = new Date(date);
  if (d.getDay() === 0) {
    grid.innerHTML = `<div style="color:var(--danger);grid-column:1/-1;padding:0.5rem;">${App.lang === 'ar' ? '🚫 الأحد: مغلق' : '🚫 Dimanche: Fermé'}</div>`;
    return;
  }

  const slots = generateSlots();
  const takenSlots = slots.filter(s => isSlotTaken(date, s));
  const availableSlots = slots.filter(s => !isSlotTaken(date, s));
  const lastTwo = availableSlots.slice(-2);

  App.selectedSlot = null;

  grid.innerHTML = slots.map(slot => {
    const taken = takenSlots.includes(slot);
    const isLast = !taken && lastTwo.includes(slot);
    let cls = taken ? 'booked' : (isLast ? 'last-slot' : 'available');
    let extra = taken ? '' : `onclick="selectSlot('${slot}', this)"`;
    let label = slot;
    if (isLast) label += ` 🔥`;
    return `<button class="slot-pill ${cls}" ${taken ? 'disabled' : ''} ${extra} data-slot="${slot}">${label}</button>`;
  }).join('');
}

function selectSlot(slot, el) {
  App.selectedSlot = slot;
  document.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
}

/* ── BOOKING SUBMIT ── */
function saveBooking(booking) {
  const bookings = JSON.parse(localStorage.getItem('kima_v2') || '[]');
  booking.id = `KIMA-${Date.now()}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
  booking.status = 'confirmed';
  booking.createdAt = new Date().toISOString();
  bookings.push(booking);
  localStorage.setItem('kima_v2', JSON.stringify(bookings));
  return booking;
}

function getServiceName(serviceVal) {
  const isAr = App.lang === 'ar';
  const s = App.data.services.find(s => String(s.id) === String(serviceVal));
  if (s) return isAr ? s.nameAr : s.nameFr;
  const p = App.data.packs.find(p => `pack-${p.id}` === serviceVal);
  if (p) return isAr ? p.nameAr : p.nameFr;
  return serviceVal;
}

async function submitBooking() {
  const name = document.getElementById('form-name')?.value?.trim();
  const phone = document.getElementById('form-phone')?.value?.trim();
  const service = document.getElementById('form-service')?.value;
  const date = document.getElementById('form-date')?.value;
  const slot = App.selectedSlot;

  const isAr = App.lang === 'ar';

  if (!name || !phone || !service || !date || !slot) {
    alert(isAr ? 'يرجى ملء جميع الحقول واختيار موعد' : 'Veuillez remplir tous les champs et choisir un créneau');
    return;
  }

  if (isSlotTaken(date, slot)) {
    alert(isAr ? 'هذا الموعد محجوز. اختاري موعداً آخر.' : 'Ce créneau est déjà réservé. Choisissez-en un autre.');
    renderSlots();
    return;
  }

  const btn = document.getElementById('btn-confirm');
  btn.classList.add('loading');
  btn.disabled = true;

  // Simulate slight delay
  await new Promise(r => setTimeout(r, 900));

  const booking = saveBooking({ name, phone, service, date, time: slot, lang: App.lang });

  btn.classList.remove('loading');
  btn.disabled = false;

  showConfirmationModal(booking);
  renderSlots();
}

/* ── CONFIRMATION MODAL ── */
function showConfirmationModal(booking) {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const isAr = App.lang === 'ar';
  const serviceName = getServiceName(booking.service);

  const dateObj = new Date(booking.date);
  const dateFormatted = dateObj.toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const waMsg = encodeURIComponent(
    isAr
      ? `مرحباً KIMA Beauty Lounge 💛\n\nلدي حجز مؤكد:\n📋 الرقم: ${booking.id}\n👤 الاسم: ${booking.name}\n📞 الهاتف: ${booking.phone}\n✂️ الخدمة: ${serviceName}\n📅 التاريخ: ${booking.date}\n⏰ الوقت: ${booking.time}`
      : `Bonjour KIMA Beauty Lounge 💛\n\nJ'ai une réservation confirmée:\n📋 N°: ${booking.id}\n👤 Nom: ${booking.name}\n📞 Tél: ${booking.phone}\n✂️ Service: ${serviceName}\n📅 Date: ${booking.date}\n⏰ Heure: ${booking.time}`
  );

  document.getElementById('modal-inner').innerHTML = `
    <div class="modal-watermark"><div class="kima-logo" style="width:300px;">${kimaLogo(300)}</div></div>
    <button class="modal-close" onclick="closeModal()">&times;</button>
    <svg class="check-circle" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="34"/>
      <path d="M20 36 L30 46 L52 24"/>
    </svg>
    <div class="modal-title">${t('bookingConfirmed')}</div>
    <div class="booking-card">
      <div class="booking-card-row"><span class="lbl">${isAr ? 'رقم الحجز' : 'N° Réservation'}</span><span class="val booking-id">${booking.id}</span></div>
      <div class="booking-card-row"><span class="lbl">${t('name')}</span><span class="val">${booking.name}</span></div>
      <div class="booking-card-row"><span class="lbl">${t('service')}</span><span class="val">${serviceName}</span></div>
      <div class="booking-card-row"><span class="lbl">${t('date')}</span><span class="val">${dateFormatted}</span></div>
      <div class="booking-card-row"><span class="lbl">${t('time')}</span><span class="val">🕐 ${booking.time}</span></div>
      <div class="booking-card-row"><span class="lbl">${isAr ? 'العنوان' : 'Adresse'}</span><span class="val" style="font-size:0.82rem;">${isAr ? App.data.meta.addressAr : App.data.meta.addressFr}</span></div>
    </div>
    <div id="qr-container"></div>
    <div class="modal-actions">
      <button class="btn-wa" onclick="window.open('${App.data.meta.whatsapp}?text=${waMsg}','_blank')">
        <span>💬</span> ${t('shareWhatsApp')}
      </button>
      <button class="btn-dl" onclick="downloadQR()">⬇ ${t('downloadQR')}</button>
    </div>
  `;

  modal.classList.add('open');

  // Generate QR
  setTimeout(() => {
    const qrContainer = document.getElementById('qr-container');
    if (qrContainer && typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: `KIMA|${booking.id}|${booking.name}|${booking.service}|${booking.date}|${booking.time}`,
        width: 160,
        height: 160,
        colorDark: '#c9a84c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }, 300);
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.remove('open');
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
  if (!section || !App.data.testimonials) return;
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
          </div>
        `).join('')}
      </div>
    </div>
  `;
  initRevealObserver();
}

/* ── PACKS ── */
function renderPacks() {
  const section = document.getElementById('packs');
  if (!section || !App.data.packs) return;
  const isAr = App.lang === 'ar';

  const faqItems = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
  ];

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">${t('ourPacks')}</h2>
        <div class="gold-divider"></div>
      </div>
      <div class="packs-grid">
        ${App.data.packs.map(p => `
          <div class="pack-card ${p.featured ? 'featured' : ''} reveal">
            ${p.featured ? `<div class="featured-ribbon">⭐ ${isAr ? p.tagAr : p.tagFr} ⭐</div>` : ''}
            <div class="pack-image-wrap">
              <img src="${p.image}" alt="${isAr ? p.nameAr : p.nameFr}" loading="lazy"/>
              ${!p.featured ? `<div class="pack-tag-badge">${isAr ? p.tagAr : p.tagFr}</div>` : ''}
            </div>
            <div class="pack-body">
              <div class="pack-name">${isAr ? p.nameAr : p.nameFr}</div>
              <div class="pack-pricing">
                <span class="pack-price">${isAr ? p.priceLabel : p.priceLabelFr}</span>
                <span class="pack-original">${isAr ? p.originalPriceLabel : p.originalPrice + ' MAD'}</span>
                <span class="pack-savings">${isAr ? p.savingsAr : p.savingsFr}</span>
              </div>
              <ul class="pack-services">
                ${(isAr ? p.servicesAr : p.servicesFr).map(s => `<li>${s}</li>`).join('')}
              </ul>
              <div class="pack-duration">${isAr ? p.durationAr : p.durationFr}</div>
              <div class="pack-ctas">
                <button class="btn-pack-book" onclick="bookPack('${p.id}')">${t('bookPack')}</button>
                <a class="btn-pack-wa" href="${App.data.meta.whatsapp}" target="_blank">💬 ${t('contactUs')}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <!-- FAQ -->
      <div class="faq-section reveal">
        ${faqItems.map((f, i) => `
          <div class="faq-item" id="faq-${i}">
            <button class="faq-q" onclick="toggleFaq(${i})">
              <span>${f.q}</span>
              <span class="arrow">▼</span>
            </button>
            <div class="faq-a"><p>${f.a}</p></div>
          </div>
        `).join('')}
      </div>
      <div class="custom-pack-banner reveal">
        ${t('customPack')} <a href="${App.data.meta.whatsapp}" target="_blank">💬 WhatsApp</a>
      </div>
    </div>
  `;
  initRevealObserver();
}

function bookPack(packId) {
  App.selectedService = `pack-${packId}`;
  scrollToSection('booking');
  setTimeout(() => {
    const sel = document.getElementById('form-service');
    if (sel) sel.value = `pack-${packId}`;
  }, 600);
}

function toggleFaq(idx) {
  const item = document.getElementById(`faq-${idx}`);
  if (item) item.classList.toggle('open');
}

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
          <div class="contact-item"><span class="contact-icon">📍</span><span>${isAr ? m.addressAr : m.addressFr}</span></div>
          <div class="contact-item"><span class="contact-icon">📞</span><a href="tel:${m.phone}">${m.phone}</a></div>
          <div class="contact-item"><span class="contact-icon">⏰</span><span>${isAr ? m.hoursAr : m.hoursFr}<br/>${isAr ? m.closedAr : m.closedFr}</span></div>
          <div class="contact-item"><span class="contact-icon">💬</span><a href="${m.whatsapp}" target="_blank">WhatsApp</a></div>
          <div style="margin-top:1.5rem;">
            <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.75rem;letter-spacing:0.04em;">${t('followUs')}</div>
            <div class="social-links">
              <a class="social-btn" href="${m.instagram}" target="_blank">📸 ${m.instagramHandle}</a>
              <a class="social-btn" href="${m.tiktok}" target="_blank">🎵 ${m.tiktokHandle}</a>
            </div>
          </div>
        </div>
        <div class="map-placeholder reveal">
          <p>${isAr ? m.addressAr : m.addressFr}</p>
          <a class="social-btn" href="https://maps.google.com?q=Hay+Moulay+Abdellah+Casablanca" target="_blank">🗺 ${isAr ? 'فتح الخريطة' : 'Ouvrir la carte'}</a>
        </div>
      </div>
    </div>
  `;
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
        <span class="copy-trigger" onclick="handleCopyClick()">©</span> 2025 KIMA Beauty Lounge — ${t('rights')}
      </div>
      <div>
        <a href="${App.data.meta.instagram}" target="_blank" style="margin:0 0.5rem;font-size:0.85rem;color:var(--text-secondary);">📸</a>
        <a href="${App.data.meta.tiktok}" target="_blank" style="margin:0 0.5rem;font-size:0.85rem;color:var(--text-secondary);">🎵</a>
        <a href="${App.data.meta.whatsapp}" target="_blank" style="margin:0 0.5rem;font-size:0.85rem;color:var(--text-secondary);">💬</a>
      </div>
    </div>
  `;
}

/* ── ADMIN TRIGGER (5x click © ) ── */
function handleCopyClick() {
  App.copyClickCount++;
  clearTimeout(App.copyClickTimer);
  App.copyClickTimer = setTimeout(() => { App.copyClickCount = 0; }, 2000);
  if (App.copyClickCount >= 5) {
    App.copyClickCount = 0;
    openPasswordModal();
  }
}

function openPasswordModal() {
  const modal = document.getElementById('pw-modal');
  if (modal) {
    modal.classList.add('open');
    document.getElementById('pw-input')?.focus();
    document.getElementById('pw-error').textContent = '';
    document.getElementById('pw-input').value = '';
  }
}

function closePasswordModal() {
  const modal = document.getElementById('pw-modal');
  if (modal) modal.classList.remove('open');
}

function submitPassword() {
  const val = document.getElementById('pw-input')?.value;
  if (val === App.data.meta.adminPassword) {
    closePasswordModal();
    openAdmin();
  } else {
    document.getElementById('pw-error').textContent = App.lang === 'ar' ? '❌ كلمة المرور خاطئة' : '❌ Mot de passe incorrect';
  }
}

/* ── ADMIN ── */
function openAdmin() {
  App.adminAuthenticated = true;
  const screen = document.getElementById('admin-screen');
  if (screen) {
    screen.classList.add('active');
    renderAdminSidebar();
    switchAdminPanel('overview');
  }
}

function closeAdmin() {
  const screen = document.getElementById('admin-screen');
  if (screen) screen.classList.remove('active');
  App.adminAuthenticated = false;
}

function renderAdminSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  if (!sidebar) return;
  const isAr = App.lang === 'ar';

  const panels = [
    { id: 'overview', icon: '📊', label: t('overview') },
    { id: 'appointments', icon: '📅', label: t('appointments') },
    { id: 'analytics', icon: '📈', label: t('analytics') },
  ];

  sidebar.innerHTML = `
    <div class="admin-logo">
      <div class="kima-logo sm">${kimaLogo(36)}</div>
      <div class="admin-logo-text">Admin</div>
    </div>
    <ul class="admin-nav">
      ${panels.map(p => `
        <li><button class="admin-nav-btn" id="nav-${p.id}" onclick="switchAdminPanel('${p.id}')">
          ${p.icon} ${p.label}
        </button></li>
      `).join('')}
    </ul>
    <button class="admin-logout" onclick="closeAdmin()">↩ ${t('logout')}</button>
  `;
}

function switchAdminPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(`panel-${id}`);
  const navBtn = document.getElementById(`nav-${id}`);
  if (panel) {
    panel.classList.add('active');
    renderAdminPanel(id);
  }
  if (navBtn) navBtn.classList.add('active');
}

function getBookings() {
  return JSON.parse(localStorage.getItem('kima_v2') || '[]');
}

function renderAdminPanel(id) {
  const bookings = getBookings();
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date(); thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date(); thisMonth.setDate(thisMonth.getDate() - 30);

  const todayB = bookings.filter(b => b.date === today);
  const weekB = bookings.filter(b => new Date(b.date) >= thisWeek);
  const monthB = bookings.filter(b => new Date(b.date) >= thisMonth);

  // Top service
  const svcCount = {};
  bookings.forEach(b => { svcCount[b.service] = (svcCount[b.service] || 0) + 1; });
  const topSvc = Object.entries(svcCount).sort((a,b) => b[1]-a[1])[0];
  const topSvcName = topSvc ? getServiceName(topSvc[0]) : '—';

  if (id === 'overview') {
    document.getElementById('panel-overview').innerHTML = `
      <div class="admin-panel-title">📊 ${t('overview')}</div>
      <div class="overview-cards">
        <div class="ov-card"><div class="ov-card-label">${t('todayBookings')}</div><div class="ov-card-value">${todayB.length}</div></div>
        <div class="ov-card"><div class="ov-card-label">${t('weekBookings')}</div><div class="ov-card-value">${weekB.length}</div></div>
        <div class="ov-card"><div class="ov-card-label">${t('monthBookings')}</div><div class="ov-card-value">${monthB.length}</div></div>
        <div class="ov-card"><div class="ov-card-label">${t('topService')}</div><div class="ov-card-value" style="font-size:1rem;padding-top:0.25rem;">${topSvcName}</div></div>
      </div>
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:1.5rem;">
        <div style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:1rem;">${App.lang === 'ar' ? 'آخر الحجوزات' : 'Dernières réservations'}</div>
        ${bookings.slice(-5).reverse().map(b => `
          <div style="display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid var(--border);font-size:0.85rem;">
            <span>${b.name}</span>
            <span style="color:var(--text-secondary);">${getServiceName(b.service)}</span>
            <span style="color:var(--gold);">${b.date} ${b.time}</span>
            ${statusBadge(b.status)}
          </div>
        `).join('') || '<div style="color:var(--text-secondary);font-size:0.9rem;">لا توجد حجوزات بعد</div>'}
      </div>
    `;
  }

  if (id === 'appointments') {
    renderAppointmentsPanel(bookings);
  }

  if (id === 'analytics') {
    renderAnalyticsPanel(bookings);
  }
}

function statusBadge(status) {
  const map = { confirmed: t('confirmed'), pending: t('pending'), completed: t('completed'), cancelled: t('cancelled') };
  return `<span class="status-badge ${status}">${map[status] || status}</span>`;
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
        <option value="">${App.lang === 'ar' ? 'كل الحالات' : 'Tous les statuts'}</option>
        <option value="confirmed">${t('confirmed')}</option>
        <option value="pending">${t('pending')}</option>
        <option value="completed">${t('completed')}</option>
        <option value="cancelled">${t('cancelled')}</option>
      </select>
      <button class="action-btn" onclick="exportToWhatsApp()" style="border-color:var(--green-wa);color:var(--green-wa);">💬 ${t('exportWA')}</button>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table" id="appointments-table">
        <thead>
          <tr>
            <th>#</th>
            <th>${t('name')}</th>
            <th>${App.lang === 'ar' ? 'الهاتف' : 'Tél'}</th>
            <th>${t('service')}</th>
            <th>${t('date')}</th>
            <th>${t('time')}</th>
            <th>${t('status')}</th>
            <th>${t('actions')}</th>
          </tr>
        </thead>
        <tbody id="appointments-tbody"></tbody>
      </table>
    </div>
  `;

  renderAppointmentsTable(bookings);
}

function renderAppointmentsTable(bookings) {
  const tbody = document.getElementById('appointments-tbody');
  if (!tbody) return;

  tbody.innerHTML = bookings.length ? bookings.slice().reverse().map((b, i) => `
    <tr id="row-${b.id}">
      <td style="color:var(--text-secondary);font-size:0.78rem;">${bookings.length - i}</td>
      <td><strong>${b.name}</strong></td>
      <td><a href="tel:${b.phone}" style="color:var(--gold);">${b.phone}</a></td>
      <td style="font-size:0.85rem;">${getServiceName(b.service)}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
      <td>${statusBadge(b.status)}</td>
      <td style="white-space:nowrap;">
        ${b.status !== 'completed' ? `<button class="action-btn" onclick="updateBooking('${b.id}','completed')" title="${t('completed')}">✔</button>` : ''}
        ${b.status !== 'cancelled' ? `<button class="action-btn" onclick="updateBooking('${b.id}','cancelled')" title="${t('cancelled')}">✕</button>` : ''}
        <button class="action-btn del" onclick="deleteBooking('${b.id}')" title="Delete">🗑</button>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--text-secondary);padding:2rem;">${App.lang === 'ar' ? 'لا توجد حجوزات' : 'Aucune réservation'}</td></tr>`;
}

function filterAppointments() {
  let bookings = getBookings();
  const search = document.getElementById('filter-search')?.value?.toLowerCase();
  const date = document.getElementById('filter-date')?.value;
  const status = document.getElementById('filter-status')?.value;

  if (search) bookings = bookings.filter(b => b.name.toLowerCase().includes(search) || b.phone.includes(search));
  if (date) bookings = bookings.filter(b => b.date === date);
  if (status) bookings = bookings.filter(b => b.status === status);

  renderAppointmentsTable(bookings);
}

function updateBooking(id, status) {
  const bookings = getBookings();
  const b = bookings.find(b => b.id === id);
  if (b) {
    b.status = status;
    localStorage.setItem('kima_v2', JSON.stringify(bookings));
    renderAppointmentsPanel(bookings);
  }
}

function deleteBooking(id) {
  if (!confirm(App.lang === 'ar' ? 'حذف الحجز؟' : 'Supprimer la réservation?')) return;
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem('kima_v2', JSON.stringify(bookings));
  renderAppointmentsPanel(bookings);
}

function exportToWhatsApp() {
  const bookings = getBookings().filter(b => b.status !== 'cancelled');
  if (!bookings.length) return;
  const isAr = App.lang === 'ar';
  const text = bookings.map(b =>
    isAr
      ? `📋 ${b.id}\n👤 ${b.name} | 📞 ${b.phone}\n✂️ ${getServiceName(b.service)}\n📅 ${b.date} ${b.time}\n✅ ${b.status}`
      : `📋 ${b.id}\n👤 ${b.name} | 📞 ${b.phone}\n✂️ ${getServiceName(b.service)}\n📅 ${b.date} ${b.time}\n✅ ${b.status}`
  ).join('\n\n---\n\n');
  window.open(`${App.data.meta.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
}

function renderAnalyticsPanel(bookings) {
  const panel = document.getElementById('panel-analytics');
  if (!panel) return;

  const isAr = App.lang === 'ar';
  const days = isAr
    ? ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const dayCounts = [0,1,2,3,4,5].map(d => {
    return bookings.filter(b => {
      const day = new Date(b.date).getDay();
      const mapped = [1,2,3,4,5,6][d];
      return day === mapped;
    }).length;
  });

  const maxDay = Math.max(...dayCounts, 1);

  // Service popularity
  const svcCount = {};
  bookings.forEach(b => { svcCount[b.service] = (svcCount[b.service] || 0) + 1; });
  const topServices = Object.entries(svcCount).sort((a,b) => b[1]-a[1]).slice(0, 5);
  const maxSvc = Math.max(...topServices.map(s => s[1]), 1);

  // Revenue estimation
  const totalRev = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((acc, b) => {
      const s = App.data.services.find(s => String(s.id) === String(b.service));
      return acc + (s ? parseInt(s.price) : 100);
    }, 0);

  panel.innerHTML = `
    <div class="admin-panel-title">📈 ${t('analytics')}</div>
    <div class="analytics-section">
      <div class="chart-card">
        <div class="chart-title">${t('weeklyChart')}</div>
        ${days.map((d, i) => `
          <div class="bar-row">
            <div class="bar-label">${d}</div>
            <div class="bar-track"><div class="bar-fill" data-width="${Math.round(dayCounts[i]/maxDay*100)}" style="width:0"></div></div>
            <div class="bar-val">${dayCounts[i]}</div>
          </div>
        `).join('')}
      </div>
      <div class="chart-card">
        <div class="chart-title">${t('popularServices')}</div>
        ${topServices.map(([svc, count]) => `
          <div class="bar-row">
            <div class="bar-label" style="width:90px;font-size:0.72rem;">${getServiceName(svc).substring(0,12)}</div>
            <div class="bar-track"><div class="bar-fill" data-width="${Math.round(count/maxSvc*100)}" style="width:0"></div></div>
            <div class="bar-val">${count}</div>
          </div>
        `).join('') || `<div style="color:var(--text-secondary);font-size:0.88rem;">${isAr ? 'لا بيانات' : 'Pas de données'}</div>`}
        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);">
          <div class="chart-title" style="margin-bottom:0.5rem;">${t('revenueEst')}</div>
          <div style="font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:var(--gold);">${totalRev.toLocaleString()} <span style="font-size:1rem;">${t('currency')}</span></div>
        </div>
      </div>
    </div>
  `;

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = (bar.dataset.width || 0) + '%';
    });
  }, 100);
}

/* ── Scroll behaviors ── */
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

function initScrollBehaviors() {
  initRevealObserver();
  window.addEventListener('scroll', () => {
    const sections = ['hero', 'services', 'packs', 'booking', 'testimonials', 'contact'];
    const scrollY = window.scrollY;
    sections.forEach(id => {
      const el = document.getElementById(id);
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (el && link) {
        const top = el.offsetTop - 100;
        const bottom = top + el.offsetHeight;
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  });

  // Password input enter key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('pw-modal')?.classList.contains('open')) {
      submitPassword();
    }
  });

  // Close modal on overlay click
  document.getElementById('booking-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

function initAdminTrigger() {
  // Expose global functions for HTML onclick
  window.toggleTheme = toggleTheme;
  window.toggleLang = toggleLang;
  window.toggleMobileNav = toggleMobileNav;
  window.closeMobileNav = closeMobileNav;
  window.scrollToSection = scrollToSection;
  window.selectServiceAndBook = selectServiceAndBook;
  window.renderSlots = renderSlots;
  window.selectSlot = selectSlot;
  window.submitBooking = submitBooking;
  window.closeModal = closeModal;
  window.downloadQR = downloadQR;
  window.bookPack = bookPack;
  window.toggleFaq = toggleFaq;
  window.handleCopyClick = handleCopyClick;
  window.openPasswordModal = openPasswordModal;
  window.closePasswordModal = closePasswordModal;
  window.submitPassword = submitPassword;
  window.closeAdmin = closeAdmin;
  window.switchAdminPanel = switchAdminPanel;
  window.filterAppointments = filterAppointments;
  window.updateBooking = updateBooking;
  window.deleteBooking = deleteBooking;
  window.exportToWhatsApp = exportToWhatsApp;
}
