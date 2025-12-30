requireAuth();
requireAdmin();

const list = document.getElementById("adminProducts");
const API = "http://localhost:3000/products";

async function loadAdminProducts(){
  const res = await fetch(API);
  const data = await res.json();

  list.innerHTML = "";

  data.forEach(p => {
    const row = document.createElement("div");
    row.className = "admin-card";

    row.innerHTML = `
      <div class="card-left">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
          <span class="tag">${p.category}</span>
        </div>
      </div>

      <div class="card-actions">
        <button onclick="editProduct(${p.id})">✏ Edit</button>
        <button onclick="deleteProduct(${p.id})">🗑 Delete</button>
      </div>
    `;

    list.appendChild(row);
  });
}

async function deleteProduct(id){
  if(!confirm("Delete this product?")) return;

  await fetch(`${API}/${id}`, { method:"DELETE" });
  loadAdminProducts();
}

function editProduct(id){
  window.location.href = `edit-product.html?id=${id}`;
}

loadAdminProducts();
setUserUI();
