// vehicles.js — Catálogo embebido + soporte para vehicles.json en servidor

// Datos embebidos (funcionan siempre, incluso abriendo el archivo localmente)
const VEHICLES_DATA = [
  // ── AUTO BERLIN (Premium) ──
  {
    id: 1, brand: "BMW", model: "M3 Competition", year: 2023, km: 12000,
    price: 95000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Azul Portimao", engine: "3.0L Biturbo 510cv",
    description: "Referente absoluto del segmento deportivo. El BMW M3 Competition combina deportividad brutal con refinamiento. Motor biturbo de 510cv, suspensión adaptativa M y caja automática M Steptronic de 8 velocidades.",
    status: "available", featured: true, badge: "EXCLUSIVO", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80"]
  },
  {
    id: 2, brand: "Mercedes-Benz", model: "AMG GT 63 S", year: 2022, km: 8500,
    price: 145000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Negro Obsidiana", engine: "4.0L Biturbo V8 630cv",
    description: "La expresión máxima del GT de alto rendimiento de Mercedes-AMG. 630cv de potencia pura, aceleración 0-100 en 3.2 segundos y un diseño que corta el aire con elegancia absoluta. Interior en cuero Nappa con costura contrastante.",
    status: "available", featured: true, badge: "PREMIUM", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"]
  },
  {
    id: 3, brand: "Porsche", model: "911 Carrera S", year: 2023, km: 5200,
    price: 178000, currency: "USD", fuel: "Nafta", transmission: "PDK",
    color: "Rojo Guards", engine: "3.0L Biturbo Bóxer 450cv",
    description: "El ícono más puro del automovilismo deportivo. El 911 Carrera S 2023 lleva la ingeniería Porsche a su máxima expresión con el motor trasero que lo distingue del mundo. Impecable estado.",
    status: "available", featured: true, badge: "EXCLUSIVO", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80"]
  },
  {
    id: 4, brand: "Audi", model: "RS6 Avant", year: 2023, km: 15000,
    price: 112000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Gris Nardo", engine: "4.0L TFSI V8 600cv",
    description: "La familiar más radical del mundo. El Audi RS6 Avant es el vehículo que redefine lo que puede ser un familiar: 600cv, tracción Quattro y una presencia imponente en cualquier circuito o avenida.",
    status: "available", featured: false, badge: "PREMIUM", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80", "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80"]
  },
  {
    id: 5, brand: "Lamborghini", model: "Urus S", year: 2023, km: 3000,
    price: 320000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Verde Mantis", engine: "4.0L Twin-Turbo V8 666cv",
    description: "El Super SUV que lo cambió todo. El Lamborghini Urus S representa la perfecta fusión entre la brutalidad de un superdeportivo y la practicidad de un SUV. 666cv, diseño de otro planeta y sonido que estremece.",
    status: "available", featured: true, badge: "ULTRA EXCLUSIVO", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80", "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80"]
  },
  {
    id: 6, brand: "Range Rover", model: "Sport Autobiography", year: 2023, km: 22000,
    price: 135000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Blanco Fuji", engine: "5.0L V8 Supercharged 525cv",
    description: "Lujo sin compromisos, capacidad todoterreno sin igual. El Range Rover Sport Autobiography V8 combina el interior más refinado del segmento con la capacidad off-road que solo Land Rover puede ofrecer.",
    status: "available", featured: false, badge: "PREMIUM", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=1200&q=80", "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"]
  },
  {
    id: 7, brand: "Ferrari", model: "Roma", year: 2022, km: 6800,
    price: 310000, currency: "USD", fuel: "Nafta", transmission: "DCT 8v",
    color: "Rosso Portofino", engine: "3.9L Biturbo V8 620cv",
    description: "La dolce vita hecha automóvil. El Ferrari Roma encarna la elegancia italiana en su forma más pura: líneas fluidas que nacen de la tradición de Maranello y motor biturbo de 620cv.",
    status: "available", featured: true, badge: "ULTRA EXCLUSIVO", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80", "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80"]
  },
  {
    id: 8, brand: "Porsche", model: "Cayenne Turbo GT", year: 2022, km: 18000,
    price: 165000, currency: "USD", fuel: "Nafta", transmission: "PDK",
    color: "Negro Jet", engine: "4.0L Biturbo V8 640cv",
    description: "El SUV más rápido que Porsche jamás produjo. El Cayenne Turbo GT completa el Nürburgring más rápido que el 918 Spyder. Tecnología de competición en un paquete que acepta cinco pasajeros.",
    status: "sold", featured: false, badge: "PREMIUM", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80", "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80"]
  },
  {
    id: 9, brand: "Jeep", model: "Grand Cherokee Summit", year: 2023, km: 28000,
    price: 72000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Gris Granite", engine: "3.6L V6 293cv",
    description: "El SUV americano en su versión más equipada. El Jeep Grand Cherokee Summit combina tecnología de vanguardia, confort de primera línea y capacidad off-road auténtica.",
    status: "available", featured: false, badge: "", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"]
  },
  {
    id: 10, brand: "BMW", model: "X7 xDrive50i", year: 2023, km: 9000,
    price: 118000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Azul Tanzanite", engine: "4.4L Biturbo V8 530cv",
    description: "El flagship SAV de BMW en su versión más potente. El X7 xDrive50i ofrece siete plazas de auténtico lujo con el sistema iDrive 8 más avanzado y la potencia de un V8 de 530cv.",
    status: "available", featured: false, badge: "EXCLUSIVO", line: "autoberlin",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80", "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80"]
  },
  {
    id: 11, brand: "Fiat", model: "Argo Precision", year: 2018, km: 100000,
    price: 100000, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Blanco", engine: "1.3L Firefly 101cv",
    description: "Fiat Argo Precision 2018 en impecable estado. Versión tope de gama con equipamiento completo: pantalla táctil, cámara de reversa, control de crucero, tapizados premium y todos los airbags. Excelente relación precio-valor.",
    status: "available", featured: false, badge: "", line: "autoberlin",
    images: ["img/vehicles/auto2_1.jpg"]
  },
  {
    id: 12, brand: "Renault", model: "Clio Full", year: 2013, km: 60000,
    price: 99000, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Beige Champagne", engine: "1.2L 16v 75cv",
    description: "Renault Clio Full 2013 con solo 60.000 km. Versión full con aire acondicionado, dirección asistida, vidrios y espejos eléctricos, cierre centralizado y tapizado. Estado de conservación excelente, titular al día.",
    status: "available", featured: false, badge: "", line: "autoberlin",
    images: ["img/vehicles/auto1_1.jpg", "img/vehicles/auto1_2.jpg"]
  },

  // ── BERLIN MOTOS ──
  {
    id: 1001, brand: "Honda", model: "CB 190R", year: 2024, km: 800,
    price: 3200, currency: "USD", fuel: "Nafta", transmission: "Manual 5v",
    color: "Negro", engine: "184cc 17cv",
    description: "La Honda CB 190R es la naked deportiva ideal para la ciudad y ruta. Motor monocilíndrico de 184cc con inyección electrónica, freno a disco delantero, tablero digital y un diseño agresivo que no pasa desapercibido.",
    status: "available", featured: true, badge: "NUEVA", line: "motos",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80", "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=1200&q=80"]
  },
  {
    id: 1002, brand: "Yamaha", model: "MT-03", year: 2024, km: 1200,
    price: 5800, currency: "USD", fuel: "Nafta", transmission: "Manual 6v",
    color: "Azul Icon", engine: "321cc Bicilíndrico 42cv",
    description: "La Yamaha MT-03 es la dark side de las naked. Motor bicilíndrico de 321cc, chasis liviano Diamond y posición de manejo dominante. Perfecta para el uso diario con carácter deportivo de sobra.",
    status: "available", featured: true, badge: "", line: "motos",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80", "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&q=80"]
  },
  {
    id: 1003, brand: "Kawasaki", model: "Ninja 400", year: 2023, km: 3500,
    price: 7500, currency: "USD", fuel: "Nafta", transmission: "Manual 6v",
    color: "Verde KRT", engine: "399cc Bicilíndrico 49cv",
    description: "La Kawasaki Ninja 400 es la referencia en deportivas de entrada. Motor bicilíndrico suave y potente, carenado completo con aerodinámica real y un peso contenido que la hace ágil en cualquier curva.",
    status: "available", featured: false, badge: "DEPORTIVA", line: "motos",
    images: ["https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=1200&q=80", "https://images.unsplash.com/photo-1622185135505-2d795003994a?w=1200&q=80"]
  },
  {
    id: 1004, brand: "Bajaj", model: "Dominar 400", year: 2024, km: 500,
    price: 4200, currency: "USD", fuel: "Nafta", transmission: "Manual 6v",
    color: "Rojo Aurora", engine: "373cc Monocilíndrico 40cv",
    description: "La Bajaj Dominar 400 es la touring accesible que no escatima en equipamiento. Motor monocilíndrico de 373cc con doble bujía, ABS de doble canal, luces LED completas y un confort de ruta sorprendente para su segmento.",
    status: "available", featured: false, badge: "", line: "motos",
    images: ["https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200&q=80", "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1200&q=80"]
  },
  {
    id: 1005, brand: "BMW", model: "G 310 R", year: 2023, km: 4800,
    price: 6900, currency: "USD", fuel: "Nafta", transmission: "Manual 6v",
    color: "Blanco Cosmic", engine: "313cc Monocilíndrico 34cv",
    description: "La BMW G 310 R es la puerta de entrada al mundo BMW Motorrad. Motor monocilíndrico invertido de 313cc, diseño premium, ABS y la calidad de construcción alemana en un formato accesible y urbano.",
    status: "available", featured: true, badge: "PREMIUM", line: "motos",
    images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1200&q=80", "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=1200&q=80"]
  },
  {
    id: 1006, brand: "KTM", model: "Duke 390", year: 2024, km: 2000,
    price: 7200, currency: "USD", fuel: "Nafta", transmission: "Manual 6v",
    color: "Naranja KTM", engine: "373cc Monocilíndrico 44cv",
    description: "La KTM Duke 390 es pura adrenalina concentrada. Motor monocilíndrico de alto rendimiento, chasis tubular de acero, display TFT a color con conectividad y la actitud Ready to Race que define a la marca austríaca.",
    status: "available", featured: false, badge: "", line: "motos",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80", "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200&q=80"]
  },

  // ── BERLIN MERCOSUR (Autos nacionales) ──
  {
    id: 2001, brand: "Fiat", model: "Cronos Drive 1.3", year: 2023, km: 25000,
    price: 14500, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Blanco Alaska", engine: "1.3L Firefly 101cv",
    description: "El Fiat Cronos Drive es el sedán más vendido de Argentina por una razón: amplio baúl de 525 litros, motor Firefly eficiente y confiable, y un equipamiento que supera a su competencia directa. Ideal para familia y trabajo.",
    status: "available", featured: true, badge: "", line: "mercosur",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80", "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"]
  },
  {
    id: 2002, brand: "Volkswagen", model: "Polo Trendline", year: 2024, km: 8000,
    price: 18000, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Gris Platino", engine: "1.6L MSI 110cv",
    description: "El Volkswagen Polo Trendline combina la solidez alemana con producción brasileña. Plataforma MQB, excelente comportamiento dinámico, espacioso para su segmento y con la confiabilidad que caracteriza a VW.",
    status: "available", featured: false, badge: "", line: "mercosur",
    images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"]
  },
  {
    id: 2003, brand: "Chevrolet", model: "Cruze LTZ", year: 2022, km: 35000,
    price: 22000, currency: "USD", fuel: "Nafta", transmission: "Automático",
    color: "Negro Mosaic", engine: "1.4L Turbo 153cv",
    description: "El Chevrolet Cruze LTZ es el sedán mediano más completo del mercado argentino. Motor turbo de 153cv, caja automática de 6 velocidades, MyLink con Android Auto y Apple CarPlay, y un nivel de equipamiento premium.",
    status: "available", featured: true, badge: "", line: "mercosur",
    images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80", "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"]
  },
  {
    id: 2004, brand: "Peugeot", model: "208 Allure", year: 2024, km: 5000,
    price: 19500, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Azul Vertigo", engine: "1.6L VTi 115cv",
    description: "El Peugeot 208 Allure es diseño francés en estado puro. i-Cockpit con volante pequeño, pantalla táctil de 7 pulgadas, interior premium con materiales soft-touch y una dinámica de conducción que divierte en cada curva.",
    status: "available", featured: false, badge: "", line: "mercosur",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80"]
  },
  {
    id: 2005, brand: "Toyota", model: "Corolla XEi", year: 2023, km: 18000,
    price: 28000, currency: "USD", fuel: "Nafta", transmission: "CVT",
    color: "Gris Oscuro", engine: "2.0L 170cv",
    description: "El Toyota Corolla XEi es sinónimo de confiabilidad absoluta. Motor 2.0 con caja CVT, Toyota Safety Sense de serie, calidad de construcción impecable y un valor de reventa que no tiene competencia en el mercado.",
    status: "available", featured: true, badge: "", line: "mercosur",
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80", "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80"]
  },
  {
    id: 2006, brand: "Renault", model: "Sandero Stepway", year: 2024, km: 3000,
    price: 16800, currency: "USD", fuel: "Nafta", transmission: "Manual",
    color: "Naranja Valencia", engine: "1.6L 16v 115cv",
    description: "El Renault Sandero Stepway es el crossover urbano más carismático. Altura elevada, barras de techo, protecciones laterales y un interior espacioso con Media Nav. La opción inteligente para calles argentinas.",
    status: "available", featured: false, badge: "", line: "mercosur",
    images: ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80"]
  }
];

let allVehicles = [];
let currentLine = 'autoberlin';
window._slideIndex = 0;
let fsImages = [];
let fsIndex = 0;

// Backgrounds and texts for hero section per line
const HERO_LINE_DATA = {
  autoberlin: {
    bg: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90",
    title: 'Ingeniería<br>para quienes<br><span style="color: var(--gold, #DAA520);">exigen lo mejor.</span>',
    desc: 'Vehículos premium seleccionados. Sin compromisos, sin atajos. La experiencia de élite en zona sur.'
  },
  motos: {
    bg: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=90",
    title: 'Libertad y Alta Creada<br>sobre dos ruedas<br><span style="color: var(--gold, #DAA520);">Berlin Motos.</span>',
    desc: 'Motos de alta y media cilindrada. Diseños exclusivos y máximo rendimiento para tu próxima aventura.'
  },
  mercosur: {
    bg: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1400&q=90",
    title: 'Tu próximo auto,<br>más cerca tuyo<br><span style="color: var(--gold, #DAA520);">Berlin Mercosur.</span>',
    desc: 'La mejor selección de autos nacionales y regionales con financiación transparente y entrega inmediata.'
  }
};

// Switch business line
window.switchLine = function(line) {
  currentLine = line;
  // Update button states (both hero and catalog)
  document.querySelectorAll('.line-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.line === line);
  });

  // Update Hero background & text
  const heroImg = document.getElementById('hero-car');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-desc');
  if (HERO_LINE_DATA[line]) {
    if (heroImg) {
      heroImg.style.transition = 'opacity 0.4s ease';
      heroImg.style.opacity = '0.3';
      setTimeout(() => {
        heroImg.src = HERO_LINE_DATA[line].bg;
        heroImg.style.opacity = '1';
      }, 250);
    }
    if (heroTitle) heroTitle.innerHTML = HERO_LINE_DATA[line].title;
    if (heroDesc) heroDesc.textContent = HERO_LINE_DATA[line].desc;
  }

  // Reset filters
  const sInput = document.getElementById('searchInput');
  const bFilter = document.getElementById('brandFilter');
  const fFilter = document.getElementById('fuelFilter');
  const stFilter = document.getElementById('statusFilter');
  if (sInput) sInput.value = '';
  if (bFilter) bFilter.value = '';
  if (fFilter) fFilter.value = '';
  if (stFilter) stFilter.value = '';

  // Rebuild brand filter for this line
  populateBrandFilter();
  // Re-filter and render
  currentPage = 1;
  filterVehicles();
};

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
        // También cargamos el JSON para combinarlos
        try {
          const res = await fetch('data/vehicles.json');
          if (res.ok) {
            const data = await res.json();
            // Evitar duplicados por nombre de modelo
            data.vehicles.forEach(vJson => {
              if (!allVehicles.some(vDb => vDb.model === vJson.model)) {
                allVehicles.push(vJson);
              }
            });
          }
        } catch(e) {}

        // Asignar línea por defecto a vehículos sin línea
        allVehicles.forEach(v => { if (!v.line) v.line = 'autoberlin'; });
        // Ordenar por ID descendente
        allVehicles.sort((a, b) => b.id - a.id);
        // Agregar datos embebidos (motos/mercosur demo)
        VEHICLES_DATA.forEach(vEmb => {
          if (!allVehicles.some(v => v.id === vEmb.id)) allVehicles.push(vEmb);
        });
        console.log("🚘 Cargado combinando Firestore y JSON:", allVehicles.length, "vehículos.");
        populateBrandFilter();
        filterVehicles();
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
    } else { allVehicles = [...VEHICLES_DATA]; }
  } catch (e) {
    allVehicles = [...VEHICLES_DATA];
  }
  // Asignar línea por defecto y merge embebidos
  allVehicles.forEach(v => { if (!v.line) v.line = 'autoberlin'; });
  VEHICLES_DATA.forEach(vEmb => {
    if (!allVehicles.some(v => v.id === vEmb.id)) allVehicles.push(vEmb);
  });
  populateBrandFilter();
  filterVehicles();
}

function populateBrandFilter() {
  const sel = document.getElementById('brandFilter');
  // Clear existing options except the first "all"
  sel.innerHTML = '<option value="">Todas las marcas</option>';
  const lineVehicles = allVehicles.filter(v => (v.line || 'autoberlin') === currentLine);
  const brands = [...new Set(lineVehicles.map(v => v.brand))].sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    sel.appendChild(opt);
  });
}

let currentPage = 1;
let ITEMS_PER_PAGE = window.innerWidth <= 768 ? 4 : 12;
let filteredVehicles = [];

window.addEventListener('resize', () => {
  const newItemsPerPage = window.innerWidth <= 768 ? 4 : 12;
  if (ITEMS_PER_PAGE !== newItemsPerPage) {
    ITEMS_PER_PAGE = newItemsPerPage;
    currentPage = 1;
    renderPage();
  }
});

function renderPage() {
  const grid = document.getElementById('vehiclesGrid');
  const noRes = document.getElementById('noResults');
  const count = document.getElementById('vehicleCount');
  const paginationControls = document.getElementById('paginationControls');
  const pageIndicator = document.getElementById('pageIndicator');
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');

  grid.innerHTML = '';
  count.textContent = filteredVehicles.length;

  if (!filteredVehicles.length) { 
    noRes.style.display = 'block'; 
    if (paginationControls) paginationControls.style.display = 'none';
    return; 
  }
  
  noRes.style.display = 'none';

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  if (totalPages > 1 && paginationControls) {
    paginationControls.style.display = 'flex';
    pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
    btnPrevPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages;
    btnPrevPage.style.opacity = currentPage === 1 ? '0.5' : '1';
    btnPrevPage.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
    btnNextPage.style.opacity = currentPage === totalPages ? '0.5' : '1';
    btnNextPage.style.cursor = currentPage === totalPages ? 'not-allowed' : 'pointer';
  } else if (paginationControls) {
    paginationControls.style.display = 'none';
  }

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredVehicles.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  pageItems.forEach(v => {
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
  filteredVehicles = allVehicles.filter(v =>
    (v.line || 'autoberlin') === currentLine &&
    (!search || v.brand.toLowerCase().includes(search) || v.model.toLowerCase().includes(search)) &&
    (!brand || v.brand === brand) &&
    (!fuel || v.fuel === fuel) &&
    (!status || v.status === status)
  );
  currentPage = 1; // Reset a la primera página al filtrar
  renderPage();
}

window.prevPage = function() {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }
};

window.nextPage = function() {
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }
};

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
  
  // Guardar imágenes para pantalla completa
  fsImages = v.images;
  
  // Agregar evento para abrir en pantalla completa al tocar la galería del modal
  gallery.onclick = (e) => {
    if(e.target.tagName === 'IMG') {
      openFsLightbox(window._slideIndex);
    }
  };
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

function openFsLightbox(index) {
  fsIndex = index;
  updateFsLightbox();
  document.getElementById('fsLightbox').classList.add('active');
}

function closeFsLightbox() {
  document.getElementById('fsLightbox').classList.remove('active');
}

function changeFsSlide(dir) {
  if(!fsImages.length) return;
  fsIndex = (fsIndex + dir + fsImages.length) % fsImages.length;
  updateFsLightbox();
}

function updateFsLightbox() {
  const imgEl = document.getElementById('fsImage');
  const fillEl = document.getElementById('fsIndicatorFill');
  imgEl.src = fsImages[fsIndex];
  
  // Actualizar barrita dorada
  if(fsImages.length > 1) {
    const pct = ((fsIndex + 1) / fsImages.length) * 100;
    fillEl.style.width = pct + '%';
  } else {
    fillEl.style.width = '100%';
  }
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

  // Swipe support for mobile gallery
  let touchStartX = 0;
  let touchEndX = 0;
  const modalGallery = document.getElementById('modalGallery');
  
  modalGallery.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  
  modalGallery.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) changeSlide(1); // Swipe left -> next
    if (touchEndX > touchStartX + 40) changeSlide(-1); // Swipe right -> prev
  }, {passive: true});

  // WebMCP API Integration for Browser AI Agents
  if ('modelContext' in navigator && typeof navigator.modelContext?.provideContext === 'function') {
    try {
      navigator.modelContext.provideContext({
        tools: [
          {
            name: "search_autoberlin_stock",
            description: "Busca vehículos en el stock de Auto Berlin por categoría (autoberlin, motos, mercosur), marca o modelo",
            inputSchema: {
              type: "object",
              properties: {
                line: { type: "string", enum: ["autoberlin", "motos", "mercosur"], description: "Línea de negocio" },
                search: { type: "string", description: "Término de búsqueda (marca o modelo)" }
              }
            },
            execute: async (args) => {
              if (args.line) window.switchLine(args.line);
              if (args.search && document.getElementById('searchInput')) {
                document.getElementById('searchInput').value = args.search;
                filterVehicles();
              }
              return { success: true, count: filteredVehicles.length, vehicles: filteredVehicles.slice(0, 5) };
            }
          }
        ]
      });
      console.log("🤖 WebMCP tools registered for AI Agents.");
    } catch (err) {
      console.warn("WebMCP registration note:", err);
    }
  }
});
