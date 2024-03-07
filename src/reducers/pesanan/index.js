import {
  UPDATE_PESANAN,
  CANCEL_PESANAN,
  CHECK_PESANAN,
  CHECK_SCHEDULE,
} from '../../actions/PesananAction';

const initialState = {
  updatePesananLoading: false,
  updatePesananResult: false,
  updatePesananError: false,

  cancelPesananLoading: false,
  cancelPesananResult: false,
  cancelPesananError: false,

  checkPesananLoading: false,
  checkPesananResult: false,
  checkPesananError: false,

  checkScheduleLoading: false,
  checkScheduleResult: false,
  checkScheduleError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PESANAN:
      return {
        ...state,
        updatePesananLoading: action.payload.loading,
        updatePesananResult: action.payload.data,
        updatePesananError: action.payload.errorMessage,
      };
    case CANCEL_PESANAN:
      return {
        ...state,
        cancelPesananLoading: action.payload.loading,
        cancelPesananResult: action.payload.data,
        cancelPesananError: action.payload.errorMessage,
      };
    case CHECK_PESANAN:
      return {
        ...state,
        checkPesananLoading: action.payload.loading,
        checkPesananResult: action.payload.data,
        checkPesananError: action.payload.errorMessage,
      };
    case CHECK_SCHEDULE:
      return {
        ...state,
        checkScheduleLoading: action.payload.loading,
        checkScheduleResult: action.payload.data,
        checkScheduleError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
