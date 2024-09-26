// Mengatur webcam (kamera tetap diaktifkan meskipun tersembunyi)
Webcam.set({
  width: 320,
  height: 240,
  image_format: "jpeg",
  jpeg_quality: 90,
});
Webcam.attach("#my_camera");

// Fungsi untuk menangkap gambar otomatis saat submit ditekan
function take_snapshot(callback) {
  Webcam.snap(function (data_uri) {
    // Simpan data gambar ke hidden input
    document.getElementById("image").value = data_uri;
    callback(); // Melanjutkan pengiriman data setelah gambar diambil
  });
}

// Submit form dengan data gambar
document.getElementById("guestbookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Tangkap gambar dari webcam
  take_snapshot(function () {
    // Mengambil nilai dari input form setelah gambar diambil
    const nama = document.getElementById("nama").value;
    const instansi = document.getElementById("instansi").value;
    const alamat = document.getElementById("alamat").value;
    const keperluan = document.getElementById("keperluan").value;
    const keterangan = document.getElementById("keterangan").value;
    const image = document.getElementById("image").value; // Mengambil gambar dari webcam

    // Mengirim data ke server menggunakan AJAX
    const data = {
      nama: nama,
      instansi: instansi,
      alamat: alamat,
      keperluan: keperluan,
      keterangan: keterangan,
      image: image, // Kirim gambar ke server
    };

    fetch("beckend.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Jika data berhasil disimpan, tambahkan data ke tabel frontend tanpa gambar
          const table = document.getElementById("guestbookBody");
          const row = table.insertRow();
          row.insertCell(0).innerText = data.id; // Nomor otomatis
          row.insertCell(1).innerText = data.waktu; // Waktu otomatis
          row.insertCell(2).innerText = nama;
          row.insertCell(3).innerText = instansi;
          row.insertCell(4).innerText = alamat;
          row.insertCell(5).innerText = keperluan;
          row.insertCell(6).innerText = keterangan;

          // Reset form setelah submit
          document.getElementById("guestbookForm").reset();
        } else {
          alert("Terjadi kesalahan saat menyimpan data: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
