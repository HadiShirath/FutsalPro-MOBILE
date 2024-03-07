import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import SplashView from './scenes/SplashView';
import RelaxView from './scenes/RelaxView';
import CareView from './scenes/CareView';
import WelcomeView from './scenes/WelcomeView';
import TopBackSkipView from './scenes/TopBackSkipView';
import CenterNextButton from './scenes/CenterNextButton';

const GetStarted = () => {
  const navigation = useNavigation();
  const window = useWindowDimensions();

  const [currentPage, setCurrentPage] = useState(0);

  const animationController = useRef(new Animated.Value(0));
  const animValue = useRef(0);

  useEffect(() => {
    animationController.current.addListener(({value}) => {
      animValue.current = value;
      setCurrentPage(value);
    });
  }, []);

  const relaxTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  const playAnimation = useCallback((toValue, duration = 1200) => {
    Animated.timing(animationController.current, {
      toValue,
      duration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      useNativeDriver: false,
    }).start();
  }, []);

  const onNextClick = useCallback(() => {
    let toValue;
    if (animValue.current === 0) {
      toValue = 0.2;
    } else if (animValue.current >= 0 && animValue.current <= 0.2) {
      toValue = 0.4;
    } else if (animValue.current > 0.2 && animValue.current <= 0.4) {
      toValue = 0.6;
    } else if (animValue.current > 0.2 && animValue.current <= 0.6) {
      navigation.navigate('Register1');
    }

    toValue !== undefined && playAnimation(toValue);
  }, [playAnimation, navigation]);

  const onBackClick = useCallback(() => {
    let toValue;
    if (animValue.current >= 0.2 && animValue.current < 0.4) {
      toValue = 0.0;
    } else if (animValue.current >= 0.4 && animValue.current < 0.6) {
      toValue = 0.2;
    } else if (animValue.current >= 0.6 && animValue.current < 0.8) {
      toValue = 0.4;
    } else if (animValue.current === 0.8) {
      toValue = 0.6;
    }

    toValue !== undefined && playAnimation(toValue);
  }, [playAnimation]);

  const onSkipClick = useCallback(() => {
    playAnimation(0.6, 1200);
  }, [playAnimation]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <SplashView
        onNextClick={onNextClick}
        animationController={animationController}
      />

      <Animated.View
        style={[
          styles.scenesContainer,
          {transform: [{translateY: relaxTranslateY}]},
        ]}>
        <RelaxView animationController={animationController} />

        <CareView animationController={animationController} />

        <WelcomeView animationController={animationController} />
      </Animated.View>

      <TopBackSkipView
        onBackClick={onBackClick}
        onSkipClick={onSkipClick}
        animationController={animationController}
      />

      <CenterNextButton
        onNextClick={onNextClick}
        animationController={animationController}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scenesContainer: {
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});

export default GetStarted;
