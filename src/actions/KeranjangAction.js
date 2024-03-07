import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';
import {ref, set, onValue, update, remove} from 'firebase/database';
import {db} from '../config/Firebase/index';

export const ADD_KERANJANG = 'ADD_KERANJANG';
export const GET_LIST_KERANJANG = 'GET_LIST_KERANJANG';
export const DELETE_KERANJANG = 'DELETE_KERANJANG';
export const CHECK_KERANJANG = 'CHECK_KERANJANG';

export const addKeranjang = data => {
  return dispatch => {
    dispatchLoading(dispatch, ADD_KERANJANG);

    //Update nilai Harga di setiap lapangan
    onValue(
      ref(db, `keranjangs/${data.uid}/pesanans`),
      snapshot => {
        if (snapshot.val()) {
          dispatch(keranjangDetail(data));
        } else {
          const keranjangUtama = {
            user: data.uid,
            totalHarga: data.waktu.length * data.harga,
          };

          set(ref(db, `keranjangs/${data.uid}`), keranjangUtama).then(res => {
            //   simpan di keranjang detail
            dispatch(keranjangDetail(data));

            //tambah harga Baru
            update(ref(db, `keranjangs/${data.uid}/pesanans/${data.tanggal}`), {
              totalHarga: data.waktu.length * data.harga,
            });
            // });
          });
        }
      },
      {
        onlyOnce: true,
      },
    );

    setTimeout(() => {
      onValue(
        ref(db, `keranjangs/${data.uid}/pesanans`),
        snapshot => {
          if (snapshot.val()) {
            //menghitung Harga berdasarkan Tanggal
            const tanggal = data.tanggal;
            const keranjangUtama = snapshot.val();
            const dataHargaByTanggal = Object.values(keranjangUtama[tanggal])
              .filter(keranjangFilter => keranjangFilter.waktu)
              .map(item => item.hargaTotal);

            const dataHargaByTanggall = Object.values(keranjangUtama[tanggal])
              .filter(keranjangFilter => keranjangFilter.waktu)
              .map(item => item.hargaTotal);

            let jumlah = 0;
            for (let i = 0; i < dataHargaByTanggal.length; i++) {
              jumlah += dataHargaByTanggal[i];
            }

            //update database harga berdasarkan tanggal
            update(ref(db, `keranjangs/${data.uid}/pesanans/${data.tanggal}`), {
              totalHarga: jumlah,
            });
          } else {
            dispatchError(dispatch, ADD_KERANJANG, 'Data tidak ada');
          }
        },
        {
          onlyOnce: true,
        },
      );
    }, 800);

    setTimeout(() => {
      onValue(
        ref(db, `keranjangs/${data.uid}/pesanans`),
        snapshot => {
          if (snapshot.val()) {
            const keranjangUtama = snapshot.val();
            //menghitung totalHarga secara keseluruhan
            const dataTotalHarga = Object.values(keranjangUtama).map(
              item => item.totalHarga,
            );
            let jumlahTotalHarga = 0;
            for (let i = 0; i < dataTotalHarga.length; i++) {
              jumlahTotalHarga += dataTotalHarga[i];
            }

            //update database total harga semuanya
            update(ref(db, `keranjangs/${data.uid}`), {
              totalHarga: jumlahTotalHarga,
            });

            dispatchSuccess(dispatch, ADD_KERANJANG, snapshot.val());
          } else {
            dispatchError(dispatch, ADD_KERANJANG, 'Data tidak ada');
          }
        },

        {
          onlyOnce: true,
        },
      );
    }, 1500);

    //
  };
};

export const keranjangDetail = data => {
  return dispatch => {
    const dataDetail = {
      waktu: data.waktu,
      harga: data.harga,
      hargaTotal: data.waktu.length * data.harga,
      nama: data.nama,
      category: data.category,
      gambar: data.gambar,
      idLapangan: data.idLapangan,
    };

    set(
      ref(
        db,
        `keranjangs/${data.uid}/pesanans/${data.tanggal}/${data.idLapangan}`,
      ),
      dataDetail,
    ).catch(error => {
      dispatchError(dispatch, ADD_KERANJANG, error);
      console.warn('DATA GAGAL');
    });
  };
};

export const getListKeranjang = uid => {
  return dispatch => {
    dispatchLoading(dispatch, GET_LIST_KERANJANG);

    //dapatkan data listkeranjang dari database
    onValue(
      ref(db, `keranjangs/${uid}/`),
      snapshot => {
        if (snapshot.val()) {
          dispatchSuccess(dispatch, GET_LIST_KERANJANG, snapshot.val());
        } else {
          dispatchError(
            dispatch,
            GET_LIST_KERANJANG,
            'Data Lapangan Tidak Tersedia',
          );
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const deleteKeranjang = (
  keranjangUtama,
  keranjang,
  keranjangTotalHarga,
) => {
  return dispatch => {
    dispatchLoading(dispatch, DELETE_KERANJANG);

    const totalHargabyTanggal = keranjangTotalHarga - keranjang.hargaTotal;
    const totalHargaBaru = keranjangUtama.totalHarga - keranjang.hargaTotal;

    if (totalHargaBaru === 0) {
      //Hapus keranjang Utama
      remove(ref(db, `keranjangs/${keranjangUtama.user}`)).then(() => {
        dispatchSuccess(dispatch, DELETE_KERANJANG, 'Berhasil hapus keranjang');
      });
    } else {
      update(ref(db, `keranjangs/${keranjangUtama.user}`), {
        totalHarga: totalHargaBaru,
      })
        .then(res => {
          //Hapus Pesanan keranjang detail
          update(
            ref(
              db,
              `keranjangs/${keranjangUtama.user}/pesanans/${keranjang.tanggal}`,
            ),
            {
              totalHarga: totalHargabyTanggal,
            },
          );
          dispatch(deleteKeranjangDetail(keranjangUtama.user, keranjang));

          if (totalHargabyTanggal === 0) {
            remove(
              ref(
                db,
                `keranjangs/${keranjangUtama.user}/pesanans/${keranjang.tanggal}`,
              ),
            );
          }
        })
        .catch(error => {
          dispatchError(dispatch, DELETE_KERANJANG, error);
        });
    }
  };
};

export const deleteKeranjangDetail = (id, keranjang) => {
  return dispatch => {
    dispatchLoading(dispatch, DELETE_KERANJANG);
    //hapus pesanan keranjang detail
    remove(
      ref(
        db,
        `keranjangs/${id}/pesanans/${keranjang.tanggal}/${keranjang.idLapangan}`,
      ),
    ).then(() => {
      dispatchSuccess(
        dispatch,
        DELETE_KERANJANG,
        'Berhasil hapus detail keranjang',
      );
    });
  };
};

export const checkKeranjang = (uid, tanggal, idLapangan) => {
  return dispatch => {
    dispatchLoading(dispatch, CHECK_KERANJANG);

    onValue(
      ref(db, `keranjangs/${uid}/pesanans/${tanggal}/${idLapangan}`),
      snapshot => {
        if (snapshot.val()) {
          dispatchSuccess(
            dispatch,
            CHECK_KERANJANG,
            snapshot.val() ? snapshot.val() : [],
          );
        } else {
          dispatchError(dispatch, CHECK_KERANJANG, 'Data tidak ditemukan');
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};
