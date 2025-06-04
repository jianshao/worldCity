import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { UserInfo } from "@/lib/user";

export default function MePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [localUser, setlocalUser] = useState<UserInfo | null>();

  useEffect(() => {
    setlocalUser(user);
  }, [user]);

  return (
    <View style={styles.container}>
      {/* 头像+昵称 */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: localUser?.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.username}>{localUser?.nickname}</Text>
            <TouchableOpacity onPress={() => router.push("/me/profile-edit")}>
              {/* 编辑按钮 */}
              <Ionicons
                name="create-outline"
                size={18}
                color="#ccc"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userId}>ID:{localUser?.id}</Text>
        </View>
      </View>

      {/* 开通会员 */}
      <TouchableOpacity style={styles.vipButton}>
        <MaterialIcons name="card-membership" size={20} color="#FFD700" />
        <Text style={styles.vipText}>开通会员</Text>
      </TouchableOpacity>

      {/* 余额+订单 */}
      <View style={styles.balanceOrderContainer}>
        <TouchableOpacity
          style={styles.balanceOrderItem}
          onPress={() => router.push("/me/wallet")}
        >
          <Text style={styles.label}>账户余额</Text>
          <View style={styles.balanceRow}>
            <Ionicons
              name="ellipse"
              size={10}
              color="#FFD700"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.balanceText}>{localUser?.coins}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.balanceOrderItem}
          onPress={() => {
            router.push("/orders/orders");
          }}
        >
          <Text style={styles.label}>我的订单</Text>
          <Text style={styles.balanceText}>5</Text>
        </TouchableOpacity>
      </View>

      {/* 设置 */}
      <TouchableOpacity style={styles.settingsItem}>
        <Ionicons name="settings-outline" size={20} color="#fff" />
        <Text style={styles.settingsText}>设置</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", // 深色背景
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#333",
  },
  profileInfo: {
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  userId: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  vipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  vipText: {
    color: "#FFD700",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  balanceOrderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  balanceOrderItem: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
});
