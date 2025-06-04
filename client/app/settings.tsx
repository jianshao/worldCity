import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import api from '../lib/api';

export default function Settings() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get('/user/settings');
        setSettings(res.data);
      } catch (error) {
        alert('加载失败');
      }
    }
    fetchSettings();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>通知: {settings.notifications ? '开启' : '关闭'}</Text>
      <Text>深色模式: {settings.darkMode ? '开启' : '关闭'}</Text>
    </View>
  );
}
