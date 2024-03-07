import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';
import {storeData} from '../utils/localStorage/index';
import {ref, update, onValue} from 'firebase/database';
import {
  getStorage,
  ref as refStorage,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  uploadString,
  uploadBytes,
  uploadTask,
} from 'firebase/storage';
import {auth, db} from '../config/Firebase/index';
import {Alert, LogBox} from 'react-native';
import {signInWithEmailAndPassword, updatePassword} from 'firebase/auth';
import {showError, showSuccess} from '../utils/showMessage/index';
import {getData} from '../utils/localStorage';

export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const GET_DEFAULT_PHOTO = 'GET_DEFAULT_PHOTO';
export const UPDATE_PHOTO = 'UPDATE_PHOTO';
export const RESET_FORM = 'RESET_FORM';

export const updateProfile = data => {
  return async dispatch => {
    //Loading
    dispatchLoading(dispatch, UPDATE_PROFILE);

    const dataBaru = {
      uid: data.uid,
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      noHp: data.noHp,
      address: data.address,
      profession: data.profession,
      photo: data.photo,
      defaultPhoto: data.defaultPhoto,
    };

    update(ref(db, 'users/' + data.uid + '/'), dataBaru).then(response => {
      // Simpan di Async Storage
      storeData('user', dataBaru);

      dispatchSuccess(dispatch, UPDATE_PROFILE, response ? response : []);
      showSuccess('Profil Anda Berhasil di update');
    });
  };
};

export const changePassword = data => {
  return dispatch => {
    //loading
    dispatchLoading(dispatch, CHANGE_PASSWORD);

    //cek dulu apakah benar email dan password lama (login)

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(userCredential => {
        //sukses update password

        var user = auth.currentUser;
        updatePassword(user, data.newPassword)
          .then(() => {
            // Update successful.
            dispatchSuccess(
              dispatch,
              CHANGE_PASSWORD,
              'Sukses Mengganti Password',
            );

            showSuccess('Password Berhasil Diganti');
          })
          .catch(error => {
            dispatchError(dispatch, CHANGE_PASSWORD, error);
            showError('Password Baru min. 6 karakter');
            // An error ocurred
            // ...
          });
      })
      .catch(error => {
        dispatchError(dispatch, CHANGE_PASSWORD, error);
        showError('Password Lama Salah');
        // ..
      });
    // Jika sukses maka update password nya
  };
};

export const getDefaultPhoto = indexPhoto => {
  return dispatch => {
    dispatchLoading(dispatch, GET_DEFAULT_PHOTO);

    onValue(
      ref(db, `avatars/${indexPhoto}`),
      async snapshot => {
        if (snapshot.val()) {
          const dataPhotoDB = snapshot.val();

          try {
            const response = await fetch(dataPhotoDB);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.readAsDataURL(blob);

            reader.onloadend = () => {
              const dataUrl = reader.result;
              const dataPhoto = dataUrl.split(',')[1];

              dispatchSuccess(dispatch, GET_DEFAULT_PHOTO, dataPhoto);
            };
          } catch (error) {
            console.error('Error fetching image:', error);
          }

          // Simpan di Async Storage
        } else {
          dispatchError(
            dispatch,
            GET_DEFAULT_PHOTO,
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

export const updatePhoto = (uid, defaultPhoto, dataPhoto) => {
  return dispatch => {
    dispatchLoading(dispatch, UPDATE_PHOTO);

    //update Photo
    update(ref(db, `users/${uid}`), {
      photo: dataPhoto ? dataPhoto : defaultPhoto,
      defaultPhoto: defaultPhoto,
    });

    getData('user').then(res => {
      const data = res;
      data.photo = dataPhoto ? dataPhoto : defaultPhoto;
      data.defaultPhoto = defaultPhoto;

      // Simpan di Async Storage
      storeData('user', data);

      dispatchSuccess(dispatch, UPDATE_PHOTO, 'Foto Berhasil di Update');
    });
  };
};

export const resetForm = data => ({
  type: resetForm,
  payload: {
    fullName: data,
    email: data,
    password: data,
  },
});
