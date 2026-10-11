/**
 * THƯƠNG TỐC Express Tech - Multi-Page SPA Routing & E-Commerce Core Logic
 * SPA Routing: Home, About, Shop, Flash Sale, Checkout, My Orders, Account
 * 100% Tương Tác Thật: Cart, Voucher, VietQR, Order Management, Auth, Live Chat
 */

// Global Application State
const state = {
  currentPage: 'home',
  cart: JSON.parse(localStorage.getItem('thuongtoc_cart') || '[]'),
  userOrders: JSON.parse(localStorage.getItem('user_orders') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('current_user') || 'null'),
  registeredUsers: JSON.parse(localStorage.getItem('registered_users') || '[]'),
  
  // Shop filters
  activeCategory: 'all',
  priceRange: 'all', // 'all' | 'under-100' | '100-300' | 'above-300'
  sortBy: 'bestseller', // 'bestseller' | 'latest' | 'price-asc' | 'price-desc'
  searchQuery: '',
  
  // Checkout state
  deliveryMethod: 'express_bienhoa',
  paymentMethod: 'vietqr',
  appliedVoucher: null,
  quickBuyItem: null,
  
  // Detail Modal
  activeDetailProduct: null,
  selectedColor: null,
  detailQuantity: 1,

  // Timers
  orderCountdownInterval: null,
  flashSaleInterval: null
};

// =============================================================
// CẤU HÌNH THÔNG BÁO TELEGRAM BOT CHO ADMIN / CHỦ SHOP
// =============================================================
/**
 * HƯỚNG DẪN TẠO TELEGRAM BOT NHẬN THÔNG BÁO ĐƠN HÀNG TRÊN ĐIỆN THOẠI:
 * 1. Mở ứng dụng Telegram, tìm bot @BotFather và bấm /newbot để tạo bot mới.
 * 2. Copy mã HTTP API Token dán vào 'botToken' bên dưới (hoặc nhập tại trang admin.html).
 * 3. Tìm bot @userinfobot hoặc tạo một nhóm rồi thêm bot vào, lấy 'chatId' (Id cá nhân hoặc ID nhóm).
 * 4. Bật isEnabled = true để nhận thông báo tức thì khi có đơn đặt hàng mới!
 */
const TELEGRAM_CONFIG = {
  botToken: localStorage.getItem('tg_bot_token') || '7483920194:AAExampleTokenPlaceholder_THUONGTOC',
  chatId: localStorage.getItem('tg_chat_id') || '123456789',
  isEnabled: localStorage.getItem('tg_enabled') !== 'false' // Mặc định bật
};

// Hàm gửi thông báo đơn hàng tự động đến Telegram Bot
async function sendTelegramNotification(order) {
  const token = localStorage.getItem('tg_bot_token') || TELEGRAM_CONFIG.botToken;
  const chatId = localStorage.getItem('tg_chat_id') || TELEGRAM_CONFIG.chatId;

  const itemsListText = order.items.map(item => 
    `• ${item.name} (${item.color}) x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');

  const text = `
⚡ *ĐƠN HÀNG HỎA TỐC MỚI - THƯƠNG TỐC* ⚡
━━━━━━━━━━━━━━━━━━━━
📦 *Mã đơn:* #${order.orderId}
⏰ *Thời gian:* ${order.createdAt}
👤 *Khách hàng:* ${order.name}
📞 *Số điện thoại:* ${order.phone}
📍 *Địa chỉ nhận:* ${order.address}
🚚 *Vận chuyển:* ${order.deliveryMethod === 'express_bienhoa' ? '⚡ HỎA TỐC 1H BIÊN HÒA' : '📦 TIÊU CHUẨN'}
💳 *Thanh toán:* ${order.paymentMethod.toUpperCase()}

🛍️ *Chi tiết sản phẩm:*
${itemsListText}

💰 *TỔNG THANH TOÁN:* *${formatCurrency(order.totals.finalTotal)}*
${order.note ? `📝 *Ghi chú:* ${order.note}` : ''}
━━━━━━━━━━━━━━━━━━━━
👉 *Xem & Quản lý đơn tại:* admin.html
  `.trim();

  // Kiểm tra nếu chưa cấu hình token thật thì hiển thị giả lập trên console
  if (!token || token.includes('Placeholder')) {
    console.log('%c[TELEGRAM BOT SIMULATION] Đã chuẩn bị thông báo đơn hàng mới:', 'color: #0066FF; font-weight: bold;', text);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    const result = await res.json();
    if (result.ok) {
      console.log('✅ Đã gửi thông báo đơn hàng thành công đến Telegram Bot!');
      return { success: true };
    } else {
      console.warn('⚠️ Gửi Telegram thất bại:', result);
      return { success: false, error: result };
    }
  } catch (err) {
    console.error('Lỗi kết nối Telegram API:', err);
    return { success: false, error: err };
  }
}

// Utilities
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle text-emerald-500 text-lg"></i>' 
    : type === 'warning' 
    ? '<i class="fas fa-exclamation-triangle text-amber-500 text-lg"></i>' 
    : '<i class="fas fa-info-circle text-blue-500 text-lg"></i>';

  toast.className = `toast-msg flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm transition-all duration-300`;
  toast.innerHTML = `
    ${icon}
    <div class="text-xs sm:text-sm font-semibold text-slate-800 flex-1 leading-snug">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 ml-2"><i class="fas fa-times text-xs"></i></button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// =============================================================
// 1. MULTI-PAGE SPA ROUTER
// =============================================================
function navigateTo(pageId) {
  state.currentPage = pageId;

  // Hide all SPA pages
  document.querySelectorAll('.spa-page').forEach(page => {
    page.classList.remove('active-page');
  });

  // Show target page
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active-page');
  }

  // Update navigation button active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const target = btn.getAttribute('data-page');
    if (target === pageId) {
      btn.classList.add('active-nav');
    } else {
      btn.classList.remove('active-nav');
    }
  });

  // Update URL hash without reload
  if (window.location.hash !== `#${pageId}`) {
    window.location.hash = `#${pageId}`;
  }

  // Page specific data render
  if (pageId === 'home') {
    renderHomeFeatured();
  } else if (pageId === 'shop') {
    renderShopProducts();
  } else if (pageId === 'flashsale') {
    renderFlashSaleProducts();
  } else if (pageId === 'checkout') {
    renderCheckoutSummary();
    renderVoucherSelector();
  } else if (pageId === 'orders') {
    renderUserOrders();
  } else if (pageId === 'account') {
    renderAccountView();
  }

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Router hash handler
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (hash !== state.currentPage) {
    navigateTo(hash);
  }
});

// =============================================================
// 2. SHOPPING CART MANAGEMENT
// =============================================================
function saveCart() {
  localStorage.setItem('thuongtoc_cart', JSON.stringify(state.cart));
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  });
}

function addToCart(productId, quantity = 1, selectedColor = null, openDrawer = true) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Tiêu chuẩn');
  const cartKey = `${productId}_${color}`;

  const existingIndex = state.cart.findIndex(item => item.cartKey === cartKey);
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += quantity;
  } else {
    state.cart.push({
      cartKey,
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      warranty: product.warranty,
      color: color,
      quantity: quantity
    });
  }

  saveCart();
  showToast(`Đã thêm ${quantity}x "${product.name}" (${color}) vào giỏ hàng!`);

  if (openDrawer) {
    openCartDrawer();
  }
}

function updateQuantity(cartKey, delta) {
  const itemIndex = state.cart.findIndex(item => item.cartKey === cartKey);
  if (itemIndex === -1) return;

  state.cart[itemIndex].quantity += delta;
  if (state.cart[itemIndex].quantity <= 0) {
    state.cart.splice(itemIndex, 1);
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  }
  saveCart();
}

function removeFromCart(cartKey) {
  state.cart = state.cart.filter(item => item.cartKey !== cartKey);
  saveCart();
  showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
}

function clearCart() {
  state.cart = [];
  saveCart();
}

function calculateCartTotals() {
  const items = state.quickBuyItem ? [state.quickBuyItem] : state.cart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Shipping calculation
  let shippingFee = 0;
  if (state.deliveryMethod === 'express_bienhoa') {
    shippingFee = subtotal >= SHIPPING_CONFIG.expressFreeThreshold || subtotal === 0 ? 0 : SHIPPING_CONFIG.expressFee;
  } else {
    shippingFee = subtotal >= SHIPPING_CONFIG.standardFreeThreshold || subtotal === 0 ? 0 : SHIPPING_CONFIG.standardFee;
  }

  // Voucher discount
  let discountAmount = 0;
  if (state.appliedVoucher && DISCOUNT_VOUCHERS[state.appliedVoucher]) {
    const voucher = DISCOUNT_VOUCHERS[state.appliedVoucher];
    if (subtotal >= voucher.minOrder) {
      if (voucher.type === 'percent') {
        discountAmount = Math.round(subtotal * (voucher.value / 100));
      } else if (voucher.type === 'shipping') {
        discountAmount = shippingFee;
      } else if (voucher.type === 'fixed') {
        discountAmount = voucher.value;
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return { subtotal, shippingFee, discountAmount, finalTotal, count };
}

// Cart Drawer
function openCartDrawer() {
  state.quickBuyItem = null;
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer || !backdrop) return;

  renderCartDrawer();
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  backdrop.classList.add('opacity-100', 'pointer-events-auto');
  drawer.classList.remove('translate-x-full');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer || !backdrop) return;

  drawer.classList.add('translate-x-full');
  backdrop.classList.remove('opacity-100', 'pointer-events-auto');
  backdrop.classList.add('opacity-0', 'pointer-events-none');
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cart-drawer-items');
  const footerContainer = document.getElementById('cart-drawer-footer');
  const freeShipBar = document.getElementById('cart-freeship-progress');
  const freeShipText = document.getElementById('cart-freeship-text');

  if (!itemsContainer || !footerContainer) return;

  const { subtotal } = calculateCartTotals();
  const threshold = SHIPPING_CONFIG.expressFreeThreshold;

  if (freeShipBar && freeShipText) {
    if (subtotal >= threshold) {
      freeShipBar.style.width = '100%';
      freeShipBar.className = 'bg-emerald-500 h-full rounded-full transition-all duration-300';
      freeShipText.innerHTML = '<span class="text-emerald-600 font-bold">🎉 Bạn đã được MIỄN PHÍ GIAO HỎA TỐC 1H BIÊN HÒA!</span>';
    } else {
      const remaining = threshold - subtotal;
      const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
      freeShipBar.style.width = `${percent}%`;
      freeShipBar.className = 'bg-blue-600 h-full rounded-full transition-all duration-300';
      freeShipText.innerHTML = `Mua thêm <strong class="text-blue-600 font-bold">${formatCurrency(remaining)}</strong> để nhận <strong>FREESHIP 1 GIỜ</strong>`;
    }
  }

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center text-slate-500">
        <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <p class="font-bold text-slate-800 text-base">Giỏ hàng của bạn đang trống</p>
        <p class="text-xs text-slate-400 mt-1 max-w-xs">Chọn ngay các phụ kiện chính hãng để trải nghiệm giao hàng 30-60 phút tại Biên Hòa!</p>
        <button onclick="closeCartDrawer(); navigateTo('shop')" class="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-md">
          Khám Phá Cửa Hàng
        </button>
      </div>
    `;
    footerContainer.classList.add('hidden');
    return;
  }

  footerContainer.classList.remove('hidden');

  itemsContainer.innerHTML = state.cart.map(item => `
    <div class="flex gap-3.5 p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition">
      <img src="${item.image}" alt="${item.name}" class="w-18 h-18 object-cover rounded-xl border border-slate-100 flex-shrink-0" style="width: 70px; height: 70px;">
      <div class="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-1">
            <h4 class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight">${item.name}</h4>
            <button onclick="removeFromCart('${item.cartKey}')" class="text-slate-400 hover:text-red-500 text-xs p-1 transition" title="Xóa">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">${item.brand}</span>
            <span class="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">${item.color}</span>
          </div>
        </div>

        <div class="flex items-center justify-between mt-2">
          <div class="flex items-baseline gap-1.5">
            <span class="text-xs sm:text-sm font-extrabold text-blue-600">${formatCurrency(item.price)}</span>
            ${item.originalPrice > item.price ? `<span class="text-[10px] text-slate-400 line-through">${formatCurrency(item.originalPrice)}</span>` : ''}
          </div>
          <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button onclick="updateQuantity('${item.cartKey}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs transition">
              <i class="fas fa-minus text-[10px]"></i>
            </button>
            <span class="w-7 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
            <button onclick="updateQuantity('${item.cartKey}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs transition">
              <i class="fas fa-plus text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('cart-drawer-subtotal').textContent = formatCurrency(subtotal);
}

// =============================================================
// 3. PRODUCT RENDERING (HOME, SHOP & FLASH SALE)
// =============================================================
function createProductCardHTML(product) {
  return `
    <div class="product-card group bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:border-blue-300">
      <div>
        <div class="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onclick="openProductQuickView('${product.id}')">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            ${product.isFlashSale ? `
              <span class="px-2 py-0.5 text-[10px] sm:text-[11px] font-black rounded-md uppercase tracking-wider text-white bg-red-600 shadow-sm">
                ${product.badge || `-${product.discount}%`}
              </span>
            ` : `
              <span class="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md uppercase tracking-wider text-white bg-blue-600 shadow-sm">
                ${product.badge || 'CHÍNH HÃNG'}
              </span>
            `}
            <span class="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-md bg-amber-400 text-slate-900 shadow-sm flex items-center gap-1">
              <i class="fas fa-bolt text-[9px]"></i> 1H BIÊN HÒA
            </span>
          </div>

          <button 
            type="button" 
            onclick="event.stopPropagation(); openProductQuickView('${product.id}')" 
            class="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white"
            title="Xem Chi Tiết"
          >
            <i class="fas fa-eye text-xs"></i>
          </button>
        </div>

        <div class="p-3.5 sm:p-4">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span class="font-bold text-blue-600 uppercase text-[11px]">${product.brand}</span>
            <div class="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <i class="fas fa-star text-[10px]"></i>
              <span>${product.rating}</span>
              <span class="text-slate-400 font-normal">(${product.soldCount} đã bán)</span>
            </div>
          </div>

          <h3 onclick="openProductQuickView('${product.id}')" class="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 hover:text-blue-600 transition cursor-pointer min-h-[2.5rem] leading-snug">
            ${product.name}
          </h3>

          <div class="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <i class="fas fa-shield-alt text-[10px]"></i>
            <span>${product.warranty}</span>
          </div>
        </div>
      </div>

      <div class="p-3.5 sm:p-4 pt-0">
        <div class="flex items-baseline gap-2 mb-3">
          <span class="text-base sm:text-lg font-black text-blue-600">${formatCurrency(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="text-xs text-slate-400 line-through">${formatCurrency(product.originalPrice)}</span>` : ''}
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button 
            type="button" 
            onclick="addToCart('${product.id}', 1, null, true)" 
            class="py-2 px-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition"
          >
            <i class="fas fa-cart-plus"></i> <span class="hidden sm:inline">Thêm</span> Giỏ
          </button>
          <button 
            type="button" 
            onclick="openProductQuickView('${product.id}')" 
            class="py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 transition"
          >
            <i class="fas fa-bolt text-amber-300"></i> Xem Nhanh
          </button>
        </div>
      </div>
    </div>
  `;
}

// Home Page: Bestsellers & Flash Sale preview
function renderHomeFeatured() {
  const bestsellersGrid = document.getElementById('home-bestsellers-grid');
  const flashsaleGrid = document.getElementById('home-flashsale-grid');

  if (bestsellersGrid) {
    const bestsellers = [...PRODUCTS_DATA].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
    bestsellersGrid.innerHTML = bestsellers.map(p => createProductCardHTML(p)).join('');
  }

  if (flashsaleGrid) {
    const flashSales = PRODUCTS_DATA.filter(p => p.isFlashSale).slice(0, 4);
    flashsaleGrid.innerHTML = flashSales.map(p => createProductCardHTML(p)).join('');
  }
}

// Shop Page: All Products with Filters & Sort
function renderShopProducts() {
  const grid = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('shop-products-count');
  if (!grid) return;

  let filtered = [...PRODUCTS_DATA];

  // Category Filter
  if (state.activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.activeCategory);
  }

  // Price Range Filter
  if (state.priceRange === 'under-100') {
    filtered = filtered.filter(p => p.price < 100000);
  } else if (state.priceRange === '100-300') {
    filtered = filtered.filter(p => p.price >= 100000 && p.price <= 300000);
  } else if (state.priceRange === 'above-300') {
    filtered = filtered.filter(p => p.price > 300000);
  }

  // Search Filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.trim().toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      (p.power && p.power.toLowerCase().includes(q)) ||
      p.shortDesc.toLowerCase().includes(q)
    );
  }

  // Sort
  if (state.sortBy === 'latest') {
    filtered.sort((a, b) => b.id.localeCompare(a.id));
  } else if (state.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => b.soldCount - a.soldCount);
  }

  if (countEl) {
    countEl.textContent = `(${filtered.length} sản phẩm)`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
          <i class="fas fa-search"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Thử xóa bộ lọc hoặc tìm kiếm các từ khóa thông dụng như: Củ GaN, Anker, Baseus, Hoco...</p>
        <button onclick="resetShopFilters()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition">
          Xóa Tất Cả Bộ Lọc
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => createProductCardHTML(p)).join('');
}

// Flash Sale Page
function renderFlashSaleProducts() {
  const grid = document.getElementById('flashsale-products-grid');
  if (!grid) return;

  const flashItems = PRODUCTS_DATA.filter(p => p.isFlashSale);
  grid.innerHTML = flashItems.map(item => {
    const percentSold = Math.round((item.flashSaleSold / (item.flashSaleStock || 100)) * 100);
    return `
      <div class="product-card bg-white rounded-2xl border border-red-100 overflow-hidden flex flex-col justify-between hover:border-red-300 shadow-sm">
        <div class="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onclick="openProductQuickView('${item.id}')">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
          <span class="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded shadow">
            -${item.discount}% FLASH SALE
          </span>
          <span class="absolute top-2.5 right-2.5 bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
            <i class="fas fa-bolt"></i> 1H BIÊN HÒA
          </span>
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] font-bold text-blue-600 uppercase mb-1">${item.brand}</div>
            <h4 onclick="openProductQuickView('${item.id}')" class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-blue-600 cursor-pointer min-h-[2.5rem]">
              ${item.name}
            </h4>

            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-lg font-black text-red-600">${formatCurrency(item.price)}</span>
              <span class="text-xs text-slate-400 line-through">${formatCurrency(item.originalPrice)}</span>
            </div>

            <!-- Progress bar -->
            <div class="mt-3">
              <div class="w-full bg-red-100 rounded-full h-3 overflow-hidden relative">
                <div class="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full" style="width: ${percentSold}%"></div>
                <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-red-950">
                  Đã bán ${item.flashSaleSold}/${item.flashSaleStock} (${percentSold}%)
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button onclick="addToCart('${item.id}', 1, null, true)" class="py-2 px-2 border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1">
              <i class="fas fa-cart-plus"></i> Giỏ
            </button>
            <button onclick="buyNow('${item.id}')" class="py-2 px-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1">
              <i class="fas fa-bolt text-amber-300"></i> Mua Ngay
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Filter Controllers
function filterByCategory(cat) {
  state.activeCategory = cat;
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    const c = btn.getAttribute('data-cat');
    if (c === cat) {
      btn.className = 'cat-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition bg-blue-600 text-white shadow-md';
    } else {
      btn.className = 'cat-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition bg-white text-slate-700 hover:bg-slate-100 border border-slate-200';
    }
  });
  renderShopProducts();
}

function filterByPriceRange(range) {
  state.priceRange = range;
  document.querySelectorAll('.price-filter-btn').forEach(btn => {
    const r = btn.getAttribute('data-price');
    if (r === range) {
      btn.className = 'price-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-900 text-white';
    } else {
      btn.className = 'price-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200';
    }
  });
  renderShopProducts();
}

function handleSortChange(sortVal) {
  state.sortBy = sortVal;
  renderShopProducts();
}

function resetShopFilters() {
  state.activeCategory = 'all';
  state.priceRange = 'all';
  state.searchQuery = '';
  state.sortBy = 'bestseller';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  filterByCategory('all');
  filterByPriceRange('all');
}

// Realtime Search
function handleSearchInput(e) {
  state.searchQuery = e.target.value;
  if (state.currentPage !== 'shop') {
    navigateTo('shop');
  } else {
    renderShopProducts();
  }
}

function setQuickSearchTag(tag) {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = tag;
    state.searchQuery = tag;
    navigateTo('shop');
  }
}

// =============================================================
// 4. PRODUCT DETAIL MODAL
// =============================================================
function openProductQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  state.activeDetailProduct = product;
  state.selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Tiêu chuẩn';
  state.detailQuantity = 1;

  const modal = document.getElementById('quickview-modal');
  if (!modal) return;

  document.getElementById('qv-image').src = product.image;
  document.getElementById('qv-brand').textContent = product.brand;
  document.getElementById('qv-title').textContent = product.name;
  document.getElementById('qv-price').textContent = formatCurrency(product.price);
  
  const origPriceEl = document.getElementById('qv-original-price');
  if (product.originalPrice > product.price) {
    origPriceEl.textContent = formatCurrency(product.originalPrice);
    origPriceEl.classList.remove('hidden');
  } else {
    origPriceEl.classList.add('hidden');
  }

  document.getElementById('qv-discount-badge').textContent = product.discount ? `-${product.discount}%` : 'HOT';
  document.getElementById('qv-rating').textContent = product.rating;
  document.getElementById('qv-reviews').textContent = `(${product.reviewsCount} đánh giá • Đã bán ${product.soldCount})`;
  document.getElementById('qv-desc').textContent = product.shortDesc;
  document.getElementById('qv-power-badge').textContent = product.power || 'Chính hãng';
  document.getElementById('qv-qty-input').value = state.detailQuantity;

  // Colors
  const colorContainer = document.getElementById('qv-colors-container');
  if (colorContainer && product.colors) {
    colorContainer.innerHTML = product.colors.map((color, idx) => `
      <button 
        type="button" 
        onclick="selectDetailColor('${color}', this)" 
        class="variant-chip px-3 py-1.5 text-xs rounded-xl border ${idx === 0 ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-200 text-slate-700 hover:border-slate-400'} transition flex items-center gap-1.5"
      >
        <span class="w-2.5 h-2.5 rounded-full ${color.includes('Trắng') ? 'bg-slate-200 border' : color.includes('Xanh') ? 'bg-blue-600' : color.includes('Đỏ') ? 'bg-red-600' : 'bg-slate-800'}"></span>
        <span>${color}</span>
      </button>
    `).join('');
  }

  // Specs
  const specsList = document.getElementById('qv-specs');
  if (specsList && product.specs) {
    specsList.innerHTML = Object.entries(product.specs).map(([key, value]) => `
      <div class="flex items-start text-xs py-1 border-b border-slate-100 last:border-b-0">
        <span class="text-slate-400 w-32 flex-shrink-0 font-medium">${key}:</span>
        <span class="text-slate-800 font-semibold flex-1">${value}</span>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function selectDetailColor(color, btnEl) {
  state.selectedColor = color;
  btnEl.parentElement.querySelectorAll('.variant-chip').forEach(btn => {
    btn.className = 'variant-chip px-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-700 hover:border-slate-400 transition flex items-center gap-1.5';
  });
  btnEl.className = 'variant-chip px-3 py-1.5 text-xs rounded-xl border border-blue-600 bg-blue-50 text-blue-600 font-bold transition flex items-center gap-1.5';
}

function changeDetailQty(delta) {
  state.detailQuantity = Math.max(1, state.detailQuantity + delta);
  const input = document.getElementById('qv-qty-input');
  if (input) input.value = state.detailQuantity;
}

function addDetailProductToCart() {
  if (!state.activeDetailProduct) return;
  addToCart(state.activeDetailProduct.id, state.detailQuantity, state.selectedColor, true);
  closeProductQuickView();
}

function buyNowDetailProduct() {
  if (!state.activeDetailProduct) return;
  const product = state.activeDetailProduct;
  state.quickBuyItem = {
    cartKey: `${product.id}_${state.selectedColor}`,
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    brand: product.brand,
    warranty: product.warranty,
    color: state.selectedColor,
    quantity: state.detailQuantity
  };
  closeProductQuickView();
  navigateTo('checkout');
}

function closeProductQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function buyNow(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Tiêu chuẩn';
  state.quickBuyItem = {
    cartKey: `${product.id}_${color}`,
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    brand: product.brand,
    warranty: product.warranty,
    color: color,
    quantity: 1
  };

  navigateTo('checkout');
}

// =============================================================
// 5. CHECKOUT & VIETQR PAYMENT
// =============================================================
function renderCheckoutSummary() {
  const items = state.quickBuyItem ? [state.quickBuyItem] : state.cart;
  const listEl = document.getElementById('checkout-items-list');
  if (!listEl) return;

  if (items.length === 0) {
    listEl.innerHTML = `
      <div class="py-8 text-center text-slate-500">
        <p class="text-xs font-semibold">Chưa có sản phẩm nào để thanh toán.</p>
        <button onclick="navigateTo('shop')" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Quay lại Cửa Hàng
        </button>
      </div>
    `;
    return;
  }

  listEl.innerHTML = items.map(item => `
    <div class="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0">
      <img src="${item.image}" alt="${item.name}" class="w-11 h-11 object-cover rounded-lg border border-slate-200 flex-shrink-0">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-slate-800 truncate">${item.name}</p>
        <p class="text-[11px] text-slate-500">${item.brand} • Màu: ${item.color} • SL: x${item.quantity}</p>
      </div>
      <div class="text-right">
        <p class="text-xs font-black text-slate-900">${formatCurrency(item.price * item.quantity)}</p>
      </div>
    </div>
  `).join('');

  const { subtotal, shippingFee, discountAmount, finalTotal } = calculateCartTotals();

  document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('checkout-shipping').textContent = shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee);
  
  const discountRow = document.getElementById('checkout-discount-row');
  if (discountAmount > 0) {
    discountRow.classList.remove('hidden');
    document.getElementById('checkout-discount').textContent = `-${formatCurrency(discountAmount)}`;
  } else {
    discountRow.classList.add('hidden');
  }

  document.getElementById('checkout-final-total').textContent = formatCurrency(finalTotal);
  updateVietQRDisplay(finalTotal);
}

function setDeliveryMethod(method) {
  state.deliveryMethod = method;
  
  const btnExpress = document.getElementById('btn-delivery-express');
  const btnStandard = document.getElementById('btn-delivery-standard');

  if (method === 'express_bienhoa') {
    btnExpress?.classList.add('border-blue-600', 'bg-blue-50/60');
    btnExpress?.classList.remove('border-slate-200');
    btnStandard?.classList.remove('border-blue-600', 'bg-blue-50/60');
    btnStandard?.classList.add('border-slate-200');
  } else {
    btnStandard?.classList.add('border-blue-600', 'bg-blue-50/60');
    btnStandard?.classList.remove('border-slate-200');
    btnExpress?.classList.remove('border-blue-600', 'bg-blue-50/60');
    btnExpress?.classList.add('border-slate-200');
  }

  renderCheckoutSummary();
}

function setPaymentMethod(method) {
  state.paymentMethod = method;
  updatePaymentMethodUI();
}

function updatePaymentMethodUI() {
  const methods = ['cod', 'vietqr', 'momo', 'zalopay', 'vnpay'];
  methods.forEach(m => {
    const el = document.getElementById(`pay-method-${m}`);
    const radio = document.getElementById(`radio-pay-${m}`);
    if (el && radio) {
      if (m === state.paymentMethod) {
        el.classList.add('border-blue-600', 'bg-blue-50/50');
        el.classList.remove('border-slate-200');
        radio.checked = true;
      } else {
        el.classList.remove('border-blue-600', 'bg-blue-50/50');
        el.classList.add('border-slate-200');
        radio.checked = false;
      }
    }
  });

  const vietqrBox = document.getElementById('vietqr-box');
  if (vietqrBox) {
    vietqrBox.classList.toggle('hidden', state.paymentMethod !== 'vietqr');
  }
}

function updateVietQRDisplay(amount) {
  const qrImg = document.getElementById('vietqr-image');
  const transferDesc = document.getElementById('vietqr-transfer-desc');
  const transferAmount = document.getElementById('vietqr-amount');
  
  const orderRef = 'TT' + Math.floor(100000 + Math.random() * 900000);
  const accountNo = '888899996868';
  const accountName = 'CONG TY TNHH TM DV CN THUONG TOC';
  const bankCode = 'MB';
  
  if (transferDesc) transferDesc.textContent = `${orderRef}`;
  if (transferAmount) transferAmount.textContent = formatCurrency(amount);

  if (qrImg) {
    const qrUrl = `https://api.vietqr.io/image/${bankCode}-${accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(orderRef + ' THUONG TOC')}&accountName=${encodeURIComponent(accountName)}`;
    qrImg.src = qrUrl;
  }
}

function renderVoucherSelector() {
  const container = document.getElementById('vouchers-chips-container');
  if (!container) return;

  container.innerHTML = Object.values(DISCOUNT_VOUCHERS).map(voucher => {
    const isSelected = state.appliedVoucher === voucher.code;
    return `
      <div 
        onclick="toggleVoucherCode('${voucher.code}')" 
        class="voucher-ticket cursor-pointer p-2.5 flex items-center justify-between gap-2 ${isSelected ? 'active-voucher' : ''}"
      >
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'} flex items-center justify-center text-xs font-bold">
            <i class="fas fa-ticket"></i>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-black text-slate-800 font-mono">${voucher.code}</span>
              <span class="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">${voucher.label}</span>
            </div>
            <p class="text-[10px] text-slate-500 mt-0.5">${voucher.desc}</p>
          </div>
        </div>
        <button type="button" class="text-xs font-bold px-2.5 py-1 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600 hover:bg-blue-50'} transition">
          ${isSelected ? 'Đã Chọn' : 'Dùng Ngay'}
        </button>
      </div>
    `;
  }).join('');
}

function toggleVoucherCode(code) {
  if (state.appliedVoucher === code) {
    state.appliedVoucher = null;
    showToast('Đã hủy áp dụng mã giảm giá', 'info');
  } else {
    applyVoucher(code);
  }
  renderCheckoutSummary();
  renderVoucherSelector();
}

function applyVoucher(customCode = null) {
  const input = document.getElementById('voucher-input');
  const code = (customCode || (input ? input.value : '')).trim().toUpperCase();

  if (!code) {
    showToast('Vui lòng chọn hoặc nhập mã giảm giá', 'warning');
    return;
  }

  if (DISCOUNT_VOUCHERS[code]) {
    const voucher = DISCOUNT_VOUCHERS[code];
    const { subtotal } = calculateCartTotals();
    if (subtotal < voucher.minOrder) {
      showToast(`Mã ${code} yêu cầu đơn hàng từ ${formatCurrency(voucher.minOrder)}!`, 'warning');
      return;
    }
    state.appliedVoucher = code;
    if (input) input.value = code;
    showToast(`Áp dụng thành công voucher ${code}: ${voucher.desc}!`);
    renderCheckoutSummary();
    renderVoucherSelector();
  } else {
    showToast('Mã ưu đãi không hợp lệ!', 'warning');
  }
}

// Handle Order Submit
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const address = document.getElementById('checkout-address')?.value.trim();
  const region = document.getElementById('checkout-region')?.value;
  const ward = document.getElementById('checkout-ward')?.value;
  const note = document.getElementById('checkout-note')?.value.trim();

  if (!name || !phone || !address) {
    showToast('Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ nhận hàng!', 'warning');
    return;
  }

  const items = state.quickBuyItem ? [state.quickBuyItem] : [...state.cart];
  if (items.length === 0) {
    showToast('Giỏ hàng trống!', 'warning');
    return;
  }

  const totals = calculateCartTotals();
  const orderId = 'TT-' + Math.floor(10000 + Math.random() * 90000);
  
  const newOrder = {
    orderId,
    name,
    phone,
    address: `${address}, ${ward ? ward + ', ' : ''}${region === 'bienhoa' ? 'TP. Biên Hòa, Đồng Nai' : 'Toàn Quốc'}`,
    items,
    totals,
    deliveryMethod: state.deliveryMethod,
    paymentMethod: state.paymentMethod,
    note,
    createdAt: new Date().toLocaleTimeString('vi-VN') + ' • ' + new Date().toLocaleDateString('vi-VN'),
    status: 'Đang giao hỏa tốc 60P',
    isExpress: state.deliveryMethod === 'express_bienhoa',
    secondsRemaining: 60 * 60 // 60 minutes
  };

  // Prepend to user orders
  state.userOrders.unshift(newOrder);
  localStorage.setItem('user_orders', JSON.stringify(state.userOrders));

  // Tự động gửi thông báo đơn hàng mới tới Telegram Bot Admin
  sendTelegramNotification(newOrder);

  // Clear cart if normal purchase
  if (!state.quickBuyItem) {
    clearCart();
  } else {
    state.quickBuyItem = null;
  }

  showToast(`Đặt hàng thành công! Mã đơn: #${orderId}`, 'success');

  // Navigate to My Orders page
  navigateTo('orders');
}

// =============================================================
// 6. MY ORDERS PAGE & ORDER TRACKING
// =============================================================
function renderUserOrders() {
  const container = document.getElementById('orders-list-container');
  if (!container) return;

  state.userOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');

  if (state.userOrders.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          <i class="fas fa-box-open"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800">Bạn chưa có đơn hàng nào</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Hãy đặt ngay những phụ kiện chính hãng để trải nghiệm giao hàng siêu tốc 30-60 phút tại Biên Hòa!</p>
        <button onclick="navigateTo('shop')" class="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-md">
          Khám Phá Cửa Hàng Ngay
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.userOrders.map((order, idx) => {
    const isFirst = idx === 0 && order.isExpress;
    return `
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6 hover:border-blue-200 transition">
        <!-- Order Header -->
        <div class="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                #${order.orderId}
              </span>
              <span class="text-xs font-bold text-slate-500">${order.createdAt}</span>
            </div>
            <p class="text-xs text-slate-600 mt-1">
              Người nhận: <strong>${order.name}</strong> • ${order.phone}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${
              order.status.includes('hỏa tốc') ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
            }">
              <i class="fas fa-motorcycle mr-1"></i> ${order.status}
            </span>
          </div>
        </div>

        <!-- 60-Minute Delivery Countdown (For recent express order) -->
        ${isFirst ? `
          <div class="order-countdown-box p-4 text-white text-center border-b border-slate-800">
            <div class="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <i class="fas fa-stopwatch animate-spin"></i> CAM KẾT GIAO HỎA TỐC 60 PHÚT BIÊN HÒA
            </div>
            <div id="order-timer-${order.orderId}" class="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest my-0.5">
              59:45
            </div>
            <p class="text-[11px] text-slate-300">Shipper THƯƠNG TỐC đang vận chuyển đến: <strong>${order.address}</strong></p>
          </div>
        ` : ''}

        <!-- Order Items -->
        <div class="p-4 sm:p-5 divide-y divide-slate-100">
          ${order.items.map(item => `
            <div class="py-3 flex items-center gap-3.5 first:pt-0 last:pb-0">
              <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-slate-200 flex-shrink-0">
              <div class="flex-1 min-w-0">
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">${item.name}</h4>
                <p class="text-[11px] text-slate-500">${item.brand} • Phân loại: ${item.color} • Số lượng: x${item.quantity}</p>
                <span class="text-[10px] text-emerald-600 font-semibold"><i class="fas fa-shield-alt"></i> ${item.warranty}</span>
              </div>
              <div class="text-right">
                <span class="text-xs sm:text-sm font-extrabold text-slate-900">${formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Order Footer -->
        <div class="p-4 sm:p-5 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span class="text-slate-500">Địa chỉ:</span> <strong class="text-slate-800">${order.address}</strong><br>
            <span class="text-slate-500">Hình thức:</span> <span class="text-blue-600 font-semibold uppercase">${order.paymentMethod}</span>
          </div>
          <div class="text-right">
            <span class="text-slate-500">Tổng thanh toán:</span>
            <span class="text-base sm:text-lg font-black text-blue-600 ml-1">${formatCurrency(order.totals.finalTotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Start order clock simulation if latest order exists
  if (state.userOrders.length > 0 && state.userOrders[0].isExpress) {
    startOrderTimer(state.userOrders[0].orderId);
  }
}

function startOrderTimer(orderId) {
  if (state.orderCountdownInterval) clearInterval(state.orderCountdownInterval);
  let seconds = 59 * 60 + 45;

  state.orderCountdownInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(state.orderCountdownInterval);
      const timerEl = document.getElementById(`order-timer-${orderId}`);
      if (timerEl) timerEl.textContent = "00:00 - HÀNG ĐÃ TỚI!";
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const timerEl = document.getElementById(`order-timer-${orderId}`);
      if (timerEl) {
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }
  }, 1000);
}

// =============================================================
// 7. USER AUTHENTICATION & PROFILE MANAGEMENT
// =============================================================
function renderAccountView() {
  const profileSection = document.getElementById('account-profile-view');
  const authSection = document.getElementById('account-auth-view');

  if (!profileSection || !authSection) return;

  if (state.currentUser) {
    profileSection.classList.remove('hidden');
    authSection.classList.add('hidden');

    document.getElementById('profile-name').textContent = state.currentUser.name;
    document.getElementById('profile-phone').textContent = state.currentUser.phone || '0988.***.666';
    document.getElementById('profile-email').textContent = state.currentUser.email || 'khachhang@thuongtoc.vn';
    document.getElementById('profile-orders-count').textContent = state.userOrders.length;
  } else {
    profileSection.classList.add('hidden');
    authSection.classList.remove('hidden');
  }

  updateHeaderUserUI();
}

function updateHeaderUserUI() {
  const headerBtn = document.getElementById('header-account-btn');
  if (!headerBtn) return;

  if (state.currentUser) {
    headerBtn.innerHTML = `
      <div class="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
        <i class="fas fa-user-check text-blue-600"></i>
        <span>Hi, ${state.currentUser.name.split(' ').pop()}</span>
      </div>
    `;
  } else {
    headerBtn.innerHTML = `
      <div class="flex items-center gap-1.5 text-slate-700 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition">
        <i class="fas fa-user"></i>
        <span>Tài Khoản</span>
      </div>
    `;
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const phone = document.getElementById('login-phone')?.value.trim();
  const pass = document.getElementById('login-password')?.value.trim();

  if (!phone || !pass) {
    showToast('Vui lòng nhập số điện thoại và mật khẩu!', 'warning');
    return;
  }

  // Find user in registered list or create session
  let user = state.registeredUsers.find(u => u.phone === phone);
  if (!user) {
    user = {
      name: phone.endsWith('88') ? 'Nguyễn Văn Hiệu' : 'Khách Hàng THƯƠNG TỐC',
      phone: phone,
      email: `${phone}@thuongtoc.vn`
    };
  }

  state.currentUser = user;
  localStorage.setItem('current_user', JSON.stringify(user));
  showToast(`Xin chào mừng ${user.name}! Đăng nhập thành công.`);
  renderAccountView();
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value.trim();
  const phone = document.getElementById('reg-phone')?.value.trim();
  const pass = document.getElementById('reg-password')?.value.trim();

  if (!name || !phone || !pass) {
    showToast('Vui lòng điền đầy đủ thông tin đăng ký!', 'warning');
    return;
  }

  const newUser = { name, phone, email: `${phone}@thuongtoc.vn` };
  state.registeredUsers.push(newUser);
  localStorage.setItem('registered_users', JSON.stringify(state.registeredUsers));

  state.currentUser = newUser;
  localStorage.setItem('current_user', JSON.stringify(newUser));

  showToast(`Đăng ký thành công! Chào mừng ${name}.`);
  renderAccountView();
}

function logoutUser() {
  state.currentUser = null;
  localStorage.removeItem('current_user');
  showToast('Đã đăng xuất tài khoản', 'info');
  renderAccountView();
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-reg-form');
  const btnLogin = document.getElementById('tab-btn-login');
  const btnReg = document.getElementById('tab-btn-register');

  if (tab === 'login') {
    loginForm?.classList.remove('hidden');
    regForm?.classList.add('hidden');
    btnLogin?.classList.replace('text-slate-500', 'text-blue-600');
    btnLogin?.classList.add('border-b-2', 'border-blue-600');
    btnReg?.classList.remove('border-b-2', 'border-blue-600');
    btnReg?.classList.add('text-slate-500');
  } else {
    regForm?.classList.remove('hidden');
    loginForm?.classList.add('hidden');
    btnReg?.classList.replace('text-slate-500', 'text-blue-600');
    btnReg?.classList.add('border-b-2', 'border-blue-600');
    btnLogin?.classList.remove('border-b-2', 'border-blue-600');
    btnLogin?.classList.add('text-slate-500');
  }
}

// =============================================================
// 8. LIVE CHAT WIDGET
// =============================================================
function toggleChatWidget() {
  const chatBox = document.getElementById('chat-widget-box');
  if (chatBox) chatBox.classList.toggle('hidden');
}

function sendChatMessage(text) {
  const input = document.getElementById('chat-user-input');
  const messageText = text || input?.value.trim();
  if (!messageText) return;

  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'flex justify-end mb-3';
  userBubble.innerHTML = `
    <div class="bg-blue-600 text-white text-xs rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[80%] shadow-sm">
      ${messageText}
    </div>
  `;
  container.appendChild(userBubble);
  if (input) input.value = '';
  container.scrollTop = container.scrollHeight;

  // Bot response simulation
  setTimeout(() => {
    let reply = 'Dạ, THƯƠNG TỐC xin chào bạn! Đội ngũ tư vấn hỏa tốc Biên Hòa sẵn sàng hỗ trợ bạn ngay qua hotline 1900-6868 hoặc bạn để lại SĐT nhé!';
    const lower = messageText.toLowerCase();

    if (lower.includes('1 giờ') || lower.includes('hỏa tốc') || lower.includes('biên hòa') || lower.includes('bao lâu')) {
      reply = '⚡ THƯƠNG TỐC cam kết giao hàng trong 30–60 phút tại toàn bộ nội thành TP. Biên Hòa (Trảng Dài, Tân Phong, Tam Hiệp, Hố Nai...). Đơn từ 200k được miễn phí ship hoàn toàn ạ!';
    } else if (lower.includes('bảo hành') || lower.includes('1 đổi 1')) {
      reply = '🛡️ Toàn bộ phụ kiện tại THƯƠNG TỐC đều được Bảo hành 1 đổi 1 tận nhà suốt 12 tháng! Khi phát sinh lỗi, kỹ thuật viên sẽ mang sản phẩm mới tinh đến đổi tận nơi cho bạn trong 60 phút.';
    } else if (lower.includes('củ sạc') || lower.includes('iphone') || lower.includes('65w') || lower.includes('ugreen')) {
      reply = '🔋 Dòng Củ GaN 65W Ugreen Nexode 3 cổng hiện đang giảm Flash Sale chỉ còn 299.000đ (giá gốc 590k), sạc nhanh MacBook và iPhone 16 siêu mát máy ạ!';
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'flex justify-start mb-3 items-start gap-2';
    botBubble.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">
        <i class="fas fa-bolt"></i>
      </div>
      <div class="bg-slate-100 text-slate-800 text-xs rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[80%] shadow-sm leading-relaxed">
        ${reply}
      </div>
    `;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  }, 500);
}

// =============================================================
// 9. FLASH SALE COUNTDOWN (BANNER & PAGE)
// =============================================================
function startFlashSaleTimer() {
  let seconds = 2 * 3600 + 45 * 60 + 15;
  const hEl = document.getElementById('fs-hours');
  const mEl = document.getElementById('fs-mins');
  const sEl = document.getElementById('fs-secs');

  const pageH = document.getElementById('fspage-hours');
  const pageM = document.getElementById('fspage-mins');
  const pageS = document.getElementById('fspage-secs');

  setInterval(() => {
    seconds--;
    if (seconds <= 0) seconds = 3 * 3600;

    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');

    if (hEl && mEl && sEl) {
      hEl.textContent = h;
      mEl.textContent = m;
      sEl.textContent = s;
    }
    if (pageH && pageM && pageS) {
      pageH.textContent = h;
      pageM.textContent = m;
      pageS.textContent = s;
    }
  }, 1000);
}

// Hero Slider
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let current = 0;
  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('opacity-100', i === index);
      s.classList.toggle('opacity-0', i !== index);
      s.classList.toggle('pointer-events-auto', i === index);
      s.classList.toggle('pointer-events-none', i !== index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('bg-blue-600', i === index);
      d.classList.toggle('w-8', i === index);
      d.classList.toggle('bg-white/50', i !== index);
      d.classList.toggle('w-2.5', i !== index);
    });
    current = index;
  }

  window.goToSlide = showSlide;
  window.nextSlide = () => showSlide((current + 1) % slides.length);
  window.prevSlide = () => showSlide((current - 1 + slides.length) % slides.length);

  setInterval(() => {
    window.nextSlide();
  }, 6000);
}

// =============================================================
// 10. INITIALIZATION
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Check initial route from hash
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash);

  updateCartBadge();
  updateHeaderUserUI();
  startFlashSaleTimer();
  initHeroSlider();

  // Search input listeners
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }

  // Sort select listener
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => handleSortChange(e.target.value));
  }

  // Checkout form submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Populate Biên Hòa Wards dropdown
  const wardSelect = document.getElementById('checkout-ward');
  if (wardSelect) {
    wardSelect.innerHTML = `<option value="">-- Chọn Phường (Nội thành Biên Hòa) --</option>` +
      BIEN_HOA_WARDS.map(w => `<option value="${w.name}">${w.name} (Giao ~${w.eta})</option>`).join('');
  }

  // Chat Enter listener
  const chatInput = document.getElementById('chat-user-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
});

function copyToClipboard(text, msg = 'Đã sao chép!') {
  navigator.clipboard.writeText(text).then(() => showToast(msg));
}
