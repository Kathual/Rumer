import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { db, auth } from '../firebase';
import { collection, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export default function SwipeScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), snapshot => {
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUserId);
      setProfiles(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSwipeRight = async (index) => {
    if (!profiles[index]) return;

    const swipedUser = profiles[index];
    const swipedUserId = swipedUser.id;

    try {
      await setDoc(doc(db, 'likes', `${currentUserId}_${swipedUserId}`), {
        from: currentUserId,
        to: swipedUserId,
        timestamp: Date.now(),
      });

      const mutualLikeRef = doc(db, 'likes', `${swipedUserId}_${currentUserId}`);
      const mutualLikeSnap = await getDoc(mutualLikeRef);

      if (mutualLikeSnap.exists()) {
        const matchId = [currentUserId, swipedUserId].sort().join('_');
        await setDoc(doc(db, 'matches', matchId), {
          users: {
            [currentUserId]: true,
            [swipedUserId]: true,
          },
          timestamp: Date.now(),
        });

        Alert.alert(
          '🎉 Match!',
          `You matched with ${swipedUser.name}!`,
          [
            {
              text: 'Start Chatting',
              onPress: () => navigation.navigate('Chat', { chatId: matchId }),
            },
            { text: 'Cool', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No profiles available to swipe right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={profiles}
        renderCard={(card) => (
          <View style={styles.card}>
            {card.photoURL ? (
              <Image source={{ uri: card.photoURL }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.noImage]}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
            <Text style={styles.name}>{card.name}</Text>
            <Text>{card.major} • {card.year}</Text>
          </View>
        )}
        onSwipedRight={handleSwipeRight}
        backgroundColor="white"
        stackSize={3}
        cardIndex={0}
        animateCardOpacity
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                backgroundColor: 'red',
                color: 'white',
                fontSize: 24,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 20,
                marginLeft: -20,
              },
            },
          },
          right: {
            title: 'LIKE',
            style: {
              label: {
                backgroundColor: '#4CAF50',
                color: 'white',
                fontSize: 24,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 20,
                marginLeft: 20,
              },
            },
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  noImage: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
  },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
});