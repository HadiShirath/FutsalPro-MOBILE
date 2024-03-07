import {
  ADD_ULASAN,
  GET_LIST_ULASAN,
  GET_VALUE_ULASAN,
} from '../../actions/UlasanAction';

const initialState = {
  addUlasanLoading: false,
  addUlasanResult: false,
  addUlasanError: false,

  listUlasanLoading: false,
  listUlasanResult: false,
  listUlasanError: false,

  getValueUlasanLoading: false,
  getValueUlasanResult: false,
  getValueUlasanError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_ULASAN:
      return {
        ...state,
        addUlasanLoading: action.payload.loading,
        addUlasanResult: action.payload.data,
        addUlasanError: action.payload.errorMessage,
      };
    case GET_LIST_ULASAN:
      return {
        ...state,
        listUlasanLoading: action.payload.loading,
        listUlasanResult: action.payload.data,
        listUlasanError: action.payload.errorMessage,
      };
    case GET_VALUE_ULASAN:
      return {
        ...state,
        getValueUlasanLoading: action.payload.loading,
        getValueUlasanResult: action.payload.data,
        getValueUlasanError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
