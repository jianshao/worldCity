// 文件名: src/app/orders/CancelReason.tsx (或其他你定义的路径)

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView, // 用于防止键盘遮挡输入框
  Alert, // 用于提交时的提示
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoBackButton from "@/components/GoBackButton"; // 复用返回按钮组件
import { CancelOrder } from "@/lib/order";

// 定义取消原因列表
const CANCEL_REASONS = [
  "临时有事",
  "地址填写错误",
  "商户未按时到达",
  "商户由于上单续购无法服务",
  "下单后商户未主动联系",
];

export default function CancelReasonScreen() {
  const router = useRouter();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const { orderNo } = useLocalSearchParams();

  // 处理勾选/取消勾选预设原因
  const handleToggleReason = (reason: string) => {
    setSelectedReasons(
      (prevSelected) =>
        prevSelected.includes(reason)
          ? prevSelected.filter((r) => r !== reason) // 取消勾选
          : [...prevSelected, reason] // 勾选
    );
  };

  // 处理“取消”按钮点击
  const handleCancel = () => {
    router.back(); // 直接返回上一页
  };

  // 处理“确认”按钮点击
  const handleSubmit = () => {
    // 组合最终的原因
    const finalReasons = [...selectedReasons];
    if (otherReason.trim()) {
      finalReasons.push(otherReason.trim());
    }

    // 校验：至少选择一个原因或填写其他原因
    if (finalReasons.length === 0) {
      Alert.alert("提示", "请至少选择一个取消原因或填写其他原因");
      return;
    }

    // --- 在这里执行实际的取消订单逻辑 ---
    // 1. 调用 API 发送取消请求，传递 finalReasons
    // 2. 处理 API 响应 (成功/失败)
    console.log("提交取消订单:", finalReasons);
    Alert.alert("提交成功", `取消原因：${finalReasons.join(", ")}`); // 模拟成功提示
    CancelOrder(orderNo.toString(), finalReasons).then((res) => {
      // 成功后可能需要跳转到订单列表页或其他页面，或者只是返回
      router.back(); // 示例：返回上一页
    });
    // 或者 router.replace('/orders'); // 跳转到订单列表并替换当前页面
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // 处理键盘遮挡
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <GoBackButton />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerText}>取消订单</Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // 点击滚动区域时收起键盘
        >
          {/* 提示语 */}
          <Text style={styles.instructionText}>请选择取消订单原因(可多选)</Text>

          {/* 原因列表 */}
          <View style={styles.reasonsList}>
            {CANCEL_REASONS.map((reason) => {
              const isSelected = selectedReasons.includes(reason);
              return (
                <TouchableOpacity
                  key={reason}
                  style={styles.reasonRow}
                  onPress={() => handleToggleReason(reason)}
                  activeOpacity={0.7}
                >
                  {/* 自定义 Checkbox */}
                  <View
                    style={[
                      styles.checkboxBase,
                      isSelected && styles.checkboxChecked,
                    ]}
                  >
                    {isSelected && (
                      // 使用 Ionicons 或其他图标库的 checkmark 图标
                      <Ionicons
                        name="checkmark-sharp"
                        size={14}
                        color="white"
                      />
                    )}
                  </View>
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 其他原因 */}
          <Text style={styles.otherReasonLabel}>其他原因</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="请输入其他原因..."
            placeholderTextColor="#666" // 暗灰色占位符
            value={otherReason}
            onChangeText={setOtherReason}
            textAlignVertical="top" // Android 垂直对齐
            numberOfLines={4} // 建议初始高度
          />
        </ScrollView>

        {/* 底部按钮 */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmit}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "black", // 背景色应用到 KeyboardAvoidingView
  },
  container: {
    flex: 1,
    // backgroundColor: 'black', // 移到 KeyboardAvoidingView
    paddingTop: 50, // 根据实际 Header 高度调整
  },
  // --- Header Styles (与 OrderDetail 类似) ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20, // Header 下方间距
    height: 44,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 30, // 与 GoBackButton 宽度近似
  },

  // --- ScrollView Styles ---
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120, // 确保底部按钮不会遮挡内容
  },

  // --- Instruction Styles ---
  instructionText: {
    color: "#AAA", // 浅灰色
    fontSize: 14,
    marginBottom: 16,
  },

  // --- Reasons List Styles ---
  reasonsList: {
    marginBottom: 24,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12, // 行垂直内边距
  },
  checkboxBase: {
    width: 20,
    height: 20,
    borderRadius: 4, // 轻微圆角
    borderWidth: 1.5,
    borderColor: "#888", // 未选中边框颜色
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // 未选中背景透明
  },
  checkboxChecked: {
    backgroundColor: "#00BFFF", // 选中背景色 (亮蓝色，接近截图)
    borderColor: "#00BFFF", // 选中边框同色
  },
  reasonText: {
    color: "white",
    fontSize: 15,
    flexShrink: 1, // 允许文本换行
  },

  // --- Other Reason Styles ---
  otherReasonLabel: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1C1C1E", // 深灰色背景
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    fontSize: 15,
    minHeight: 100, // 最小高度
    borderWidth: 1,
    borderColor: "#333", // 轻微边框
  },

  // --- Bottom Buttons Styles (与 OrderDetail 类似，但样式细节不同) ---
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between", // 改为 space-between
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    backgroundColor: "black",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#222",
  },
  cancelBtn: {
    flex: 1, // 各占一半空间
    paddingVertical: 12,
    marginRight: 8, // 按钮间距
    borderRadius: 999, // Pill shape
    borderWidth: 1,
    borderColor: "#888", // 灰色边框
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // 透明背景
  },
  cancelText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  confirmBtn: {
    flex: 1, // 各占一半空间
    paddingVertical: 12,
    marginLeft: 8, // 按钮间距
    borderRadius: 999, // Pill shape
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
  },
});
