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
      // También cargar el JSON para combinarlos y poder migrarlos si es necesario
      try {
        const res = await fetch('data/vehicles.json');
        if (res.ok) {
          const data = await res.json();
          // Evitar duplicados
          data.vehicles.forEach(vJson => {
            if (!adminVehicles.some(vDb => vDb.model === vJson.model)) {
              adminVehicles.push(vJson);
            }
          });
        }
      } catch(e) {}

      // Ordenar por ID descendente
      adminVehicles.sort((a, b) => b.id - a.id);
    } catch (e) {
      console.error("Error cargando de Firestore, intentando local:", e);
      await loadAdminVehiclesFallback();
    }
  } else {
    await loadAdminVehiclesFallback();
  }

  // Rellenar fechas vacías para demo
  adminVehicles.forEach((v, index) => {
    if (!v.dateAdded) {
      const d = new Date();
      if (index === 0 || index === 4) {
        d.setDate(d.getDate() - 75); // Más de 60 días para testear la alerta
      } else {
        d.setDate(d.getDate() - (index * 5));
      }
      v.dateAdded = d.toISOString().split('T')[0];
    }
  });

  renderAdminTable(adminVehicles);
  populateAdminBrandFilter();
  switchTab('abm');
}

function populateAdminBrandFilter() {
  const sel = document.getElementById('adminBrandFilter');
  if (!sel) return;
  sel.innerHTML = '<option value="">Todas las marcas</option>';
  const brands = [...new Set(adminVehicles.map(v => v.brand))].sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    sel.appendChild(opt);
  });
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
    const dateAddedStr = v.dateAdded || new Date().toISOString().split('T')[0];
    const dateAddedObj = new Date(dateAddedStr);
    const today = new Date();
    const diffTime = Math.abs(today - dateAddedObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isOldStock = v.status === 'available' && diffDays > 60;
    
    // Formatear fecha (DD/MM/YYYY)
    const [year, month, day] = dateAddedStr.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const tr = document.createElement('tr');
    if (isOldStock) {
      tr.classList.add('old-stock-row');
    }

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
      <td><span style="font-size:0.88rem; color:var(--gray);">${formattedDate}</span></td>
      <td>${v.currency} ${v.price.toLocaleString('es-AR')}</td>
      <td>
        <span class="badge ${v.status}">${v.status === 'available' ? 'Disponible' : 'Vendido'}</span>
        ${isOldStock ? '<br><span class="badge warning-stock" title="Este vehículo lleva más de 60 días en stock sin venderse">⚠️ +60 días</span>' : ''}
      </td>
      <td class="action-btns">
        <button class="btn-icon" onclick="previewVehicle(${v.id})" title="Vista Previa" style="color:#5b8dee; font-size: 1.1rem; margin-right:0.3rem;">👁️</button>
        <button class="btn-icon" onclick="editVehicle(${v.id})" title="Editar">&#9998;</button>
        <button class="btn-icon delete" onclick="deleteVehicle(${v.id})" title="Eliminar">&#128465;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Search and Filter
function applyAdminFilters() {
  const search = document.getElementById('adminSearch').value.toLowerCase();
  const brandFilterEl = document.getElementById('adminBrandFilter');
  const brand = brandFilterEl ? brandFilterEl.value : '';
  
  const filtered = adminVehicles.filter(v => 
    (!search || v.brand.toLowerCase().includes(search) || v.model.toLowerCase().includes(search)) &&
    (!brand || v.brand === brand)
  );
  renderAdminTable(filtered);
}

document.getElementById('adminSearch').addEventListener('input', applyAdminFilters);
const adminBrandFilter = document.getElementById('adminBrandFilter');
if(adminBrandFilter) {
  adminBrandFilter.addEventListener('change', applyAdminFilters);
}

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
      document.getElementById('v_date_added').value = v.dateAdded || new Date().toISOString().split('T')[0];
      currentVehicleImages = v.images ? [...v.images] : [];
      document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
    }
  } else {
    title.textContent = 'Nuevo Vehículo';
    document.getElementById('v_id').value = '';
    // Defaults
    document.getElementById('v_currency').value = 'USD';
    document.getElementById('v_status').value = 'available';
    document.getElementById('v_date_added').value = new Date().toISOString().split('T')[0];
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
    dateAdded: document.getElementById('v_date_added').value || new Date().toISOString().split('T')[0],
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
  
  let touchStartX = 0;
  let touchStartY = 0;

  currentVehicleImages.forEach((src, index) => {
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.width = '100px';
    wrap.style.height = '75px';
    wrap.style.cursor = 'grab';
    wrap.setAttribute('draggable', 'true');
    wrap.dataset.index = index;
    wrap.style.webkitTouchCallout = 'none';
    wrap.style.webkitUserSelect = 'none';
    wrap.style.userSelect = 'none';
    
    // Eventos de arrastrar y soltar de mouse (Drag and Drop para PC)
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

    // Eventos de tocar y arrastrar para pantallas táctiles (Móviles)
    wrap.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      wrap.style.opacity = '0.7';
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      // Bloquea el scroll del navegador mientras se arrastra en la galería
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    wrap.addEventListener('touchend', (e) => {
      wrap.style.opacity = '1';
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const dropTarget = document.elementFromPoint(touchEndX, touchEndY);
      if (dropTarget) {
        const targetWrap = dropTarget.closest('[draggable="true"]');
        if (targetWrap && targetWrap !== wrap) {
          const targetIndex = parseInt(targetWrap.dataset.index);
          const draggedIndex = index;
          
          const draggedItem = currentVehicleImages[draggedIndex];
          currentVehicleImages.splice(draggedIndex, 1);
          currentVehicleImages.splice(targetIndex, 0, draggedItem);
          document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
          renderImagePreviews();
        }
      }
    });
    
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '6px';
    img.style.border = '1px solid rgba(255,255,255,0.2)';
    img.style.pointerEvents = 'none'; // Evita el menú popup de descarga en móvil
    
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
    btnDel.style.pointerEvents = 'auto';
    btnDel.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentVehicleImages.splice(index, 1);
      document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
      renderImagePreviews();
    };

    // Botón de Estrella para hacer portada con un solo toque (Ideal para Móvil)
    if (index !== 0) {
      const btnStar = document.createElement('button');
      btnStar.innerHTML = '⭐';
      btnStar.style.position = 'absolute';
      btnStar.style.top = '-5px';
      btnStar.style.left = '-5px';
      btnStar.style.background = 'rgba(0, 0, 0, 0.85)';
      btnStar.style.color = '#ffcc00';
      btnStar.style.border = '1px solid #ffcc00';
      btnStar.style.borderRadius = '50%';
      btnStar.style.width = '20px';
      btnStar.style.height = '20px';
      btnStar.style.cursor = 'pointer';
      btnStar.style.fontSize = '10px';
      btnStar.style.zIndex = '10';
      btnStar.style.pointerEvents = 'auto';
      btnStar.title = 'Hacer Portada';
      btnStar.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const itemToMakeCover = currentVehicleImages[index];
        currentVehicleImages.splice(index, 1);
        currentVehicleImages.unshift(itemToMakeCover);
        document.getElementById('v_images').value = JSON.stringify(currentVehicleImages);
        renderImagePreviews();
      };
      wrap.appendChild(btnStar);
    }
    
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
      img.style.borderStyle = 'solid';
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
  const optimizedUrl = data.secure_url.replace("/upload/", "/upload/c_fit,w_1600,h_1200,q_auto:best,f_auto/");
  return optimizedUrl;
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

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════

const HISTORY_KEY = 'ab_activity_log';
let chartBrandsInst = null;
let chartPricesInst = null;

// Tab switching
function switchTab(tab) {
  ['panelAbm', 'panelDashboard'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  ['tabBtnAbm', 'tabBtnDash'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });

  if (tab === 'abm') {
    document.getElementById('panelAbm').classList.add('active');
    document.getElementById('tabBtnAbm').classList.add('active');
    const btn = document.getElementById('btnNewVehicle');
    if (btn) btn.style.display = 'flex';
  } else {
    document.getElementById('panelDashboard').classList.add('active');
    document.getElementById('tabBtnDash').classList.add('active');
    const btn = document.getElementById('btnNewVehicle');
    if (btn) btn.style.display = 'none';
    renderDashboard();
  }
}

// Activity log
function logActivity(type, message) {
  const log = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  log.unshift({ type, message, ts: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(log.slice(0, 50)));
}

function renderActivityLog() {
  const list = document.getElementById('historyList');
  if (!list) return;
  const log  = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  if (!log.length) {
    list.innerHTML = '<li class="history-empty">No hay actividad registrada aun.</li>';
    return;
  }
  list.innerHTML = log.map(e => {
    const date = new Date(e.ts);
    const dateStr = date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `<li class="history-item">
      <div class="history-dot ${e.type}"></div>
      <div>
        <div class="history-text">${e.message}</div>
        <div class="history-date">${dateStr} · ${timeStr}</div>
      </div>
    </li>`;
  }).join('');
}

// KPIs
function renderKpis(vehicles) {
  const available = vehicles.filter(v => v.status === 'available');
  const sold      = vehicles.filter(v => v.status === 'sold');
  const usdAvail  = available.filter(v => v.currency === 'USD');
  const totalUSD  = usdAvail.reduce((acc, v) => acc + (v.price || 0), 0);
  const avgPrice  = usdAvail.length ? Math.round(totalUSD / usdAvail.length) : 0;

  const brandCount = {};
  available.forEach(v => { brandCount[v.brand] = (brandCount[v.brand] || 0) + 1; });
  const topBrand = Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0];

  const kpiTotalEl = document.getElementById('kpiTotal');
  const kpiAvailEl = document.getElementById('kpiAvailable');
  const kpiSoldEl = document.getElementById('kpiSold');
  const kpiValueEl = document.getElementById('kpiValue');
  const kpiValueSubEl = document.getElementById('kpiValueSub');
  const kpiAvgEl = document.getElementById('kpiAvgPrice');
  const kpiTopBrandEl = document.getElementById('kpiTopBrand');
  const kpiTopBrandSubEl = document.getElementById('kpiTopBrandSub');

  if (kpiTotalEl) kpiTotalEl.textContent = vehicles.length;
  if (kpiAvailEl) kpiAvailEl.textContent = available.length;
  if (kpiSoldEl) kpiSoldEl.textContent = sold.length;
  if (kpiValueEl) kpiValueEl.textContent = totalUSD ? `USD ${(totalUSD / 1000).toFixed(0)}K` : '--';
  if (kpiValueSubEl) kpiValueSubEl.textContent = usdAvail.length ? `${usdAvail.length} unidades USD` : '';
  if (kpiAvgEl) kpiAvgEl.textContent = avgPrice ? `USD ${avgPrice.toLocaleString('es-AR')}` : '--';
  if (kpiTopBrandEl) kpiTopBrandEl.textContent = topBrand ? topBrand[0] : '--';
  if (kpiTopBrandSubEl) kpiTopBrandSubEl.textContent = topBrand ? `${topBrand[1]} unidad${topBrand[1] > 1 ? 'es' : ''} disponible${topBrand[1] > 1 ? 's' : ''}` : '';
}

// Charts
const CHART_COLORS = [
  '#DAA520','#5b8dee','#25D366','#e05252','#a78bfa',
  '#f59e0b','#06b6d4','#f97316','#ec4899','#84cc16','#6366f1','#14b8a6'
];

function renderCharts(vehicles) {
  const available = vehicles.filter(v => v.status === 'available');

  // Donut: distribucion por marca
  const brandMap = {};
  available.forEach(v => { brandMap[v.brand] = (brandMap[v.brand] || 0) + 1; });
  const brandLabels = Object.keys(brandMap).sort((a, b) => brandMap[b] - brandMap[a]);
  const brandData   = brandLabels.map(b => brandMap[b]);

  const chartBrandsEl = document.getElementById('chartBrands');
  if (chartBrandsEl) {
    if (chartBrandsInst) chartBrandsInst.destroy();
    chartBrandsInst = new Chart(chartBrandsEl, {
      type: 'doughnut',
      data: {
        labels: brandLabels,
        datasets: [{ data: brandData, backgroundColor: CHART_COLORS, borderColor: '#0d0d0d', borderWidth: 2 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,0.65)', font: { size: 11 }, boxWidth: 12 } }
        },
        cutout: '62%'
      }
    });
  }

  // Bar: precio promedio USD por marca
  const brandPriceMap = {};
  vehicles.filter(v => v.currency === 'USD').forEach(v => {
    if (!brandPriceMap[v.brand]) brandPriceMap[v.brand] = [];
    brandPriceMap[v.brand].push(v.price);
  });
  const priceLabels = Object.keys(brandPriceMap).sort();
  const priceData   = priceLabels.map(b => Math.round(brandPriceMap[b].reduce((a, c) => a + c, 0) / brandPriceMap[b].length));

  const chartPricesEl = document.getElementById('chartPrices');
  if (chartPricesEl) {
    if (chartPricesInst) chartPricesInst.destroy();
    chartPricesInst = new Chart(chartPricesEl, {
      type: 'bar',
      data: {
        labels: priceLabels,
        datasets: [{
          label: 'Precio prom. USD',
          data: priceData,
          backgroundColor: 'rgba(218,165,32,0.7)',
          borderColor: '#DAA520',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: 'rgba(255,255,255,0.5)', callback: v => `$${(v / 1000).toFixed(0)}K` }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

function renderDashboard() {
  renderKpis(adminVehicles);
  renderCharts(adminVehicles);
  renderActivityLog();
  loadAndRenderStockAlerts();
}

// Hook: registrar actividad al guardar vehiculo
document.getElementById('vehicleForm').addEventListener('submit', () => {
  const id     = document.getElementById('v_id').value;
  const brand  = document.getElementById('v_brand').value;
  const model  = document.getElementById('v_model').value;
  const status = document.getElementById('v_status').value;
  if (id) {
    logActivity(status === 'sold' ? 'sold' : 'edit',
      `${brand} ${model} actualizado${status === 'sold' ? ' \u2014 marcado como VENDIDO' : ''}`);
  } else {
    logActivity('added', `Nuevo vehiculo agregado: ${brand} ${model}`);
  }
});

// Hook: registrar actividad al eliminar
const _origDeleteVehicle = window.deleteVehicle;
window.deleteVehicle = function(id) {
  const v = adminVehicles.find(x => x.id === id);
  if (v) logActivity('delete', `Vehiculo eliminado: ${v.brand} ${v.model} ${v.year}`);
  _origDeleteVehicle(id);
};

// Vista previa del vehículo
function previewVehicle(id) {
  const v = adminVehicles.find(x => x.id === id);
  if (!v) return;

  const content = document.getElementById('previewModalContent');
  if (!content) return;

  const statusHtml = v.status === 'sold'
    ? '<span style="color:#ff4444;font-size:0.8rem;font-weight:600;margin-top:0.3rem;display:block;">● VENDIDO</span>'
    : '<span style="color:#25D366;font-size:0.8rem;font-weight:600;margin-top:0.3rem;display:block;">● DISPONIBLE</span>';

  const dateAddedStr = v.dateAdded || new Date().toISOString().split('T')[0];
  const [year, month, day] = dateAddedStr.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  content.innerHTML = `
    <div class="preview-card-wrap">
      <img src="${v.images && v.images[0] ? v.images[0] : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'}" class="preview-img" onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'">
      <div class="preview-body">
        <div class="preview-header">
          <div>
            <p style="color:var(--gold); font-size:0.8rem; margin:0; text-transform:uppercase; font-weight:700;">${v.brand}</p>
            <h3 style="margin: 0 0 0.5rem 0; font-family: var(--font-display); font-size:1.6rem;">${v.model} <span style="color:var(--gold)">${v.year}</span></h3>
            <span style="font-size:0.75rem; color:rgba(255,255,255,0.4)">Fecha ingreso: ${formattedDate}</span>
          </div>
          <div style="text-align:right;">
            <p style="color:rgba(255,255,255,0.4); font-size:0.7rem; text-transform:uppercase; margin:0;">Precio</p>
            <p style="font-size:1.4rem; font-weight:700; color:var(--gold); margin:0;">${v.currency} ${v.price.toLocaleString('es-AR')}</p>
            ${statusHtml}
          </div>
        </div>
        
        <div class="preview-specs-grid">
          <div class="preview-spec-item">
            <div class="label">Kilometraje</div>
            <div class="value">${v.km.toLocaleString('es-AR')} km</div>
          </div>
          <div class="preview-spec-item">
            <div class="label">Combustible</div>
            <div class="value">${v.fuel || 'Nafta'}</div>
          </div>
          <div class="preview-spec-item">
            <div class="label">Transmisión</div>
            <div class="value">${v.transmission || 'Manual'}</div>
          </div>
          <div class="preview-spec-item">
            <div class="label">Motor</div>
            <div class="value">${v.engine || '--'}</div>
          </div>
          <div class="preview-spec-item">
            <div class="label">Color</div>
            <div class="value">${v.color || '--'}</div>
          </div>
          <div class="preview-spec-item">
            <div class="label">Año</div>
            <div class="value">${v.year}</div>
          </div>
        </div>
        
        <p style="color:rgba(255,255,255,0.7); font-size:0.88rem; line-height:1.6; margin-top:1rem;">${v.description || 'Sin descripción disponible.'}</p>
      </div>
    </div>
  `;

  document.getElementById('previewModalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  document.getElementById('previewModalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

async function loadAndRenderStockAlerts() {
  const tbody = document.getElementById('stockAlertsTableBody');
  if (!tbody) return;

  let alerts = [];

  if (typeof db !== 'undefined') {
    try {
      const snapshot = await db.collection('stock_alerts').where('status', '==', 'pending').get();
      snapshot.forEach(doc => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Error cargando alertas de stock de Firestore:", e);
    }
  }

  // Fallback o fusionar con locales (excluir demos si hay alertas reales)
  const localAlerts = JSON.parse(localStorage.getItem('ab_pending_stock_alerts') || '[]');
  const realLocalAlerts = localAlerts.filter(la => la.status === 'pending' && !['demo1','demo2'].includes(la.id));
  const demoLocalAlerts  = localAlerts.filter(la => la.status === 'pending' && ['demo1','demo2'].includes(la.id));

  // Agregar alertas reales locales que no estén ya en Firestore
  realLocalAlerts.forEach(la => {
    if (!alerts.some(a => a.ts === la.ts)) {
      alerts.push(la);
    }
  });

  // Solo mostrar demos si no hay ninguna alerta real
  if (alerts.length === 0) {
    const d1 = new Date(); d1.setDate(d1.getDate() - 3);
    const d2 = new Date(); d2.setDate(d2.getDate() - 1);
    alerts = [
      {
        id: 'demo1',
        nombre: 'Juan Pérez',
        telefono: '11 2233 4455',
        email: 'juan.perez@example.com',
        interes: 'Consulta por un vehículo',
        mensaje: 'Busco un Porsche 911 Carrera S modelo 2021 o superior, en lo posible color Gris Crayón.',
        ts: d1.toISOString(),
        status: 'pending'
      },
      {
        id: 'demo2',
        nombre: 'María Rodríguez',
        telefono: '11 9988 7766',
        email: 'maria.rodriguez@example.com',
        interes: 'Otro',
        mensaje: 'Me interesa un BMW M4 manual. Avísenme si les ingresa alguna unidad.',
        ts: d2.toISOString(),
        status: 'pending'
      }
    ];
    // Solo guardar demos si no hay reales
    if (realLocalAlerts.length === 0) {
      localStorage.setItem('ab_pending_stock_alerts', JSON.stringify(alerts));
    }
  }

  // Ordenar por fecha descendente
  alerts.sort((a, b) => new Date(b.ts) - new Date(a.ts));

  if (alerts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: rgba(255,255,255,0.3); padding: 2rem 0;">No hay pedidos de stock pendientes.</td></tr>`;
    return;
  }

  tbody.innerHTML = alerts.map(a => {
    const date = new Date(a.ts);
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    // Botón de acción dependiendo si es demo, local o de firestore
    const resolveClick = `resolveStockAlert('${a.id}', '${a.ts}')`;

    return `
      <tr>
        <td><strong>${a.nombre}</strong></td>
        <td>
          <div style="font-size:0.85rem; line-height:1.4;">
            📞 <a href="tel:${a.telefono}" style="color:var(--white);">${a.telefono}</a><br>
            ✉️ <a href="mailto:${a.email}" style="color:var(--gold);">${a.email}</a>
          </div>
        </td>
        <td>
          <div style="max-width:320px; white-space:normal; font-size:0.85rem; color:rgba(255,255,255,0.8); line-height:1.4;">
            ${a.mensaje}
          </div>
        </td>
        <td><span style="font-size:0.85rem; color:var(--gray);">${dateStr}</span></td>
        <td>
          <button class="btn-outline" onclick="${resolveClick}" style="padding:0.4rem 0.6rem; font-size:0.75rem; border-color:#25D366; color:#25D366;">
            ✓ Contactado
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function resolveStockAlert(id, ts) {
  if (confirm('¿Marcar este pedido de stock como resuelto/contactado?')) {
    // Si es demo o local
    let resolvedLocal = false;
    const localAlerts = JSON.parse(localStorage.getItem('ab_pending_stock_alerts') || '[]');
    const idx = localAlerts.findIndex(a => a.ts === ts || a.id === id);
    if (idx !== -1) {
      localAlerts[idx].status = 'resolved';
      localStorage.setItem('ab_pending_stock_alerts', JSON.stringify(localAlerts));
      resolvedLocal = true;
    }

    if (typeof db !== 'undefined' && id && !id.startsWith('demo')) {
      try {
        await db.collection('stock_alerts').doc(id).update({ status: 'resolved' });
      } catch(e) {
        console.error("Error al actualizar estado en Firestore:", e);
      }
    }

    logActivity('edit', 'Pedido de stock marcado como contactado');
    loadAndRenderStockAlerts();
    renderActivityLog();
  }
}
