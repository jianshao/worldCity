// components/CommentList.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface CommentListProps {
  providerId: string;
}

export default function CommentList({ providerId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      // 使用 mock 接口或替换为真实接口
      const res = await fetch(`https://your.api/comments?providerId=${providerId}&page=${page}`);
      const data = await res.json();
      if (data.length < 10) setHasMore(false);
      setComments(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('评论加载失败', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.userName}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.date}>{item.createdAt}</Text>
        </View>
      )}
      onEndReached={fetchComments}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="small" color="#999" /> : null}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12, borderBottomColor: '#eee', borderBottomWidth: 1,
  },
  name: {
    fontWeight: 'bold', fontSize: 14,
  },
  content: {
    marginTop: 4, fontSize: 14, color: '#333',
  },
  date: {
    marginTop: 4, fontSize: 12, color: '#999',
  },
});
