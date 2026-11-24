/**
 * ÉLAN BEAUTY STUDIO • 3D BOTANICAL ELIXIR ENGINE
 * STL Model Loader & Subtle Ambient Studio Animation
 * Powered by Three.js & THREE.STLLoader
 */

(function () {
  'use strict';

  const state = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    mesh: null,
    petals: [],
    materials: {},
    activeFormula: 'rose-gold',
    mouseX: 0.5,
    mouseY: 0.5,
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    isOrbitMode: false,
    orbitControls: null,
    baseY: -2.2,
    clock: new THREE.Clock()
  };

  const FORMULAS = {
    'rose-gold': {
      name: "L'Élixir Rose Gold Radiance",
      subtitle: "Cold-Pressed Damask Rose & 24K Botanical Squalane",
      price: "₹3,850",
      notes: "Infused with organic rosehip fruit oil and micro-colloidal gold for cellular illumination.",
      glassColor: 0xf5cfc8,
      glassRoughness: 0.16,
      glassMetalness: 0.12,
      rimColor: 0xd4af37,
      petalColor: 0xf3b8b1,
      accentGlow: 'rgba(212, 175, 55, 0.25)'
    },
    'amber-cell': {
      name: "Apothecary Amber Restorative",
      subtitle: "Bio-Fermented Bakuchiol & Immortelle Flower",
      price: "₹4,200",
      notes: "High-potency botanical retinol alternative in UV-shielding pharmaceutical amber flacon.",
      glassColor: 0xa85e2b,
      glassRoughness: 0.14,
      glassMetalness: 0.08,
      rimColor: 0xc89b53,
      petalColor: 0xe3a869,
      accentGlow: 'rgba(168, 94, 43, 0.28)'
    },
    'jade-clarifying': {
      name: "Jadeite Botanical Clarifying Oil",
      subtitle: "Blue Tansy, Tea Tree & Cold-Pressed Camellia",
      price: "₹3,650",
      notes: "Calming phytonutrient elixir formulated to soothe reactive barriers and refine skin texture.",
      glassColor: 0x6e9684,
      glassRoughness: 0.18,
      glassMetalness: 0.06,
      rimColor: 0xd6d6d6,
      petalColor: 0xa8cbb8,
      accentGlow: 'rgba(110, 150, 132, 0.25)'
    }
  };

  function initElixirExperience() {
    const container = document.getElementById('elixir-3d-viewport');
    if (!container) return;

    state.container = container;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 560;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    state.scene = scene;

    // 2. Camera Setup (Architectural Studio Portrait Angle)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 11);
    camera.lookAt(0, 1.1, 0);
    state.camera = camera;

    // 3. Renderer with ACESFilmic Tone Mapping for Luxury Product Realism
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    state.renderer = renderer;

    // 4. Studio Lighting
    setupStudioLighting();

    // 5. Ambient Floating Petals Background (Subtle Poetry)
    createFloatingPetals();

    // 6. Load STL 3D Mesh
    loadSTLModel();

    // 7. Event Listeners (Parallax & Orbit)
    bindInteractions();

    window.addEventListener('resize', onWindowResize);
    requestAnimationFrame(renderLoop);
  }

  function setupStudioLighting() {
    const scene = state.scene;

    // Soft Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfefbf8, 0.85);
    scene.add(ambientLight);

    // Key Light (Soft Warm Studio Spot)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.35);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Rim Backlight (Highlighting the glass edges and flacon contour)
    const rimLight = new THREE.DirectionalLight(0xf8d8b8, 1.1);
    rimLight.position.set(-6, 6, -4);
    scene.add(rimLight);

    // Soft Under-fill Glow
    const fillLight = new THREE.PointLight(0xffecd6, 0.6, 12);
    fillLight.position.set(0, -1.5, 3);
    scene.add(fillLight);
  }

  function createFloatingPetals() {
    const scene = state.scene;
    const petalGeo = new THREE.CircleGeometry(0.12, 5);

    // Create 18 subtle floating organic particles/petals
    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xf4c2bc,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.3,
        side: THREE.DoubleSide
      });
      const petal = new THREE.Mesh(petalGeo, mat);

      petal.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 + 1,
        (Math.random() - 0.5) * 4 - 1
      );
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      petal.userData = {
        speedY: 0.003 + Math.random() * 0.005,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        originalX: petal.position.x,
        driftPhase: Math.random() * Math.PI * 2
      };

      scene.add(petal);
      state.petals.push(petal);
    }
  }

  function loadSTLModel() {
    const scene = state.scene;
    const currentFormula = FORMULAS[state.activeFormula];

    // Create PBR Material
    const material = new THREE.MeshStandardMaterial({
      color: currentFormula.glassColor,
      roughness: currentFormula.glassRoughness,
      metalness: currentFormula.glassMetalness,
      transparent: true,
      opacity: 0.92
    });
    state.materials.bottle = material;

    // Use Three.js STLLoader if available
    if (typeof THREE.STLLoader !== 'undefined') {
      const loader = new THREE.STLLoader();
      const stlPath = 'models/elixir-flacon.stl';

      loader.load(
        stlPath,
        (geometry) => {
          geometry.computeVertexNormals();
          geometry.center();

          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(0.62, 0.62, 0.62);
          mesh.position.set(0, 0.8, 0);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Add subtle gold collar ring mesh
          const collarGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.32, 32);
          const collarMat = new THREE.MeshStandardMaterial({
            color: currentFormula.rimColor,
            metalness: 0.85,
            roughness: 0.22
          });
          const collar = new THREE.Mesh(collarGeo, collarMat);
          collar.position.set(0, 1.45, 0);
          mesh.add(collar);
          state.materials.collar = collarMat;

          // Add rubber dropper bulb on top
          const bulbGeo = new THREE.SphereGeometry(0.38, 24, 24);
          bulbGeo.scale(1, 1.4, 1);
          const bulbMat = new THREE.MeshStandardMaterial({
            color: 0x221f1d,
            roughness: 0.6,
            metalness: 0.05
          });
          const bulb = new THREE.Mesh(bulbGeo, bulbMat);
          bulb.position.set(0, 1.95, 0);
          mesh.add(bulb);

          scene.add(mesh);
          state.mesh = mesh;
          console.log('✓ STL Model loaded successfully via THREE.STLLoader.');
        },
        undefined,
        (err) => {
          console.warn('Notice loading STL file, falling back to parametric luxury flacon:', err);
          createFallbackFlacon(scene, material, currentFormula);
        }
      );
    } else {
      createFallbackFlacon(scene, material, currentFormula);
    }
  }

  // Graceful High-Precision Fallback (in case STLLoader script fails to load)
  function createFallbackFlacon(scene, material, currentFormula) {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1.0, 0.95, 2.8, 32);
    const body = new THREE.Mesh(bodyGeo, material);
    body.position.set(0, 0.4, 0);
    group.add(body);

    // Shoulder & Neck
    const neckGeo = new THREE.CylinderGeometry(0.45, 0.95, 0.8, 32);
    const neck = new THREE.Mesh(neckGeo, material);
    neck.position.set(0, 2.1, 0);
    group.add(neck);

    // Gold collar
    const collarGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.35, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: currentFormula.rimColor,
      metalness: 0.85,
      roughness: 0.22
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 2.65, 0);
    group.add(collar);
    state.materials.collar = collarMat;

    // Pipette top
    const bulbGeo = new THREE.SphereGeometry(0.38, 24, 24);
    bulbGeo.scale(1, 1.3, 1);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0x24201e, roughness: 0.6 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 3.1, 0);
    group.add(bulb);

    group.position.set(0, -0.6, 0);
    group.scale.set(0.85, 0.85, 0.85);
    scene.add(group);
    state.mesh = group;
  }

  function bindInteractions() {
    const container = state.container;

    // Mouse movement inside 3D viewport for subtle parallax tilt
    container.addEventListener('mousemove', (e) => {
      if (state.isOrbitMode) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Subtle target rotations (max ~14 degrees)
      state.targetRotY = (x - 0.5) * 0.52;
      state.targetRotX = (y - 0.5) * 0.28;
    });

    container.addEventListener('mouseleave', () => {
      if (state.isOrbitMode) return;
      state.targetRotX = 0;
      state.targetRotY = 0;
    });

    // Touch movement for mobile devices
    container.addEventListener('touchmove', (e) => {
      if (state.isOrbitMode || !e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;

      state.targetRotY = (x - 0.5) * 0.45;
      state.targetRotX = (y - 0.5) * 0.22;
    }, { passive: true });

    // Orbit Mode Toggle Button
    const orbitToggle = document.getElementById('toggleElixirOrbit');
    if (orbitToggle && typeof THREE.OrbitControls !== 'undefined') {
      const controls = new THREE.OrbitControls(state.camera, state.renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 6;
      controls.maxDistance = 16;
      controls.enabled = false;
      state.orbitControls = controls;

      orbitToggle.addEventListener('click', () => {
        state.isOrbitMode = !state.isOrbitMode;
        controls.enabled = state.isOrbitMode;

        if (state.isOrbitMode) {
          orbitToggle.classList.add('active');
          orbitToggle.innerHTML = '<i class="fa-solid fa-lock"></i> Return to Gentle Float';
          if (window.showToast) window.showToast('360° Drag Inspection Active');
        } else {
          orbitToggle.classList.remove('active');
          orbitToggle.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> 360° Interactive Orbit';
          state.camera.position.set(0, 1.2, 11);
          state.camera.lookAt(0, 1.1, 0);
          if (window.showToast) window.showToast('Returned to Subtle Float Mode');
        }
      });
    }

    // Formula Switcher Buttons
    document.querySelectorAll('.formula-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-formula');
        applyFormula(key);
      });
    });

    // Hotspot clicks
    document.querySelectorAll('.elixir-hotspot').forEach(spot => {
      spot.addEventListener('click', () => {
        document.querySelectorAll('.elixir-hotspot').forEach(s => s.classList.remove('active'));
        spot.classList.add('active');
        const info = spot.getAttribute('data-info');
        if (info && window.showToast) window.showToast(info);
      });
    });
  }

  function applyFormula(key) {
    if (!FORMULAS[key]) return;
    state.activeFormula = key;
    const formula = FORMULAS[key];

    // Update 3D Materials
    if (state.materials.bottle) {
      state.materials.bottle.color.setHex(formula.glassColor);
      state.materials.bottle.roughness = formula.glassRoughness;
      state.materials.bottle.metalness = formula.glassMetalness;
    }
    if (state.materials.collar) {
      state.materials.collar.color.setHex(formula.rimColor);
    }

    // Update petal tints
    state.petals.forEach(p => {
      p.material.color.setHex(formula.petalColor);
    });

    // Update UI Elements
    const titleEl = document.getElementById('formulaTitleDisplay');
    const subEl = document.getElementById('formulaSubDisplay');
    const priceEl = document.getElementById('formulaPriceDisplay');
    const notesEl = document.getElementById('formulaNotesDisplay');
    const glowEl = document.getElementById('elixirGlowAura');

    if (titleEl) titleEl.textContent = formula.name;
    if (subEl) subEl.textContent = formula.subtitle;
    if (priceEl) priceEl.textContent = formula.price;
    if (notesEl) notesEl.textContent = formula.notes;
    if (glowEl) glowEl.style.background = `radial-gradient(circle, ${formula.accentGlow} 0%, transparent 70%)`;

    document.querySelectorAll('.formula-btn').forEach(btn => {
      if (btn.getAttribute('data-formula') === key) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.showToast) window.showToast(`Formulation Selected: ${formula.name}`);
  }

  function renderLoop() {
    requestAnimationFrame(renderLoop);

    const elapsed = state.clock.getElapsedTime();

    if (state.mesh) {
      if (!state.isOrbitMode) {
        // 1. Subtle, serene breathing bob (never jarring)
        state.mesh.position.y = 0.8 + Math.sin(elapsed * 0.85) * 0.08;

        // 2. Slow, graceful base rotation
        const baseSpin = elapsed * 0.12;

        // 3. Smooth mouse parallax interpolation
        state.currentRotX += (state.targetRotX - state.currentRotX) * 0.06;
        state.currentRotY += (state.targetRotY - state.currentRotY) * 0.06;

        state.mesh.rotation.y = baseSpin + state.currentRotY;
        state.mesh.rotation.x = state.currentRotX;
        state.mesh.rotation.z = Math.sin(elapsed * 0.6) * 0.02;
      } else if (state.orbitControls) {
        state.orbitControls.update();
      }
    }

    // Gentle floating petals drifting in ambient background
    state.petals.forEach(petal => {
      petal.position.y += petal.userData.speedY;
      petal.position.x = petal.userData.originalX + Math.sin(elapsed * 0.5 + petal.userData.driftPhase) * 0.25;
      petal.rotation.z += petal.userData.rotSpeed;

      // Loop back to bottom when drifting out of top frame
      if (petal.position.y > 4.5) {
        petal.position.y = -2.5;
      }
    });

    state.renderer.render(state.scene, state.camera);
  }

  function onWindowResize() {
    if (!state.container || !state.camera || !state.renderer) return;
    const width = state.container.clientWidth;
    const height = state.container.clientHeight;

    state.camera.aspect = width / height;
    state.camera.updateProjectionMatrix();

    state.renderer.setSize(width, height);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Self-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initElixirExperience);
  } else {
    initElixirExperience();
  }

  window.Elixir3D = {
    applyFormula
  };
})();
