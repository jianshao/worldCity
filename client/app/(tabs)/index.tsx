import TopFilter from "@/components/TopFilter";
import UserCard from "@/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { useUserList } from "@/hooks/useUserList";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = (screenWidth - 16 * 3) / 2; // 左右边距 + 卡片间距

const HomeScreen = () => {
  const {
    users,
    loading,
    refreshing,
    loadMore,
    refresh,
    currentCity,
    setCity: setCurrentCity,
    currentChannel,
    setChannel: setCurrentChannel,
  } = useUserList();


  return (
    <View style={styles.container}>
      <TopFilter />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        renderItem={({ item }) => <UserCard user={item} />}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000", // 可根据实际调整
  },
  listContent: {
    paddingVertical: 8,
  },
  list: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 80, // 留出底部导航栏位置
    backgroundColor: "#000",
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: "#111",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  onlineBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    fontSize: 10,
    color: "#fff",
    backgroundColor: "#27C84A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
    marginHorizontal: 4,
    gap: 4,
  },
  thumbImg: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  userInfo: {
    padding: 10,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 6,
  },
  viewBtn: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  viewBtnText: {
    color: "#ccc",
    fontSize: 12,
  },
});

export default HomeScreen;
