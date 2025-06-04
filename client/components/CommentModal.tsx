// components/CommentModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Modal from "react-native-modal";

export type Comment = {
  id: string;
  username: string;
  content: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onSubmitComment: (text: string) => void;
};

export default function CommentModal({
  visible,
  onClose,
  comments,
  onSubmitComment,
}: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSubmitComment(text);
      setText("");
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={styles.commentList}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  container: {
    height: "60%",
    backgroundColor: "#121212",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  commentList: {
    paddingBottom: 10,
  },
  commentItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    paddingVertical: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    color: "#ccc",
    fontSize: 14,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 14,
  },
  sendBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#0af",
    borderRadius: 16,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
