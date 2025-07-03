// screens/ChatScreen.js

import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const chatId = route.params?.chatId || 'default_chat';

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'desc')),
      snapshot => {
        setMessages(snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id })));
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = collection(db, 'users');
    onSnapshot(ref, (snapshot) => {
      const profile = snapshot.docs.find(doc => doc.id === uid);
      if (profile) setUserProfile(profile.data());
    });
  }, []);

  const onSend = async (newMessages = []) => {
    const msg = newMessages[0];
    const { _id, text } = msg;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      _id,
      text,
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.uid,
        name: userProfile?.name || 'User',
        avatar: userProfile?.photoURL || undefined,
      }
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: auth.currentUser.uid,
        name: userProfile?.name || 'User',
        avatar: userProfile?.photoURL || undefined,
      }}
    />
  );
}

