// src/screens/SignInScreen.js
import axios from 'axios';
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Dimensions,
} from 'react-native';
import { theme } from '../styles/Theme'; 
import { UserContext } from '../context/UserContext'; 

const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const [name, setName] = useState('');
  const { setUserId, setUserName } = useContext(UserContext); 

  const handleSignIn = async () => {
    if (name.trim()) {
      const userId = `user-${Date.now()}`;
      const params = {
        UserID: userId,
        Name: name,
      };

      try {
        console.log('Sending data to API:', params);
        const response = await axios.post(
          'https://hayhuoxszf.execute-api.us-east-1.amazonaws.com/prod/users', 
          params,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        console.log('API Response:', response.data);
        console.log(`UserID ${userId} stored successfully`);
        setUserId(userId);
        setUserName(name);
        navigation.navigate('Main');
      } catch (error) {
        console.error('Error storing UserID:', error);
        Alert.alert('Error', 'Failed to store user data. Please try again.');
      }
    } else {
      Alert.alert('Validation Error', 'Please enter your name.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Landing-Page.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Text style={styles.title}>StyleSwipe</Text>
        <Text style={styles.subtitle}>by Shopbop</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.secondaryColor}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.container.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 40,
    color: '#000',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: -25,
  },
  subtitle: {
    fontSize: 14,
    color: '#000', 
    marginBottom: 240,
    fontFamily: 'serif',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    color: theme.secondaryColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    maxWidth: 400,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderColor: '#D3D3D3',
    borderWidth: 1.5,
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    textAlign: 'left',
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: '80%',
    maxWidth: 400,
    paddingVertical: 15,
    backgroundColor: theme.primaryColor,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
