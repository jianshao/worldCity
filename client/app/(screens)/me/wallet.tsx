import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/components/GoBackButton"; // 你之前封装的返回按钮
import Icon from "@expo/vector-icons/FontAwesome5";
import RechargeModal from "@/components/RechargeModal";
import { useAuth } from "@/context/AuthContext";
import { Recharge, UserInfo } from "@/lib/user";

const rechargeOptions = [
  { coins: 2000, price: 2000 },
  { coins: 4000, price: 4000 },
  { coins: 8000, price: 8000 },
  { coins: 10000, price: 10000 },
  { coins: 120000, price: 120000 },
  { coins: 150000, price: 150000 },
];

const WalletDetail = () => {
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(1); // 默认选中第二个
  const [rechargeVisible, setRechargeVisible] = useState(false);

  const { user, setUser, setReflesh } = useAuth();
  const [localUser, setLocalUser] = useState<UserInfo | null>();

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>我的钱包</Text>
        <TouchableOpacity>
          <Text style={styles.orderRecord}>订单记录</Text>
        </TouchableOpacity>
      </View>

      {/* 余额展示 */}
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>余额</Text>
        <View style={styles.coinRow}>
          <Icon name="bitcoin" size={22} color="#FFD700" />
          <Text style={styles.coinText}>{localUser?.coins}</Text>
        </View>
        <TouchableOpacity style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>立即提现</Text>
        </TouchableOpacity>
        <Text style={styles.payRecord}>收支记录</Text>
      </View>

      {/* 兑换会员 */}
      <TouchableOpacity style={styles.exchangeMember}>
        <Text style={styles.memberText}>兑换会员</Text>
        <Icon name="angle-right" size={20} color="#999" />
      </TouchableOpacity>

      {/* 充值区域 */}
      <Text style={styles.sectionTitle}>充值</Text>
      <View style={styles.grid}>
        {rechargeOptions.map((item, index) => (
          <TouchableOpacity
            key={item.coins}
            style={[
              styles.coinBox,
              selectedIndex === index && styles.selectedBox,
            ]}
            onPress={() => setSelectedIndex(index)}
          >
            <View style={styles.coinRow}>
              <Icon name="bitcoin" size={18} color="#FFD700" />
              <Text style={styles.coinAmount}>{item.coins}币</Text>
            </View>
            <Text style={styles.coinPrice}>¥ {item.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 立即充值 */}
      <TouchableOpacity
        style={styles.rechargeBtn}
        onPress={() => setRechargeVisible(true)}
      >
        <Text style={styles.rechargeText}>立即充值</Text>
      </TouchableOpacity>
      <RechargeModal
        visible={rechargeVisible}
        amount={rechargeOptions[selectedIndex].price}
        onClose={() => setRechargeVisible(false)}
        onConfirm={(method) => {
          setRechargeVisible(false);
          console.log("选中支付方式：", method);
          if (localUser?.id) {
            Recharge(localUser?.id, rechargeOptions[selectedIndex].price).then((res)=>{
              setReflesh(true)
            })
          }
          // TODO: 跳转支付页或发起请求
        }}
      />
    </View>
  );
};

const { width } = Dimensions.get("window");
const boxWidth = (width - 60) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orderRecord: {
    color: "#999",
    fontSize: 14,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 4,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 4,
  },
  coinText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  withdrawBtn: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 48,
    marginTop: 12,
  },
  withdrawText: {
    color: "#000",
    fontWeight: "600",
  },
  payRecord: {
    color: "#999",
    fontSize: 14,
    marginTop: 12,
  },
  exchangeMember: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  memberText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  coinBox: {
    width: boxWidth,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: "#888",
  },
  coinAmount: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
  },
  coinPrice: {
    color: "#999",
    fontSize: 14,
    marginTop: 6,
  },
  rechargeBtn: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 32,
  },
  rechargeText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default WalletDetail;
