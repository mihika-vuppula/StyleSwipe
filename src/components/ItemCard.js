import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/Theme';

export default function ItemCard({ item, cardWidth, onDetailsPress }) {
    return (
        <View style={[styles.cardContainer, { width: cardWidth }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={[styles.image, { width: cardWidth - 2 }]} />
            </View>
            <View style={theme.buttonsContainer}>
                <TouchableOpacity style={theme.detailsButton} onPress={onDetailsPress}>
                    <Text style={theme.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={theme.detailsButton}>
                    <Text style={theme.detailsButtonText}>Remove</Text>
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
});
