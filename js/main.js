document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".menu-items a");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuItems = document.querySelectorAll(".food-menu-item");
  const searchInput = document.getElementById("menu-search");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contact-form");
  const toast = document.getElementById("toast");
  const sections = document.querySelectorAll("section[id], footer");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutButton = document.getElementById("logout-button");
  const dashboardName = document.getElementById("dashboard-username");
  const dashboardEmail = document.getElementById("dashboard-email");
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("checkout-btn");
  const navProfile = document.getElementById("nav-profile");
  const profileIconBtn = document.getElementById("profile-icon-btn");
  const profileIconInitials = document.getElementById("profile-icon-initials");
  const profilePanel = document.getElementById("profile-panel");
  const closeProfilePanel = document.getElementById("close-profile-panel");
  const panelProfileName = document.getElementById("panel-profile-name");
  const panelProfileEmail = document.getElementById("panel-profile-email");
  const panelProfileInitials = document.getElementById("panel-profile-initials");
  const profileOrderCount = document.getElementById("profile-order-count");
  const profileLogoutBtn = document.getElementById("profile-logout-btn");
  const authActions = document.getElementById("auth-actions");

  function closeMenu() {
    if (menuToggle && menuToggle.checked) {
      menuToggle.checked = false;
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

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

  sections.forEach((section) => {
    observer.observe(section);
  });

  let activeCategory = "all";

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
      activeCategory = this.dataset.filter;
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

  function showToast(message, isError = false) {
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.remove("hidden");
    window.setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  }

  const userStorageKey = "sedUser";
  const sessionStorageKey = "sedLoggedUser";
  const cartStorageKey = "sedCart";

  function getUser() {
    const stored = localStorage.getItem(userStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  function saveUser(user) {
    localStorage.setItem(userStorageKey, JSON.stringify(user));
  }

  function setLoggedUser(user) {
    localStorage.setItem(sessionStorageKey, JSON.stringify({ name: user.name, email: user.email }));
  }

  function getLoggedUser() {
    const stored = localStorage.getItem(sessionStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  function logout() {
    localStorage.removeItem(sessionStorageKey);
    localStorage.removeItem(cartStorageKey);
    window.location.href = "login.html";
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

  function updateNavbar() {
    const loggedUser = getLoggedUser();
    if (authActions) {
      if (loggedUser) {
        authActions.style.display = "none";
        if (navProfile) {
          navProfile.style.display = "flex";
        }
        if (panelProfileName) {
          panelProfileName.textContent = loggedUser.name || "User";
        }
        if (panelProfileEmail) {
          panelProfileEmail.textContent = loggedUser.email || "user@example.com";
        }
        if (panelProfileInitials) {
          panelProfileInitials.textContent = (loggedUser.name || "U").trim().charAt(0).toUpperCase();
        }
        if (profileIconInitials) {
          profileIconInitials.textContent = (loggedUser.name || "U").trim().charAt(0).toUpperCase();
        }
      } else {
        authActions.style.display = "flex";
        if (navProfile) {
          navProfile.style.display = "none";
        }
      }
    }
  }

  redirectIfAlreadyLoggedIn();
  protectDashboard();
  updateNavbar();

  if (dashboardName && dashboardEmail) {
    const user = getLoggedUser();
    if (user) {
      dashboardName.textContent = user.name || "Customer";
      dashboardEmail.textContent = `Email: ${user.email}`;
    }
  }

  // Cart functionality
  let cart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];

  function updateCartDisplay() {
    if (cartItems) {
      cartItems.innerHTML = "";
      let total = 0;
      cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>₹${item.price} x ${item.quantity}</p>
          </div>
          <div class="cart-item-controls">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
            <button onclick="removeFromCart(${index})">Remove</button>
          </div>
        `;
        cartItems.appendChild(itemDiv);
        total += item.price * item.quantity;
      });
      if (cartTotal) cartTotal.textContent = `₹${total}`;
      if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (profileOrderCount) profileOrderCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  }

  window.changeQuantity = function(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    updateCartDisplay();
  };

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    updateCartDisplay();
  };

  function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price: parseInt(price), quantity: 1 });
    }
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    updateCartDisplay();
    showToast(`${name} added to cart!`);
  }

  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const loggedUser = getLoggedUser();
      if (!loggedUser) {
        showToast("Please login to add items to cart.", true);
        return;
      }
      const name = this.dataset.name;
      const price = this.dataset.price;
      addToCart(name, price);
    });
  });

  if (cartBtn) {
    cartBtn.addEventListener("click", function() {
      if (cartModal) cartModal.style.display = "flex";
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", function() {
      if (cartModal) cartModal.style.display = "none";
    });
  }

  if (cartModal) {
    cartModal.addEventListener("click", function(e) {
      if (e.target === cartModal) {
        cartModal.style.display = "none";
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      if (cart.length === 0) {
        showToast("Your cart is empty.", true);
        return;
      }

      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      if (!selectedPayment) {
        showToast("Please select a payment method.", true);
        return;
      }

      const paymentMethod = selectedPayment.value;
      let message = "";

      switch (paymentMethod) {
        case "card":
          message = "Redirecting to secure payment gateway...";
          // Simulate payment processing
          setTimeout(() => {
            showToast("Payment successful! Order placed.");
            completeOrder();
          }, 2000);
          break;
        case "upi":
          message = "Redirecting to UPI app...";
          setTimeout(() => {
            showToast("UPI payment successful! Order placed.");
            completeOrder();
          }, 1500);
          break;
        case "cod":
          message = "Order placed successfully! Pay cash on delivery.";
          completeOrder();
          break;
        case "wallet":
          message = "Redirecting to digital wallet...";
          setTimeout(() => {
            showToast("Wallet payment successful! Order placed.");
            completeOrder();
          }, 1800);
          break;
      }

      showToast(message);
    });
  }

  function completeOrder() {
    cart = [];
    localStorage.removeItem(cartStorageKey);
    updateCartDisplay();
    if (cartModal) cartModal.style.display = "none";
  }

  // Profile panel
  if (profileIconBtn) {
    profileIconBtn.addEventListener("click", function() {
      if (profilePanel) {
        profilePanel.classList.remove("hidden");
      }
    });
  }

  if (closeProfilePanel) {
    closeProfilePanel.addEventListener("click", function() {
      if (profilePanel) {
        profilePanel.classList.add("hidden");
      }
    });
  }

  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", function() {
      logout();
    });
  }

  if (profilePanel) {
    profilePanel.addEventListener("click", function(e) {
      if (e.target === profilePanel) {
        profilePanel.classList.add("hidden");
      }
    });
  }

  updateCartDisplay();

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const savedUser = getUser();

      if (!email || !password) {
        showToast("Enter both email and password.", true);
        return;
      }

      if (!savedUser || savedUser.email !== email) {
        showToast("No account found with this email.", true);
        return;
      }

      if (savedUser.password !== password) {
        showToast("Incorrect password. Please try again.", true);
        return;
      }

      setLoggedUser(savedUser);
      showToast("Login successful! Redirecting...");
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value.trim();
      const passwordConfirm = document.getElementById("register-password-confirm").value.trim();
      const savedUser = getUser();

      if (!name || !email || !password || !passwordConfirm) {
        showToast("Fill in all fields to register.", true);
        return;
      }

      if (password !== passwordConfirm) {
        showToast("Passwords do not match.", true);
        return;
      }

      if (savedUser && savedUser.email === email) {
        showToast("This email is already registered.", true);
        return;
      }

      saveUser({ name, email, password });
      showToast("Account created successfully! Redirecting to login...");
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showToast("Please complete all fields before submitting.", true);
        return;
      }

      showToast("Thank you! Your message has been submitted.");
      contactForm.reset();
    });
  }
});
