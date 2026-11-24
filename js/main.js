/* ==========================================================================
   ÉLAN BEAUTY STUDIO - MASTER JAVASCRIPT
   Infinity Smart India - Industry Demo 003: Beauty & Personal Care
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initAppointmentModal();
  initActiveNav();
});

// Toast Notifications
function triggerToast(message) {
  let toast = document.getElementById('toastAlert');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastAlert';
    toast.className = 'toast-alert';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-gold);"></i> <span id="toastMessage">${message}</span>`;
    document.body.appendChild(toast);
  } else {
    document.getElementById('toastMessage').textContent = message;
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3400);
}

// Drawer Controls (Supporting Click & Touchstart per history.md)
function initDrawer() {
  const navDrawer = document.getElementById('navDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const openMenuDrawer = document.getElementById('openMenuDrawer');
  const closeMenuDrawer = document.getElementById('closeMenuDrawer');

  function openDrawer(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (navDrawer && drawerBackdrop) {
      navDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (navDrawer && drawerBackdrop) {
      navDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openMenuDrawer) {
    ['click', 'touchstart'].forEach(evt => openMenuDrawer.addEventListener(evt, openDrawer, { passive: false }));
  }
  if (closeMenuDrawer) {
    ['click', 'touchstart'].forEach(evt => closeMenuDrawer.addEventListener(evt, closeDrawer, { passive: false }));
  }
  if (drawerBackdrop) {
    ['click', 'touchstart'].forEach(evt => drawerBackdrop.addEventListener(evt, closeDrawer, { passive: false }));
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      const modalBackdrop = document.getElementById('appointmentModalBackdrop');
      if (modalBackdrop) modalBackdrop.classList.remove('active');
    }
  });

  // Close drawer when any internal link is tapped
  document.querySelectorAll('.drawer-nav-item').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });
}

// Global Appointment Modal (Connected to Supabase)
function initAppointmentModal() {
  const modalBackdrop = document.getElementById('appointmentModalBackdrop');
  const closeBtn = document.getElementById('closeAppointmentModalBtn');
  const triggers = document.querySelectorAll('.open-appointment-modal');
  const form = document.getElementById('globalAppointmentForm');
  const confirmationView = document.getElementById('modalConfirmationView');
  const formView = document.getElementById('modalFormView');
  const doneBtn = document.getElementById('modalDoneBtn');

  // Set min date to today
  const dateInput = document.getElementById('aptDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  function openModal(prefillService = '') {
    if (modalBackdrop) {
      if (prefillService && document.getElementById('aptService')) {
        document.getElementById('aptService').value = prefillService;
      }
      if (formView) formView.style.display = 'block';
      if (confirmationView) confirmationView.style.display = 'none';
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('aptName').value;
      const phone = document.getElementById('aptPhone').value;
      const service = document.getElementById('aptService').value;
      const date = document.getElementById('aptDate').value;
      const time = document.getElementById('aptTime').value;

      // Submit to Supabase Live Backend per history.md
      if (window.submitBeautyAppointment) {
        window.submitBeautyAppointment({
          client_name: name,
          client_phone: phone,
          service_category: 'Haute Beauté & Skincare',
          service_name: service,
          appointment_date: date,
          appointment_time: time
        }).then(res => {
          if (res?.refCode) {
            const refEl = document.getElementById('confRefCode');
            if (refEl) refEl.textContent = res.refCode;
          }
        });
      }

      const randomRef = '#ELAN-APT-2026-' + Math.floor(1000 + Math.random() * 9000);

      const clientNameEl = document.getElementById('confClientName');
      const refEl = document.getElementById('confRefCode');
      const detailsEl = document.getElementById('confDetails');
      const waBtn = document.getElementById('confWhatsAppBtn');

      if (clientNameEl) clientNameEl.textContent = name;
      if (refEl && !refEl.textContent.startsWith('ELAN-')) refEl.textContent = randomRef;
      if (detailsEl) detailsEl.textContent = `${service} on ${date} at ${time}`;

      const waMsg = `Hello ÉLAN Beauty Studio! I have submitted an appointment request.\nRef: ${randomRef}\nName: ${name} (${phone})\nService: ${service}\nRequested: ${date} at ${time}\nPlease confirm availability.`;
      if (waBtn) waBtn.href = `https://wa.me/919876543212?text=${encodeURIComponent(waMsg)}`;

      if (formView) formView.style.display = 'none';
      if (confirmationView) confirmationView.style.display = 'block';
      triggerToast('Appointment Request Saved to Supabase!');
      form.reset();
    });
  }
}

// Active Nav Highlighter
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.drawer-nav-item, .desktop-nav .nav-link');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPath || (currentPath === '003 Beauty and Personal Care.html' && href === 'index.html')) {
      item.classList.add('active');
    }
  });
}
