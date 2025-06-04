import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../lib/api';

export default function Followings() {
  const [followings, setFollowings] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFollowings() {
      try {
        const res = await api.get('/user/follow');
        setFollowings(res.data.followings);
      } catch (error) {
        alert('加载失败');
      }
    }
    fetchFollowings();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={followings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
}
