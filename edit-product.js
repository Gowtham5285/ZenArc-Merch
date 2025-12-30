requireAuth();
requireAdmin();

const API = "http://localhost:3000/products";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(!id){
  alert("Invalid Product");
  window.location.href = "admin.html";
}

async function loadProduct(){
  const res = await fetch(`${API}/${id}`);
  if(!res.ok){
    alert("Product not found");
    return;
  }

  const p = await res.json();

  document.getElementById("name").value = p.name || "";
  document.getElementById("price").value = p.price || "";
  document.getElementById("category").value = p.category || "";
  document.getElementById("badge").value = p.badge || "";
  document.getElementById("img").value = p.img || "";
  document.getElementById("description").value = p.description || "";
}

document.getElementById("updateBtn").addEventListener("click", async () => {

  const updated = {
    name: document.getElementById("name").value.trim(),
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    badge: document.getElementById("badge").value.trim(),
    img: document.getElementById("img").value.trim(),
    description: document.getElementById("description").value.trim()
  };

  if(!updated.name || !updated.price || !updated.category || !updated.img){
    alert("Please fill required fields");
    return;
  }

  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  if(!res.ok){
    alert("Update failed ❌");
    return;
  }

  alert("Product updated successfully 🎉");
  window.location.href = "admin.html";
});

loadProduct();
setUserUI();
