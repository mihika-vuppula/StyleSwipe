// src/components/OutfitCard.js

import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';

export default function OutfitCard({ outfit, cardWidth }) {
  // Destructure with defaults to prevent errors if data is missing
  const { top = {}, bottom = {}, shoes = {} } = outfit;

  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}>
      <View style={styles.outfitContainer}>
        <View style={styles.imagesContainer}>
          <View style={[styles.itemContainer, styles.imageSpacing]}>
            <Image
              source={{ uri: top.imageUrl }}
              style={[styles.image, { width: cardWidth - 2 }]}
            />
          </View>
          <View style={[styles.itemContainer, styles.imageSpacing]}>
            <Image
              source={{ uri: bottom.imageUrl }}
              style={[styles.image, { width: cardWidth - 2 }]}
            />
          </View>
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: shoes.imageUrl }}
              style={[styles.image, { width: cardWidth - 2 }]}
            />
          </View>
        </View>
      </View>

      <View style={theme.buttonsContainer}>
        <TouchableOpacity style={theme.detailsButton}>
          <Text style={theme.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.shareButton}>
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
  outfitContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    padding: 8,
    backgroundColor: '#fff',
  },
  imagesContainer: {
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
  },
  imageSpacing: {
    marginBottom: 8,
  },
  image: {
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
