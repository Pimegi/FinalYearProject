import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';
import { useNavigation } from '@react-navigation/native';

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
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));

      if (bmiValue < 16) {
        setBmiCategory('Severely Underweight');
      } else if (bmiValue >= 16 && bmiValue < 17) {
        setBmiCategory('Underweight');
      } else if (bmiValue >= 17 && bmiValue < 18.5) {
        setBmiCategory('Underweight');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory('Normal');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory('Overweight');
      } else if (bmiValue >= 30 && bmiValue < 35) {
        setBmiCategory('Obese Class I');
      } else if (bmiValue >= 35 && bmiValue < 40) {
        setBmiCategory('Obese Class II');
      } else {
        setBmiCategory('Obese Class III');
      }
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
            <Text style={styles.cardValue}>{user.currentStepCount}</Text>
            <Text style={styles.cardGoal}>Goal: {user.goalSteps}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BMICalculator')}>
            <Text style={styles.cardTitle}>BMI Calculator</Text>
            <Text style={styles.cardValue}>Your BMI is {bmi} ({bmiCategory})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WaterIntake')}>
            <Text style={styles.cardTitle}>Water Intake</Text>
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
});

export default HomeScreen;
