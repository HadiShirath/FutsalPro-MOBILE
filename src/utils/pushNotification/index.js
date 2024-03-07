import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';
import {addAlarm} from '../../actions/AlarmAction';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log(fcmtoken, 'old token');

  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        console.log(fcmtoken, 'new token');
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      }
    } catch (error) {
      console.log(error, 'error in fcmtoken');
    }
  }
};

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('received in foreground', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};

//Alarm Notification

export const createChannels = () => {
  PushNotification.createChannel({
    channelId: 'alarm-channel',
    channelName: 'Alarm Channel',
  });
};

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000);
  return newId;
};

export const handleDatePicker = (
  dispatch,
  dateTime,
  order_id,
  uid,
  message,
) => {
  const fireDate = dateTime;

  const alarmNotifData = {
    channelId: 'alarm-channel',
    ticker: 'My Notification Message',

    id: generateId(),
    title: 'Pengingat Jadwal',
    message: message,
    autoCancel: true,
    vibrate: true,
    vibration: 100,
    playSound: true,
    soundName: 'default',
    color: 'red',
    //schedule_once: true,
    tag: 'some_tag',
    fire_date: fireDate,
    date: {value: dateTime},
    //date: fireDate,
  };

  const dataUser = {
    order_id: order_id,
    uid: uid,
  };

  console.log('dataUser :', dataUser);

  dispatch(addAlarm(alarmNotifData, dataUser));
  console.log('ID: ' + alarmNotifData.id);

  PushNotification.localNotificationSchedule({
    channelId: 'alarm-channel',
    title: alarmNotifData.title,

    id: alarmNotifData.id,
    message: alarmNotifData.message,
    date: alarmNotifData.fire_date,
    smallIcon: 'ic_launcher',
    largeIcon: 'ic_launcher',
    //   actions: ['Snooze', 'Stop Alarm'],
    importance: Importance.HIGH,
    playSound: true,
    soundName: 'default',
    allowWhileIdle: true,
    invokeApp: true,
  });
};
