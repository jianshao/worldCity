// src/app/orders/ConfirmOrderScreen.tsx (or your chosen path)
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoBackButton from "@/components/GoBackButton";
import api from "@/lib/api";
import {
  CreateOrderPayload,
  OrderResponse,
  PaymentMethod,
  DeliveryAddressInput,
  UserContactInput,
} from "@/types/order"; // Use snake_case types
import { useAddressStore } from "@/store/addressStore";
import { GetProviderById } from "@/lib/provider";
import { ProviderResp } from "@/types/provider";
import { CreateOrder } from "@/lib/order";

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "alipay",
    name: "支付宝",
    icon: require("@/assets/recharge/alipay.png"),
  }, // Replace with your asset path
  {
    id: "manual_recharge",
    name: "人工充值",
    icon: require("@/assets/recharge/manual.png"),
  },
  {
    id: "digital_rmb",
    name: "数字人民币",
    icon: require("@/assets/recharge/digital_rmb.png"),
  },
  {
    id: "wechat",
    name: "微信",
    icon: require("@/assets/recharge/wechat.png"),
  },
];

// // Helper for Price Formatting
// const formatPrice = (priceString: string): string => {
//   /* ... same as before ... */
//   return priceString;
// };

// --- Main Component ---
export default function OrderConfirmationScreen() {
  const router = useRouter();
  // Assuming productId and providerId are passed via route params
  // 商品的相关信息包含在provider结构里
  const { provider_id } = useLocalSearchParams<{
    provider_id: string;
  }>();

  // --- State ---
  // Replace product/provider with fetched/passed data
  const [provider, setProvider] = useState<ProviderResp>();
  const [quantity, setQuantity] = useState(1);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null); // Use Date object for easier manipulation
  const [remarks, setRemarks] = useState("");
  const [isRemarksExpanded, setIsRemarksExpanded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null); // Store ID (e.g., 'alipay')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedAddress } = useAddressStore();

  // --- Memoized Calculations ---
  const totalAmount = useMemo(() => {
    if (!provider?.price) return "0.00";
    const unitPrice = provider.price;
    if (isNaN(unitPrice)) return "0.00";
    return (unitPrice * quantity).toFixed(2); // Calculate total, keep as string
  }, [provider, quantity]);

  useEffect(() => {
    // 从api拉取provider信息
    if (provider_id) {
      GetProviderById(provider_id.toString()).then((res) => {
        setProvider(res);
      });
    }
  }, [provider_id]);

  // --- Event Handlers ---
  const handleAddressPress = () => {
    router.push(`/orders/selectAddress`);
  };

  const handleSelectTime = () => {
    // TODO: Show Date/Time Picker or navigate to Time Slot Screen
    Alert.alert("提示", "选择时间功能暂未实现");
    // Example callback simulation:
    // setSelectedTime(new Date(2025, 4, 18, 11, 30)); // Month is 0-indexed (4 = May)
  };

  const handleIncrementQuantity = () => {
    setQuantity((q) => q + 1);
  };
  const handleDecrementQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };
  const toggleRemarks = () => {
    setIsRemarksExpanded((prev) => !prev);
  };
  const handleSelectPaymentMethod = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  // --- Order Submission ---
  const handleSubmitOrder = async () => {
    setError(null);

    // --- 1. Validation ---
    if (!selectedAddress) {
      alert("请选择服务地址");
      return;
    }
    // if (!selectedTime) {
    //   alert("请选择服务时间");
    //   return;
    // }
    if (!selectedPaymentMethod) {
      alert("请选择支付方式");
      return;
    }
    if (!provider) {
      alert("商品或商户信息缺失");
      return;
    }

    setIsSubmitting(true);

    // --- 2. Construct Payload (snake_case) ---
    const payload: CreateOrderPayload = {
      provider_id: provider.id,
      merchant_id: 1,
      quantity: quantity,
      service_time: selectedTime ? selectedTime.toISOString() : null, // Format Date to ISO string
      delivery_address: selectedAddress, // Already in correct structure
      // Add remarks if needed in the API (e.g., extend Go DTO)
      // remarks: remarks,
    };

    try {
      // --- 3. API Call ---
      CreateOrder(payload).then((res) => {
        if (res.order_no) {
          const orderNo = res.order_no;
          Alert.alert("成功", "订单提交成功！");

          // --- 4. Navigate to Order Detail ---
          // Replace current screen instead of push if desired
          router.replace({
            pathname: `/orders/[orderNo]`,
            params: { orderNo },
          });
        } else {
          throw new Error("创建订单失败，未收到有效的订单号");
        }
      });
    } catch (err: any) {
      console.error("Error creating order:", err);
      setError(err.message || "提交订单失败，请稍后重试");
      Alert.alert(
        "提交失败",
        err.message || "无法提交订单，请检查网络或稍后重试"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <GoBackButton />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>确认订单</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Address Selection */}
        <TouchableOpacity
          style={[styles.card, styles.touchableRow]}
          onPress={handleAddressPress}
        >
          <Text style={selectedAddress ? styles.label : styles.placeholderText}>
            {selectedAddress.address || "请选择服务地址"}
          </Text>
          {selectedAddress && ( // Display user contact below address if selected
            <Text style={styles.subLabel}>
              {selectedAddress.name} {selectedAddress.phone}
            </Text>
          )}
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Provider and Time */}
        <View style={[styles.card, { paddingVertical: 10 }]}>
          <View style={styles.infoRowStatic}>
            <Text style={styles.label}>服务商户</Text>
            <Text style={styles.valueText}>{provider?.user.nickname}</Text>
          </View>
          <View style={styles.separatorThin} />
          <TouchableOpacity
            style={[styles.infoRowStatic, { paddingVertical: 10 }]}
            onPress={handleSelectTime}
          >
            <Text style={styles.label}>服务时间</Text>
            <View style={styles.valueWithArrow}>
              <Text
                style={selectedTime ? styles.valueText : styles.placeholderText}
              >
                {selectedTime
                  ? selectedTime.toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "请选择"}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#888"
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Product Card */}
        <View style={[styles.card, styles.productCard]}>
          <Image
            source={{ uri: provider?.images ? provider.images[0] : "" }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productPrice}>¥{provider?.price}</Text>
            <Text style={styles.productOptions}>
              已选：{provider?.user.nickname}
            </Text>
            {/* Quantity Stepper */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled,
                ]}
                onPress={handleDecrementQuantity}
                disabled={quantity <= 1 || isSubmitting}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={quantity <= 1 ? "#555" : "white"}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrementQuantity}
                disabled={isSubmitting}
              >
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Subtotal (aligned with product card end) */}
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalText}>合计：¥{totalAmount}</Text>
        </View>

        {/* Remarks */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.remarksHeader}
            onPress={toggleRemarks}
          >
            <Text style={styles.label}>备注</Text>
            <View style={styles.valueWithArrow}>
              <Text style={styles.placeholderText} numberOfLines={1}>
                {remarks || "无备注"}
              </Text>
              <Ionicons
                name={isRemarksExpanded ? "chevron-down" : "chevron-forward"}
                size={20}
                color="#888"
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableOpacity>
          {isRemarksExpanded && (
            <TextInput
              style={styles.remarksInput}
              placeholder="请输入备注信息..."
              placeholderTextColor="#666"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              textAlignVertical="top"
              maxLength={100} // Example limit
            />
          )}
        </View>

        {/* Payment Methods */}
        <View style={[styles.card, { paddingVertical: 5 }]}>
          {PAYMENT_METHODS.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentRow, index === 0 && { borderTopWidth: 0 }]} // No top border for first item
              onPress={() => handleSelectPaymentMethod(method.id)}
              disabled={isSubmitting}
            >
              <Image source={method.icon} style={styles.paymentIcon} />
              <Text style={styles.paymentName}>{method.name}</Text>
              {/* Custom Radio Button */}
              <View
                style={[
                  styles.radioBase,
                  selectedPaymentMethod === method.id && styles.radioChecked,
                ]}
              >
                {selectedPaymentMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Display API Error */}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      {/* Bottom Submit Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotalContainer}>
          <Text style={styles.bottomLabel}>合计 </Text>
          <Text style={styles.bottomTotal}>¥{totalAmount}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="black" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>提交订单</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120 }, // Space for bottom bar + extra
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 44,
    backgroundColor: "black",
  },
  headerTitleContainer: { flex: 1, alignItems: "center" },
  headerText: { color: "white", fontSize: 18, fontWeight: "600" },
  headerPlaceholder: { width: 30 },
  card: {
    backgroundColor: "#1C1C1E", // Dark card background
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  touchableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15, // Increased padding for touchability
  },
  infoRowStatic: {
    // Row without main touch effect
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5, // Reduced padding
  },
  label: { color: "white", fontSize: 15 },
  subLabel: { color: "#AAA", fontSize: 13, marginTop: 2 }, // For phone/name under address
  placeholderText: { color: "#888", fontSize: 15 },
  valueText: { color: "white", fontSize: 15 },
  valueWithArrow: { flexDirection: "row", alignItems: "center" },
  separatorThin: { height: StyleSheet.hairlineWidth, backgroundColor: "#333" },

  productCard: {
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-start", // Align items to the top
  },
  productImage: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  productInfo: { flex: 1, height: 80, justifyContent: "space-between" }, // Make info take remaining space and fixed height
  productPrice: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productOptions: { color: "#AAA", fontSize: 13, marginBottom: 8 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  }, // Align quantity to the right
  quantityButton: { backgroundColor: "#444", padding: 5, borderRadius: 4 },
  quantityButtonDisabled: { backgroundColor: "#2a2a2a" },
  quantityText: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  subtotalRow: {
    alignItems: "flex-end", // Align text to the right
    marginHorizontal: 16,
    paddingRight: 12, // Align with product card padding
    marginTop: -10, // Overlap slightly if needed visually
    marginBottom: 12,
  },
  subtotalText: { color: "white", fontSize: 14, fontWeight: "500" },

  remarksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  remarksInput: {
    color: "white",
    fontSize: 14,
    padding: 10,
    backgroundColor: "black", // Slightly different background?
    borderRadius: 5,
    minHeight: 80,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#444",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
  },
  paymentIcon: { width: 24, height: 24, marginRight: 12 },
  paymentName: { color: "white", fontSize: 15, flex: 1 }, // Take remaining space
  radioBase: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  radioChecked: { borderColor: "#00BFFF" }, // Use your theme color
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00BFFF",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black", // Match bottom bar background
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 10, // Safe area padding
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#222",
  },
  bottomTotalContainer: { flexDirection: "row", alignItems: "baseline" },
  bottomLabel: { color: "white", fontSize: 14 },
  bottomTotal: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 999, // Pill shape
    minWidth: 120, // Ensure minimum width
    alignItems: "center",
  },
  submitButtonDisabled: { backgroundColor: "#AAA" },
  submitButtonText: { color: "black", fontSize: 16, fontWeight: "bold" },
});
