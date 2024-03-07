import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import React from 'react';
import CardLapangan from '../../atoms/CardLapangan/index';
import {connect} from 'react-redux';
import {colors} from '../../../utils/colors/index';

function ListLapangan({
  lapangan,
  navigation,
  listFieldsResult,
  listFieldsLoading,
  listRecommendedFieldsResult,
  listRecommendedFieldsLoading,
  recomendedFields,
}) {
  const dataFields = recomendedFields
    ? listRecommendedFieldsResult
    : listFieldsResult;

  const dataFieldsLoading = recomendedFields
    ? listRecommendedFieldsLoading
    : listFieldsLoading;

  return (
    <View style={styles.page}>
      {dataFields ? (
        Object.keys(dataFields).map((key, index) => {
          return (
            <CardLapangan
              lapangan={dataFields[key]}
              idLapangan={key}
              key={index}
              navigation={navigation}
            />
          );
        })
      ) : dataFieldsLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Data Tidak Ditemukan</Text>
        </View>
      )}
    </View>
  );
}

const mapStatetoProps = state => ({
  listFieldsResult: state.FieldReducer.listFieldsResult,
  listFieldsLoading: state.FieldReducer.listFieldsLoading,

  listRecommendedFieldsResult: state.FieldReducer.listRecommendedFieldsResult,
  listRecommendedFieldsLoading: state.FieldReducer.listRecommendedFieldsLoading,
});

export default connect(mapStatetoProps, null)(ListLapangan);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
});
