import { useState } from "react";
import { Button, TextInput, View, Text, TouchableOpacity } from "react-native";
import { Login } from "@/lib/auth";
import { saveToken } from "@/utils/tokenStorage";
import { router } from "expo-router";

export default function LoginFS() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await Login(username, password);
      console.log("login token: ", res.token);
      console.log("saved token");
      await saveToken(res.token);
      router.push("/");
    } catch (error) {
      alert("登录失败" + error);
      return;
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>用户名</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>密码</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="登录" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push("/auth/send-code" as any)}>
        <Text style={{ color: "blue", marginTop: 20 }}>没有账号？去注册</Text>
      </TouchableOpacity>
    </View>
  );
}
