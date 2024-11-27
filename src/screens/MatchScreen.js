import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import OutfitCard from '../components/OutfitCard.js';
import ItemCard from '../components/ItemCard.js';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useIsFocused } from '@react-navigation/native';
import DetailsModal from '../components/DetailsModal'; 

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 64) / 2;

export default function MatchScreen({ navigation }) {
    const { userId } = useContext(UserContext);
    const [outfits, setOutfits] = useState([]);
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('items');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFocused = useIsFocused();
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
  
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
        fetchMatches();
      }
    }, [userId, isFocused]);
  
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
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

        // Log the likedItems and likedOutfits to verify the data
        console.log('Liked Items:', likedItems);
        console.log('Liked Outfits:', likedOutfits);
  
        const mappedItems = likedItems.map((item) => ({
          itemId: item.itemId,
          imageUrl: item.imageUrl,
          productName: item.productName,
          designerName: item.designerName,
          productPrice: item.productPrice,
          productUrl: item.productUrl,
        }));
  
        const mappedOutfits = likedOutfits.map((outfit) => ({
          matchId: outfit.matchId,
          top: outfit.top,
          bottom: outfit.bottom,
          shoes: outfit.shoes,
        }));
  
        setItems(mappedItems);
        setOutfits(mappedOutfits);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
  
    const renderOutfit = ({ item }) => (
      <OutfitCard
        outfit={item}
        cardWidth={cardWidth}
      />
    );
  
    const renderItem = ({ item }) => (
        <ItemCard
            item={item}
            cardWidth={cardWidth}
            onDetailsPress={() => openDetails(item)} 
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
      <DetailsModal
        visible={detailsVisible}
        onClose={closeDetails}
        item={selectedItem}
       />
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
  },
  activeTab: {
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
  },
  tabText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.primaryColor,
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
});
