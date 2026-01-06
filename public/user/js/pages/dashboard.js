// 1. Mengatur Firebase SDK dan Autentikasi
// Pastikan Anda telah menambahkan script Firebase ke file HTML Anda.
const firebaseConfig = {
  apiKey: "AIzaSyDOrQCkN2KmbPvaBqH8cq0FbzelJcRDLyM",
  authDomain: "sawit-website.firebaseapp.com",
  projectId: "sawit-website",
  storageBucket: "sawit-website.appspot.com",
  messagingSenderId: "83313894601",
  appId: "1:83313894601:web:e244f4377fbe7ee1895918",
};

// Menginisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage().ref();
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var uid = user.uid; // ID Pengguna
    var adminRef = db.collection("users").doc(uid);
    var imageRef = firebase.firestore().collection("users").doc(uid);

    // Ambil elemen <img> dengan ID tertentu
    var imageElement = document.getElementById("profile");

    // Ambil data gambar dari Firestore
    imageRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          var imageUrl = data.avatar;
          if (imageUrl != null) {
            // Ubah atribut src untuk menampilkan gambar
            imageElement.src = imageUrl;
          }
        } else {
          console.log("Dokumen tidak ditemukan!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    var genderRadioElements = document.getElementsByName("gender");
    var nameInputElement = document.getElementById("AdminnameInput");
    var imgElement = document.getElementById("imgprofile");
    var nameElement = document.getElementById("Adminname");

    adminRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          var adminData = doc.data();
          var adminName = adminData.name;
          var adminimg = adminData.avatar;

          nameInputElement.value = adminName;
          nameElement.textContent = adminName;
          imgElement.src = adminimg;

          if (adminData.gender) {
            genderRadioElements.forEach(function (radio) {
              if (radio.value === adminData.gender) {
                radio.checked = true;
              }
            });
          }

          adminRef.onSnapshot(function (doc) {
            var updatedData = doc.data();

            genderRadioElements.forEach(function (radio) {
              if (radio.value === updatedData.gender) {
                radio.checked = true;
              } else {
                radio.checked = false;
              }
            });
          });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    var saveButton = document.getElementById("buttonsave");
    saveButton.addEventListener("click", function () {
      var newName = nameInputElement.value;
      var imgprofile = imgElement.files[0]; // Menggunakan .files[0] untuk mendapatkan gambar dari input file
      var selectedGender;

      genderRadioElements.forEach(function (radio) {
        if (radio.checked) {
          selectedGender = radio.value;
        }
      });

      updateAdminData(uid, newName, selectedGender, imgprofile);
    });

    document
      .getElementById("updateAdminForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        postImagesToFirestore(uid);
      });
  } else {
    // User is signed out.
    console.log("No user is signed in.");
  }
});

// Cek status login saat halaman dimuat
isLoggedIn = "false";
console.log(isLoggedIn);
document.addEventListener("DOMContentLoaded", function () {
  // Periksa status login pada local storage
  isLoggedIn = localStorage.getItem("isLoggedIn");
  var profileDrop = document.getElementById("dropProfile");
  var logoutDrop = document.getElementById("dropLogout");
  var loginDrop = document.getElementById("dropLogin");
  console.log(isLoggedIn);
  if (isLoggedIn != "true") {
    // Jika pengguna belum login, redirect ke halaman login
    //location.href = "index.html";

    profileDrop.style.display = "none";
    logoutDrop.style.display = "none";
    loginDrop.style.display = "block";
  } else {
    profileDrop.style.display = "block";
    logoutDrop.style.display = "block";
    loginDrop.style.display = "none";
  }
});
//------------------update---------------------------------
function updateAdminData(uid, newName, newGender, newImage) {
  var adminRef = db.collection("users").doc(uid);

  adminRef
    .update({
      name: newName,
      gender: newGender,
    })
    .then(() => {
      console.log("Document successfully updated!");
      if (newImage) {
        postImagesToFirestore(uid, newImage);
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}

function postImagesToFirestore(uid, newImage) {
  if (newImage) {
    let uploadTask = storage
      .child("profileUser/" + newImage.name)
      .put(newImage);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        // proses upload
      },
      function (error) {
        console.error(error);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          db.collection("users")
            .doc(uid)
            .update({
              avatar: downloadURL,
            })
            .then(function () {
              console.log("Gambar berhasil diunggah!");
              location.reload();
            })
            .catch(function (error) {
              console.error("Error menulis dokumen: ", error);
            });
        });
      }
    );
  } else {
    console.log("Tidak ada gambar yang dipilih.");
  }
}

//------------slide poster----------------------
const sliderContainers = document.querySelectorAll(".slider-container");
const sliders = document.querySelectorAll(".slider");
const prevBtns = document.querySelectorAll(".buttonnext#prevBtn");
const nextBtns = document.querySelectorAll(".buttonnext#nextBtn");

let currentSlide = 0;
let autoSlideInterval;

function showSlide(index, slider) {
  if (index < 0) {
    currentSlide = slider.children.length - 1;
  } else if (index >= slider.children.length) {
    currentSlide = 0;
  }

  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide(slider) {
  currentSlide++;
  showSlide(currentSlide, slider);
}

function prevSlide(slider) {
  currentSlide--;
  showSlide(currentSlide, slider);
}

nextBtns.forEach((nextBtn, index) => {
  nextBtn.addEventListener("click", () => {
    const slider = sliders[index];
    clearInterval(autoSlideInterval);
    nextSlide(slider);
    startAutoSlide(slider);
  });
});

prevBtns.forEach((prevBtn, index) => {
  prevBtn.addEventListener("click", () => {
    const slider = sliders[index];
    clearInterval(autoSlideInterval);
    prevSlide(slider);
    startAutoSlide(slider);
  });
});

function startAutoSlide(slider) {
  autoSlideInterval = setInterval(() => {
    nextSlide(slider);
  }, 6000);
}

sliders.forEach((slider) => {
  startAutoSlide(slider);
});

//-------MAPS----------------------------------------------------------------------------
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0.7893, lng: 113.9213 },
    zoom: 5,
  });
}

// Fungsi untuk menambahkan koordinat ke Firestore
function addCoordinateToFirestore(latitude, longitude) {
  // Mengambil referensi koleksi di Firestore
  var db = firebase.firestore();
  var coordinatesRef = db.collection("coordinates");

  // Menambahkan data ke koleksi
  coordinatesRef
    .add({
      latitude: latitude,
      longitude: longitude,
    })
    .then(function (docRef) {
      console.log("Koordinat berhasil ditambahkan dengan ID: ", docRef.id);
      // Di sini Anda dapat menampilkan pesan sukses atau melakukan tindakan lain yang diperlukan.
    })
    .catch(function (error) {
      console.error("Error menambahkan koordinat: ", error);
      // Di sini Anda dapat menampilkan pesan kesalahan atau melakukan tindakan lain yang diperlukan.
    });
}

// Fungsi untuk menangani tombol "Tambah Koordinat"
function addCoordinate() {
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  // Memanggil fungsi untuk menambahkan koordinat ke Firestore
  addCoordinateToFirestore(latitude, longitude);
}

// Fungsi untuk mengambil data koordinat dari Firestore
function getCoordinatesFromFirestore() {
  var db = firebase.firestore();
  var coordinatesRef = db.collection("coordinates");

  // Mengambil semua dokumen dari koleksi
  coordinatesRef
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // Mengambil data latitude dan longitude dari dokumen Firestore
        var latitude = doc.data().latitude;
        var longitude = doc.data().longitude;

        // Menambahkan marker ke peta untuk setiap koordinat
        var marker = new google.maps.Marker({
          position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
          map: map,
          title: "Koordinat",
        });
      });
    })
    .catch(function (error) {
      console.error("Error mengambil koordinat dari Firestore: ", error);
    });
}

// Panggil fungsi untuk mengambil data koordinat dari Firestore
getCoordinatesFromFirestore();
//sidebar
document.addEventListener("DOMContentLoaded", function () {
  var mobileToggle = document.getElementById("mobile-toggle");
  var mainMenu = document.getElementById("main-menu");

  mobileToggle.addEventListener("click", function () {
    mainMenu.classList.toggle("show-menu");
  });
});
