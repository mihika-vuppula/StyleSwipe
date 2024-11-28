// src/components/ItemCard.js

import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { theme } from '../styles/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ItemCard({ item, cardWidth, onDetailsPress, onRemove }) {
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
        <TouchableOpacity style={theme.detailsButton} onPress={onDetailsPress}>
          <Text style={theme.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <View style={styles.iconButtonsContainer}>
          <TouchableOpacity style={theme.iconButton} onPress={handleShare}>
            <MaterialCommunityIcons name="share-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={theme.iconButton} onPress={onRemove}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#333" />
          </TouchableOpacity>
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
  },
  image: {
    height: 195,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 8,
    padding: 4,
  },
});
