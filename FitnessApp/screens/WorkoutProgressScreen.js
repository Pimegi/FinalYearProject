import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


const WorkoutProgressScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workout, nextWorkouts } = route.params;
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout.duration);

  useEffect(() => {
    const timer = setInterval(() => {
      if (workout.duration > 0) {
        setProgress((prev) => prev + 100 / workout.duration);
        setTimeLeft((prev) => prev - 1);
      }
  
      if (timeLeft <= 0) {
        clearInterval(timer);
        navigation.navigate('WorkoutDone', { workout, nextWorkouts });
      }
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <Image source={workout.image} style={styles.workoutGif} />
      <Text style={styles.workoutTitle}>{workout.name}</Text>
      <Text style={styles.workoutRepeats}>x{workout.repeats}</Text>
      <AnimatedCircularProgress
        size={200}
        width={15}
        fill={progress}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        style={styles.progressCircle}
      >
        {() => <Text style={styles.timer}>{timeLeft}s</Text>}
      </AnimatedCircularProgress>
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
  workoutGif: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressCircle: {
    marginBottom: 20,
  },
  timer: {
    fontSize: 24,
    color: '#00e0ff',
  },
workoutRepeats: {
    fontSize: 18,
    color: '#555',
    bottom: 10,
},
});

export default WorkoutProgressScreen;
