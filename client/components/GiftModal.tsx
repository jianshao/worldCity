import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from 'react-native';

const gifts = [
  { id: '1', name: '浪漫玫瑰', price: 10, icon: require('@/assets/gifts/rose.png') },
  { id: '2', name: '棒棒糖', price: 100, icon: require('@/assets/gifts/rose.png') },
  { id: '3', name: '奶油蛋糕', price: 400, icon: require('@/assets/gifts/rose.png') },
  { id: '4', name: '皇冠', price: 650, icon: require('@/assets/gifts/rose.png') },
  { id: '5', name: '超级钻石', price: 800, icon: require('@/assets/gifts/rose.png') },
  { id: '6', name: '包包', price: 1400, icon: require('@/assets/gifts/rose.png') },
  { id: '7', name: '水晶鞋', price: 1700, icon: require('@/assets/gifts/rose.png') },
  { id: '8', name: '晚礼服', price: 2300, icon: require('@/assets/gifts/rose.png') },
  { id: '9', name: '亲亲一口', price: 9999, icon: require('@/assets/gifts/rose.png') },
];

type Gift = typeof gifts[0];

interface GiftModalProps {
  visible: boolean;
  onClose: () => void;
  onSendGift: (gift: Gift, count: number) => void;
  balance: number;
}

const GiftModal: React.FC<GiftModalProps> = ({ visible, onClose, onSendGift, balance }) => {
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [tab, setTab] = useState<'Gift' | 'Backpack'>('Gift');
  const scaleAnim = new Animated.Value(1);

  const handleGiftPress = (giftId: string) => {
    setSelectedGiftId(giftId);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          {['Gift', 'Backpack'].map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t as any)} style={{ marginRight: 24 }}>
              <Text style={[styles.tabText, tab === t && styles.activeTab]}>{t}</Text>
              {tab === t && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Gift List */}
        <FlatList
          data={gifts}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.giftList}
          renderItem={({ item }) => {
            const selected = selectedGiftId === item.id;
            return (
              <TouchableOpacity onPress={() => handleGiftPress(item.id)} activeOpacity={0.9}>
                <Animated.View
                  style={[
                    styles.giftItem,
                    selected && styles.giftItemSelected,
                    selected && { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <Image source={item.icon} style={styles.giftIcon} resizeMode="contain" />
                  <Text style={styles.giftName}>{item.name}</Text>
                  <Text style={styles.giftPrice}>🥇 {item.price}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.coinBtn}>
            <Text style={styles.coinText}>🥇 {balance} &gt;</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.countSelector}
            onPress={() => setCount((prev) => (prev === 1 ? 10 : 1))}
          >
            <Text style={styles.countText}>×{count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendBtn}
            disabled={!selectedGiftId}
            onPress={() => {
              const gift = gifts.find((g) => g.id === selectedGiftId);
              if (gift) onSendGift(gift, count);
              onClose();
            }}
          >
            <Text style={styles.sendText}>Gift</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GiftModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTab: {
    color: '#fff',
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#fff',
    marginTop: 4,
    borderRadius: 1,
  },
  giftList: {
    paddingBottom: 10,
  },
  giftItem: {
    width: 70,
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  giftItemSelected: {
    borderColor: '#FFD700',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  giftIcon: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  giftName: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 2,
  },
  giftPrice: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  coinBtn: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginRight: 10,
  },
  coinText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  countSelector: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
    marginRight: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 14,
  },
  sendBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  sendText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
