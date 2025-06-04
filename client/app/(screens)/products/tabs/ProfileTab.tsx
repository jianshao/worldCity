import { useAuth } from "@/context/AuthContext";
import { getUserInfo, VideoInfo } from "@/lib/user";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

const mockProfile = `🎬 影视剧
· 忧思剧《银河咖啡馆》（2042）饰演咖啡师「蜜娜」
· 科幻电影《数据之海》（2043）饰演 黑客角色「Neon」
· 古风动画电影《千年之羽》（2044）配音 仙鹤精灵「羽」

🎵 音乐`;


const ProfileTab = ({ uid }: any) => {
  const [videos, setVideos] = useState<VideoInfo[]>();
  const [profile, setProfile] = useState<string>("");

  useEffect(() => {
    // 使用uid从api获取该用户的个人资料
    getUserInfo(uid).then((res) => {
      setProfile(res.desc);
      setVideos(res.videos);
    });
  }, [uid]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.sectionTitle}>职业经历</Text>
      <Text style={styles.desc}>{profile}</Text>

      <Text style={styles.sectionTitle}>代表作</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.videoScroll}
      >
        {videos &&
          videos.map((video, idx) => (
            <TouchableOpacity key={idx} style={styles.videoCard}>
              <Image source={{ uri: video.uri }} style={styles.videoImage} />
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoAccess}>{video.access}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      {/* 额外底部留白 */}
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
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  desc: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
    // whiteSpace: "pre-line",
  },
  videoScroll: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  videoCard: {
    width: 120,
    // height: 120,
    alignItems: "center",
  },
  videoImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 4,
  },
  videoTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  videoAccess: {
    color: "#00FFD1",
    fontSize: 12,
    marginTop: 2,
  },
});

export default ProfileTab;
