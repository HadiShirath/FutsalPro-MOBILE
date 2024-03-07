import {ADD_ALARM, DELETE_ALARM} from '../../actions/AlarmAction';

const initialState = {
  alarmsLoading: false,
  alarmsResult: false,
  alarmsError: false,

  deleteAlarmLoading: false,
  deleteAlarmResult: false,
  deleteAlarmError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_ALARM:
      return {
        ...state,
        alarmsLoading: action.payload.loading,
        alarmsResult: action.payload.data,
        alarmsError: action.payload.errorMessage,
      };
    case DELETE_ALARM:
      return {
        ...state,
        deleteAlarmLoading: action.payload.loading,
        deleteAlarmResult: action.payload.data,
        deleteAlarmError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
