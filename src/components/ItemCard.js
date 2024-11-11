// ItemCard.js
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';

export default function ItemCard({ item, cardWidth }) {
    return (
        <View style={[styles.cardContainer, { width: cardWidth }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={[styles.image, { width: cardWidth - 2 }]} />
                <View style={styles.overlay}>
                    <Text style={styles.designerName}>{item.designerName}</Text>
                    <Text style={styles.productName}>{item.productName}</Text>
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
    imageContainer: {
        borderRadius: 10,
        borderWidth: 1,
        overflow: 'hidden',
    },
    image: {
        height: 195,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    designerName: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    productName: {
        color: '#FFF',
        fontSize: 10,
    },
});

