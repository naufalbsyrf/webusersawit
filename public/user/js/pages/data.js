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

var yearDropdown = document.getElementById("yearDropdown");
yearDropdown.addEventListener("change", function () {
  var selectedYear = yearDropdown.value;
  console.log(selectedYear);
  // Panggil createChart dengan tahun yang dipilih
  db.collection("DataPanen")
    .where("tahun", "==", selectedYear)
    .get()
    .then(function (querySnapshot) {
      var data = [];
      querySnapshot.forEach(function (doc) {
        // Mengambil data dokumen dari Firestore
        data.push(doc.data());
      });
    })
    .catch(function (error) {
      console.error("Error mengambil data dari Firestore: ", error);
    });
});

function createChart(data, chartType, chartId, chartTitle) {
  // Hapus grafik yang ada jika sudah ada
  if (window.myCharts && window.myCharts[chartId]) {
    window.myCharts[chartId].destroy();
  }

  // Data yang Anda peroleh dari database Firestore
  var labels = data.map((item) => item.bulan);
  var chartData = null;

  if (chartType === "line") {
    // Grafik Line Chart
    chartData = {
      labels: labels,
      datasets: [
        {
          label: chartTitle,
          data: data.map((item) => item[chartTitle]),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  } else if (chartType === "bar") {
    // Grafik Bar Chart
    chartData = {
      labels: labels,
      datasets: [
        {
          label: chartTitle,
          data: data.map((item) => item[chartTitle]),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }

  // Inisialisasi grafik
  var ctx = document.getElementById(chartId).getContext("2d");
  var newChart = new Chart(ctx, {
    type: chartType,
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Simpan grafik ke objek myCharts
  if (!window.myCharts) {
    window.myCharts = {};
  }
  window.myCharts[chartId] = newChart;
}

document.addEventListener("DOMContentLoaded", function () {
  // Mengambil data dari Firestore untuk tahun 2023 (default)
  getDataAndCreateChart(2023);

  var yearDropdown = document.getElementById("yearDropdown");

  yearDropdown.addEventListener("change", function () {
    var selectedYear = parseInt(yearDropdown.value);
    getDataAndCreateChart(selectedYear);
  });
});

function getDataAndCreateChart(year) {
  db.collection("DataPanen")
    .where("tahun", "==", year)
    .get()
    .then(function (querySnapshot) {
      var data = [];
      querySnapshot.forEach(function (doc) {
        // Mengambil data dokumen dari Firestore
        data.push(doc.data());
      });

      // Urutkan data berdasarkan bulan
      data.sort(function (a, b) {
        return months.indexOf(a.bulan) - months.indexOf(b.bulan);
      });

      // Setelah Anda mendapatkan data dari Firestore, Anda dapat memanggil fungsi createChart
      createChart(data, "line", "revenueChart", "pendapatan");
      createChart(data, "line", "produksiChart", "produksi");
      createChart(data, "line", "luasChart", "luasLahan");
      createChart(data, "bar", "importChart", "impor");
      createChart(data, "bar", "exportChart", "ekspor");
      createChart(data, "line", "konsumsiChart", "konsumsiDomestik");
    })
    .catch(function (error) {
      console.error("Error mengambil data dari Firestore: ", error);
    });
}

// Daftar bulan dalam urutan yang benar
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function updateChart(data) {
  // Data yang Anda peroleh dari database Firestore
  var labels = data.map((item) => item.bulan);
  var revenueData = data.map((item) => item.pendapatan);

  // Mengambil referensi ke grafik yang sudah ada
  var ctx = document.getElementById("revenueChart").getContext("2d");

  // Perbarui data grafik yang sudah ada
  if (typeof myChart !== "undefined") {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = revenueData;
    myChart.update();
  } else {
    // Jika grafik belum ada, inisialisasi grafik baru
    var chartData = {
      labels: labels,
      datasets: [
        {
          label: "Pendapatan",
          data: revenueData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    var chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    myChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: chartOptions,
    });
  }
}
// Event listener untuk tombol "Proses"
// document.getElementById("processButton").addEventListener("click", function () {
//   // Mendapatkan file yang diunggah oleh pengguna
//   var fileInput = document.getElementById("fileInput");
//   var file = fileInput.files[0];

//   if (file) {
//     // Jika file Excel dipilih, baca data dari file dan buat grafik
//     readExcelFile(file);
//   } else {
//     alert("Pilih file Excel terlebih dahulu.");
//   }
// });

// ...

// Fungsi untuk membaca data dari file Excel
// function readExcelFile(file) {
//   var reader = new FileReader();

//   reader.onload = function (e) {
//     var data = e.target.result;
//     var workbook = XLSX.read(data, { type: "binary" });
//     var sheetName = workbook.SheetNames[0];
//     var sheet = workbook.Sheets[sheetName];
//     var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 });

//     // Ambil data dari kolom A hingga I (bulan, tahun, pendapatan, impor, ekspor, konsumsi domestik, luas lahan, produksi)
//     var dataToStore = jsonData.map((row) => {
//       return {
//         bulan: row[0], // Kolom A
//         tahun: row[1], // Kolom B
//         pendapatan: row[2], // Kolom C
//         impor: row[3], // Kolom D
//         ekspor: row[4], // Kolom E
//         konsumsiDomestik: row[5], // Kolom F
//         luasLahan: row[6], // Kolom G
//         produksi: row[7], // Kolom H
//       };
//     });

//     // Kirim data ke Firestore
//     sendDataToFirestore(dataToStore);
//   };

//   reader.readAsBinaryString(file);
// }

// Fungsi untuk mengirim data ke Firestore
function sendDataToFirestore(data) {
  data.forEach((item) => {
    // Membuat referensi ke koleksi "DataPanen" dengan filter bulan dan tahun
    var collectionRef = db
      .collection("DataPanen")
      .where("bulan", "==", item.bulan)
      .where("tahun", "==", item.tahun);

    // Mengeksekusi query
    collectionRef
      .get()
      .then(function (querySnapshot) {
        // Jika ada dokumen yang cocok dalam Firestore
        if (!querySnapshot.empty) {
          // Mengambil dokumen pertama (asumsi hanya satu dokumen yang cocok)
          var doc = querySnapshot.docs[0];

          // Update nilai pendapatan, impor, ekspor, konsumsiDomestik, luasLahan, dan produksi pada dokumen yang ada
          doc.ref
            .update({
              pendapatan: item.pendapatan,
              impor: item.impor,
              ekspor: item.ekspor,
              konsumsiDomestik: item.konsumsiDomestik,
              luasLahan: item.luasLahan,
              produksi: item.produksi,
            })
            .then(function () {
              console.log("Data berhasil diupdate di Firestore");
            })
            .catch(function (error) {
              console.error("Error mengupdate data di Firestore: ", error);
            });
        } else {
          // Tidak ada dokumen yang cocok, tambahkan dokumen baru
          db.collection("DataPanen")
            .add(item)
            .then(function (docRef) {
              console.log(
                "Data berhasil ditambahkan ke Firestore dengan ID: ",
                docRef.id
              );
            })
            .catch(function (error) {
              console.error("Error menambahkan data ke Firestore: ", error);
            });
        }
      })
      .catch(function (error) {
        console.error("Error mengambil data dari Firestore: ", error);
      });
  });
}

document
  .getElementById("downloadExcelButton")
  .addEventListener("click", function () {
    // Ambil data dari Firestore (misalnya, data tahun 2023)
    console.log("masuk ga");
    db.collection("DataPanen")
      .where("tahun", "==", parseInt(yearDropdown.value))
      .get()
      .then(function (querySnapshot) {
        var dataToDownload = [];

        // Tambahkan header (nama kolom)
        dataToDownload.push([
          "Bulan",
          "Tahun",
          "Pendapatan",
          "Impor",
          "Ekspor",
          "Konsumsi Domestik",
          "Luas Lahan",
          "Produksi",
        ]);

        // Simpan data dalam objek dengan bulan sebagai kunci
        var dataByMonth = {};

        querySnapshot.forEach(function (doc) {
          var data = doc.data();
          dataByMonth[data.bulan] = data;
        });

        // Urutkan bulan dalam urutan yang benar
        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        months.forEach(function (month) {
          if (dataByMonth[month]) {
            var row = [
              dataByMonth[month].bulan,
              dataByMonth[month].tahun,
              dataByMonth[month].pendapatan,
              dataByMonth[month].impor,
              dataByMonth[month].ekspor,
              dataByMonth[month].konsumsiDomestik,
              dataByMonth[month].luasLahan,
              dataByMonth[month].produksi,
            ];

            // Tambahkan setiap baris data ke array dataToDownload
            dataToDownload.push(row);
          }
        });

        // Buat worksheet dari data
        var ws = XLSX.utils.aoa_to_sheet(dataToDownload);

        // Buat workbook dan tambahkan worksheet ke dalamnya
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DataPanen");

        // Simpan workbook sebagai file Excel
        XLSX.writeFile(wb, "DataPanen.xlsx");
      })
      .catch(function (error) {
        console.error("Error mengambil data dari Firestore: ", error);
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
