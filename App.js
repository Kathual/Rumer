import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import firebase from './firebase';


// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import SwipeScreen from './screens/SwipeScreen'; // Create next
import ChatScreen from './screens/ChatScreen';   // Create next
import RegisterScreen from './screens/RegisterScreen';  // add this import
import ChatListScreen from './screens/ChatListScreen';
import ProfileScreen from './screens/ProfileScreen';




const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile Setup" component={ProfileSetupScreen} />
          <Stack.Screen name="Swipe" component={SwipeScreen} />
          <Stack.Screen name="Chats" component={ChatListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
