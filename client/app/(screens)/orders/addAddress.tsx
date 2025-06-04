// app/addAddress.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CreateAddress } from "@/lib/user";
import { useAuth } from "@/context/AuthContext";

export default function AddAddressScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const { user, setReflesh } = useAuth();

  const handleSave = () => {
    if (!user?.id) {
      alert("先登录");
      return;
    }
    if (!name || !phone || !address) {
      Alert.alert("提示", "请填写完整信息");
      return;
    }

    const payload = {
      name,
      phone,
      address,
      is_default: isDefault,
    };
    // 你可以发起后端请求保存地址
    console.log("保存地址：", payload);
    CreateAddress(user?.id || 0, payload).then((res) => {
      setReflesh(true);
      router.back(); // 返回上一页
    });
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>新增地址</Text>
      </View>

      {/* 表单区域 */}
      <View style={styles.form}>
        <Text style={styles.label}>收货人姓名</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="请输入姓名"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>手机号</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="请输入手机号"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>详细地址</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={address}
          onChangeText={setAddress}
          multiline
          placeholder="请输入详细地址"
          placeholderTextColor="#666"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>设为默认地址</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: "#555", true: "#00B0FF" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* 保存按钮 */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>保存</Text>
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
  form: {
    padding: 16,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 16,
  },
  input: {
    marginTop: 8,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  saveBtn: {
    margin: 20,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
