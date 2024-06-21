import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import axios from '../src/api/axios';

const SettingsScreen = ({ navigation, route }) => {
    const [user, setUser] = useState(null);
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

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
                    setUser(response.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (route.params?.updatedUser) {
            setUser(route.params.updatedUser);
        }
    }, [route.params?.updatedUser]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={styles.profileContainer}>
                <Image source={require('../assets/profile.png')} style={styles.profileImage} />
                {user && (
                    <>
                        <Text style={[styles.profileName, isDarkMode && styles.darkText]}>{user.name}</Text>
                        <Text style={[styles.profileEmail, isDarkMode && styles.darkText]}>{user.email}</Text>
                        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
                            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Preferences</Text>
                <View style={styles.row}>
                    <Text style={[styles.rowTitle, isDarkMode && styles.darkText]}>Language</Text>
                    <Text style={[styles.rowValue, isDarkMode && styles.darkText]}>English</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.rowTitle, isDarkMode && styles.darkText]}>Dark Mode</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleDarkMode}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    darkContainer: {
        backgroundColor: '#333',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 14,
        color: '#777',
        marginBottom: 10,
    },
    editProfileButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    editProfileButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rowTitle: {
        fontSize: 16,
    },
    rowValue: {
        fontSize: 16,
        color: '#777',
    },
    darkText: {
        color: '#fff',
    },
    logoutButton: {
        backgroundColor: '#DC3545',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
