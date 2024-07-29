import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VehicleMarker: React.FC = () => {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.marker}>
        <Text style={styles.emoji}>🚌</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
});

export default VehicleMarker;
