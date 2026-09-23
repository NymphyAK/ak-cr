/* ====== KONFIGURASI AKUN ADMIN (ganti sesuai kebutuhan) ====== */
      const ADMINS = [
        { user: "admin1", pass: "nymphy123" },
        { user: "admin2", pass: "nymphy123" },
        { user: "admin3", pass: "nymphy123" },
      ];
      /* Catatan keamanan: ini login sisi-klien sederhana untuk static site.
   Kredensial ada di kode ini (bisa dilihat lewat "view source"), jadi
   JANGAN dipakai untuk data yang benar-benar rahasia/sensitif tanpa
   backend & autentikasi yang sesungguhnya. Data sekarang tersimpan
   online di Firestore, shared ke semua yang buka halaman ini. */

      const SESSION_KEY = "nymphy_session";
      let liveData = [];
      let unsubscribe = null;
      let clearsRef = null; // diisi setelah Firebase berhasil diinisialisasi

      function esc(s) {
        return (s || "")
          .toString()
          .replace(
            /[&<>]/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c],
          );
      }
      function lines(s) {
        return (s || "")
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean);
      }

      /* ---------- LOGIN (dipasang paling awal, tidak tergantung Firebase) ---------- */
      function currentUser() {
        return sessionStorage.getItem(SESSION_KEY);
      }

      function showApp(user) {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        document.getElementById("who").textContent = "Login sebagai: " + user;
        startListening();
      }

      function tryLogin() {
        const u = document.getElementById("li-user").value.trim();
        const p = document.getElementById("li-pass").value;
        const found = ADMINS.find((a) => a.user === u && a.pass === p);
        const err = document.getElementById("login-error");
        if (found) {
          sessionStorage.setItem(SESSION_KEY, u);
          err.textContent = "";
          showApp(u);
        } else {
          err.textContent = "Username atau password salah.";
        }
      }

      document.getElementById("btn-login").addEventListener("click", tryLogin);
      document.getElementById("li-pass").addEventListener("keydown", (e) => {
        if (e.key === "Enter") tryLogin();
      });
      document.getElementById("li-user").addEventListener("keydown", (e) => {
        if (e.key === "Enter") tryLogin();
      });

      document.getElementById("btn-logout").addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        location.reload();
      });