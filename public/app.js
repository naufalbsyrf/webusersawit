const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const slider = document.querySelector(".slider-container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  //slider.style.display = "none"; // Sembunyikan tombol slider saat tombol Sign Up ditekan;
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  setTimeout(() => {
    //slider.style.display = "flex"; // Tampilkan kembali tombol slider
  }, 1000);
});
