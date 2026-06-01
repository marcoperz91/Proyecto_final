fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error("Error fetching products:", error));
/*
========================================
MINI ECOMMERCE - BOILERPLATE
========================================

TECNOLOGÍAS:
- JavaScript
- Fetch API
- LocalStorage
- SessionStorage

FASES:
1. Productos
2. Filtros
3. Carrito
4. EXTRA Persistencia
5. EXTRA Login
6. EXTRA Sesión
7. EXTRA Favoritos

========================================
*/


// ========================================
// SELECTORES DEL DOM
// ========================================

//login boton
const loginBtn =document.getElementById("loginBtn");

// Contenedor productos
const productsContainer =
  document.getElementById("productsContainer");

// Contenedor carrito
const cartContainer =
  document.getElementById("cartContainer");

// Total carrito
const cartTotal =
  document.getElementById("cartTotal");

// Buscador
const searchInput =
  document.getElementById("searchInput");

// Filtro categorías
const categoryFilter =
  document.getElementById("categoryFilter");

// Ordenación
const sortSelect =
  document.getElementById("sortSelect");

// Modal login
const loginModal =
  document.getElementById("loginModal");

// Botón abrir login
const accountBtn =
  document.querySelector(".account-btn");

// Botón cerrar login
const closeLogin =
  document.getElementById("closeLogin");

// Formulario login
const loginForm =
  document.getElementById("loginForm");


// ========================================
// VARIABLES GLOBALES
// ========================================

// Productos API
let products = [];

// Productos filtrados
let filteredProducts = [];

// Carrito
let cart = [];

// Favoritos
let favorites = [];


// ========================================
// FASE 1 - FETCH PRODUCTOS
// ========================================

/*
OBJETIVO:
Obtener productos desde la API.

ENDPOINT:
https://fakestoreapi.com/products

CONCEPTOS:
- fetch()
- promesas
- .then()
- .catch()

TAREAS:
- Hacer petición fetch
- Convertir respuesta a JSON
- Guardar productos
- Pintar productos
- Pintar categorías
*/


/*
========================================
¿QUÉ DEVUELVE LA API?
========================================

La API devuelve un ARRAY de productos.

Ejemplo:

[
  {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    description: "Your perfect pack...",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/..."
  }
]

========================================
¿CÓMO ACCEDER A LOS DATOS?
========================================

product.title
product.price
product.category
product.image

========================================
EJEMPLO RECORRIENDO PRODUCTOS
========================================

products.forEach(product => {

  console.log(product.title);

});

*/


function getProducts() {

  // TODO

}


// ========================================
// FASE 1 - RENDER PRODUCTOS
// ========================================

/*
OBJETIVO:
Pintar productos dinámicamente.

MOSTRAR:
- Imagen
- Título
- Precio
- Categoría
- Botón carrito
- Botón favorito

PISTA:
Usar:
- innerHTML
- createElement
- appendChild
*/


/*
========================================
PISTA RENDERIZADO
========================================

Ejemplo creando una card:

const card = document.createElement("article");

card.innerHTML = `
  <h2>${product.title}</h2>
`;

productsContainer.appendChild(card);

========================================
*/


function renderProducts(productsArray) {
  productsContainer.innerHTML = "";
  // TODO
  productsArray.forEach(product => {
    const card = document.createElement("article");
    card.classList.add("product-card");
    card.innerHTML = `
      <h2 class="product-title">${product.title}</h2>
          <div class="product-image">
      <img src="${product.image}"  alt="${product.title}">
            </div>

      <p class="product-price">Precio: $${product.price}</p>
              <div class="product-info">

      <p>Categoría: ${product.category}</p>
      </div>
      
          <div class="card-actions">

            <button class="add-btn">

              Añadir

            </button>

            <button class="fav-btn">

              🤍

            </button>

          </div>
          `

    productsContainer.appendChild(card);
    // console.log(productsArray);
  });


  // TODO
}


// ========================================
// FASE 2 - CATEGORÍAS
// ========================================

/*
OBJETIVO:
Generar categorías dinámicamente.

TAREAS:
- Obtener categorías únicas
- Crear options
- Añadir al select

PISTA:
new Set()
*/

function renderCategories(productsArray) {

  // TODO
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
      const copia = [... new Set(data.map(producto => producto.category))];
      copia.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        categoryFilter.appendChild(opcion);
      })
    })
    .catch(error => console.error("Error fetching categories:", error));
}
renderCategories();



// ========================================
// FASE 2 - FILTROS
// ========================================

/*
OBJETIVO:
Filtrar productos dinámicamente.

REQUISITOS:
- Buscar por nombre
- Filtrar por categoría
- Ordenar:
  - precio ascendente
  - precio descendente
  - A-Z
  - Z-A

PISTA:
- filter()
- sort()
- localeCompare()
*/

function filterProducts() {

  // TODO
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
      let men = data.filter(producto => producto.category === "men's clothing")
      if (categoryFilter.value == "all" && sortSelect.value === "priceAsc") {
        renderProducts(data.filter(producto => producto.price).sort((b, a) => a.price - b.price))
      } else if (categoryFilter.value == "all" && sortSelect.value === "priceDesc") {
        renderProducts(data.filter(producto => producto.price).sort((a, b) => a.price - b.price))
      } else if (categoryFilter.value == "all" && sortSelect.value === "az") {
        renderProducts(data.filter(producto => producto.price).sort((a, b) => a.title.localeCompare(b.title)))
      } else if (categoryFilter.value == "all" && sortSelect.value === "za") {
        renderProducts(data.filter(producto => producto.price).sort((a, b) => b.title.localeCompare(a.title)))
      }

      if (categoryFilter.value == "men's clothing" && sortSelect.value === "priceAsc") {
        renderProducts(men.filter(producto => producto.price).sort((b, a) => a.price - b.price))
      } else if (categoryFilter.value == "men's clothing" && sortSelect.value === "priceDesc") {
        renderProducts(men.filter(producto => producto.price).sort((a, b) => a.price - b.price))
      } else if (categoryFilter.value == "men's clothing" && sortSelect.value === "az") {
        renderProducts(men.filter(producto => producto.price).sort((a, b) => a.title.localeCompare(b.title)))
      } else if (categoryFilter.value == "men's clothing" && sortSelect.value === "za") {
        renderProducts(men.filter(producto => producto.price).sort((a, b) => b.title.localeCompare(a.title)))
      }

      if (categoryFilter.value == "jewelery" && sortSelect.value === "priceAsc") {
        renderProducts(data.filter(producto => producto.category === "jewelery").filter(producto => producto.price).sort((b, a) => a.price - b.price))
      } else if (categoryFilter.value == "jewelery" && sortSelect.value === "priceDesc") {
        renderProducts(data.filter(producto => producto.category === "jewelery").filter(producto => producto.price).sort((a, b) => a.price - b.price))
      } else if (categoryFilter.value == "jewelery" && sortSelect.value === "az") {
        renderProducts(data.filter(producto => producto.category === "jewelery").filter(producto => producto.price).sort((a, b) => a.title.localeCompare(b.title)))
      } else if (categoryFilter.value == "jewelery" && sortSelect.value === "za") {
        renderProducts(data.filter(producto => producto.category === "jewelery").filter(producto => producto.price).sort((a, b) => b.title.localeCompare(a.title)))
      }

      if (categoryFilter.value == "electronics" && sortSelect.value === "priceAsc") {
        renderProducts(data.filter(producto => producto.category === "electronics").filter(producto => producto.price).sort((b, a) => a.price - b.price))
      } else if (categoryFilter.value == "electronics" && sortSelect.value === "priceDesc") {
        renderProducts(data.filter(producto => producto.category === "electronics").filter(producto => producto.price).sort((a, b) => a.price - b.price))
      } else if (categoryFilter.value == "electronics" && sortSelect.value === "az") {
        renderProducts(data.filter(producto => producto.category === "electronics").filter(producto => producto.price).sort((a, b) => a.title.localeCompare(b.title)))
      } else if (categoryFilter.value == "electronics" && sortSelect.value === "za") {
        renderProducts(data.filter(producto => producto.category === "electronics").filter(producto => producto.price).sort((a, b) => b.title.localeCompare(a.title)))
      }
      if (categoryFilter.value == "women's clothing" && sortSelect.value === "priceAsc") {
        renderProducts(data.filter(producto => producto.category === "women's clothing").filter(producto => producto.price).sort((b, a) => a.price - b.price))
      } else if (categoryFilter.value == "women's clothing" && sortSelect.value === "priceDesc") {
        renderProducts(data.filter(producto => producto.category === "women's clothing").filter(producto => producto.price).sort((a, b) => a.price - b.price))
      } else if (categoryFilter.value == "women's clothing" && sortSelect.value === "az") {
        renderProducts(data.filter(producto => producto.category === "women's clothing").filter(producto => producto.price).sort((a, b) => a.title.localeCompare(b.title)))
      } else if (categoryFilter.value == "women's clothing" && sortSelect.value === "za") {
        renderProducts(data.filter(producto => producto.category === "women's clothing").filter(producto => producto.price).sort((a, b) => b.title.localeCompare(a.title)))
      }

      if (searchInput.value) {
        const buscador = data.filter(producto => producto.title.toLowerCase().includes(searchInput.value.toLowerCase()));
        renderProducts(buscador);
      }
    })
    .catch(error => console.error("Error filtering products:", error));

}




// ========================================
// EVENTOS FILTROS
// ========================================

searchInput.addEventListener(
  "input",
  filterProducts
);

categoryFilter.addEventListener(
  "change",
  filterProducts
);

sortSelect.addEventListener(
  "change",
  filterProducts
);


// ========================================
// FASE 3 - CARRITO
// ========================================

/*
OBJETIVO:
Añadir productos al carrito.

TAREAS:
- Buscar producto por ID
- Añadir al array carrito
- Incrementar cantidad si ya existe
- Guardar carrito
- Renderizar carrito
*/


function buscarProducto(id) {
  return products.find(product => product.id === id);
}

function addToCart(id){
  const product = buscarProducto(id);
  if (product) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;  
}




/*
OBJETIVO:
Eliminar producto del carrito.
*/
function removeFromCart(id) {

  let carritoNuevo = [];
  
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      carritoNuevo.push(cart[i]);
    }
  }

  cart = carritoNuevo;
  
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

}

/*
OBJETIVO:
Pintar carrito dinámicamente.

MOSTRAR:
- Nombre
- Cantidad
- Precio
- Total carrito
*/

function renderCart() {

  // TODO

}


// ========================================
// FASE 4 - LOCAL STORAGE
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Guardar carrito en localStorage.

PISTA:
JSON.stringify()
*/




function saveCart() {

  // TODO

}


/*
OBJETIVO:
Recuperar carrito guardado.

PISTA:
JSON.parse()
*/

function loadCart() {

  // TODO

}


// ========================================
// FASE 7 - FAVORITOS
// ========================================
// No aceptar en la PULL REQUES ESTA FASE 
/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Guardar productos favoritos.

TAREAS:
- Añadir favoritos
- Eliminar favoritos
- Guardar en localStorage
- Recuperar favoritos
*/

function toggleFavorite(id) {

  // TODO

}


function loadFavorites() {

  // TODO

}


// ========================================
// FASE 5 - LOGIN MGUTIERRES 2
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Simular login con FakeStoreAPI.

ENDPOINT:
https://fakestoreapi.com/auth/login

USUARIO TEST:
mor_2314
83r5^_

CONCEPTOS:
- fetch POST
- JSON.stringify()
- sessionStorage

TAREAS:
- Capturar formulario
- Enviar datos
- Guardar token
- Cerrar modal
*/

accountBtn.addEventListener("click",() => {
  loginModal.classList.toggle("hidden");
  const credentials = { username: 'johnd', password: 'm38rmF$' };
fetch('https://fakestoreapi.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
}) .then(response => response.json())
  .then(data => {
    console.log("¡Esta es la respuesta de la API!");
    console.log(data); //el token en la consola
    // GUARDAR TOKEN: Guardamos el token que nos dio la API
    sessionStorage.setItem('token', data.token);
  });
});
closeLogin.addEventListener("click",() => {
loginModal.classList.toggle("hidden");
});

loginForm.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();

    // TODO

  }
);


// ========================================
// FASE 6 - SESIÓN MGUTIERRES
// ========================================
/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Mantener sesión iniciada.

TAREAS:
- Detectar token
- Mostrar login si no existe
*/

function checkSession() {

  // TODO

}


/*
OBJETIVO:
Cerrar sesión.

TAREAS:
- Eliminar token
- Cerrar modal
*/

function logout() {

  // TODO

}


// ========================================
// MODAL LOGIN MGUTIERRES
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Abrir modal login.
*/

accountBtn.addEventListener(
  "click",
  () => {

    // TODO

  }
);


/*
OBJETIVO:
Cerrar modal login.
*/

closeLogin.addEventListener(
  "click",
  () => {

    // TODO

  }
);


/*
OBJETIVO:
Cerrar modal clicando fuera.
*/

loginModal.addEventListener(
  "click",
  (e) => {

    // TODO

  }
);


// ========================================
// INIT APP
// ========================================

/*
OBJETIVO:
Inicializar la aplicación.

TAREAS:
- Obtener productos
- Cargar carrito
- Cargar favoritos
- Comprobar sesión
*/

function init() {

  // TODO

}


// Iniciar aplicación
init();