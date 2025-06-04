import { Button, View, Text } from 'react-native';
import api from '../lib/api';

export default function Upgrade() {
  const handleUpgrade = async () => {
    try {
      await api.post('/user/upgrade');
      alert('会员升级成功');
    } catch (error) {
      alert('升级失败');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>升级为会员，享受更多特权！</Text>
      <Button title="立即升级" onPress={handleUpgrade} />
    </View>
  );
}
