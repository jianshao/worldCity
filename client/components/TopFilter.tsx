"use client";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import FilterButton from "@/components/FilterButton";
import SearchButton from "@/components/SearchButton";
import { useCity } from "@/hooks/useCity";

const channels = ["交友", "邀约", "娱乐"];

// mock 城市列表
const cityData = {
  中国: ["北京", "上海", "广州", "深圳", "杭州", "成都", "重庆"],
  海外: ["新加坡", "曼谷", "吉隆坡", "雅加达", "胡志明市"],
};

export default function TopFilter() {
  const city = useCity();
  const [selectedChannel, setSelectedChannel] = useState("交友");
  const [currentCity, setCurrentCity] = useState("上海");
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentCity(city || "上海");
  }, []);

  const handleCityPress = () => {
    setCityModalVisible(true);
  };

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setCityModalVisible(false);
    // TODO: 可以触发根据城市重新拉取数据
  };

  const handleChannelPress = (channel: string) => {
    if (channel === selectedChannel) return;
    setSelectedChannel(channel);
    setLoadingChannel(true);
    setTimeout(() => {
      setLoadingChannel(false);
      // TODO: 可以触发频道切换重新拉取数据
    }, 800); // 模拟800ms loading
  };

  const handleSearchPress = () => {
    setSearchModalVisible(true);
  };

  const handleFilterPress = () => {
    router.push("/home/filter" as any);
  };

  return (
    <>
      {/* 顶部筛选栏 */}
      <View style={styles.container}>
        {/* 左边：城市 */}
        <TouchableOpacity
          style={styles.cityContainer}
          onPress={handleCityPress}
        >
          <Ionicons name="location-outline" size={14} color="#fff" />
          <Text style={styles.cityText}>{currentCity}</Text>
          <Ionicons name="chevron-down-outline" size={16} color="#999" />
        </TouchableOpacity>

        {/* 中间：频道 */}
        <View style={styles.channelsContainer}>
          {channels.map((channel) => (
            <TouchableOpacity
              key={channel}
              onPress={() => handleChannelPress(channel)}
              style={[
                styles.channelButton,
                selectedChannel === channel && styles.channelButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.channelText,
                  selectedChannel === channel && styles.channelTextSelected,
                ]}
              >
                {channel}
              </Text>
            </TouchableOpacity>
          ))}
          {/* 切换频道 Loading 动画 */}
          {loadingChannel && (
            <ActivityIndicator
              size="small"
              color="#999"
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        {/* 右边：搜索、筛选 */}
        <View style={styles.actionsContainer}>
          <SearchButton onPress={handleSearchPress} />
          <View style={{ width: 8 }} />
          <FilterButton onPress={handleFilterPress} />
        </View>
      </View>

      {/* 城市选择 Modal */}
      <Modal visible={cityModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择城市</Text>
            <FlatList
              data={Object.entries(cityData)}
              keyExtractor={([group]) => group}
              renderItem={({ item: [group, cities] }) => (
                <View>
                  <Text style={styles.groupTitle}>{group}</Text>
                  {cities.map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={styles.cityItem}
                      onPress={() => handleCitySelect(city)}
                    >
                      <Text style={styles.cityName}>{city}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setCityModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 搜索弹窗 Modal */}
      <Modal visible={searchModalVisible} animationType="fade" transparent>
        <View style={styles.searchOverlay}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="请输入关键词"
              style={styles.searchInput}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setSearchModalVisible(false)}
              style={styles.searchCancel}
            >
              <Text style={{ color: "#333" }}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#000",
    // borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 4,
    marginRight: 2,
  },
  channelsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 12,
    marginRight: 12,
  },
  channelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  channelButtonSelected: {
    backgroundColor: "#000",
  },
  channelText: {
    fontSize: 15,
    color: "#777",
  },
  channelTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    height: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },
  cityItem: {
    paddingVertical: 8,
  },
  cityName: {
    fontSize: 14,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 12,
    alignSelf: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#007AFF",
  },
  searchOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  searchInput: {
    fontSize: 16,
    marginBottom: 12,
  },
  searchCancel: {
    alignSelf: "flex-end",
  },
});
