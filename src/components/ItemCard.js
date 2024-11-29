// src/components/ItemCard.js

import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';

export default function ItemCard({ item, cardWidth, isTrending, onDetailsPress, onRemove, onLike }) {
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
        {isTrending && (
          <TouchableOpacity style={styles.likeButton} onPress={onLike}>
            <MaterialIcons name="favorite" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
        )}
      </View>
      <View style={theme.buttonsContainer}>
        <TouchableOpacity style={theme.detailsButton} onPress={onDetailsPress}>
          <Text style={theme.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <View style={styles.iconButtonsContainer}>
          <TouchableOpacity style={theme.iconButton} onPress={handleShare}>
            <MaterialCommunityIcons name="share-outline" size={20} color="#333" />
          </TouchableOpacity>
          {!isTrending && onRemove && (
            <TouchableOpacity style={theme.iconButton} onPress={onRemove}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
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
    position: 'relative',
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
  iconButtonsContainer: {
    flexDirection: 'row',
  },
});
