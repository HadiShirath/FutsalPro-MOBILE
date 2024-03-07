export const listDataSchedule = () => {
  // Mendapatkan offset waktu untuk WIB (GMT+7)
  const offsetInMinutes = 7 * 60;

  // Membuat tanggal saat ini dengan offset WIB
  const nowInWIB = new Date(new Date().getTime() + offsetInMinutes * 60 * 1000);
  const dateRangeInWIB = [];

  // Mendapatkan tanggal kemarin dengan offset WIB
  const yesterdayInWIB = new Date(nowInWIB);
  yesterdayInWIB.setDate(nowInWIB.getDate() - 1);
  dateRangeInWIB.push(formatDate(yesterdayInWIB));

  // Mendapatkan tanggal-tanggal 7 hari ke depan dengan offset WIB
  for (let i = 0; i < 30; i++) {
    const futureDateInWIB = new Date(nowInWIB);
    futureDateInWIB.setDate(nowInWIB.getDate() + i);
    dateRangeInWIB.push(formatDate(futureDateInWIB));
  }

  return dateRangeInWIB;
};

function formatDate(date) {
  return date.toISOString().slice(0, 10); // Format tanggal menjadi 'YYYY-MM-DD'
}
