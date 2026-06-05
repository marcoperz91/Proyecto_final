// ========================================
// CHECKOUT - CARRITO Y COMPRA
// ========================================

const cartContainer =
  document.getElementById("cartContainer");

const cartTotal =
  document.getElementById("cartTotal");

const buyBtn =
  document.getElementById("buyBtn");

// Recuperar carrito guardado
let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

// ========================================
// PINTAR CARRITO
// ========================================

function renderCart() {

  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {

    cartContainer.innerHTML = `
      <p class="empty-cart">
        El carrito está vacío
      </p>
    `;

    if (cartTotal) {
      cartTotal.textContent = "0.00 €";
    }

    return;
  }

  cart.forEach(item => {

    const subtotal =
      item.price * item.quantity;

    total += subtotal;

    const article =
      document.createElement("article");

    article.classList.add("cart-item");

    article.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.title}"
      >

      <div class="cart-item-info">

        <p class="cart-item-title">
          ${item.title}
        </p>

        <p class="cart-item-price">
          ${item.quantity} x ${item.price.toFixed(2)} €
        </p>

        <p>
          <strong>
            ${subtotal.toFixed(2)} €
          </strong>
        </p>

      </div>
    `;

    cartContainer.appendChild(article);

  });

  if (cartTotal) {
    cartTotal.textContent =
      total.toFixed(2) + " €";
  }

}

// ========================================
// VALIDAR COMPRA
// ========================================

function validateCheckout() {

  const token =
    sessionStorage.getItem("token");

  if (!token) {

    alert(
      "Debes iniciar sesión para realizar la compra"
    );

    return;
  }

  if (cart.length === 0) {

    alert(
      "Tu carrito está vacío"
    );

    return;
  }

  checkout();

}

// ========================================
// FINALIZAR COMPRA
// ========================================

function checkout() {

  const form =
    document.getElementById("checkoutForm");

  if (form && !form.checkValidity()) {

    form.reportValidity();

    return;
  }

  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

  alert(
    `Compra realizada correctamente.\n\nTotal: ${total.toFixed(2)} €`
  );

  localStorage.removeItem("cart");

  cart = [];

  renderCart();

}

// ========================================
// EVENTOS
// ========================================

if (buyBtn) {

  buyBtn.addEventListener(
    "click",
    validateCheckout
  );

}

// ========================================
// MOSTRAR ESTADO LOGIN
// ========================================

const accountBtn =
  document.querySelector(".account-btn");

if (
  accountBtn &&
  sessionStorage.getItem("token")
) {

  accountBtn.textContent =
    "Cerrar sesión";

  accountBtn.addEventListener(
    "click",
    () => {

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");

      accountBtn.textContent =
        "Mi cuenta";

      alert(
        "Sesión cerrada"
      );

      location.reload();

    }
  );

}

// ========================================
// INIT
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderCart();

  }
);