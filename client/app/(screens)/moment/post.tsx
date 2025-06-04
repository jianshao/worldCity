import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
  Modal,
  PermissionsAndroid,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image as ImageCompressor } from "react-native-compressor";
import api from "@/lib/api";
import moment, { createMoment } from "@/lib/moment";

const VisibilityMap = new Map<string | number, string | number>([
  ["Public", 0],
  [0, "Public"],
  ["Friends Only", 1],
  [1, "Friends Only"],
  ["Private", 2],
  [2, "Private"],
]);

export default function CreateMomentScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [visibility, setVisibility] = useState(0);
  const [visModalVisible, setVisModalVisible] = useState(false);

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "This app needs access to your photo library",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 9 - images.length,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) return;

        const selectedAssets = response.assets || [];

        const compressedUris: string[] = [];

        for (const asset of selectedAssets) {
          if (asset.uri) {
            try {
              const compressed = await ImageCompressor.compress(asset.uri, {
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.7,
              });
              compressedUris.push(compressed);
            } catch (e) {
              console.warn("压缩失败，使用原图", e);
              compressedUris.push(asset.uri);
            }
          }
        }

        setImages((prev) => [...prev, ...compressedUris].slice(0, 9));
      }
    );
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handlePost = () => {
    if (!text.trim()) return;
    createMoment({
      content: text,
      images: images,
      visibility,
    }).then((res) => {
      alert("发布成功,返回列表页");
      navigation.goBack();
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 顶部操作栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity disabled={!text.trim()} onPress={handlePost}>
          <Text
            style={[styles.postButton, !text.trim() && styles.postDisabled]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      {/* 文本输入 */}
      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        placeholderTextColor="#888"
        multiline
        value={text}
        onChangeText={setText}
        maxLength={10000}
      />

      {/* 图片预览 */}
      <FlatList
        data={images}
        horizontal
        keyExtractor={(uri, index) => uri + index}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        style={{ marginBottom: 10 }}
      />

      {/* 底部工具栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons name="location-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.wordCount}>{text.length}/10000</Text>
        <TouchableOpacity
          style={styles.visibilityButton}
          onPress={() => setVisModalVisible(true)}
        >
          <Text style={styles.visibilityText}>
            🌐 {VisibilityMap.get(visibility)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 可见性弹窗 */}
      <Modal
        animationType="slide"
        transparent
        visible={visModalVisible}
        onRequestClose={() => setVisModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {["Public", "Friends Only", "Private"].map((item, index) => (
              <TouchableOpacity
                key={item}
                style={styles.modalOption}
                onPress={() => {
                  setVisibility(index);
                  setVisModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// 样式保持一致
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postButton: {
    fontSize: 16,
    color: "#4d8bff",
  },
  postDisabled: {
    color: "#888",
  },
  placeholderText: {
    color: "#aaa",
    marginTop: 20,
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 16,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImage: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 2,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "#222",
    paddingVertical: 12,
  },
  leftIcons: {
    flexDirection: "row",
    flex: 1,
  },
  wordCount: {
    color: "#888",
    fontSize: 12,
  },
  visibilityButton: {
    marginLeft: 16,
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  visibilityText: {
    color: "#fff",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#222",
    paddingBottom: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalOption: {
    paddingVertical: 14,
    alignItems: "center",
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
  },
});
