import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

export default function ChatListScreen({ navigation }) {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    // Real-time listener for matches involving current user
    const q = query(collection(db, 'matches'));
    const unsubscribe = onSnapshot(q, async snapshot => {
      const chats = await Promise.all(snapshot.docs.map(async docSnap => {
        const data = docSnap.data();
        const withMe = data.users[currentUserId];
        if (!withMe) return null;

        const otherUserId = Object.keys(data.users).find(id => id !== currentUserId);
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        const userData = userDoc.data();

        // Get the latest message
        const messagesSnap = await query(
          collection(db, 'chats', docSnap.id, 'messages'),
          where('createdAt', '!=', null)
        );
        const msgsSnapshot = await getDocs(messagesSnap);
        let lastMessage = '';
        let lastTime = 0;

        msgsSnapshot.forEach(m => {
          const d = m.data();
          if (d.createdAt.toMillis() > lastTime) {
            lastTime = d.createdAt.toMillis();
            lastMessage = d.text;
          }
        });

        return {
          chatId: docSnap.id,
          otherUserId,
          name: userData.name,
          photoURL: userData.photoURL, // optional: add photoURL field to user profiles
          lastMessage,
          lastTime
        };
      }));

      setChatList(chats.filter(Boolean).sort((a, b) => b.lastTime - a.lastTime));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />

  if (!chatList.length) {
    return (
      <View style={styles.center}>
        <Text>No chats yet—start matching to connect!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={chatList}
      keyExtractor={item => item.chatId}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.matchItem}
          onPress={() => navigation.navigate('Chat', { chatId: item.chatId })}
        >
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}><Text style={styles.initial}>{item.name.charAt(0)}</Text></View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message} numberOfLines={1}>
              {item.lastMessage || 'No messages yet. Say hi!'}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  placeholderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  initial: {
    fontSize: 20,
    color: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});
