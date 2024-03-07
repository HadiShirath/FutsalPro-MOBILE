import {StyleSheet, View} from 'react-native';
import React from 'react';
import CardMenu from '../../atoms/CardMenu/index';

export default function ListMenu({menu, navigation}) {
  return (
    <View>
      {menu.map(key => {
        return <CardMenu menu={key} key={key.id} navigation={navigation} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({});
