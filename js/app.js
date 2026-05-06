const userStorageKey = "sedUser";
const sessionStorageKey = "sedLoggedUser";
const cartStorageKey = "sedCart";
const orderHistoryKey = "sedOrderHistory";
const favoritesKey = "sedFavorites";

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".menu-items a");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const foodMenuContainer = document.getElementById("food-menu-container");
  const viewMoreItemsBtn = document.getElementById("view-more-items-btn");
  const menuPopupModal = document.getElementById("menu-popup-modal");
  const closeMenuPopup = document.getElementById("close-menu-popup");
  const popupFilterButtons = document.querySelectorAll(".menu-popup-option");
  const menuPopupTitle = document.getElementById("menu-popup-title");
  const menuPopupSummary = document.getElementById("menu-popup-summary");
  const menuPopupGrid = document.getElementById("menu-popup-grid");
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
  let activePopupCategory = "breakfast";
  let cart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];
  const menuCatalog = {
    breakfast: {
      label: "Breakfast",
      summary: "Four breakfast picks with light, comforting flavors to start the day right.",
      items: [
        {
          name: "Sunrise Idli Sambar",
          description: "Soft idlis served with hot sambar, coconut chutney, and a fresh tempering of curry leaves.",
          price: 110,
          image: "assets/Dakshin Bhojanam.jpg",
          category: "breakfast",
        },
        {
          name: "Masala Dosa Combo",
          description: "A crisp dosa filled with spiced potato masala, paired with chutneys and a cup of sambar.",
          price: 145,
          image: "assets/Dakshin Bhojanam.jpg",
          category: "breakfast",
        },
        {
          name: "Aloo Paratha with Curd",
          description: "Golden parathas stuffed with seasoned potato, served with curd, pickle, and a pat of butter.",
          price: 135,
          image: "assets/cover photo.jpg",
          category: "breakfast",
        },
        {
          name: "Poha Chai Delight",
          description: "Fluffy poha with peanuts, onion, lemon, and a side of masala chai for a homestyle breakfast.",
          price: 95,
          image: "assets/Swad-e-dil_poster.jpg",
          category: "breakfast",
        },
      ],
    },
    veg: {
      label: "Veg",
      summary: "Four veg meals packed with rich gravies, fresh breads, and satisfying lunch favorites.",
      items: [
        {
          name: "Royal Thali Delight",
          description: "Butter naan, paneer butter masala, dal makhani, jeera rice, salad, papad, and dessert.",
          price: 350,
          image: "assets/Royal Thali Delight.jpg",
          category: "veg",
        },
        {
          name: "Paneer Butter Masala Meal",
          description: "Creamy paneer butter masala served with naan, jeera rice, onion salad, and mint dip.",
          price: 280,
          image: "assets/Veg menu dp.jpg",
          category: "veg",
        },
        {
          name: "Dakshin Bhojanam",
          description: "A South Indian veg meal with dosa, vada, lemon rice, chutneys, sambar, and mini payasam.",
          price: 250,
          image: "assets/Dakshin Bhojanam.jpg",
          category: "veg",
        },
        {
          name: "Veg Lovers Lunch Platter",
          description: "Seasonal sabzi, dal tadka, pulao, phulka, salad, and a sweet bite for a complete lunch.",
          price: 260,
          image: "assets/Veg menu dp.jpg",
          category: "veg",
        },
      ],
    },
    nonveg: {
      label: "Nonveg",
      summary: "Four nonveg specialties made for bold appetites, dinner cravings, and spice lovers.",
      items: [
        {
          name: "Tandoori Nonveg Treat",
          description: "Tandoori chicken, chicken tikka, butter naan, biryani, onion salad, and house chutney.",
          price: 450,
          image: "assets/Tandoori Plater.jpg",
          category: "nonveg",
        },
        {
          name: "Coastal Catch Seafood Plate",
          description: "A seafood combo with prawn curry, fish fry, steamed rice, tangy chutney, and sol kadhi.",
          price: 400,
          image: "assets/nonveg menu dp.jpg",
          category: "nonveg",
        },
        {
          name: "Pakhala Fish Plate",
          description: "Fermented rice, aloo bharta, saga bhaja, fried fish, and curd for an authentic Odia meal.",
          price: 340,
          image: "assets/nonveg menu dp.jpg",
          category: "nonveg",
        },
        {
          name: "Chicken Biryani Feast",
          description: "Fragrant chicken biryani with raita, salan, grilled chicken bites, and a cooling onion salad.",
          price: 320,
          image: "assets/Tandoori Plater.jpg",
          category: "nonveg",
        },
      ],
    },
    "special-thali": {
      label: "Special Thali",
      summary: "Four grand thali experiences for festive cravings, family meals, and signature house favorites.",
      items: [
        {
          name: "Signature Special Thali",
          description: "Our signature platter with paneer curry, dal, pulao, breads, salad, dessert, and chef specials.",
          price: 420,
          image: "assets/st dp.jpg",
          category: "special-thali",
        },
        {
          name: "Maharaja Celebration Thali",
          description: "A royal spread of rich curries, kebabs, rice, breads, sides, and an indulgent dessert finish.",
          price: 520,
          image: "assets/st dp.jpg",
          category: "special-thali",
        },
        {
          name: "Festival Veg Thali",
          description: "A festive vegetarian thali with paneer, kofta, pulao, puri, chutneys, and mithai.",
          price: 390,
          image: "assets/Royal Thali Delight.jpg",
          category: "special-thali",
        },
        {
          name: "Family Feast Thali",
          description: "A larger thali with multiple mains, rice, breads, condiments, and dessert made for sharing.",
          price: 580,
          image: "assets/st dp.jpg",
          category: "special-thali",
        },
      ],
    },
  };
  const featuredMenuLabels = {
    breakfast: "Breakfast",
    veg: "Lunch",
    nonveg: "Dinner",
    "special-thali": "Special Thali",
  };

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

  function getFeaturedMenuItems() {
    return ["breakfast", "veg", "nonveg", "special-thali"].map((category) => menuCatalog[category].items[0]);
  }

  function createMenuCardMarkup(item, badgeLabel) {
    return `
      <article class="food-menu-item">
        <div class="food-menu-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          <span class="food-menu-badge">${badgeLabel}</span>
        </div>
        <div class="food-description">
          <span class="food-menu-label">${menuCatalog[item.category].label}</span>
          <h3 class="food-title">${item.name}</h3>
          <p>${item.description}</p>
          <div class="food-footer">
            <p class="food-price">&#8377; ${item.price}</p>
            <div class="food-actions">
              <button class="favorite-btn" data-name="${item.name}" data-price="${item.price}" aria-label="Add ${item.name} to favorites">
                <i class="far fa-heart"></i>
              </button>
              <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderMenuCards(container, items, badgeLabelResolver) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<div class="food-menu-empty">No menu items are available in this category right now.</div>';
      return;
    }

    container.innerHTML = items.map((item) => createMenuCardMarkup(item, badgeLabelResolver(item))).join("");
    updateFavoriteButtons();
  }

  function renderFoodMenu() {
    const items = activeCategory === "all" ? getFeaturedMenuItems() : menuCatalog[activeCategory].items;
    renderMenuCards(foodMenuContainer, items, (item) => {
      return activeCategory === "all" ? featuredMenuLabels[item.category] : menuCatalog[item.category].label;
    });

    filterButtons.forEach((button) => {
      const isActive = (button.dataset.filter || "all") === activeCategory;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function renderPopupMenu(category = activePopupCategory) {
    if (!menuPopupGrid || !menuPopupTitle || !menuPopupSummary) return;

    activePopupCategory = category;
    const categoryConfig = menuCatalog[category];
    menuPopupTitle.textContent = `${categoryConfig.label} Menu`;
    menuPopupSummary.textContent = categoryConfig.summary;
    renderMenuCards(menuPopupGrid, categoryConfig.items, () => categoryConfig.label);

    popupFilterButtons.forEach((button) => {
      const isActive = button.dataset.popupFilter === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function openMenuPopup(category) {
    if (!menuPopupModal) return;
    renderPopupMenu(category);
    menuPopupModal.style.display = "flex";
    menuPopupModal.setAttribute("aria-hidden", "false");
  }

  function closeMenuPopupModal() {
    if (!menuPopupModal) return;
    menuPopupModal.style.display = "none";
    menuPopupModal.setAttribute("aria-hidden", "true");
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeCategory = this.dataset.filter || "all";
      renderFoodMenu();
    });
  });

  popupFilterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      renderPopupMenu(this.dataset.popupFilter || "breakfast");
    });
  });

  if (viewMoreItemsBtn) {
    viewMoreItemsBtn.addEventListener("click", function () {
      const popupStartCategory = activeCategory === "all" ? "breakfast" : activeCategory;
      openMenuPopup(popupStartCategory);
    });
  }

  if (closeMenuPopup) {
    closeMenuPopup.addEventListener("click", closeMenuPopupModal);
  }

  if (menuPopupModal) {
    menuPopupModal.addEventListener("click", function (event) {
      if (event.target === menuPopupModal) {
        closeMenuPopupModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenuPopupModal();
      closeCartModal();
    }
  });

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

  document.addEventListener("click", function (event) {
    const addToCartButton = event.target.closest(".add-to-cart-btn");
    if (addToCartButton) {
      const itemName = addToCartButton.dataset.name;
      const itemPrice = Number(addToCartButton.dataset.price || 0);
      addToCart(itemName, itemPrice);
      return;
    }

    const favoriteButton = event.target.closest(".favorite-btn");
    if (favoriteButton) {
      const itemName = favoriteButton.dataset.name;
      const itemPrice = Number(favoriteButton.dataset.price || 0);
      toggleFavorite(itemName, itemPrice);
    }
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
  renderFoodMenu();
  renderPopupMenu();
  updateNavbar();
  updateCartCount();
  renderCart();
});
