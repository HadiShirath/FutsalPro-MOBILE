import axios from 'axios';
import {API_TIMEOUT, URL_MIDTRANS, HEADER_MIDTRANS} from '../utils/constant';
import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';

export const SNAP_TRANSACTIONS = 'SNAP_TRANSACTIONS';

export const snapTransactions = data => {
  return dispatch => {
    dispatchLoading(dispatch, SNAP_TRANSACTIONS);

    //axiosi
    if (data) {
      axios({
        method: 'post',
        url: URL_MIDTRANS + 'transactions',
        headers: HEADER_MIDTRANS,
        data: data,
        timeout: API_TIMEOUT,
      })
        .then(response => {
          dispatchSuccess(dispatch, SNAP_TRANSACTIONS, response.data);
          console.log(response.data);
        })
        .catch(error => {
          dispatchError(dispatch, SNAP_TRANSACTIONS, error);
        });
    } else {
      dispatchSuccess(dispatch, SNAP_TRANSACTIONS, false);
    }
  };
};
