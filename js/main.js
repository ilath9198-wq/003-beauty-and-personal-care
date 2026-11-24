/**
 * ÉLAN BEAUTÉ ATELIER - CLIENT ENGINE
 * Inspired by NUMA Dribbble Reference (#26198483)
 * Handles: Category Accordion, In-Card Volume Selectors, Live Cart Drawer,
 * Subscribe & Save 15% Tier Switcher, Supabase Appointments, and Scroll Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initMobileNavDrawer();
  initCategoryAccordion();
  initProductVolumeToggles();
  initCartSystem();
  initTierSwitcher();
  initAppointmentModal();
});

/* ==========================================================================
   1. SILKY SMOOTH SCROLL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* Header elevation on scroll */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   2. MOBILE OFF-CANVAS NAVIGATION DRAWER (history.md Compliant)
   ========================================================================== */
function initMobileNavDrawer() {
  const openBtn = document.getElementById('openMenuDrawer');
  const closeBtn = document.getElementById('closeMenuDrawer');
  const navDrawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('drawerBackdrop');

  if (!navDrawer || !backdrop) return;

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    navDrawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    navDrawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Touch and click symmetry
  if (openBtn) {
    openBtn.addEventListener('click', openDrawer);
    openBtn.addEventListener('touchstart', openDrawer, { passive: true });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('touchstart', closeDrawer, { passive: true });
  }

  backdrop.addEventListener('click', closeDrawer);

  // Close when clicking any nav link inside drawer
  const drawerLinks = navDrawer.querySelectorAll('.drawer-nav-item');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. DISCOVER BY CATEGORY ACCORDION (NUMA Flagship Component)
   ========================================================================== */
const CATEGORY_PORTALS = {
  'cat-1': {
    title: 'Facial Elixirs & Cellular Serums',
    caption: 'Pure Botanical Concentrates',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Targeted bio-actives that repair the cellular skin matrix, deliver deep lipid replenishment, and restore ethereal luminescence.'
  },
  'cat-2': {
    title: 'Botanical Hydrators & Barrier Balms',
    caption: 'Lipid Barrier Protection',
    image: 'https://images.unsplash.com/photo-1608248597359-0a56e2978bb9?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Cold-pressed floral waxes, multi-weight botanical hyaluronic acid, and biomimetic squalane for 72-hour moisture locking.'
  },
  'cat-3': {
    title: 'Clinical Aesthetics & Facials',
    caption: 'Atelier In-Studio Therapies',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Customized clinical micro-infusion, oxygen vortex facials, and lymphatic sculpting led by certified dermal therapists.'
  },
  'cat-4': {
    title: 'Haute Hair Artistry & Coiffure',
    caption: 'Kérastase & Botanical Care',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Bespoke Balayage, Japanese scalp head-spa, glossing rituals, and couture hair reconstruction by European-certified stylists.'
  },
  'cat-5': {
    title: 'Couture Bridal & Celebration',
    caption: 'The VIP Atelier Suite',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Flawless HD airbrush makeup, couture draping, and bespoke pre-bridal radiance packages in private suites.'
  }
};

function initCategoryAccordion() {
  const items = document.querySelectorAll('.category-accordion-item');
  const portalImg = document.getElementById('categoryPortalImg');
  const portalTitle = document.getElementById('categoryPortalTitle');
  const portalCaption = document.getElementById('categoryPortalCaption');

  if (!items.length || !portalImg) return;

  const setCategory = (catId, activeItem) => {
    const data = CATEGORY_PORTALS[catId];
    if (!data) return;

    items.forEach(it => it.classList.remove('active'));
    activeItem.classList.add('active');

    // Smooth image transition
    portalImg.style.opacity = '0';
    portalImg.style.transform = 'scale(1.04)';

    setTimeout(() => {
      portalImg.src = data.image;
      if (portalTitle) portalTitle.textContent = data.title;
      if (portalCaption) portalCaption.textContent = data.caption;
      portalImg.style.opacity = '1';
      portalImg.style.transform = 'scale(1)';
    }, 220);
  };

  items.forEach(item => {
    const catId = item.getAttribute('data-cat');
    item.addEventListener('mouseenter', () => setCategory(catId, item));
    item.addEventListener('click', () => setCategory(catId, item));
  });
}

/* ==========================================================================
   4. IN-CARD SEGMENTED VOLUME SELECTOR
   ========================================================================== */
function initProductVolumeToggles() {
  const cards = document.querySelectorAll('.product-numa-card');

  cards.forEach(card => {
    const volumePills = card.querySelectorAll('.volume-pill');
    const priceDisplay = card.querySelector('.product-price-val');

    volumePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        volumePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const vol = pill.getAttribute('data-volume');
        const price = pill.getAttribute('data-price');

        if (priceDisplay && price) {
          priceDisplay.textContent = price;
        }

        // Update card attributes for quick add
        card.setAttribute('data-selected-volume', vol);
        card.setAttribute('data-selected-price', price);
      });
    });
  });
}

/* ==========================================================================
   5. LIVE CART DRAWER SYSTEM
   ========================================================================== */
let cart = [];

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('elan_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('elan_cart', JSON.stringify(cart));
  } catch (e) {}
}

function initCartSystem() {
  loadCartFromStorage();

  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartDrawerBackdrop') || document.getElementById('drawerBackdrop');
  const closeCartBtn = document.getElementById('closeCartDrawer');
  const openCartBtns = document.querySelectorAll('.trigger-open-cart');

  const openCart = () => {
    if (!cartDrawer) return;
    renderCart();
    cartDrawer.classList.add('active');
    if (cartBackdrop) cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('active');
    if (cartBackdrop) cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  openCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', () => {
      if (cartDrawer && cartDrawer.classList.contains('active')) {
        closeCart();
      }
    });
  }

  // Quick Add buttons on product cards
  const quickAddBtns = document.querySelectorAll('.btn-quick-add');
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-numa-card');
      if (!card) return;

      const id = card.getAttribute('data-id') || 'item-' + Date.now();
      const name = card.getAttribute('data-name') || 'L\'Élixir Botanique';
      const volume = card.getAttribute('data-selected-volume') || '50ML';
      const priceNum = parseInt(card.getAttribute('data-selected-price') || '3400', 10);
      const image = card.querySelector('.product-thumb-box img')?.src || '';

      addToCart({
        id: `${id}-${volume}`,
        baseId: id,
        name,
        volume,
        price: priceNum,
        image,
        quantity: 1
      });

      openCart();
    });
  });

  // Checkout Button
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCartCheckout);
  }

  updateCartBadges();
}

function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push(item);
  }
  saveCartToStorage();
  updateCartBadges();
  renderCart();
}

function updateCartBadges() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.header-bag-count, .dock-bag-count');
  badges.forEach(b => {
    b.textContent = totalCount;
  });
}

function renderCart() {
  const itemsContainer = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const subtotalDisplay = document.getElementById('cartSubtotalDisplay');
  const totalDisplay = document.getElementById('cartTotalDisplay');
  const shippingFill = document.getElementById('shippingProgressFill');
  const shippingMsg = document.getElementById('shippingMessage');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (subtotalDisplay) subtotalDisplay.textContent = '₹0';
    if (totalDisplay) totalDisplay.textContent = '₹0';
    if (shippingFill) shippingFill.style.width = '0%';
    if (shippingMsg) shippingMsg.textContent = 'Add ₹2,500 more for complimentary luxury shipping';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  let subtotal = 0;
  itemsContainer.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item-card" data-index="${index}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-variant">${item.volume}</span>
          <div class="cart-item-qty-control">
            <button class="qty-btn" onclick="updateItemQuantity(${index}, -1)">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" onclick="updateItemQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-price-col">
          <span class="cart-item-price">₹${itemTotal.toLocaleString('en-IN')}</span>
          <button class="cart-item-remove" onclick="removeCartItem(${index})" title="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalDisplay) subtotalDisplay.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalDisplay) totalDisplay.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

  // Shipping threshold (₹2,500)
  const threshold = 2500;
  if (shippingFill && shippingMsg) {
    if (subtotal >= threshold) {
      shippingFill.style.width = '100%';
      shippingMsg.innerHTML = '<strong style="color: var(--color-success);"><i class="fa-solid fa-check"></i> You unlocked Complimentary Express Shipping!</strong>';
    } else {
      const remaining = threshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      shippingFill.style.width = `${pct}%`;
      shippingMsg.textContent = `Add ₹${remaining.toLocaleString('en-IN')} more to qualify for Free Shipping`;
    }
  }
}

// Global hooks for cart item operations
window.updateItemQuantity = function(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCartToStorage();
  updateCartBadges();
  renderCart();
};

window.removeCartItem = function(index) {
  if (!cart[index]) return;
  cart.splice(index, 1);
  saveCartToStorage();
  updateCartBadges();
  renderCart();
};

/* Cart Checkout Handling */
async function handleCartCheckout() {
  if (cart.length === 0) {
    alert('Your ritual bag is empty.');
    return;
  }

  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const originalText = checkoutBtn ? checkoutBtn.innerHTML : '';
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Dispatch...';
  }

  const refCode = `ELAN-BAG-${Date.now().toString().slice(-4)}`;
  const totalAmount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  // Record consultation / bag order in Supabase
  if (typeof submitBeautyAppointment === 'function') {
    try {
      await submitBeautyAppointment({
        client_name: 'Atelier Online Patron',
        client_phone: '+91 98765 00000',
        service_category: 'E-Commerce Dispatch',
        service_name: `Ritual Bag Order (${cart.length} items)`,
        special_requests: `Order Ref: ${refCode} • Items: ${cart.map(i => `${i.name} (${i.volume}) x${i.quantity}`).join(', ')} • Total: ₹${totalAmount}`
      });
    } catch (e) {
      console.warn('Checkout Supabase log notice:', e);
    }
  }

  setTimeout(() => {
    cart = [];
    saveCartToStorage();
    updateCartBadges();
    renderCart();

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = originalText;
    }

    // Close drawer
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer) cartDrawer.classList.remove('active');
    const backdrop = document.getElementById('cartDrawerBackdrop') || document.getElementById('drawerBackdrop');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';

    alert(`✨ Thank you for choosing ÉLAN Beauté Atelier!\n\nYour order has been logged with Reference: ${refCode}.\nA concierge specialist will connect via WhatsApp to confirm your luxury delivery.`);
  }, 1200);
}

/* ==========================================================================
   6. SUBSCRIBE & SAVE 15% DUAL-TIER SWITCHER
   ========================================================================== */
function initTierSwitcher() {
  const cards = document.querySelectorAll('.tier-option-card');
  const ctaBtn = document.getElementById('membershipCtaBtn');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const tier = card.getAttribute('data-tier');
      if (ctaBtn) {
        if (tier === 'subscription') {
          ctaBtn.innerHTML = 'Join Ritual Membership (Save 15%) &bull; ₹3,270 <i class="fa-solid fa-arrow-right"></i>';
        } else {
          ctaBtn.innerHTML = 'Purchase Single Flacon &bull; ₹3,850 <i class="fa-solid fa-arrow-right"></i>';
        }
      }
    });
  });

  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedCard = document.querySelector('.tier-option-card.selected');
      const tier = selectedCard?.getAttribute('data-tier') || 'subscription';
      const isSub = tier === 'subscription';

      addToCart({
        id: isSub ? 'flacon-sub-50ml' : 'flacon-single-50ml',
        baseId: 'l-elixir-radiance-rose',
        name: isSub ? 'L\'Élixir Rose Radiance (Ritual Membership 60-Day)' : 'L\'Élixir Rose Radiance (Single)',
        volume: '50ML',
        price: isSub ? 3270 : 3850,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      });

      const cartDrawer = document.getElementById('cartDrawer');
      if (cartDrawer) {
        cartDrawer.classList.add('active');
        const backdrop = document.getElementById('cartDrawerBackdrop') || document.getElementById('drawerBackdrop');
        if (backdrop) backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

/* ==========================================================================
   7. APPOINTMENT BOOKING MODAL (Supabase Integration)
   ========================================================================== */
function initAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('closeModalBtn');
  const openBtns = document.querySelectorAll('.open-appointment-modal, #dockBookBtn');
  const form = document.getElementById('appointmentForm');
  const feedback = document.getElementById('appointmentFeedback');

  if (!modal || !backdrop) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (feedback) feedback.style.display = 'none';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtns.forEach(b => {
    b.addEventListener('click', openModal);
    b.addEventListener('touchstart', openModal, { passive: true });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirming with Atelier...';
      }

      const clientName = document.getElementById('clientName')?.value || 'Valued Patron';
      const clientPhone = document.getElementById('clientPhone')?.value || '';
      const clientEmail = document.getElementById('clientEmail')?.value || '';
      const serviceCategory = document.getElementById('serviceCategory')?.value || 'Haute Beauté & Skincare';
      const appointmentDate = document.getElementById('appointmentDate')?.value || new Date().toISOString().split('T')[0];
      const appointmentTime = document.getElementById('appointmentTime')?.value || '11:00';
      const specialRequests = document.getElementById('specialRequests')?.value || '';

      let refCode = `ELAN-${Date.now().toString().slice(-4)}`;

      // Execute Supabase insertion via client engine
      if (typeof submitBeautyAppointment === 'function') {
        try {
          const result = await submitBeautyAppointment({
            client_name: clientName,
            client_phone: clientPhone,
            client_email: clientEmail,
            service_category: serviceCategory,
            service_name: serviceCategory,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            special_requests: specialRequests
          });
          if (result && result.refCode) {
            refCode = result.refCode;
          }
        } catch (err) {
          console.warn('Booking insertion error:', err);
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      form.reset();

      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = `
          <div style="background: rgba(46, 125, 50, 0.1); border: 1px solid var(--color-success); border-radius: var(--radius-sm); padding: 1.25rem; text-align: center; margin-top: 1rem;">
            <i class="fa-solid fa-circle-check" style="color: var(--color-success); font-size: 1.6rem; margin-bottom: 0.5rem; display: block;"></i>
            <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-dark); margin-bottom: 0.25rem;">Atelier Reservation Confirmed</h4>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">Reference Code: <strong style="color: var(--color-terracotta);">${refCode}</strong></p>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.4rem;">Our concierge will send an SMS & WhatsApp itinerary to ${clientPhone}.</p>
          </div>
        `;
      }
    });
  }
}
