// screens/ProductList.tsx
import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, View } from "react-native";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
import { useRouter } from "expo-router";
import { GetServiceProviders } from "@/lib/provider";
import { ProductResp } from "@/types/provider";

const categories = ["伴游", "保健", "高尔夫", "派对"];
// const mockProducts: Product[] = [
//   {
//     id: "1",
//     avatar:
//       "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
//     name: "Lisa",
//     score: "5.0",
//     orders: 170,
//     comments: 135,
//     availableTime: "今10:00",
//     status: "available",
//   },
//   {
//     id: "2",
//     avatar:
//       "https://lh3.googleusercontent.com/ogw/AF2bZyhu8SsXaDe96VsnXOeut-EXAjvhakcwEktISwbuoRaQtQ=s64-c-mo",
//     name: "LLL",
//     score: "5.0",
//     orders: 170,
//     comments: 135,
//     availableTime: "今10:00",
//     status: "available",
//   },
//   // 更多数据...
// ];

const ProductList = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [products, setProducts] = useState<ProductResp[]>([]);

  useEffect(() => {
    try {
      // 从api获取当前项目下的服务者信息
      GetServiceProviders(selectedCategory + 1).then((res) => {
        setProducts(res.providers);
      });
    } catch (e) {
      console.log("err", e);
    }
  }, [selectedCategory]);

  // const filteredProducts = mockProducts; // 此处可按分类筛选数据
  const handleAvatarPress = (id: string) => {
    router.push(`/products/${id}` as any);
  };

  return (
    <View style={styles.container}>
      <CategoryTabs
        categories={categories}
        activeIndex={selectedCategory}
        onTabPress={setSelectedCategory}
        onSearchPress={() => {}}
      />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onAvatarPress={handleAvatarPress} />
        )}
        keyExtractor={(item) => item.provider.id.toString()}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default ProductList;
