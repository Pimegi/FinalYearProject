export const workoutsData = [
  {
    category: 'Full Body',
    workouts: [
      {
        name: 'Incline Push-Ups',
        repeats: 5,
        instructions: 'Lay prone on the ground with arms supporting your body. Keep your feet together. Push your body up and down with the help of your arms while keeping your legs straight. Do this for 5 times.',
        focus: ['Chest', 'Triceps', 'Shoulders'],
        image: require('../../assets/incline_pushups.gif'),
        duration: 10,
      },
      {
        name: 'Jumping Jacks',
        repeats: 5,
        instructions: 'Stand upright with your legs together, arms at your sides. Bend your knees slightly, and jump into the air. As you jump, spread your legs to be about shoulder-width apart. Stretch your arms out and over your head. Jump back to starting position. Repeat this for 5 times.',
        focus: ['Legs', 'Cardio'],
        image: require('../../assets/jumping_jacks.gif'),
        duration: 10,
      },
      {
        name: 'Push-Ups',
        repeats: 5,
        instructions: 'Start in a high plank position. Place hands firmly on the ground, directly under shoulders. Lower your body until your chest is an inch from the ground then push back up to the starting position. Repeat this for 5 times.',
        focus: ['Chest', 'Triceps', 'Shoulders'],
        image: require('../../assets/pushups.gif'),
        duration: 10,
      },
    ],
  },
  {
    category: 'Lower Body',
    workouts: [
      {
        name: 'Squats',
        repeats: 5,
        instructions: 'Stand with feet a little wider than shoulder-width apart, hips stacked over knees, and knees over ankles. Extend arms out straight so they are parallel with the ground. Start to squat by sending the hips back as if you are sitting back into a chair. Keep chest and shoulders upright and the back straight. Repeat this for 5 times.',
        focus: ['Legs', 'Glutes'],
        image: require('../../assets/squats.gif'),
        duration: 10,
      },
      {
        name: 'Lunges',
        repeats: 5,
        instructions: 'Stand tall with feet hip-width apart. Take a big step forward with right leg and start to shift your weight forward so heel hits the floor first. Lower your body until right thigh is parallel to the floor and right shin is vertical. Press into right heel to drive back up to starting position. Repeat this for 5 times.',
        focus: ['Legs', 'Glutes'],
        image: require('../../assets/lunges.gif'),
        duration: 10,
      },
    ],
  },
];