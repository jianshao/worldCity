import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export function useCity() {
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);

      if (geocode.length > 0) {
        setCity(geocode[0].city || geocode[0].region || null);
      }
    })();
  }, []);

  return city;
}
