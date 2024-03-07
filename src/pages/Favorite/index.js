import {Text, StyleSheet, View, SafeAreaView} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import {fonts} from '../../utils/fonts/index';
import ListLapangan from '../../components/molecules/ListLapangan/index';
import {dummyFavorite} from '../../data/dummyFavorite/index';
import {getListFavorite} from '../../actions/FavoriteAction';
import {getData} from '../../utils/localStorage';
import {connect} from 'react-redux';
import ListFavorite from '../../components/molecules/ListFavorite/index';

class Favorite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
    };
  }

  componentDidMount() {
    getData('user').then(res => {
      this.props.dispatch(getListFavorite(res.uid));
      this.setState({uid: res.uid});
    });
  }

  componentDidUpdate(prevProps) {
    const {deleteFavoriteResult} = this.props;
    if (
      deleteFavoriteResult &&
      prevProps.deleteFavoriteResult !== deleteFavoriteResult
    ) {
      this.props.dispatch(getListFavorite(this.state.uid));
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <Header
            title="Favorite"
            type="page"
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.content}>
            <Text style={styles.favorite}>Favorit Saya</Text>
            <ListFavorite
              navigation={this.props.navigation}
              uid={this.state.uid}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  listFavoriteResult: state.FavoriteReducer.listFavoriteResult,
  listFavoriteLoading: state.FavoriteReducer.listFavoriteLoading,

  deleteFavoriteResult: state.FavoriteReducer.deleteFavoriteResult,
  deleteFavoriteLoading: state.FavoriteReducer.deleteFavoriteLoading,
});

export default connect(mapStatetoProps, null)(Favorite);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  favorite: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: fonts.primary.reguler,
    color: colors.grey4,
  },
  content: {
    paddingHorizontal: 20,
  },
});
