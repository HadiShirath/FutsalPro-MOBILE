export const messageNotification = (idNotification, title, desc) => {
  const now = new Date();
  const jam = String(now.getHours()).padStart(2, '0'); // Mendapatkan jam (dalam format 24 jam)
  const menit = String(now.getMinutes()).padStart(2, '0'); // Mendapatkan menit
  const dataBaruNotification = {
    id: idNotification,
    tanggal: new Date().toLocaleDateString('en-CA'),
    waktu: `${jam}:${menit}`,
    title: title,
    message: desc,
    unread: true,
  };

  return dataBaruNotification;
};
