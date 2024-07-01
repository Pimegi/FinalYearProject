import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';

const StepCounterScreen = () => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [caloriesBurnt, setCaloriesBurnt] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [goalSteps, setGoalSteps] = useState(6000);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const intervalRef = useRef(null);
  const localStepCountRef = useRef(0); // Ref to maintain local step count

  useEffect(() => {
    let subscription;

    const askPermission = async () => {
      const { status } = await Pedometer.requestPermissionsAsync();
      setPermissionStatus(status);
    };

    const subscribe = () => {
      if (permissionStatus === 'granted') {
        subscription = Pedometer.watchStepCount(result => {
          if (!isPaused) {
            localStepCountRef.current += result.steps; // Accumulate local step count
            setCurrentStepCount(localStepCountRef.current);
          }
        });

        Pedometer.isAvailableAsync().then(
          result => {
            console.log('Pedometer is available: ', result);
          },
          error => {
            console.error('Pedometer is not available.', error);
          }
        );
      }
    };

    askPermission();
    subscribe();

    return () => subscription && subscription.remove();
  }, [permissionStatus, isPaused]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/user/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setGoalSteps(response.data.goalSteps);
          setTotalSteps(response.data.currentStepCount);
        } catch (err) {
          console.error(err);
        }
      }
    };

    const fetchLocalData = async () => {
      try {
        const storedTotalSteps = await AsyncStorage.getItem('totalSteps');
        const storedCurrentStepCount = await AsyncStorage.getItem('currentStepCount');
        if (storedTotalSteps !== null) setTotalSteps(parseInt(storedTotalSteps));
        if (storedCurrentStepCount !== null) setCurrentStepCount(parseInt(storedCurrentStepCount));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
    fetchLocalData();
  }, []);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  useEffect(() => {
    setCaloriesBurnt((totalSteps * 0.04).toFixed(2)); // Rough estimate of calories burnt per step
  }, [totalSteps]);

  useEffect(() => {
    const saveSteps = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          await axios.put(
            '/user/me',
            { currentStepCount: totalSteps },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('Steps saved!');
        } catch (err) {
          console.error(err);
        }
      }
    };

    const saveLocalData = async () => {
      try {
        await AsyncStorage.setItem('totalSteps', totalSteps.toString());
        await AsyncStorage.setItem('currentStepCount', currentStepCount.toString());
      } catch (err) {
        console.error(err);
      }
    };

    saveSteps();
    saveLocalData();
  }, [totalSteps, currentStepCount]);

  useEffect(() => {
    if (currentStepCount > 0) {
      setTotalSteps(prevSteps => prevSteps + currentStepCount);
      localStepCountRef.current = 0; // Reset local step count
      setCurrentStepCount(0); // Reset current step count to avoid adding the same steps multiple times
    }
  }, [currentStepCount]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSaveGoal = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        await axios.put(
          '/user/me',
          { goalSteps },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Step Goals saved!');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGoalChange = (text) => {
    setGoalSteps(parseInt(text) || 0);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { fontWeight: 'bold' }]}>Today</Text>
      <Text style={styles.subheading}>Steps</Text>
      {permissionStatus === 'granted' ? (
        <>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={(totalSteps / goalSteps) * 100}
            tintColor="#00e0ff"
            backgroundColor="#3d5875"
            style={styles.progressCircle}
          >
            {() => (
              <>
                <Text style={styles.steps}>{totalSteps}</Text>
                <Text style={styles.goalText}>Goal: {goalSteps}</Text>
              </>
            )}
          </AnimatedCircularProgress>
          <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
            <Text style={styles.pauseButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(totalSteps * 0.0008).toFixed(2)}</Text>
              <Text style={styles.statLabel}>Km</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{caloriesBurnt}</Text>
              <Text style={styles.statLabel}>Kcal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>
          <View style={styles.goalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Set Goal Steps"
              keyboardType="numeric"
              onChangeText={handleGoalChange}
              value={goalSteps.toString()}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
              <Text style={styles.saveButtonText}>Save Goal</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.text}>Permission is {permissionStatus}</Text>
      )}
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
  progressCircle: {
    marginBottom: 20,
  },
  steps: {
    fontSize: 48,
    color: '#00e0ff',
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  pauseButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#777',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '60%',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    fontSize: 30,
    color: '#333',
  },
  header: {
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    left: 20,
    bottom: 50,
  },
  subheading: {
    fontSize: 25,
    bottom: 10,
  },
});

export default StepCounterScreen;
