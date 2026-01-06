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
  db.collection("threads")
    .doc(threadId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const threadData = doc.data();
  
        let title = document.getElementById("titleArtikel");
        let content = document.getElementById("description");
        let penulisOpini = document.getElementById("penulisOpini");
        let imgElement = document.getElementById("imgArtikel"); // Menyesuaikan ID elemen gambar Anda

        title.textContent = threadData.title;
        content.textContent = threadData.kronologisingkat;
        penulisOpini.textContent = "Penulis: "+threadData.title;
  
        // Menetapkan URL gambar ke atribut src elemen gambar
        imgElement.src = threadData.img || "default-image-url.jpg"; // Ganti "default-image-url.jpg" dengan URL gambar default jika img kosong
      } else {
        console.error("Dokumen tidak ditemukan.");
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan saat mengambil dokumen thread:", error);
    });
  
  //-----------------start program comments-------------------------------
  const viewAllCommentsButton = document.getElementById("viewAllComments");
  const showLessCommentsButton = document.getElementById("showLessComments");
  
  let commentsData = [];
  
  // Mendapatkan semua komentar dari subkoleksi 'comments'
  db.collection("threads")
    .doc(threadId)
    .collection("comments")
    .orderBy("time", "asc")
    .get()
    .then((querySnapshot) => {
      const promises = [];
      querySnapshot.forEach((commentDoc) => {
        const idCommenter = commentDoc.data().userId;
  
        const commentData = commentDoc.data(); // Ambil data komentar di sini
  
        const userPromise = db
          .collection("users")
          .doc(idCommenter)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              return { userData: userDoc.data(), commentData }; // Sertakan data komentar
            }
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
              commentsData.push(result);
            }
          });
  
          // Tampilkan hanya 3 komentar pertama
          displayComments(commentsData.slice(0, 2));
  
          // Tampilkan tombol "Lihat Semua Komentar" jika ada lebih dari 3 komentar
          if (commentsData.length > 2) {
            viewAllCommentsButton.style.display = "block";
          }
          if (commentsData.length < 2) {
            viewAllCommentsButton.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Error saat mengambil data pengguna:", error);
        });
    })
    .catch((error) => {
      console.error("Error saat mengambil komentar:", error);
    });
  
  // Fungsi untuk menampilkan komentar
  function displayComments(commentsToDisplay) {
    commentContainer.innerHTML = ""; // Kosongkan kontainer komentar
    commentsToDisplay.forEach((result) => {
      if (result) {
        const { userData, commentData } = result;
        const timestamp = commentData.time.toDate();
        const formattedDate = timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        var imageUrl = userData.avatar || userData.img;
  
        // Ubah atribut src untuk menampilkan gambar
        if (imageUrl == null) {
          // Ubah atribut src untuk menampilkan gambar
          imageUrl = "./images/profiledefault.png";
        }
        const kanbanList = document.createElement("div");
        kanbanList.className = "comment";
        kanbanList.innerHTML = `
        <img
          src=${imageUrl}
          alt="User Profile"
          class="profile-picture-comment"
        />
        <div class="comment-content">
          <p class="comment-author" style="margin-bottom: 0;">${userData.name}</p>
          <div class="message-comment">
            <p style="margin-bottom: 0;">
              ${formattedDate}
            </p>
          </div>
          <p class="comment-text" style="margin-top: 0; margin-bottom: 0;">
            ${commentData.content}
          </p>
        </div>
          `;
        commentContainer.appendChild(kanbanList);
      }
    });
  }
  
  // Fungsi untuk menampilkan komentar lebih sedikit
  function showLessComments() {
    displayComments(commentsData.slice(0, 2)); // Menampilkan hanya 3 komentar pertama
    viewAllCommentsButton.style.display = "block"; // Tampilkan tombol "Lihat Semua Komentar" kembali
    showLessCommentsButton.style.display = "none"; // Sembunyikan tombol "Tampilkan Komentar Lebih Sedikit"
  }
  showLessCommentsButton.style.display = "none";
  // Event listener untuk tombol "Lihat Semua Komentar"
  viewAllCommentsButton.addEventListener("click", function () {
    displayComments(commentsData); // Menampilkan semua komentar
    viewAllCommentsButton.style.display = "none"; // Sembunyikan tombol setelah semua komentar ditampilkan
    showLessCommentsButton.style.display = "block"; // Tampilkan tombol "Tampilkan Komentar Lebih Sedikit"
  });
  
  // Event listener untuk tombol "Tampilkan Komentar Lebih Sedikit"
  showLessCommentsButton.addEventListener("click", showLessComments);
  
  //------------------------End program comments------------------------------------
  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }
  const laporanContainer = document.getElementById("beritaTerbaruContainer"); // Ambil elemen induk
  db.collection("threads")
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
            <a href="detailOpini.html?id=${doc.id}">
              <img src="${laporanData.img || ""}" id="imgLaporan" />
            </a>
          </div>
          <div class="kanban-header">
            <h5>
              <a href="detailOpini.html?id=${doc.id}">
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
    })
    .catch((error) => {
      console.log("Error getting documents from laporan collection:", error);
    });
  
  //------------------------artikel populer-------------------------------
  const laporanContainer1 = document.getElementById("beritaTerbaruContainer1"); // Ambil elemen induk
  
  // Query untuk mengambil artikel dengan komentar paling banyak
  const query = db.collection("threads");
  
  query
    .get()
    .then((articleQuerySnapshot) => {
      const Event = [];
  
      // Loop melalui setiap artikel dan menghitung jumlah komentar
      articleQuerySnapshot.forEach((articleDoc) => {
        const articleData = articleDoc.data();
        // Ambil komentar untuk artikel saat ini
        db.collection("threads")
          .doc(articleDoc.id)
          .collection("comments")
          .get()
          .then((commentQuerySnapshot) => {
            const commentCount = commentQuerySnapshot.size;
            // Tambahkan artikel bersama jumlah komentar ke array
            Event.push({ article: articleData, commentCount });
  
            // Jika sudah mendapatkan jumlah komentar untuk semua artikel
            if (Event.length === articleQuerySnapshot.size) {
              // Urutkan artikel berdasarkan jumlah komentar
              Event.sort((a, b) => b.commentCount - a.commentCount);
  
              // Ambil 6 artikel dengan komentar paling banyak
              const topEvent = Event.slice(0, 6);
  
              // Tampilkan artikel paling banyak komentarnya
              topEvent.forEach((article) => {
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
                <a href="detailOpini.html?id=${laporanData.threadsId}">
                <img src="${laporanData.img || ""}" data-articleid="${
                  laporanData.id
                }" />
              </a>
                </div>
                <div class="kanban-header">
                  <h5>
                    <a href="detailOpini.html?id=${laporanData.threadsId}">
                      <span class="newstitle">
                        ${truncateString(laporanData.title, 50) || ""}
                      </span>
                    </a>
                  </h5>
                </div>
              </div>
                `;
                // Tambahkan elemen baru ke dalam elemen induk
                laporanContainer1.appendChild(kanbanList);
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
      console.log("Error getting Event:", error);
    });
  
  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  }
  //-----------ADD COMMENTS----------------------------
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
      time: firebase.firestore.FieldValue.serverTimestamp(),
    };
    // Mengirim komentar ke Firestore
    db.collection("threads")
      .doc(threadId)
      .collection("comments")
      .add(commentData)
      .then((docRef) => {
        console.log("Komentar berhasil ditambahkan pada ID:", threadId);
  
        db.collection("users")
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
              var imageUrl = counselorData.avatar;
  
              // Ubah atribut src untuk menampilkan gambar
              if (imageUrl == null) {
                // Ubah atribut src untuk menampilkan gambar
                imageUrl = "./images/profiledefault.png";
              }
              // Buat elemen kanban list
              const kanbanList = document.createElement("div");
              kanbanList.className = "comment";
              kanbanList.innerHTML = `
            <img
            src=${imageUrl}
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
  var loginModal = document.getElementById("loginModal");
  // Panggil fungsi addCommentToFirestore saat tombol dengan ID 'buttonComment' ditekan
  document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("buttonComment")
      .addEventListener("click", function () {
        console.log("masuk" + isLoggedIn);
        if (isLoggedIn != "true") {
          console.log(loginModal);
          // Jika pengguna belum login, tampilkan modal login
          $("#loginModal").modal({
            backdrop: "static",
            keyboard: false,
          });
        } else {
          console.log("duad");
          addCommentToFirestore();
        }
      });
  });
  //sidebar
  document.addEventListener("DOMContentLoaded", function () {
    var mobileToggle = document.getElementById("mobile-toggle");
    var mainMenu = document.getElementById("main-menu");
  
    mobileToggle.addEventListener("click", function () {
      mainMenu.classList.toggle("show-menu");
    });
  });

  