export const formatAlarm = tanggal => {
  const inputDate = new Date(tanggal);

  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); //
  const year = inputDate.getFullYear();
  const hours = inputDate.getHours().toString().padStart(2, '0');
  const minutes = inputDate.getMinutes().toString().padStart(2, '0');

  return `${day}-${month}-${year}, ${hours}.${minutes} WIB`;
};
