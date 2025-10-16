// Admin panel script (Firebase Auth + Firestore)
const authSection = document.getElementById('auth-section');
const adminPanel = document.getElementById('admin-panel');
const authMsg = document.getElementById('auth-msg');
const adminEmailSpan = document.getElementById('admin-email');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const btnNew = document.getElementById('btn-new');
const btnRefresh = document.getElementById('btn-refresh');

let editId = null;

function showAuthError(msg){ authMsg.innerText = msg; }

btnLogin.addEventListener('click', ()=>{
  const email = emailInput.value.trim();
  const pass = passwordInput.value.trim();
  if(!email || !pass){ showAuthError('Isi email & password'); return; }
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(userCred => {
      authMsg.innerText = '';
    })
    .catch(err => showAuthError(err.message));
});

btnLogout.addEventListener('click', ()=>{
  firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(user=>{
  if(user){
    adminPanel.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
    btnLogin.classList.add('hidden');
    adminEmailSpan.innerText = user.email;
    loadProducts();
  } else {
    adminPanel.classList.add('hidden');
    btnLogout.classList.add('hidden');
    btnLogin.classList.remove('hidden');
    adminEmailSpan.innerText = '';
  }
});

function loadProducts(){
  productList.innerHTML = '<p>Memuat...</p>';
  db.collection('products').orderBy('category').get().then(snapshot=>{
    productList.innerHTML = '';
    snapshot.forEach(doc=>{
      const d = doc.data();
      const row = document.createElement('div');
      row.className = 'product-row';
      row.innerHTML = `
        <img src="${d.image || 'https://source.unsplash.com/160x120/?'+encodeURIComponent(d.category)+',used'}" />
        <div style="flex:1">
          <strong>${d.name}</strong><div style="color:#666">${d.category} — ${d.price}</div>
        </div>
        <div>
          <button class="btn edit" data-id="${doc.id}">Edit</button>
          <button class="btn cancel del" data-id="${doc.id}">Hapus</button>
        </div>
      `;
      productList.appendChild(row);
    });
    attachProductButtons();
  }).catch(err=>{ productList.innerHTML = '<p style="color:#b33">Gagal memuat produk</p>'; console.error(err); });
}

function attachProductButtons(){
  document.querySelectorAll('.edit').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      db.collection('products').doc(id).get().then(doc=>{
        const d = doc.data();
        editId = id;
        document.getElementById('form-title').innerText = 'Edit Produk';
        document.getElementById('p-name').value = d.name;
        document.getElementById('p-desc').value = d.description;
        document.getElementById('p-price').value = d.price;
        document.getElementById('p-cat').value = d.category;
        document.getElementById('p-img').value = d.image || '';
        productForm.classList.remove('hidden');
      });
    });
  });
  document.querySelectorAll('.del').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      if(!confirm('Hapus produk ini?')) return;
      db.collection('products').doc(id).delete().then(()=>{ alert('Terhapus'); loadProducts(); }).catch(e=>alert('Gagal: '+e.message));
    });
  });
}

btnRefresh.addEventListener('click', loadProducts);
btnNew.addEventListener('click', ()=>{
  editId = null;
  document.getElementById('form-title').innerText = 'Tambah Produk';
  document.getElementById('p-name').value = '';
  document.getElementById('p-desc').value = '';
  document.getElementById('p-price').value = '';
  document.getElementById('p-img').value = '';
  productForm.classList.remove('hidden');
});

document.getElementById('cancel-product').addEventListener('click', ()=>{ productForm.classList.add('hidden'); });

document.getElementById('save-product').addEventListener('click', ()=>{
  const name = document.getElementById('p-name').value.trim();
  const desc = document.getElementById('p-desc').value.trim();
  const price = document.getElementById('p-price').value.trim();
  const category = document.getElementById('p-cat').value;
  const image = document.getElementById('p-img').value.trim();

  if(!name || !price){ alert('Nama & harga wajib'); return; }
  const payload = { name, description: desc, price, category, image };

  if(editId){
    db.collection('products').doc(editId).set(payload).then(()=>{ alert('Tersimpan'); productForm.classList.add('hidden'); loadProducts(); }).catch(e=>alert('Gagal: '+e.message));
  } else {
    db.collection('products').add(payload).then(()=>{ alert('Ditambahkan'); productForm.classList.add('hidden'); loadProducts(); }).catch(e=>alert('Gagal: '+e.message));
  }
});
