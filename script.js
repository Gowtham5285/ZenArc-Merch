let products = [];
let favorites = [];

/* ---------- AUTH HELPERS ---------- */
function getUser(){
  return JSON.parse(localStorage.getItem("user")) || null;
}

function requireAuth(){
  const user = getUser();
  if(!user){
    alert("Please login to continue");
    window.location.href = "login.html";
  }
}
function requireAdmin(){
  const user = getUser();

  if(!user){
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  if(user.role !== "admin"){
    alert("Access denied — Admins only");
    window.location.href = "index.html";
  }
}


function setUserUI(){
  const user = getUser();
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  if(user){
    if(userName) userName.textContent = `👤 ${user.name}`;
    if(logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if(userName) userName.textContent = "";
    if(logoutBtn) logoutBtn.style.display = "none";
  }
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  alert("Logged out successfully");
  window.location.href = "login.html";
});

/* ---------- DOM ---------- */
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");

/* ---------- LOAD PRODUCTS FROM JSON SERVER ---------- */
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    products = await res.json();
    renderProducts();
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

/* ---------- FAVORITES STORAGE ---------- */
function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

/* ---------- FAVOURITES COUNT ---------- */
function updateFavCount() {
  const favCount = document.getElementById("favCount");
  if (favCount) favCount.textContent = favorites.length;
}

/* ---------- SEARCH ---------- */
function matchesSearch(product) {
  const search = searchInput?.value.trim().toLowerCase() || "";
  if (!search) return true;

  const text = (
    product.name + " " +
    product.category + " " +
    (product.badge || "")
  ).toLowerCase();

  return text.includes(search);
}

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  if (!grid) return; // ignore when not on index.html

  grid.innerHTML = "";
  const category = categoryFilter?.value || "all";

  products
    .filter(matchesSearch)
    .filter(p => category === "all" || p.category === category)
    .forEach(p => {

      const card = document.createElement("div");
      card.className = "product-card";
      card.style.cursor = "pointer";

      // open product details page
      card.onclick = () => {
        window.location.href = `product.html?id=${p.id}`;
      };

      card.innerHTML = `
        <span class="badge">${p.badge}</span>
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>

        <div class="actions">
          <button class="add-btn">Add to Cart</button>
          <button class="fav-btn">${favorites.includes(p.name) ? "❤️" : "♡"}</button>
        </div>
      `;

      // stop redirect when clicking buttons
      card.querySelector(".add-btn").onclick = (e) => {
        e.stopPropagation();
        addToCart(p);
      };

      card.querySelector(".fav-btn").onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(p.name, e.target);
      };

      grid.appendChild(card);
    });
}

/* ---------- CART ---------- */
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(i => i.name === product.name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((s, i) => s + i.qty, 0);

  if (cartCount) {
    cartCount.textContent = total;
  }
}

/* ---------- FAVORITES ---------- */
function toggleFavorite(name, btn) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(item => item !== name);
    btn.textContent = "♡";
  } else {
    favorites.push(name);
    btn.textContent = "❤️";
  }

  saveFavorites();
  updateFavCount();
}

/* ---------- NAV BUTTONS ---------- */
document.getElementById("cartBtn")?.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) return alert("🛒 Your cart is empty!");
  window.location.href = "cart.html";
});

document.getElementById("favBtn")?.addEventListener("click", () => {
  window.location.href = "favourites.html";
});

/* ---------- EVENTS ---------- */
searchInput?.addEventListener("input", renderProducts);
categoryFilter?.addEventListener("change", renderProducts);

/* ---------- INIT ---------- */
requireAuth();      // 🔒 block page if not logged in
loadFavorites();
updateFavCount();
loadProducts();
updateCartCount();
setUserUI();        // 👤 show username + logout
