/* =====================================================
   App Logic & UI Interactions
   ===================================================== */

let currentFilters = {
    category: [],
    room: [],
    finish: [],
    color: []
  };
  
  let shortlist = JSON.parse(localStorage.getItem('tile_shortlist')) || [];
  
  // --- Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initFilters();
    renderProducts();
    updateShortlistUI();
    initSearch();
  });
  
  // --- Scroll Effects (Navbar & Animations) ---
  function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const fadeElements = document.querySelectorAll('.fade-up');
  
    // Intersection Observer for fade animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  
    fadeElements.forEach(el => observer.observe(el));
  
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.remove('transparent');
        navbar.classList.add('solid');
      } else {
        navbar.classList.add('transparent');
        navbar.classList.remove('solid');
      }
  
      // Simple parallax for hero image
      const heroImg = document.getElementById('hero-img');
      if (heroImg && window.scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    });
  }
  
  // --- Mobile Nav ---
  function toggleMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.querySelector('.hamburger');
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
    if (nav.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // --- Catalogue & Filters ---
  function initFilters() {
    // Render Desktop Filters
    renderFilterGroup('filter-category', filterOptions.category, 'category');
    renderFilterGroup('filter-room', filterOptions.room, 'room');
    renderFilterGroup('filter-finish', filterOptions.finish, 'finish');
    renderColorFilters('filter-color');
  
    // Render Mobile Filters
    renderFilterGroup('m-filter-category', filterOptions.category, 'category');
    renderFilterGroup('m-filter-room', filterOptions.room, 'room');
    renderFilterGroup('m-filter-finish', filterOptions.finish, 'finish');
    renderColorFilters('m-filter-color');
  
    document.getElementById('sortSelect').addEventListener('change', renderProducts);
  }
  
  function renderFilterGroup(containerId, options, filterType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = options.map(opt => 
      `<button class="filter-chip" onclick="toggleFilter('${filterType}', '${opt}', this)">${opt}</button>`
    ).join('');
  }
  
  function renderColorFilters(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = filterOptions.color.map(c => 
      `<div class="colour-chip" style="background-color: ${c.hex};" title="${c.name}" onclick="toggleFilter('color', '${c.name}', this)"></div>`
    ).join('');
  }
  
  function toggleFilter(type, value, element) {
    // visually toggle class on all elements with same value (desktop + mobile)
    const allChips = document.querySelectorAll(`.filter-chip, .colour-chip`);
    
    if (currentFilters[type].includes(value)) {
      currentFilters[type] = currentFilters[type].filter(v => v !== value);
      element.classList.remove('active');
    } else {
      currentFilters[type].push(value);
      element.classList.add('active');
    }
  
    // sync ui
    syncFilterUI();
    renderProducts();
  
    document.getElementById('clearFiltersBtn').style.display = 
      Object.values(currentFilters).some(arr => arr.length > 0) ? 'flex' : 'none';
  }
  
  function syncFilterUI() {
    document.querySelectorAll('.filter-chip, .colour-chip').forEach(el => {
      el.classList.remove('active');
    });
  
    // This is a bit brute force for sync, but works for vanilla js
    const applyActive = (containerPrefix) => {
      ['category', 'room', 'finish'].forEach(type => {
        const container = document.getElementById(`${containerPrefix}filter-${type}`);
        if(!container) return;
        currentFilters[type].forEach(val => {
          const btn = Array.from(container.children).find(b => b.textContent === val);
          if (btn) btn.classList.add('active');
        });
      });
      // color
      const colContainer = document.getElementById(`${containerPrefix}filter-color`);
      if(colContainer) {
        currentFilters.color.forEach(val => {
          const btn = Array.from(colContainer.children).find(b => b.title === val);
          if(btn) btn.classList.add('active');
        });
      }
    };
  
    applyActive('');
    applyActive('m-');
  }
  
  function setFilter(type, value) {
    clearFilters();
    toggleFilter(type, value, document.createElement('div')); // fake element
    syncFilterUI();
    document.getElementById('catalogue').scrollIntoView({behavior: 'smooth'});
  }
  
  function clearFilters() {
    currentFilters = { category: [], room: [], finish: [], color: [] };
    syncFilterUI();
    renderProducts();
    document.getElementById('clearFiltersBtn').style.display = 'none';
  }
  
  function toggleFilters() {
    const drawer = document.getElementById('filterDrawer');
    const overlay = document.getElementById('filterDrawerOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  function getFilteredProducts() {
    let filtered = products.filter(p => {
      const matchCat = currentFilters.category.length === 0 || currentFilters.category.includes(p.category);
      const matchRoom = currentFilters.room.length === 0 || p.rooms.some(r => currentFilters.room.includes(r));
      const matchFinish = currentFilters.finish.length === 0 || currentFilters.finish.includes(p.finish);
      const matchColor = currentFilters.color.length === 0 || currentFilters.color.includes(p.color);
      return matchCat && matchRoom && matchFinish && matchColor;
    });
  
    const sort = document.getElementById('sortSelect').value;
    if (sort === 'name_asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === 'name_desc') filtered.sort((a,b) => b.name.localeCompare(a.name));
    
    return filtered;
  }
  
  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = getFilteredProducts();
    document.getElementById('resultsCount').innerText = filtered.length;
  
    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; color: var(--mid-grey);">
        <p>No products match your selected filters.</p>
        <button class="btn btn-ghost" style="margin-top: 16px;" onclick="clearFilters()">Clear Filters</button>
      </div>`;
      return;
    }
  
    grid.innerHTML = filtered.map(p => {
      const isLiked = shortlist.some(item => item.id === p.id);
      return `
      <div class="product-card fade-up">
        <div class="product-img-wrap" onclick="openProductModal('${p.id}')">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="product-badge">${p.finish}</div>
          <button class="product-shortlist-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleShortlistProduct('${p.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="product-body">
          <div class="product-collection">${p.collection}</div>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-attrs">
            <span class="attr-pill">${p.size}</span>
            <span class="attr-pill">${p.material}</span>
          </div>
          <div class="product-actions">
            <button class="product-view-btn" onclick="openProductModal('${p.id}')">View Details</button>
            <a href="${getWaLink(p.name)}" target="_blank" class="product-wa-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Enquire
          </a>
        </div>
      </div>
    </div>`;
    }).join('');
  
    // Re-init fade up for new elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.products-grid .fade-up').forEach(el => observer.observe(el));
  }
  
  // --- Product Modal ---
  function openProductModal(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
  
    document.getElementById('modalImg').src = p.image;
    document.getElementById('modalCollection').innerText = p.collection;
    document.getElementById('modalName').innerText = p.name;
    document.getElementById('modalSize').innerText = p.size;
    document.getElementById('modalFinish').innerText = p.finish;
    document.getElementById('modalMaterial').innerText = p.material;
    document.getElementById('modalColor').innerText = p.color;
  
    document.getElementById('modalRooms').innerHTML = p.rooms.map(r => `<span class="suitable-chip">${r}</span>`).join('');
    document.getElementById('modalBenefits').innerHTML = p.benefits.map(b => `<div class="benefit-item">${b}</div>`).join('');
  
    document.getElementById('modalWaBtn').href = getWaLink(p.name);
  
    const slBtn = document.getElementById('modalShortlistBtn');
    const isLiked = shortlist.some(item => item.id === p.id);
    slBtn.innerHTML = isLiked ? 
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> पसंद से हटाएँ` :
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> मेरी पसंद में डालें`;
    
    slBtn.onclick = () => {
      toggleShortlistProduct(p.id);
      openProductModal(p.id); // re-render btn
    };
  
    const modal = document.getElementById('productModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModalBtn() {
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
  }
  
  function closeProductModal(e) {
    if (e.target.id === 'productModal') {
      closeModalBtn();
    }
  }
  
  // --- Search ---
  function initSearch() {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
  
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (q.length < 2) {
        dropdown.classList.remove('open');
        return;
      }
  
      const res = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.collection.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 5);
  
      if (res.length > 0) {
        dropdown.innerHTML = res.map(p => `
          <div class="search-result-item" onclick="openProductModal('${p.id}'); document.getElementById('searchDropdown').classList.remove('open'); document.getElementById('searchInput').value='';">
            <img src="${p.image}" class="sri-img">
            <div>
              <div class="sri-name">${p.name}</div>
              <div class="sri-sub">${p.finish} • ${p.size}</div>
            </div>
          </div>
        `).join('');
        dropdown.classList.add('open');
      } else {
        dropdown.classList.remove('open');
      }
    });
  
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap')) {
        dropdown.classList.remove('open');
      }
    });
  }
  
  // --- Shortlist ---
  function toggleShortlistProduct(id) {
    const exists = shortlist.findIndex(p => p.id === id);
    if (exists >= 0) {
      shortlist.splice(exists, 1);
      showToast("Tile removed from shortlist");
    } else {
      const p = products.find(prod => prod.id === id);
      shortlist.push(p);
      showToast("Tile added to shortlist");
    }
    localStorage.setItem('tile_shortlist', JSON.stringify(shortlist));
    updateShortlistUI();
    renderProducts(); // update icons
  }
  
  function updateShortlistUI() {
    document.getElementById('nav-shortlist-count').innerText = shortlist.length;
    
    const body = document.getElementById('shortlistBody');
    const footer = document.getElementById('shortlistFooter');
    
    if (shortlist.length === 0) {
      body.innerHTML = `
        <div class="shortlist-empty">
          <div class="shortlist-empty-icon">♡</div>
          <p>अभी तक कोई tile पसंद नहीं की गई है.</p>
          <button class="btn btn-ghost" style="margin-top: 20px;" onclick="toggleShortlist(); document.getElementById('catalogue').scrollIntoView();">Collection देखें</button>
        </div>`;
      footer.style.display = 'none';
      return;
    }
  
    body.innerHTML = shortlist.map(p => `
      <div class="shortlist-item">
        <img src="${p.image}" class="shortlist-item-img">
        <div class="shortlist-item-info">
          <div class="shortlist-item-name">${p.name}</div>
          <div class="shortlist-item-sub">${p.size} • ${p.finish}</div>
        </div>
        <button class="shortlist-remove" onclick="toggleShortlistProduct('${p.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `).join('');
  
    footer.style.display = 'block';
    
    // Generate bulk enquiry message
    const names = shortlist.map(p => `- ${p.name} (${p.size})`).join('%0A');
    const text = `नमस्ते, मैंने आपकी website पर ये tiles shortlist की हैं. कृपया इनकी details और availability बताएँ:%0A%0A${names}`;
    document.getElementById('shortlistWaBtn').href = `https://wa.me/${businessPhone}?text=${text}`;
  }
  
  function toggleShortlist() {
    const panel = document.getElementById('shortlist-panel');
    const overlay = document.getElementById('shortlist-overlay');
    panel.classList.toggle('open');
    overlay.classList.toggle('open');
    if (panel.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // --- Utils ---
  function getWaLink(productName) {
    const text = `नमस्ते, मुझे ${productName} Tile के बारे में जानकारी चाहिए.`;
    return `https://wa.me/${businessPhone}?text=${text}`;
  }
  
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      
      // Open if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
