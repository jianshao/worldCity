import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProviderResp } from "@/types/provider";
import { GetProviderById } from "@/lib/provider";
import { router, useLocalSearchParams } from "expo-router";
import GoBackButton from "@/components/GoBackButton";
import { useAddressStore } from "@/store/addressStore";

export default function OrderConfirm() {
  const [quantity, setQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("alipay");
  const [provider, setProvider] = useState<ProviderResp>();
  const { selectedAddress } = useAddressStore();

  const { provider_id } = useLocalSearchParams();
  const totalPrice = (provider?.price || 1) * quantity;

  useEffect(() => {
    // 从api拉取provider信息
    if (provider_id) {
      GetProviderById(provider_id.toString()).then((res) => {
        setProvider(res);
      });
    }
  }, [provider_id]);

  const handleAddressPress = () => {
    router.push(`/orders/selectAddress`);
  };

  const handleTimePress = () => {
    console.log("弹出时间选择器");
  };

  const renderPaymentOption = (label: string, value: string, icon?: any) => (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={() => setSelectedPayment(value)}
    >
      <View style={styles.paymentLabel}>
        {icon}
        <Text style={styles.paymentText}>{label}</Text>
      </View>
      <Ionicons
        name={
          selectedPayment === value ? "radio-button-on" : "radio-button-off"
        }
        size={20}
        color="#fff"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GoBackButton />
      <ScrollView style={styles.content}>
        {/* 地址 */}
        <TouchableOpacity style={styles.row} onPress={handleAddressPress}>
          <Text style={styles.leftText}>选择服务地址</Text>
          <Text style={styles.leftText}>{selectedAddress.address}</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* 服务商 + 时间 */}
        <View style={styles.infoRow}>
          <Text style={styles.leftText}>服务商户</Text>
          <Text style={styles.rightText}>{provider?.user.nickname}</Text>
        </View>
        <TouchableOpacity style={styles.infoRow} onPress={handleTimePress}>
          <Text style={styles.leftText}>服务时间</Text>
          <Text style={styles.rightText}>2025-05-18 11:30</Text>
        </TouchableOpacity>

        {/* 服务者卡片 */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Image
              source={{ uri: provider?.user.avatar }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.nameText}>{provider?.title}</Text>
              <Text style={styles.price}>¥{provider?.price}</Text>
            </View>
          </View>

          {/* 数量选择 */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>数量：</Text>
            <View style={styles.qtyControl}>
              <Pressable
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyText}>-</Text>
              </Pressable>
              <Text style={styles.qtyCount}>{quantity}</Text>
              <Pressable
                onPress={() => setQuantity(quantity + 1)}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyText}>+</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.total}>合计：¥{totalPrice.toLocaleString()}</Text>
        </View>

        {/* 备注 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.leftText}>备注</Text>
          <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>

        {/* 支付方式 */}
        {renderPaymentOption("支付宝", "alipay")}
        {renderPaymentOption("人工充值", "manual")}
        {renderPaymentOption("数字人民币", "dcep")}
        {renderPaymentOption("微信", "wechat")}
      </ScrollView>

      {/* 底部合计 & 提交按钮 */}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>
          合计 ¥{totalPrice.toLocaleString()}
        </Text>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            // 提交订单获得订单ID
            const id = 123;
            router.push(`/orders/${id}`);
          }}
        >
          <Text style={styles.submitText}>提交订单</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  leftText: { color: "#999", fontSize: 14 },
  rightText: { color: "#fff", fontSize: 14 },
  card: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  cardTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  nameText: { color: "#fff", fontSize: 14, marginBottom: 4 },
  price: { color: "#00E676", fontSize: 16, fontWeight: "bold" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  qtyLabel: { color: "#999" },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderColor: "#888",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#fff", fontSize: 18 },
  qtyCount: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 10,
  },
  total: {
    textAlign: "right",
    color: "#fff",
    marginTop: 10,
    fontWeight: "bold",
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 0.5,
  },
  paymentLabel: { flexDirection: "row", alignItems: "center" },
  paymentText: { color: "#fff", marginLeft: 8 },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopColor: "#333",
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalPrice: {
    color: "#00E676",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
});
