import {ProductVinyl, ProductRumput} from '../../assets';

export const dummyUlasan = {
  waitings: [
    {
      id: 1,
      tanggal: '2023-12-12',
      order_id: 'FSL-1696779930669-userId',
      product: [
        {
          id: 1,
          nama: 'vinyl',
          category: 'pagi',
          gambar: ProductVinyl,
        },
        {
          id: 2,
          nama: 'rumput',
          category: 'pagi',
          gambar: ProductRumput,
        },
      ],
    },
    {
      id: 2,
      tanggal: '2023-12-13',
      order_id: 'FSL-1696779998765-userId',
      product: [
        {
          id: 1,
          nama: 'rumput',
          category: 'pagi',
          gambar: ProductRumput,
        },
      ],
    },
  ],
  ratings: [
    {
      id: 1,
      tanggal: '2023-06-13',
      order_id: 'FSL-169677993232-userId',
      product: [
        {
          id: 1,
          nama: 'vinyl',
          category: 'pagi',
          gambar: ProductVinyl,
          rating: [0, 0, 0, 1, 0],
        },
      ],
    },
    {
      id: 2,
      tanggal: '2023-06-13',
      order_id: 'FSL-169677993232-userId',
      product: [
        {
          id: 1,
          nama: 'vinyl',
          category: 'pagi',
          gambar: ProductVinyl,
          rating: [0, 0, 1, 0, 0],
        },
        {
          id: 2,
          nama: 'rumput',
          category: 'pagi',
          gambar: ProductRumput,
          rating: [0, 0, 0, 0, 1],
        },
      ],
    },
  ],
};
