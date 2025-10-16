// Front-end script: load products from Firestore collection "products"
const WA_NUMBER = "628882695435"; // seller number
let cart = [];

function renderProducts(docs) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';
  const categoriesOrder = ['Elektronik','Fashion','Aksesoris','Rumah Tangga','Buku','Koleksi'];
  categoriesOrder.forEach(cat => {
    const catProducts = docs.filter(d => d.category === cat);
    if (catProducts.length === 0) return;
    const h = document.createElement('h2');
    h.className = 'category-title';
    h.id = cat.toLowerCase().replace(/\s/g,'');
    h.textContent = cat;
    container.appendChild(h);
    const grid = document.createElement('div');
    grid.className = 'products';
    catProducts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image || ('https://source.unsplash.com/400x300/?'+encodeURIComponent(p.category)+',used')}" alt="${p.name}">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p class="price">${p.price}</p>
          <button class="btn add-cart">Tambah ke Keranjang</button>
        </div>
      `;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  });
  attachAddCart();
}

function attachAddCart(){
  document.querySelectorAll('.add-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const card = btn.closest('.card');
      const name = card.querySelector('h3').innerText;
      const price = card.querySelector('.price').innerText;
      cart.push({name, price});
      document.getElementById('cart-count').innerText = cart.length;
      alert(name + ' ditambahkan ke keranjang');
    });
  });
}

function openCart(){
  if(cart.length === 0) return alert('Keranjang kosong.');
  document.getElementById('cart-modal').classList.remove('hidden');
  renderCartList();
}
function closeCart(){ document.getElementById('cart-modal').classList.add('hidden'); }
function renderCartList(){
  const ul = document.getElementById('cart-list');
  ul.innerHTML = '';
  cart.forEach((it,i)=>{
    const li = document.createElement('li');
    li.textContent = (i+1)+'. '+it.name+' — '+it.price;
    ul.appendChild(li);
  });
}
function clearCart(){ cart=[]; document.getElementById('cart-count').innerText = 0; renderCartList(); }

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('cart-icon').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('clear-cart').addEventListener('click', ()=>{ clearCart(); alert('Keranjang dikosongkan'); });
  document.getElementById('send-whatsapp').addEventListener('click', ()=>{
    if(cart.length === 0) return alert('Keranjang kosong');
    const msg = cart.map((it,i)=> (i+1)+'. '+it.name+' ('+it.price+')').join('%0A');
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo, saya ingin memesan:%0A')}${msg}`;
    window.open(url,'_blank');
  });

  // load products from Firestore
  if(typeof db !== 'undefined') {
    db.collection('products').get().then(snapshot=>{
      const docs = [];
      snapshot.forEach(snap=>{
        docs.push(Object.assign({id:snap.id}, snap.data()));
      });
      if(docs.length === 0) {
        // fallback sample
        const sample = [
          {name:'Laptop Bekas ASUS', category:'Elektronik', price:'Rp 3.200.000', description:'Kondisi 90%', image:''},
          {name:'iPhone X Bekas', category:'Elektronik', price:'Rp 4.800.000', description:'Kondisi mulus', image:''},
          {name:'Jaket Denim Vintage', category:'Fashion', price:'Rp 250.000', description:'Original Levi\'s', image:''},
          {name:'Sepatu Nike Air Bekas', category:'Fashion', price:'Rp 400.000', description:'Size 42', image:''}
        ];
        renderProducts(sample);
      } else {
        renderProducts(docs);
      }
    }).catch(err=>{
      console.error(err);
      document.getElementById('product-container').innerHTML = '<p class="loading">Gagal memuat produk. Pastikan firebase-config.js sudah terpasang dan Firestore diaktifkan.</p>';
    });
  } else {
    document.getElementById('product-container').innerHTML = '<p class="loading">firebase-config.js belum disiapkan. Silakan isi konfigurasi Firebase Anda.</p>';
  }
});
