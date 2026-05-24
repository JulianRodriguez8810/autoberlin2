// vehicles.js — Catálogo embebido + soporte para vehicles.json en servidor

// Datos embebidos (funcionan siempre, incluso abriendo el archivo localmente)
const VEHICLES_DATA = [
  {
    id: 1, brand: "BMW", model: "M3 Competition", year: 2023, km: 12000,
    price: 95000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Azul Portimao", engine: "3.0L Biturbo 510cv",
    description: "Referente absoluto del segmento deportivo. El BMW M3 Competition combina deportividad brutal con refinamiento. Motor biturbo de 510cv, suspensión adaptativa M y caja automática M Steptronic de 8 velocidades.",
    status: "available", featured: true, badge: "EXCLUSIVO",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80"]
  },
  {
    id: 2, brand: "Mercedes-Benz", model: "AMG GT 63 S", year: 2022, km: 8500,
    price: 145000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Negro Obsidiana", engine: "4.0L Biturbo V8 630cv",
    description: "La expresión máxima del GT de alto rendimiento de Mercedes-AMG. 630cv de potencia pura, aceleración 0-100 en 3.2 segundos y un diseño que corta el aire con elegancia absoluta. Interior en cuero Nappa con costura contrastante.",
    status: "available", featured: true, badge: "PREMIUM",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"]
  },
  {
    id: 3, brand: "Porsche", model: "911 Carrera S", year: 2023, km: 5200,
    price: 178000, currency: "USD", fuel: "Nafta", transmission: "PDK",
    color: "Rojo Guards", engine: "3.0L Biturbo Bóxer 450cv",
    description: "El ícono más puro del automovilismo deportivo. El 911 Carrera S 2023 lleva la ingeniería Porsche a su máxima expresión con el motor trasero que lo distingue del mundo. Impecable estado.",
    status: "available", featured: true, badge: "EXCLUSIVO",
    images: ["https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80"]
  },
  {
    id: 4, brand: "Audi", model: "RS6 Avant", year: 2023, km: 15000,
    price: 112000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Gris Nardo", engine: "4.0L TFSI V8 600cv",
    description: "La familiar más radical del mundo. El Audi RS6 Avant es el vehículo que redefine lo que puede ser un familiar: 600cv, tracción Quattro y una presencia imponente en cualquier circuito o avenida.",
    status: "available", featured: false, badge: "PREMIUM",
    images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80", "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80"]
  },
  {
    id: 5, brand: "Lamborghini", model: "Urus S", year: 2023, km: 3000,
    price: 320000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Verde Mantis", engine: "4.0L Twin-Turbo V8 666cv",
    description: "El Super SUV que lo cambió todo. El Lamborghini Urus S representa la perfecta fusión entre la brutalidad de un superdeportivo y la practicidad de un SUV. 666cv, diseño de otro planeta y sonido que estremece.",
    status: "available", featured: true, badge: "ULTRA EXCLUSIVO",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80", "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80"]
  },
  {
    id: 6, brand: "Range Rover", model: "Sport Autobiography", year: 2023, km: 22000,
    price: 135000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Blanco Fuji", engine: "5.0L V8 Supercharged 525cv",
    description: "Lujo sin compromisos, capacidad todoterreno sin igual. El Range Rover Sport Autobiography V8 combina el interior más refinado del segmento con la capacidad off-road que solo Land Rover puede ofrecer.",
    status: "available", featured: false, badge: "PREMIUM",
    images: ["https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=1200&q=80", "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"]
  },
  {
    id: 7, brand: "Ferrari", model: "Roma", year: 2022, km: 6800,
    price: 310000, currency: "USD", fuel: "Nafta", transmission: "DCT 8v",
    color: "Rosso Portofino", engine: "3.9L Biturbo V8 620cv",
    description: "La dolce vita hecha automóvil. El Ferrari Roma encarna la elegancia italiana en su forma más pura: líneas fluidas que nacen de la tradición de Maranello y motor biturbo de 620cv.",
    status: "available", featured: true, badge: "ULTRA EXCLUSIVO",
    images: ["https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80", "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80"]
  },
  {
    id: 8, brand: "Porsche", model: "Cayenne Turbo GT", year: 2022, km: 18000,
    price: 165000, currency: "USD", fuel: "Nafta", transmission: "PDK",
    color: "Negro Jet", engine: "4.0L Biturbo V8 640cv",
    description: "El SUV más rápido que Porsche jamás produjo. El Cayenne Turbo GT completa el Nürburgring más rápido que el 918 Spyder. Tecnología de competición en un paquete que acepta cinco pasajeros.",
    status: "sold", featured: false, badge: "PREMIUM",
    images: ["https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80"]
  },
  {
    id: 9, brand: "Jeep", model: "Grand Cherokee Summit", year: 2023, km: 28000,
    price: 72000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Gris Granite", engine: "3.6L V6 293cv",
    description: "El SUV americano en su versión más equipada. El Jeep Grand Cherokee Summit combina tecnología de vanguardia, confort de primera línea y capacidad off-road auténtica.",
    status: "available", featured: false, badge: "",
    images: ["https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"]
  },
  {
    id: 10, brand: "BMW", model: "X7 xDrive50i", year: 2023, km: 9000,
    price: 118000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Azul Tanzanite", engine: "4.4L Biturbo V8 530cv",
    description: "El flagship SAV de BMW en su versión más potente. El X7 xDrive50i ofrece siete plazas de auténtico lujo con el sistema iDrive 8 más avanzado y la potencia de un V8 de 530cv.",
    status: "available", featured: false, badge: "EXCLUSIVO",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80"]
  },
  {
    id: 11, brand: "Fiat", model: "Argo Precision", year: 2018, km: 100000,
    price: 100000, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Blanco", engine: "1.3L Firefly 101cv",
    description: "Fiat Argo Precision 2018 en impecable estado. Versión tope de gama con equipamiento completo: pantalla táctil, cámara de reversa, control de crucero, tapizados premium y todos los airbags. Excelente relación precio-valor.",
    status: "available", featured: false, badge: "",
    images: ["img/vehicles/auto2_1.jpg"]
  },
  {
    id: 12, brand: "Renault", model: "Clio Full", year: 2013, km: 60000,
    price: 99000, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Beige Champagne", engine: "1.2L 16v 75cv",
    description: "Renault Clio Full 2013 con solo 60.000 km. Versión full con aire acondicionado, dirección asistida, vidrios y espejos eléctricos, cierre centralizado y tapizado. Estado de conservación excelente, titular al día.",
    status: "available", featured: false, badge: "",
    images: ["img/vehicles/auto1_1.jpg", "img/vehicles/auto1_2.jpg"]
  }
];

let allVehicles = [];
window._slideIndex = 0;

async function loadVehicles() {
  // Intentar cargar desde Firebase Firestore si está disponible
  if (typeof db !== 'undefined') {
    try {
      const snapshot = await db.collection('vehicles').get();
      if (!snapshot.empty) {
        allVehicles = [];
        snapshot.forEach(doc => {
          allVehicles.push(doc.data());
        });
        // Ordenar por ID descendente (los más nuevos primero)
        allVehicles.sort((a, b) => b.id - a.id);
        console.log("🚘 Cargado desde Firebase Firestore:", allVehicles.length, "vehículos.");
        populateBrandFilter();
        renderVehicles(allVehicles);
        return;
      }
    } catch (e) {
      console.error("⚠️ Error cargando desde Firestore, intentando local:", e);
    }
  }

  // Fallback local
  try {
    const res = await fetch('data/vehicles.json');
    if (res.ok) {
      const data = await res.json();
      allVehicles = data.vehicles;
    } else { allVehicles = VEHICLES_DATA; }
  } catch (e) {
    allVehicles = VEHICLES_DATA;
  }
  populateBrandFilter();
  renderVehicles(allVehicles);
}

function populateBrandFilter() {
  const sel = document.getElementById('brandFilter');
  const brands = [...new Set(allVehicles.map(v => v.brand))].sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    sel.appendChild(opt);
  });
}

function renderVehicles(list) {
  const grid = document.getElementById('vehiclesGrid');
  const noRes = document.getElementById('noResults');
  const count = document.getElementById('vehicleCount');
  grid.innerHTML = '';
  count.textContent = list.length;
  if (!list.length) { noRes.style.display = 'block'; return; }
  noRes.style.display = 'none';

  list.forEach(v => {
    const card = document.createElement('div');
    card.className = 'vehicle-card' + (v.status === 'sold' ? ' sold' : '');
    card.innerHTML = `
      <div class="vehicle-img-wrap">
        <img src="${v.images[0]}" alt="${v.brand} ${v.model}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'">
        ${v.badge ? `<span class="vehicle-badge">${v.badge}</span>` : ''}
        ${v.status === 'sold' ? '<span class="sold-badge">Vendido</span>' : ''}
      </div>
      <div class="vehicle-body">
        <p class="vehicle-brand">${v.brand}</p>
        <h3 class="vehicle-name">${v.model} ${v.year}</h3>
        <div class="vehicle-specs">
          <span class="spec">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${v.km.toLocaleString('es-AR')} km
          </span>
          <span class="spec">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            ${v.fuel}
          </span>
          <span class="spec">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
            ${v.transmission}
          </span>
        </div>
        <div class="vehicle-footer">
          <div class="vehicle-price"><span class="currency">${v.currency} </span>${v.price.toLocaleString('es-AR')}</div>
          <button class="vehicle-action" aria-label="Ver detalles">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>`;
    card.addEventListener('click', () => openModal(v.id));
    grid.appendChild(card);
  });
}

function filterVehicles() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const brand = document.getElementById('brandFilter').value;
  const fuel = document.getElementById('fuelFilter').value;
  const status = document.getElementById('statusFilter').value;
  const filtered = allVehicles.filter(v =>
    (!search || v.brand.toLowerCase().includes(search) || v.model.toLowerCase().includes(search)) &&
    (!brand || v.brand === brand) &&
    (!fuel || v.fuel === fuel) &&
    (!status || v.status === status)
  );
  renderVehicles(filtered);
}

function openModal(id) {
  const v = allVehicles.find(x => x.id === id);
  if (!v) return;
  const gallery = document.getElementById('modalGallery');
  const content = document.getElementById('modalContent');

  gallery.innerHTML = v.images.map((img, i) =>
    `<img src="${img}" alt="${v.brand} ${v.model}" class="${i === 0 ? 'active' : ''}">`
  ).join('') +
    (v.images.length > 1 ? `<button class="gallery-prev" onclick="changeSlide(-1)">&#8249;</button><button class="gallery-next" onclick="changeSlide(1)">&#8250;</button>` : '');

  const waMsg = encodeURIComponent(`Hola! Vi el ${v.brand} ${v.model} ${v.year} en Auto Berlin y me interesa. ¿Está disponible?`);
  const statusHtml = v.status === 'sold'
    ? '<span style="color:#ff4444;font-size:0.8rem;font-weight:600;margin-top:0.3rem;display:block;">&#9679; VENDIDO</span>'
    : '<span style="color:#25D366;font-size:0.8rem;font-weight:600;margin-top:0.3rem;display:block;">&#9679; DISPONIBLE</span>';

  content.innerHTML = `
    <div class="modal-header">
      <div><p class="modal-brand">${v.brand}</p><h2 class="modal-title">${v.model} <span style="color:var(--gold)">${v.year}</span></h2></div>
      <div class="modal-price-block"><p class="modal-price-label">Precio</p><p class="modal-price">${v.currency} ${v.price.toLocaleString('es-AR')}</p>${statusHtml}</div>
    </div>
    <div class="modal-specs-grid">
      <div class="modal-spec-item"><p class="label">Kilometraje</p><p class="value">${v.km.toLocaleString('es-AR')} km</p></div>
      <div class="modal-spec-item"><p class="label">Combustible</p><p class="value">${v.fuel}</p></div>
      <div class="modal-spec-item"><p class="label">Transmisión</p><p class="value">${v.transmission}</p></div>
      <div class="modal-spec-item"><p class="label">Motor</p><p class="value">${v.engine}</p></div>
      <div class="modal-spec-item"><p class="label">Color</p><p class="value">${v.color}</p></div>
      <div class="modal-spec-item"><p class="label">Año</p><p class="value">${v.year}</p></div>
    </div>
    <p class="modal-desc">${v.description}</p>
    <div class="modal-actions">
      ${v.status !== 'sold' ? `<a href="https://wa.me/5491100000000?text=${waMsg}" target="_blank" class="btn-whatsapp">&#128172; Consultar por WhatsApp</a>` : ''}
      <a href="tel:+5491100000000" class="btn-outline">&#128222; Llamar</a>
    </div>`;

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  window._slideIndex = 0;
}

function changeSlide(dir) {
  const imgs = document.querySelectorAll('#modalGallery img');
  if (!imgs.length) return;
  imgs[window._slideIndex].classList.remove('active');
  window._slideIndex = (window._slideIndex + dir + imgs.length) % imgs.length;
  imgs[window._slideIndex].classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  loadVehicles();
  document.getElementById('searchInput').addEventListener('input', filterVehicles);
  document.getElementById('brandFilter').addEventListener('change', filterVehicles);
  document.getElementById('fuelFilter').addEventListener('change', filterVehicles);
  document.getElementById('statusFilter').addEventListener('change', filterVehicles);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
