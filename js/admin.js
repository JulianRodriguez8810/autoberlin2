// js/admin.js

let adminVehicles = [];
let dbFileHandle = null;
let currentVehicleImages = []; // Para manejar las imágenes del modal

// Fake login for demonstration
function login() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  if (user === 'admin' && pass === 'AutoBerlin') {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAdminVehicles();
  } else {
    alert('Usuario o contraseña incorrectos.');
  }
}

// Soporte para presionar "Enter" al iniciar sesión
document.getElementById('adminUser').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') login();
});
document.getElementById('adminPass').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') login();
});

async function loadAdminVehicles() {
  try {
    const res = await fetch('data/vehicles.json');
    if (res.ok) {
      const data = await res.json();
      adminVehicles = data.vehicles;
    }
  } catch (e) {
    console.error("No se pudo cargar vehicles.json, usando array vacío.", e);
    adminVehicles = [];
  }
  renderAdminTable(adminVehicles);
}

function renderAdminTable(list) {
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';

  list.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>
        <div style="display:flex; align-items:center; gap:0.8rem;">
          <img src="${v.images && v.images[0] ? v.images[0] : ''}" style="width:50px; height:35px; object-fit:cover; border-radius:4px;" onerror="this.style.display='none'">
          <div>
            <strong>${v.brand}</strong><br>
            <span style="color:var(--gray); font-size:0.85rem;">${v.model}</span>
          </div>
        </div>
      </td>
      <td>${v.year}</td>
      <td>${v.currency} ${v.price.toLocaleString('es-AR')}</td>
      <td><span class="badge ${v.status}">${v.status === 'available' ? 'Disponible' : 'Vendido'}</span></td>
      <td class="action-btns">
        <button class="btn-icon" onclick="editVehicle(${v.id})" title="Editar">&#9998;</button>
        <button class="btn-icon delete" onclick="deleteVehicle(${v.id})" title="Eliminar">&#128465;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Search
document.getElementById('adminSearch').addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();
  const filtered = adminVehicles.filter(v => 
    v.brand.toLowerCase().includes(search) || 
    v.model.toLowerCase().includes(search)
  );
  renderAdminTable(filtered);
});

// Modal Logic
function openVehicleModal(id = null) {
  const modal = document.getElementById('editModalOverlay');
  const title = document.getElementById('editModalTitle');
  const form = document.getElementById('vehicleForm');
  form.reset();

  if (id) {
    title.textContent = 'Editar Vehículo';
    const v = adminVehicles.find(x => x.id === id);
    if(v) {
      document.getElementById('v_id').value = v.id;
      document.getElementById('v_brand').value = v.brand;
      document.getElementById('v_model').value = v.model;
      document.getElementById('v_year').value = v.year;
      document.getElementById('v_km').value = v.km;
      document.getElementById('v_price').value = v.price;
      document.getElementById('v_currency').value = v.currency;
      document.getElementById('v_fuel').value = v.fuel;
      document.getElementById('v_transmission').value = v.transmission;
      document.getElementById('v_color').value = v.color || '';
      document.getElementById('v_engine').value = v.engine || '';
      document.getElementById('v_desc').value = v.description || '';
      document.getElementById('v_status').value = v.status;
      document.getElementById('v_badge').value = v.badge || '';
      document.getElementById('v_badge').value = v.badge || '';
      currentVehicleImages = v.images ? [...v.images] : [];
      document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
    }
  } else {
    title.textContent = 'Nuevo Vehículo';
    document.getElementById('v_id').value = '';
    // Defaults
    document.getElementById('v_currency').value = 'USD';
    document.getElementById('v_status').value = 'available';
    currentVehicleImages = [];
    document.getElementById('v_images').value = '[]';
  }

  renderImagePreviews();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVehicleModal() {
  document.getElementById('editModalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Form Submit
document.getElementById('vehicleForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const idStr = document.getElementById('v_id').value;
  const isEdit = !!idStr;
  const id = isEdit ? parseInt(idStr) : Date.now(); // Generate ID for new

  const images = currentVehicleImages; // Usar el array que ya gestionamos con las fotos subidas

  const vehicleData = {
    id: id,
    brand: document.getElementById('v_brand').value,
    model: document.getElementById('v_model').value,
    year: parseInt(document.getElementById('v_year').value),
    km: parseInt(document.getElementById('v_km').value),
    price: parseInt(document.getElementById('v_price').value),
    currency: document.getElementById('v_currency').value,
    fuel: document.getElementById('v_fuel').value,
    transmission: document.getElementById('v_transmission').value,
    color: document.getElementById('v_color').value,
    engine: document.getElementById('v_engine').value,
    description: document.getElementById('v_desc').value,
    status: document.getElementById('v_status').value,
    badge: document.getElementById('v_badge').value,
    images: images
  };

  if (isEdit) {
    const index = adminVehicles.findIndex(x => x.id === id);
    if(index !== -1) adminVehicles[index] = vehicleData;
  } else {
    adminVehicles.unshift(vehicleData); // Add to beginning
  }

  renderAdminTable(adminVehicles);
  closeVehicleModal();
  
  // Highlight save button
  const btnSave = document.getElementById('btnSaveDb');
  btnSave.style.background = '#ff4444';
  btnSave.innerText = '⚠️ Cambios sin guardar';
});

function editVehicle(id) {
  openVehicleModal(id);
}

// Lógica de Imágenes
function renderImagePreviews() {
  const container = document.getElementById('imagePreviewContainer');
  container.innerHTML = '';
  currentVehicleImages.forEach((src, index) => {
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.width = '100px';
    wrap.style.height = '75px';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '6px';
    img.style.border = '1px solid rgba(255,255,255,0.2)';
    
    const btnDel = document.createElement('button');
    btnDel.innerHTML = '✕';
    btnDel.style.position = 'absolute';
    btnDel.style.top = '-5px';
    btnDel.style.right = '-5px';
    btnDel.style.background = '#ff4444';
    btnDel.style.color = 'white';
    btnDel.style.border = 'none';
    btnDel.style.borderRadius = '50%';
    btnDel.style.width = '20px';
    btnDel.style.height = '20px';
    btnDel.style.cursor = 'pointer';
    btnDel.style.fontSize = '10px';
    btnDel.onclick = (e) => {
      e.preventDefault();
      currentVehicleImages.splice(index, 1);
      renderImagePreviews();
    };
    
    wrap.appendChild(img);
    wrap.appendChild(btnDel);
    container.appendChild(wrap);
  });
}

document.getElementById('v_image_upload').addEventListener('change', async (e) => {
  const files = e.target.files;
  if(!files.length) return;
  
  const status = document.getElementById('uploadStatus');
  status.textContent = 'Procesando imágenes...';
  
  for(let file of files) {
    if(!file.type.startsWith('image/')) continue;
    try {
      const base64 = await compressImage(file);
      currentVehicleImages.push(base64);
    } catch(err) {
      console.error("Error comprimiendo imagen", err);
    }
  }
  
  renderImagePreviews();
  status.textContent = '';
  e.target.value = ''; // reset
});

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600; // Mejor resolución
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprimir como JPEG al 92% de calidad para mejor detalle
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        resolve(dataUrl);
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
}

function deleteVehicle(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.")) {
    adminVehicles = adminVehicles.filter(v => v.id !== id);
    renderAdminTable(adminVehicles);
    
    const btnSave = document.getElementById('btnSaveDb');
    btnSave.style.background = '#ff4444';
    btnSave.innerText = '⚠️ Cambios sin guardar';
  }
}

// Database Save using File System Access API
async function saveDatabase() {
  const dataObj = { vehicles: adminVehicles };
  const jsonString = JSON.stringify(dataObj, null, 2);

  try {
    // Intentar usar File System Access API (Chrome/Edge/Opera)
    if (window.showSaveFilePicker) {
      if (!dbFileHandle) {
        dbFileHandle = await window.showSaveFilePicker({
          suggestedName: 'vehicles.json',
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          }],
        });
      }
      const writable = await dbFileHandle.createWritable();
      await writable.write(jsonString);
      await writable.close();
      
      const btnSave = document.getElementById('btnSaveDb');
      btnSave.style.background = '';
      btnSave.innerText = '✅ Base de Datos Guardada';
      setTimeout(() => btnSave.innerText = '💾 Guardar Cambios', 3000);
      alert('¡Base de datos vehicles.json actualizada correctamente!');
    } else {
      // Fallback para navegadores que no soportan File System Access API (Firefox/Safari)
      downloadFallback(jsonString);
    }
  } catch (error) {
    console.error("Error al guardar archivo:", error);
    // Si el usuario cancela o hay un error, usamos el fallback
    if (error.name !== 'AbortError') {
      downloadFallback(jsonString);
    }
  }
}

function downloadFallback(jsonString) {
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vehicles.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert("Por seguridad del navegador, se ha descargado el archivo 'vehicles.json'. Por favor, reemplaza el archivo existente en tu carpeta 'data/vehicles.json' con este nuevo archivo.");
  
  const btnSave = document.getElementById('btnSaveDb');
  btnSave.style.background = '';
  btnSave.innerText = '💾 Guardar Cambios';
}

// Event Listeners for modals
document.getElementById('editModalClose').addEventListener('click', closeVehicleModal);
document.getElementById('editModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('editModalOverlay')) closeVehicleModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVehicleModal(); });
