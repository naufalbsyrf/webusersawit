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
var userId = "";
const commentContainer = document.getElementById("commentContainer"); // Ambil elemen induk

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var uid = user.uid; // ID Pengguna
    userId = uid;
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
//-------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const threadId = urlParams.get("id");
db.collection("articles")
  .doc(threadId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const threadData = doc.data();

      let title = document.getElementById("titleArtikel");
      let content = document.getElementById("description");
      let imgElement = document.getElementById("imgArtikel"); // Menyesuaikan ID elemen gambar Anda
      title.textContent = threadData.title;
      content.textContent = threadData.content;

      // Menetapkan URL gambar ke atribut src elemen gambar
      imgElement.src = threadData.img || "default-image-url.jpg"; // Ganti "default-image-url.jpg" dengan URL gambar default jika img kosong
    } else {
      console.error("Dokumen tidak ditemukan.");
    }
  })
  .catch((error) => {
    console.error("Terjadi kesalahan saat mengambil dokumen thread:", error);
  });

// Mendapatkan semua komentar dari subkoleksi 'comments'
db.collection("articles")
  .doc(threadId)
  .collection("comments")
  .orderBy("timestamp", "asc")
  .get()
  .then((querySnapshot) => {
    const promises = [];
    querySnapshot.forEach((commentDoc) => {
      const idCommenter = commentDoc.data().userId;
      console.log(commentDoc.id + "    " + idCommenter);

      const commentData = commentDoc.data(); // Ambil data komentar di sini

      // Periksa apakah userId ada dalam koleksi 'users'
      const userPromise = db
        .collection("users")
        .doc(idCommenter)
        .get()
        .then((userDoc) => {
          if (userDoc.exists) {
            return { userData: userDoc.data(), commentData }; // Sertakan data komentar
          }
          // Jika tidak ditemukan dalam 'users', lanjutkan ke koleksi 'counselor'
          return db
            .collection("counselor")
            .doc(idCommenter)
            .get()
            .then((counselorDoc) => {
              if (counselorDoc.exists) {
                return { userData: counselorDoc.data(), commentData }; // Sertakan data komentar
              }
              console.log("Pengguna tidak ditemukan dalam kedua koleksi.");
              return null;
            });
        })
        .catch((error) => {
          console.error("Error saat mencari pengguna:", error);
        });

      promises.push(userPromise);
    });

    Promise.all(promises)
      .then((results) => {
        results.forEach((result) => {
          if (result) {
            const { userData, commentData } = result;
            const timestamp = commentData.timestamp.toDate();
            const formattedDate = timestamp.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            });

            const kanbanList = document.createElement("div");
            kanbanList.className = "comment";
            kanbanList.innerHTML = `
              <img
              src=${userData.avatar || userData.img}
              alt="User Profile"
              class="profile-picture-comment"
              />
              <div class="comment-content user-comment">
                <div class="comment-header">
                  <p class="comment-author">${userData.name}</p>
                </div>
                <p class="comment-text">
                ${commentData.content}
                </p>
                <div class="message-meta">
                  <p id="timeadmin" class="mt-10">
                  ${formattedDate}
                  </p>
                </div>
              </div>
            `;
            commentContainer.appendChild(kanbanList);
          }
        });
      })
      .catch((error) => {
        console.error("Error saat mengambil data pengguna:", error);
      });
  })
  .catch((error) => {
    console.error("Error saat mengambil komentar:", error);
  });

//------------------hapus-----------------------
let hapusButton = document.getElementById("hapusartikel");

// Menambahkan event listener ke tombol hapus
hapusButton.addEventListener("click", () => {
  // Konfirmasi pengguna sebelum menghapus artikel
  const confirmation = confirm(
    "Apakah Anda yakin ingin menghapus artikel ini?"
  );
  if (confirmation) {
    // Hapus artikel dari database
    db.collection("articles")
      .doc(threadId)
      .delete()
      .then(() => {
        // Artikel berhasil dihapus, arahkan pengguna ke halaman lain atau lakukan tindakan lain yang sesuai
        console.log("Artikel berhasil dihapus.");
        // Misalnya, mengarahkan kembali ke halaman utama
        window.location.href = "artikel.html";
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat menghapus artikel:", error);
      });
  }
});

function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  } else {
    return str;
  }
}
const laporanContainer = document.getElementById("beritaTerbaruContainer"); // Ambil elemen induk
db.collection("articles")
  .orderBy("date.updatedDate", "desc")
  .limit(6)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const laporanData = doc.data();
      const timestamp = laporanData.date.updatedDate.toDate();

      // Format the date
      const formattedDate = timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      // Convert Firestore Timestamp to JavaScript Date

      // Buat elemen kanban list
      const kanbanList = document.createElement("div");
      kanbanList.className = "col-12";
      kanbanList.innerHTML = `
      <div class="kanban-box item-box">
        <div class="img-news">
          <a href="detailArtikel.html?id=${doc.id}">
            <img src="${laporanData.img || ""}" id="imgLaporan" />
          </a>
        </div>
        <div class="kanban-header">
          <h5 class="card-title">
            <span id="titlelaporan" class="newstitle"
              >${truncateString(laporanData.title, 50) || ""}
            </span>
          </h5>
        </div>
      </div>
    `;
      // Tambahkan elemen baru ke dalam elemen induk
      laporanContainer.appendChild(kanbanList);
    });
  })
  .catch((error) => {
    console.log("Error getting documents from laporan collection:", error);
  });

function addCommentToFirestore() {
  // Dapatkan teks komentar dari elemen dengan ID 'commentInput'
  const commentInput = document.getElementById("commentInput");
  const commentText = commentInput.value;

  // Pastikan teks komentar tidak kosong
  if (!commentText) {
    alert("Komentar tidak boleh kosong!");
    return;
  }

  // Membuat objek komentar
  const commentData = {
    content: commentText,
    userId: userId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  // Mengirim komentar ke Firestore
  db.collection("articles")
    .doc(threadId)
    .collection("comments")
    .add(commentData)
    .then((docRef) => {
      console.log("Komentar berhasil ditambahkan pada ID:", threadId);

      db.collection("counselor")
        .doc(userId)
        .get()
        .then((counselorDoc) => {
          if (counselorDoc.exists) {
            const counselorData = counselorDoc.data();
            commentInput.value = "";
            // Format the date
            const formattedDate = new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            });

            // Buat elemen kanban list
            const kanbanList = document.createElement("div");
            kanbanList.className = "comment";
            kanbanList.innerHTML = `
          <img
          src=${counselorData.img}
          alt="User Profile"
          class="profile-picture-comment"
          />
          <div class="comment-content user-comment">
            <div class="comment-header">
              <p class="comment-author">${counselorData.name}</p>
            </div>
            <p class="comment-text">
            ${commentData.content}
            </p>
            <div class="message-meta">
              <p id="timeadmin" class="mt-10">
              ${formattedDate}
              </p>
            </div>
          </div>
          `;
            // Tambahkan elemen baru ke dalam elemen induk
            commentContainer.appendChild(kanbanList);
          }
        });
    })
    .catch((error) => {
      console.error("Error menambahkan komentar ke Firestore:", error);
    });
}

// Panggil fungsi addCommentToFirestore saat tombol dengan ID 'buttonComment' ditekan
document.getElementById("buttonComment").addEventListener("click", () => {
  addCommentToFirestore("threadId", "userId");
});
