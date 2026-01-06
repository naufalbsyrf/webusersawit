// 1. Mengatur Firebase SDK dan Autentikasi
// Pastikan Anda telah menambahkan script Firebase ke file HTML Anda.
var firebaseConfig = {
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
    var adminRef = db.collection("counselor").doc(uid);
    var imageRef = firebase.firestore().collection("counselor").doc(uid);

    // Ambil elemen <img> dengan ID tertentu
    var imageElement = document.getElementById("profile");

    // Ambil data gambar dari Firestore
    imageRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          var imageUrl = data.img;
          // Ubah atribut src untuk menampilkan gambar
          if (imageUrl != null) {
            // Ubah atribut src untuk menampilkan gambar
            imageElement.src = imageUrl;
          }
        } else {
          imageElement.src = "iconprofile.png";
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
          var adminimg = adminData.img;

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

function updateAdminData(uid, newName, newGender, newImage) {
  var adminRef = db.collection("counselor").doc(uid);

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
      .child("profileAdmin/" + newImage.name)
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
          db.collection("counselor")
            .doc(uid)
            .update({
              img: downloadURL,
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

//--------------------------------------------------
var threadsCollection = db.collection("threads");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahthreads");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " threads";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//--------------------------------------------------
var threadsCollection = db.collection("chats");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahkonsultasi");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " chat";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//--------------------------------------------------
var threadsCollection = db.collection("reports");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahlaporan");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " Laporan";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//--------------------------------------------------
var threadsCollection = db.collection("articles");

// Gunakan metode .get() untuk mendapatkan seluruh dokumen di koleksi
threadsCollection
  .get()
  .then(function (querySnapshot) {
    var jumlahThreads = querySnapshot.size; // Mendapatkan jumlah dokumen dalam koleksi
    var jumlahThreadsElement = document.getElementById("jumlahartikel");
    jumlahThreadsElement.textContent = "Terdapat " + jumlahThreads + " artikel";
  })
  .catch(function (error) {
    console.error("Error getting documents: ", error);
  });
//-----------------poster-------------
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentSlide = 0;
let autoSlideInterval;

function showSlide(index) {
  if (index < 0) {
    currentSlide = slides.length - 1;
  } else if (index >= slides.length) {
    currentSlide = 0;
  }

  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

nextBtn.addEventListener("click", () => {
  clearInterval(autoSlideInterval); // Menghentikan otomatis berganti slide ketika tombol ditekan
  nextSlide();
  startAutoSlide(); // Memulai kembali otomatis berganti slide setelah tombol ditekan
});

prevBtn.addEventListener("click", () => {
  clearInterval(autoSlideInterval); // Menghentikan otomatis berganti slide ketika tombol ditekan
  prevSlide();
  startAutoSlide(); // Memulai kembali otomatis berganti slide setelah tombol ditekan
});

let touchStartX = null;

slider.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

slider.addEventListener("touchend", (e) => {
  if (touchStartX !== null) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchStartX - touchEndX;

    if (touchDiff > 50) {
      clearInterval(autoSlideInterval); // Menghentikan otomatis berganti slide ketika ada gesekan
      nextSlide();
      startAutoSlide(); // Memulai kembali otomatis berganti slide setelah gesekan selesai
    } else if (touchDiff < -50) {
      clearInterval(autoSlideInterval); // Menghentikan otomatis berganti slide ketika ada gesekan
      prevSlide();
      startAutoSlide(); // Memulai kembali otomatis berganti slide setelah gesekan selesai
    }

    touchStartX = null;
  }
});

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 6000); // Ganti slide setiap 6 detik
}

startAutoSlide(); // Memulai otomatis berganti slide saat halaman dimuat

//-----------------------------------MAPS-------------------------------------
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
      location.reload();
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
