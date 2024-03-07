import {GET_LIST_NOTIFICATION} from '../../actions/NotificationAction';

const initialState = {
  listNotificationLoading: false,
  listNotificationResult: false,
  listNotificationError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_NOTIFICATION:
      return {
        ...state,
        listNotificationLoading: action.payload.loading,
        listNotificationResult: action.payload.data,
        listNotificationError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
