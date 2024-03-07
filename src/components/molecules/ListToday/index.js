import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import CardToday from '../../atoms/CardToday/index';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import Gap from '../../atoms/Gap/index';
import {WaveBlue, WaveBlue2} from '../../../assets';
import {connect} from 'react-redux';
import {checkSchedule, updatePesanan} from '../../../actions/PesananAction';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

class ListToday extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date().toLocaleDateString('en-CA'),
      dataSchedule: [],
    };
  }

  componentDidMount() {
    const {date} = this.state;
    this.props.dispatch(checkSchedule(date));
  }

  componentDidUpdate(prevProps) {
    const {date} = this.state;
    const {checkScheduleResult, updatePesananResult} = this.props;

    if (
      checkScheduleResult &&
      prevProps.checkScheduleResult !== checkScheduleResult
    ) {
      this.setState({
        dataSchedule: checkScheduleResult,
      });
    }
    if (
      updatePesananResult &&
      prevProps.updatePesananResult !== updatePesananResult
    ) {
      this.props.dispatch(checkSchedule(date));
    }
  }

  pageLoader = () => {
    const views = [];

    for (let i = 0; i < 4; i++) {
      views.push(
        <View key={i}>
          <SkeletonPlaceholder borderRadius={15} backgroundColor={colors.grey8}>
            <View style={styles.loaderPage} />
          </SkeletonPlaceholder>
        </View>,
      );
    }

    return views;
  };

  render() {
    const {date, dataSchedule} = this.state;
    const {
      navigation,
      listFieldsLoading,
      listFieldsResult,
      checkScheduleResult,
    } = this.props;

    return (
      <View style={styles.page}>
        <View style={styles.wave}>
          <WaveBlue />
        </View>
        <View style={styles.wave2}>
          <WaveBlue2 />
        </View>
        <ScrollView
          horizontal
          style={styles.content}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.wrapperJadwal}>
            <View style={styles.jadwalTersedia}>
              <Text style={styles.jadwalText}>Jadwal Tersedia</Text>
            </View>
            <View style={styles.pantauWrapper}>
              <Text style={styles.pantauTextSatu}>Pantau</Text>
              <Text style={styles.pantauTextDua}>Jadwal</Text>
              <Text style={styles.pantauTextTiga}>Hari ini</Text>
            </View>
            <View style={styles.dateWrapper}>
              <Text style={styles.tanggal}>{`${date.split('-')[2]}-${
                date.split('-')[1]
              }-${date.split('-')[0]}`}</Text>
              <View style={styles.lineTanggal} />
            </View>
          </View>

          <Gap width={30} />

          {listFieldsResult ? (
            Object.keys(listFieldsResult).map((key, index) => {
              return (
                <CardToday
                  key={index}
                  lapangan={listFieldsResult[key]}
                  idLapangan={key}
                  navigation={navigation}
                  date={date}
                  dataSchedule={
                    dataSchedule[listFieldsResult[key].nama]
                      ? dataSchedule[listFieldsResult[key].nama]
                      : []
                  }
                />
              );
            })
          ) : listFieldsLoading ? (
            <View style={styles.loading}>{this.pageLoader()}</View>
          ) : (
            []
          )}

          <Gap width={30} />
        </ScrollView>
      </View>
    );
  }
}

const mapStatetoProps = state => ({
  listFieldsResult: state.FieldReducer.listFieldsResult,
  listFieldsLoading: state.FieldReducer.listFieldsLoading,

  checkScheduleResult: state.PesananReducer.checkScheduleResult,
  checkScheduleLoading: state.PesananReducer.checkScheduleLoading,

  updatePesananResult: state.PesananReducer.updatePesananResult,
  updatePesananLoading: state.PesananReducer.updatePesananLoading,
});

export default connect(mapStatetoProps, null)(ListToday);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  content: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  wrapperJadwal: {
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  jadwalTersedia: {
    backgroundColor: colors.red,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  jadwalText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.secondary.medium,
  },
  pantauWrapper: {
    paddingLeft: 10,
  },
  pantauTextSatu: {
    fontSize: 28,
    fontFamily: fonts.secondary.medium,
    color: colors.orangeSoft,
  },
  pantauTextDua: {
    marginTop: -7,
    fontSize: 28,
    maxWidth: 100,
    fontFamily: fonts.secondary.medium,
    color: colors.white,
  },
  pantauTextTiga: {
    marginTop: -4,
    fontSize: 23,
    fontFamily: fonts.secondary.medium,
    color: colors.white,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  wave2: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  dateWrapper: {
    paddingLeft: 10,
  },
  tanggal: {
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.white,
  },
  lineTanggal: {
    marginTop: 6,
    height: 2,
    width: '80%',
    backgroundColor: colors.white,
  },
  loading: {
    marginLeft: 10,
    flexDirection: 'row',
  },
  loaderPage: {
    width: 155,
    height: 220,
    marginRight: 20,
  },
});
