// js/admin.js

let adminVehicles = [];
let dbFileHandle = null;
let currentVehicleImages = []; // Para manejar las imágenes del modal

// Login con soporte Firebase Auth y local
async function login() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  
  if (typeof auth !== 'undefined') {
    try {
      if (!user.includes('@')) {
        alert("Por favor, ingresa tu correo electrónico registrado en tu proyecto Firebase.");
        return;
      }
      await auth.signInWithEmailAndPassword(user, pass);
    } catch (e) {
      console.error("Error al iniciar sesión en Firebase:", e);
      alert("Error al iniciar sesión: " + e.message);
    }
  } else {
    // Fallback local
    if (user === 'admin' && pass === 'AutoBerlin') {
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
      loadAdminVehicles();
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }
}

function logout() {
  if (typeof auth !== 'undefined') {
    auth.signOut().then(() => {
      alert("Sesión cerrada correctamente.");
    }).catch(error => {
      console.error("Error al cerrar sesión:", error);
    });
  } else {
    window.location.reload();
  }
}

// Soporte para presionar "Enter" al iniciar sesión
document.getElementById('adminUser').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') login();
});
document.getElementById('adminPass').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') login();
});

// Listener del estado de autenticación en Firebase
if (typeof auth !== 'undefined') {
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
      const emailEl = document.getElementById('adminUserEmail');
      if (emailEl) emailEl.textContent = `Sesión iniciada como: ${user.email}`;
      loadAdminVehicles();
    } else {
      document.getElementById('adminLogin').style.display = 'block';
      document.getElementById('adminDashboard').style.display = 'none';
    }
  });
}

async function loadAdminVehicles() {
  if (typeof db !== 'undefined') {
    try {
      const snapshot = await db.collection('vehicles').get();
      adminVehicles = [];
      snapshot.forEach(doc => {
        adminVehicles.push(doc.data());
      });
      // Ordenar por ID descendente
      adminVehicles.sort((a, b) => b.id - a.id);
    } catch (e) {
      console.error("Error cargando de Firestore, intentando local:", e);
      await loadAdminVehiclesFallback();
    }
  } else {
    await loadAdminVehiclesFallback();
  }
  renderAdminTable(adminVehicles);
}

async function loadAdminVehiclesFallback() {
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
  const id = isEdit ? parseInt(idStr) : Date.now(); // Generar ID para nuevo

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

  if (typeof db !== 'undefined') {
    // Guardar directamente en Firestore
    db.collection('vehicles').doc(id.toString()).set(vehicleData)
      .then(() => {
        console.log("Vehículo guardado en Firebase Firestore con éxito.");
        if (isEdit) {
          const index = adminVehicles.findIndex(x => x.id === id);
          if(index !== -1) adminVehicles[index] = vehicleData;
        } else {
          adminVehicles.unshift(vehicleData);
        }
        renderAdminTable(adminVehicles);
        closeVehicleModal();
      })
      .catch(error => {
        console.error("Error al guardar en Firestore:", error);
        alert("Error al guardar en Firebase: " + error.message);
      });
  } else {
    // Fallback local en memoria
    if (isEdit) {
      const index = adminVehicles.findIndex(x => x.id === id);
      if(index !== -1) adminVehicles[index] = vehicleData;
    } else {
      adminVehicles.unshift(vehicleData); // Agregar al principio
    }

    renderAdminTable(adminVehicles);
    closeVehicleModal();
    
    // Resaltar botón de guardar base de datos
    const btnSave = document.getElementById('btnSaveDb');
    if (btnSave) {
      btnSave.style.background = '#ff4444';
      btnSave.innerText = '⚠️ Cambios sin guardar';
    }
  }
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
    wrap.style.cursor = 'grab';
    wrap.setAttribute('draggable', 'true');
    wrap.dataset.index = index;
    
    // Eventos de arrastrar y soltar (Drag and Drop)
    wrap.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
      wrap.style.opacity = '0.5';
    });
    
    wrap.addEventListener('dragend', () => {
      wrap.style.opacity = '1';
    });
    
    wrap.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    wrap.addEventListener('dragenter', (e) => {
      e.preventDefault();
      wrap.style.border = '2px dashed var(--gold)';
      wrap.style.borderRadius = '6px';
    });
    
    wrap.addEventListener('dragleave', () => {
      wrap.style.border = 'none';
    });
    
    wrap.addEventListener('drop', (e) => {
      e.preventDefault();
      wrap.style.border = 'none';
      const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const targetIndex = index;
      
      if (draggedIndex !== targetIndex) {
        const draggedItem = currentVehicleImages[draggedIndex];
        currentVehicleImages.splice(draggedIndex, 1);
        currentVehicleImages.splice(targetIndex, 0, draggedItem);
        document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
        renderImagePreviews();
      }
    });
    
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
    btnDel.style.zIndex = '10';
    btnDel.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentVehicleImages.splice(index, 1);
      document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
      renderImagePreviews();
    };
    
    if (index === 0) {
      const coverBadge = document.createElement('span');
      coverBadge.textContent = 'Portada';
      coverBadge.style.position = 'absolute';
      coverBadge.style.bottom = '2px';
      coverBadge.style.left = '2px';
      coverBadge.style.background = 'rgba(0, 0, 0, 0.7)';
      coverBadge.style.color = 'var(--gold)';
      coverBadge.style.fontSize = '8px';
      coverBadge.style.padding = '2px 4px';
      coverBadge.style.borderRadius = '3px';
      coverBadge.style.fontWeight = 'bold';
      coverBadge.style.border = '1px solid var(--gold)';
      wrap.appendChild(coverBadge);
      
      img.style.borderColor = 'var(--gold)';
      img.style.borderWidth = '2px';
    }
    
    wrap.appendChild(img);
    wrap.appendChild(btnDel);
    container.appendChild(wrap);
  });
}

async function uploadToCloudinary(file) {
  const cloudName = 'dpc6tconv';
  const uploadPreset = 'AutoBerlin_Upload';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Error HTTP: ${response.status}`);
  }
  
  const data = await response.json();
  return data.secure_url;
}

document.getElementById('v_image_upload').addEventListener('change', async (e) => {
  const files = e.target.files;
  if(!files.length) return;
  
  // Máximo 10 fotos por vehículo para no superar el límite de Firestore
  const MAX_PHOTOS = 10;
  if (currentVehicleImages.length >= MAX_PHOTOS) {
    alert(`Máximo ${MAX_PHOTOS} fotos por vehículo.`);
    e.target.value = '';
    return;
  }

  const status = document.getElementById('uploadStatus');
  const available = MAX_PHOTOS - currentVehicleImages.length;
  
  if (files.length > available) {
    alert(`Solo puedes agregar ${available} foto(s) más. Se procesará(n) solo la(s) primera(s) ${available}.`);
  }
  
  const toProcess = Array.from(files).slice(0, available);
  
  for(let i = 0; i < toProcess.length; i++) {
    const file = toProcess[i];
    if(!file.type.startsWith('image/')) {
      alert(`El archivo "${file.name}" no es una imagen válida o no tiene una extensión correcta (.jpg, .png, etc.).`);
      continue;
    }
    status.textContent = `Subiendo foto ${i+1} de ${toProcess.length} a Cloudinary...`;
    try {
      const url = await uploadToCloudinary(file);
      currentVehicleImages.push(url);
    } catch(err) {
      console.error("Error al subir a Cloudinary:", err);
      alert(`Error al subir la foto "${file.name}": ${err.message}`);
    }
  }
  
  renderImagePreviews();
  status.textContent = '';
  e.target.value = ''; // reset
});

function deleteVehicle(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.")) {
    if (typeof db !== 'undefined') {
      db.collection('vehicles').doc(id.toString()).delete()
        .then(() => {
          console.log("Vehículo eliminado de Firestore con éxito.");
          adminVehicles = adminVehicles.filter(v => v.id !== id);
          renderAdminTable(adminVehicles);
        })
        .catch(error => {
          console.error("Error al eliminar de Firestore:", error);
          alert("Error al eliminar de Firebase: " + error.message);
        });
    } else {
      // Modo local
      adminVehicles = adminVehicles.filter(v => v.id !== id);
      renderAdminTable(adminVehicles);
      
      const btnSave = document.getElementById('btnSaveDb');
      if (btnSave) {
        btnSave.style.background = '#ff4444';
        btnSave.innerText = '⚠️ Cambios sin guardar';
      }
    }
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

// Función para migrar datos locales (del JSON) a Firestore
async function migrateLocalDataToFirebase() {
  if (typeof db === 'undefined') {
    alert("Firebase no está inicializado. Configura primero js/firebase-config.js.");
    return;
  }
  
  if (!confirm(`¿Estás seguro de que deseas importar los ${adminVehicles.length} vehículos locales actuales a la base de datos de Firebase Firestore? Esto podría sobrescribir vehículos con el mismo ID.`)) {
    return;
  }
  
  const btn = document.getElementById('btnMigrate');
  const originalText = btn.innerText;
  btn.disabled = true;
  btn.innerText = "⏳ Migrando...";
  
  try {
    let count = 0;
    const batch = db.batch();
    
    // El límite de operaciones en un batch de Firestore es 500
    for (let vehicle of adminVehicles) {
      const docRef = db.collection('vehicles').doc(vehicle.id.toString());
      batch.set(docRef, vehicle);
      count++;
      
      // Si llegamos a 400 (por las dudas), commiteamos y abrimos otro batch
      if (count % 400 === 0) {
        await batch.commit();
      }
    }
    
    // Commit final para los documentos restantes
    if (count % 400 !== 0) {
      await batch.commit();
    }
    
    alert(`🎉 ¡Migración exitosa! Se importaron ${count} vehículos a Firebase Firestore.`);
    loadAdminVehicles(); // Recargar la tabla desde Firestore
  } catch (error) {
    console.error("Error durante la migración:", error);
    alert("Hubo un error al migrar los datos: " + error.message);
  } finally {
    btn.disabled = false;
    btn.innerText = originalText;
  }
}
