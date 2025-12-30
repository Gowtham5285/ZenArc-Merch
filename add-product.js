requireAuth();
requireAdmin();

const API = "http://localhost:3000/products";

document.getElementById("saveProduct").addEventListener("click", async () => {

  const product = {
    name: document.getElementById("name").value.trim(),
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    badge: document.getElementById("badge").value.trim(),
    img: document.getElementById("img").value.trim(),
    description: document.getElementById("description").value.trim()
  };

  console.log("📦 Product to save:", product);

  if(!product.name || !product.price || !product.category || !product.img){
    alert("Please fill all required fields");
    return;
  }

  try{
    const res = await fetch(API, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(product)
    });

    console.log("🛰 Server response:", res.status);

    if(!res.ok){
      alert("Server rejected request ❌");
      return;
    }

    alert("Product added successfully 🎉");
    window.location.href = "admin.html";

  }catch(err){
    console.error("❌ Request failed:", err);
    alert("Could not connect to API.\nIs JSON-Server running?");
  }
});

setUserUI();
