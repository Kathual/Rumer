import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const ButtonGroup = ({ options, selected, onSelect }) => (
  <View style={styles.buttonGroup}>
    {options.map(option => (
      <TouchableOpacity
        key={option}
        style={[styles.optionButton, selected === option && styles.optionButtonSelected]}
        onPress={() => onSelect(option)}
      >
        <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>{option}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [smoking, setSmoking] = useState('');
  const [cleanliness, setCleanliness] = useState('');
  const [social, setSocial] = useState('');
  const [pets, setPets] = useState('');
  const [funFact, setFunFact] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');

  const handleSave = async () => {
    if (!name || !major) {
      Alert.alert("Missing Fields", "Please fill out your name and major.");
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', uid), {
        name,
        major,
        year,
        smoking,
        cleanliness,
        social,
        pets,
        funFact,
        photoURL,
        email: auth.currentUser.email,
        createdAt: new Date(),
      });
      Alert.alert("✅ Profile saved!");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("❌ Error saving profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Complete Your Profile</Text>

      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Major" style={styles.input} value={major} onChangeText={setMajor} />
      <TextInput placeholder="Year (e.g. Freshman)" style={styles.input} value={year} onChangeText={setYear} />

      <Text style={styles.label}>Do you smoke?</Text>
      <ButtonGroup options={['Yes', 'No', 'Occasionally']} selected={smoking} onSelect={setSmoking} />

      <Text style={styles.label}>Cleanliness (1 - Very Messy, 5 - Very Clean)</Text>
      <ButtonGroup options={['1', '2', '3', '4', '5']} selected={cleanliness} onSelect={setCleanliness} />

      <Text style={styles.label}>Are you quiet or social?</Text>
      <ButtonGroup options={['Quiet', 'Social', 'Balanced']} selected={social} onSelect={setSocial} />

      <TextInput placeholder="Pets?" style={styles.input} value={pets} onChangeText={setPets} />
      <TextInput placeholder="Fun Fact" style={styles.input} value={funFact} onChangeText={setFunFact} />

      <TextInput placeholder="Profile Image URL" style={styles.input} value={photoURL} onChangeText={setPhotoURL} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Save Profile" onPress={handleSave} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#555',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
});
