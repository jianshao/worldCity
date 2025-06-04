import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import WallTab from "@/app/(screens)/products/tabs/WallTab";
import ProfileTab from "../../app/(screens)/products/tabs/ProfileTab";
import InviteTabs from "./InviteTabs";

const MainTabs = () => {
  const [tab, setTab] = useState<"wall" | "profile" | "invite">("wall");

  const renderTab = () => {
    switch (tab) {
      case "wall":
        return <WallTab />;
      case "profile":
        return <ProfileTab />;
      case "invite":
        return <InviteTabs />;
    }
  };

  return (
    <View>
      <View style={styles.tabBar}>
        {[
          { key: "wall", label: "世界墙" },
          { key: "profile", label: "个人资料" },
          { key: "invite", label: "邀约" },
        ].map(({ key, label }) => (
          <TouchableOpacity key={key} onPress={() => setTab(key as any)}>
            <Text
              style={[
                styles.tabText,
                tab === key && styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  tabText: {
    fontSize: 14,
    color: "#888",
    paddingVertical: 6,
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
});

export default MainTabs;
