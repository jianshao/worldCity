import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { useAuth } from "@/context/AuthContext";
import { AddTag, DeleteTag, SaveProfile, UserTag } from "@/lib/user";
import BackButton from "@/components/GoBackButton";

export default function ProfileEditPage() {
  const genderMap = new Map<any, any>([
    ["未知", 0],
    ["男", 1],
    ["女", 2],
    [0, "未知"],
    [1, "男"],
    [2, "女"],
  ]);
  const router = useRouter();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [nickname, setNickname] = useState("李逹");
  const [gender, setGender] = useState("男");
  const [birthday, setBirthday] = useState(new Date(1989, 7, 9));
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tags, setTags] = useState<UserTag[]>([]);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showDeleteTagModal, setShowDeleteTagModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const { user, setUser, setReflesh } = useAuth();

  useEffect(() => {
    setReflesh(true);
    if (user) {
      setGender(genderMap.get(user.gender));
      setAvatar(user.avatar);
      setNickname(user.nickname);
      setBirthday(new Date(user.birthday));
      setHeight(user.height.toString());
      setWeight(user.weight.toString());
      setTags(user.tags);
    }
  }, []);

  // 选头像
  const pickImage = (fromCamera: boolean = false) => {
    const options: ImagePicker.ImageLibraryOptions = { mediaType: "photo" };

    const callback = (response: ImagePicker.ImagePickerResponse) => {
      if (response.assets && response.assets.length > 0) {
        setAvatar(response.assets[0].uri || null);
      }
      setShowAvatarModal(false);
    };

    if (fromCamera) {
      ImagePicker.launchCamera(options, callback);
    } else {
      ImagePicker.launchImageLibrary(options, callback);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // 保存数据
  const onSave = async () => {
    setIsSaving(true);
    const formData = {
      avatar,
      nickname,
      gender: genderMap.get(gender),
      birthday: birthday.toISOString().split("T")[0],
      height: height,
      weight: weight,
      tags,
    };

    try {
      if (user?.id) {
        SaveProfile(user?.id || 0, formData).then((res) => {
          // setUser(res);
          setReflesh(true);
          alert("保存成功");
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("保存失败", "请检查网络后重试");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>编辑个人资料</Text>
        <TouchableOpacity onPress={onSave} disabled={isSaving}>
          {isSaving ? (
            <Text style={[styles.saveText, { opacity: 0.5 }]}>保存中...</Text>
          ) : (
            <Text style={styles.saveText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 基本信息 */}
        <Text style={styles.sectionTitle}>基本信息</Text>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => setShowAvatarModal(true)}
        >
          <Text style={styles.itemLabel}>头像</Text>
          <View style={styles.rowRight}>
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("../../../assets/images/avatar-placeholder.png")
              }
              style={styles.avatar}
            />
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </View>
        </TouchableOpacity>

        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>昵称</Text>
          <TextInput
            style={styles.textInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => setShowGenderModal(true)}
        >
          <Text style={styles.itemLabel}>性别</Text>
          <View style={styles.rowRight}>
            <Text style={styles.itemValue}>{gender}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.itemLabel}>生日</Text>
          <View style={styles.rowRight}>
            <Text style={styles.itemValue}>
              {birthday.getFullYear()}/{birthday.getMonth() + 1}/
              {birthday.getDate()}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </View>
        </TouchableOpacity>

        {/* 详细信息:身高、体重 */}
        <Text style={styles.sectionTitle}>详细信息</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>身高</Text>
          <TextInput
            style={styles.textInput}
            value={height}
            onChangeText={setHeight}
            placeholder="请输入身高"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>体重</Text>
          <TextInput
            style={styles.textInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="请输入体重"
            placeholderTextColor="#666"
          />
        </View>

        {/* 标签 */}
        <Text style={styles.sectionTitle}>我的标签</Text>

        <View style={styles.tagsContainer}>
          <TouchableOpacity
            style={styles.addTag}
            onPress={() => setShowAddTagModal(true)}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addTagText}>添加</Text>
          </TouchableOpacity>

          {tags &&
            tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onLongPress={() => {
                  setSelectedTagIndex(index);
                  setShowDeleteTagModal(true);
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text style={styles.tagText}>{tag.tag}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      DeleteTag(user?.id || 0, tag.id).then(() => {
                        const idToDelete = tag.id;
                        setTags(tags.filter((tag) => tag.id != idToDelete));
                      });
                    }}
                    style={styles.deleteIcon}
                  >
                    <Ionicons name="close-circle" size={20} color="#ccc" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      {/* 日期选择器 */}
      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setBirthday(selectedDate);
          }}
        />
      )}

      {/* 性别弹窗 */}
      <Modal
        isVisible={showGenderModal}
        onBackdropPress={() => setShowGenderModal(false)}
      >
        <View style={styles.modalContent}>
          {["男", "女"].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.modalOption}
              onPress={() => {
                setGender(option);
                setShowGenderModal(false);
              }}
            >
              <Text style={styles.modalOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* 添加标签弹窗 */}
      <Modal
        isVisible={showAddTagModal}
        onBackdropPress={() => setShowAddTagModal(false)}
      >
        <View style={styles.modalContent}>
          <TextInput
            placeholder="输入标签名"
            placeholderTextColor="#999"
            style={styles.modalInput}
            value={newTag}
            onChangeText={setNewTag}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              // 发起创建tag api请求
              if (newTag != "") {
                AddTag(user?.id || 0, newTag.trim()).then((res) => {
                  setTags([...tags, res]);
                  setNewTag("");
                  setShowAddTagModal(false);
                });
              }
            }}
          >
            <Text style={styles.modalButtonText}>添加标签</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 删除标签弹窗 */}
      <Modal
        isVisible={showDeleteTagModal}
        onBackdropPress={() => setShowDeleteTagModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>确定要删除这个标签吗？</Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.modalButton, { flex: 1, marginRight: 5 }]}
              onPress={() => {
                if (selectedTagIndex !== null) {
                  setTags(tags.filter((_, idx) => idx !== selectedTagIndex));
                }
                setShowDeleteTagModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { flex: 1, marginLeft: 5 }]}
              onPress={() => setShowDeleteTagModal(false)}
            >
              <Text style={styles.modalButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 头像选择弹窗 */}
      <Modal
        isVisible={showAvatarModal}
        onBackdropPress={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => pickImage(false)}
          >
            <Text style={styles.modalOptionText}>从相册选择</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => pickImage(true)}
          >
            <Text style={styles.modalOptionText}>拍照上传</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", // 暗黑背景
  },
  header: {
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  saveText: {
    color: "#00D68F", // 青绿色主色
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    color: "#999",
    fontSize: 14,
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  itemRow: {
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  itemLabel: {
    color: "#ccc",
    fontSize: 15,
  },
  itemValue: {
    color: "#666",
    fontSize: 15,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  textInput: {
    color: "#fff",
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 1,
    textAlign: "right",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 10,
  },
  addTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00D68F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addTagText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 13,
  },
  tag: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: "#ccc",
    fontSize: 13,
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalOption: {
    width: "100%",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    alignItems: "center",
  },
  modalOptionText: {
    color: "#00D68F",
    fontSize: 16,
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    marginBottom: 12,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#00D68F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  deleteIcon: {
    padding: 2,
  },
});
