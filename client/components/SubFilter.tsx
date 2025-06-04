import { View, Text, StyleSheet } from 'react-native';

export function SubFilter() {
  return (
    <View style={styles.container}>
      <Text style={styles.filter}>附近</Text>
      <Text style={styles.filter}>活跃</Text>
      <Text style={styles.filter}>新人</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 6,
  },
  filter: {
    backgroundColor: '#222',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
});
