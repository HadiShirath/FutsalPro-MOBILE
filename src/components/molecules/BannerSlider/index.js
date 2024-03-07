import {StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import {BannerSlider1, BannerSlider2, BannerSlider3} from '../../../assets';
import {SliderBox} from 'react-native-image-slider-box';
import {colors} from '../../../utils/colors/index';

export default class BannerSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [BannerSlider1, BannerSlider2, BannerSlider3],
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <SliderBox
          images={this.state.images}
          autoplay
          circleLoop
          sliderBoxHeight={116}
          ImageComponentStyle={styles.slider}
          dotStyle={styles.dotStyle}
          dotColor={colors.primary}
          inactiveDotColor={colors.grey1}
          activeOpacity={1}
          paginationBoxStyle={styles.indicator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    borderRadius: 15,
    width: '90%',
    marginTop: 5,
  },
  dotStyle: {
    width: 20,
    height: 3,
    borderRadius: 5,
  },
  indicator: {
    position: 'absolute',
    marginBottom: -25,
    paddingVertical: 10,
  },
});
