// Load products again (from JSON Server) only for this page
async function loadFavPage(){
  try{
    const res = await fetch("http://localhost:3000/products");
    const products = await res.json();
    renderFavourites(products);
  }catch(e){
    console.error("Failed to load favourites page products", e);
  }
}

function renderFavourites(products){
  const favList = document.getElementById("favList");
  favList.innerHTML = "";

  // --- Condition 1: No favourites stored ---
  if(favorites.length === 0){
    favList.innerHTML = `
      <div class="empty-box">
        <div class="empty-icon">💗</div>
        <p>No favourites yet ❤️</p>

        <button class="browse-btn" onclick="window.location.href='index.html'">
          Browse Products
        </button>
      </div>
    `;
    return;
  }

  // --- Condition 2: Show only favourite products ---
  const favProducts = products.filter(p => favorites.includes(p.name));

  favProducts.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p class="price">₹${p.price}</p>

      <div class="actions">
        <button class="add-cart">Add to Cart</button>
        <button class="remove-fav">Remove ❌</button>
      </div>
    `;

    // Add to cart + redirect to cart.html
    card.querySelector(".add-cart").onclick = ()=>{
      addToCart(p);
      window.location.href = "cart.html";
    };

    // Remove from favourites + re-render
    card.querySelector(".remove-fav").onclick = ()=>{
      favorites = favorites.filter(n => n !== p.name);
      saveFavorites();
      renderFavourites(products);
    };

    favList.appendChild(card);
  });
}

loadFavPage();
