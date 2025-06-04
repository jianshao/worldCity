import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Props {
  providerId: string;
}

const ProviderInfo = ({ providerId }: Props) => {
  // ⚠️ 实际开发中可以根据 providerId 发请求加载数据
  const mock = {
    avatar:
      "https://img.zcool.cn/community/01e0075b7d4858a8012193a3403850.jpg@1280w_1l_2o_100sh.jpg",
    name: "AAACchen",
    info: "006 | 170cm | 50kg | 88-63-90",
    id: "ID:2877000927",
    tags: [
      "小甜妞",
      "花里胡哨",
      "身体棒",
      "气质女王",
      "服务到位",
      "人美心善",
    ],
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: mock.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{mock.name}</Text>
      <Text style={styles.info}>{mock.info}</Text>
      <Text style={styles.id}>{mock.id}</Text>
      <View style={styles.tagsContainer}>
        {mock.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  info: { fontSize: 14, color: "#ccc", marginTop: 4 },
  id: { fontSize: 12, color: "#888", marginTop: 4 },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
  },
  tagText: { fontSize: 12, color: "#fff" },
});

export default ProviderInfo;
