import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NextButtonArrow from './components/NextButtonArrow';
import {fonts, colors} from '../../../utils';

const DotIndicator = ({index, selectedIndex}) => {
  const activeIndexRef = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(activeIndexRef.current, {
      toValue: index === selectedIndex ? 1 : 0,
      duration: 480,
      useNativeDriver: false,
    }).start();
  }, [selectedIndex, index]);

  const bgColor = activeIndexRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.grey1, colors.primary],
  });

  return (
    <Animated.View style={[styles.pageIndicator, {backgroundColor: bgColor}]} />
  );
};

const CenterNextButton = ({onNextClick, animationController, navigation}) => {
  const opacity = useRef(new Animated.Value(0));
  const currentOpacity = useRef(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const {bottom} = useSafeAreaInsets();
  const paddingBottom = 16 + bottom;

  const dots = useMemo(() => [0, 1, 2], []);

  useEffect(() => {
    animationController.current.addListener(({value}) => {
      const isVisible = value >= 0.2 && value <= 0.6;
      if (
        (isVisible && currentOpacity.current === 0) ||
        (!isVisible && currentOpacity.current === 1)
      ) {
        Animated.timing(opacity.current, {
          toValue: isVisible ? 1 : 0,
          duration: 480,
          useNativeDriver: true,
        }).start();
        currentOpacity.current = isVisible ? 1 : 0;
      }

      if (value >= 0.7) {
        setSelectedIndex(3);
      } else if (value >= 0.5) {
        setSelectedIndex(2);
      } else if (value >= 0.3) {
        setSelectedIndex(1);
      } else if (value >= 0.1) {
        setSelectedIndex(0);
      }
    });
  }, [animationController]);

  const topViewAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6],
    outputRange: [96 * 5, 0, 0, 0],
  });

  const loginTextMoveAnimation = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6],
    outputRange: [30 * 5, 30 * 5, 30 * 5, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {paddingBottom, transform: [{translateY: topViewAnim}]},
      ]}>
      <Animated.View style={[styles.dotsContainer, {opacity: opacity.current}]}>
        {dots.map(item => (
          <DotIndicator key={item} index={item} selectedIndex={selectedIndex} />
        ))}
      </Animated.View>

      <NextButtonArrow
        animationController={animationController}
        onBtnPress={onNextClick}
      />

      <Animated.View
        style={[
          styles.footerTextContainer,
          {transform: [{translateY: loginTextMoveAnimation}]},
        ]}>
        <Text>Sudah Punya Akun? </Text>
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}>
          Masuk
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 4,
  },
  footerTextContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  loginText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.secondary.bold,
  },
});

export default CenterNextButton;
