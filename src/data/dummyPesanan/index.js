import {ProductVinyl, ProductRumput} from '../../assets';

export const dummyPesanan = [
  {
    id: 1,
    user: 'userId',
    pesanans: [
      {
        id: 1,
        tanggal: '2023-12-12',
        totalHarga: 300000,
        status: 'Lunas',
        order_id: 'FSL-1696779930669-userId',
        reminder: '20/08/2023-12.00',
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
            harga: 220000,
            totalHarga: 300000,
          },
        ],
      },
      {
        id: 2,
        tanggal: '2023-08-01',
        totalHarga: 450000,
        status: 'Pending',
        order_id: 'FSL-1696779912345-userId',
        reminder: '',
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
        ],
      },
      {
        id: 3,
        tanggal: '2023-09-13',
        totalHarga: 450000,
        status: 'Lunas',
        order_id: 'FSL-1696779912345-userId',
        reminder: '',
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
        ],
      },
    ],
  },
];
