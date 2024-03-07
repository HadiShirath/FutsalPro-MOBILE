import {formatDate} from '../formatDate/index';

export const sevenDays = () => {
  // Buat array untuk menyimpan 7 tanggal ke depan dalam format "YYYY-MM-DD"
  const futureDates = [];

  for (let i = 0; i < 30; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);

    // Mendapatkan tahun, bulan, dan tanggal dari tanggal
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0, sehingga perlu ditambahkan 1
    const day = String(futureDate.getDate()).padStart(2, '0');

    // Menggabungkan tahun, bulan, dan tanggal dalam format "YYYY-MM-DD" dan simpan dalam array
    const formattedDate = `${year}-${month}-${day}`;

    // Menyimpan formattedDate dalam array futureDates
    futureDates.push(formattedDate);
  }

  const dateArray = futureDates.map((value, index) => ({
    label: formatDate(value),
    value,
  }));

  return dateArray;
};
