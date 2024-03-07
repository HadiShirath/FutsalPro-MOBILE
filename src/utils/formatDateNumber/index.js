export const formatDateNumber = tanggal => {
  return `${tanggal.split('-')[2]}-${tanggal.split('-')[1]}-${
    tanggal.split('-')[0]
  }`;
};
