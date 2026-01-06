document.addEventListener("DOMContentLoaded", function () {
  const downloadButton = document.getElementById("downloadButton");
  const kembali = document.getElementById("buttonback");
  downloadButton.addEventListener("click", function () {
    const pdfContent = document.getElementById("pdf-content");
    downloadButton.style.display = "none";
    kembali.style.display = "none";

    const brElements = pdfContent.querySelectorAll("br");
    brElements.forEach(function (brElement) {
      brElement.style.display = "none";
    });
    // Buat salinan elemen yang ingin dicetak
    const clone = pdfContent.cloneNode(true);

    // Mengatur tata letak elemen "title" dan "img" menjadi center
    const titleElement = clone.querySelector("#title");
    titleElement.style.textAlign = "center";
    titleElement.style.fontSize = "24px";

    const imgElement = clone.querySelector("#img");
    imgElement.style.display = "block";
    imgElement.style.margin = "0 auto";

    // Mengatur tata letak elemen "address", "phoneNumber", dan "description" menjadi justify
    const addressElement = clone.querySelector("#address");
    addressElement.style.fontSize = "16px";

    const phoneNumberElement = clone.querySelector("#phoneNumber");
    phoneNumberElement.style.fontSize = "16px";

    const descriptionElement = clone.querySelector("#description");
    descriptionElement.style.fontSize = "16px";

    // Buat dokumen HTML sementara
    const tempDocument = document.createElement("div");
    tempDocument.style.textAlign = "center"; // Center-align the entire content
    tempDocument.appendChild(clone);
    // Mengatur ukuran gambar menjadi 500x500 piksel
    imgElement.style.width = "500px";

    // Ubah ukuran dan gaya sesuai kebutuhan jika perlu
    clone.style.width = "100%";
    clone.style.margin = "0";
    clone.style.padding = "0";

    // Buat elemen iframe sementara untuk mencetak
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Isi iframe dengan dokumen HTML sementara
    iframe.contentDocument.open();
    iframe.contentDocument.write(tempDocument.outerHTML); // Menggunakan outerHTML untuk mempertahankan style text-align
    iframe.contentDocument.close();
    // Mulai pencetakan setelah dokumen dimuat
    iframe.contentWindow.onload = function () {
      // Panggil fungsi print
      iframe.contentWindow.print();

      // Hapus elemen iframe setelah selesai mencetak
      document.body.removeChild(iframe);
      location.reload();
      downloadButton.style.display = "block"; // Kembalikan tombol download
      kembali.style.display = "block"; // Kembalikan tombol kembali
    };
  });
});
