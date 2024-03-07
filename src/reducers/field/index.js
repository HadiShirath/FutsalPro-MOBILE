import {
  GET_LIST_FIELDS,
  GET_LIST_FIELDS_BY_CATEGORY,
  SAVE_KEYWORD_FIELD,
  GET_RECOMMENDED_LIST_FIELDS,
} from '../../actions/FieldAction';

const initialState = {
  listFieldsLoading: false,
  listFieldsResult: false,
  listFieldsError: false,

  listRecommendedFieldsLoading: false,
  listRecommendedFieldsResult: false,
  listRecommendedFieldsError: false,

  category: false,

  keyword: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_FIELDS:
      return {
        ...state,
        listFieldsLoading: action.payload.loading,
        listFieldsResult: action.payload.data,
        listFieldsError: action.payload.errorMessage,
      };
    case GET_LIST_FIELDS_BY_CATEGORY:
      return {
        ...state,
        category: action.payload.category,
      };
    case SAVE_KEYWORD_FIELD:
      return {
        ...state,
        keyword: action.payload.keyword,
      };
    case GET_RECOMMENDED_LIST_FIELDS:
      return {
        ...state,
        listRecommendedFieldsLoading: action.payload.loading,
        listRecommendedFieldsResult: action.payload.data,
        listRecommendedFieldsError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
