import {ProductVinyl, ProductRumput} from '../../assets';

export const dummyKeranjang = [
  {
    id: 1,
    totalHarga: 1030000,
    pesanans: [
      {
        id: 1,
        tanggalDetail: 'Sabtu, 12 Desember 2023',
        tanggal: '2023-12-12',
        totalHarga: 200000,
        product: [
          {
            id: 1,
            nama: 'Lapangan Vinyl',
            category: 'Pagi-Sore',
            gambar: ProductVinyl,
            waktu: [
              '08.00-09.00',
              '09.00-10.00',
              '10.00-11.00',
              '11.00-12.00',
              '13.00-14.00',
              '14.00-15.00',
            ],
            harga: 150000,
            totalHarga: 880000,
          },
          {
            id: 2,
            nama: 'Lapangan Rumput',
            category: 'Pagi-Sore',
            gambar: ProductRumput,
            waktu: ['08.00-09.00', '09.00-10.00', '10.00-11.00', '11.00-12.00'],
            harga: 150000,
            totalHarga: 300000,
          },
        ],
      },
      {
        id: 2,
        tanggalDetail: 'Sabtu, 12 Desember 2023',
        tanggal: '2023-12-12',
        totalHarga: 200000,
        product: [
          {
            id: 1,
            nama: 'Lapangan Vinyl',
            category: 'Pagi-Sore',
            gambar: ProductVinyl,
            waktu: [
              '08.00-09.00',
              '09.00-10.00',
              '10.00-11.00',
              '11.00-12.00',
              '13.00-14.00',
              '14.00-15.00',
            ],
            harga: 150000,
            totalHarga: 880000,
          },
          {
            id: 2,
            nama: 'Lapangan Rumput',
            category: 'Pagi-Sore',
            gambar: ProductRumput,
            waktu: ['08.00-09.00', '09.00-10.00', '10.00-11.00', '11.00-12.00'],
            harga: 150000,
            totalHarga: 300000,
          },
        ],
      },
    ],
  },
];
