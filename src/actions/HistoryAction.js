import {ref, onValue, query, orderByChild, equalTo} from 'firebase/database';
import {db} from '../config/Firebase/index';
import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';

export const GET_LIST_HISTORY = 'GET_LIST_HISTORY';

export const getListHistory = uid => {
  return dispatch => {
    dispatchLoading(dispatch, GET_LIST_HISTORY);

    onValue(
      query(ref(db, 'histories/'), orderByChild('user'), equalTo(uid)),
      snapshot => {
        if (snapshot.val()) {
          const data = Object.keys(snapshot.val()).map(
            item => snapshot.val()[item],
          );
          // berhasil
          dispatchSuccess(dispatch, GET_LIST_HISTORY, data.reverse());

          // Simpan di Async Storage
        } else {
          dispatchError(
            dispatch,
            GET_LIST_HISTORY,
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
