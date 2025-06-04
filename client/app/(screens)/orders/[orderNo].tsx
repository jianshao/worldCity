import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform, // 导入 Platform 用于处理状态栏高度
  StatusBar, // 导入 StatusBar
  Clipboard, // 导入 Clipboard 用于复制
  Alert, // 导入 Alert 用于提示
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoBackButton from "@/components/GoBackButton"; // 假设 GoBackButton 组件已正确实现
import { GetOrder } from "@/lib/order";
import { OrderResponse, OrderStatus } from "@/types/order";
import { useAuth } from "@/context/AuthContext";
import { getDatePartWithDateFns } from "@/utils/timeFormat";

// --- Helper Function ---
// (如果你的项目中还没有数字格式化函数，可以添加一个)
const formatPrice = (price: number): string => {
  return price.toLocaleString("zh-CN"); // 使用 toLocaleString 添加千位分隔符
};

// --- InfoBlock Props Interface ---
interface InfoBlockProps {
  label?: string; // 标签设为可选
  value: string | number;
  icon?: React.ReactNode;
  copyable?: boolean;
  showBorder?: boolean; // 控制是否显示底边框
  valueStyle?: object; // 允许自定义 value 样式
  containerStyle?: object; // 允许自定义容器样式
}

// --- InfoBlock Component (优化) ---
function InfoBlock({
  label,
  value,
  icon,
  copyable = false,
  showBorder = true, // 默认显示边框
  valueStyle = {},
  containerStyle = {},
}: InfoBlockProps) {
  const handleCopy = () => {
    Clipboard.setString(String(value));
    Alert.alert("已复制", String(value)); // 给出复制成功的提示
  };

  return (
    <View
      style={[
        styles.infoRow,
        showBorder ? styles.infoRowBorder : styles.infoRowNoBorder, // 根据 prop 控制边框
        containerStyle,
      ]}
    >
      <View style={styles.infoLeft}>
        {icon && <View style={styles.infoIconContainer}>{icon}</View>}
        {/* 只有当 label 存在且不为空时才渲染 Text */}
        {label ? <Text style={styles.infoLabel}>{label}</Text> : null}
        <Text
          style={[styles.infoValue, valueStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      </View>
      {copyable && (
        <TouchableOpacity onPress={handleCopy}>
          <Ionicons
            name="copy-outline"
            size={16}
            color="gray"
            style={styles.copyIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- OrderDetail Component (调整后) ---
export default function OrderDetail() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderResponse>();

  // 模拟订单数据 (与之前保持一致)
  const orderStatus = "waiting"; // waiting | cancelled
  const isWaiting = order?.status === OrderStatus.Waiting;
  const statusText = isWaiting ? "商户接单中，请耐心等待" : "已取消【接单中】";
  const statusSubText = isWaiting ? "请等待商户接单" : "订单取消";
  const { orderNo } = useLocalSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    // 根据id从服务端拉取数据，用于展示
    GetOrder(orderNo.toString()).then((res) => {
      setOrder(res);
    });
  }, [orderNo]);

  // 动态获取状态图标和颜色
  const StatusIcon = isWaiting ? (
    <Ionicons
      name="checkmark-circle"
      size={18}
      color="#00D090"
      style={styles.statusIcon}
    />
  ) : (
    <Ionicons
      name="close-circle"
      size={18}
      color="#FF6347"
      style={styles.statusIcon}
    /> // 假设取消状态用红色叉号
  );
  const statusTextColor = isWaiting ? "#fff" : "#FF6347"; // 假设取消状态用红色

  return (
    <View style={styles.container}>
      {/* Header - 改进居中 */}
      <View style={styles.header}>
        <GoBackButton />
        {/* 使用 flex: 1 和 textAlign: 'center' 来居中标题 */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>订单详情</Text>
        </View>
        {/* 添加一个与返回按钮等宽的占位符，实现真居中 */}
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 状态区块 - 添加图标 */}
        <View style={styles.statusContainer}>
          <View style={styles.statusLine}>
            {StatusIcon}
            <Text style={[styles.statusText, { color: statusTextColor }]}>
              {statusText}
            </Text>
          </View>
          <Text style={styles.statusSubText}>{statusSubText}</Text>
        </View>

        {/* 付款时间区块 - 带箭头 */}
        <View style={styles.card}>
          <View style={[styles.infoRow, styles.infoRowNoBorder]}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoLabel}>付款时间</Text>
              <Text style={styles.infoValue}>
                {getDatePartWithDateFns(order?.payment_time || "")}
              </Text>
            </View>
            {/* 添加向下箭头 */}
            <Ionicons name="chevron-down" size={16} color="gray" />
          </View>
        </View>

        {/* 地址/用户信息卡片 */}
        <View style={styles.card}>
          <InfoBlock
            icon={<Ionicons name="location-outline" size={16} color="white" />}
            value={order?.delivery_address?.address || ""}
            showBorder={true} // 地址下方显示边框
            valueStyle={styles.addressValue} // 可能需要地址允许多行
            containerStyle={styles.cardRow}
          />
          {/* 用户名和电话放在一起，电话无标签 */}
          <View
            style={[
              styles.infoRow,
              styles.infoRowNoBorder,
              styles.cardRow,
              { paddingTop: 10 },
            ]}
          >
            <View style={styles.infoLeft}>
              {/* 标签使用 "用户_" 还是 "用户" 取决于你的设计 */}
              {/* 方案一：标签是 "用户_" */}
              {/* <Text style={styles.infoLabel}>用户_</Text>
              <Text style={styles.infoValue}>{user?.nickname}</Text> */}
              {/* 方案二：标签是 "用户"，值是 user82394，更常见 */}
              {/* <Text style={styles.infoLabel}>用户</Text> */}
              <Text
                style={styles.infoValue}
              >{`${order?.delivery_address?.name}`}</Text>{" "}
              {/* 或者直接是 order.username */}
            </View>
          </View>
          <View
            style={[
              styles.infoRow,
              styles.infoRowNoBorder,
              styles.cardRow,
              { paddingBottom: 0, paddingTop: 5 },
            ]}
          >
            <View style={styles.infoLeft}>
              {/* 电话号码，没有标签，可以稍微缩进一点 */}
              <View style={styles.phoneIconContainer}>
                <Ionicons name="call-outline" size={14} color="white" />
              </View>
              <Text style={[styles.infoValue, { marginLeft: 4 }]}>
                {order?.delivery_address?.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* 服务商户卡片 */}
        <View style={styles.card}>
          <InfoBlock
            label="服务商户"
            value={order?.provider_id || ""}
            showBorder={true} // 显示边框
            containerStyle={styles.cardRow}
          />
          <InfoBlock
            label="服务时间"
            value={
              getDatePartWithDateFns(order?.service_time || "") ||
              "等待服务中..."
            }
            showBorder={false} // 卡片内最后一行不显示边框
            containerStyle={styles.cardRow}
          />
        </View>

        {/* 商品信息卡片 - 调整布局 */}
        <View style={styles.productCard}>
          <Image
            source={{
              uri: order?.product_snapshot?.images
                ? order?.product_snapshot?.images[0]
                : "",
            }}
            style={styles.productImg}
          />
          {/* 让商品信息占据剩余空间 */}
          <View style={styles.productInfo}>
            <Text
              style={styles.productName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {order?.product_snapshot?.title}
            </Text>
            {/* <Text style={styles.productDuration}>已选：{order.}</Text> */}
            <Text style={styles.productPrice}>
              ¥{order?.product_snapshot?.price}
            </Text>
          </View>
          {/* 数量放在卡片右侧 */}
          <Text style={styles.quantityText}>x{order?.quantity}</Text>
        </View>

        {/* 合计 - 调整对齐 */}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>合计：¥{order?.total_amount}</Text>
        </View>

        {/* 订单信息卡片 */}
        <View style={styles.card}>
          <InfoBlock
            label="订单编号"
            value={order?.order_no || ""}
            copyable
            showBorder={true} // 显示边框
            containerStyle={styles.cardRow}
            valueStyle={{ flexShrink: 1 }} // 允许编号换行或省略
          />
          <InfoBlock
            label="下单时间"
            value={getDatePartWithDateFns(order?.order_time || "")}
            showBorder={false} // 卡片内最后一行不显示边框
            containerStyle={styles.cardRow}
          />
        </View>
      </ScrollView>

      {/* 底部操作按钮 */}
      <View style={styles.bottomButtonContainer}>
        {isWaiting && ( // 仅在等待状态下显示取消按钮
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() =>
              router.push({
                pathname: "/orders/CancelReason",
                params: { orderNo },
              })
            } // 假设跳转取消原因页
          >
            <Text style={styles.cancelText}>取消订单</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.repeatBtn, !isWaiting && styles.fullWidthButton]}
        >
          {/* 如果没有取消按钮，让“再来一单”按钮占满 */}
          <Text style={styles.repeatText}>再来一单</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- StyleSheet (调整后) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50, // 处理状态栏高度
    paddingTop: 50, // 暂时使用固定值，根据你的 GoBackButton 和 Header 实现调整
  },
  // --- Header Styles ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16, // Header 内边距
    marginBottom: 16,
    height: 44, // Standard header height
  },
  // 返回按钮占位，需要知道 GoBackButton 的实际宽度，或者给一个固定值
  // headerPlaceholder: {
  //   width: 40, // Example width, adjust based on GoBackButton
  // },
  headerTitleContainer: {
    flex: 1, // 占据中间空间
    alignItems: "center", // 水平居中
    justifyContent: "center", // 垂直居中 (如果 header 有固定高度)
    // 计算左右边距使其居中，但这比较复杂，flex:1 + textAlign 是常用方式
    // marginHorizontal: 40, // 假设左右各有 40 宽度的元素
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center", // 确保文本在容器内居中
  },
  headerPlaceholder: {
    // 用于平衡返回按钮宽度的占位符
    width: 30, // 估算值，应约等于 GoBackButton 的宽度
  },

  // --- ScrollView Styles ---
  scrollContent: {
    paddingHorizontal: 16, // 内容区域左右边距
    paddingBottom: 100, // 留出底部按钮空间 + 一些额外空间
  },

  // --- Status Styles ---
  statusContainer: {
    marginBottom: 16,
    paddingHorizontal: 4, // 轻微内缩
    alignItems: "center",
  },
  statusLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    color: "#00D090", // 颜色动态设置
    fontSize: 16,
    fontWeight: "600",
    alignContent: "center",
  },
  statusSubText: {
    color: "#ccc",
    fontSize: 13,
    marginLeft: 24, // 与图标对齐
  },

  // --- Card Style ---
  card: {
    backgroundColor: "#1A1A1A", // 深灰色背景，接近截图
    borderRadius: 8,
    marginBottom: 12, // 卡片间距
    paddingVertical: 4, // 卡片垂直内边距
    paddingHorizontal: 12, // 卡片水平内边距
  },
  cardRow: {
    // 卡片内部行的特定样式，去除默认边距
    paddingVertical: 8, // 调整行内垂直间距
    paddingHorizontal: 0, // 使用卡片的内边距
  },

  // --- InfoBlock Styles ---
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, // 默认垂直内边距
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth, // 使用更细的线
    borderBottomColor: "#333", // 深灰色边框
  },
  infoRowNoBorder: {
    borderBottomWidth: 0,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // 允许左侧内容收缩
    // flexWrap: "wrap", // 允许标签+值换行，根据需要开启
  },
  infoIconContainer: {
    marginRight: 8, // 图标右边距
    alignItems: "center",
    justifyContent: "center",
  },
  phoneIconContainer: {
    // 电话图标稍微小一点，调整对齐
    marginRight: 0,
    width: 18, // 给个固定宽度方便对齐
    alignItems: "center",
  },
  infoLabel: {
    color: "#999", // 灰色标签
    fontSize: 13,
    marginRight: 8, // 标签和值之间的距离
  },
  infoValue: {
    color: "white",
    fontSize: 14,
    flexShrink: 1, // 允许值收缩换行或省略
  },
  addressValue: {
    // 地址允许多行显示
    flexShrink: 1,
    // flexWrap: 'wrap', // 如果需要自动换行
  },
  copyIcon: {
    marginLeft: 8, // 复制图标左边距
  },

  // --- Product Card Styles ---
  productCard: {
    flexDirection: "row",
    alignItems: "center", // 垂直居中对齐 图片、信息、数量
    marginTop: 4, // 与上方卡片间距调整
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1A1A1A", // 深灰色背景
    marginBottom: 8, // 与合计行的间距
  },
  productImg: {
    width: 60, // 图片尺寸调整以匹配截图
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1, // 占据图片和数量之间的所有空间
    justifyContent: "space-between", // 在垂直方向分散内容
    height: 60, // 与图片高度一致，帮助对齐
    paddingVertical: 2, // 微调垂直内边距
  },
  productName: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  productDuration: {
    color: "#999",
    fontSize: 12, // 字体稍小
    marginBottom: 4,
  },
  productPrice: {
    color: "white",
    fontSize: 14, // 价格字体
    fontWeight: "600",
  },
  quantityText: {
    color: "#aaa", // 数量颜色稍暗
    fontSize: 13,
    marginLeft: 8, // 与商品信息区的间隔
    alignSelf: "center", // 确保在交叉轴居中
  },

  // --- Total Styles ---
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end", // 右对齐
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12, // 与卡片内容右侧对齐
  },
  totalText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // --- Bottom Buttons Styles ---
  bottomButtonContainer: {
    position: "absolute", // 固定在底部
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12, // 适配 iPhone X 等底部安全区域
    backgroundColor: "black", // 背景色确保覆盖下方内容
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#222",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8, // 按钮间距调整
    borderRadius: 20, // 圆角调整
    borderWidth: 1,
    borderColor: "#555", // 边框颜色调整
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1E", // 深色背景
  },
  cancelText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  repeatBtn: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8, // 按钮间距调整
    borderRadius: 20, // 圆角调整
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  repeatText: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
  },
  fullWidthButton: {
    // 当只有一个按钮时，让它占满宽度
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
  },
});
