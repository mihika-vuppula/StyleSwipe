import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/Theme';

export default function OutfitCard({ outfit, cardWidth }) {
    return (
        <View style = {[styles.cardContainer, { width: cardWidth }]}>
           <View style={styles.outfitContainer}>
                <View style={styles.imagesContainer}>
                    <View style={[styles.itemContainer, styles.imageSpacing]}>
                        <Image source={{ uri: outfit.top.M.imageUrl.S }} style={[styles.image, { width: cardWidth - 2 }]} />
                    </View>
                    <View style={[styles.itemContainer, styles.imageSpacing]}>
                        <Image source={{ uri: outfit.bottom.M.imageUrl.S }} style={[styles.image, { width: cardWidth - 2 }]} />
                    </View>
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: outfit.shoes.M.imageUrl.S }} style={[styles.image, { width: cardWidth - 2 }]} />
                    </View>
                </View>
            </View>

            
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <MaterialIcons name="share" size={20} color="#333" />
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
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
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
