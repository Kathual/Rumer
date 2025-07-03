import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Welcome to Roommate Finder!</Text>
      <Text style={styles.emailText}>
        Logged in as: {auth.currentUser?.email}
      </Text>

      <View style={styles.buttonGroup}>
        <Button
          title="📝 Complete Profile"
          onPress={() => navigation.navigate('Profile Setup')}
        />
        <View style={{ marginTop: 10 }} />
        <Button
          title="🔥 Find Matches"
          onPress={() => navigation.navigate('Swipe')}
        />
        <View style={{ marginTop: 10 }} />
        <Button
          title="💬 Chats"
          onPress={() => navigation.navigate('Chats')} // ✅ fixed from 'Chat'
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Log Out" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  emailText: {
    marginBottom: 30,
    fontSize: 16,
    color: '#555',
  },
  buttonGroup: {
    width: '100%',
  },
});
