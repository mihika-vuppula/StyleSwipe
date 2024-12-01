// src/screens/MatchScreen.js

import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import OutfitCard from '../components/OutfitCard.js';
import ItemCard from '../components/ItemCard.js';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useIsFocused } from '@react-navigation/native';
import DetailsModal from '../components/DetailsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 64) / 2;

export default function MatchScreen({ navigation }) {
  const { userId } = useContext(UserContext);
  const [outfits, setOutfits] = useState([]);
  const [items, setItems] = useState([]);
  const [trending, setTrending] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // State for Popup Notification
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const REMOVED_ITEMS_KEY = `removed_items_${userId}`;
  const REMOVED_OUTFITS_KEY = `removed_outfits_${userId}`;

  const openDetails = (item) => {
    setSelectedItem(item);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setDetailsVisible(false);
  };

  useEffect(() => {
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      setLoading(false);
      return;
    }

    if (isFocused) {
      if (activeTab === 'trending') {
        fetchTrending();
      } else {
        fetchMatches();
      }
    }
  }, [userId, isFocused, activeTab]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const [removedItemIds, removedOutfitIds] = await Promise.all([
        AsyncStorage.getItem(REMOVED_ITEMS_KEY),
        AsyncStorage.getItem(REMOVED_OUTFITS_KEY),
      ]);

      const removedItemsSet = new Set(JSON.parse(removedItemIds) || []);
      const removedOutfitsSet = new Set(JSON.parse(removedOutfitIds) || []);

      const response = await axios.get(
        `https://2ox7hybif2.execute-api.us-east-1.amazonaws.com/dev/getLikedItems/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      let responseData = response.data;

      if (responseData.body) {
        let bodyData = responseData.body;

        if (typeof bodyData === 'string') {
          bodyData = JSON.parse(bodyData);
        }

        responseData = bodyData;
      } else {
        throw new Error('Invalid response data: missing body');
      }

      const { likedItems = [], likedOutfits = [] } = responseData;

      const mappedItems = likedItems
        .filter((item) => !removedItemsSet.has(item.itemId))
        .map((item) => ({
          itemId: item.itemId,
          imageUrl: item.imageUrl,
          productName: item.productName,
          designerName: item.designerName,
          productPrice: item.productPrice,
          productUrl: item.productUrl,
        }));

      const mappedOutfits = likedOutfits
        .filter((outfit) => !removedOutfitsSet.has(outfit.matchId))
        .map((outfit) => ({
          matchId: outfit.matchId,
          top: outfit.top,
          bottom: outfit.bottom,
          shoes: outfit.shoes,
        }));

      setItems(mappedItems);
      setOutfits(mappedOutfits);
    } catch (err) {
      console.error('Error fetching matches:', err);

      if (err.response) {
        setError(
          `Server Error: ${err.response.status} - ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://mec9qba05g.execute-api.us-east-1.amazonaws.com/dev/trending',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      let responseBody = response.data.body;
      if (typeof responseBody === 'string') {
        responseBody = JSON.parse(responseBody);
      }

      const trendingItems = responseBody.trending.map((item) => ({
        itemId: item.itemId,
        imageUrl: item.imageUrl,
        productName: item.productName,
        designerName: item.designerName,
        productPrice: item.productPrice,
        productUrl: item.productUrl,
        count: item.count,
      }));

      setTrending(trendingItems);
    } catch (err) {
      console.error('Error fetching trending data:', err);
      setError('Failed to fetch trending items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to show popup notification
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

  const handleLikeItem = async (product) => {
    if (!product || !product.itemId) {
      console.error('Product is missing or invalid:', product);
      return;
    }

    try {
      // Send a POST request to the /trending endpoint to like the item
      const response = await axios.post(
        'https://mec9qba05g.execute-api.us-east-1.amazonaws.com/dev/trending',
        {
          action: 'like',
          userId: userId,
          itemId: product.itemId,
          itemType: 'item', // Ensure itemType is included
          imageUrl: product.imageUrl,
          productName: product.productName,
          designerName: product.designerName,
          productPrice: product.productPrice,
          productUrl: product.productUrl, // Ensure productUrl is included
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Like API Response:', response.data);
      // Show success popup
      showPopup('Item added to Your Fits!');
    } catch (error) {
      console.error('Error liking item:', error.response || error.message);
      // Show error popup
      showPopup('Error adding item to Your Fits');
    }
  };

  // Function to remove an item from the 'items' state and store its ID
  const removeItem = async (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));

    try {
      const storedRemovedItems = await AsyncStorage.getItem(REMOVED_ITEMS_KEY);
      const removedItems = storedRemovedItems ? JSON.parse(storedRemovedItems) : [];
      removedItems.push(itemId);
      await AsyncStorage.setItem(REMOVED_ITEMS_KEY, JSON.stringify(removedItems));
    } catch (error) {
      console.error('Error storing removed item ID:', error);
    }
  };

  // Function to remove an outfit from the 'outfits' state and store its ID
  const removeOutfit = async (matchId) => {
    setOutfits((prevOutfits) => prevOutfits.filter((outfit) => outfit.matchId !== matchId));

    try {
      const storedRemovedOutfits = await AsyncStorage.getItem(REMOVED_OUTFITS_KEY);
      const removedOutfits = storedRemovedOutfits ? JSON.parse(storedRemovedOutfits) : [];
      removedOutfits.push(matchId);
      await AsyncStorage.setItem(REMOVED_OUTFITS_KEY, JSON.stringify(removedOutfits));
    } catch (error) {
      console.error('Error storing removed outfit ID:', error);
    }
  };

  const renderOutfit = ({ item }) => {
    if (!item || !item.top || !item.bottom || !item.shoes) {
      return null;
    }
    return (
      <OutfitCard
        outfit={item}
        cardWidth={cardWidth}
        onRemove={() => removeOutfit(item.matchId)}
      />
    );
  };

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      cardWidth={cardWidth}
      onDetailsPress={() => openDetails(item)}
      onRemove={() => removeItem(item.itemId)}
    />
  );

  const renderTrendingItem = ({ item }) => (
    <ItemCard
      item={item}
      cardWidth={cardWidth}
      isTrending={true}
      onLike={() => handleLikeItem(item)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={theme.container}>
        <View style={theme.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Swipe')}
            style={[theme.topButton, styles.backButton]}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
          <Text style={theme.title}>Your Fits</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={theme.container}>
        <View style={theme.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Swipe')}
            style={[theme.topButton, styles.backButton]}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
          <Text style={theme.title}>Your Fits</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={theme.container}>
      <View style={theme.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Swipe')}
          style={[theme.topButton, styles.backButton]}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color={theme.primaryColor} />
        </TouchableOpacity>
        <Text style={theme.title}>Your Fits</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeText]}>Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'outfits' && styles.activeTab]}
          onPress={() => setActiveTab('outfits')}
        >
          <Text style={[styles.tabText, activeTab === 'outfits' && styles.activeText]}>
            Outfits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'trending' && styles.activeTab]}
          onPress={() => {
            setActiveTab('trending');
            fetchTrending();
          }}
        >
          <MaterialCommunityIcons
            name="fire"
            size={16}
            color={activeTab === 'trending' ? '#fff' : theme.primaryColor}
          />
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeText]}>
            Trending
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'outfits' ? (
        outfits.length > 0 ? (
          <FlatList
            data={outfits}
            renderItem={renderOutfit}
            keyExtractor={(item) => item.matchId || Math.random().toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No outfits saved yet.</Text>
          </View>
        )
      ) : activeTab === 'trending' ? (
        trending.length > 0 ? (
          <FlatList
            data={trending}
            renderItem={renderTrendingItem}
            keyExtractor={(item) => item.itemId.toString()}
            key={activeTab}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No trending items yet.</Text>
          </View>
        )
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.itemId.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>You have not liked any items yet.</Text>
        </View>
      )}
      <DetailsModal visible={detailsVisible} onClose={closeDetails} item={selectedItem} />
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
  backButton: {
    paddingLeft: 12,
    paddingRight: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
  },
  tabText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.primaryColor,
    marginLeft: 4,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  flatListContainer: {
    alignSelf: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: theme.secondaryColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Styles for Popup Notification
  popup: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '10%',
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
