import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { theme } from '../styles/Theme';


export default function FilterModal({
  visible, onClose, minPrice, maxPrice,
  setMinPrice, setMaxPrice, clearFilters
}) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterPanel}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          <View style={styles.priceInputs}>
            <TextInput
              style={styles.input}
              placeholder="Min Price"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Max Price"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>  

          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPanel: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  priceInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '45%',
    borderColor: theme.secondaryColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    textAlign: 'center',
  },
  filterLabel: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  clearButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: theme.secondaryColor,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  clearButtonText: {
    fontWeight: 'bold',
  },
  applyButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: theme.primaryColor,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
