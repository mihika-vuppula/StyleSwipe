import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../styles/Theme';
import DetailsModal from './DetailsModal'; 

export default function OutfitCard({ outfit, cardWidth }) {
    const [detailsVisible, setDetailsVisible] = useState(false);

    const outfitItems = [
        {
            productName: outfit.top.M.productName.S,
            designerName: outfit.top.M.designerName.S,
            productPrice: outfit.top.M.productPrice.S,
            imageUrl: outfit.top.M.imageUrl.S,
        },
        {
            productName: outfit.bottom.M.productName.S,
            designerName: outfit.bottom.M.designerName.S,
            productPrice: outfit.bottom.M.productPrice.S,
            imageUrl: outfit.bottom.M.imageUrl.S,
        },
        {
            productName: outfit.shoes.M.productName.S,
            designerName: outfit.shoes.M.designerName.S,
            productPrice: outfit.shoes.M.productPrice.S,
            imageUrl: outfit.shoes.M.imageUrl.S,
        },
    ];

    return (
        <>
            <View style={[styles.cardContainer, { width: cardWidth }]}>
                {/* Outfit Images */}
                <View style={styles.outfitContainer}>
                    <View style={styles.imagesContainer}>
                        {/* Top */}
                        <View style={[styles.itemContainer, styles.imageSpacing]}>
                            <Image source={{ uri: outfit.top.M.imageUrl.S }} style={[styles.image, { width: cardWidth - 2 }]} />
                        </View>
                        {/* Bottom */}
                        <View style={[styles.itemContainer, styles.imageSpacing]}>
                            <Image source={{ uri: outfit.bottom.M.imageUrl.S }} style={[styles.image, { width: cardWidth - 2 }]} />
                        </View>
                        {/* Shoes */}
                        <View style={styles.itemContainer}>
                            <Image source={{ uri: outfit.shoes.M.imageUrl.S }} style={[styles.image, { width: cardWidth - 2 }]} />
                        </View>
                    </View>
                </View>

                {/* Buttons */}
                <View style={theme.buttonsContainer}>
                    <TouchableOpacity
                        style={theme.detailsButton}
                        onPress={() => setDetailsVisible(true)} // Open DetailsModal
                    >
                        <Text style={theme.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.detailsButton}>
                        <Text style={theme.detailsButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Details Modal */}
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
});
