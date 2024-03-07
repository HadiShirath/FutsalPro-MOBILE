import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../../utils/colors/index';
import CardSchedule from '../../atoms/CardSchedule/index';
import {dummySchedule} from '../../../data/dummySchedule/index';
import Gap from '../../atoms/Gap/index';

class ListSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'Pagi-Sore',
      result: [],
    };
  }

  componentDidMount() {
    this.dataLapangan();
  }

  componentDidUpdate(prevProps) {
    const {checkPesananResult} = this.props;
    if (
      checkPesananResult &&
      prevProps.checkPesananResult !== checkPesananResult
    ) {
      this.dataLapangan();
    }
  }

  dataLapangan = () => {
    const {checkPesananResult} = this.props;

    const transformedData = Object.keys(checkPesananResult).map(lapangan => ({
      lapangan,
      jadwal: checkPesananResult[lapangan],
    }));

    const result = [
      {
        lapangan: 'vinyl',
        jadwal:
          transformedData.find(item => item.lapangan === 'vinyl')?.jadwal || [],
      },
      {
        lapangan: 'rumput',
        jadwal:
          transformedData.find(item => item.lapangan === 'rumput')?.jadwal ||
          [],
      },
    ];

    this.setState({result: result});
  };

  render() {
    const {checkPesananLoading, tanggal} = this.props;
    const {status, result} = this.state;

    const listTab = ['Pagi-Sore', 'Malam', 'Semua'];

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          {listTab.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.setState({status: item})}
              style={[styles.listTab, status === item && styles.lineTabActive]}>
              <Text style={styles.listTabText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Gap height={30} />

        {result.map((item, index) => {
          return (
            <CardSchedule
              key={index}
              data={item}
              tanggal={tanggal}
              status={status}
              loading={checkPesananLoading}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
  },
  container: {
    flexDirection: 'row',
  },
  listTab: {
    backgroundColor: colors.grey,
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 15,
  },
  listTabText: {
    fontSize: 15,
    color: colors.dark,
  },
  lineTabActive: {
    backgroundColor: colors.orangeSoft,
  },
});

export default ListSchedule;
