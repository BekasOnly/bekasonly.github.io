const WA_NUMBER = "628882695435";
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const cartList = document.getElementById("cart-list");
  const closeCart = document.getElementById("close-cart");
  const sendWA = document.getElementById("send-whatsapp");

  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const name = card.querySelector("h3").innerText;
      const price = card.querySelector(".price").innerText;
      cart.push({name, price});
      cartCount.innerText = cart.length;
      alert(name + " ditambahkan ke keranjang!");
    });
  });

  cartIcon.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }
    cartModal.classList.remove("hidden");
    renderCart();
  });

  closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

  function renderCart() {
    cartList.innerHTML = "";
    cart.forEach((item, i) => {
      const li = document.createElement("li");
      li.textContent = `${i+1}. ${item.name} — ${item.price}`;
      cartList.appendChild(li);
    });
  }

  sendWA.addEventListener("click", () => {
    if (cart.length === 0) return alert("Keranjang kosong.");
    const msg = cart.map((item,i) => `${i+1}. ${item.name} (${item.price})`).join("%0A");
    const url = `https://wa.me/${WA_NUMBER}?text=Halo,%20saya%20ingin%20memesan:%0A${msg}`;
    window.open(url, "_blank");
  });
});
