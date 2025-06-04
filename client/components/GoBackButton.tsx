import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

interface BackButtonProps {
  color?: string;
  size?: number;
  onPress?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  color = "#fff",
  size = 24,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back(); // useRouter 的返回上一页方法
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default BackButton;
