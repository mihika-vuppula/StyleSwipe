import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../styles/Theme';
import designerNames from '../constant/DesignerNames.json';

export default function FilterModal({
  visible,
  onClose,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  clearFilters,
  selectedDesigner,
  setSelectedDesigner,
  selectedTop,
  setSelectedTop,
  selectedBottom,
  setSelectedBottom,
  selectedFootwear,
  setSelectedFootwear,
  isNew,
  toggleIsNew,
}) {
  const footwearCategories = [
    "Boots",
    "Clogs",
    "Espadrilles",
    "Flats",
    "Pumps",
    "Rain & Winter Boots",
    "Sandals",
    "Sneakers & Athletic",
    "Designer Boutique",
    "Edged Up Shoes",
    "Kitten Heels",
    "Ballet Flats",
  ];

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedDesigner('');
    setSelectedTop('');
    setSelectedBottom('');
    setSelectedFootwear('');
    clearFilters(); 
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterPanel}>

          <View style={styles.header}>
            <Text style={[styles.modalTitle, theme.title]}>Filters</Text>
            <TouchableOpacity onPress={handleClearFilters}>
              <Text style={styles.clearLink}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>What’s New</Text>
            <TouchableOpacity
              style={[styles.checkbox, isNew && styles.checkedCheckbox]}
              onPress={toggleIsNew}
            >
              {isNew && <Text style={styles.checkboxIcon}>✔</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.filterOption}>
            <Text style={styles.filterLabel}>Designer</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDesigner}
                onValueChange={setSelectedDesigner}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                {designerNames.designers.map((designer, index) => (
                  <Picker.Item key={index} label={designer} value={designer} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterOption}>
            <Text style={styles.filterLabel}>Tops</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTop}
                onValueChange={setSelectedTop}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Tops" value="Tops" />
                <Picker.Item label="Sweaters & Knits" value="Sweaters & Knits" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterOption}>
            <Text style={styles.filterLabel}>Bottoms</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBottom}
                onValueChange={setSelectedBottom}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Jeans" value="jeans" />
                <Picker.Item label="Skirt" value="skirt" />
                <Picker.Item label="Pants" value="pants" />
                <Picker.Item label="Shorts" value="shorts" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterOption}>
            <Text style={styles.filterLabel}>Footwear</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedFootwear}
                onValueChange={setSelectedFootwear}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                {footwearCategories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category.toLowerCase()} />
                ))}
              </Picker>
            </View>
          </View>

          <Text style={[styles.filterLabel, styles.priceTitle]}>Price</Text>

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
    width: '90%',
    alignItems: 'stretch',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearLink: {
    color: theme.primaryColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceTitle: {
    marginTop: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: theme.primaryColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkedCheckbox: {
    backgroundColor: theme.primaryColor,
  },
  checkboxIcon: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  filterOption: {
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.primaryColor,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#FFF',
  },
  priceInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: {
    width: '45%',
    borderWidth: 1,
    borderColor: theme.primaryColor,
    borderRadius: 20,
    padding: 12,
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: theme.primaryColor,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
