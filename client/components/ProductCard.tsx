import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import OrderModal from "./OrderModal";
import { ProductListResp, ProductResp, ProviderResp } from "@/types/provider";
import { useRouter } from "expo-router";

interface Props {
  product: ProductResp;
  // onOrderPress: (id: string) => void;
  onAvatarPress: (id: string) => void;
}

const ProductCard = ({ product, onAvatarPress }: Props) => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const closeOrderModal = (provider_id: number, count: number) => {
    console.log("确定下单");
    setModalVisible(false);
    router.push(`/orders/OrderConfirmationScreen?provider_id=${provider_id}`);
    // 发起下单请求
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onAvatarPress(product.provider.user_id.toString())}
      >
        <Image
          source={{
            uri: product.provider.images ? product.provider.images[0] : "",
          }}
          style={styles.avatar}
        />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {product.provider.is_active ? "可预约" : "不可约"}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>{product.provider.user.nickname}</Text>
        <View style={styles.row}>
          <Text style={styles.score}>{product.score}分</Text>
          <Text style={styles.dim}> · 半年{product.orders}单</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.dim}>👍 {product.comments}</Text>
          <Text style={styles.dim}> 💬 {product.comments}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.time}>最早可约：{product.available_time}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>去下单</Text>
        </TouchableOpacity>
      </View>

      {/* 弹窗 */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            {/* 阻止内容区域触发关闭事件 */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <OrderModal onConfirm={closeOrderModal} product={product} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#111",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20, // 留出底部空间
  },
  card: {
    flexDirection: "row",
    padding: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  statusBadge: {
    position: "absolute",
    top: 2,
    left: 2,
    backgroundColor: "#23C37A",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  score: {
    color: "#00B0FF",
    fontWeight: "bold",
  },
  dim: {
    color: "#999",
    marginLeft: 6,
    fontSize: 12,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 64,
  },
  time: {
    fontSize: 12,
    color: "#00B0FF",
  },
  button: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default ProductCard;
