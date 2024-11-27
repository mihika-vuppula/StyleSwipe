import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../styles/Theme';

const { width, height } = Dimensions.get('window');

export default function DetailsModal({ visible, onClose, item }) {
    if (!item) return null;

    const isMultipleItems = Array.isArray(item); 

    const renderProductDetails = (product, index) => (
        <View key={index} style={styles.content}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />

            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.name}>{product.productName}</Text>
                    <Text style={styles.designer}>{product.designerName}</Text>
                </View>
                <View>
                    <Text style={styles.price}>{product.productPrice}</Text>
                    
                    <TouchableOpacity style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>Buy on Shopbop</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={theme.title}>Details</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.scrollableContent}>
                        {isMultipleItems
                            ? item.map((product, index) => renderProductDetails(product, index)) 
                            : renderProductDetails(item)}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: width * 0.9,
        maxHeight: height * 0.8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'space-between', 
    },
    closeButton: {
        padding: 10, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 18,
        color: theme.primaryColor,
        fontWeight: 'bold',
    },
    scrollableContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    content: {
        flexDirection: 'row',
        marginBottom: 16,
        height: height * 0.2 
    },
    image: {
        width: '45%',
        height: height * 0.2,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    detailsContainer: {
        marginLeft: 16,
        flex: 1,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    designer: {
        fontSize: 16,
        color: '#666',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buyButton: {
        padding: 6,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.secondaryColor,
        marginRight: 40
    },
    buyButtonText: {
       fontWeight: 'bold',
    },
});
