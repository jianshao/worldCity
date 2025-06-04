import { Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { cities } from '@/constants/cities';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text className="text-white">{selectedCity} ▼</Text>
      </TouchableOpacity>
      {open && (
        <View className="absolute top-10 left-0 right-0 bg-white p-4">
          {cities.map((group) => (
            <View key={group.label}>
              <Text className="font-bold">{group.label}</Text>
              {group.items.map((city) => (
                <TouchableOpacity key={city} onPress={() => { onCityChange(city); setOpen(false); }}>
                  <Text>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}
    </>
  );
}
