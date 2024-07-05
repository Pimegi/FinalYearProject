import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from 'react-native-progress/Bar';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = response.data;
          // Mock water intake for demonstration
          
          setUser(user);
          calculateBMI(user.height, user.weight);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUser();
  }, []);

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    setBmi(bmi.toFixed(1));
    if (bmi < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmi < 24.9) {
      setBmiCategory('Normal weight');
    } else if (bmi < 29.9) {
      setBmiCategory('Overweight');
    } else if (bmi > 29.9) {
      setBmiCategory('Obesity');
    }
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.header}>
            <Image source={require('../assets/profile.png')} style={styles.profileImage} />
            <Text style={styles.greeting}>Hello {user.name}, welcome back!</Text>
          </View>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StepCounter')}>
            <Text style={styles.cardTitle}>Steps</Text>
            <View style={styles.cardContent}></View>
            <Image source={require('../assets/steps.png')} style={styles.inlineImage} />
            <ProgressBar progress={user.currentStepCount / user.goalSteps} width={null} />
            <Text style={styles.cardValue}>{user.currentStepCount} / {user.goalSteps}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BMICalculator')}>
            <Text style={styles.cardTitle}>BMI Calculator</Text>
            <Image source={require('../assets/scale.png')} style={styles.inlineImage} />
            <Text style={styles.cardValue}>Your BMI is {bmi} ({bmiCategory})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WaterIntake')}>
            <Text style={styles.cardTitle}>Water Intake</Text>
              <Image source={require('../assets/water.png')} style={styles.inlineImage} />
              <ProgressBar progress={user.waterIntake / user.drinkGoal} width={null} />
            <Text style={styles.cardValue}>{user.waterIntake}ml / {user.drinkGoal}ml</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardGoal: {
    fontSize: 14,
    color: '#777',
  },
  cardTime: {
    fontSize: 14,
    color: '#777',
  },
  macroBox: {
    alignItems: 'center',
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inlineImage: {
    width: 50, 
    height: 50, 
    marginRight: 10, 
  },
});

export default HomeScreen;
