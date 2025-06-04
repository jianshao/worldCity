// src/app/chat/ChatScreen.tsx (或其他你定义的路径)
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // 加载指示器
  RefreshControl, // 导入 RefreshControl
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoBackButton from "@/components/GoBackButton"; // 复用返回按钮
// import { NIMSDK, NIMMessage, NIMSessionType } from 'path/to/your/nim/sdk'; // 导入你的 NIM SDK 类型和实例
import GiftPanel from "@/components/GiftPanel"; // 导入礼物面板组件
import GiftModal from "@/components/GiftModal";

// --- Mock Data (用 NIM SDK 消息替换, 保持顺序) ---
const mockMessagesInitial = [
  // 模拟初始加载的消息 (最新的)
  {
    id: "msg1",
    isOutgoing: false,
    text: "您预约哪一天？",
    timestamp: 1670806020000,
    senderAvatar: "https://picsum.photos/40?random=3",
    type: "text",
  },
  {
    id: "msg2",
    isOutgoing: true,
    text: "本周三有空吗",
    timestamp: 1670806080000,
    type: "text",
  },
  {
    id: "msg3",
    isOutgoing: false,
    text: "OK",
    timestamp: 1670806140000,
    senderAvatar: "https://picsum.photos/40?random=3",
    type: "text",
  },
];

const mockMessagesHistory = [
  // 模拟下拉加载的历史消息 (更早的)
  {
    id: "hist2",
    isOutgoing: true,
    text: "在吗？",
    timestamp: 1670805900000,
    type: "text",
  },
  {
    id: "hist1",
    isOutgoing: false,
    text: "你好",
    timestamp: 1670805840000,
    senderAvatar: "https://picsum.photos/40?random=3",
    type: "text",
  },
];

interface Message {
  id: string; // NIM Message ID
  isOutgoing: boolean; // 是否是发送方
  text?: string; // 文本内容
  imageUri?: string; // 图片 URI
  locationData?: any; // 位置信息
  customData?: any; // 自定义消息数据 (如礼物)
  timestamp: number; // 时间戳 (ms)
  senderAvatar?: string; // 发送者头像 (接收方消息需要)
  senderName?: string; // 发送者昵称 (群聊中需要)
  type: string; //'text' | 'image' | 'location' | 'gift' | 'unknown'; // 消息类型
  status?: "sending" | "sent" | "failed" | "read"; // 发送状态
  // (可选) 存储原始 NIM Message 对象或其关键信息用于加载历史记录锚点
  // originalNimMessage?: NIMMessage;
}

// --- Helper Function (保持不变) ---
const formatTimestamp = (timestamp: number, showTime = false): string => {
  const date = new Date(timestamp);
  // 此处应加入更完善的时间格式化逻辑
  return showTime
    ? date.toLocaleString()
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// --- Components (MessageBubble, ChatInput, ExpandedInputOptions 保持不变) ---
const MessageBubble = ({
  message,
  showAvatar,
  showTimestamp,
}: {
  message: Message;
  showAvatar: boolean;
  showTimestamp: boolean;
}) => {
  const isOutgoing = message.isOutgoing;

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return (
          <Text style={isOutgoing ? styles.outgoingText : styles.incomingText}>
            {message.text}
          </Text>
        );
      case "image":
        return (
          <Image
            source={{ uri: message.imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        );
      case "gift":
        return (
          <Text style={isOutgoing ? styles.outgoingText : styles.incomingText}>
            🎁 送出了礼物 {message.customData?.giftId}
          </Text>
        );
      default:
        return (
          <Text style={isOutgoing ? styles.outgoingText : styles.incomingText}>
            [未知消息]
          </Text>
        );
    }
  };

  return (
    <View>
      {showTimestamp && (
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>
            {formatTimestamp(message.timestamp, true)}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.messageRow,
          isOutgoing ? styles.outgoingRow : styles.incomingRow,
        ]}
      >
        {!isOutgoing && showAvatar && (
          <Image source={{ uri: message.senderAvatar }} style={styles.avatar} />
        )}
        {!isOutgoing && !showAvatar && (
          <View style={styles.avatarPlaceholder} />
        )}
        <View
          style={[
            styles.bubble,
            isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
          ]}
        >
          {renderContent()}
        </View>
        {isOutgoing && message.status === "sending" && (
          <ActivityIndicator
            size="small"
            color="#888"
            style={styles.statusIndicator}
          />
        )}
        {isOutgoing && message.status === "failed" && (
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="red"
            style={styles.statusIndicator}
          />
        )}
      </View>
    </View>
  );
};

const ChatInput = ({
  onSend,
  onAddPress,
}: {
  onSend: (text: string) => void;
  onAddPress: () => void;
}) => {
  const [text, setText] = useState("");
  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={onAddPress} style={styles.inputButton}>
        <Ionicons name="add-outline" size={28} color="#AAA" />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="Good mor..."
        placeholderTextColor="#666"
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity style={styles.inputButton}>
        <Ionicons name="happy-outline" size={26} color="#AAA" />
      </TouchableOpacity>
      {text.trim() ? (
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const ExpandedInputOptions = ({
  onOptionSelect,
}: {
  onOptionSelect: (option: string) => void;
}) => (
  <View style={styles.expandedOptionsContainer}>
    {/* ... 选项按钮 ... */}
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => onOptionSelect("Photo")}
    >
      <Ionicons name="image-outline" size={30} color="white" />
      <Text style={styles.optionText}>Photo</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => onOptionSelect("Camera")}
    >
      <Ionicons name="camera-outline" size={30} color="white" />
      <Text style={styles.optionText}>Camera</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => onOptionSelect("Location")}
    >
      <Ionicons name="location-outline" size={30} color="white" />
      <Text style={styles.optionText}>Location</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => onOptionSelect("Gift")}
    >
      <Ionicons name="gift-outline" size={30} color="white" />
      <Text style={styles.optionText}>Gift</Text>
    </TouchableOpacity>
  </View>
);
// --- ChatScreen Component (核心改动) ---
export default function ChatScreen() {
  const router = useRouter();
  const { sessionId, sessionType, name, avatar } = useLocalSearchParams<{
    sessionId: string;
    sessionType: "P2P" | "Team";
    name: string;
    avatar?: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]); // 初始为空
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // 用于 RefreshControl
  const [showExpandedOptions, setShowExpandedOptions] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false); // 标记首次加载是否完成
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // --- NIM SDK Integration Point (保持大部分不变) ---
    // ... 创建/获取 session, 注册监听器 ...

    // 1. 修改：只加载最新的少量消息作为首次展示
    loadHistoryMessages(true); // 首次加载

    // ... 标记已读, 获取用户信息等 ...

    return () => {
      // ... 清理监听器 ...
    };
  }, [sessionId, sessionType]);

  // 滚动到底部 (仅在非首次加载且有新消息时)
  const scrollToEnd = (animated = true) => {
    // 确保在列表渲染完成后执行滚动
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated }), 100);
  };

  // 加载历史消息 (改动较大)
  const loadHistoryMessages = useCallback(
    async (isInitialLoad = false) => {
      if (isLoadingHistory) return;
      setIsLoadingHistory(true);

      // --- NIM SDK Integration Point ---
      // 1. 确定锚点消息：
      //    - 首次加载(isInitialLoad=true): 锚点为 null (获取最新的)
      //    - 下拉加载(isInitialLoad=false): 锚点为当前列表最顶部的消息 (messages[0])
      // const anchorNimMessage = isInitialLoad ? null : messages[0]?.originalNimMessage; // 需要存储或能获取原始 NIM Message
      const anchorTimestamp = isInitialLoad
        ? undefined
        : messages[0]?.timestamp; // 或者使用时间戳作为锚点

      console.log(
        `Loading history... Initial: ${isInitialLoad}, Anchor Timestamp: ${anchorTimestamp}`
      );

      try {
        // 2. 调用 NIM SDK 获取消息 (假设返回的消息是从新到旧排序)
        // const historyNimMessages = await NIMSDK.conversationManager.messages(
        //     in: session,
        //     message: anchorNimMessage, // 使用正确的锚点对象
        //     limit: 20
        // );
        // 3. 格式化消息
        // const formattedHistory = formatMessages(historyNimMessages); // 假设返回的格式化数组也是从新到旧

        // 模拟获取数据
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟
        const fetchedMessages = isInitialLoad
          ? mockMessagesInitial
          : messages.length < 5
          ? mockMessagesHistory
          : []; // 模拟最多加载一批历史

        if (fetchedMessages.length > 0) {
          // 4. 更新 state:
          //    - 首次加载: 直接设置
          //    - 下拉加载: 将获取到的【旧】消息放在【现有消息列表】的【前面】
          setMessages((prev) =>
            isInitialLoad ? fetchedMessages : [...fetchedMessages, ...prev]
          );

          if (isInitialLoad) {
            setIsInitialLoadComplete(true); // 标记首次加载完成
            scrollToEnd(false); // 首次加载完成后滚动到底部 (无动画)
          }
          // 注意：下拉加载后不需要自动滚动
        } else {
          console.log("No more history messages.");
        }
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [isLoadingHistory, messages, sessionId, sessionType]
  ); // 依赖项加入 messages

  // 处理接收到的新消息 (改动: 只有在首次加载后才滚动)
  const handleNewMessages = useCallback(
    (newNimMessages: any[]) => {
      // --- NIM SDK Integration Point ---
      // ... 格式化消息, 过滤会话 ...
      // const currentSessionMessages = formatMessages(newNimMessages).filter(...);
      const mockNew: Message = {
        id: `new_${Date.now()}`,
        isOutgoing: false,
        text: "New mock message!",
        timestamp: Date.now(),
        senderAvatar: avatar,
        type: "text",
      };
      const currentSessionMessages = [mockNew]; // 模拟

      if (currentSessionMessages.length > 0) {
        setMessages((prev) => [...prev, ...currentSessionMessages]); // 新消息添加到末尾
        if (isInitialLoadComplete) {
          // 只有在首次加载完成后，收到新消息才滚动
          scrollToEnd();
        }
        // ... 标记已读 ...
      }
    },
    [sessionId, avatar, isInitialLoadComplete]
  ); // 依赖项加入 isInitialLoadComplete

  // 发送文本消息 (改动: 只有在首次加载后才滚动)
  const handleSendText = async (text: string) => {
    // --- NIM SDK Integration Point ---
    // ... 创建消息对象, 更新 UI (sending 状态) ...
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      isOutgoing: true,
      text: text,
      timestamp: Date.now(),
      type: "text",
      status: "sending",
    };
    setMessages((prev) => [...prev, tempMessage]); // 添加到末尾
    if (isInitialLoadComplete) {
      // 只有在首次加载完成后，发送消息才滚动
      scrollToEnd();
    }

    // ... 调用 SDK 发送 ...
    // try { ... onSuccess: updateMessageStatus(id, 'sent') ... } catch { ... onFailure: updateMessageStatus(id, 'failed') ... }
    setTimeout(() => {
      // 模拟发送成功
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempMessage.id ? { ...m, status: "sent" } : m
        )
      );
    }, 1000);
  };

  // 处理 "+" 按钮点击 (不变)
  const handleAddPress = () => {
    setShowGiftPanel(false);
    setShowExpandedOptions(!showExpandedOptions);
  };

  // 处理扩展选项选择 (不变)
  const handleOptionSelect = (option: string) => {
    setShowExpandedOptions(false);
    console.log("Selected option:", option);
    // ... 根据选项执行操作 (发送图片、位置、礼物等) ...
    if (option === "Gift") {
      setShowGiftPanel(true);
    }
  };

  // 处理发送礼物 (不变)
  const handleSendGift = (giftData: any) => {
    setShowGiftPanel(false);
    console.log("Sending gift:", giftData);
    // ... 创建并发送自定义礼物消息 ...
  };

  // renderMessageItem (不变)
  const renderMessageItem = ({
    item,
    index,
  }: {
    item: Message;
    index: number;
  }) => {
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1]; // 需要下一条来判断自己头像是否显示（如果实现的话）

    // 与【上一条】消息时间间隔较长，显示时间戳
    const showTimestamp =
      index === 0 ||
      item.timestamp - (prevMessage?.timestamp ?? 0) > 5 * 60 * 1000;

    // 接收消息，且与【下一条】消息不是同一个人发送，或是最后一条接收消息，显示头像
    const showAvatar =
      !item.isOutgoing &&
      (!nextMessage ||
        nextMessage.isOutgoing ||
        nextMessage.senderAvatar !== item.senderAvatar ||
        index === messages.length - 1);
    return (
      <MessageBubble
        message={item}
        showAvatar={showAvatar}
        showTimestamp={showTimestamp}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // 根据 Header 高度等调整 Offset
      >
        <View style={styles.container}>
          {/* Header (不变) */}
          <View style={styles.header}>
            <GoBackButton />
            <View style={styles.headerCenter}>
              {avatar && (
                <Image source={{ uri: avatar }} style={styles.headerAvatar} />
              )}
              <Text style={styles.headerTitle} numberOfLines={1}>
                {name}
              </Text>
            </View>
            <TouchableOpacity style={styles.headerRight}>
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Message List (核心改动) */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            // 移除了 inverted
            // 移除了 onEndReached, onEndReachedThreshold, ListFooterComponent
            // 添加了 RefreshControl
            refreshControl={
              <RefreshControl
                refreshing={isLoadingHistory}
                onRefresh={() => loadHistoryMessages(false)} // 调用加载，传入 false
                colors={["#888"]} // Spinner 颜色 (Android)
                tintColor={"#888"} // Spinner 颜色 (iOS)
              />
            }
            // 优化:
            // maintainVisibleContentPosition={{ minIndexForVisible: 0 }} // 尝试保持滚动位置，尤其在加载历史消息时
            // onScrollToIndexFailed={() => {}} // 处理滚动失败
          />

          {/* Input Area (不变) */}
          <ChatInput onSend={handleSendText} onAddPress={handleAddPress} />

          {/* Expanded Options (不变) */}
          {showExpandedOptions && (
            <ExpandedInputOptions onOptionSelect={handleOptionSelect} />
          )}

          {/* Gift Panel (不变) */}
          {showGiftPanel && (
            <GiftModal
              visible={showGiftPanel}
              onSendGift={handleSendGift}
              onClose={() => setShowGiftPanel(false)}
              balance={1000}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles (大部分不变, messageList 可能需要微调) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  keyboardAvoidingContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#222",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  headerTitle: { color: "white", fontSize: 17, fontWeight: "600" },
  headerRight: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  messageList: { flex: 1, paddingHorizontal: 10 },
  messageListContent: {
    paddingTop: 10, // 顶部留白
    paddingBottom: 10, // 底部留白
  },
  messageRow: { flexDirection: "row", marginVertical: 5 },
  outgoingRow: { justifyContent: "flex-end", marginLeft: 50 },
  incomingRow: { justifyContent: "flex-start", marginRight: 50 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  avatarPlaceholder: { width: 40, height: 40, marginRight: 8 }, // 用于占位，保持对齐
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  outgoingBubble: { backgroundColor: "#3070F8", borderTopRightRadius: 5 },
  incomingBubble: { backgroundColor: "#333", borderTopLeftRadius: 5 },
  outgoingText: { color: "white", fontSize: 15 },
  incomingText: { color: "white", fontSize: 15 },
  messageImage: { width: 200, height: 150, borderRadius: 10 },
  statusIndicator: { marginLeft: 8, alignSelf: "center" },
  timestampContainer: { alignItems: "center", marginVertical: 15 },
  timestampText: { color: "#888", fontSize: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#222",
    backgroundColor: "#111",
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 8 : 4, // 微调 Android Padding
    fontSize: 16,
    color: "white",
    marginHorizontal: 8,
  },
  inputButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  sendButton: {
    backgroundColor: "#3070F8",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
  },
  sendButtonText: { color: "white", fontWeight: "600" },
  expandedOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#1C1C1E",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
  },
  optionButton: { alignItems: "center", width: 60 },
  optionText: { color: "#AAA", fontSize: 12, marginTop: 5 },
});
