import React from 'react';
import {StyleSheet, Text, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyPressable from '../../../components/MyPressable';
import {fonts, colors} from '../../../utils/';

const TopBackSkipView = ({onBackClick, onSkipClick, animationController}) => {
  const {top} = useSafeAreaInsets();
  const marginTop = top;

  const headerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [-(58 + (marginTop || 0)), 0, 0, 0, 0],
  });
  const skipAnim = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6],
    outputRange: [0, 0, 0, 80],
  });

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {marginTop, transform: [{translateY: headerTranslateY}]},
      ]}>
      <MyPressable
        style={styles.backBtn}
        android_ripple={{color: 'darkgrey', borderless: true, radius: 28}}
        onPress={() => onBackClick()}>
        <Icon name="arrow-back-ios" size={24} color={colors.black} />
      </MyPressable>

      <Animated.View style={{transform: [{translateX: skipAnim}]}}>
        <MyPressable
          android_ripple={{color: 'darkgrey', borderless: true, radius: 28}}
          onPress={() => onSkipClick()}>
          <Text style={styles.skip}>Skip</Text>
        </MyPressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skip: {
    color: colors.black,
    fontFamily: fonts.primary.reguler,
    fontSize: 17,
  },
});

export default TopBackSkipView;
