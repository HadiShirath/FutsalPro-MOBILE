export const formatDate = date => {
  // inisialisasi nilai tanggal
  var kalender = new Date(date);
  var hari = kalender.getDay();
  const tahun = kalender.getFullYear();
  const bulan = kalender.getMonth();
  const tanggal = kalender.getDate();

  // Mengonversi nilai angka hari ke nama hari
  var namaHari = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  // Mengonversi nilai angka bulan ke nama bulan
  var namaBulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return `${namaHari[hari]}, ${tanggal} ${namaBulan[bulan]} ${tahun}`;
};
