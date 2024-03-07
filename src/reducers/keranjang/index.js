import {
  ADD_KERANJANG,
  GET_LIST_KERANJANG,
  DELETE_KERANJANG,
  CHECK_KERANJANG,
} from '../../actions/KeranjangAction';

const initialState = {
  addKeranjangLoading: false,
  addKeranjangResult: false,
  addKeranjangError: false,

  listKeranjangLoading: false,
  listKeranjangResult: false,
  listKeranjangError: false,

  deleteKeranjangLoading: false,
  deleteKeranjangResult: false,
  deleteKeranjangError: false,

  checkKeranjangLoading: false,
  checkKeranjangResult: false,
  checkKeranjangError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_KERANJANG:
      return {
        ...state,
        addKeranjangLoading: action.payload.loading,
        addKeranjangResult: action.payload.data,
        addKeranjangError: action.payload.errorMessage,
      };
    case GET_LIST_KERANJANG:
      return {
        ...state,
        listKeranjangLoading: action.payload.loading,
        listKeranjangResult: action.payload.data,
        listKeranjangError: action.payload.errorMessage,
      };
    case DELETE_KERANJANG:
      return {
        ...state,
        deleteKeranjangLoading: action.payload.loading,
        deleteKeranjangResult: action.payload.data,
        deleteKeranjangError: action.payload.errorMessage,
      };
    case CHECK_KERANJANG:
      return {
        ...state,
        checkKeranjangLoading: action.payload.loading,
        checkKeranjangResult: action.payload.data,
        checkKeranjangError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
