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
document.addEventListener("DOMContentLoaded", function () {
  // Periksa status login pada local storage
  isLoggedIn = localStorage.getItem("isLoggedIn");
  var profileDrop = document.getElementById("dropProfile");
  var logoutDrop = document.getElementById("dropLogout");
  var loginDrop = document.getElementById("dropLogin");
  var loginModal = document.getElementById("loginModal");
  var loginButton = document.getElementById("loginButton");
  var addThreadsButton = document.getElementById("addThreadsButton"); // Tombol "Add Threads"
  var addThreadsModal = document.getElementById("add_threads"); // Modal "Upload Threads"

  if (isLoggedIn != "true") {
    // Jika pengguna belum login, tampilkan popup modal

    profileDrop.style.display = "none";
    logoutDrop.style.display = "none";
    loginDrop.style.display = "block";
  } else {
    profileDrop.style.display = "block";
    logoutDrop.style.display = "block";
    loginDrop.style.display = "none";
  }

  addThreadsButton.addEventListener("click", function () {
    if (isLoggedIn != "true") {
      // Jika pengguna belum login, tampilkan modal login
      $("#loginModal").modal({
        backdrop: "static",
        keyboard: false,
      });
    } else {
      // Jika pengguna sudah login, tampilkan modal "Upload Threads"
      $("#add_threads").modal("show");
    }
  });

  // Tambahkan event listener untuk tombol login pada modal
  loginButton.addEventListener("click", function () {
    // Redirect ke halaman login saat tombol login di modal ditekan
    location.href = "../login.html";
  });
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
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  } else {
    return str;
  }
}

//-----------------------My Threads---------------------------
const mythreadContainer = document.getElementById("mythreadsContainer"); // Ambil elemen induk
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const userId = user.uid; // Dapatkan ID pengguna saat ini
    console.log(userId);
    db.collection("threads")
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          const threadData = doc.data();

          // Buat elemen HTML baru
          const kanbanList = document.createElement("div");
          kanbanList.className = "kanban-list kanban-list-to-do";
          kanbanList.innerHTML = `
          <div class="kanban-header-threads">
            <button
              type="button"
              class="droptdownthreads"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="bx bx-chevron-down"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <!-- Kontainer untuk tombol Delete dan Edit -->
              <a class="dropdown-item" data-target="#modal${
                threadData.threadsId
              }" data-toggle="modal" id="dropProfile">
                <i class="bx bx-edit font-size-16 align-middle me-1"></i>
                <button class="buttn">Edit</button>
              </a>
              <a class="dropdown-item text-danger" id="dropLogout">
                <div class="delete-container">
                  <i class="bx bx-trash font-size-16 align-middle me-1 text-danger"></i>
                  <button class="btn delete-thread" data-thread-id="${
                    doc.id
                  }">Delete</button>
                </div>
              </a>
            </div>
          </div>

          
          <div id="modal${
            threadData.threadsId
          }" class="modal custom-modal fade" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Update Your Threads</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <!-- foto disini-->
                <div class="modal-body">
                  <form onsubmit="event.preventDefault(); updateFirestoreThread('${
                    threadData.threadsId
                  }');">
                    <div class="mb-3">
                      <label for="imgartikel" class="form-label">Upload Files</label>
                      <p class="form-label">Kosongkan jika ingin menggunakan foto yang sebelumnya</p>
                      <input id="img${
                        threadData.threadsId
                      }" class="form-control" type="file" accept="image/png, image/jpeg, image/jpg" />
                    </div>
                    <div class="mb-3">
                      <label for="title" class="form-label">Judul</label>
                      <input id="title${
                        threadData.threadsId
                      }" class="form-control" value="${
            threadData.title
          }" type="text" />
                    </div>
                    <div class="mb-3">
                      <label for="deskripsi" class="form-label">Deskripsi</label>
                      <textarea id="deskripsi${
                        threadData.threadsId
                      }" class="form-control" rows="4">${
            threadData.kronologisingkat
          }</textarea>
                    </div>
                    <div class="text-center">
                      <button class="btn btn-primary">Update</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          <h5><span id="titlelaporan">${
            truncateString(threadData.title, 40) || ""
          }</span></h5>
          </div>
          <div class="kanban-wrap">
            <div>
              <div class="kanban-box item-box">
                <div class="img-artikel">
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
                    <div class="">
                      <p class="font-main mb-0">
                        <i class=""></i><span id="kronologisingkat">${truncateString(
                          threadData.kronologisingkat,
                          50
                        )}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
      
    `;

          // Tambahkan elemen baru ke dalam elemen induk
          mythreadContainer.appendChild(kanbanList);
        });
      })
      .catch((error) => {
        console.log("Error getting documents from threads collection:", error);
      });
  }
  // ...
  // Tambahkan event listener untuk menghapus thread saat tombol "Hapus" ditekan
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-thread")) {
      const threadId = event.target.getAttribute("data-thread-id");
      if (threadId) {
        // Tampilkan konfirmasi sebelum menghapus
        const confirmDelete = confirm(
          "Apakah Anda yakin ingin menghapus thread ini?"
        );
        if (confirmDelete) {
          // Hapus thread berdasarkan ID
          db.collection("threads")
            .doc(threadId)
            .delete()
            .then(function () {
              console.log("Thread berhasil dihapus.");
              // Hapus juga elemen tampilan dari DOM
              const threadElement = event.target.closest(".kanban-list");
              if (threadElement) {
                threadElement.remove();
              }
            })
            .catch(function (error) {
              console.error("Error menghapus thread:", error);
            });
        }
      }
    }
  });
});

//-----------------------Update threads-----------------------------------------
function updateFirestoreThread(threadsId) {
  console.log("1");
  // Mendapatkan nilai dari input dengan id = title+threadsId
  const titleInput = document.getElementById(`title${threadsId}`).value;

  // Mendapatkan nilai dari textarea dengan id = deskripsi+threadsId
  const kronologisingkatTextarea = document.getElementById(
    `deskripsi${threadsId}`
  ).value;

  // Mendapatkan nilai dari input file dengan id = img+threadsId
  const imgInput = document.getElementById(`img${threadsId}`);
  const selectedFile = imgInput.files[0]; // Mendapatkan file yang dipilih

  // Memeriksa apakah nilai title dan kronologi tidak kosong
  if (titleInput.trim() === "" || kronologisingkatTextarea.trim() === "") {
    alert("Title dan Kronologi harus diisi.");
    return;
  }

  console.log("1");
  // Mengambil data saat ini dari dokumen Firestore
  const threadRef = db.collection("threads").doc(threadsId);
  threadRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const currentData = doc.data(); // Mengambil data saat ini dari dokumen
        const loadingPanel = document.getElementById("loadingPanel");
        loadingPanel.style.display = "block";
        // Membuat objek untuk mengupdate dokumen di Firestore
        const updateData = {
          title: titleInput,
          kronologisingkat: kronologisingkatTextarea,
          date: {
            // Memasukkan child createdDate ke dalam field date jika sudah ada
            ...(currentData.date || {}),
            updatedDate: firebase.firestore.Timestamp.now(), // Memasukkan timestamp saat ini ke updatedDate
          },
        };

        // Upload file gambar ke Firebase Storage jika ada file yang dipilih
        if (selectedFile) {
          const storageRef = firebase
            .storage()
            .ref(`threads/${selectedFile.name}`);
          const uploadTask = storageRef.put(selectedFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Handle progress, misalnya menampilkan progress upload
            },
            (error) => {
              console.error("Error saat mengupload gambar:", error);
              loadingPanel.style.display = "none";
            },
            () => {
              // Upload berhasil, dapatkan token akses
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Hapus gambar lama jika ada
                const oldImgURL = currentData.img;
                if (oldImgURL) {
                  const oldImgRef = firebase.storage().refFromURL(oldImgURL);
                  oldImgRef
                    .delete()
                    .then(() => {
                      console.log("Gambar lama berhasil dihapus.");
                    })
                    .catch((error) => {
                      console.error("Error saat menghapus gambar lama:", error);
                    });
                }

                // Masukkan URL gambar baru ke dalam field img
                updateData.img = downloadURL;

                // Melakukan update ke Firestore
                threadRef
                  .update(updateData)
                  .then(() => {
                    console.log("Dokumen berhasil diupdate.");
                    // Memuat ulang halaman setelah pembaruan selesai
                    window.location.reload();
                  })
                  .catch((error) => {
                    console.error("Error saat mengupdate dokumen:", error);
                  })
                  .finally(() => {
                    // Menyembunyikan panel loading setelah proses selesai
                    loadingPanel.style.display = "none";
                  });
              });
            }
          );
        } else {
          // Jika tidak ada file yang dipilih, lakukan update tanpa mengganti gambar
          // Melakukan update ke Firestore
          threadRef
            .update(updateData)
            .then(() => {
              console.log("Dokumen berhasil diupdate.");
              // Memuat ulang halaman setelah pembaruan selesai
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error saat mengupdate dokumen:", error);
            })
            .finally(() => {
              // Menyembunyikan panel loading setelah proses selesai
              loadingPanel.style.display = "none";
            });
        }
      } else {
        console.error("Dokumen tidak ditemukan.");
      }
    })
    .catch((error) => {
      console.error("Error saat mengambil data dokumen:", error);
    });
}

//-----------------------post threads-----------------------------------------
document
  .getElementById("postForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    postToFirestore();
  });

function postToFirestore() {
  var title = document.getElementById("title").value;
  var content = document.getElementById("deskripsi").value;
  var imageFile = document.getElementById("imgartikel").files[0];

  if (imageFile) {
    let uploadTask = storage.child("threads/" + imageFile.name).put(imageFile);

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
          // Buat data thread yang akan disimpan di Firestore
          const user = firebase.auth().currentUser;
          if (user) {
            const userId = user.uid;

            // Generate a unique threadsId
            const threadsId = db.collection("threads").doc().id;

            // Buat data thread yang akan disimpan di Firestore
            var threadData = {
              threadsId: threadsId, // Add threadsId to the thread data
              title: title,
              kronologisingkat: content,
              img: downloadURL,
              userId: userId,
              date: {
                createdDate: firebase.firestore.FieldValue.serverTimestamp(),
                updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
              },
            };

            db.collection("threads")
              .doc(threadsId) // Set the document ID to the generated threadsId
              .set(threadData)
              .then(function () {
                console.log("Dokumen berhasil ditulis!");
                location.reload();
              })
              .catch(function (error) {
                console.error("Error menulis dokumen: ", error);
              });
          }
        });
      }
    );
  } else {
    console.log("else");
  }
}
//sidebar
document.addEventListener("DOMContentLoaded", function () {
  var mobileToggle = document.getElementById("mobile-toggle");
  var mainMenu = document.getElementById("main-menu");

  mobileToggle.addEventListener("click", function () {
    mainMenu.classList.toggle("show-menu");
  });
});
