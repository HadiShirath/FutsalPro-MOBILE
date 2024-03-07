import {combineReducers} from 'redux';
import AuthReducer from './auth';
import FieldReducer from './field';
import ProfileReducer from './profile';
import FavoriteReducer from './favorite';
import KeranjangReducer from './keranjang';
import PesananReducer from './pesanan';
import HistoryReducer from './history';
import NotificationReducer from './notification';
import UlasanReducer from './ulasan';
import AlarmReducer from './alarm';
import PaymentReducer from './payment';

const rootReducer = combineReducers({
  AuthReducer,
  FieldReducer,
  ProfileReducer,
  FavoriteReducer,
  KeranjangReducer,
  PesananReducer,
  HistoryReducer,
  NotificationReducer,
  UlasanReducer,
  AlarmReducer,
  PaymentReducer,
});

export default rootReducer;
