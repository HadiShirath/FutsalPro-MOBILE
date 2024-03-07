import React, {useRef} from 'react';
import {StyleSheet, Text, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyPressable from '../../../../components/MyPressable';
import {fonts, colors} from '../../../../utils';

const IconPressable = Animated.createAnimatedComponent(Icon);

/*
 * TODO:- find a better solution for this animation so we don't have to use 'useNativeDriver: false' in 'IntroductionAnimationScreen.tsx' as width doesn't support it yet
 */
const NextButtonArrow = ({onBtnPress, animationController}) => {
  const arrowAnim = useRef(new Animated.Value(0));

  arrowAnim.current = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6],
    outputRange: [0, 0, 0, 1],
  });

  // for transition from arrow to sign up
  const transitionAnim = arrowAnim.current.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [36, 0, 0],
  });
  const opacityAnim = arrowAnim.current.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [0, 0, 1],
  });
  const iconTransitionAnim = arrowAnim.current.interpolate({
    inputRange: [0, 0.85, 1], // or [0, 0.85, 1],
    outputRange: [0, 0, -36], // or [0, 0, -36]
  });
  const iconOpacityAnim = arrowAnim.current.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0, 0],
  });
  // end

  const widthAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [70, 300],
  });

  const marginBottomAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0],
  });

  const radiusAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 20],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: widthAnim,
          borderRadius: radiusAnim,
          marginBottom: marginBottomAnim,
        },
      ]}>
      <MyPressable
        style={{flex: 1, justifyContent: 'center'}}
        android_ripple={{color: 'darkgrey'}}
        onPress={() => onBtnPress()}>
        <Animated.View
          style={[
            styles.signupContainer,
            {
              opacity: opacityAnim,
              transform: [{translateY: transitionAnim}],
            },
          ]}>
          <Text style={styles.signupText}>Daftar</Text>
          <Icon name="chevron-right" size={40} color="white" />
        </Animated.View>

        <IconPressable
          style={[
            styles.icon,
            {
              opacity: iconOpacityAnim,
              transform: [{translateY: iconTransitionAnim}],
            },
          ]}
          name="arrow-forward-ios"
          size={24}
          color="white"
        />
      </MyPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 20,
    fontFamily: fonts.primary.medium,
    color: 'white',
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default NextButtonArrow;
