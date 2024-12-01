import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FilterModal from '../components/FilterModal';
import { theme } from '../styles/Theme';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const { height } = Dimensions.get('window');

export default function SwipeScreen() {
  const [popupVisible, setPopupVisible] = useState(false);
  const { userId } = useContext(UserContext);
  const [popupMessage, setPopupMessage] = useState('');

  // State for current and next products
  const [currentTopsProduct, setCurrentTopsProduct] = useState(null);
  const [nextTopsProduct, setNextTopsProduct] = useState(null);
  const [currentBottomsProduct, setCurrentBottomsProduct] = useState(null);
  const [nextBottomsProduct, setNextBottomsProduct] = useState(null);
  const [currentShoesProduct, setCurrentShoesProduct] = useState(null);
  const [nextShoesProduct, setNextShoesProduct] = useState(null);

  // Loading states
  const [topsLoading, setTopsLoading] = useState(true);
  const [bottomsLoading, setBottomsLoading] = useState(true);
  const [shoesLoading, setShoesLoading] = useState(true);

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const categoryMapping = {
    tops: {
      "Sweaters & Knits": 13317,
      Tops: 13332,
    },
    bottoms: {
      Jeans: 13377,
      Pants: 13281,
      Shorts: 13297,
      Skirts: 13302,
    },
    footwear: {
      Boots: 13460,
      Flats: 13455,
      Pumps: 13449,
      "Rain & Winter Boots": 13490,
      Sandals: 13441,
      "Sneakers & Athletic": 13439,
    },
  };

  const whatsNewMapping = {
    tops: {
      "Sweaters & Knits": 13244,
      Tops: 13252,
    },
    bottoms: {
      Jeans: 13255,
      Pants: 13247,
      Shorts: 13245,
      Skirts: 13246,
    },
    footwear: {
      Boots: 13205,
      Flats: 13204,
      Pumps: 13203,
      "Rain Boots": 28966,
      Sandals: 13202,
      Sneakers: 13200,
    },
  };

  const [filterVisible, setFilterVisible] = useState(false);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedTops, setSelectedTops] = useState([]);
  const [selectedBottoms, setSelectedBottoms] = useState([]);
  const [selectedFootwears, setSelectedFootwears] = useState([]);
  const [isNew, setIsNew] = useState(false);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedTops([]);
    setSelectedBottoms([]);
    setSelectedFootwears([]);
    setIsNew(false);
  };
  
  const getMappedCategories = (selectedItems, categoryType) => {
    const mapping = isNew ? whatsNewMapping[categoryType] : categoryMapping[categoryType];
    const mappedCategories = Array.isArray(selectedItems) && selectedItems.length > 0
      ? selectedItems.map((item) => mapping[item])
      : Object.values(mapping);
    return mappedCategories;
  };
  
  const topsCategories = getMappedCategories(selectedTops, 'tops');
  const bottomsCategories = getMappedCategories(selectedBottoms, 'bottoms');
  const footwearCategories = getMappedCategories(selectedFootwears, 'footwear');

  const {
    product: topsProduct,
    loading: topsLoading,
    error: topsError,
  } = useFetchRandomProduct(topsCategories, topsRefresh, minPrice, maxPrice);
  
  const {
    product: bottomsProduct,
    loading: bottomsLoading,
    error: bottomsError,
  } = useFetchRandomProduct(bottomsCategories, bottomsRefresh, minPrice, maxPrice);
  
  const {
    product: shoesProduct,
    loading: shoesLoading,
    error: shoesError,
  } = useFetchRandomProduct(footwearCategories, shoesRefresh, minPrice, maxPrice);
  

  const refreshProduct = (boxNumber) => {
    if (boxNumber === 1) setTopsRefresh((prev) => prev + 1);
    if (boxNumber === 2) setBottomsRefresh((prev) => prev + 1);
    if (boxNumber === 3) setShoesRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    setTopsRefresh((prev) => prev + 1);
  }, [selectedTops]);

  useEffect(() => {
    setBottomsRefresh((prev) => prev + 1);
  }, [selectedBottoms]);

  useEffect(() => {
    setShoesRefresh((prev) => prev + 1);
  }, [selectedFootwears]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    slideAnim.setValue(Dimensions.get('window').width);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setPopupVisible(false);
    }, 1000);
  };

  const handleHeartPress = (boxNumber) => {
    let product;
    let itemType;

    if (boxNumber === 1) {
      product = currentTopsProduct;
      itemType = 'top';
    } else if (boxNumber === 2) {
      product = currentBottomsProduct;
      itemType = 'bottom';
    } else if (boxNumber === 3) {
      product = currentShoesProduct;
      itemType = 'shoes';
    }

    if (!product || !product.itemId) {
      console.error('Product is missing or invalid:', product);
      showPopup('Error: No product to like');
      return;
    }

    // Show success popup immediately
    showPopup('YAY! Item Added To Your Fits');

    // Refresh the product
    refreshProduct(boxNumber);

    // Make the API call in the background
    axios
      .post(
        'https://2ox7hybif2.execute-api.us-east-1.amazonaws.com/dev/like-item',
        {
          userId: userId,
          itemId: product.itemId,
          itemType: itemType,
          imageUrl: product.imageUrl1,
          productName: product.productName,
          designerName: product.designerName,
          productPrice: product.productPrice,
          productUrl: product.productUrl,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .then((response) => {
        // Optionally handle success
      })
      .catch((error) => {
        console.error('Error liking item:', error.response || error.message);
        // Optionally show an error popup
      });
  };

  const handleCreateOutfitPress = () => {
    if (!currentTopsProduct || !currentBottomsProduct || !currentShoesProduct) {
      showPopup('Please make sure all items are loaded');
      return;
    }
  
    try {
      const outfitData = {
        userId: userId,
        top: {
          itemId: topsProduct.itemId,
          itemType: 'top',
          imageUrl: topsProduct.imageUrl1,
          productName: topsProduct.productName,
          designerName: topsProduct.designerName,
          productPrice: topsProduct.productPrice,
          productUrl: topsProduct.productUrl
        },
        bottom: {
          itemId: bottomsProduct.itemId,
          itemType: 'bottom',
          imageUrl: bottomsProduct.imageUrl1,
          productName: bottomsProduct.productName,
          designerName: bottomsProduct.designerName,
          productPrice: bottomsProduct.productPrice,
          productUrl: bottomsProduct.productUrl
        },
        shoes: {
          itemId: shoesProduct.itemId,
          itemType: 'shoes',
          imageUrl: shoesProduct.imageUrl1,
          productName: shoesProduct.productName,
          designerName: shoesProduct.designerName,
          productPrice: shoesProduct.productPrice,
          productUrl: shoesProduct.productUrl

        },
      };

      console.log('Sending request to create outfit:', outfitData);

      const response = await axios.post(
        'https://2ox7hybif2.execute-api.us-east-1.amazonaws.com/dev/create-fit',
        outfitData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Create Outfit API Response:', response.data);
      showPopup('YAY! Outfit Added To Your Fits');
    } catch (error) {
      console.error('Error creating outfit:', error.response || error.message);
      showPopup('Error adding outfit to your fits');
    }
  };

  const renderProductBox = (product, loading, error, boxNumber) => (
    <View style={styles.boxContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => refreshProduct(boxNumber)}>
        <MaterialIcons name="close" size={24} color={theme.primaryColor} />
      </TouchableOpacity>
      <View style={styles.box}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primaryColor} />
        ) : (
          product && (
            <View style={styles.productContainer}>
              <Image source={{ uri: product.imageUrl1 }} style={styles.productImage} />
              <View style={styles.overlay}>
                <View style={styles.row}>
                  <Text style={styles.designerName}>{product.designerName}</Text>
                  <Text style={styles.productPrice}>{product.productPrice}</Text>
                </View>
                <Text style={styles.productName}>{product.productName}</Text>
              </View>
            </View>
          )
        )}
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={() => handleHeartPress(boxNumber)}>
        <MaterialIcons name="favorite" size={24} color={theme.primaryColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.title}>For You</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={theme.topButton}>
          <MaterialIcons name="filter-list" size={24} color={theme.primaryColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.middleContent}>
        {renderProductBox(currentTopsProduct, topsLoading, 1)}
        {renderProductBox(currentBottomsProduct, bottomsLoading, 2)}
        {renderProductBox(currentShoesProduct, shoesLoading, 3)}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateOutfitPress}>
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
        selectedTops={selectedTops}
        setSelectedTops={setSelectedTops}
        selectedBottoms={selectedBottoms}
        setSelectedBottoms={setSelectedBottoms}
        selectedFootwears={selectedFootwears}
        setSelectedFootwears={setSelectedFootwears}
        isNew={isNew}
        setIsNew={setIsNew}
      />
      {popupVisible && (
        <Animated.View style={[styles.popup, { transform: [{ translateX: slideAnim }] }]}>
          <MaterialIcons name="favorite" size={24} color={theme.primaryColor} />
          <Text style={styles.popupText}>{popupMessage}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  middleContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 20,
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
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.primaryColor,
  },
  box: {
    width: '65%',
    height: height / 4.5,
    backgroundColor: '#EAECEB',
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  designerName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productName: {
    color: '#FFF',
    fontSize: 12,
  },
  productPrice: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 40,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  popup: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.primaryColor,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
});
