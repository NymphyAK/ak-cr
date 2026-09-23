/* ---------- FIREBASE (dibungkus try/catch supaya error di sini TIDAK
   ikut menghentikan tombol login di atas) ---------- */
try {
  const firebaseConfig = {
    apiKey: "AIzaSyAlQ9FDa6jpXBK0TQPGAVs1vob5M8zWZXM",
    authDomain: "nymphy-1fac3.firebaseapp.com",
    projectId: "nymphy-1fac3",
    storageBucket: "nymphy-1fac3.firebasestorage.app",
    messagingSenderId: "415141979960",
    appId: "1:415141979960:web:fd8c47870564ac742243cd",
    measurementId: "G-56G3WT1JQF",
  };
  firebase.initializeApp(firebaseConfig);
  clearsRef = firebase.firestore().collection("clears");
} catch (e) {
  console.error("Firebase gagal diinisialisasi:", e);
}

function startListening() {
  if (!clearsRef) {
    document.getElementById("list").innerHTML =
      '<div class="empty">Firebase belum terhubung. Cek konfigurasi & koneksi.</div>';
    return;
  }
  if (unsubscribe) return;
  unsubscribe = clearsRef
    .orderBy("createdAt", "desc")
    .limit(500)
    .onSnapshot(
      (snap) => {
        liveData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        renderStats(liveData);
        renderList(liveData);
      },
      (err) => {
        console.error("Firestore error", err);
        alert("Gagal memuat data dari Firebase. Cek konfigurasi & rules.");
      },
    );
}
