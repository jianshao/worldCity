import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/GoBackButton";

export default function AddFriendRequestScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [message, setMessage] = useState("");

  const { user, setUser } = useAuth();

  useEffect(() => {
    setMessage(`我是${user?.nickname}，很高兴遇见你...`);
  }, [user]);

  const handleSendRequest = () => {
    console.log("发送好友申请内容：", message);
    // 这里可以发请求
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top+10 }]}>
      {/* 返回按钮 */}
      <BackButton />

      {/* 提示语 */}
      <Text style={styles.title}>来一句与众不同的搭讪</Text>

      {/* 多行输入框 */}
      <TextInput
        style={styles.textInput}
        value={message}
        onChangeText={setMessage}
        placeholder="我是Jeap，很高兴遇见你..."
        placeholderTextColor="#666"
        multiline
      />

      {/* 提交按钮 */}
      <TouchableOpacity style={styles.button} onPress={handleSendRequest}>
        <Text style={styles.buttonText}>发送好友申请</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  textInput: {
    height: 140,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
