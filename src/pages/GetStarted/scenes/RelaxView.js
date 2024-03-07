import React, {useRef} from 'react';
import {StyleSheet, Animated, useWindowDimensions} from 'react-native';
import {fonts} from '../../../utils/fonts/index';
import {Splash1} from '../../../assets';

const RelaxView = ({animationController}) => {
  const window = useWindowDimensions();

  const relaxRef = useRef(null);

  const relaxAnimation = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [-(26 * 2), 0, 0],
  });
  const textAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -window.width * 2, 0, 0],
  });
  const imageAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -390 * 4, 0, 0],
  });
  const slideAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.8],
    outputRange: [0, 0, -window.width, -window.width],
  });

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateX: slideAnim}]}]}>
      <Animated.Image
        style={[styles.image, {transform: [{translateX: imageAnim}]}]}
        source={Splash1}
      />
      <Animated.Text
        style={[styles.title, {transform: [{translateY: relaxAnimation}]}]}
        ref={relaxRef}>
        Enjoy The Moment ☀️
      </Animated.Text>
      <Animated.Text
        style={[styles.subtitle, {transform: [{translateX: textAnim}]}]}>
        Pesan jadwalmu dan buat pengingat jadwalnya
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    marginTop: 30,
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
    fontSize: 17,
  },
  image: {
    width: 330,
    height: 335,
  },
});

export default RelaxView;
