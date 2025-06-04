import { GetUserServices } from "@/lib/user";
import { ProviderResp } from "@/types/provider";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";

interface ObjectInfo {
  id: number;
  image: string;
  title: string;
  desc: string;
  price: number;
  type: number;
  time: string;
}

const mockData = [
  {
    id: 1,
    title: "约会 1 小时",
    price: 499,
    type: 1,
    desc: "日常逛街陪伴，甜蜜贴心服务～",
    time: "1小时",
    image:
      "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
  },
  {
    id: 2,
    title: "二人晚餐",
    price: 799,
    desc: "浪漫烛光晚餐，陪你共度美好时光",
    type: 2,
    time: "2小时",
    image:
      "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
  },
];

export interface InviteRecommendTabProp {
  uid: string;
}

const InviteRecommendTab = ({ uid }: InviteRecommendTabProp) => {
  const [objects, setObjects] = useState<ProviderResp[]>([]);
  useEffect(() => {
    // 根据uid从api获取该用户能提供的服务项目
    GetUserServices(uid).then((res) => {
      setObjects(res.providers);
    });
  }, []);
  return (
    <FlatList
      data={objects}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: item.images ? item.images[0] : "" }}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: { width: 64, height: 64, borderRadius: 8 },
  content: { paddingLeft: 10 },
  title: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  desc: { color: "#ccc", marginVertical: 0 },
  price: { color: "#f88", fontSize: 14, marginTop: 6 },
});

export default InviteRecommendTab;
