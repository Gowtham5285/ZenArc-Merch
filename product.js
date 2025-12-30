// 🔒 Protect page (user must be logged in)
requireAuth();

const box = document.getElementById("productDetails");
const API = "http://localhost:3000/products";

/* ---------- GET PRODUCT ID FROM URL ---------- */
const params = new URLSearchParams(location.search);
const id = params.get("id");

console.log("URL =", location.href);
console.log("Product ID =", id);

/* ---------- HANDLE MISSING ID ---------- */
if(!id){
  box.innerHTML = `
    <p style="padding:20px">❌ Invalid product link</p>
  `;
}

/* ---------- LOAD PRODUCT ---------- */
async function loadProduct(){
  try{
    console.log("Fetching:", `${API}/${id}`);

    const res = await fetch(`${API}/${id}`);
    const p = await res.json();

    // Product not found
    if(!p || !p.id){
      box.innerHTML = `
        <p style="padding:20px">❌ Product not found</p>
      `;
      return;
    }

    renderProduct(p);

  }catch(err){
    console.error("Product load failed:", err);
    box.innerHTML = `
      <p style="padding:20px">⚠ Unable to load product</p>
    `;
  }
}

/* ---------- RENDER PRODUCT UI ---------- */
function renderProduct(p){

  box.innerHTML = `
    <div class="product-detail-card">
      
      <img src="${p.img}" class="detail-img">

      <div class="detail-content">
        <h2>${p.name}</h2>
        <span class="detail-badge">${p.badge}</span>

        <p class="detail-price">₹${p.price}</p>
        <p class="detail-category">
          Category: <strong>${p.category}</strong>
        </p>

        <p class="detail-desc">
          ${p.description || "No description available yet."}
        </p>

        <div class="detail-actions">
          <button class="detail-add">🛒 Add to Cart</button>
          <button onclick="history.back()">⬅ Back</button>
        </div>
      </div>
    </div>
  `;

  // 🛒 Add to cart (uses global function from script.js)
  document.querySelector(".detail-add").addEventListener("click", () => {
    addToCart(p);
    updateCartCount();
    alert("Added to cart ✅");
  });
}

/* ---------- INIT ---------- */
loadProduct();
