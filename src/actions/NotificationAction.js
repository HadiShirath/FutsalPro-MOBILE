import {ref, onValue, query, orderByChild, equalTo} from 'firebase/database';
import {db} from '../config/Firebase/index';
import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';

export const GET_LIST_NOTIFICATION = 'GET_LIST_NOTIFICATION';

export const getListNotification = uid => {
  return dispatch => {
    dispatchLoading(dispatch, GET_LIST_NOTIFICATION);

    onValue(
      ref(db, `notifications/${uid}`),
      snapshot => {
        if (snapshot.val()) {
          // berhasil
          dispatchSuccess(dispatch, GET_LIST_NOTIFICATION, snapshot.val());

          // Simpan di Async Storage
        } else {
          dispatchError(
            dispatch,
            GET_LIST_NOTIFICATION,
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
