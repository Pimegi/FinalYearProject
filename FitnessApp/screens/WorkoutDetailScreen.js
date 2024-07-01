import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const WorkoutDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workout } = route.params;

  console.log('Workout:', workout);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.categoryTitle}>{workout.name}</Text>
      <Image source={workout.image} style={styles.workoutImage} />
      <Text style={styles.workoutDuration}>Duration: {workout.duration} mins</Text>
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{workout.instructions}</Text>
      <Text style={styles.sectionTitle}>Focus Area</Text>
      <View style={styles.focusAreaContainer}>
        {workout.focus.map((area, index) => (
          <View key={index} style={styles.focusArea}>
            <Text style={styles.focusAreaText}>{area}</Text>
          </View>
        ))}
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  workoutImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  workoutDuration: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
  },
  focusAreaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  focusArea: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  focusAreaText: {
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    bottom: 30,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WorkoutDetailScreen;
