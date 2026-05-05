const userStorageKey = "sedUser";
const sessionStorageKey = "sedLoggedUser";
const cartStorageKey = "sedCart";
const orderHistoryKey = "sedOrderHistory";
const favoritesKey = "sedFavorites";

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".menu-items a");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuItems = document.querySelectorAll(".food-menu-item");
  const searchInput = document.getElementById("menu-search");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contact-form");
  const toast = document.getElementById("toast");
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("checkout-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutButton = document.getElementById("logout-button");
  const themeToggle = document.getElementById("theme-toggle");
  const profileIconBtn = document.getElementById("profile-icon-btn");
  const profilePanel = document.getElementById("profile-panel");
  const closeProfilePanel = document.getElementById("close-profile-panel");
  const panelProfileName = document.getElementById("panel-profile-name");
  const panelProfileEmail = document.getElementById("panel-profile-email");
  const profileIconInitials = document.getElementById("profile-icon-initials");
  const profileOrderCount = document.getElementById("profile-order-count");
  const authActions = document.getElementById("auth-actions");
  const navProfile = document.getElementById("nav-profile");
  const profileIconInitialsHolder = document.getElementById("profile-icon-initials");
  let activeCategory = "all";
  let cart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];

  function getUser() {
    const stored = localStorage.getItem(userStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  function saveUser(user) {
    localStorage.setItem(userStorageKey, JSON.stringify(user));
  }

  function getLoggedUser() {
    const stored = localStorage.getItem(sessionStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  function setLoggedUser(user) {
    localStorage.setItem(sessionStorageKey, JSON.stringify({ name: user.name, email: user.email }));
  }

  function logout() {
    localStorage.removeItem(sessionStorageKey);
    window.location.href = "login.html";
  }

  function showToast(message, isError = false) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.remove("hidden");
    window.setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  initializeTheme();

  function closeMenu() {
    if (menuToggle && menuToggle.checked) {
      menuToggle.checked = false;
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const sections = document.querySelectorAll("section[id], footer");

  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.55,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const navLink = document.querySelector(`.menu-items a[href="#${sectionId}"]`);
        if (navLink) {
          navLink.classList.toggle("active-link", entry.isIntersecting);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    menuItems.forEach((item) => {
      const category = item.dataset.category || "all";
      const title = (item.dataset.name || "").toLowerCase();
      const matchesCategory = activeCategory === "all" || category === activeCategory;
      const matchesSearch = title.includes(searchTerm);
      item.style.display = matchesCategory && matchesSearch ? "flex" : "none";
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      activeCategory = this.dataset.filter || "all";
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  window.addEventListener("scroll", function () {
    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 450);
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showToast("Please fill in all contact fields.", true);
        return;
      }

      showToast("Message sent! We will reply soon.");
      contactForm.reset();
    });
  }

  function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }

  function updateCartCount() {
    if (!cartCount) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  function renderCart() {
    if (!cartItems || !cartTotal) return;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.textContent = "₹0";
      return;
    }

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const container = document.createElement("div");
      container.className = "cart-item";
      container.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button class="cart-remove" data-index="${index}">-</button>
          <button class="cart-add" data-index="${index}">+</button>
        </div>
      `;
      cartItems.appendChild(container);
    });

    cartTotal.textContent = `₹${total}`;

    cartItems.querySelectorAll(".cart-remove").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        if (cart[index]) {
          cart[index].quantity -= 1;
          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }
          saveCart();
          updateCartCount();
          renderCart();
          updateProfileOrderCount();
        }
      });
    });

    cartItems.querySelectorAll(".cart-add").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        if (cart[index]) {
          cart[index].quantity += 1;
          saveCart();
          updateCartCount();
          renderCart();
          updateProfileOrderCount();
        }
      });
    });
  }

  function openCart() {
    if (!cartModal) return;
    cartModal.style.display = "flex";
    renderCart();
  }

  function closeCartModal() {
    if (!cartModal) return;
    cartModal.style.display = "none";
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  if (closeCart) {
    closeCart.addEventListener("click", closeCartModal);
  }

  if (cartModal) {
    cartModal.addEventListener("click", function (event) {
      if (event.target === cartModal) {
        closeCartModal();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        showToast("Add items to your cart before checkout.", true);
        return;
      }
      showToast("Checkout complete. Your order is on the way!");
      cart = [];
      saveCart();
      updateCartCount();
      renderCart();
      closeCartModal();
    });
  }

  function addToCart(itemName, itemPrice) {
    const loggedUser = getLoggedUser();
    if (!loggedUser) {
      showToast("Please login to add items to the cart.", true);
      return;
    }

    const existing = cart.find((item) => item.name === itemName);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    showToast(`${itemName} added to cart`);
  }

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const itemName = button.dataset.name;
      const itemPrice = Number(button.dataset.price || 0);
      addToCart(itemName, itemPrice);
    });
  });

  function getFavorites() {
    const loggedUser = getLoggedUser();
    if (!loggedUser) return [];
    const allFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || {};
    return allFavorites[loggedUser.email] || [];
  }

  function saveFavorites(favorites) {
    const loggedUser = getLoggedUser();
    if (!loggedUser) return;
    const allFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || {};
    allFavorites[loggedUser.email] = favorites;
    localStorage.setItem(favoritesKey, JSON.stringify(allFavorites));
  }

  function updateFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll(".favorite-btn").forEach((button) => {
      const itemName = button.dataset.name;
      const isFavorited = favorites.some((item) => item.name === itemName);
      button.classList.toggle("favorited", isFavorited);
    });
  }

  function toggleFavorite(itemName, itemPrice) {
    const loggedUser = getLoggedUser();
    if (!loggedUser) {
      showToast("Please login to add favorites.", true);
      return;
    }
    const favorites = getFavorites();
    const existingIndex = favorites.findIndex((item) => item.name === itemName);
    if (existingIndex > -1) {
      favorites.splice(existingIndex, 1);
      showToast(`${itemName} removed from favorites`);
    } else {
      favorites.push({ name: itemName, price: itemPrice });
      showToast(`${itemName} added to favorites`);
    }
    saveFavorites(favorites);
    updateFavoriteButtons();
  }

  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const itemName = button.dataset.name;
      const itemPrice = Number(button.dataset.price || 0);
      toggleFavorite(itemName, itemPrice);
    });
  });

  function updateProfileOrderCount() {
    const loggedUser = getLoggedUser();
    if (!loggedUser || !profileOrderCount) return;
    const orderHistory = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
    const userOrders = orderHistory.filter((order) => order.userEmail === loggedUser.email);
    profileOrderCount.textContent = userOrders.length;
  }

  function updateNavbar() {
    const loggedUser = getLoggedUser();
    if (authActions) {
      authActions.style.display = loggedUser ? "none" : "flex";
    }
    if (navProfile) {
      navProfile.style.display = loggedUser ? "flex" : "none";
    }
    if (loggedUser) {
      if (profileIconInitialsHolder) {
        profileIconInitialsHolder.textContent = loggedUser.name.trim().charAt(0).toUpperCase();
      }
      if (panelProfileName) {
        panelProfileName.textContent = loggedUser.name;
      }
      if (panelProfileEmail) {
        panelProfileEmail.textContent = loggedUser.email;
      }
      updateFavoriteButtons();
      updateProfileOrderCount();
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  if (profileIconBtn) {
    profileIconBtn.addEventListener("click", function () {
      if (!profilePanel) return;
      profilePanel.classList.toggle("hidden");
    });
  }

  if (closeProfilePanel) {
    closeProfilePanel.addEventListener("click", function () {
      if (!profilePanel) return;
      profilePanel.classList.add("hidden");
    });
  }

  function redirectIfAlreadyLoggedIn() {
    const currentPage = window.location.pathname.split("/").pop();
    const loggedUser = getLoggedUser();
    if (loggedUser && (currentPage === "login.html" || currentPage === "register.html")) {
      window.location.href = "user.html";
    }
  }

  function protectDashboard() {
    const currentPage = window.location.pathname.split("/").pop();
    const loggedUser = getLoggedUser();
    if (currentPage === "user.html" && !loggedUser) {
      window.location.href = "login.html";
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const user = getUser();
      if (!user || user.email !== email || user.password !== password) {
        showToast("Invalid credentials. Please try again.", true);
        return;
      }
      setLoggedUser(user);
      updateNavbar();
      window.location.href = "user.html";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value.trim();
      const passwordConfirm = document.getElementById("register-password-confirm").value.trim();
      if (!name || !email || !password || !passwordConfirm) {
        showToast("Please fill in all register fields.", true);
        return;
      }
      if (password !== passwordConfirm) {
        showToast("Passwords do not match.", true);
        return;
      }
      const existingUser = getUser();
      if (existingUser && existingUser.email === email) {
        showToast("This email is already registered.", true);
        return;
      }
      const user = { name, email, password, registeredAt: new Date().toISOString() };
      saveUser(user);
      setLoggedUser(user);
      updateNavbar();
      window.location.href = "user.html";
    });
  }

  redirectIfAlreadyLoggedIn();
  protectDashboard();
  updateNavbar();
  updateCartCount();
  renderCart();
});
