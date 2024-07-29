import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomMarker: React.FC = () => {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#007AFF',
  },
});

export default CustomMarker;
