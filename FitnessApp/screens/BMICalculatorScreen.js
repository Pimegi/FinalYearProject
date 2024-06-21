import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';

const BMICalculatorScreen = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('#00FF00');

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const user = response.data;
          setHeight(user.height.toString());
          setWeight(user.weight.toString());
          setAge(user.age.toString());
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUser();
  }, []);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));

      if (bmiValue < 16) {
        setBmiCategory('Severely Underweight');
        setBmiColor('#0000FF');
      } else if (bmiValue >= 16 && bmiValue < 17) {
        setBmiCategory('Underweight');
        setBmiColor('#ADD8E6');
      } else if (bmiValue >= 17 && bmiValue < 18.5) {
        setBmiCategory('Underweight');
        setBmiColor('#FFFF00');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory('Normal');
        setBmiColor('#00FF00');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory('Overweight');
        setBmiColor('#FFA500');
      } else if (bmiValue >= 30 && bmiValue < 35) {
        setBmiCategory('Obese Class I');
        setBmiColor('#FF4500');
      } else if (bmiValue >= 35 && bmiValue < 40) {
        setBmiCategory('Obese Class II');
        setBmiColor('#FF0000');
      } else {
        setBmiCategory('Obese Class III');
        setBmiColor('#8B0000');
      }

      saveUserProfile(height, weight, age);
    }
  };

  const saveUserProfile = async (height, weight, age) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        await axios.put(
          '/user/me',
          { height: parseFloat(height), weight: parseFloat(weight), age: parseInt(age) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>
      <Text style={styles.legend}>Height (cm) </Text>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <Text style={styles.legend}>Weight (kg) </Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={styles.legend}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <Button title="Calculate BMI" onPress={calculateBMI} />
      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your BMI is {bmi}</Text>
          <View style={[styles.gauge, { borderColor: bmiColor }]}>
            <Text style={[styles.gaugeText, { color: bmiColor }]}>{bmiCategory}</Text>
          </View>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gauge: {
    marginTop: 20,
    width: 200,
    height: 100,
    borderWidth: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 20,
    alignItems: 'center',
  },
  legendItem: {
    width: '100%',
    padding: 5,
    marginVertical: 2,
  },
  legendText: {
    color: '#fff',
  },
});

export default BMICalculatorScreen;
