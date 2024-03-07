import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';
import {ref, set, onValue, remove, get, update} from 'firebase/database';
import {db} from '../config/Firebase/index';

export const GET_LIST_ULASAN = 'GET_LIST_ULASAN';
export const ADD_ULASAN = 'ADD_ULASAN';
export const GET_VALUE_ULASAN = 'GET_VALUE_ULASAN';

export const getListUlasan = uid => {
  return dispatch => {
    dispatchLoading(dispatch, GET_LIST_ULASAN);

    onValue(
      ref(db, `ulasans/${uid}/`),
      snapshot => {
        if (snapshot.val()) {
          // const data = Object.keys(snapshot.val()).map(
          //   item => snapshot.val()[item],
          // );

          dispatchSuccess(dispatch, GET_LIST_ULASAN, snapshot.val());
        } else {
          //tambahkan dataUlasan
          dispatchError(
            dispatch,
            GET_LIST_ULASAN,
            'Gagal mendapatkan data ulasan',
          );
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const addUlasan = (uid, data) => {
  return dispatch => {
    dispatchLoading(dispatch, ADD_ULASAN);

    onValue(
      ref(db, `ulasans/${uid}/waitings`),
      snapshot => {
        //tambahkan dataUlasan
        // update data rating di database
        update(ref(db, `histories/${data.order_id}-${uid}`), {
          jadwal_selesai: true,
        });

        set(ref(db, `ulasans/${uid}/waitings/${data.order_id}`), data);

        dispatchSuccess(dispatch, ADD_ULASAN, snapshot.val());
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const getValueUlasan = (dataUtama, dataDetail) => {
  return dispatch => {
    dispatchLoading(dispatch, GET_VALUE_ULASAN);

    remove(
      ref(
        db,
        `ulasans/${dataUtama.uid}/waitings/${dataUtama.order_id}/pesanans/${dataDetail.tanggal}/${dataDetail.pesanans.idLapangan}`,
      ),
    ).then(res => {
      onValue(
        ref(db, `ulasans/${dataUtama.uid}/ratings/${dataUtama.order_id}`),
        snapshot => {
          if (snapshot.val()) {
            //Hapus data di waitings ulasan firebase
            dispatch(valueDetailUlasan(dataUtama, dataDetail));
          } else {
            set(
              ref(db, `ulasans/${dataUtama.uid}/ratings/${dataUtama.order_id}`),
              dataUtama,
            );

            dispatch(valueDetailUlasan(dataUtama, dataDetail));
          }
        },
        {
          onlyOnce: true,
        },
      );
    });
  };
};

export const valueDetailUlasan = (dataUtama, dataDetail) => {
  return dispatch => {
    //update rating database lapangan
    onValue(
      ref(db, `fields/${dataDetail.pesanans.idLapangan}`),
      snapshotTiga => {
        const dataRatingDB = snapshotTiga.val().rating;
        const ratingFromUser = dataDetail.pesanans.rating;

        //update data rating
        const dataRatingBaru = dataRatingDB.map((key, index) =>
          ratingFromUser[index] === 1 ? dataRatingDB[index] + 1 : key,
        );

        //update data rating di database
        update(ref(db, `fields/${dataDetail.pesanans.idLapangan}`), {
          rating: dataRatingBaru,
        });
      },
      {
        onlyOnce: true,
      },
    );

    onValue(
      ref(db, `ulasans/${dataUtama.uid}/waitings/${dataUtama.order_id}`),
      snapshotDua => {
        const data = snapshotDua.val();
        if (!data.pesanans) {
          remove(
            ref(db, `ulasans/${dataUtama.uid}/waitings/${dataUtama.order_id}`),
          );
        }
        //tambahkan dataUlasan di ratings ulasan firebase
      },
      {
        onlyOnce: true,
      },
    );

    //tambahkan data ulasan detail pesanans
    set(
      ref(
        db,
        `ulasans/${dataUtama.uid}/ratings/${dataUtama.order_id}/pesanans/${dataDetail.tanggal}/${dataDetail.pesanans.idLapangan}`,
      ),
      dataDetail.pesanans,
    ).then(() => {
      dispatchSuccess(dispatch, GET_VALUE_ULASAN, dataDetail);
    });
  };
};
