// Cek status login saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Periksa status login pada local storage
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    // Jika pengguna belum login, redirect ke halaman login
    location.href = "index.html";
  }
});
