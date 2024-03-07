import React, {useRef} from 'react';
import {StyleSheet, Text, Animated, useWindowDimensions} from 'react-native';
import {fonts} from '../../../utils/fonts/index';
import {Splash2} from '../../../assets';

const CareView = ({animationController}) => {
  const window = useWindowDimensions();

  const careRef = useRef(null);

  const slideAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width, -window.width],
  });

  const careEndVal = 26 * 2;
  const careAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [careEndVal, careEndVal, 0, -careEndVal, -careEndVal],
  });

  const imageEndVal = 350 * 4;
  const imageAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [imageEndVal, imageEndVal, 0, -imageEndVal, -imageEndVal],
  });

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateX: slideAnim}]}]}>
      <Animated.Image
        style={[styles.image, {transform: [{translateX: imageAnim}]}]}
        source={Splash2}
      />
      <Animated.Text
        style={[styles.title, {transform: [{translateX: careAnim}]}]}
        ref={careRef}>
        Pembayaran Cepat ⚡️
      </Animated.Text>
      <Text style={styles.subtitle}>
        Dilengkapi fitur pembayaran yang terintegrasi oleh sistem
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 100,
  },
  image: {
    width: 260,
    height: 400,
  },
  title: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: fonts.primary.medium,
  },
  subtitle: {
    color: 'black',
    textAlign: 'center',
    fontFamily: fonts.primary.reguler,
    paddingHorizontal: 64,
    paddingVertical: 16,
    fontSize: 17,
  },
});

export default CareView;
