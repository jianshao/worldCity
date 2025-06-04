import { ProductResp } from "@/types/provider";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const recommendedTags = [
  "日韩伴游",
  "拉美伴游",
  "高尔夫陪练",
  "专属派对",
  "泰式SPA",
  "中式推拿",
];

export interface OrderModalProp {
  product: ProductResp;
  onConfirm: (id: number, count: number) => void;
}

const OrderModal = ({ product, onConfirm }: OrderModalProp) => {
  const [count, setCount] = useState(1);

  return (
    <View style={styles.container}>
      {/* 顶部拖拽条 */}
      <View style={styles.dragBar} />

      {/* 用户信息 */}
      <View style={styles.userRow}>
        <Image
          source={{ uri: product.provider.user.avatar }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>
            {product.provider.user.nickname+"  "}
            <Text style={styles.score}>{product.score}分</Text>
          </Text>
          <Text style={styles.description}>
            {/* 想去哪都可以，欧洲拉美都可以哦，出游经验丰富，英语法语流利... */}
            {product.provider.desc}
          </Text>
        </View>
      </View>

      {/* 商品卡片 + 价格 */}
      <View style={styles.itemRow}>
        <Image
          source={{
            uri: product.provider.images ? product.provider.images[0] : "",
          }}
          style={styles.itemImage}
        />
        <View style={styles.priceBox}>
          <Text style={styles.price}>¥{product.provider.price}</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setCount(Math.max(1, count - 1))}>
              <Text style={styles.counterBtn}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{count}</Text>
            <TouchableOpacity onPress={() => setCount(count + 1)}>
              <Text style={styles.counterBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 选择项 */}
      <View style={styles.selection}>
        <Text style={styles.selectionText}>已选：欧洲拉美伴游 · 7日</Text>
      </View>

      {/* 标签推荐 */}
      <View style={styles.tagGroup}>
        <Text style={styles.sectionTitle}>推荐项目</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedTags.map((tag, idx) => (
            <TouchableOpacity key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 确认按钮 */}
      <TouchableOpacity style={styles.confirmBtn} onPress={()=>onConfirm(product.provider.id, count)}>
        <Text style={styles.confirmText}>确认下单</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  dragBar: {
    alignSelf: "center",
    width: 40,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  score: {
    color: "#00FFD1",
    fontSize: 14,
  },
  description: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
    width: "90%",
  },
  itemRow: {
    flexDirection: "row",
    marginVertical: 16,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  priceBox: {
    flex: 1,
  },
  price: {
    color: "#00FFD1",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterBtn: {
    color: "#fff",
    fontSize: 20,
    paddingHorizontal: 12,
  },
  counterValue: {
    color: "#fff",
    fontSize: 16,
  },
  selection: {
    backgroundColor: "#222",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectionText: {
    color: "#888",
    fontSize: 13,
  },
  tagGroup: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#333",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  tagText: {
    color: "#ccc",
    fontSize: 13,
  },
  confirmBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  confirmText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
