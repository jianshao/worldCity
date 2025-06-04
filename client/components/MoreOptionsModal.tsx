import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";

interface MoreOptionsModalProps {
  isVisible: boolean;
  isSelf: boolean; // 是否是自己发的动态
  onClose: () => void;
  onReport: () => void;
  onDelete: () => void;
}

const MoreOptionsModal: React.FC<MoreOptionsModalProps> = ({
  isVisible,
  isSelf,
  onClose,
  onReport,
  onDelete,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={onReport}>
          <FontAwesome name="flag" size={18} color="#f55" />
          <Text style={styles.optionText}>举报</Text>
        </TouchableOpacity>
        {isSelf && (
          <TouchableOpacity style={styles.option} onPress={onDelete}>
            <FontAwesome name="trash" size={18} color="#f55" />
            <Text style={styles.optionText}>删除</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.option, styles.cancel]} onPress={onClose}>
          <Text style={[styles.optionText, { color: "#999" }]}>取消</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default MoreOptionsModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  cancel: {
    justifyContent: "center",
    borderBottomWidth: 0,
  },
});
