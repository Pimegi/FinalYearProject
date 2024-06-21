import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import SettingsScreen from './screens/SettingsScreen';
import useAuth from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import EditProfileScreen from './screens/EditProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import StepCounterScreen from './screens/StepCounterScreen';
import MacrosScreen from './screens/MacrosScreen';
import BMICalculatorScreen from './screens/BMICalculatorScreen';
import WaterIntakeScreen from './screens/WaterIntakeScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import WorkoutDoneScreen from './screens/WorkoutDoneScreen';
import WorkoutProgressScreen from './screens/WorkoutProgressScreen';
import BadgeScreen from './screens/BadgeScreen';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
const HomeStack = createStackNavigator();
const WorkoutStack = createStackNavigator();


function HomeStackScreen() {
  return (<HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="StepCounter" component={StepCounterScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="Macros" component={MacrosScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="BMICalculator" component={BMICalculatorScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="WaterIntake" component={WaterIntakeScreen} options={{ headerShown: false }} />
  </HomeStack.Navigator>);
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen} 
        options={{ headerShown: false }} // Add this line to hide the screen name
      />
      <SettingsStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: false }} // Add this line to hide the screen name
      />
    </SettingsStack.Navigator>
  );
}

function WorkoutsStackScreen() {
  return (
    <WorkoutStack.Navigator>
      <WorkoutStack.Screen 
        name="WorkoutsScreen" 
        component={WorkoutsScreen} 
        options={{ headerShown: false }} 
      />
      <WorkoutStack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen} 
        options={{ headerShown: false }} 
      />
      <WorkoutStack.Screen 
        name="WorkoutDone" 
        component={WorkoutDoneScreen} 
        options={{ headerShown: false }} 
      />
      <WorkoutStack.Screen 
        name="WorkoutProgress" 
        component={WorkoutProgressScreen} 
        options={{ headerShown: false }} 
      />
    </WorkoutStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeStackScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsStackScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Badges" 
        component={BadgeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medal" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStackScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="AppTabs" component={AppTabs} />
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <NavigationContainer>
      <AuthFlow />
      </NavigationContainer>
    </ThemeProvider>
  );
}
