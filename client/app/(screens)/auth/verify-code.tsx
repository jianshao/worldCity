import api from "@/lib/api";
import { Register, VerifyCode } from "@/lib/auth";
import { saveToken } from "@/utils/tokenStorage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

export default function VerifyCodeScreen() {
  const router = useRouter();
  const phone = useLocalSearchParams().phone;
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const res = await VerifyCode(phone.toString(), code.toString());
      const registerRes = await Register({ phone, password });
      await saveToken(registerRes.token);
      router.push("/me/profile-edit");
    } catch (err) {
      Alert.alert("注册失败");
    }
  };

  return (
    <View>
      <TextInput placeholder="验证码" value={code} onChangeText={setCode} />
      <TextInput
        placeholder="密码"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="注册" onPress={register} />
    </View>
  );
}
