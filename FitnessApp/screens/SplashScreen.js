import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setTimeout(() => {
            navigation.replace('AppTabs');
          }, 4000); 
        } else {
          setTimeout(() => {
            navigation.replace('Login');
          }, 4000); 
        }
      } catch (err) {
        setTimeout(() => {
          navigation.replace('Login');
        }, 4000); 
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome to StayFit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  // Change this to match your app's theme
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',  // Change this to match your app's theme
  },
});

export default SplashScreen;
