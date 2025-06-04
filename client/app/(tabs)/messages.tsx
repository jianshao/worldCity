// src/app/(tabs)/messages.tsx (或其他你的 Tab 路由路径)
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import { NIMSDK } from 'path/to/your/nim/sdk'; // 导入你的 NIM SDK 实例

// --- Mock Data (用 NIM SDK 数据替换) ---
const mockFriends = [
  {
    id: "1",
    name: "发世界咯",
    avatar: "https://picsum.photos/50?random=1",
    online: true,
  },
  {
    id: "2",
    name: "张三岁",
    avatar: "https://picsum.photos/50?random=2",
    online: true,
  },
  {
    id: "3",
    name: "AAAchen",
    avatar: "https://picsum.photos/50?random=3",
    online: false,
  },
  {
    id: "4",
    name: "Amua",
    avatar: "https://picsum.photos/50?random=4",
    online: true,
  },
  {
    id: "5",
    name: "cokeikih",
    avatar: "https://picsum.photos/50?random=5",
    online: false,
  },
  // ... more friends
];

const mockConversations = [
  {
    id: "sys_1",
    type: "System",
    name: "新关注我的",
    lastMessage: "Amuai 发来关注申请",
    timestamp: "2025/9/12",
    unread: 1,
    avatar: require("@/assets/images/icon_notification.png"),
  }, // 系统通知需要特定图标
  {
    id: "sys_2",
    type: "System",
    name: "互动消息",
    lastMessage: "Amuai 赞了你的评论",
    timestamp: "2025/9/12",
    unread: 0,
    avatar: require("@/assets/images/icon_interaction.png"),
  },
  {
    id: "team_1",
    type: "Team",
    name: "AAAchen的粉丝群",
    lastMessage: "Amuai: 今天适合出游，有大哥邀约吗？",
    timestamp: "2025/9/12",
    unread: 0,
    avatar: "https://picsum.photos/50?random=6",
  },
  {
    id: "team_2",
    type: "Team",
    name: "张三岁的粉丝群",
    lastMessage: "张三岁 已退出群聊，并将群主转入给你",
    timestamp: "2025/9/12",
    unread: 0,
    avatar: "https://picsum.photos/50?random=7",
  },
  {
    id: "p2p_aaachen",
    type: "P2P",
    name: "AAAchen",
    lastMessage: "太厉害了！",
    timestamp: "2025/9/12",
    unread: 1,
    avatar: "https://picsum.photos/50?random=3",
  },
  {
    id: "p2p_amua",
    type: "P2P",
    name: "Amua",
    lastMessage: "太厉害了！",
    timestamp: "2025/9/12",
    unread: 0,
    avatar: "https://picsum.photos/50?random=4",
  },
  // ... more conversations
];

interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface Conversation {
  id: string; // NIM Session ID
  type: string; //"P2P" | "Team" | "System"; // NIM Session Type (+ 自定义系统类型)
  name: string; // 对方昵称 / 群名称 / 系统通知标题
  lastMessage: string; // 最后一条消息内容预览
  timestamp: string; // 最后一条消息时间戳 (需格式化)
  unread: number; // 未读数
  avatar: any; // 头像 URI 或 require(...)
}

// --- Components ---
const FriendAvatar = ({ friend }: { friend: Friend }) => (
  <TouchableOpacity style={styles.friendItem}>
    <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
    {friend.online && <View style={styles.onlineIndicator} />}
    <Text style={styles.friendName} numberOfLines={1}>
      {friend.name}
    </Text>
  </TouchableOpacity>
);

const ConversationItem = ({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.conversationRow} onPress={onPress}>
    <View style={styles.avatarContainer}>
      <Image
        source={
          typeof conversation.avatar === "string"
            ? { uri: conversation.avatar }
            : conversation.avatar
        }
        style={styles.conversationAvatar}
      />
      {conversation.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {conversation.unread > 99 ? "99+" : conversation.unread}
          </Text>
        </View>
      )}
    </View>
    <View style={styles.conversationContent}>
      <View style={styles.conversationHeader}>
        <Text style={styles.conversationName} numberOfLines={1}>
          {conversation.name}
        </Text>
        <Text style={styles.conversationTime}>{conversation.timestamp}</Text>
      </View>
      <Text style={styles.conversationMessage} numberOfLines={1}>
        {conversation.lastMessage}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function MessageListScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  useEffect(() => {
    // --- NIM SDK Integration Point ---
    // 1. 获取好友列表 (用于顶部) - 可能需要单独接口或从联系人获取
    // fetchFriendsFromNIM();
    // 2. 获取最近会话列表
    // const recentSessions = await NIMSDK.sessionManager.allRecentSessions();
    // const formattedSessions = formatSessions(recentSessions); // 格式化数据
    // setConversations(formattedSessions);
    // 3. 注册会话更新代理/监听器
    // NIMSDK.sessionManager.addDelegate(sessionDelegate);
    // return () => NIMSDK.sessionManager.removeDelegate(sessionDelegate); // 清理
    // 4. 注册用户信息/群组信息更新监听器 (用于头像、昵称更新)
    // NIMSDK.userManager.addDelegate(...)
    // NIMSDK.teamManager.addDelegate(...)
  }, []);

  // NIM 会话更新回调处理
  const handleSessionUpdate = useCallback((updatedSessions: any[]) => {
    // --- NIM SDK Integration Point ---
    // mergeAndUpdateConversations(updatedSessions); // 合并更新到 conversations state
  }, []);

  const navigateToChat = (conversation: Conversation) => {
    // --- NIM SDK Integration Point ---
    // router.push(`/chat/${conversation.id}?type=${conversation.type}&name=${conversation.name}&avatar=${conversation.avatar}`);
    // 参数需要根据你的路由设置调整，传递会话 ID 和类型是必须的
    console.log("Navigating to chat:", conversation.id, conversation.type);
    // 实际跳转，例如:
    router.push({
      pathname: "/chat/ChatScreen", // 指向你的聊天页面文件
      params: {
        sessionId: conversation.id,
        sessionType: conversation.type,
        name: conversation.name,
        avatar: conversation.avatar,
      },
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <ConversationItem
      conversation={item}
      onPress={() => navigateToChat(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>消息</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons
                name="search-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Friend List */}
        <View style={styles.friendSection}>
          <Text style={styles.sectionTitle}>朋友</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendListContainer}
          >
            {friends.map((friend) => (
              <FriendAvatar key={friend.id} friend={friend} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.friendArrow}>
            <Ionicons name="chevron-forward-outline" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Conversation List */}
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          style={styles.conversationList}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Styles --- (样式需要仔细调整以匹配 UI)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    justifyContent: "center", // 中心对齐标题
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    position: "relative", // 为了绝对定位图标
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  headerIcons: {
    flexDirection: "row",
    position: "absolute",
    right: 16,
    top: 10,
    bottom: 10,
    alignItems: "center",
  },
  icon: { marginLeft: 15 },
  friendSection: { paddingHorizontal: 16, marginTop: 10, position: "relative" },
  sectionTitle: { color: "#AAA", fontSize: 14, marginBottom: 10 },
  friendListContainer: { paddingRight: 30 }, // 留出箭头空间
  friendItem: { alignItems: "center", marginRight: 15, width: 60 },
  friendAvatar: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#34C759",
    position: "absolute",
    bottom: 5,
    right: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  friendName: { color: "#DDD", fontSize: 12, textAlign: "center" },
  friendArrow: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingLeft: 10,
  },
  conversationList: { flex: 1, marginTop: 15 },
  conversationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#222",
  },
  avatarContainer: { marginRight: 12, position: "relative" },
  conversationAvatar: { width: 50, height: 50, borderRadius: 25 },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadText: { color: "white", fontSize: 11, fontWeight: "bold" },
  conversationContent: { flex: 1 },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  conversationName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
    marginRight: 10,
  },
  conversationTime: { color: "#888", fontSize: 12 },
  conversationMessage: { color: "#888", fontSize: 14 },
  // Add styles for system icons if needed
});
