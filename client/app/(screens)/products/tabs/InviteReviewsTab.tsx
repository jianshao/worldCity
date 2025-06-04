import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ScrollView } from "react-native";

interface ReviewInfo {
  id: string;
  avatar: string;
  username: string;
  content: string;
  score: number;
  time: string;
}

export interface InviteReviewsProp {
  uid: string;
}

const mockReviews = [
  {
    id: "1",
    avatar:
      "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
    username: "小林",
    content: "服务很棒，人也很可爱，下次还会约～",
    score: 4,
    time: "2025-05-02",
  },
  {
    id: "2",
    avatar:
      "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
    username: "Leo",
    content: "聊得很开心，非常满意！",
    score: 4,
    time: "2025-04-30",
  },
];

const InviteReviewsTab = ({ uid }: InviteReviewsProp) => {
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);
  useEffect(() => {
    // 根据uid从api获取对该服务者邀约的评价，可以添加分页
    setReviews(mockReviews);
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40, // 预留底部按钮空间
  },
  container: { padding: 16 },
  item: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: { color: "#fff", fontWeight: "bold", marginBottom: 2 },
  content: { color: "#ccc", fontSize: 14 },
  time: { color: "#666", fontSize: 12, marginTop: 4 },
});

export default InviteReviewsTab;
