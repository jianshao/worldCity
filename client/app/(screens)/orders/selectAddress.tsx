import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAddressStore } from "@/store/addressStore";
import { useAuth } from "@/context/AuthContext";
import { GetUserAddresses } from "@/lib/user";
import { AddressResp } from "@/types/user";

export default function SelectAddressScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressResp[]>();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      GetUserAddresses(user?.id).then((res) => {
        setAddresses(res.addresses);
      });
    }
  }, [user]);

  const handleSelect = (item: AddressResp) => {
    // 👇 可以将选中地址回传上一页（或通过全局状态、storage等保存）
    console.log("选择地址：", item);
    useAddressStore.getState().setSelectedAddress(item);
    router.back();
  };

  const goToAddAddress = () => {
    router.push("/orders/addAddress"); // 你要创建 addAddress 页面
  };

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>选择服务地址</Text>
      </View>

      {/* 地址列表 */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {addresses &&
          addresses.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleSelect(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
                {item.is_default && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>默认</Text>
                  </View>
                )}
              </View>
              <Text style={styles.address}>{item.address}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* 添加地址按钮 */}
      <TouchableOpacity style={styles.addBtn} onPress={goToAddAddress}>
        <Text style={styles.addBtnText}>+ 添加新地址</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 12,
  },
  card: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  phone: {
    color: "#ccc",
    marginLeft: 12,
    fontSize: 14,
  },
  tag: {
    marginLeft: 8,
    backgroundColor: "#00B0FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
  },
  address: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 20,
  },
  addBtn: {
    padding: 16,
    borderTopColor: "#222",
    borderTopWidth: 1,
    backgroundColor: "#111",
    alignItems: "center",
  },
  addBtnText: {
    color: "#00B0FF",
    fontSize: 16,
  },
});
