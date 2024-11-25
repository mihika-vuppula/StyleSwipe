import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import ItemCard from '../components/ItemCard';
import OutfitCard from '../components/OutfitCard';
import DetailsModal from '../components/DetailsModal'; // Import DetailsModal
import OutfitMatches from '../constant/OutfitMatches.json';
import SavedItems from '../constant/SavedItems.json';
import { theme } from '../styles/Theme';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 64) / 2;

export default function MatchScreen({ navigation }) {
    const [outfits, setOutfits] = useState([]);
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('outfits');
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false);

    useEffect(() => {
        setOutfits(OutfitMatches);
        setItems(SavedItems);
    }, []);

    const openDetails = (item) => {
        setSelectedItem(item);
        setDetailsVisible(true);
    };

    const closeDetails = () => {
        setSelectedItem(null);
        setDetailsVisible(false);
    };

    const renderOutfit = ({ item }) => (
        <OutfitCard outfit={item} cardWidth={cardWidth} />
    );

    const renderItem = ({ item }) => (
        <ItemCard
            item={item}
            cardWidth={cardWidth}
            onDetailsPress={() => openDetails(item)} // Open details modal
        />
    );

    return (
        <SafeAreaView style={theme.container}>
            <View style={theme.header}>
                <Text style={theme.title}>Your Fits</Text>
            </View>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'items' && styles.activeTab]}
                    onPress={() => setActiveTab('items')}
                >
                    <Text style={[styles.tabText, activeTab === 'items' && styles.activeText]}>Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'outfits' && styles.activeTab]}
                    onPress={() => setActiveTab('outfits')}
                >
                    <Text style={[styles.tabText, activeTab === 'outfits' && styles.activeText]}>Outfits</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'outfits' ? (
                <FlatList
                    data={outfits}
                    renderItem={renderOutfit}
                    keyExtractor={(item) => item.matchId}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContainer}
                />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.itemId}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContainer}
                />
            )}

            {/* Details Modal */}
            <DetailsModal
                visible={detailsVisible}
                onClose={closeDetails}
                item={selectedItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginVertical: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: theme.secondaryColor,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: theme.primaryColor,
        borderWidth: 0,
    },
    tabText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.primaryColor,
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    flatListContainer: {
        alignSelf: 'center',
    },
});
