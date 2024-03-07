import {ref, onValue, query, orderByChild, equalTo} from 'firebase/database';
import {db} from '../config/Firebase/index';
import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';

export const GET_LIST_FIELDS = 'GET_LIST_FIELDS';
export const GET_LIST_FIELDS_BY_CATEGORY = 'GET_LIST_FIELDS_BY_CATEGORY';
export const SAVE_KEYWORD_FIELD = 'SAVE_KEYWORD_FIELD';
export const GET_RECOMMENDED_LIST_FIELDS = 'GET_RECOMMENDED_LIST_FIELDS';

export const getListFields = (category, keyword) => {
  return dispatch => {
    dispatchLoading(dispatch, GET_LIST_FIELDS);

    if (category && category !== 'semua') {
      onValue(
        query(ref(db, '/fields/'), orderByChild('category'), equalTo(category)),
        snapshot => {
          if (snapshot.val()) {
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_FIELDS, snapshot.val());
          } else {
            onValue(
              query(
                ref(db, '/fields/'),
                orderByChild('nama'),
                equalTo(category),
              ),
              snapshot => {
                if (snapshot.val()) {
                  // berhasil
                  dispatchSuccess(dispatch, GET_LIST_FIELDS, snapshot.val());
                } else {
                  dispatchError(
                    dispatch,
                    GET_LIST_FIELDS,
                    'Data Liga tidak ada',
                  );
                }
              },
              {
                onlyOnce: true,
              },
            );
          }
        },
        {
          onlyOnce: true,
        },
      );
    } else if (keyword) {
      onValue(
        query(
          ref(db, '/fields/'),
          orderByChild('category'),
          equalTo(keyword.toLowerCase()),
        ),
        snapshot => {
          if (snapshot.val()) {
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_FIELDS, snapshot.val());
          } else {
            onValue(
              query(
                ref(db, '/fields/'),
                orderByChild('nama'),
                equalTo(keyword.toLowerCase()),
              ),
              snapshot => {
                if (snapshot.val()) {
                  // berhasil
                  dispatchSuccess(dispatch, GET_LIST_FIELDS, snapshot.val());
                } else {
                  dispatchError(
                    dispatch,
                    GET_LIST_FIELDS,
                    'Data Liga tidak ada',
                  );
                }
              },
              {
                onlyOnce: true,
              },
            );
          }
        },
        {
          onlyOnce: true,
        },
      );
    } else {
      onValue(
        ref(db, 'fields/'),
        snapshot => {
          if (snapshot.val()) {
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_FIELDS, snapshot.val());

            // Simpan di Async Storage
          } else {
            dispatchError(
              dispatch,
              GET_LIST_FIELDS,
              'Data Lapangan Tidak Tersedia',
            );
          }
        },
        {
          onlyOnce: true,
        },
      );
    }
  };
};

export const getFieldsByCategory = category => ({
  type: GET_LIST_FIELDS_BY_CATEGORY,
  payload: {
    category: category,
  },
});

export const saveKeywordField = search => ({
  type: SAVE_KEYWORD_FIELD,
  payload: {
    keyword: search,
  },
});

export const getRecommendedListField = () => {
  return dispatch => {
    dispatchLoading(dispatch, GET_RECOMMENDED_LIST_FIELDS);

    onValue(
      ref(db, 'fields/'),
      snapshot => {
        if (snapshot.val()) {
          const data = snapshot.val();
          // berhasil

          const dataRatingTertinggi = Object.keys(data)
            .map(item => {
              return {
                category: data[item].category,
                harga: data[item].harga,
                gambar: data[item].gambar,
                nama: data[item].nama,
                rating: data[item].rating,
                maxRating: Math.max(...data[item].rating),
              };
            })
            .sort((a, b) => b.maxRating - a.maxRating)
            .slice(0, 2);

          dispatchSuccess(
            dispatch,
            GET_RECOMMENDED_LIST_FIELDS,
            dataRatingTertinggi,
          );

          // Simpan di Async Storage
        } else {
          dispatchError(
            dispatch,
            GET_LIST_FIELDS,
            'Data Lapangan Tidak Tersedia',
          );
        }
      },
      {
        onlyOnce: true,
      },
    );
  };
};
