// js/firebase-config.js

// CONFIGURACIÓN DE FIREBASE
// Reemplazá estos valores con las credenciales de tu proyecto en la consola de Firebase:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto (o selecciona uno existente) llamado AutoBerlin.
// 3. Habilita "Firestore Database" (Base de datos), "Authentication" (método correo y contraseña) y "Storage" (Almacenamiento).
// 4. En la configuración del proyecto, agrega una aplicación web y copia los valores del objeto "firebaseConfig".
// 5. Reemplaza los valores de abajo con tus credenciales:
const firebaseConfig = {
  apiKey: "AIzaSyDUcURTw_YLFOLbnvPyhUR36ciL-YIVZtY",
  authDomain: "autoberlin-dc3a5.firebaseapp.com",
  projectId: "autoberlin-dc3a5",
  storageBucket: "autoberlin-dc3a5.firebasestorage.app",
  messagingSenderId: "7309710583",
  appId: "1:7309710583:web:03a10120d7ac414e89d272",
  measurementId: "G-8G30T76WX5"
};

// Variables globales para la base de datos, autenticación y storage
let db;
let auth;
let storage;

// Inicialización de Firebase
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY") {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    console.log("🔥 Firebase inicializado correctamente.");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase no inicializado: Por favor edita 'js/firebase-config.js' con tus credenciales.");
}
