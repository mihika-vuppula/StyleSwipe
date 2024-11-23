import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { theme } from '../styles/Theme';
import designerNames from '../constant/DesignerNames.json';

export default function FilterModal({
  visible,
  onClose,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  setMinPrice,
  setMaxPrice,
  clearFilters,
  selectedDesigners: initialSelectedDesigners = [],
  setSelectedDesigners,
  selectedTops: initialSelectedTops = [],
  setSelectedTops,
  selectedBottoms: initialSelectedBottoms = [],
  setSelectedBottoms,
  selectedFootwears: initialSelectedFootwears = [],
  setSelectedFootwears,
  isNew: initialIsNew,
  toggleIsNew,
}) {
  const [showDropdown, setShowDropdown] = useState(null);

  // Local states to track temporary filter changes
  const [tempMinPrice, setTempMinPrice] = useState(initialMinPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(initialMaxPrice);
  const [tempSelectedDesigners, setTempSelectedDesigners] = useState(initialSelectedDesigners);
  const [tempSelectedTops, setTempSelectedTops] = useState(initialSelectedTops);
  const [tempSelectedBottoms, setTempSelectedBottoms] = useState(initialSelectedBottoms);
  const [tempSelectedFootwears, setTempSelectedFootwears] = useState(initialSelectedFootwears);
  const [tempIsNew, setTempIsNew] = useState(initialIsNew);

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

  const toggleSelection = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter((item) => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const renderDropdownItem = (options, selectedArray, setArray) => (
    <FlatList
      data={options}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => toggleSelection(selectedArray, setArray, item)}
        >
          <Text style={selectedArray.includes(item) ? styles.selectedItem : styles.unselectedItem}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderDropdown = (label, options, selectedArray, setArray, dropdownKey) => (
    <View style={styles.filterOption}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownToggle}
        onPress={() => setShowDropdown(showDropdown === dropdownKey ? null : dropdownKey)}
      >
        <Text style={styles.dropdownText}>
          {Array.isArray(selectedArray) && selectedArray.length > 0
            ? selectedArray.join(', ')
            : 'Select'}
        </Text>
        <Text style={styles.dropdownArrow}>{showDropdown === dropdownKey ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showDropdown === dropdownKey && (
        <View style={styles.dropdown}>
          {renderDropdownItem(options, selectedArray, setArray)}
        </View>
      )}
    </View>
  );

  const handleApplyFilters = () => {
    const minPrice = parseFloat(tempMinPrice);
    const maxPrice = parseFloat(tempMaxPrice);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      Alert.alert("Invalid Input", "Please enter valid numeric values for the prices.");
      return;
    }

    if (minPrice < 0) {
      Alert.alert("Invalid Minimum Price", "Minimum price must be greater than or equal to 0.");
      return;
    }

    if (maxPrice <= minPrice) {
      Alert.alert(
        "Invalid Maximum Price",
        "Maximum price must be greater than the minimum price."
      );
      return;
    }

    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setSelectedDesigners(tempSelectedDesigners);
    setSelectedTops(tempSelectedTops);
    setSelectedBottoms(tempSelectedBottoms);
    setSelectedFootwears(tempSelectedFootwears);
    if (tempIsNew !== initialIsNew) toggleIsNew();
    setShowDropdown(null); 
    onClose(); 
  };

  const handleClearFilters = () => {
    setTempMinPrice('');
    setTempMaxPrice('');
    setTempSelectedDesigners([]);
    setTempSelectedTops([]);
    setTempSelectedBottoms([]);
    setTempSelectedFootwears([]);
    setTempIsNew(false);
    clearFilters();
    setShowDropdown(null); 
  };

  const handleCloseWithoutApplying = () => {
    setTempMinPrice(initialMinPrice);
    setTempMaxPrice(initialMaxPrice);
    setTempSelectedDesigners(initialSelectedDesigners);
    setTempSelectedTops(initialSelectedTops);
    setTempSelectedBottoms(initialSelectedBottoms);
    setTempSelectedFootwears(initialSelectedFootwears);
    setTempIsNew(initialIsNew);

    setShowDropdown(null); 
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleCloseWithoutApplying}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterPanel}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCloseWithoutApplying} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, theme.title]}>Filters</Text>
            <TouchableOpacity onPress={handleClearFilters} style={styles.clearButton}>
              <Text style={styles.clearLink}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>What’s New</Text>
            <TouchableOpacity
              style={[styles.checkbox, tempIsNew && styles.checkedCheckbox]}
              onPress={() => setTempIsNew(!tempIsNew)}
            >
              {tempIsNew && <Text style={styles.checkboxIcon}>✔</Text>}
            </TouchableOpacity>
          </View>

          {renderDropdown(
            "Designer",
            designerNames.designers,
            tempSelectedDesigners,
            setTempSelectedDesigners,
            "designer"
          )}
          {renderDropdown("Tops", ["Tops", "Sweaters & Knits"], tempSelectedTops, setTempSelectedTops, "tops")}
          {renderDropdown("Bottoms", ["Jeans", "Skirt", "Pants", "Shorts"], tempSelectedBottoms, setTempSelectedBottoms, "bottoms")}
          {renderDropdown("Footwear", footwearCategories, tempSelectedFootwears, setTempSelectedFootwears, "footwear")}

          <Text style={[styles.filterLabel, styles.priceTitle]}>Price</Text>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.input}
              placeholder="Min Price"
              keyboardType="numeric"
              value={tempMinPrice}
              onChangeText={setTempMinPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Max Price"
              keyboardType="numeric"
              value={tempMaxPrice}
              onChangeText={setTempMaxPrice}
            />
          </View>

          <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton}>
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
    marginBottom: 10,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.primaryColor,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
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
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primaryColor,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    color: '#000',
    flex: 1,
  },
  dropdownArrow: {
    marginLeft: 10,
    color: theme.primaryColor,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.primaryColor,
    borderRadius: 10,
    maxHeight: 150,
    backgroundColor: '#FFF',
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  selectedItem: {
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  unselectedItem: {
    color: '#000',
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
