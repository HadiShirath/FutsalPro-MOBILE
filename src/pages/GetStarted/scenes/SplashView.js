import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyPressable from '../../../components/MyPressable';
import {SplashIntro} from '../../../assets/';
import {LogoText} from '../../../assets/images';
import {fonts, colors} from '../../../utils';

const SplashView = ({onNextClick, animationController}) => {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const splashTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [0, -window.height, -window.height],
  });

  const introImageData = Image.resolveAssetSource(SplashIntro);

  return (
    <Animated.View
      style={{flex: 1, transform: [{translateY: splashTranslateY}]}}>
      <ScrollView style={{flexGrow: 0}} alwaysBounceVertical={false}>
        <SafeAreaView>
          <View>
            <View style={styles.logoText}>
              <LogoText />
            </View>
            <Image
              style={{
                width: window.width,
                height: undefined,
                aspectRatio: introImageData
                  ? introImageData.width / introImageData.height
                  : 357 / 470,
              }}
              source={SplashIntro}
            />
          </View>
          <Text style={styles.subtitle}>
            Booking Jadwal Futsal {'\n'}
            kini ada di genggamanmu {'\n'}
            cukup klik, beres !
          </Text>
        </SafeAreaView>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: 8 + insets.bottom}]}>
        <View style={styles.buttonContainer}>
          <MyPressable
            style={styles.button}
            android_ripple={{color: 'powderblue'}}
            touchOpacity={0.6}
            onPress={() => onNextClick()}>
            <Text style={styles.buttonText}>Get Started</Text>
          </MyPressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: colors.black,
    textAlign: 'center',
    fontFamily: fonts.primary.reguler,
    paddingHorizontal: 24,
    fontSize: 17,
    // backgroundColor: 'red',
    marginTop: -30,
  },
  logoText: {
    alignItems: 'center',
    marginTop: 50,
  },
  footer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 10,
  },
  buttonContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  button: {
    height: 58,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 100,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: fonts.primary.medium,
    color: colors.white,
  },
});

export default SplashView;
