import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigator} from '../components/molecules/BottomNavigator/index';

import {
  Splash,
  GetStarted,
  Register1,
  Register2,
  Login,
  UploadPhoto,
  Home,
  Schedule,
  History,
  Profile,
  DetailLapangan,
  EditProfile,
  Ulasan,
  ChangePassword,
  AboutUs,
  Favorite,
  Keranjang,
  InfoProduct,
  Order,
  Notification,
  Lapangan,
  Midtrans,
  Whatsapp,
} from '../pages';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <BottomNavigator {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Beranda" component={Home} />
      <Tab.Screen name="Jadwal" component={Schedule} />
      <Tab.Screen name="Riwayat" component={History} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register1"
        component={Register1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register2"
        component={Register2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UploadPhoto"
        component={UploadPhoto}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailLapangan"
        component={DetailLapangan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Ulasan"
        component={Ulasan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TentangKami"
        component={AboutUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Keranjang"
        component={Keranjang}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InfoProduct"
        component={InfoProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Order"
        component={Order}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Lapangan"
        component={Lapangan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Midtrans"
        component={Midtrans}
        options={{headerShown: false}}
        // options={{title: 'Lanjutkan Pembayaran'}}
      />
      <Stack.Screen
        name="Whatsapp"
        component={Whatsapp}
        options={{
          title: 'Hubungi Pengembang Aplikasi',
        }}
      />
    </Stack.Navigator>
  );
};

export default Router;
