// src/app/(tabs)/orders.tsx (or your specific path)
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert, // Import Alert for cancel confirmation
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // If using for back icon fallback
import GoBackButton from "@/components/GoBackButton"; // Import back button
import { OrderResponse, OrderListResponse, OrderStatus } from "@/types/order"; // Use snake_case types
import { GetOrderList, ReviewOrder } from "@/lib/order";
import ReviewModal, { ReviewSubmitData } from "@/components/ReviewModal"; // Import the modal

// --- Constants ---
interface OrderListTab {
  key: string;
  label: string;
  status?: number;
}
const ORDER_LIST_TABS: OrderListTab[] = [
  { key: "all", label: "全部", status: undefined },
  {
    key: "waiting_payment",
    label: "待付款",
    status: OrderStatus.WaitForPayment,
  },
  { key: "processing", label: "进行中", status: OrderStatus.Accepted },
  { key: "review", label: "待评分", status: OrderStatus.Completed },
  { key: "cancelled", label: "已取消", status: OrderStatus.Cancelled },
];

// --- Helper Functions ---
const formatPrice = (priceString: string): string => {
  const price = Number(priceString);
  return isNaN(price) ? priceString : price.toLocaleString("zh-CN");
};

const getProductPreview = (
  snapshot: OrderResponse["product_snapshot"]
): { name: string; image?: string } => {
  if (!snapshot) return { name: "商品信息不可用" };
  // Adjust key access based on actual snapshot structure if needed
  return {
    name: snapshot.title || "未知服务",
    image: snapshot.images ? snapshot.images[0] : "",
  };
};

// Status Badge Styling Helper
const getStatusStyle = (
  status: OrderStatus
): { badge: object; text: object } => {
  switch (status) {
    case OrderStatus.Waiting: // 待接单
      // Check if the UI uses red for waiting_payment or waiting_acceptance
      // Assuming red for '待接单' based on screenshot snippet
      return {
        badge: styles.statusBadgeWaiting,
        text: styles.statusBadgeTextWaiting,
      };
    case OrderStatus.Accepted: // 已接单 / 进行中
      return {
        badge: styles.statusBadgeAccepted,
        text: styles.statusBadgeTextAccepted,
      };
    case OrderStatus.Completed: // 已完成 / 待评分
      return {
        badge: styles.statusBadgeCompleted,
        text: styles.statusBadgeTextCompleted,
      };
    case OrderStatus.Cancelled: // 已取消
      return {
        badge: styles.statusBadgeCancelled,
        text: styles.statusBadgeTextCancelled,
      };
    case OrderStatus.WaitForPayment: // 待付款 (Style needed)
      // Add a specific style for this if required by design
      return {
        badge: styles.statusBadgeWaitingPayment,
        text: styles.statusBadgeTextWaitingPayment,
      };
    default:
      return {
        badge: styles.statusBadgeDefault,
        text: styles.statusBadgeTextDefault,
      };
  }
};

// --- Components ---

// Order List Item Component
const OrderListItem = React.memo(
  ({
    item,
    onPressItem,
    onCancelOrder,
    onReviewOrder,
  }: {
    item: OrderResponse;
    onPressItem: (orderNo: string) => void;
    onCancelOrder: (orderNo: string) => void;
    onReviewOrder: (orderNo: string) => void;
    // Add more actions if needed (e.g., onPay)
  }) => {
    const productPreview = getProductPreview(item.product_snapshot);
    const statusStyle = getStatusStyle(item.status);

    const renderActionButtons = () => {
      switch (item.status) {
        case OrderStatus.Waiting:
          return (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonCancel]}
              onPress={() => onCancelOrder(item.order_no)}
            >
              <Text style={styles.actionButtonTextCancel}>取消订单</Text>
            </TouchableOpacity>
          );
        case OrderStatus.Accepted: // 已接单/进行中 - Screenshot shows "取消订单" but might be business logic dependent
          // Example: Maybe allow cancellation if far from service time?
          // Or show '联系客服' or nothing
          // Let's replicate the screenshot's "取消订单" for Accepted state for now
          return (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonCancel]}
              onPress={() => onCancelOrder(item.order_no)} // Might need different logic/confirmation
            >
              <Text style={styles.actionButtonTextCancel}>取消订单</Text>
            </TouchableOpacity>
          );
        case OrderStatus.Completed: // 已完成 -> 待评分
          return (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonReview]}
              onPress={() => onReviewOrder(item.order_no)}
            >
              <Text style={styles.actionButtonTextReview}>待评分</Text>
            </TouchableOpacity>
          );
        case OrderStatus.WaitForPayment:
          // return ( <TouchableOpacity style={...} onPress={...}><Text>去支付</Text></TouchableOpacity> )
          return null; // No button in this state in screenshot
        case OrderStatus.Cancelled:
          // return ( <TouchableOpacity style={...} onPress={...}><Text>删除订单</Text></TouchableOpacity> )
          return null; // No button in this state in screenshot
        default:
          return null;
      }
    };

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onPressItem(item.order_no)}
        activeOpacity={0.8}
      >
        {/* Status Badge */}
        <View style={[styles.statusBadgeBase, statusStyle.badge]}>
          <Text style={[styles.statusBadgeTextBase, statusStyle.text]}>
            {item.status_text}
          </Text>
        </View>

        <View style={styles.itemContent}>
          {/* Image */}
          <Image
            source={
              productPreview.image
                ? { uri: productPreview.image }
                : require("@/assets/images/avatar-placeholder.png")
            } // Add a placeholder
            style={styles.itemImage}
          />
          {/* Details */}
          <View style={styles.itemDetails}>
            <Text style={styles.itemPrice}>
              ¥{formatPrice(item.unit_price)}
            </Text>
            <Text style={styles.itemName} numberOfLines={1}>
              {productPreview.name ?? "服务详情"}
            </Text>
            {/* Optional: Display sub-text if needed */}
            {/* <Text style={styles.itemSubText}>已完成xx单</Text> */}
          </View>
          {/* Action Buttons */}
          <View style={styles.itemActions}>
            {renderActionButtons()}
            {/* Add '再来一单' button here if needed */}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

// Main Screen Component
export default function OrderListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false); // True when fetching first page of a tab
  const [isLoadingMore, setIsLoadingMore] = useState(false); // True when fetching subsequent pages
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeTabKey, setActiveTabKey] = useState<string>(
    ORDER_LIST_TABS[0].key
  );
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<
    string | null
  >(null);

  const handleReviewOrder = useCallback((orderNo: string) => {
    setSelectedOrderForReview(orderNo); // Store which order is being reviewed
    setIsReviewModalVisible(true); // Open the modal
  }, []);

  const handleCloseReviewModal = () => {
    setIsReviewModalVisible(false);
    setSelectedOrderForReview(null);
  };

  // This function handles the actual API call
  const handleReviewSubmit = async (
    reviewData: ReviewSubmitData
  ): Promise<void> => {
    console.log("Submitting review:", reviewData);
    try {
      // --- API Integration Point ---
      // Replace with your actual API call function for submitting reviews
      // await SubmitReviewAPI(reviewData); // Example API call
      const res = await ReviewOrder({
        order_no: reviewData.order_no,
        score: reviewData.rating,
        tags: reviewData.tags,
      });

      Alert.alert("成功", "评价提交成功！");
      handleCloseReviewModal(); // Close modal on success
      // Optional: Refresh the order list or update the specific order's state
      handleRefresh();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      // Re-throw the error so the modal can catch it and display alert
      throw error;
      // OR display a more global error notification here instead
    }
  };

  // Find the status value corresponding to the active tab key
  const currentStatusFilter = ORDER_LIST_TABS.find(
    (tab) => tab.key === activeTabKey
  )?.status;

  // Fetch Function
  const fetchOrders = useCallback(
    async (
      pageToLoad: number,
      statusToFetch?: number, // Explicitly pass the status for THIS fetch
      refreshing = false
    ) => {
      console.log(
        `fetchOrders CALLED: page=${pageToLoad}, status=${statusToFetch}, refreshing=${refreshing}, isLoading=${isLoading}, isLoadingMore=${isLoadingMore}, isRefreshing=${isRefreshing}`
      );

      // Guard conditions
      if (!refreshing && pageToLoad > 1 && isLoadingMore) {
        console.log("fetchOrders: Aborted - Already loading more.");
        return;
      }
      if (!refreshing && pageToLoad === 1 && isLoading) {
        console.log("fetchOrders: Aborted - Already loading initial page.");
        return;
      }
      if (isRefreshing && !refreshing) {
        console.log("fetchOrders: Aborted - Already refreshing.");
        return;
      }

      if (refreshing) {
        setIsRefreshing(true);
      } else if (pageToLoad === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      if (pageToLoad === 1 || refreshing) {
        setError(null); // Clear error for new data sequence
      }

      try {
        const params: { page: number; page_size: number; status?: number } = {
          page: pageToLoad,
          page_size: pagination.pageSize,
        };
        if (statusToFetch !== undefined) {
          params.status = statusToFetch;
        }

        console.log("fetchOrders: Calling API with params:", params);
        const res = await GetOrderList(params); // Use your API function
        console.log(
          "fetchOrders: API response received, total items from API:",
          res.total
        );

        const { orders: fetchedOrders, total, page_size } = res;
        setOrders((prevOrders) =>
          pageToLoad === 1 || refreshing
            ? fetchedOrders
            : [...prevOrders, ...fetchedOrders]
        );
        setPagination((prev) => ({
          ...prev,
          page: pageToLoad,
          total: total || 0, // Ensure total is a number
          pageSize: page_size || prev.pageSize,
        }));
      } catch (err: any) {
        console.error("fetchOrders: ERROR - ", err);
        if (pageToLoad === 1) setOrders([]); // Clear on initial load error
        setError(err?.message || "无法加载订单列表，请稍后重试");
      } finally {
        console.log(
          `fetchOrders FINALLY: page=${pageToLoad}, refreshing=${refreshing}`
        );
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    // Dependencies: What does the body of fetchOrders truly depend on from the outer scope?
    // pagination.pageSize for params.
    // isLoading, isLoadingMore, isRefreshing for guard conditions.
    [pagination.pageSize, isLoading, isLoadingMore, isRefreshing]
  );

  // Initial fetch and fetch on tab change
  useEffect(() => {
    const newStatusFilter = ORDER_LIST_TABS.find(
      (tab) => tab.key === activeTabKey
    )?.status;
    console.log(
      `useEffect [activeTabKey]: Tab changed to '${activeTabKey}', status filter: ${newStatusFilter}. Clearing orders and resetting pagination.`
    );
    setOrders([]); // Clear current orders
    setPagination((prev) => ({ ...prev, page: 1, total: 0 })); // Reset pagination
    fetchOrders(1, newStatusFilter); // Fetch first page of new tab
  }, [activeTabKey]); // Only depends on activeTabKey

  const handleRefresh = () => {
    console.log("handleRefresh: Triggered");
    const currentStatusFilter = ORDER_LIST_TABS.find(
      (tab) => tab.key === activeTabKey
    )?.status;
    // It's important that pagination is reset for refreshing as well
    setPagination((prev) => ({ ...prev, page: 1, total: 0 }));
    fetchOrders(1, currentStatusFilter, true);
  };

  const handleLoadMore = () => {
    const currentStatusFilter = ORDER_LIST_TABS.find(
      (tab) => tab.key === activeTabKey
    )?.status;
    if (
      !isLoading &&
      !isLoadingMore &&
      !isRefreshing &&
      orders.length < pagination.total
    ) {
      console.log(
        "handleLoadMore: Triggered, current page:",
        pagination.page,
        "total:",
        pagination.total
      );
      fetchOrders(pagination.page + 1, currentStatusFilter);
    } else {
      console.log("handleLoadMore: Condition not met to load more.", {
        isLoading,
        isLoadingMore,
        isRefreshing,
        ordersLength: orders.length,
        paginationTotal: pagination.total,
      });
    }
  };

  const handleTabPress = (tabKey: string) => {
    if (tabKey !== activeTabKey) {
      console.log("Switching tab to:", tabKey);
      setActiveTabKey(tabKey);
      // setOrders([]); // Clear previous orders immediately for better UX
      // setIsLoading(true); // Show loading indicator while fetching new tab data
      // Fetch will be triggered by useEffect watching activeTabKey
    }
  };

  const handleCancelOrder = useCallback(async (orderNo: string) => {
    router.push({
      pathname: `/orders/CancelReason`,
      params: { orderNo },
    });
  }, []); // Add dependencies if needed (e.g., if using a loading state setter)

  const navigateToDetail = (orderNo: string) => {
    router.push({ pathname: `/orders/[orderNo]`, params: { orderNo } }); // Adjust path as necessary
  };

  const renderFooter = () => {
    if (!isLoading || isRefreshing) {
      // Don't show footer if refreshing
      if (orders.length === 0) return null; // Don't show "no more" if list is empty anyway
      if (orders.length >= pagination.total && pagination.total > 0) {
        return <Text style={styles.footerText}>没有更多订单了</Text>;
      }
      return null; // Don't show loading indicator if handled by onEndReached logic (prevents flicker)
    }
    // Show loading indicator only during load more, not initial load
    if (pagination.page > 1) {
      return (
        <ActivityIndicator
          size="small"
          color="#888"
          style={{ marginVertical: 20 }}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <GoBackButton />
          <Text style={styles.headerTitle}>我的订单</Text>
          {/* Optional: Add Filter/Search Icon if needed */}
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {ORDER_LIST_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.key)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTabKey === tab.key && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeTabKey === tab.key && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* List Area */}
        {isLoading &&
          orders.length === 0 &&
          !isRefreshing && ( // Initial Loading State
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        {error &&
          orders.length === 0 &&
          !isRefreshing && ( // Error State (when list is empty)
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                onPress={() => fetchOrders(1, currentStatusFilter)}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>重试</Text>
              </TouchableOpacity>
            </View>
          )}
        {!isLoading &&
          orders.length === 0 &&
          !error &&
          !isRefreshing && ( // Empty State
            <View style={styles.centered}>
              <Text style={styles.emptyText}>暂无相关订单</Text>
            </View>
          )}

        {/* Hide FlatList during initial load of first tab to avoid showing empty */}
        {/* Or only hide if orders.length is 0 and it's loading */}
        {!(isLoading && orders.length === 0 && !isRefreshing) && (
          <FlatList
            data={orders}
            renderItem={({ item }) => (
              <OrderListItem
                item={item}
                onPressItem={navigateToDetail}
                onCancelOrder={handleCancelOrder}
                onReviewOrder={handleReviewOrder}
              />
            )}
            keyExtractor={(item) => item.order_no}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#ccc" // iOS spinner color
                colors={["#ccc"]} // Android spinner colors
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5} // Adjust threshold as needed
            ListFooterComponent={renderFooter}
            // Removed ListEmptyComponent here because we handle empty/loading/error states above the FlatList
          />
        )}
      </View>

      {/* Render the Review Modal */}
      {selectedOrderForReview && (
        <ReviewModal
          isVisible={isReviewModalVisible}
          onClose={handleCloseReviewModal}
          onSubmit={handleReviewSubmit} // Pass the submit handler
          orderNo={selectedOrderForReview}
          // predefinedTags={/* optionally load tags from API */}
        />
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10, // Less horizontal padding for header
    paddingVertical: 10,
    backgroundColor: "black", // Ensure header bg
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: -15,
  }, // Adjust margin for centering with back button
  headerPlaceholder: { width: 30 }, // Balance GoBackButton width

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribute tabs evenly
    backgroundColor: "black", // Tab bar background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
    paddingHorizontal: 10, // Padding for the whole tab bar
  },
  tabItem: {
    paddingVertical: 12,
    alignItems: "center", // Center label and indicator
  },
  tabLabel: {
    color: "#AAA", // Inactive tab text color
    fontSize: 15,
  },
  tabLabelActive: {
    color: "white", // Active tab text color
    fontWeight: "bold",
  },
  activeTabIndicator: {
    height: 3,
    width: "60%", // Indicator width relative to tab item
    backgroundColor: "white",
    marginTop: 6,
    borderRadius: 1.5,
  },

  listContent: { paddingBottom: 20, paddingTop: 5 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: { color: "white", fontSize: 14 },
  emptyText: { color: "#888", fontSize: 16 },
  footerText: { color: "#888", textAlign: "center", paddingVertical: 20 },

  // Order List Item Styles
  itemContainer: {
    backgroundColor: "black", // Items blend with background
    marginHorizontal: 16, // Horizontal spacing
    marginTop: 15, // Vertical spacing between items
    paddingBottom: 15, // Padding at the bottom of the item
    borderBottomWidth: StyleSheet.hairlineWidth, // Separator line
    borderBottomColor: "#333",
    position: "relative", // For absolute positioning of the badge
  },
  statusBadgeBase: {
    position: "absolute",
    top: 0, // Position badge relative to top of the item
    right: 0, // Position badge to the right
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderBottomLeftRadius: 8, // Curve bottom left corner
  },
  statusBadgeTextBase: {
    fontSize: 11,
    fontWeight: "bold",
  },
  // Status Specific Styles (Adjust colors based on exact UI)
  statusBadgeWaiting: { backgroundColor: "#FF3B30" }, // Red (待接单)
  statusBadgeTextWaiting: { color: "white" },
  statusBadgeAccepted: { backgroundColor: "#34C759" }, // Green (已接单)
  statusBadgeTextAccepted: { color: "white" },
  statusBadgeCompleted: { backgroundColor: "#FFCC00" }, // Gold/Yellow (已完成)
  statusBadgeTextCompleted: { color: "#543600" }, // Darker text for yellow bg
  statusBadgeCancelled: { backgroundColor: "#555" }, // Grey (已取消)
  statusBadgeTextCancelled: { color: "#BBB" },
  statusBadgeWaitingPayment: { backgroundColor: "#FFA500" }, // Orange (待付款)
  statusBadgeTextWaitingPayment: { color: "white" },
  statusBadgeDefault: { backgroundColor: "#888" }, // Default/Unknown
  statusBadgeTextDefault: { color: "white" },

  itemContent: {
    flexDirection: "row",
    alignItems: "center", // Align image and text block vertically
    paddingTop: 5, // Add padding top to avoid overlap with absolute badge
  },
  itemImage: {
    width: 70, // Slightly larger image
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1, // Take available space
    justifyContent: "center", // Center content vertically if needed
  },
  itemPrice: {
    color: "#00E676", // Bright green price
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  itemName: {
    color: "white",
    fontSize: 15,
    marginBottom: 6, // Space below name
  },
  itemSubText: {
    // Style for the "已完成xx单" text if needed
    color: "#AAA",
    fontSize: 12,
  },
  itemActions: {
    justifyContent: "center", // Center button vertically if there's only one
    alignItems: "flex-end", // Align button to the right
    marginLeft: 10, // Space between details and actions
  },
  actionButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 15, // Rounded corners
    borderWidth: 1,
    minWidth: 80, // Ensure minimum width
    alignItems: "center",
  },
  actionButtonCancel: {
    borderColor: "#888", // Grey border for cancel
    backgroundColor: "transparent",
  },
  actionButtonTextCancel: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  actionButtonReview: {
    borderColor: "#888", // Grey border for review
    backgroundColor: "transparent",
  },
  actionButtonTextReview: {
    color: "white", // White text for review
    fontSize: 13,
    fontWeight: "500",
  },
});
