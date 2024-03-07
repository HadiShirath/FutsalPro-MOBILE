import {
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  UPDATE_PHOTO,
  GET_DEFAULT_PHOTO,
} from '../../actions/ProfileAction';

const initialState = {
  updateProfileLoading: false,
  updateProfileResult: false,
  updateProfileError: false,

  changePasswordLoading: false,
  changePasswordResult: false,
  changePasswordError: false,

  defaultPhotoLoading: false,
  defaultPhotoResult: false,
  defaultPhotoError: false,

  updatePhotoLoading: false,
  updatePhotoResult: false,
  updatePhotoError: false,

  fullName: '',
  email: '',
  password: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileLoading: action.payload.loading,
        updateProfileResult: action.payload.data,
        updateProfileError: action.payload.errorMessage,
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        changePasswordLoading: action.payload.loading,
        changePasswordResult: action.payload.data,
        changePasswordError: action.payload.errorMessage,
      };
    case UPDATE_PHOTO:
      return {
        ...state,
        updatePhotoLoading: action.payload.loading,
        updatePhotoResult: action.payload.data,
        updatePhotoError: action.payload.errorMessage,
      };
    case GET_DEFAULT_PHOTO:
      return {
        ...state,
        defaultPhotoLoading: action.payload.loading,
        defaultPhotoResult: action.payload.data,
        defaultPhotoError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
