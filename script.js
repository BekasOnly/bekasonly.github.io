// Simple JS to handle WhatsApp order links
// Set your WhatsApp number here (in international format, without + or leading zeros): e.g. 6281234567890
const WA_NUMBER = "6281234567890";

function encodeMsg(msg) {
  return encodeURIComponent(msg);
}

document.addEventListener("DOMContentLoaded", () => {
  const orderButtons = document.querySelectorAll(".order-btn");
  orderButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const msg = btn.getAttribute("data-msg") || "Halo, saya mau pesan";
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeMsg(msg)}`;
      window.open(url, "_blank");
    });
  });

  // Footer WA link
  const waLink = document.getElementById("wa-link");
  if (waLink) {
    waLink.href = `https://wa.me/${WA_NUMBER}`;
    waLink.target = "_blank";
  }
});
