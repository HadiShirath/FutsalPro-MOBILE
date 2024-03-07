import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';
import {ref, set, onValue, push, remove, update} from 'firebase/database';
import {db} from '../config/Firebase/index';
import {messageNotification} from '../utils/messageNotification/index';

export const UPDATE_PESANAN = 'UPDATE_PESANAN';
export const CANCEL_PESANAN = 'CANCEL_PESANAN';
export const CHECK_PESANAN = 'CHECK_PESANAN';
export const CHECK_SCHEDULE = 'CHECK_SCHEDULE';

export const updatePesanan = params => {
  return dispatch => {
    dispatchLoading(dispatch, UPDATE_PESANAN);

    const uid = params.order_id.split('-')[2];
    const order_id = params.order_id;
    const order_id_user = `${params.order_id.split('-')[0]}-${
      params.order_id.split('-')[1]
    }`;

    //get Keranjang By UID User
    onValue(
      ref(db, '/keranjangs/' + uid),
      snapshot => {
        if (snapshot.val()) {
          //ambil data keranjang
          const data = snapshot.val();

          const now = new Date();
          const jam = String(now.getHours()).padStart(2, '0'); // Mendapatkan jam (dalam format 24 jam)
          const menit = String(now.getMinutes()).padStart(2, '0'); // Mendapatkan menit

          const waktuOrder = `${jam}:${menit}`;

          // hapus data di keranjang
          remove(ref(db, `keranjangs/${uid}`));

          const idNotification = new Date().getTime();

          const dataMessage = messageNotification(
            idNotification,
            '🚨 Pembayaran Belum Selesai',
            'Harap selesaikan pembayaran',
          );

          set(
            ref(db, `notifications/${uid}/all/${idNotification}`),
            dataMessage,
          );

          // data pesanan "YYYY-MM-DD":{}
          const dataBaru = {...data.pesanans};

          const newData = Object.fromEntries(
            Object.entries(dataBaru).map(([date, bookings]) => {
              const {totalHarga, ...rest} = bookings;
              return [date, rest];
            }),
          );

          onValue(
            ref(db, 'users/' + uid),
            snapshot => {
              if (snapshot.val()) {
                const dataUser = snapshot.val();

                const dataDiri = {
                  nama: dataUser.username,
                  uid: dataUser.uid,
                  photo: dataUser.photo,
                  email: dataUser.email,
                };

                const dataHistoryDB = {
                  ...data,
                  status: 'pending',
                  reminder: '',
                  tanggalOrder: new Date().toLocaleDateString('en-CA'),
                  waktuOrder: waktuOrder,
                  order_id: order_id_user,
                  url: params.url,
                  nama: dataUser.username,
                };

                set(
                  ref(db, `notifications/${uid}/waitings/${order_id}`),
                  dataHistoryDB,
                );

                set(ref(db, `histories/${order_id}`), dataHistoryDB);

                // Transforming the data structure
                const transformedData = Object.entries(newData).reduce(
                  (acc, [date, bookings]) => {
                    const transformedBookings = Object.entries(bookings).map(
                      ([id, booking]) => ({
                        [id]: booking,
                      }),
                    );
                    acc[date] = transformedBookings;
                    return acc;
                  },
                  {},
                );

                const dataPesanan = Object.entries(transformedData).map(
                  ([date, bookings]) => ({
                    [date]: bookings.reduce((acc, booking) => {
                      const {nama, waktu} = Object.values(booking)[0];
                      acc[nama] = (acc[nama] || []).concat(
                        waktu.map(timeSlot => ({...dataDiri, waktu: timeSlot})),
                      );
                      return acc;
                    }, {}),
                  }),
                );

                dataPesanan.map(
                  (item, index) => {
                    onValue(
                      ref(db, `pesanans/${Object.keys(item)[0]}`),
                      snapshot => {
                        if (snapshot.val()) {
                          const dataPesananDB = Object.keys(snapshot.val());

                          //data pesanan yang sudah di filter tanpa BULAN
                          const dataPesananDBNew = dataPesananDB.filter(
                            filter => filter !== 'bulan',
                          );

                          const dataKeranjang = Object.keys(
                            Object.values(item)[0],
                          );

                          const Pesanan =
                            dataPesananDBNew.length > dataKeranjang.length
                              ? dataPesananDBNew
                              : dataKeranjang;

                          Pesanan.map(itemm => {
                            const dataPesananFilter = snapshot.val()[itemm]
                              ? snapshot.val()[itemm]
                              : [];
                            const itemValue = Object.values(item)[0][itemm]
                              ? Object.values(item)[0][itemm]
                              : [];
                            const dataBaruu = [
                              ...dataPesananFilter,
                              ...itemValue,
                            ];

                            //update ke database
                            set(
                              ref(
                                db,
                                `pesanans/${Object.keys(item)[0]}/${itemm}`,
                              ),
                              dataBaruu,
                            );
                          });

                          dispatchSuccess(
                            dispatch,
                            UPDATE_PESANAN,
                            snapshot.val(),
                          );
                        } else {
                          const dataPesananBaru = {
                            ...Object.values(item)[0],
                            bulan: Object.keys(item)[0].slice(0, 7),
                          };

                          set(
                            ref(db, `pesanans/${Object.keys(item)[0]}`),
                            dataPesananBaru,
                          );
                          dispatchSuccess(
                            dispatch,
                            UPDATE_PESANAN,
                            'tambahkan data',
                          );
                        }
                      },
                      {
                        onlyOnce: true,
                      },
                    );
                  },
                  {
                    onlyOnce: true,
                  },
                );
              }
            },
            {
              onlyOnce: true,
            },
          );
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};

// Aksi Redux Thunk untuk menghapus data berdasarkan uid
export const cancelPesanan = order_id => {
  return dispatch => {
    dispatchLoading(dispatch, CANCEL_PESANAN);

    const uid = order_id.split('-')[2];

    //get Keranjang By UID User
    onValue(
      ref(db, `histories/${order_id}`),
      snapshot => {
        if (snapshot.val()) {
          //ambil data keranjang
          const data = snapshot.val();

          //hapus data histories
          remove(ref(db, `histories/${order_id}`));
          remove(ref(db, `notifications/${uid}/waitings/${order_id}`));

          dispatch(deletePesananDetail(data));
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const checkPesanan = (tanggal, lapangan) => {
  return dispatch => {
    dispatchLoading(dispatch, CHECK_PESANAN);

    if (tanggal && lapangan) {
      onValue(
        ref(db, `pesanans/${tanggal}/${lapangan}`),
        snapshot => {
          dispatchSuccess(
            dispatch,
            CHECK_PESANAN,
            snapshot.val() ? snapshot.val() : [],
          );
        },
        {
          onlyOnce: true,
        },
      );
    } else {
      onValue(
        ref(db, `pesanans/${tanggal}`),
        snapshot => {
          dispatchSuccess(
            dispatch,
            CHECK_PESANAN,
            snapshot.val() ? snapshot.val() : [],
          );
        },
        {
          onlyOnce: true,
        },
      );
    }
  };
};

export const checkSchedule = tanggal => {
  return dispatch => {
    dispatchLoading(dispatch, CHECK_SCHEDULE);

    onValue(
      ref(db, `pesanans/${tanggal}`),
      snapshot => {
        dispatchSuccess(dispatch, CHECK_SCHEDULE, snapshot.val());
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const deletePesananDetail = data => {
  return dispatch => {
    // data pesanan "YYYY-MM-DD":{}
    const dataBaru = {...data.pesanans};

    const newData = Object.fromEntries(
      Object.entries(dataBaru).map(([date, bookings]) => {
        const {totalHarga, ...rest} = bookings;
        return [date, rest];
      }),
    );

    // Transforming the data structure
    const transformedData = Object.entries(newData).reduce(
      (acc, [date, bookings]) => {
        const transformedBookings = Object.entries(bookings).map(
          ([id, booking]) => ({
            [id]: booking,
          }),
        );
        acc[date] = transformedBookings;
        return acc;
      },
      {},
    );

    const dataPesanan = Object.entries(transformedData).map(
      ([date, bookings]) => ({
        [date]: bookings.reduce((acc, booking) => {
          const {nama, waktu} = Object.values(booking)[0];
          acc[nama] = (acc[nama] || []).concat(
            waktu.map(timeSlot => ({waktu: timeSlot})),
          );
          return acc;
        }, {}),
      }),
    );

    dataPesanan.map(
      (item, index) => {
        onValue(
          ref(db, `pesanans/${Object.keys(item)[0]}`),
          snapshot => {
            if (snapshot.val()) {
              const dataPesananDB = Object.keys(snapshot.val());

              //data pesanan yang sudah di filter tanpa BULAN
              const dataPesananDBNew = dataPesananDB.filter(
                filter => filter !== 'bulan',
              );

              const dataKeranjang = Object.keys(Object.values(item)[0]);

              //pesanan = ["vinyl", "rumput"]
              const Pesanan =
                dataPesananDBNew.length > dataKeranjang.length
                  ? dataPesananDBNew
                  : dataKeranjang;

              Pesanan.map(itemm => {
                const dataPesananFilter = snapshot.val()[itemm]
                  ? snapshot.val()[itemm]
                  : [];
                const itemValue = Object.values(item)[0][itemm]
                  ? Object.values(item)[0][itemm]
                  : [];

                // filter data yang memiliki waktu yang sama dengan itemValue
                // itemValue = [{waktu:"10.00-11.00"}]
                const dataBaruu = dataPesananFilter.filter(
                  filter => !itemValue.map(t => t.waktu).includes(filter.waktu),
                );

                //update ke database
                set(
                  ref(db, `pesanans/${Object.keys(item)[0]}/${itemm}`),
                  dataBaruu,
                );
              });

              dispatchSuccess(dispatch, CANCEL_PESANAN, 'berhasil hapus 1');
            } else {
              remove(ref(db, `pesanans/${Object.keys(item)[0]}`));

              dispatchSuccess(dispatch, CANCEL_PESANAN, 'berhasil hapus 2');
            }

            onValue(
              ref(db, `pesanans/${Object.keys(item)[0]}`),
              snapshot => {
                const data = Object.keys(snapshot.val()).map(item => item);

                if (data.length === 1 && data[0] === 'bulan') {
                  remove(ref(db, `pesanans/${Object.keys(item)[0]}`));
                }
              },
              {
                onlyOnce: true,
              },
            );
          },
          {
            onlyOnce: true,
          },
        );
      },
      {
        onlyOnce: true,
      },
    );
  };
};
