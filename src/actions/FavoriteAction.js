import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';
import {ref, set, onValue, remove} from 'firebase/database';
import {db} from '../config/Firebase/index';
import {showError} from '../utils/showMessage/index';

export const GET_LIST_FAVORITE = 'GET_LIST_FAVORITE';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const CHECK_FAVORITE = 'CHECK_FAVORITE';
export const DELETE_FAVORITE = 'DELETE_FAVORITE';

export const getListFavorite = uid => {
  return dispatch => {
    dispatchLoading(dispatch, GET_LIST_FAVORITE);

    onValue(
      ref(db, 'favorites/' + uid),
      snapshot => {
        if (snapshot.val()) {
          dispatchSuccess(dispatch, GET_LIST_FAVORITE, snapshot.val());
        } else {
          dispatchError(dispatch, GET_LIST_FAVORITE, 'Data tidak ditemukan');
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const checkFavorite = data => {
  return dispatch => {
    dispatchLoading(dispatch, CHECK_FAVORITE);

    onValue(
      ref(db, 'favorites/' + data.uid + '/' + data.idLapangan),
      snapshot => {
        if (snapshot.val()) {
          dispatchSuccess(dispatch, CHECK_FAVORITE, snapshot.val());
        } else {
          dispatchError(dispatch, CHECK_FAVORITE, 'Data tidak ditemukan');
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};

export const addFavorite = data => {
  return dispatch => {
    dispatchLoading(dispatch, ADD_FAVORITE);

    set(ref(db, 'favorites/' + data.uid + '/' + data.idLapangan), data)
      .then(res => {
        //simpan di keranjang detail
        dispatchSuccess(dispatch, ADD_FAVORITE, 'Data berhasil ditambahkan');
      })
      .catch(error => {
        dispatchError(dispatch, ADD_FAVORITE, error);
        showError('Data gagal ditambahkan');
      });
  };
};

export const deleteFavorite = (uid, idLapangan) => {
  return dispatch => {
    dispatchLoading(dispatch, DELETE_FAVORITE);

    //Hapus Lapangan dari list Favorite
    remove(ref(db, `favorites/${uid}/${idLapangan}`)).then(() => {
      dispatchSuccess(
        dispatch,
        DELETE_FAVORITE,
        'Data Lapangan Berhasil di hapus',
      );
    });
  };
};
