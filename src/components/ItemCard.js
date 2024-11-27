import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { theme } from '../styles/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ItemCard({ item, cardWidth }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shop this item: ${item.productUrl}`,
      });
    } catch (error) {
      console.error('Error sharing the URL:', error.message);
    }
  };

  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.image, { width: cardWidth - 2 }]}
        />
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
  },
  image: {
    height: 195,
    resizeMode: 'cover',
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
