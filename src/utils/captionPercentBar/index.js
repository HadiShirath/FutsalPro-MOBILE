import {percentBar} from '../percentBar/index';

export const captionPercentBar = (tanggal, category) => {
  if (parseInt(percentBar(tanggal, category), 10) < 50) {
    return 'Tersedia';
  }
  if (parseInt(percentBar(tanggal, category), 10) < 100) {
    return 'Hampir Habis';
  }
  if (parseInt(percentBar(tanggal, category), 10) === 100) {
    return 'Habis';
  }
};
