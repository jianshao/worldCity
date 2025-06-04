import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import WorldWallTab from "./tabs/WallTab";
import ProfileTab from "./tabs/ProfileTab";
import InviteRecommendTab from "./tabs/InviteRecommendTab";
import InviteAllTab from "./tabs/InviteAllTab";
import InviteReviewsTab from "./tabs/InviteReviewsTab";
import { Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getUserInfo, UserInfo } from "@/lib/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import GiftModal from "@/components/GiftModal";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import BackButton from "@/components/GoBackButton";

// const mockData: UserInfo = {
//   id: 1,
//   nickname: "AAAA",
//   birthday: new Date(2003, 5, 1),
//   height: 170,
//   weight: 50,
//   tags: ["甜甜甜", "大奶妹"],
//   images: [
//     "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
//   ],
//   avatar: "",
//   gender: 1,
// };

const screenWidth = Dimensions.get("window").width;

const ProviderDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserInfo>();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // 根据id从api获取profile数据
    getUserInfo(id.toString()).then((userInfo) => {
      console.log("user info: ", userInfo);
      setUser(userInfo);
    });
    // setUser(mockData);
  }, []);

  const [mainTab, setMainTab] = useState<"world" | "profile" | "invite">(
    "world"
  );
  const [inviteSubTab, setInviteSubTab] = useState<
    "recommend" | "all" | "review"
  >("recommend");

  const renderMainTabContent = () => {
    switch (mainTab) {
      case "world":
        return <WorldWallTab uid={id} />;
      case "profile":
        return <ProfileTab uid={id} />;
      case "invite":
        return (
          <>
            <View style={styles.subTabRow}>
              <SubTabBtn
                label="推荐"
                value="recommend"
                selected={inviteSubTab === "recommend"}
                onPress={setInviteSubTab}
              />
              <SubTabBtn
                label="全部"
                value="all"
                selected={inviteSubTab === "all"}
                onPress={setInviteSubTab}
              />
              <SubTabBtn
                label="评价"
                value="review"
                selected={inviteSubTab === "review"}
                onPress={setInviteSubTab}
              />
            </View>
            {inviteSubTab === "recommend" && (
              <InviteRecommendTab uid={id.toString()} />
            )}
            {inviteSubTab === "all" && <InviteAllTab uid={id} />}
            {inviteSubTab === "review" && (
              <InviteReviewsTab uid={id.toString()} />
            )}
          </>
        );
    }
  };

  const BottomActions = ({ onGiftPress, onAddFriend }: any) => {
    return (
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 1 }]}>
        <Pressable style={styles.actionButton} onPress={onAddFriend}>
          <Ionicons
            name="person-add"
            size={18}
            color="#000"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.buttonText}>加好友</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={onGiftPress}>
          <FontAwesome5
            name="gift"
            size={16}
            color="#000"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.buttonText}>送礼物</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <ScrollView style={styles.container}>
        <BackButton />
        <Image
          source={{
            uri: user?.photos ? user.photos[0] : "",
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user?.nickname}</Text>
          <Text style={styles.desc}>
            {user?.height}cm | {user?.weight}kg | {user?.birthday.split("T")[0]}
          </Text>
          <Text style={styles.desc}>ID: {user?.id}</Text>
          <View style={styles.tagContainer}>
            {(user?.tags || []).map((tag) => (
              <Text key={tag.id} style={styles.tag}>
                {tag.tag}
              </Text>
            ))}
          </View>
        </View>
        {/* 主 Tab */}
        <View style={styles.tabRow}>
          <TabBtn
            label="世界墙"
            value="world"
            selected={mainTab === "world"}
            onPress={setMainTab}
          />
          <TabBtn
            label="个人资料"
            value="profile"
            selected={mainTab === "profile"}
            onPress={setMainTab}
          />
          <TabBtn
            label="邀约"
            value="invite"
            selected={mainTab === "invite"}
            onPress={setMainTab}
          />
        </View>
        {renderMainTabContent()}
      </ScrollView>
      {/* 底部操作栏 */}
      <BottomActions
        onGiftPress={() => setShowGiftModal(true)}
        onAddFriend={() => {
          console.log("发送好友申请");
          router.push("/products/AddFriend");
        }}
      />
      <GiftModal
        visible={showGiftModal}
        balance={user?.coins || 0}
        onClose={() => setShowGiftModal(false)}
        onSendGift={(gift, count) => {
          setShowGiftModal(false);
          console.log(`送出礼物：${gift.name} ×${count}`);
          // TODO: 发请求或展示动画
        }}
      />
    </View>
  );
};

const TabBtn = ({ label, value, selected, onPress }: any) => (
  <TouchableOpacity onPress={() => onPress(value)} style={styles.tabBtn}>
    <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const SubTabBtn = ({ label, value, selected, onPress }: any) => (
  <TouchableOpacity onPress={() => onPress(value)} style={styles.subTabBtn}>
    <Text style={[styles.subTabText, selected && styles.subTabTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    bottom: 0,
  },
  avatar: {
    width: screenWidth,
    height: 260,
  },
  info: {
    padding: 16,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  desc: {
    color: "#aaa",
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#333",
    color: "#ccc",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    color: "#888",
    fontSize: 16,
  },
  tabTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  subTabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  subTabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#222",
  },
  subTabText: {
    color: "#aaa",
    fontSize: 14,
  },
  subTabTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "#222",
  },
  btn: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    zIndex: 99,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  giftButton: {
    backgroundColor: "#FF69B4",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProviderDetailScreen;
