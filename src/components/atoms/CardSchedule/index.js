import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {ProductVinyl, ProductRumput} from '../../../assets';
import {formatDate} from '../../../utils/formatDate/index';
import {namaBulan} from '../../../utils/namaBulan/index';
import {colors} from '../../../utils/colors/index';
import Gap from '../Gap/index';
import CheckBox from 'react-native-check-box';
import {fonts} from '../../../utils/fonts/index';

class CardSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataWaktuPagi: [
        '08.00-09.00',
        '09.00-10.00',
        '10.00-11.00',
        '11.00-12.00',
        '13.00-14.00',
        '14.00-15.00',
        '15.00-16.00',
        '16.00-17.00',
      ],
      dataWaktuMalam: [
        '19.00-20.00',
        '20.00-21.00',
        '21.00-22.00',
        '22.00-23.00',
        '23.00-23.59',
      ],
      dataJadwal: this.props.data,
      valueDate: this.props.tanggal,
      status: this.props.status,
      selectedFilters: [],
      selectedFiltersUser: [],
    };
  }

  componentDidMount() {
    const {dataJadwal, valueDate} = this.state;

    // Filter jadwal berdasarkan value
    const formattedSchedule = dataJadwal.jadwal
      .map(jadwal => {
        return `${dataJadwal.lapangan}-${valueDate}-${jadwal.waktu}#${jadwal.nama}*${jadwal.photo}`;
      })
      .flat();

    const formattedScheduleJadwal = formattedSchedule.map(
      item => item.split('#')[0],
    );

    this.setState({
      selectedFilters: formattedScheduleJadwal,
      selectedFiltersUser: formattedSchedule,
    });
  }

  componentDidUpdate(prevProps) {
    const {tanggal, data, status} = this.props;
    const {dataJadwal, valueDate} = this.state;

    if (tanggal && prevProps.tanggal !== tanggal) {
      this.setState({valueDate: tanggal});
    }
    if (status && prevProps.status !== status) {
      this.setState({status: status});
    }
    if (data && prevProps.data !== data) {
      const formattedSchedule = data.jadwal
        .map(jadwal => {
          return `${dataJadwal.lapangan}-${valueDate}-${jadwal.waktu}#${jadwal.nama}*${jadwal.photo}`;
        })
        .flat();

      const formattedScheduleJadwal = formattedSchedule.map(
        item => item.split('#')[0],
      );

      this.setState({
        selectedFilters: formattedScheduleJadwal,
        selectedFiltersUser: formattedSchedule,
      });
    }
  }

  checkBox = (itemCheckBox, selectedFilters, item, valueDate) => {
    return itemCheckBox.map((keys, innerIndex) => {
      return (
        <View key={innerIndex} style={styles.checkBox}>
          <CheckBox
            disabled
            isChecked={selectedFilters
              .filter(itemFilter => itemFilter.includes(valueDate))
              .includes(item.lapangan + '-' + valueDate + '-' + keys)}
            onClick={() => {}}
            checkedCheckBoxColor={colors.primary}
            checkBoxColor={
              selectedFilters.includes(
                item.lapangan + '-' + valueDate + '-' + keys,
              )
                ? colors.primary
                : colors.grey6
            }
          />
          <Text style={styles.textCheckBox}>
            {keys.split('-')[0] + ' - ' + keys.split('-')[1]}
          </Text>
          {selectedFilters.includes(
            item.lapangan + '-' + valueDate + '-' + keys,
          ) ? (
            <View style={styles.contentUser}>
              <Image
                source={this.state.selectedFiltersUser
                  .filter(items =>
                    items.includes(
                      item.lapangan + '-' + valueDate + '-' + keys,
                    ),
                  )
                  .map(items => ({
                    uri:
                      'data:image/jpeg;base64,' +
                      items.split('#')[1].split('*')[1],
                  }))}
                style={styles.images}
              />

              <Text style={styles.textCheckBox}>
                {this.state.selectedFiltersUser.map(items =>
                  items.includes(item.lapangan + '-' + valueDate + '-' + keys)
                    ? items.split('#')[1].split('*')[0]
                    : [],
                )}
              </Text>
            </View>
          ) : (
            <Text style={styles.textCheckBoxKosong}>--</Text>
          )}
        </View>
      );
    });
  };

  renderCheckboxes = item => {
    const {selectedFilters, dataWaktuPagi, dataWaktuMalam, valueDate, status} =
      this.state;

    const dataWaktuSemuanya = dataWaktuPagi.concat(dataWaktuMalam);

    return (
      <View>
        {status === 'Pagi-Sore'
          ? this.checkBox(dataWaktuPagi, selectedFilters, item, valueDate)
          : status === 'Malam'
          ? this.checkBox(dataWaktuMalam, selectedFilters, item, valueDate)
          : this.checkBox(dataWaktuSemuanya, selectedFilters, item, valueDate)}
      </View>
    );
  };

  render() {
    const {status, valueDate, dataJadwal} = this.state;
    const {loading} = this.props;

    return (
      <View style={styles.content}>
        <View style={styles.leftWrapper}>
          <Image
            source={
              dataJadwal.lapangan === 'vinyl' ? ProductVinyl : ProductRumput
            }
            style={styles.image}
          />
          <Gap height={10} />
          <Text style={styles.hari}>{formatDate(valueDate).split(',')[0]}</Text>
          <Text style={styles.tanggal}>{valueDate.split('-')[2]}</Text>
          <Text style={styles.bulan}>{namaBulan(valueDate.split('-')[1])}</Text>
        </View>

        <View style={styles.rightWrapper}>
          <View style={styles.rightWrapperContent}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.lapangan}>
                Lapangan {dataJadwal.lapangan}
              </Text>
              {loading && (
                <ActivityIndicator size={25} color={colors.primary} />
              )}
            </View>
            <View style={styles.wrapperCheckBox}>
              <Text style={styles.status}>
                {status === 'Pagi-Sore'
                  ? 'Pagi-Sore'
                  : status === 'Malam'
                  ? 'Malam'
                  : 'Semua'}
              </Text>
              {this.renderCheckboxes(dataJadwal)}
            </View>
          </View>
          <Gap height={30} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
  },
  contentUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftWrapper: {
    alignItems: 'center',
    marginRight: 10,
  },
  rightWrapper: {
    flex: 1,
  },
  rightWrapperContent: {
    borderLeftWidth: 1.5,
    borderColor: colors.grey6,
    paddingLeft: 10,
  },
  image: {
    height: 60,
    width: 80,
  },
  line: {
    backgroundColor: colors.grey3,
    width: 2,
    height: '100%',
  },
  hari: {
    fontSize: 20,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  tanggal: {
    fontSize: 42,
    fontFamily: fonts.secondary.bold,
    color: colors.red,
  },
  bulan: {
    marginTop: -5,
    fontSize: 23,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  lapangan: {
    fontSize: 22,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  wrapperCheckBox: {
    backgroundColor: colors.grey7,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 25 / 2,
  },
  status: {
    fontSize: 17,
    fontFamily: fonts.secondary.medium,
    color: colors.grey5,
    marginBottom: 10,
  },
  checkBox: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  textCheckBox: {
    marginLeft: 10,
    color: colors.dark,
    fontSize: 14,
    fontFamily: fonts.secondary.reguler,
    textTransform: 'capitalize',
  },
  textCheckBoxKosong: {
    marginLeft: 10,
    color: colors.red,
    fontSize: 14,
    fontFamily: fonts.secondary.reguler,
  },
  images: {
    marginLeft: 10,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
  },
});

export default CardSchedule;
