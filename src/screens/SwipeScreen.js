import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FilterModal from '../components/FilterModal';
import { theme } from '../styles/Theme';
import { useFetchRandomProduct } from '../hooks/useFetchProduct';

const { height } = Dimensions.get('window');

export default function SwipeScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [topsRefresh, setTopsRefresh] = useState(0);
  const [bottomsRefresh, setBottomsRefresh] = useState(0);
  const [shoesRefresh, setShoesRefresh] = useState(0);

  const { product: topsProduct, loading: topsLoading, error: topsError } = useFetchRandomProduct([13317, 13332], topsRefresh);
  const { product: bottomsProduct, loading: bottomsLoading, error: bottomsError } = useFetchRandomProduct([13281, 13297, 13302, 13377], bottomsRefresh);
  const { product: shoesProduct, loading: shoesLoading, error: shoesError } = useFetchRandomProduct([13438], shoesRefresh);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const refreshProduct = (boxNumber) => {
    if (boxNumber === 1) setTopsRefresh((prev) => prev + 1);
    if (boxNumber === 2) setBottomsRefresh((prev) => prev + 1);
    if (boxNumber === 3) setShoesRefresh((prev) => prev + 1);
  };

  const renderProductBox = (product, loading, error, boxNumber) => (
    <View style={styles.boxContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => refreshProduct(boxNumber)}>
        <MaterialIcons name="close" size={24} color={theme.primaryColor} />
      </TouchableOpacity>
      <View style={styles.box}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primaryColor} />
        ) : error ? (
          <Text>Error loading product</Text>  
        ) : (
          product && (
            <Image
              source={{ uri:product.imageUrl1 }}
              style={[
                styles.productImage,
                boxNumber === 1 && styles.topImage,
                boxNumber === 2 && styles.bottomImage,
                boxNumber === 3 && styles.shoeImage
              ]}
            />
          )
        )}
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={() => refreshProduct(boxNumber)}>
        <MaterialIcons name="favorite" size={24} color={theme.primaryColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>For You</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterIconButton}>
          <MaterialIcons name="filter-list" size={24} color={theme.primaryColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.middleContent}>
        {renderProductBox(topsProduct, topsLoading, topsError, 1)} 
        {renderProductBox(bottomsProduct, bottomsLoading, bottomsError, 2)}  
        {renderProductBox(shoesProduct, shoesLoading, shoesError, 3)} 
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Create Outfit</Text>  
      </TouchableOpacity>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        clearFilters={clearFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 40, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', 
    flex: 1, 
  },
  filterIconButton: {
    padding: 6,
    borderWidth: 1, 
    borderColor: theme.secondaryColor, 
    borderRadius: 8, 
  },
  middleContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1, 
    borderColor: theme.primaryColor, 
    borderRadius: 30,
  },
  box: {
    width: '60%',
    height: height / 4,
    backgroundColor: '#EAECEB',  
    borderRadius: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  button: {
    paddingVertical: 15,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  topImage: {
    width: '100%',
    height: '120%', 
    position: 'absolute',
    top: '-10%',
  },
  bottomImage: {
    width: '100%',
    height: '120%', 
    position: 'absolute',
    top: '-5%', 
  },
  shoeImage: {
    width: '100%',
    height: '100%', 
  },
});
