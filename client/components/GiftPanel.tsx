// src/components/GiftPanel.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data ---
const mockGifts = [
  { id: 'rose', name: '浪漫玫瑰', price: 10, icon: 'https://picsum.photos/50?random=10' },
  { id: 'lollipop', name: '棒棒糖', price: 100, icon: 'https://picsum.photos/50?random=11' },
  { id: 'cake', name: '奶油蛋糕', price: 400, icon: 'https://picsum.photos/50?random=12' },
  { id: 'crown', name: '皇冠', price: 650, icon: 'https://picsum.photos/50?random=13' },
  { id: 'diamond', name: '超级钻石', price: 800, icon: 'https://picsum.photos/50?random=14' },
  { id: 'bag', name: '包包', price: 1400, icon: 'https://picsum.photos/50?random=15' },
  { id: 'shoe', name: '水晶鞋', price: 1700, icon: 'https://picsum.photos/50?random=16' },
  { id: 'dress', name: '晚礼服', price: 2300, icon: 'https://picsum.photos/50?random=17' },
   // ... more gifts
];
const mockBackpack = [
  { id: 'rose', name: '浪漫玫瑰', price: 10, icon: 'https://picsum.photos/50?random=10' },
]; // 背包礼物数据

interface Gift {
    id: string;
    name: string;
    price: number;
    icon: string; // URL or require
}

interface GiftPanelProps {
    onSendGift: (gift: Gift, quantity: number) => void;
    onClose: () => void; // (可选) 提供关闭按钮
    userBalance: number; // 用户余额
}

export default function GiftPanel({ onSendGift, userBalance }: GiftPanelProps) {
    const [selectedTab, setSelectedTab] = useState<'Gift' | 'Backpack'>('Gift');
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [quantity, setQuantity] = useState(1);

    const giftsToShow = selectedTab === 'Gift' ? mockGifts : mockBackpack;

    const handleSelectGift = (gift: Gift) => {
        setSelectedGift(gift);
        setQuantity(1); // 重置数量
    };

    const increaseQuantity = () => setQuantity(q => q + 1);
    const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));

    const handleSend = () => {
        if (selectedGift) {
            // 检查余额等逻辑
            if (userBalance >= selectedGift.price * quantity) {
                onSendGift(selectedGift, quantity);
            } else {
                // 提示余额不足
                console.warn("余额不足");
            }
        }
    };

    const renderGiftItem = ({ item }: { item: Gift }) => {
        const isSelected = selectedGift?.id === item.id;
        return (
            <TouchableOpacity
                style={[styles.giftItem, isSelected && styles.giftItemSelected]}
                onPress={() => handleSelectGift(item)}
            >
                <Image source={{ uri: item.icon }} style={styles.giftIcon} />
                <Text style={styles.giftName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.giftPriceContainer}>
                   <Ionicons name="logo-bitcoin" size={12} color="#FFD700" style={{marginRight: 2}} /> {/* 使用金币图标 */}
                   <Text style={styles.giftPrice}>{item.price}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.panelContainer}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setSelectedTab('Gift')}>
                    <Text style={[styles.tabText, selectedTab === 'Gift' && styles.tabTextActive]}>Gift</Text>
                    {selectedTab === 'Gift' && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('Backpack')} style={{ marginLeft: 20 }}>
                     <Text style={[styles.tabText, selectedTab === 'Backpack' && styles.tabTextActive]}>Backpack</Text>
                     {selectedTab === 'Backpack' && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
            </View>

            {/* Gift Grid */}
            <FlatList
                data={giftsToShow}
                renderItem={renderGiftItem}
                keyExtractor={(item) => item.id}
                numColumns={4} // 每行显示 4 个
                style={styles.giftGrid}
                ListEmptyComponent={<Text style={styles.emptyText}>这里空空如也~</Text>}
            />

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.balanceContainer}>
                    <Ionicons name="logo-bitcoin" size={16} color="#FFD700" style={{ marginRight: 4 }}/>
                    <Text style={styles.balanceText}>{userBalance}</Text>
                     <Ionicons name="chevron-forward-outline" size={16} color="#AAA" style={{ marginLeft: 4 }}/>
                </TouchableOpacity>
                {selectedGift && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                             <Ionicons name="remove-outline" size={18} color="#AAA" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>x{quantity}</Text>
                         <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                            <Ionicons name="add-outline" size={18} color="#AAA" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendGiftButton} onPress={handleSend}>
                             <Text style={styles.sendGiftText}>Gift</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    panelContainer: {
        backgroundColor: '#1C1C1E', // 面板背景色
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingTop: 10,
        height: 350, // 固定高度或根据内容调整
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
        paddingBottom: 8,
    },
    tabText: { color: '#AAA', fontSize: 15, fontWeight: '500' },
    tabTextActive: { color: 'white' },
    activeTabIndicator: { height: 2, backgroundColor: 'white', marginTop: 4, borderRadius: 1 },
    giftGrid: { flex: 1, paddingHorizontal: 8 },
    giftItem: {
        flex: 1 / 4, // 等分宽度
        alignItems: 'center',
        margin: 4,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent', // 默认无边框
    },
    giftItemSelected: {
        borderColor: '#00BFFF', // 选中边框
        backgroundColor: 'rgba(0, 191, 255, 0.1)',
    },
    giftIcon: { width: 45, height: 45, marginBottom: 5 },
    giftName: { color: 'white', fontSize: 12, marginBottom: 3, textAlign: 'center' },
    giftPriceContainer: {flexDirection: 'row', alignItems: 'center'},
    giftPrice: { color: '#FFD700', fontSize: 11, fontWeight: '500' }, // 金色价格
    emptyText: { color: '#888', textAlign: 'center', marginTop: 50 },

    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#333',
        backgroundColor: '#111', // 底部条背景色
    },
    balanceContainer: { flexDirection: 'row', alignItems: 'center' },
    balanceText: { color: 'white', fontWeight: '600', fontSize: 15 },
    actionContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { padding: 5 },
    quantityText: { color: 'white', marginHorizontal: 10, fontSize: 15, fontWeight: '500' },
    sendGiftButton: { backgroundColor: '#FFD700', borderRadius: 15, paddingHorizontal: 18, paddingVertical: 6, marginLeft: 15 },
    sendGiftText: { color: 'black', fontWeight: 'bold', fontSize: 14 },
});