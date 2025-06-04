import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import Icon from "@expo/vector-icons/FontAwesome5";

interface RechargeModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
  onConfirm: (method: string) => void;
}

const paymentMethods = [
  {
    id: 'alipay',
    label: '支付宝',
    icon: require('@/assets/recharge/alipay.png'),
  },
  {
    id: 'manual',
    label: '人工充值',
    icon: require('@/assets/recharge/manual.png'),
  },
  {
    id: 'digital_yuan',
    label: '数字人民币',
    icon: require('@/assets/recharge/digital_rmb.png'),
  },
  {
    id: 'wechat',
    label: '微信',
    icon: require('@/assets/recharge/wechat.png'),
  },
];

const RechargeModal: React.FC<RechargeModalProps> = ({
  visible,
  amount,
  onClose,
  onConfirm,
}) => {
  const [selectedId, setSelectedId] = useState('alipay');

  const renderItem = ({ item }: { item: typeof paymentMethods[0] }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={styles.iconLabel}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
        <View style={styles.radio}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="slide" visible={visible} transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* 空白区域点击关闭 */}
      </Pressable>
      <View style={styles.container}>
        <View style={styles.handleBar} />
        <Text style={styles.title}>支付金额</Text>
        <Text style={styles.amount}>¥{amount}</Text>
        <Text style={styles.subtitle}>请选择支付方式</Text>

        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{ marginTop: 12 }}
        />

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onConfirm(selectedId)}
        >
          <Text style={styles.confirmText}>确认付款</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  amount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  confirmButton: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default RechargeModal;
