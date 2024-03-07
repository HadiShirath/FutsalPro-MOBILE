import {GET_LIST_HISTORY} from '../../actions/HistoryAction';

const initialState = {
  listHistoryLoading: false,
  listHistoryResult: false,
  listHistoryError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_HISTORY:
      return {
        ...state,
        listHistoryLoading: action.payload.loading,
        listHistoryResult: action.payload.data,
        listHistoryError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
