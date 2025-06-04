import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { UserInfo } from "@/lib/user";
import { calculateAge } from "@/utils/timeFormat";
// import ImageViewing from "react-native-image-viewing";
import ImageViewer from "react-native-image-zoom-viewer";

interface UserCardProp {
  user: UserInfo;
}

const screenWidth = Dimensions.get("window").width;

const default_image =
  "https://media.istockphoto.com/id/1329865693/photo/portrait-of-perfectly-looking-young-brown-haired-woman-with-long-hair-wearing-in-exquisite.jpg?s=1024x1024&w=is&k=20&c=NWPnU6PzoOlYEFNA6cQbqFpOXGrQQy7nq8iucenruKc=";

const UserCard: React.FC<UserCardProp> = ({ user }) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePress = () => {
    router.push(`/products/${user.id}`);
  };

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  return (
    <>
      <Pressable style={styles.card} onPress={handlePress}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user.photos ? user.photos[currentIndex] : default_image,
            }}
            style={styles.avatar}
          />
          <Text style={styles.onlineText}>• 2小时前在线</Text>

          <View style={styles.thumbnailOverlay}>
            {user.photos &&
              user.photos.slice(0, 6).map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleThumbnailPress(index)}
                >
                  <Image source={{ uri: img }} style={styles.thumbnail} />
                </TouchableOpacity>
              ))}
          </View>

          {/* 小图横滑区域，浮于大图下方 */}
          <FlatList
            data={user.photos}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.worksContainer}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleThumbnailPress(index)}>
                <Image source={{ uri: item }} style={styles.workImage} />
              </TouchableOpacity>
            )}
          />
        </View>

        <Text style={styles.name}>{user.nickname}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.ageCityText}>
            {calculateAge(user.birthday)}岁 · {"上海"}
          </Text>

          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>查看代表作 &gt;</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  workImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  worksContainer: {
    position: "absolute",
    bottom: 6,
    left: 6,
    right: 6,
    paddingHorizontal: 4,
    flexDirection: "row",
  },
  card: {
    // flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    width: (screenWidth - 36) / 2,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  onlineText: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#00FF00",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  thumbnailOverlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
    right: 6,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 4,
    borderRadius: 8,
    gap: 6,
    justifyContent: "flex-start",
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 4,
  },
  name: {
    marginTop: 8,
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 10,
  },
  ageCityText: {
    fontSize: 12,
    color: "#999",
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#1A1A1A",
  },
  viewBtnText: {
    fontSize: 12,
    color: "#777",
  },
});
