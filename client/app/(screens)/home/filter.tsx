'use client';

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useFilterStore } from '@/store/filterStore';

const genderOptions = ['不限', '男', '女'];
const cities = ['上海', '北京', '广州', '深圳', '新加坡', '曼谷', '吉隆坡'];

export default function FilterPage() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState('不限');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 30]);
  const [distance, setDistance] = useState(10);
  const [selectedCity, setSelectedCity] = useState('上海');
  const { setFilter } = useFilterStore();

  const handleConfirm = () => {
    setFilter({
      gender: selectedGender,
      ageRange,
      distance,
      city: selectedCity,
    });
    router.back();
  };
  const handleReset = () => {
    setSelectedGender('不限');
    setAgeRange([18, 30]);
    setDistance(10);
    setSelectedCity('上海');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 性别 */}
        <Text style={styles.label}>性别</Text>
        <View style={styles.optionRow}>
          {genderOptions.map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.optionButton,
                selectedGender === gender && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedGender(gender)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedGender === gender && styles.optionTextSelected,
                ]}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 年龄 */}
        <Text style={styles.label}>年龄段</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{ageRange[0]}岁</Text>
          <Slider
            style={{ flex: 1 }}
            minimumValue={18}
            maximumValue={60}
            value={ageRange[0]}
            step={1}
            onValueChange={(value) => setAgeRange([value, ageRange[1]])}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ccc"
          />
          {/* <Slider
            style={{ flex: 1 }}
            minimumValue={18}
            maximumValue={60}
            value={ageRange[1]}
            step={1}
            onValueChange={(value) => setAgeRange([ageRange[0], value])}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ccc"
          /> */}
          <Text style={styles.sliderValue}>{ageRange[1]}岁</Text>
        </View>

        {/* 距离 */}
        <Text style={styles.label}>距离范围 (km)</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{distance}km</Text>
          <Slider
            style={{ flex: 1 }}
            minimumValue={1}
            maximumValue={100}
            value={distance}
            step={1}
            onValueChange={(value) => setDistance(value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ccc"
          />
        </View>

        {/* 城市 */}
        <Text style={styles.label}>城市</Text>
        <View style={styles.optionRow}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.optionButton,
                selectedCity === city && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedCity(city)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCity === city && styles.optionTextSelected,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={{ color: '#333' }}>重置</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={{ color: '#fff' }}>确认</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  sliderValue: {
    width: 50,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
});
