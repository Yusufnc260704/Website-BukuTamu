<?php
// Koneksi ke database
$host = "localhost";
$user = "root";
$pass = "";
$db = "nama_database";
$conn = new mysqli($host, $user, $pass, $db);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Ambil data dari form
$nama = $_POST['nama'];
$instansi = $_POST['instansi'];
$alamat = $_POST['alamat'];
$jenis_kelamin = $_POST['jenis_kelamin'];
$no_telp = $_POST['no_telp'];
$keterangan = $_POST['keterangan'];
$foto = $_POST['image']; // Data dari webcam dalam format Base64

// Hitung nomor urut harian untuk hari ini
$query_hitung = "SELECT COUNT(*) + 1 AS nomor_harian FROM buku_tamu WHERE DATE(waktu) = CURDATE()";
$result = $conn->query($query_hitung);
$row = $result->fetch_assoc();
$nomor_harian = $row['nomor_harian'];

// Insert data ke tabel buku_tamu
$query_insert = $conn->prepare("INSERT INTO buku_tamu (nomor_harian, waktu, nama, instansi, alamat, jenis_kelamin, no_telp, keterangan, foto) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)");
$query_insert->bind_param("isssssss", $nomor_harian, $nama, $instansi, $alamat, $jenis_kelamin, $no_telp, $keterangan, $foto);

// Eksekusi query
if ($query_insert->execute()) {
    echo "Data berhasil ditambahkan!";
} else {
    echo "Error: " . $query_insert->error;
}

// Tutup koneksi
$conn->close();
?>
