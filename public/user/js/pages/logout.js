document.addEventListener("DOMContentLoaded", function () {
  // Periksa status login pada local storage

  // Tambahkan event listener untuk tombol logout
  const logoutButton = document.getElementById("logoutbutton");
  logoutButton.addEventListener("click", () => {
    // Logout dari Firebase
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Hapus status login dari local storage
        localStorage.removeItem("isLoggedIn");
        // Redirect ke halaman login
        location.href = "../index.html" || "./index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
});
