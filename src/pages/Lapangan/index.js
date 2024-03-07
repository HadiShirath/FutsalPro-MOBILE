import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {IconBack, IconSearch} from '../../assets';
import Gap from '../../components/atoms/Gap/index';

import {dummyCategories} from '../../data/dummyCategories/index';
import ListCategory from '../../components/molecules/ListCategory/index';
import {dummyLapangan} from '../../data/dummyLapangan/index';
import ListLapangan from '../../components/molecules/ListLapangan/index';
import {fonts} from '../../utils/fonts/index';
import {getListFields} from '../../actions/FieldAction';
import {connect} from 'react-redux';
import {saveKeywordField, getFieldsByCategory} from '../../actions/FieldAction';

class Lapangan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };
  }
  componentDidMount() {
    const {category, keyword} = this.props;
    this.props.dispatch(getListFields(category, keyword));
  }

  componentDidUpdate(prevProps) {
    const {category, keyword} = this.props;
    if (category && prevProps.category !== category) {
      this.props.dispatch(getListFields(category, keyword));
    }
    if (keyword && prevProps.keyword !== keyword) {
      this.props.dispatch(getListFields(category, keyword));
    }
  }

  selesaiCari = () => {
    const {search} = this.state;
    const {navigation} = this.props;

    this.setState({
      search: '',
    });
    this.props.dispatch(saveKeywordField(search));
    this.props.dispatch(getFieldsByCategory(''));
    navigation.navigate('Lapangan');
  };

  render() {
    const {search} = this.state;
    const {category, keyword} = this.props;
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  this.props.dispatch(saveKeywordField(''));
                  this.props.dispatch(getFieldsByCategory('semua'));
                  this.props.navigation.navigate('MainApp');
                }}>
                <IconBack />
              </TouchableOpacity>
              <Gap width={15} />
              <View style={styles.searchBarWrapper}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Cari Lapangan"
                  value={search}
                  onChangeText={search => this.setState({search})}
                  onSubmitEditing={this.selesaiCari}
                />
              </View>
            </View>
            <Gap height={30} />
            <ListCategory navigation={this.props.navigation} />
            <Gap height={10} />
            <View style={styles.label}>
              {keyword && keyword !== '' ? (
                <Text style={styles.textLabel}>
                  Pencarian :{' '}
                  <Text style={styles.textLabelBold}>"{keyword}"</Text>
                </Text>
              ) : (
                <Text style={styles.textLabel}>
                  Lapangan Kategori{' '}
                  <Text style={styles.textLabelBold}>
                    {category === 'pagi' ? 'Pagi-Sore' : category}
                  </Text>
                </Text>
              )}
            </View>
            <View style={styles.listLapangan}>
              <ListLapangan navigation={this.props.navigation} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  category: state.FieldReducer.category,
  keyword: state.FieldReducer.keyword,
});

export default connect(mapStatetoProps, null)(Lapangan);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.grey7,
    borderRadius: 18,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },
  searchBar: {
    flex: 1,
    marginLeft: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listLapangan: {
    marginLeft: 15,
  },
  label: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  textLabel: {
    fontSize: 15,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  textLabelBold: {
    fontFamily: fonts.secondary.medium,
  },
});
