import { View, TouchableOpacity, Text } from 'react-native';
import { channels } from '@/constants/channels';

interface ChannelTabsProps {
  selectedChannel: string;
  onChannelChange: (channel: string) => void;
}

export function ChannelTabs({ selectedChannel, onChannelChange }: ChannelTabsProps) {
  return (
    <View className="flex-row justify-around my-2">
      {channels.map((channel) => (
        <TouchableOpacity key={channel} onPress={() => onChannelChange(channel)}>
          <Text className={`text-lg ${selectedChannel === channel ? 'text-blue-400' : 'text-white'}`}>
            {channel}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
