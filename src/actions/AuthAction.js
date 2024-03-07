import {
  dispatchLoading,
  dispatchSuccess,
  dispatchError,
} from '../utils/dispatch/index';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {auth, db} from '../config/Firebase/index';
import {ref, set, onValue} from 'firebase/database';
import {Alert} from 'react-native';
import {storeData} from '../utils/localStorage';
import {showError} from '../utils/showMessage/index';

export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_USER = 'LOGIN_USER';

export const registerUser = (data, password) => {
  return dispatch => {
    dispatchLoading(dispatch, REGISTER_USER);

    createUserWithEmailAndPassword(auth, data.email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        const dataBaru = {
          ...data,
          uid: user.uid,
        };

        // Simpan di realtime database
        set(ref(db, 'users/' + user.uid), dataBaru);

        // Simpan di Async Storage
        storeData('user', dataBaru);

        // berhasil
        dispatchSuccess(dispatch, REGISTER_USER, dataBaru);
      })
      .catch(error => {
        dispatchError(dispatch, REGISTER_USER, error.message);
        // Alert.alert(error.message);
        showError(
          error.message === 'Firebase: Error (auth/network-request-failed).'
            ? 'Koneksi Terputus, Cek Koneksi Internetmu'
            : error.message === 'Firebase: Error (auth/invalid-email).'
            ? 'Email Tidak Valid, Cek Penulisan Email'
            : error.message ===
              'Firebase: Password should be at least 6 characters (auth/weak-password).'
            ? 'Kata sandi minimal harus 6 karakter'
            : error.message,
        );

        // ..
      });
  };
};

export const loginUser = (email, password) => {
  return dispatch => {
    dispatchLoading(dispatch, LOGIN_USER);

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        //sukses update password

        // Signed in
        const user = userCredential.user;

        onValue(
          ref(db, '/users/' + user.uid),
          snapshot => {
            if (snapshot.val()) {
              // Simpan di Async Storage
              storeData('user', snapshot.val());

              // berhasil
              dispatchSuccess(dispatch, LOGIN_USER, snapshot.val());
            } else {
              dispatchError(dispatch, LOGIN_USER, 'Data User Tidak Ada');
              Alert.alert('Error', 'Data User Tidak Ada');
            }
          },
          {
            onlyOnce: true,
          },
        );
        // ...
      })
      .catch(error => {
        dispatchError(dispatch, LOGIN_USER, error.message);
        // Alert.alert(error.message);
        showError(
          error.message === 'Firebase: Error (auth/invalid-email).'
            ? 'Email Tidak Valid, Cek Penulisan Email'
            : error.message ===
              'Firebase: Error (auth/invalid-login-credentials).'
            ? 'Email dan Password Tidak Valid'
            : error.message === 'Firebase: Error (auth/network-request-failed).'
            ? 'Koneksi Terputus, Cek Koneksi Internetmu'
            : error.message ===
              'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).'
            ? 'Terlalu Banyak Upaya Login Yang Gagal untuk Akun ini, Coba Lagi Nanti'
            : error.message,
        );
      });
  };
};
