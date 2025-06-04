import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../lib/api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // const res = await api.get('/user/order');
        // setOrders(res.data.orders);
        setOrders([]);
      } catch (error) {
        alert("加载失败");
      }
    }
    fetchOrders();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.item} - {item.status}
          </Text>
        )}
      />
    </View>
  );
}
