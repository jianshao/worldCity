import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import InviteRecommendTab from "../../app/(screens)/products/tabs/InviteRecommendTab";
import InviteAllTab from "../../app/(screens)/products/tabs/InviteAllTab";
import InviteReviewsTab from "../../app/(screens)/products/tabs/InviteReviewsTab";

const InviteTabs = () => {
  const [subTab, setSubTab] = useState<"recommend" | "all" | "reviews">("recommend");

  const renderSubTab = () => {
    switch (subTab) {
      case "recommend":
        return <InviteRecommendTab />;
      case "all":
        return <InviteAllTab />;
      case "reviews":
        return <InviteReviewsTab />;
    }
  };

  return (
    <View>
      <View style={styles.tabBar}>
        {[
          ["recommend", "推荐"],
          ["all", "全部"],
          ["reviews", "评价"],
        ].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setSubTab(key as any)}>
            <Text style={[styles.tabText, subTab === key && styles.active]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderSubTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 10,
  },
  tabText: { color: "#888", fontSize: 14 },
  active: { color: "#fff", fontWeight: "bold", borderBottomColor: "#fff", borderBottomWidth: 2 },
});

export default InviteTabs;
