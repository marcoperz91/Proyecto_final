// ========================================
// FASE 1 - FETCH PRODUCTOS
// ========================================

function getProducts() {
  // 1. Hacemos la petición a la API de forma centralizada
  fetch("https://fakestoreapi.com/products")
    .then(res => {
      if (!res.ok) throw new Error("Error en la red");
      return res.json();
    })
    .then(data => {
      // 2. Guardamos los datos en nuestras variables globales
      products = data;
      filteredProducts = [...data]; // Copia inicial para los filtros
      
      // 3. Ejecutamos las funciones iniciales
      renderProducts(products);
      renderCategories(products);
    })
    .catch(error => console.error("Error fetching products:", error));
}

// ========================================
// FASE 1 - RENDER PRODUCTOS
// ========================================

function renderProducts(productsArray) {
  productsContainer.innerHTML = "";
  
  productsArray.forEach(product => {
    const card = document.createElement("article");
    card.classList.add("product-card");
    
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <h2 class="product-title">${product.title}</h2>
      <p class="product-price">Precio: $${product.price}</p>
      <div class="product-info">
        <p>Categoría: ${product.category}</p>
      </div>
      <div class="card-actions">
        <!-- Pasamos el ID del producto dinámicamente -->
        <button class="add-btn" onclick="addToCart(${product.id})">Añadir</button>
        <button class="fav-btn" onclick="toggleFavorite(${product.id})">🤍</button>
      </div>
    `;

    productsContainer.appendChild(card);
  });
}

// ========================================
// FASE 2 - CATEGORÍAS
// ========================================

function renderCategories(productsArray) {
  // Evitamos llamadas fetch extra: usamos el array que ya tenemos en memoria
  const categories = [...new Set(productsArray.map(producto => producto.category))];
  
  categories.forEach(categoria => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1); // Capitalizar texto
    categoryFilter.appendChild(opcion);
  });
}

// ========================================
// FASE 2 - FILTROS MULTIPLES (Buscador + Categoría + Orden)
// ========================================

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortSelect.value;

  // 1. Filtrar de forma combinada (Buscador AND Categoría)
  filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. Aplicar ordenación al resultado filtrado
  if (selectedSort === "priceAsc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "priceDesc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "az") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSort === "za") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  // 3. Pintar solo los productos que pasaron los filtros
  renderProducts(filteredProducts);
}

// ========================================
// EVENT LISTENERS DE FILTROS
// ========================================

// Escuchar cambios en los inputs para filtrar en tiempo real
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);

// Inicializar la aplicación al cargar el archivo
getProducts();
