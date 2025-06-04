"use client";

import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FilterButton({ onPress }: { onPress: () => void }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="filter" size={15} color="#fff" />
      {/* <Text style={styles.text}>筛选</Text> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
});
