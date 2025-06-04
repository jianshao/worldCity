import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      {/* 所有的tab首页都放在/(tabs)/目录下，然后二级页面都放在/app/screens/目录下 */}
      <Tabs.Screen name="index" options={{ title: "首页" }} />
      <Tabs.Screen name="messages" options={{ title: "私聊" }} />
      <Tabs.Screen name="products" options={{ title: "商品" }} />
      <Tabs.Screen name="moments" options={{ title: "朋友圈" }} />
      <Tabs.Screen name="me" options={{ title: "我的" }} />
    </Tabs>
  );
}
