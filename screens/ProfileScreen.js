// screens/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <Text>Loading profile...</Text>;

  return (
    <View style={styles.container}>
      {profile.photoURL ? (
        <Image source={{ uri: profile.photoURL }} style={styles.image} />
      ) : (
        <Text>No Image</Text>
      )}
      <Text style={styles.name}>{profile.name}</Text>
      <Text>{profile.major} • {profile.year}</Text>
      <Text>Fun Fact: {profile.funFact}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
