import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import PostCard from "@/components/PostCard";
import api from "@/lib/api";
import { useRouter } from "expo-router";
import { GetMoments, Post } from "@/lib/moment";

export default function WorldFeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>();
  useEffect(() => {
    // 从api获取posts
    try {
      GetMoments().then((res) => {
        setPosts(res.moments);
      });
    } catch (err) {
      alert(err);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>世界墙</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/moment/post");
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.moment.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    height: 60,
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
