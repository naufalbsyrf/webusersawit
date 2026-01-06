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
const threadContainer = document.getElementById("threadsContainer"); // Ambil elemen induk

db.collection("threads")
  .orderBy("date", "desc") // Ganti "timestampField" dengan nama field timestamp dalam dokumen Anda
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      const threadData = doc.data();

      // Buat elemen HTML baru
      const kanbanList = document.createElement("div");
      kanbanList.className = "kanban-list kanban-list-to-do";
      kanbanList.innerHTML = `
      <div class="kanban-header">
        <h5 class="card-title"><span id="titlelaporan">${
          threadData.title || ""
        }</span></h5>
      </div>
      <div class="kanban-wrap">
        <div class="panel">
          <div>
            <div class="img-bx">
              <a href="detailthreads.html?id=${doc.id}">
                <img src="${threadData.img || ""}" alt="" id="imgLaporan" />
              </a>
            </div>
            <div class="content-box">
              <h6 class="title fs-16"></h6>
              <div>
                <div class="link">
                </div>
              </div>
              <div>
                <div class="link">
                </div>
                <div class="time">
                  <p class="font-main mb-0">
                    <i class="far fa-clock"></i><span>${
                      threadData.kronologisingkat || ""
                    }</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

      // Tambahkan elemen baru ke dalam elemen induk
      threadContainer.appendChild(kanbanList);
    });
  })
  .catch((error) => {
    console.log("Error getting documents from threads collection:", error);
  });

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
