// DOM Elemanlarını Seç
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItem = document.getElementById("date-span");

// Sepet Verisi
let cart = [];

// Restoranın açık olup olmadığını kontrol et
function checkRestaurantOpen() {
  const now = new Date();
  const currentHour = now.getHours();
  return (currentHour >= 13 && currentHour <= 24) || (currentHour >= 0 && currentHour < 1);
}

// Restoranın durumu (açık/kapalı) için UI Güncellemesi
function updateRestaurantStatus() {
  if (checkRestaurantOpen()) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    spanItem.textContent = "Açık: 13.00 - 01.00";
  } else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    spanItem.textContent = "Kapalı: 13.00 - 01.00";
  }
}

// Sepete ürün ekle
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // Ürün zaten varsa miktarı artır
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Sepeti güncelle

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  // Her ürün için kart oluştur
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Miktar: ${item.quantity}</p>
          <p class="font-medium mt-2">₺ ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Kaldır
        </button>
      </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

  cartCounter.textContent = cart.reduce((total, item) => total + item.quantity, 0);

  // Temizle butonunu devre dışı bırakma
  if (cart.length === 0) {
    clearCartBtn.setAttribute("disabled", true);
    clearCartBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    clearCartBtn.removeAttribute("disabled");
    clearCartBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

// Sepetten ürün kaldır
function removeItemFromCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartModal();
  }
}

// Sepeti Temizle

function clearCart() {
  if (confirm("Sepeti temizlemek istediğinizden emin misiniz?")) {
    cart = [];
    updateCartModal();
    Toastify({
      text: "Sepetiniz temizlendi!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#10b981" },
    }).showToast();
  }
}

// "Temizle" Butonuna Tıklama Olayı
clearCartBtn.addEventListener("click", clearCart);

function checkout() {
  if (!checkRestaurantOpen()) {
    Toastify({
      text: "RESTORAN KAPALI",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#ef4444" },
    }).showToast();
    return;
  }

  if (cart.length === 0) {
    Toastify({
      text: "Sepetiniz boş!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#ef4444" },
    }).showToast();
    return;
  }

  if (!addressInput.value.trim()) {
    addressWarn.classList.remove("hidden");
    Toastify({
      text: "Lütfen teslimat adresinizi giriniz.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#ef4444" },
    }).showToast();
    return;
  }
  addressWarn.classList.add("hidden");
  // Confirming the order
  Toastify({
    text: "Siparişiniz onaylandı! Teşekkür ederiz.",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: { background: "#10b981" },
  }).showToast();

  // Sipariş detaylarını düzenle
  const cartDetails = cart
    .map(
      (item) => `- ${item.name} (x${item.quantity}): ₺${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const message = `Sipariş Detayları:\n\n${cartDetails}\n\nToplam Fiyat: ₺${totalPrice.toFixed(
    2
  )}\n\nTeslimat Adresi: ${addressInput.value.trim()}`;

  const phone = "0123456789";

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

  // Sepeti sıfırla
  cart = [];
  updateCartModal();
}

// Sepet açma
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Sepet kapatma
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Sepete ürün ekleme
menu.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart-btn");
  if (button) {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Sepetten ürün kaldırma
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemFromCart(name);
  }
});

// Adres giriş kontrolü
addressInput.addEventListener("input", () => {
  if (addressInput.value.trim()) {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

// Sipariş tamamlama
checkoutBtn.addEventListener("click", checkout);

// Sayfa yüklenirken restoran durumunu kontrol et
updateRestaurantStatus();
