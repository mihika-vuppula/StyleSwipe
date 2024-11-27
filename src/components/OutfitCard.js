import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Share } from 'react-native';
import { theme } from '../styles/Theme';
import DetailsModal from './DetailsModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OutfitCard({ outfit, cardWidth }) {
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Destructure with defaults to prevent errors if data is missing
  const { top = {}, bottom = {}, shoes = {} } = outfit;

  const outfitItems = [
    {
      productName: top.productName || null,
      designerName: top.designerName || null,
      productPrice: top.productPrice || null,
      imageUrl: top.imageUrl || null,
      productUrl: top.productUrl || null,
    },
    {
      productName: bottom.productName || null,
      designerName: bottom.designerName || null,
      productPrice: bottom.productPrice || null,
      imageUrl: bottom.imageUrl || null,
      productUrl: bottom.productUrl || null,
    },
    {
      productName: shoes.productName || null,
      designerName: shoes.designerName || null,
      productPrice: shoes.productPrice || null,
      imageUrl: shoes.imageUrl || null,
      productUrl: shoes.productUrl || null,
    },
  ];

  const shareLinks = async () => {
    const links = [
    // Collect the available links
      top.productUrl ? `Top: ${top.productUrl}` : null,
      bottom.productUrl ? `Bottom: ${bottom.productUrl}` : null,
      shoes.productUrl ? `Shoes: ${shoes.productUrl}` : null,
    ].filter(Boolean); // Filter out null/undefined links

    // Combine the links into a single message
    const linksMessage = links.join('\n');

    try {
      await Share.share({
        message: `Check out this outfit:\n\n${linksMessage}`,
      });
    } catch (error) {
      console.error('Error sharing links:', error);
    }
  };

  return (
    <>
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
          <TouchableOpacity
            style={theme.detailsButton}
            onPress={() => setDetailsVisible(true)}
          >
            <Text style={theme.detailsButtonText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme.shareButton} onPress={shareLinks}>
            <MaterialCommunityIcons name="share-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <DetailsModal
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        item={outfitItems}
      />
    </>
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
