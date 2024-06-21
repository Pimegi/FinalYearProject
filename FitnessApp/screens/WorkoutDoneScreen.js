import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';

const WorkoutDoneScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workout, nextWorkouts } = route.params;

  const handleNextWorkout = async () => {
    if (nextWorkouts.length > 0) {
      navigation.navigate('WorkoutProgress', { workout: nextWorkouts[0], nextWorkouts: nextWorkouts.slice(1) });
    } else {
      navigation.navigate('Workouts');
    }
  };

  const saveExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        await axios.put(
          '/user/exercises',
          { exercise: { name: workout.name, calories: workout.calories, duration: workout.duration } },
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

  React.useEffect(() => {
    saveExercise();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={workout.image} style={styles.workoutGif} />
      <Text style={styles.title}>{workout.name}</Text>
      <Text style={styles.subtitle}>x{workout.repeats}</Text>
      <TouchableOpacity style={styles.doneButton} onPress={handleNextWorkout}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  workoutGif: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WorkoutDoneScreen;
