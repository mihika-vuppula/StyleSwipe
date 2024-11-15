import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import { theme } from '../styles/Theme';
import { MaterialIcons } from '@expo/vector-icons';

const imageOptions = [
    { id: '1', uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg' },
    { id: '2', uri: 'https://static.vecteezy.com/system/resources/previews/002/002/297/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg' },
    { id: '3', uri: 'https://static.vecteezy.com/system/resources/previews/024/183/507/non_2x/female-avatar-portrait-of-brunette-woman-with-long-straight-hair-illustration-of-a-female-character-in-a-modern-color-style-vector.jpg' },
    { id: '4', uri: 'https://static.vecteezy.com/system/resources/previews/024/183/500/non_2x/female-avatar-brunette-woman-portrait-illustration-of-a-female-character-in-a-modern-color-style-vector.jpg' },
    { id: '5', uri: 'https://static.vecteezy.com/system/resources/thumbnails/024/183/524/small_2x/female-avatar-portrait-of-a-blonde-woman-with-thick-hair-illustration-of-a-female-character-in-a-modern-color-style-vector.jpg' },
    { id: '6', uri: 'https://i.pinimg.com/736x/54/d1/6a/54d16ab8c93c75d6a101e50c585c52ed.jpg' },
    { id: '7', uri: 'https://i.pinimg.com/736x/1d/31/60/1d31608a5e81cc4d73f604ab256cd015.jpg' },
];

export default function AccountScreen({navigation}) {
    const [selectedImage, setSelectedImage] = useState(imageOptions[0].uri);
    const [isAvatarOptionsVisible, setAvatarOptionsVisible] = useState(false);
    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState("User Name");
    const flatListRef = useRef(null);

    const toggleAvatarOptions = () => {
        setAvatarOptionsVisible(!isAvatarOptionsVisible);
    };

    const selectImage = (uri) => {
        setSelectedImage(uri);
        setAvatarOptionsVisible(false);
    };

    const handleSaveChanges = () => {
        if (name.trim() === "") {
            Alert.alert("Error", "Please enter your name");
            return;
        }
        setDisplayName(name);
        Alert.alert("Success", "Profile updated successfully!");
    };

    return (
        <View style={theme.container}>
            {/* Header */}
            <View style={[theme.header, styles.wideHeader]}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Swipe')} 
                    style={[theme.topButton, styles.backButton]}
                >
                    <MaterialIcons 
                        name="arrow-back-ios" 
                        size={24} 
                        color={theme.primaryColor} 
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Your Profile</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                {/* Orange Background */}
                <View style={styles.orangeBackdropContainer}>
                    <View style={styles.largeCurveBackground} />
                </View>

                {/* Main Profile Image */}
                <View style={styles.profileContainer}>
                    <TouchableOpacity 
                        style={styles.profileImageContainer}
                        onPress={toggleAvatarOptions}
                    >
                        <Image 
                            source={{ uri: selectedImage }} 
                            style={styles.profileImage}
                        />
                        <TouchableOpacity 
                            onPress={toggleAvatarOptions} 
                            style={styles.editIconContainer}
                        >
                            <MaterialIcons 
                                name="edit" 
                                size={18} 
                                color={theme.primaryColor}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/* Username */}
                    <Text style={styles.usernameText}>{displayName}</Text>

                    {/* Avatar Selection */}
                    {isAvatarOptionsVisible && (
                        <View style={styles.avatarOptionsContainer}>
                            <FlatList
                                ref={flatListRef}
                                data={imageOptions}
                                horizontal
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={100}
                                decelerationRate="fast"
                                renderItem={({ item }) => (
                                    <Pressable 
                                        onPress={() => selectImage(item.uri)}
                                        style={({ pressed }) => [
                                            styles.avatarOptionContainer,
                                            pressed && styles.pressed
                                        ]}
                                    >
                                        <Image 
                                            source={{ uri: item.uri }} 
                                            style={[
                                                styles.optionImage,
                                                selectedImage === item.uri && styles.selectedOptionImage
                                            ]}
                                        />
                                    </Pressable>
                                )}
                                contentContainerStyle={styles.avatarList}
                            />
                        </View>
                    )}
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <View>
                        {/* Full Name Input */}
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="person" size={24} color={theme.primaryColor} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Full Name"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Save Changes Button */}
                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={handleSaveChanges}
                        >
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Log Out Button */}
                    <TouchableOpacity style={styles.logoutButton}>
                        <MaterialIcons name="logout" size={24} color={theme.primaryColor} style={styles.inputIcon} />
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    backButton: {
        paddingLeft: 12,
        paddingRight: 4
    },
    wideHeader: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginTop: 20,
    },
    profileSection: {
        flex: 1,
        width: '100%',
    },
    orangeBackdropContainer: {
        overflow: 'hidden',
        width: '150%',
        height: 200,
        borderBottomLeftRadius: 190,
        borderBottomRightRadius: 190,
        position: 'absolute',
        top: 0,
        left: '-25%',
        backgroundColor: theme.primaryColor,
    },
    largeCurveBackground: {
        height: '100%',
        width: '100%',
    },
    profileContainer: {
        alignItems: 'center',
        paddingTop: 80,
        zIndex: 1,
    },
    profileImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'white',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    usernameText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.secondaryColor,
    },
    avatarOptionsContainer: {
        marginTop: 20,
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    avatarList: {
        paddingHorizontal: 10,
    },
    avatarOptionContainer: {
        marginHorizontal: 5,
        borderRadius: 45,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    optionImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: 'transparent', 
    },
    selectedOptionImage: {
        borderColor: theme.primaryColor, 
        borderWidth: 2,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }], 
    },
    formSection: {
        paddingTop: 20,
        width: '100%',
        flex: 1,
        justifyContent: 'space-between',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginTop: 20,
        height: 50,
    },
    inputIcon: {
        marginRight: 15,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: theme.primaryColor,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 30,
        height: 50,
    },
    saveButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginTop: 'auto',
        marginBottom: 40,
        height: 50,
    },
    logoutButtonText: {
        fontSize: 16,
        color: theme.primaryColor,
        fontWeight: 'bold',
    },
});