
// ========================================
// VARIABLES GLOBALES
// ========================================
let products = [];
let filteredProducts = [];
let cart = [];
let favorites = [];

// EXTRA - Recuperar favoritos y carrito guardados al cargar la página
if (localStorage.getItem('favorites')) {
  favorites = JSON.parse(localStorage.getItem('favorites'));
}
if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
}

// ========================================
// FASE 1 - FETCH PRODUCTOS
// ========================================
function getProducts() {
  // CORRECCIÓN COMPLETA: URL con "/products" al final para recibir el JSON
  fetch("https://fakestoreapi.com/products")
    .then(res => {
      if (!res.ok) throw new Error("Error al conectar con la API");
      return res.json();
    })
    .then(data => {
      products = data;
      filteredProducts = [...data];

      renderCategories(products);
      renderProducts(products);
      renderCart(); // Renderiza el carrito si había datos guardados
    })
    .catch(error => console.error("Error fetching products:", error));
  console.log(favorites);
}

// ========================================
// FASE 1 - RENDER PRODUCTOS
// ========================================
function renderProducts(productsArray) {
  const container = document.getElementById("productsContainer");

  if (container) {
    container.innerHTML = "";
  } else {
    console.error("No se encontró el contenedor #productsContainer en el HTML.");
    return;
  }

  productsArray.forEach(product => {
    const tarjeta = document.createElement("article");
    const contenedorImagen = document.createElement("div");
    const imageProduct = document.createElement("img");
    const info = document.createElement("div");
    const categoryProduct = document.createElement("p");
    const titleProduct = document.createElement("h3");
    const priceProduct = document.createElement("p");
    const buttons = document.createElement("div");
    const addBtn = document.createElement("button");
    const favBtn = document.createElement("button");

    tarjeta.classList.add("product-card");
    contenedorImagen.classList.add("product-image");
    imageProduct.setAttribute("src", product.image);
    imageProduct.setAttribute("alt", product.description);
    info.classList.add("product-info");
    categoryProduct.classList.add("product-category");
    titleProduct.classList.add("product-title");
    priceProduct.classList.add("product-price");
    buttons.classList.add("card-actions");
    addBtn.classList.add("add-btn");
    favBtn.classList.add("fav-btn");

    categoryProduct.textContent = product.category;
    titleProduct.textContent = product.title;
    priceProduct.textContent = `${product.price} €`;
    addBtn.textContent = "Añadir";

    const esFavorito = favorites.some(fav => fav.id === product.id);
    favBtn.textContent = esFavorito ? "❤️" : "🤍";

    // Evento Favoritos
    favBtn.addEventListener('click', () => {
      const index = favorites.findIndex(fav => fav.id === product.id);
      if (index === -1) {
        favorites.push(product);
        favBtn.textContent = "❤️";
      } else {
        favorites.splice(index, 1);
        favBtn.textContent = "🤍";
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    });

    // --- FASE 3 - EVENTO CARRITO ---
    addBtn.addEventListener('click', () => {
      addToCart(product.id);
    });

    imageProduct.style.cursor = "pointer";

    imageProduct.addEventListener("click", () => {
      window.location.href =
        `detalle.html?id=${product.id}`;
    });

    contenedorImagen.appendChild(imageProduct);
    buttons.appendChild(addBtn);
    buttons.appendChild(favBtn);

    info.appendChild(categoryProduct);
    info.appendChild(titleProduct);
    info.appendChild(priceProduct);
    info.appendChild(buttons);

    tarjeta.appendChild(contenedorImagen);
    tarjeta.appendChild(info);

    container.appendChild(tarjeta);
  });
}

// ========================================
// FASE 2 - CATEGORÍAS
// ========================================
function renderCategories(productsArray) {
  const selectElement = document.getElementById("categoryFilter");
  if (!selectElement) return;

  selectElement.innerHTML = '<option value="all">Todas las categorías</option>';
  const categories = [...new Set(productsArray.map(producto => producto.category))];

  categories.forEach(categoria => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    selectElement.appendChild(opcion);
  });
}

// ========================================
// FASE 2 - FILTROS MULTIPLES
// ========================================
function filterProducts() {
  const inputSearch = document.getElementById("searchInput");
  const selectCat = document.getElementById("categoryFilter");
  const selectSort = document.getElementById("sortSelect");

  const searchTerm = inputSearch ? inputSearch.value.toLowerCase() : "";
  const selectedCategory = selectCat ? selectCat.value : "all";
  const selectedSort = selectSort ? selectSort.value : "default";

  filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedSort === "priceAsc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "priceDesc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "az") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSort === "za") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderProducts(filteredProducts);
}

// ========================================
// FASE 3 - LÓGICA DEL CARRITO
// ========================================

// 1. Agregar producto al carrito
function addToCart(productId) {
  // Comprobar si el producto ya existe en el carrito
  const cartItem = cart.find(item => item.id === productId);

  if (cartItem) {
    // Si ya existe, aumentamos su cantidad
    cartItem.quantity += 1;
  } else {
    // Si no existe, buscamos el producto original y lo añadimos con cantidad 1
    const originalProduct = products.find(p => p.id === productId);
    if (originalProduct) {
      cart.push({
        ...originalProduct,
        quantity: 1
      });
    }
  }

  // Guardar y actualizar interfaz
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// 2. Modificar cantidad de un elemento en el carrito
function updateQuantity(productId, action) {
  const cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  if (action === "increase") {
    cartItem.quantity += 1;
  } else if (action === "decrease") {
    cartItem.quantity -= 1;
    // Si la cantidad llega a 0, lo eliminamos automáticamente
    if (cartItem.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// 3. Eliminar por completo un artículo del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// 4. Pintar los elementos en el contenedor del carrito
function renderCart() {
  const cartWrapper = document.getElementById("cartContainer");
  const totalWrapper = document.getElementById("cartTotal");

  if (!cartWrapper) return;
  cartWrapper.innerHTML = "";

  let totalSum = 0;

  if (cart.length === 0) {
    cartWrapper.innerHTML = `<p class="empty-cart-msg">El carrito está vacío</p>`;
    if (totalWrapper) totalWrapper.textContent = "0.00 €";
    return;
  }

  cart.forEach(item => {
    // Crear contenedor del elemento de manera nativa
    const cartCard = document.createElement("div");
    cartCard.classList.add("cart-item");

    // Calcular el subtotal del artículo
    const itemSubtotal = item.price * item.quantity;
    totalSum += itemSubtotal;

    cartCard.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>${item.price} € x ${item.quantity} = <strong>${itemSubtotal.toFixed(2)} €</strong></p>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn dec-btn">-</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn inc-btn">+</button>
        <button class="remove-btn">🗑️</button>
      </div>
    `;

    // Capturar botones internos de la tarjeta para asignar eventos nativos
    cartCard.querySelector(".inc-btn").addEventListener("click", () => updateQuantity(item.id, "increase"));
    cartCard.querySelector(".dec-btn").addEventListener("click", () => updateQuantity(item.id, "decrease"));
    cartCard.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));

    cartWrapper.appendChild(cartCard);
  });

  // Actualizar el costo total en la interfaz
  if (totalWrapper) {
    totalWrapper.textContent = `${totalSum.toFixed(2)} €`;
  }
}

//



// ========================================
// INICIALIZACIÓN SEGURA DEL DOM
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const inputSearch = document.getElementById("searchInput");
  const selectCat = document.getElementById("categoryFilter");
  const selectSort = document.getElementById("sortSelect");

  if (inputSearch) inputSearch.addEventListener("input", filterProducts);
  if (selectCat) selectCat.addEventListener("change", filterProducts);
  if (selectSort) selectSort.addEventListener("change", filterProducts);

  getProducts();
});

// ========================================
// LOGIN + SESIÓN
// ========================================

const accountBtn = document.querySelector(".account-btn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");

// Si ya existe token guardado
if (sessionStorage.getItem("token")) {

  accountBtn.textContent = "Cerrar sesión";

  const savedUser = sessionStorage.getItem("username");

  if (savedUser && welcomeUser) {
    welcomeUser.textContent = `Bienvenido ${savedUser}`;
  }

}

// Abrir login o cerrar sesión
if (accountBtn) {

  accountBtn.addEventListener("click", () => {

    if (sessionStorage.getItem("token")) {

      sessionStorage.removeItem("token");

      accountBtn.textContent = "Mi cuenta";

      alert("Sesión cerrada");

      return;
    }

    loginModal.classList.remove("hidden");

  });

}

// Cerrar modal
if (closeLogin) {

  closeLogin.addEventListener("click", () => {

    loginModal.classList.add("hidden");

  });

}

// Login Fake Store API
if (loginForm) {

  loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("https://fakestoreapi.com/auth/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username,
        password
      })

    })
      .then(res => res.json())

      .then(data => {

        if (data.token) {

          sessionStorage.setItem("token", data.token);

          sessionStorage.setItem("username", username);

          if (welcomeUser) {
            welcomeUser.textContent = `Bienvenido ${username}`;
          }

          accountBtn.textContent = "Cerrar sesión";

          loginModal.classList.add("hidden");

        } else {

          alert("Usuario o contraseña incorrectos");

        }

      })

      .catch(error => {

        console.error(error);

        alert("Error al iniciar sesión");

      });

  });

}