// src/app/(tabs)/contacts.tsx (或其他你的 Tab 路由路径)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList, // 或者 SectionList 实现分组和索引
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  SectionList, // 使用 SectionList 更适合通讯录
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import { NIMSDK } from 'path/to/your/nim/sdk'; // 导入你的 NIM SDK 实例
// import pinyin from 'pinyin'; // 可能需要库来处理汉字转拼音

// --- Mock Data (用 NIM SDK 数据替换) ---
const mockContacts = [
  { id: "3", name: "AAAchen", avatar: "https://picsum.photos/50?random=3" },
  { id: "4", name: "Amua", avatar: "https://picsum.photos/50?random=4" },
  { id: "2", name: "张三岁", avatar: "https://picsum.photos/50?random=2" },
  { id: "1", name: "发世界咯", avatar: "https://picsum.photos/50?random=1" },
  { id: "5", name: "cokeikih", avatar: "https://picsum.photos/50?random=5" },
  // ... more contacts
];

interface Contact {
  id: string; // NIM Account ID
  name: string; // 昵称 (备注名优先)
  avatar: string; // 头像 URI
}

interface Section {
  title: string;
  data: Contact[];
}

// --- Helper Function (需要实现) ---
const groupContacts = (contacts: Contact[]): Section[] => {
  // 1. 按昵称（或备注）首字母排序
  // 2. 使用 pinyin 库处理中文，非中文按原字符
  // 3. 分组成 [{ title: 'A', data: [...] }, { title: 'B', data: [...] }, ...] 格式
  // 4. 返回分组后的数组
  // 这是一个简化的示例
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  const grouped: { [key: string]: Contact[] } = {};
  sorted.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase(); // 简化处理，需要更完善的拼音逻辑
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(contact);
  });
  return Object.keys(grouped)
    .sort()
    .map((key) => ({ title: key, data: grouped[key] }));
};

// --- Components ---
const ContactItem = ({
  contact,
  onPress,
}: {
  contact: Contact;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.contactRow} onPress={onPress}>
    <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
    <Text style={styles.contactName}>{contact.name}</Text>
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

export default function ContactsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [contactSections, setContactSections] = useState<Section[]>([]);

  useEffect(() => {
    // --- NIM SDK Integration Point ---
    // 1. 获取好友列表
    // const friends = await NIMSDK.userManager.myFriends();
    // const friendUserInfos = await NIMSDK.userManager.fetchUserInfos(friends.map(f => f.userId));
    // const formattedContacts = formatContacts(friendUserInfos); // 格式化，获取头像、昵称（处理备注）
    // setContacts(formattedContacts);
    // 2. 监听好友关系/用户信息变化
    // NIMSDK.userManager.addDelegate(userDelegate);
    // return () => NIMSDK.userManager.removeDelegate(userDelegate);
  }, []);

  useEffect(() => {
    // 当 contacts 或 searchQuery 变化时，重新分组
    const filteredContacts = contacts.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const grouped = groupContacts(filteredContacts);
    setContactSections(grouped);
  }, [contacts, searchQuery]);

  const navigateToChat = (contact: Contact) => {
    // --- NIM SDK Integration Point ---
    // 跳转到 P2P 聊天
    console.log("Navigating to chat with:", contact.id);
    router.push({
      pathname: "/chat/ChatScreen",
      params: {
        sessionId: contact.id,
        sessionType: "P2P",
        name: contact.name,
        avatar: contact.avatar,
      },
    });
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <ContactItem contact={item} onPress={() => navigateToChat(item)} />
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: Section;
  }) => <SectionHeader title={title} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>通讯录</Text>
          <TouchableOpacity style={styles.addFriendIcon}>
            <Ionicons name="person-add-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        {/* Contact List */}
        <SectionList
          sections={contactSections}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false} // 根据需要设置是否粘性头部
          // ListHeaderComponent={<></>} // 可以添加 "新的朋友", "群聊" 等入口
          // SectionSeparatorComponent={() => <View style={styles.separator} />} // 分组线
          // ItemSeparatorComponent={() => <View style={styles.itemSeparator} />} // 行分割线
          style={styles.contactList}
          // TODO: 实现右侧字母索引条 (需要额外库或自定义实现)
        />
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: "relative",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  addFriendIcon: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    height: 36,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: "white", fontSize: 15 },
  contactList: { flex: 1 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "black",
  }, // 背景设为黑色
  contactAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  contactName: { color: "white", fontSize: 16 },
  sectionHeader: {
    backgroundColor: "#1C1C1E", // 分组头背景色
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  sectionHeaderText: {
    color: "#AAA", // 分组头文字颜色
    fontSize: 13,
    fontWeight: "500",
  },
  // separator: { height: 1, backgroundColor: '#333' },
  // itemSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: '#222', marginLeft: 68 }, // 左侧留出头像空间
});
