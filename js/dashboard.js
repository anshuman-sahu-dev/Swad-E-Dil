const orderHistoryKey = "sedOrderHistory";
const favoritesKey = "sedFavorites";
const sessionStorageKey = "sedLoggedUser";

document.addEventListener("DOMContentLoaded", function () {
  const dashboardName = document.getElementById("dashboard-username");
  const dashboardEmail = document.getElementById("dashboard-email");
  const ordersCount = document.getElementById("orders-count");
  const favoritesCount = document.getElementById("favorites-count");
  const activeOrderStatus = document.getElementById("active-order-status");
  const memberSince = document.getElementById("member-since");
  const orderHistoryList = document.getElementById("order-history-list");
  const favoritesList = document.getElementById("favorites-list");

  function getLoggedUser() {
    const stored = localStorage.getItem(sessionStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  function getFavorites() {
    const loggedUser = getLoggedUser();
    if (!loggedUser) return [];
    const allFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || {};
    return allFavorites[loggedUser.email] || [];
  }

  function getUserOrders() {
    const loggedUser = getLoggedUser();
    if (!loggedUser) return [];
    const orderHistory = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
    return orderHistory.filter((order) => order.userEmail === loggedUser.email);
  }

  function updateDashboardHeader() {
    const user = getLoggedUser();
    if (user) {
      if (dashboardName) dashboardName.textContent = user.name;
      if (dashboardEmail) dashboardEmail.textContent = `Email: ${user.email}`;
      if (memberSince) {
        memberSince.textContent = user.registeredAt ? new Date(user.registeredAt).getFullYear() : new Date().getFullYear();
      }
    }
  }

  function updateDashboardStats() {
    const orders = getUserOrders();
    const favorites = getFavorites();
    if (ordersCount) ordersCount.textContent = orders.length;
    if (favoritesCount) favoritesCount.textContent = favorites.length;
    const activeOrder = orders.find((order) => order.status !== "Delivered") || orders[orders.length - 1];
    if (activeOrderStatus) {
      activeOrderStatus.textContent = activeOrder
        ? `${activeOrder.status} • ₹${activeOrder.total}`
        : "No active orders";
    }
  }

  function renderOrderHistory() {
    if (!orderHistoryList) return;
    const orders = getUserOrders();
    if (orders.length === 0) {
      orderHistoryList.innerHTML = "<li>No orders yet. Start ordering delicious food!</li>";
      return;
    }

    orderHistoryList.innerHTML = orders
      .slice(-5)
      .reverse()
      .map((order) => {
        const orderDate = new Date(order.date).toLocaleDateString();
        const itemsText = order.items.map((item) => `${item.name} (${item.quantity})`).join(", ");
        return `
          <li>
            <strong>${orderDate}</strong> - ₹${order.total}<br>
            <small>${itemsText}</small><br>
            <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
          </li>`;
      })
      .join("");
  }

  function renderFavorites() {
    if (!favoritesList) return;
    const favorites = getFavorites();
    if (favorites.length === 0) {
      favoritesList.innerHTML = "<li>No favorites yet. Add some delicious items from the menu!</li>";
      return;
    }

    favoritesList.innerHTML = favorites
      .map((item) => `<li>${item.name} - ₹${item.price}</li>`)
      .join("");
  }

  function simulateOrderStatusUpdates() {
    const orders = getUserOrders().filter((order) => order.status !== "Delivered");
    if (orders.length === 0) return;

    const orderHistory = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
    const recentOrder = orders[orders.length - 1];
    if (!recentOrder) return;

    const updateStatus = (currentStatus, nextStatus, message, delay) => {
      setTimeout(() => {
        const targetOrder = orderHistory.find((order) => order.id === recentOrder.id);
        if (targetOrder && targetOrder.status === currentStatus) {
          targetOrder.status = nextStatus;
          localStorage.setItem(orderHistoryKey, JSON.stringify(orderHistory));
          updateDashboardStats();
          renderOrderHistory();
        }
      }, delay);
    };

    updateStatus("Pending", "Preparing", "Your order is now being prepared.", 10000);
    updateStatus("Preparing", "Out for Delivery", "Your order is out for delivery.", 20000);
    updateStatus("Out for Delivery", "Delivered", "Your order has been delivered!", 30000);
  }

  updateDashboardHeader();
  updateDashboardStats();
  renderOrderHistory();
  renderFavorites();
  simulateOrderStatusUpdates();
});
