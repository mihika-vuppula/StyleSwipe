import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';

export default function ItemCard({ item, cardWidth, isTrending }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shop this item: ${item.productUrl}`,
      });
    } catch (error) {
      console.error('Error sharing the URL:', error.message);
    }
  };

  const handleLike = () => {
    // Add your like handling logic here
    console.log('Liked item:', item.itemId);
  };

  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.image, { width: cardWidth - 2 }]}
        />
        {isTrending && (
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <MaterialIcons name="favorite" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
        )}
      </View>
      <View style={theme.buttonsContainer}>
        <TouchableOpacity style={theme.detailsButton}>
          <Text style={theme.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.shareButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    margin: 8,
  },
  imageContainer: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative', // Added to position the like button
  },
  image: {
    height: 195,
    resizeMode: 'cover',
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsContainer: {
    paddingTop: 8,
    alignItems: 'center',
  },
  designerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    color: theme.primaryColor,
    fontWeight: 'bold',
  },
});