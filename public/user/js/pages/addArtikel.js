// 1. Mengatur Firebase SDK dan Autentikasi
// Pastikan Anda telah menambahkan script Firebase ke file HTML Anda.
function _0x1528(_0x4a9756, _0x4fa616) {
  var _0x5dd659 = _0x5dd6();
  return (
    (_0x1528 = function (_0x15283e, _0x54bc43) {
      _0x15283e = _0x15283e - 0x1c7;
      var _0x339167 = _0x5dd659[_0x15283e];
      return _0x339167;
    }),
    _0x1528(_0x4a9756, _0x4fa616)
  );
}
function _0x5dd6() {
  var _0x8071da = [
    "1081722pxoJfh",
    "5Zffvox",
    "10rcSTFP",
    "sawit-website.appspot.com",
    "411064iPMDes",
    "1:83313894601:web:e244f4377fbe7ee1895918",
    "19155Kkqvxu",
    "6594434OITIfo",
    "53909BZEWDq",
    "2727405STULZB",
    "AIzaSyDOrQCkN2KmbPvaBqH8cq0FbzelJcRDLyM",
    "1699005ZdWkyj",
    "80zxDxLD",
    "sawit-website.firebaseapp.com",
    "sawit-website",
    "83313894601",
    "8beLshE",
  ];
  _0x5dd6 = function () {
    return _0x8071da;
  };
  return _0x5dd6();
}
var _0x29c680 = _0x1528;
(function (_0x3c5088, _0x26157e) {
  var _0x59a287 = _0x1528,
    _0x131e55 = _0x3c5088();
  while (!![]) {
    try {
      var _0x5cf80b =
        (parseInt(_0x59a287(0x1cf)) / 0x1) *
          (parseInt(_0x59a287(0x1d7)) / 0x2) +
        (-parseInt(_0x59a287(0x1cd)) / 0x3) *
          (parseInt(_0x59a287(0x1d3)) / 0x4) +
        (parseInt(_0x59a287(0x1c8)) / 0x5) *
          (parseInt(_0x59a287(0x1c7)) / 0x6) +
        parseInt(_0x59a287(0x1d2)) / 0x7 +
        -parseInt(_0x59a287(0x1cb)) / 0x8 +
        parseInt(_0x59a287(0x1d0)) / 0x9 +
        (-parseInt(_0x59a287(0x1c9)) / 0xa) *
          (parseInt(_0x59a287(0x1ce)) / 0xb);
      if (_0x5cf80b === _0x26157e) break;
      else _0x131e55["push"](_0x131e55["shift"]());
    } catch (_0xfde1bf) {
      _0x131e55["push"](_0x131e55["shift"]());
    }
  }
})(_0x5dd6, 0x27d22);
var firebaseConfig = {
  apiKey: _0x29c680(0x1d1),
  authDomain: _0x29c680(0x1d4),
  projectId: _0x29c680(0x1d5),
  storageBucket: _0x29c680(0x1ca),
  messagingSenderId: _0x29c680(0x1d6),
  appId: _0x29c680(0x1cc),
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


const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

if(category == null)
{
  //-------------berita terpopuler--------------------------
const laporanContainer = document.getElementById("laporanContainer"); // Ambil elemen induk
const querys = db.collection("articles");
querys
  .get()
  .then((articleQuerySnapshot) => {
    const articles = [];

    // Loop melalui setiap artikel dan menghitung jumlah komentar
    articleQuerySnapshot.forEach((articleDoc) => {
      const articleData = articleDoc.data();
      // Ambil komentar untuk artikel saat ini
      db.collection("articles")
        .doc(articleDoc.id)
        .collection("comments")
        .get()
        .then((commentQuerySnapshot) => {
          const commentCount = commentQuerySnapshot.size;
          // Tambahkan artikel bersama jumlah komentar ke array
          articles.push({ article: articleData, commentCount });

          // Jika sudah mendapatkan jumlah komentar untuk semua artikel
          if (articles.length === articleQuerySnapshot.size) {
            // Urutkan artikel berdasarkan jumlah komentar
            articles.sort((a, b) => b.commentCount - a.commentCount);

            // Ambil 6 artikel dengan komentar paling banyak
            const topArticles = articles.slice(1, 7);

            // Tampilkan artikel paling banyak komentarnya
            topArticles.forEach((article) => {
              const laporanData = article.article;

              // Format the date
              const timestamp = laporanData.date.updatedDate.toDate();
              const formattedDate = timestamp.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // Buat elemen kanban list
              const kanbanList = document.createElement("div");
              kanbanList.className = "col-12";
              kanbanList.innerHTML = `
      <div class="kanban-box item-box">
        <div class="img-news">
          <a href="./user/detailArtikel.html?id=${laporanData.id}">
            <img src="${laporanData.img || ""}" id="imgLaporan" />
          </a>
        </div>
        <div class="kanban-header">
          <h5>
            <a href="./user/detailArtikel.html?id=${laporanData.id}">
              <span class="newstitle">
                ${truncateString(laporanData.title, 50) || ""}
              </span>
            </a>
          </h5>
      
        </div>
      </div>
    `;
              // Tambahkan elemen baru ke dalam elemen induk
              laporanContainer.appendChild(kanbanList);
            });
          }
        })
        .catch((error) => {
          console.log("Error getting comments for article:", error);
        });
    });
  })
  .catch((error) => {
    console.log("Error getting articles:", error);
  });

//------------------------artikel terbaru-------------------------------
const laporanContainer1 = document.getElementById("beritaTerbaruContainer1");

db.collection("articles")
  .orderBy("date.updatedDate", "desc")
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

      // Buat elemen kanban list
      const kanbanList = document.createElement("div");
      kanbanList.className = "col-12";
      kanbanList.innerHTML = `
              <div class="kanban-boxartikel item-box">
              <div class="">
              <a href="./user/detailArtikel.html?id=${laporanData.id}">
              <img src="${
                laporanData.img || ""
              }" id="imgLaporanpopuler" data-articleid="${laporanData.id}" />
            </a>
              </div>
              <div class="">
                <h5>
                  <a href="./user/detailArtikel.html?id=${laporanData.id}" id="titlelaporanpopuler">
                    ${truncateString(laporanData.title, 70) || ""}
                  </a>
                </h5>
                <span id="titlelaporanpopulerkonten">${
                  truncateString(laporanData.content, 40) || ""
                }</span>
                <span id="titlelaporanpopulerkonten1">${
                  formattedDate || ""
                }</span>
              </div>
            </div>
            </div>
              `;
      // Tambahkan elemen baru ke dalam elemen induk
      laporanContainer1.appendChild(kanbanList);
    });
  })
  .catch((error) => {
    console.log("Error getting documents from laporan collection:", error);
  });

  //------------------------artikel Headline-------------------------------
const artikelheadline = document.getElementById("beritaHeadline"); // Ambil elemen induk

// Query untuk mengambil artikel dengan komentar paling banyak
const query = db.collection("articles");

query
  .get()
  .then((articleQuerySnapshot) => {
    const articles = [];

    // Loop melalui setiap artikel dan menghitung jumlah komentar
    articleQuerySnapshot.forEach((articleDoc) => {
      const articleData = articleDoc.data();
      // Ambil komentar untuk artikel saat ini
      db.collection("articles")
        .doc(articleDoc.id)
        .collection("comments")
        .get()
        .then((commentQuerySnapshot) => {
          const commentCount = commentQuerySnapshot.size;
          // Tambahkan artikel bersama jumlah komentar ke array
          articles.push({ article: articleData, commentCount });

          // Jika sudah mendapatkan jumlah komentar untuk semua artikel
          if (articles.length === articleQuerySnapshot.size) {
            // Urutkan artikel berdasarkan jumlah komentar
            articles.sort((a, b) => b.commentCount - a.commentCount);

            // Ambil 6 artikel dengan komentar paling banyak
            const topArticles = articles.slice(0, 1);

            // Tampilkan artikel paling banyak komentarnya
            topArticles.forEach((article) => {
              const laporanData = article.article;

              // Format the date
              const timestamp = laporanData.date.updatedDate.toDate();
              const formattedDate = timestamp.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // Buat elemen kanban list
              const kanbanList = document.createElement("div");
              kanbanList.className = "col-12";
              kanbanList.innerHTML = `
              <div class="kanban-box">
              <div class="kanban-header">
                <a href="./user/detailArtikel.html?id=${laporanData.id}">
                  <span id="titlelaporanpopuler1">
                    ${truncateString(laporanData.title, 100) || ""}
                  </span>
                </a>  
            
              </div>
              <a href="./user/detailArtikel.html?id=${laporanData.id}">
              <img src="${
                laporanData.img || ""
              }" id="imgLaporanpopuler1" data-articleid="${laporanData.id}"/>
            </a>
            <p class="text-detail-threads">
                <span style="font-weight: bold;">${formattedDate}</span> 
                </p>
              </div>
              <div class="me-auto">
                <p class="text-detail-threads">
                  <span id="description">${
                    truncateString(laporanData.content, 200) || ""
                  } </span>
                </p>
              </div>
            
              `;
              // Tambahkan elemen baru ke dalam elemen induk
              artikelheadline.appendChild(kanbanList);
            });

            // Tambahkan event listener ke setiap gambar
          }
        })
        .catch((error) => {
          console.log("Error getting comments for article:", error);
        });
    });
  })
  .catch((error) => {
    console.log("Error getting articles:", error);
  });
}
else
{
  //-------------berita terpopuler--------------------------
const laporanContainer = document.getElementById("laporanContainer"); // Ambil elemen induk
const querys = db.collection("articles");
querys
  .where("category", "array-contains", category)
  .get()
  .then((articleQuerySnapshot) => {
    const articles = [];

    // Loop melalui setiap artikel dan menghitung jumlah komentar
    articleQuerySnapshot.forEach((articleDoc) => {
      const articleData = articleDoc.data();
      // Ambil komentar untuk artikel saat ini
      db.collection("articles")
        .doc(articleDoc.id)
        .collection("comments")
        .get()
        .then((commentQuerySnapshot) => {
          const commentCount = commentQuerySnapshot.size;
          // Tambahkan artikel bersama jumlah komentar ke array
          articles.push({ article: articleData, commentCount });

          // Jika sudah mendapatkan jumlah komentar untuk semua artikel
          if (articles.length === articleQuerySnapshot.size) {
            // Urutkan artikel berdasarkan jumlah komentar
            articles.sort((a, b) => b.commentCount - a.commentCount);

            // Ambil 6 artikel dengan komentar paling banyak
            const topArticles = articles.slice(1, 7);

            // Tampilkan artikel paling banyak komentarnya
            topArticles.forEach((article) => {
              const laporanData = article.article;

              // Format the date
              const timestamp = laporanData.date.updatedDate.toDate();
              const formattedDate = timestamp.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // Buat elemen kanban list
              const kanbanList = document.createElement("div");
              kanbanList.className = "col-12";
              kanbanList.innerHTML = `
      <div class="kanban-box item-box">
        <div class="img-news">
          <a href="./user/detailArtikel.html?id=${laporanData.id}">
            <img src="${laporanData.img || ""}" id="imgLaporan" />
          </a>
        </div>
        <div class="kanban-header">
          <h5>
            <a href="./user/detailArtikel.html?id=${laporanData.id}">
              <span class="newstitle">
                ${truncateString(laporanData.title, 50) || ""}
              </span>
            </a>
          </h5>
        </div>
      </div>
    `;
              // Tambahkan elemen baru ke dalam elemen induk
              laporanContainer.appendChild(kanbanList);
            });
          }
        })
        .catch((error) => {
          console.log("Error getting comments for article:", error);
        });
    });
  })
  .catch((error) => {
    console.log("Error getting articles:", error);
  });

//------------------------artikel terbaru-------------------------------
const laporanContainer1 = document.getElementById("beritaTerbaruContainer1");

db.collection("articles")
  .orderBy("date.updatedDate", "desc")
  .where("category", "array-contains", category)
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

      // Buat elemen kanban list
      const kanbanList = document.createElement("div");
      kanbanList.className = "col-12";
      kanbanList.innerHTML = `
              <div class="kanban-boxartikel item-box">
              <div class="">
              <a href="./user/detailArtikel.html?id=${laporanData.id}">
              <img src="${
                laporanData.img || ""
              }" id="imgLaporanpopuler" data-articleid="${laporanData.id}" />
            </a>
              </div>
              <div class="">
              <h5>
              <a href="./user/detailArtikel.html?id=${laporanData.id}" id="titlelaporanpopuler">
                ${truncateString(laporanData.title, 70) || ""}
              </a>
            </h5>
                <span id="titlelaporanpopulerkonten">${
                  truncateString(laporanData.content, 40) || ""
                }</span>
                <span id="titlelaporanpopulerkonten1">${
                  formattedDate || ""
                }</span>
              </div>
            </div>
            </div>
              `;
      // Tambahkan elemen baru ke dalam elemen induk
      laporanContainer1.appendChild(kanbanList);
    });
  })
  .catch((error) => {
    console.log("Error getting documents from laporan collection:", error);
  });

  //------------------------artikel Headline-------------------------------
const artikelheadline = document.getElementById("beritaHeadline"); // Ambil elemen induk

// Query untuk mengambil artikel dengan komentar paling banyak
const query = db.collection("articles");

query
  .where("category", "array-contains", category)
  .get()
  .then((articleQuerySnapshot) => {
    const articles = [];

    // Loop melalui setiap artikel dan menghitung jumlah komentar
    articleQuerySnapshot.forEach((articleDoc) => {
      const articleData = articleDoc.data();
      // Ambil komentar untuk artikel saat ini
      db.collection("articles")
        .doc(articleDoc.id)
        .collection("comments")
        .get()
        .then((commentQuerySnapshot) => {
          const commentCount = commentQuerySnapshot.size;
          // Tambahkan artikel bersama jumlah komentar ke array
          articles.push({ article: articleData, commentCount });

          // Jika sudah mendapatkan jumlah komentar untuk semua artikel
          if (articles.length === articleQuerySnapshot.size) {
            // Urutkan artikel berdasarkan jumlah komentar
            articles.sort((a, b) => b.commentCount - a.commentCount);

            // Ambil 6 artikel dengan komentar paling banyak
            const topArticles = articles.slice(0, 1);

            // Tampilkan artikel paling banyak komentarnya
            topArticles.forEach((article) => {
              const laporanData = article.article;

              // Format the date
              const timestamp = laporanData.date.updatedDate.toDate();
              const formattedDate = timestamp.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // Buat elemen kanban list
              const kanbanList = document.createElement("div");
              kanbanList.className = "col-12";
              kanbanList.innerHTML = `
              <div class="kanban-box">
              <div class="kanban-header">
                <a href="./user/detailArtikel.html?id=${laporanData.id}">
                  <span id="titlelaporanpopuler1">
                    ${truncateString(laporanData.title, 100) || ""}
                  </span>
                </a> 
              </div>
              <a href="./user/detailArtikel.html?id=${laporanData.id}">
              <img src="${
                laporanData.img || ""
              }" id="imgLaporanpopuler1" data-articleid="${laporanData.id}"/>
            </a>
            <p class="text-detail-threads">
                <span style="font-weight: bold;">${formattedDate}</span> 
                </p>
              </div>
              <div class="me-auto">
                <p class="text-detail-threads">
                  <span id="description">${
                    truncateString(laporanData.content, 200) || ""
                  } </span>
                </p>
              </div>
            
              `;
              // Tambahkan elemen baru ke dalam elemen induk
              artikelheadline.appendChild(kanbanList);
            });

            // Tambahkan event listener ke setiap gambar
          }
        })
        .catch((error) => {
          console.log("Error getting comments for article:", error);
        });
    });
  })
  .catch((error) => {
    console.log("Error getting articles:", error);
  });
}

function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}

//SIDABAR--------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var mobileToggle = document.getElementById("mobile-toggle");
  var mainMenu = document.getElementById("main-menu");

  mobileToggle.addEventListener("click", function () {
    mainMenu.classList.toggle("show-menu");
  });
});

//------------------------video terbaru-------------------------------
const videoContainer = document.getElementById("videoContainer");

db.collection("video")
  .orderBy("date.updatedDate", "desc")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const laporanData = doc.data();

      // Buat elemen kanban list
      const kanbanList = document.createElement("div");
      kanbanList.className = "video-item";
      kanbanList.innerHTML = `
            <div class="kanban-box item-box">
              <div class="img-news">
                  <iframe class="videosource" src="${laporanData.embed}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              </div>
              <div class="kanban-header">
                <h5>
                  <span class="videotitle">${truncateString(laporanData.title, 60) || ""}</span>
                </h5>
              </div>
            </div>
              `;
      // Tambahkan elemen baru ke dalam elemen induk
      videoContainer.appendChild(kanbanList);
    });
  })
  .catch((error) => {
    console.log("Error getting documents from laporan collection:", error);
  });
