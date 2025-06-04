import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import SearchButton from "@/components/SearchButton";

export interface TopTabProp {
  categories: string[];
  activeIndex: number;
  onTabPress: any;
  onSearchPress: () => void;
}

export default function TopTabBar({
  categories,
  activeIndex,
  onTabPress,
  onSearchPress,
}: TopTabProp) {
  return (
    <View style={styles.container}>
      {/* 左侧 Tab 栏 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tabWrapper}
            onPress={() => onTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                index === activeIndex && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {index === activeIndex && <View style={styles.activeUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 右侧搜索图标 */}
      <View>
        <SearchButton onPress={onSearchPress}></SearchButton>
      </View>
      {/* <Pressable style={styles.searchButton} onPress={onSearchPress}>
        <Image
          // source={require("../assets/icons/search.png")} // 替换为你的本地图标
          style={styles.searchIcon}
        />
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  scrollContainer: {
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabWrapper: {
    marginHorizontal: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeUnderline: {
    marginTop: 4,
    width: 30,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
});
