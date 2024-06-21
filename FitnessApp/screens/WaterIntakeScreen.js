import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, Platform } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const WaterIntakeScreen = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [drinkGoal, setDrinkGoal] = useState(2000); // Default goal in ml
  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(30); // Default to 30 minutes
  const [inputAmount, setInputAmount] = useState(0); // New state for input amount

  useEffect(() => {
    const fetchWaterIntake = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/user/water-intake', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setWaterIntake(response.data.waterIntake);
          setDrinkGoal(response.data.drinkGoal);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchWaterIntake();
  }, []);

  const handleLogWater = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const newIntake = waterIntake + inputAmount;
        setWaterIntake(newIntake);
        await axios.put(
          '/user/water-intake',
          { waterIntake: newIntake },
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
    setModalVisible(false);
    setInputAmount(0); // Reset input amount
  };

  const handleSetGoal = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        await axios.put(
          '/user/water-intake',
          { drinkGoal },
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
    setGoalModalVisible(false);
  };

  const handleSetReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hydration Reminder',
        body: 'Time to drink water!',
      },
      trigger: {
        seconds: reminderInterval * 60, // Convert minutes to seconds
        repeats: true,
      },
    });

    setReminderVisible(false);
  };

  const askNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    askNotificationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Drink Goal</Text>
      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>{drinkGoal / 1000}L</Text>
        <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
          <Ionicons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <AnimatedCircularProgress
        size={300}
        width={15}
        fill={(waterIntake / drinkGoal) * 100}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        style={styles.progressCircle}
      >
        {() => (
          <>
            <Text style={styles.progressText}>{waterIntake} ml</Text>
            <Text style={styles.remainingText}>Remaining: {drinkGoal - waterIntake} ml</Text>
          </>
        )}
      </AnimatedCircularProgress>
      <TouchableOpacity style={styles.trackButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.trackButtonText}>Track Drinking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reminderButton} onPress={() => setReminderVisible(true)}>
        <Text style={styles.reminderButtonText}>Set Reminder</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount (ml)"
            keyboardType="numeric"
            onChangeText={(text) => setInputAmount(parseInt(text) || 0)}
          />
          <Button title="Log Water" onPress={handleLogWater} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={goalModalVisible}
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Enter new goal (ml)"
            keyboardType="numeric"
            onChangeText={(text) => setDrinkGoal(parseInt(text) || 2000)}
          />
          <Button title="Set Goal" onPress={handleSetGoal} />
          <Button title="Close" onPress={() => setGoalModalVisible(false)} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reminderVisible}
        onRequestClose={() => setReminderVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Set reminder interval (minutes)"
            keyboardType="numeric"
            onChangeText={(text) => setReminderInterval(parseInt(text) || 30)}
          />
          <Button title="Set Reminder" onPress={handleSetReminder} />
          <Button title="Close" onPress={() => setReminderVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalText: {
    fontSize: 24,
    marginRight: 10,
  },
  progressCircle: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 48,
    color: '#00e0ff',
  },
  remainingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  trackButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  reminderButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  reminderButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '80%',
    marginBottom: 20,
  },
});

export default WaterIntakeScreen;