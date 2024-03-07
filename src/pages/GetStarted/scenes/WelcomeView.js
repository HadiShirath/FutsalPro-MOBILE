import React, {useRef} from 'react';
import {StyleSheet, Text, Animated, useWindowDimensions} from 'react-native';
import {fonts, colors} from '../../../utils';
import {Splash3} from '../../../assets';

const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 350;

const WelcomeView = ({animationController}) => {
  const window = useWindowDimensions();

  const careRef = useRef(null);

  const slideAnim = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, 0],
  });

  const textEndVal = 26 * 2; // 26 being text's height (font size)
  const welcomeTextAnim = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [textEndVal, textEndVal, 0, 0],
  });

  const imageEndVal = IMAGE_WIDTH * 3;
  const imageAnim = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [imageEndVal, imageEndVal, 0, 0],
  });

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateX: slideAnim}]}]}>
      <Animated.Image
        style={[styles.image, {transform: [{translateX: imageAnim}]}]}
        source={Splash3}
      />
      <Animated.Text
        style={[styles.title, {transform: [{translateX: welcomeTextAnim}]}]}
        ref={careRef}>
        Ayo Mulai 😎
      </Animated.Text>
      <Text style={styles.subtitle}>
        Nikmati kemudahan pesan jadwal futsal disini
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
    maxWidth: 300,
    height: 390,
  },
  title: {
    marginTop: 15,
    color: colors.black,
    fontSize: 25,
    textAlign: 'center',
    fontFamily: fonts.primary.medium,
  },
  subtitle: {
    color: colors.black,
    textAlign: 'center',
    fontFamily: fonts.primary.reguler,
    fontSize: 17,
    paddingHorizontal: 60,
    paddingVertical: 20,
  },
});

export default WelcomeView;
