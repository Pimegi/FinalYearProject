import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../src/api/axios';

const BadgeScreen = () => {
  const [badges, setBadges] = useState({
    '1000Steps': true,
    '3000Steps': false,
    '5000Steps': false,
    '1000mlWater': false,
    '2000mlWater': false,
    '3000mlWater': false,
  });

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
          console.log(response.data.badges);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchBadges();
  }, []);
  
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
        <BadgeItem label="1000 Steps" achieved={badges['1000Steps']} />
        <BadgeItem label="3000 Steps" achieved={badges['3000Steps']} />
        <BadgeItem label="5000 Steps" achieved={badges['5000Steps']} />
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
