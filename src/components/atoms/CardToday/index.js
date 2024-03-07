import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {IconStar, IconFire} from '../../../assets';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import {valueRating, totalReview} from '../../../utils/numberRating/index';
import {dummySchedule} from '../../../data/dummySchedule/index';
import {percentBar} from '../../../utils/percentBar/index';
import {captionPercentBar} from '../../../utils/captionPercentBar/index';
import Gap from '../Gap/index';
import {LapanganVinyl, LapanganRumput} from '../../../assets';
import {connect} from 'react-redux';
import {checkSchedule} from '../../../actions/PesananAction';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

class CardToday extends Component {
  render() {
    const {lapangan, idLapangan, navigation, dataSchedule} = this.props;
    const dataBaru = {
      ...lapangan,
      idLapangan: idLapangan,
    };

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('Order', dataBaru)}>
        {/* <View
          style={{
            height: '50%',
            width: '100%',
            position: 'absolute',
            backgroundColor: colors.secondary,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        /> */}

        <View style={styles.imageWrapper}>
          <Image source={{uri: lapangan.gambar}} style={styles.image} />
        </View>
        <View style={{paddingHorizontal: 10}}>
          <Text style={styles.title}>Lapangan {lapangan.nama}</Text>
          <Text style={styles.desc}>
            {lapangan.category === 'pagi' ? 'pagi-sore' : 'malam'}
          </Text>
          <View style={styles.review}>
            <IconStar />
            <Text style={styles.reviewText}>
              {valueRating(lapangan.rating)} ({totalReview(lapangan.rating)}{' '}
              Review)
            </Text>
          </View>
          <Gap height={5} />
          <View style={styles.content}>
            <View style={styles.progressBG}>
              <View
                style={[
                  styles.progress,
                  {
                    width: percentBar(dataSchedule, lapangan.category),
                  },
                ]}>
                <View style={styles.fire}>
                  <IconFire />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.availableWrapper}>
            <Text style={styles.available}>
              {captionPercentBar(dataSchedule, lapangan.category)}
            </Text>
            <Text style={styles.available}>
              {percentBar(dataSchedule, lapangan.category)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStatetoProps = state => ({
  checkScheduleLoading: state.PesananReducer.checkScheduleLoading,
});

export default connect(mapStatetoProps, null)(CardToday);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingBottom: 15,
    marginHorizontal: 10,
  },
  image: {
    width: 125,
    height: 65,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressBG: {
    width: '90%',
    height: 4,
    backgroundColor: colors.grey6,
  },
  progress: {
    height: 4,
    backgroundColor: colors.red,
  },
  fire: {
    position: 'absolute',
    marginLeft: '90%',
    marginTop: -7,
  },
  review: {
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 5,
    marginTop: 10,
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  desc: {
    paddingHorizontal: 5,
    fontSize: 13,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
    textTransform: 'capitalize',
  },
  reviewText: {
    marginLeft: 3,
    fontSize: 13,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  available: {
    marginTop: 10,
    paddingHorizontal: 5,
    fontSize: 11,
    fontFamily: fonts.secondary.light,
    color: colors.dark,
  },
  availableWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingVertical: 10,
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    borderRadius: 9,
    margin: 7,
    marginBottom: 4,
  },
});
