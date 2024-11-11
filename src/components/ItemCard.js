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
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        width: '100%',
    },
    detailsButton: {
        borderWidth: 1,
        borderColor: theme.secondaryColor,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    detailsButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    shareButton: {
        borderWidth: 1,
        borderColor: theme.secondaryColor,
        padding: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

