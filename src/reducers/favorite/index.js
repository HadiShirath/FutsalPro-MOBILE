import {
  ADD_FAVORITE,
  CHECK_FAVORITE,
  GET_LIST_FAVORITE,
  DELETE_FAVORITE,
} from '../../actions/FavoriteAction';

const initialState = {
  listFavoriteLoading: false,
  listFavoriteResult: false,
  listFavoriteError: false,

  addFavoriteLoading: false,
  addFavoriteResult: false,
  addFavoriteError: false,

  checkFavoriteLoading: false,
  checkFavoriteResult: false,
  checkFavoriteError: false,

  deleteFavoriteLoading: false,
  deleteFavoriteResult: false,
  deleteFavoriteError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_FAVORITE:
      return {
        ...state,
        listFavoriteLoading: action.payload.loading,
        listFavoriteResult: action.payload.data,
        listFavoriteError: action.payload.errorMessage,
      };
    case ADD_FAVORITE:
      return {
        ...state,
        addFavoriteLoading: action.payload.loading,
        addFavoriteResult: action.payload.data,
        addFavoriteError: action.payload.errorMessage,
      };
    case CHECK_FAVORITE:
      return {
        ...state,
        checkFavoriteLoading: action.payload.loading,
        checkFavoriteResult: action.payload.data,
        checkFavoriteError: action.payload.errorMessage,
      };
    case DELETE_FAVORITE:
      return {
        ...state,
        deleteFavoriteLoading: action.payload.loading,
        deleteFavoriteResult: action.payload.data,
        deleteFavoriteError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
