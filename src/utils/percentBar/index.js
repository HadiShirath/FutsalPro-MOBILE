export const percentBar = (data, category) => {
  //menghitung jumlah waktu berdasarkan jenis lapangan dan category

  const dataWaktuPagi = [
    '08.00-09.00',
    '13.00-14.00',
    '09.00-10.00',
    '14.00-15.00',
    '10.00-11.00',
    '15.00-16.00',
    '11.00-12.00',
    '16.00-17.00',
  ];
  const dataWaktuMalam = [
    '19.00-20.00',
    '22.00-23.00',
    '20.00-21.00',
    '23.00-23.59',
    '21.00-22.00',
  ];

  const schedule = data.filter(jadwal => {
    return category === 'pagi'
      ? dataWaktuPagi.includes(jadwal.waktu)
      : dataWaktuMalam.includes(jadwal.waktu);
  }).length;

  const scoreValue = (valueData, number) => {
    return ((valueData / number) * 100 + '%').toString();
  };

  return category === 'pagi'
    ? scoreValue(schedule, 8)
    : category === 'malam'
    ? scoreValue(schedule, 5)
    : scoreValue(0, 1);
};
