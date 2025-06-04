import api from "@/lib/api";
import { SendCode } from "@/lib/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function SendCodeScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const sendCode = async () => {
    try {
      const res = await SendCode(phone);

      router.push({ pathname: "/auth/verify-code", params: { phone } });
    } catch (err) {
      alert("wrong: " + err);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="请输入手机号"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="发送验证码" onPress={sendCode} />
    </View>
  );
}
