import { Post } from "@/lib/moment";
import { GetUserMoments } from "@/lib/user";
import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, ScrollView } from "react-native";

const WallTab = ({ uid }: any) => {
  const mockImages = [
    "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
    "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
    "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
    "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
  ];
  const [moments, setMoments] = useState<Post[]>([]);
  useEffect(() => {
    GetUserMoments(uid).then((res) => {
      setMoments(res.moments);
    });
  }, [uid]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>享受此刻</Text>
      {/* 展示moment卡片 */}
      <View style={{ flex: 1 }}>
        {moments &&
          moments.slice(0, 6).map((moment) => (
            <View style={styles.moment}>
              {moment.moment.content.length > 0 && (
                <Text style={styles.content}>{moment.moment.content}</Text>
              )}
              {moment.moment.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalImageRow}
                >
                  {moment.moment.images.map((src, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: src }}
                      style={styles.horizontalImage}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
      </View>
      {/* <Text style={styles.label}>Today</Text>
      <View style={styles.imageRow}>
        {mockImages.slice(0).map((src, idx) => (
          <Image key={idx} source={{ uri: src }} style={styles.image} />
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { color: "#fff", marginBottom: 8 },
  moment: { flex: 1, flexDirection: "column", padding: 4 },
  content: { color: "#fff" },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  image: { width: "50%", height: "100%", borderRadius: 8, padding: 14 },
  horizontalImageRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },

  horizontalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default WallTab;
