import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { workoutsData } from '../src/data/workouts';

const WorkoutsScreen = () => {
  const navigation = useNavigation();

  const renderWorkout = ({ item }) => (
    <TouchableOpacity style={styles.workoutCard} onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}>
      <Image source={item.image} style={styles.workoutImage} />
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutRepeats}>x{item.repeats}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        <FlatList
          data={item.workouts}
          renderItem={renderWorkout}
          keyExtractor={(workout) => workout.name}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('WorkoutProgress', { workout: item.workouts[0], nextWorkouts: item.workouts.slice(1) })}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutsData}
        renderItem={renderCategory}
        keyExtractor={(category) => category.category}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    width: 150,
  },
  workoutImage: {
    width: 150,
    height: 100,
    marginBottom: 10,
  },
  workoutInfo: {
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutRepeats: {
    fontSize: 14,
    color: '#777',
  },
  startButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WorkoutsScreen;
