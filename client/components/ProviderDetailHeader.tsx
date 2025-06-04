import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

export const ProviderDetailHeader = () => (
  <View style={styles.container}>
    <Image source={{ uri: 'https://example.com/avatar.jpg' }} style={styles.avatar} />
    <Text style={styles.name}>AAChen</Text>
    <Text style={styles.desc}>00后 | 170 | 50kg | 88-63-90</Text>
    <Text style={styles.desc}>ID: 827100927</Text>

    <View style={styles.tagContainer}>
      {['小甜甜', '花样百出', '身材棒', '气质女王', '服务到位', '人美心善'].map(tag => (
        <Text key={tag} style={styles.tag}>{tag}</Text>
      ))}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: { backgroundColor: '#000', padding: 16, alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  name: { color: '#fff', fontSize: 20, marginTop: 8 },
  desc: { color: '#ccc', fontSize: 12 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: {
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
    fontSize: 12,
  },
})
