import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';

const BadgeScreen = () => {
  const [badges, setBadges] = useState({
    '10Steps': false,
    '30Steps': false,
    '50Steps': false,
    '1000mlWater': false,
    '2000mlWater': false,
    '3000mlWater': false,
  });
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    const fetchBadges = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/user/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBadges(response.data.badges);
          setCurrentStepCount(response.data.currentStepCount);
          setWaterIntake(response.data.waterIntake);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchBadges();
    // Simulate checking milestones after fetching badges
    checkAndUpdateMilestones();
  }, [currentStepCount, waterIntake]);

  const updateBadge = async (badgeName, newValue) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        await axios.put('/user/update-stats', {
          badgeName,
          newValue,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Directly update the local state to reflect the badge update
        setBadges(prevBadges => ({ ...prevBadges, [badgeName]: newValue }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const checkAndUpdateMilestones = () => {
    if (currentStepCount >= 10 && !badges['10Steps']) {
      updateBadge('10Steps', true);
    }
    if (currentStepCount >= 30 && !badges['30Steps']) {
      updateBadge('30Steps', true);
    }
    if (currentStepCount >= 50 && !badges['50Steps']) {
      updateBadge('50Steps', true);
    }
    if (waterIntake >= 1000 && !badges['1000mlWater']) {
      updateBadge('1000mlWater', true);
    }
    if (waterIntake >= 2000 && !badges['2000mlWater']) {
      updateBadge('2000mlWater', true);
    }
    if (waterIntake >= 3000 && !badges['3000mlWater']) {
      updateBadge('3000mlWater', true);
    }
  };

  const BadgeItem = ({ label, achieved }) => (
    <View style={styles.badgeContainer}>
      <Image
        source={achieved ? require('../assets/badge.png') : require('../assets/badge_gray.png')}
        style={styles.badgeImage}
      />
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Steps</Text>
        <BadgeItem label="10 Steps" achieved={badges['10Steps']} />
        <BadgeItem label="30 Steps" achieved={badges['30Steps']} />
        <BadgeItem label="50 Steps" achieved={badges['50Steps']} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Water Intake</Text>
        <BadgeItem label="1000 ml Water" achieved={badges['1000mlWater']} />
        <BadgeItem label="2000 ml Water" achieved={badges['2000mlWater']} />
        <BadgeItem label="3000 ml Water" achieved={badges['3000mlWater']} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  badgeLabel: {
    fontSize: 16,
  },
});

export default BadgeScreen;
