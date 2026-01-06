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
var adminId = "";
var activeChat = "";
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var uid = user.uid; // ID Pengguna
    adminId = user.uid;
    var adminRef = db.collection("counselor").doc(uid);
    var imageRef = firebase.firestore().collection("counselor").doc(uid);

    // Ambil elemen <img> dengan ID tertentu
    var imageElement = document.getElementById("profile");
    var imageprofElement = document.getElementById("pkonselor");

    // Ambil data gambar dari Firestore
    imageRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          var imageUrl = data.img;

          // Ubah atribut src untuk menampilkan gambar
          if (imageUrl != null) {
            imageElement.src = imageUrl;
            imageprofElement.src = imageUrl;
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
    var namekonselorElement = document.getElementById("AdminnameKonselor");
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
      .where("sender", "==", adminId)
      .get()
      .then((querySnapshot) => {
        // Gunakan Promise.all untuk menunggu semua promise selesai
        return Promise.all(
          querySnapshot.docs.map((chatDoc) => {
            let chatId = chatDoc.id;
            let receiverId = chatDoc.data().receiver;

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
                chatDic[chatId][receiverId] = chatQuerySnapshot.docs.map(
                  (doc) => doc.id
                );
              });
          })
        );
      })
      .then(() => {
        console.log(chatDic);
      })
      .then(() => {
        //--------------------------Chat Baru-----------------------------------------
        const urlParams = new URLSearchParams(window.location.search);
        const userNewChatId = urlParams.get("id");
        if (userNewChatId != null) {
          let receiverExists = false;
          chatIdUserNew = "";

          // Periksa apakah userNewChatId ada sebagai receiverId di dalam dictionary chatDic
          for (let chatId in chatDic) {
            if (chatDic[chatId][userNewChatId]) {
              receiverExists = true;
              chatIdUserNew = chatId;
              break;
            }
          }

          // Jika userNewChatId ditemukan sebagai receiverId, jalankan kode ini
          db.collection("users")
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
                      userData.avatar || ""
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

                currentIdUserElement.value = userData.userId;
                activeUsernameElement.textContent = userData.name;
                activeUserImgElement.src = userData.avatar;
                activeChat = String(userData.userId);
                TopMessage = false;
                startChatUser(receiverExists ? String(chatIdUserNew) : "");
              } else {
                console.error("Dokumen tidak ditemukan.");
              }
            })
            .then(() => {
              // Ini hanya akan dieksekusi setelah semua operasi database selesai
              console.log(chatDic);
              for (let chatId in chatDic) {
                // Loop melalui setiap receiverId dalam dictionary untuk chatId saat ini
                for (let receiverId in chatDic[chatId]) {
                  // Dapatkan array dari ID dokumen chat untuk receiverId saat ini
                  let chatDocIds = chatDic[chatId][receiverId];

                  // Lakukan sesuatu dengan receiverId dan array dari ID dokumen chat
                  console.log(
                    `Chat ID: ${chatId}, Receiver ID: ${receiverId}, Chat Doc IDs: ${chatDocIds}`
                  );
                  let lastChatDocId =
                    chatDic[chatId][receiverId][
                      chatDic[chatId][receiverId].length - 1
                    ];

                  // Mengambil dokumen chat terakhir berdasarkan chatId dan receiverId
                  db.collection("chats")
                    .doc(chatId)
                    .collection("chat")
                    .doc(lastChatDocId)
                    .get()
                    .then((doc) => {
                      const chatData = doc.data();
                      db.collection("users")
                        .doc(receiverId)
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
                                  userData.avatar || ""
                                }" alt="" />
                                <div class="pulse-css-1"></div>
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

                            if (activeChat != receiverId) {
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

                              currentIdUserElement.value = userData.userId;
                              activeUsernameElement.textContent = userData.name;
                              activeUserImgElement.src = userData.avatar;
                              TopMessage = false;
                              console.log("masuk kedua");
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
            })
            .catch((error) => {
              console.error(
                "Terjadi kesalahan saat mengambil dokumen thread:",
                error
              );
            });
        } else {
          for (let chatId in chatDic) {
            // Loop melalui setiap receiverId dalam dictionary untuk chatId saat ini
            for (let receiverId in chatDic[chatId]) {
              // Dapatkan array dari ID dokumen chat untuk receiverId saat ini
              let chatDocIds = chatDic[chatId][receiverId];

              // Lakukan sesuatu dengan receiverId dan array dari ID dokumen chat
              console.log(
                `Chat ID: ${chatId}, Receiver ID: ${receiverId}, Chat Doc IDs: ${chatDocIds}`
              );
              let lastChatDocId =
                chatDic[chatId][receiverId][
                  chatDic[chatId][receiverId].length - 1
                ];

              // Mengambil dokumen chat terakhir berdasarkan chatId dan receiverId
              db.collection("chats")
                .doc(chatId)
                .collection("chat")
                .doc(lastChatDocId)
                .get()
                .then((doc) => {
                  const chatData = doc.data();
                  db.collection("users")
                    .doc(receiverId)
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
                                userData.avatar || ""
                              }" alt="" />
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

                        chatContainer.appendChild(threadElement);
                        console.log(TopMessage);

                        if (TopMessage) {
                          var activeUsernameElement =
                            document.getElementById("useractive");
                          var activeUserImgElement =
                            document.getElementById("useractiveimg");
                          var currentIdUserElement =
                            document.getElementById("currentIdUser");

                          currentIdUserElement.value = userData.userId;
                          activeUsernameElement.textContent = userData.name;
                          activeUserImgElement.src = userData.avatar;
                          TopMessage = false;
                          console.log("masuk ketiga");
                          console.log("chat id:", chatId);
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
//---------------------------------------------------------------
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

function arrayToString(arr) {
  console.log("[" + arr.map((item) => `"${item}"`).join(", ") + "]");
  return "[" + arr.map((item) => `"${item}"`).join(", ") + "]";
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

//--------------------------Chat list-----------------------------------------
//--------------------------Start Chat------------------------------------------
var chatRoomElement = document.getElementById("chatroom");
let chatListener = null; // Variabel untuk menyimpan referensi ke listener chat
let isSendingMessage = false;
let lastMessageTime = null;

function startChatUser(chatId) {
  if (chatId !== "") {
    console.log(chatId);

    if (chatListener) {
      chatListener(); // Hentikan listener sebelumnya sebelum menetapkan yang baru
    }

    // Langkah 1: Dapatkan receiverId dari chat dengan ID tertentu
    db.collection("chats")
      .doc(chatId)
      .get()
      .then((chatDoc) => {
        if (!chatDoc.exists) {
          console.error("Chat document not found");
          return;
        }

        const chatData = chatDoc.data();
        const receiverId = chatData.receiver;

        // Sekarang kita memiliki receiverId, kita dapat mengambil data pengguna
        return db.collection("users").doc(receiverId).get();
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

        currentIdUserElement.value = userData.userId;
        activeUsernameElement.textContent = userData.name;
        activeUserImgElement.src = userData.avatar;
        chatRoomElement.innerHTML = "";

        chatAdmin = [];
        db.collection("admin").doc(adminId).get();

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

          // Tentukan apakah pesan ini adalah pesan masuk atau keluar
          const messageDirection = chatData.sender === adminId ? "out" : "in";

          // Buat elemen HTML untuk pesan ini
          const chatElement = document.createElement("div");
          chatElement.className = `message-${messageDirection}`;
          chatElement.innerHTML = `
          <div class="message-body">
            <div class="message-text">
              <span id="adminchat"><p>${chatData.content}</p></span>  
            </div>
          </div>
          <div class="message-meta">
            <p id="timeadmin" class="mt-10">${formattedDate}</p>
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
          const messageDirection = chatData.sender === adminId ? "out" : "in";
          const chatElement = document.createElement("div");
          chatElement.className = `message-${messageDirection}`;
          chatElement.innerHTML = `
          <div class="message-body">
            <div class="message-text">
              <span id="adminchat"><p>${chatData.content}</p></span>  
            </div>
          </div>
          <div class="message-meta">
            <span><p id="timeadmin" class="mt-10">${formattedDate}</p></span>
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

    db.collection("chats")
      .where("sender", "==", adminId)
      .where("receiver", "==", currentIdUserElement.value)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          console.log("satu");
          const docRef = querySnapshot.docs[0].ref;
          return docRef.update({ updatedDate: timestamp }).then(() => docRef);
        } else {
          console.log("dua");
          return db
            .collection("chats")
            .add({
              sender: adminId,
              receiver: currentIdUserElement.value,
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
            <span id="adminchat"><p>${messageContent}</p></span>  
          </div>
        </div>
        <div class="message-meta">
          <p id="timeadmin" class="mt-10">${formattedDate}</p>
        </div>
        <div class="clearfix"></div>`;
        chatRoomElement.appendChild(chatElement);
        scrollToBottom();
        isSendingMessage = false;
        inputMessage.value = null;
      })
      .catch(function (error) {
        console.error("Error mengirim pesan: ", error);
        isSendingMessage = false;
      });
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
//------------------------
function textlistchat(text, maxLength = 4) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
}

// Contoh penggunaan
var text = "Contoh teks yang lebih dari 4 karakter";
var hasil = truncateText(text);
console.log(hasil);
