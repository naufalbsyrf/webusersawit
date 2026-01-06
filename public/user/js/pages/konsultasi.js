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
var adminId = "";
var activeChat = "";
var userNewChatId = null;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var uid = user.uid; // ID Pengguna
    adminId = user.uid;
    var adminRef = db.collection("users").doc(uid);
    var imageRef = firebase.firestore().collection("users").doc(uid);

    // Ambil elemen <img> dengan ID tertentu
    var imageElement = document.getElementById("profile");
    var imageprofElement = document.getElementById("pkonselor");

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
            imageprofElement.src = imageUrl;
          }
          // Ubah atribut src untuk menampilkan gambar
        } else {
          console.log("Dokumen tidak ditemukan!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    var genderRadioElements = document.getElementsByName("gender");
    var nameInputElement = document.getElementById("AdminnameInput");
    var namekonselorElement = document.getElementById("AdminnameKonselor");
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
          namekonselorElement.textContent = adminName;
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

    const chatContainer = document.getElementById("chatContainer"); // Ambil elemen induk
    var TopMessage = true;
    let chatDic = [];
    db.collection("chats")
      .orderBy("updatedDate", "desc")
      .where("userId", "==", adminId)
      .get()
      .then((querySnapshot) => {
        // Gunakan Promise.all untuk menunggu semua promise selesai
        return Promise.all(
          querySnapshot.docs.map((chatDoc) => {
            let chatId = chatDoc.id;
            let senderId = chatDoc.data().counselorId;

            // Mengumpulkan semua dokumen dari subcollection 'chat'
            return chatDoc.ref
              .collection("chat")
              .orderBy("time", "asc")
              .get()
              .then((chatQuerySnapshot) => {
                // Menambahkan ID dokumen ke dictionary dengan key yang sesuai
                if (!chatDic[chatId]) {
                  chatDic[chatId] = {};
                }
                chatDic[chatId][senderId] = chatQuerySnapshot.docs.map(
                  (doc) => doc.id
                );
              });
          })
        );
      })
      .then(() => {
      })
      .then(() => {
        //--------------------------Chat Baru-----------------------------------------
        const urlParams = new URLSearchParams(window.location.search);
        userNewChatId = urlParams.get("id");
        if (userNewChatId != null) {
          let receiverExists = false;
          chatIdUserNew = "";

          // Periksa apakah userNewChatId ada sebagai senderId di dalam dictionary chatDic
          for (let chatId in chatDic) {
            if (chatDic[chatId][userNewChatId]) {
              receiverExists = true;
              chatIdUserNew = chatId;
              break;
            }
          }

          // Jika userNewChatId ditemukan sebagai senderId, jalankan kode ini
          db.collection("counselor")
            .doc(userNewChatId)
            .get()
            .then((userDocument) => {
              if (userDocument.exists) {
                const userData = userDocument.data();

                // Buat elemen HTML baru
                const threadElement = document.createElement("li");
                threadElement.id = userData.name;
                threadElement.className = "waves-effect waves-teal"; // Sesuaikan kelas sesuai kebutuhan
                threadElement.innerHTML = `
                <div class="content">
                <div class="left d-flex">
                  <div class="avatar">
                    <img id="profileuserlist" src="${
                      userData.img || "./images/profiledefault.png"
                    }" alt="" />
                    <div class="pulse-css-1"></div>
                  </div>
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start;">
                    <button onclick="startChatUser('${
                      receiverExists ? String(chatIdUserNew) : ""
                    }')" id="startchat" class="transparan" style="text-align: left; justify-content: flex-start;">${
                  userData.name || ""
                }</button>
                    <p style="margin: 0; text-align: left;">${""}</p>
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>`;

                // Tambahkan elemen thread baru ke dalam elemen induk
                chatContainer.appendChild(threadElement);

                var activeUsernameElement =
                  document.getElementById("useractive");
                var activeUserImgElement =
                  document.getElementById("useractiveimg");
                var currentIdUserElement =
                  document.getElementById("currentIdUser");

                currentIdUserElement.value = userData.id;
                activeUsernameElement.textContent = userData.name;
                activeUserImgElement.src = userData.img;
                activeChat = String(userData.userId);
                TopMessage = false;
                startChatUser(receiverExists ? String(chatIdUserNew) : "");
              } else {
                console.error("Dokumen tidak ditemukan.");
              }
            })
            .then(() => {
              // Ini hanya akan dieksekusi setelah semua operasi database selesai
              for (let chatId in chatDic) {
                // Loop melalui setiap senderId dalam dictionary untuk chatId saat ini
                for (let senderId in chatDic[chatId]) {
                  // Dapatkan array dari ID dokumen chat untuk senderId saat ini
                  let chatDocIds = chatDic[chatId][senderId];

                  // Lakukan sesuatu dengan senderId dan array dari ID dokumen chat
                  console.log(
                    `Chat ID: ${chatId}, Receiver ID: ${senderId}, Chat Doc IDs: ${chatDocIds}`
                  );
                  let lastChatDocId =
                    chatDic[chatId][senderId][
                      chatDic[chatId][senderId].length - 1
                    ];

                  // Mengambil dokumen chat terakhir berdasarkan chatId dan senderId
                  db.collection("chats")
                    .doc(chatId)
                    .collection("chat")
                    .doc(lastChatDocId)
                    .get()
                    .then((doc) => {
                      const chatData = doc.data();
                      db.collection("counselor")
                        .doc(senderId)
                        .get()
                        .then((userdocument) => {
                          if (userdocument.exists) {
                            const userData = userdocument.data();
                            // Buat elemen HTML baru untuk setiap thread
                            if (userNewChatId != userData.id) {
                              const threadElement =
                                document.createElement("li");
                              threadElement.id = userData.name;
                              threadElement.className =
                                "waves-effect waves-teal"; // Sesuaikan kelas sesuai kebutuhan
                              threadElement.innerHTML = `
                            <div class="content">
                            <div class="left d-flex">
                              <div class="avatar">
                                <img id="profileuserlist" src="${
                                  userData.img || "./images/profiledefault.png"
                                }" alt="" />
                                <div class="pulse-css-1"></div>
                              </div>
                              <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start;">
                                <button onclick="startChatUser('${String(
                                  chatId
                                )}')" id="startchat" class="transparan" style="text-align: left; justify-content: flex-start;">${
                                userData.name || ""
                              }</button>
                                <p style="margin: 0; text-align: left;">${
                                  chatData.content || ""
                                }</p>
                              </div>
                            </div>
                          </div>
                          <div class="clearfix"></div>`;

                              if (activeChat != senderId) {
                                chatContainer.appendChild(threadElement);
                              }

                              console.log(TopMessage);

                              if (TopMessage) {
                                var activeUsernameElement =
                                  document.getElementById("useractive");
                                var activeUserImgElement =
                                  document.getElementById("useractiveimg");
                                var currentIdUserElement =
                                  document.getElementById("currentIdUser");

                                currentIdUserElement.value = userData.id;
                                activeUsernameElement.textContent =
                                  userData.name;
                                activeUserImgElement.src = userData.img;
                                TopMessage = false;
                                console.log("masuk kedua");
                                startChatUser(String(chatId));
                              }
                            }
                          } else {
                            console.error("Dokumen tidak ditemukan.");
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "Terjadi kesalahan saat mengambil dokumen thread:",
                            error
                          );
                        });
                    })
                    .catch((error) => {
                      console.log(
                        "Error getting documents from threads collection:",
                        error
                      );
                    });
                }
              }
            })
            .catch((error) => {
              console.error(
                "Terjadi kesalahan saat mengambil dokumen thread:",
                error
              );
            });
        } else {
          for (let chatId in chatDic) {
            // Loop melalui setiap senderId dalam dictionary untuk chatId saat ini
            for (let senderId in chatDic[chatId]) {
              // Dapatkan array dari ID dokumen chat untuk senderId saat ini
              let chatDocIds = chatDic[chatId][senderId];

              
              let lastChatDocId =
                chatDic[chatId][senderId][chatDic[chatId][senderId].length - 1];

              // Mengambil dokumen chat terakhir berdasarkan chatId dan senderId
              db.collection("chats")
                .doc(chatId)
                .collection("chat")
                .doc(lastChatDocId)
                .get()
                .then((doc) => {
                  const chatData = doc.data();
                  db.collection("counselor")
                    .doc(senderId)
                    .get()
                    .then((userdocument) => {
                      if (userdocument.exists) {
                        const userData = userdocument.data();
                        // Buat elemen HTML baru untuk setiap thread
                        const threadElement = document.createElement("li");
                        threadElement.id = userData.name;
                        threadElement.className = "waves-effect waves-teal"; // Sesuaikan kelas sesuai kebutuhan
                        threadElement.innerHTML = `
                        <div class="content">
                          <div class="left d-flex">
                            <div class="avatar">
                              <img id="profileuserlist" src="${
                                userData.img || "./images/profiledefault.png"
                              }" alt="" />
                            </div>
                            <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start;">
                              <button onclick="startChatUser('${String(
                                chatId
                              )}')" id="startchat" class="transparan" style="text-align: left; justify-content: flex-start;">${
                          userData.name || ""
                        }</button>
                              <p class="textlistchat" style="margin: 0; text-align: left;">${
                                chatData.content || ""
                              }</p>
                            </div>
                          </div>
                        </div>
                        <div class="clearfix"></div>`;

                        chatContainer.appendChild(threadElement);

                        if (TopMessage) {
                          var activeUsernameElement =
                            document.getElementById("useractive");
                          var activeUserImgElement =
                            document.getElementById("useractiveimg");
                          var currentIdUserElement =
                            document.getElementById("currentIdUser");

                          currentIdUserElement.value = userData.id;
                          activeUsernameElement.textContent = userData.name;
                          activeUserImgElement.src = userData.img;
                          TopMessage = false;
                          startChatUser(String(chatId));
                        }
                      } else {
                        console.error("Dokumen tidak ditemukan.");
                      }
                    })
                    .catch((error) => {
                      console.error(
                        "Terjadi kesalahan saat mengambil dokumen thread:",
                        error
                      );
                    });
                })
                .catch((error) => {
                  console.log(
                    "Error getting documents from threads collection:",
                    error
                  );
                });
            }
          }
        }
        //------------------------------------------------------------------------------
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    //buat disini buat deteksi coba yaa
  } else {
    // User is signed out.
    console.log("No user is signed in.");
  }
});
//--------------------------search-------------------------------------// Ambil elemen input search
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", handleSearch);
function handleSearch() {
  const searchText = searchInput.value.toLowerCase();
  const threadElements = document.querySelectorAll(".message-list > li");

  threadElements.forEach((threadElement) => {
    const userName = threadElement
      .querySelector(".transparan")
      .textContent.toLowerCase();
    if (userName.includes(searchText)) {
      threadElement.style.display = "block";
    } else {
      threadElement.style.display = "none";
    }
  });
}

isLoggedIn = "false";
document.addEventListener("DOMContentLoaded", function () {
  // Periksa status login pada local storage
  isLoggedIn = localStorage.getItem("isLoggedIn");
  var profileDrop = document.getElementById("dropProfile");
  var logoutDrop = document.getElementById("dropLogout");
  var loginDrop = document.getElementById("dropLogin");
  var loginModal = document.getElementById("loginModal");
  var loginButton = document.getElementById("loginButton");

  if (isLoggedIn != "true") {
    // Jika pengguna belum login, tampilkan popup modal
    $("#loginModal").modal({
      backdrop: "static", // Untuk mencegah pengguna menutup modal dengan mengklik di luar modal
      keyboard: false, // Untuk mencegah pengguna menutup modal dengan tombol keyboard
    });

    profileDrop.style.display = "none";
    logoutDrop.style.display = "none";
    loginDrop.style.display = "block";
  } else {
    profileDrop.style.display = "block";
    logoutDrop.style.display = "block";
    loginDrop.style.display = "none";
  }

  // Tambahkan event listener untuk tombol login pada modal
  loginButton.addEventListener("click", function () {
    // Redirect ke halaman login saat tombol login di modal ditekan
    location.href = "../login.html";
  });
});

//---------------------------------------------------------------
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
      .child("profileUsers/" + newImage.name)
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

//--------------------------Chat list-----------------------------------------
//--------------------------Start Chat------------------------------------------
var chatRoomElement = document.getElementById("chatroom");
let chatListener = null; // Variabel untuk menyimpan referensi ke listener chat
let isSendingMessage = false;
let lastMessageTime = null;

function startChatUser(chatId) {
  if (chatId !== "") {

    if (chatListener) {
      chatListener(); // Hentikan listener sebelumnya sebelum menetapkan yang baru
    }

    // Langkah 1: Dapatkan senderId dari chat dengan ID tertentu
    db.collection("chats")
      .doc(chatId)
      .get()
      .then((chatDoc) => {
        if (!chatDoc.exists) {
          console.error("Chat document not found");
          return;
        }
        scrollToBottomChat();
        const chatData = chatDoc.data();
        const senderId = chatData.counselorId;

        // Sekarang kita memiliki senderId, kita dapat mengambil data pengguna
        console.log(senderId);
        return db.collection("counselor").doc(senderId).get();
      })
      .then((userDoc) => {
        if (!userDoc || !userDoc.exists) {
          console.error("User document not found");
          return;
        }

        const userData = userDoc.data();

        // Atur informasi pengguna di UI
        var activeUsernameElement = document.getElementById("useractive");
        var activeUserImgElement = document.getElementById("useractiveimg");
        var currentIdUserElement = document.getElementById("currentIdUser");

        currentIdUserElement.value = userData.id;
        activeUsernameElement.textContent = userData.name;
        activeUserImgElement.src =
          userData.img || "./images/profiledefault.png";
        chatRoomElement.innerHTML = "";

        chatAdmin = [];
        db.collection("counselor").doc(adminId).get();

        // Langkah 2: Dapatkan semua dokumen dari subkoleksi 'chat' untuk chatId yang diberikan
        return db
          .collection("chats")
          .doc(chatId)
          .collection("chat")
          .orderBy("time", "asc")
          .get();
      })
      .then((querySnapshot) => {
        if (!querySnapshot) {
          // Query snapshot akan null jika chat atau user document tidak ditemukan
          return;
        }

        // Loop melalui semua dokumen dan buat elemen HTML untuk setiap pesan
        querySnapshot.forEach((doc) => {
          const chatData = doc.data();
          const time = chatData.time.toDate();
          const formattedDate = time.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });

          console.log(chatData.userId);
          // Tentukan apakah pesan ini adalah pesan masuk atau keluar
          const messageDirection = chatData.sender === adminId ? "out" : "in";

          // Buat elemen HTML untuk pesan ini
          const chatElement = document.createElement("div");
          chatElement.className = `message-${messageDirection}`;
          chatElement.innerHTML = `
          <div class="message-body">
            <div class="message-text">
              <span id="adminchat">
                <p>
                  ${chatData.content}
                  <span class="date">${formattedDate}</span>
                </p>
              </span>
            </div>
          </div>
          <div class="message-meta">
            <p id="timeadmin" class="mt-10"></p>
          </div>
          <div class="clearfix"></div>`;
          chatRoomElement.appendChild(chatElement);
          lastMessageTime = chatData.time;
        });
        scrollToBottom();
        // Mulai mendengarkan pesan baru
        startListeningForNewMessages(chatId);
      })
      .catch((error) => {
        console.error("Error loading chat data: ", error);
      });
  }
}

function startListeningForNewMessages(chatId) {
  let chatRef = db.collection("chats").doc(chatId).collection("chat");
  if (!lastMessageTime) {
    lastMessageTime = firebase.firestore.Timestamp.now();
  }

  chatListener = chatRef
    .where("time", ">", lastMessageTime)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !isSendingMessage) {
          const chatData = change.doc.data();
          console.log("id yang baru :", change.doc.id);

          console.log("masuk kesini dulu");
          const time = chatData.time.toDate();
          const formattedDate = time.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
          console.log(adminId);
          const messageDirection = chatData.sender === adminId ? "out" : "in";
          const chatElement = document.createElement("div");
          chatElement.className = `message-${messageDirection}`;
          chatElement.innerHTML = `
          <div class="message-body">
            <div class="message-text">
              <span id="adminchat">
                <p>
                  ${chatData.content}
                  <span class="date">${formattedDate}</span>
                </p>
              </span>
            </div>
          </div>
          <div class="message-meta">
            <p id="timeadmin" class="mt-10"></p>
          </div>
          <div class="clearfix"></div>`;
          chatRoomElement.appendChild(chatElement);
          lastMessageTime = chatData.time;
          scrollToBottom();
        }
      });
    });
}

function scrollToBottom() {
  chatRoomElement.scrollTop = chatRoomElement.scrollHeight;
}

function scrollToBottomChat() {
  if (isMobileDevice()) {
    // Anda bisa memilih apakah akan menggulirkan <body> atau <html>, tergantung pada preferensi Anda
    const elementToScroll = document.documentElement; // Gunakan document.body jika ingin menggulirkan <body>

    // Set nilai scrollTop ke tinggi elemen scroll maksimum
    elementToScroll.scrollTop = elementToScroll.scrollHeight;
  }
}

function isMobileDevice() {
  return window.innerWidth <= 1000; // Sesuaikan dengan ambang batas yang sesuai untuk perangkat seluler Anda
}

// Jangan lupa untuk memanggil fungsi ini dengan chatId yang benar setiap kali Anda memulai chat baru
// startListeningForNewMessages(someChatId);

//--------------------------Send Chat------------------------------------------
var inputMessage = document.getElementById("user-message");
var currentIdUserElement = document.getElementById("currentIdUser");
var chatRoomElement = document.getElementById("chatroom");
document
  .getElementById("kirimchat")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var messageContent = inputMessage.value;
    isSendingMessage = true;
    if (messageContent != null && messageContent != "") {
      db.collection("chats")
        .where("userId", "==", adminId)
        .where("counselorId", "==", currentIdUserElement.value)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            console.log("satu");
            const docRef = querySnapshot.docs[0].ref;
            return docRef.update({ updatedDate: timestamp }).then(() => docRef);
          } else {
            console.log("dua");
            console.log(currentIdUserElement.value);
            return db
              .collection("chats")
              .add({
                counselorId: currentIdUserElement.value,
                userId: adminId,
                updatedDate: timestamp,
              })
              .then((docRef) => {
                return docRef.update({ id: docRef.id }).then(() => docRef);
              });
          }
        })
        .then((docRef) => {
          console.log(docRef);
          return docRef
            .collection("chat")
            .add({
              receiver: currentIdUserElement.value,
              sender: adminId,
              time: timestamp,
              content: messageContent,
            })
            .then((chatDocRef) => {
              return chatDocRef
                .update({ id: chatDocRef.id })
                .then(() => chatDocRef);
            });
        })
        .then(() => {
          // Menambahkan pesan yang baru dikirim ke UI
          const formattedDate = new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
          console.log("tiga");
          const chatElement = document.createElement("div");
          chatElement.className = `message-out`; // pesan keluar selalu memiliki kelas ini
          chatElement.innerHTML = `
          <div class="message-body">
          <div class="message-text">
            <span id="adminchat">
              <p>
                ${messageContent}
                <span class="date">${formattedDate}</span>
              </p>
            </span>
          </div>
        </div>
        <div class="message-meta">
          <p id="timeadmin" class="mt-10"></p>
        </div>
        <div class="clearfix"></div>`;
          chatRoomElement.appendChild(chatElement);
          scrollToBottom();
          isSendingMessage = false;
          inputMessage.value = null;
          console.log(userNewChatId);
          if (userNewChatId != null) {
            window.location.href = "konsultasi.html";
          }
        })
        .catch(function (error) {
          console.error("Error mengirim pesan: ", error);
          isSendingMessage = false;
        });
    }
  });

//----------scrol bar--------------
const messageBox = document.querySelector(".message-box");

// Fungsi untuk menggulirkan scrollbar ke paling bawah
function scrollToBottom() {
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Anda dapat memanggil scrollToBottom() setelah konten diperbarui, misalnya setelah menambahkan pesan baru
// Contoh:
// Tambahkan pesan baru ke dalam elemen .message-box
const newMessage = document.createElement("div");
newMessage.textContent = "";
messageBox.appendChild(newMessage);

// Setelah menambahkan pesan baru, gulirkan ke paling bawah
scrollToBottom();
////-----------------------hilang elemen--------------------
// Mengambil elemen-elemen yang dibutuhkan
const messageBodies = document.querySelectorAll(".message-body");
const formattedDates = document.querySelectorAll(".message-meta");

// Fungsi untuk mengubah tata letak pesan dan formattedDate
function updateLayout() {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth < 728;

  for (let i = 0; i < messageBodies.length; i++) {
    const messageBody = messageBodies[i];
    const formattedDate = formattedDates[i];

    if (isMobile) {
      messageBody.appendChild(formattedDate); // Selalu letakkan formattedDate di bawah message-text di perangkat seluler
    } else {
      messageBody.insertBefore(formattedDate, messageBody.firstChild); // Kembalikan formattedDate ke atas message-text pada tampilan desktop
    }
  }
}

// Panggil fungsi saat halaman dimuat dan saat ukuran layar berubah
updateLayout();
window.addEventListener("resize", updateLayout);
//sidebar
document.addEventListener("DOMContentLoaded", function () {
  var mobileToggle = document.getElementById("mobile-toggle");
  var mainMenu = document.getElementById("main-menu");

  mobileToggle.addEventListener("click", function () {
    mainMenu.classList.toggle("show-menu");
  });
});
