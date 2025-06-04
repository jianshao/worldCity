// components/LikeButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  liked: boolean;
  likeCount: number;
  onLikeToggle: (newState: boolean) => Promise<void>;
};

export default function LikeButton({ liked, likeCount, onLikeToggle }: Props) {
  const [isLiked, setIsLiked] = useState(liked);
  const [count, setCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading) return;
    const newState = !isLiked;
    setIsLiked(newState);
    setCount(newState ? count + 1 : count - 1);
    setLoading(true);
    try {
      await onLikeToggle(newState);
    } catch (err) {
      setIsLiked(!newState);
      setCount(newState ? count - 1 : count + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleLike} disabled={loading}>
      <FontAwesome
        name={isLiked ? 'heart' : 'heart-o'}
        size={18}
        color={isLiked ? '#E74C3C' : '#aaa'}
        style={styles.icon}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#999" style={styles.loading} />
      ) : (
        <Text style={styles.count}>{count}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  count: {
    color: '#ccc',
    fontSize: 14,
  },
  loading: {
    marginLeft: 6,
  },
});
