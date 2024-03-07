import Moment from 'moment';
import {dispatchLoading, dispatchSuccess} from '../utils/dispatch/index';
import {ref, set, onValue, update, remove} from 'firebase/database';
import {db} from '../config/Firebase/index';
import {formatAlarm} from '../utils/formatAlarm/index';
import PushNotification from 'react-native-push-notification';

export const ADD_ALARM = 'ADD_ALARM';
export const DELETE_ALARM = 'DELETE_ALARM';

export const addAlarm = (data, dataUser) => {
  return dispatch => {
    dispatchLoading(dispatch, ADD_ALARM);

    onValue(
      ref(db, `histories/${dataUser.order_id}`),
      snapshot => {
        const reminderId = snapshot.val().reminderId;

        if (reminderId) {
          PushNotification.cancelLocalNotification(reminderId);
        }

        update(ref(db, `histories/${dataUser.order_id}`), {
          reminder: `${formatAlarm(data.fire_date)}`,
          reminderId: data.id,
        });
      },
      {
        onlyOnce: true,
      },
    );

    Moment.locale('en');
    const payload = data;
    const time = Moment(payload.date.value).format('hh:mm');
    const date = Moment(payload.date.value).format('DD-MM-YYYY');

    dispatchSuccess(dispatch, ADD_ALARM, data);
  };
};

export const deleteAlarm = dataUser => {
  return dispatch => {
    dispatchLoading(dispatch, DELETE_ALARM);

    console.log(dataUser);

    onValue(
      ref(db, `histories/${dataUser.order_id}`),
      snapshot => {
        const reminderId = snapshot.val().reminderId;
        if (reminderId) {
          PushNotification.cancelLocalNotification(reminderId);
        }

        update(ref(db, `histories/${dataUser.order_id}`), {
          reminder: '',
          reminderId: '',
        });
        dispatchSuccess(dispatch, DELETE_ALARM, snapshot.val());
      },
      {
        onlyOnce: true,
      },
    );
  };
};
