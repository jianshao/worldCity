'use client';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="search" size={15} color="#fff" />
      {/* <Text style={styles.text}>搜索</Text> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff',
  },
});
