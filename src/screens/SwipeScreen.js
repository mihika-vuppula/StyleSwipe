import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FilterModal from '../components/FilterModal';
import styles from './SwipeScreen.styles';
import { theme } from '../styles/Theme';

export default function SwipeScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState(['WOMENS', 'MENS']);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedDepartments(['WOMENS', 'MENS']);
  };

  const toggleDepartment = (department) => {
    setSelectedDepartments((prev) =>
      prev.includes(department)
        ? prev.filter((d) => d !== department)
        : [...prev, department]
    );
  };

  const renderBoxContainer = () => (
    <View style={styles.boxContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="close" size={24} color={theme.negativeColor} />
      </TouchableOpacity>
      <View style={styles.box}>
        <TouchableOpacity style={styles.plusButton}>
          <MaterialIcons name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="favorite" size={24} color={theme.positiveColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>For You</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterIconButton}>
          <MaterialIcons name="filter-list" size={24} color={theme.primaryColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.middleContent}>
        {renderBoxContainer()}
        {renderBoxContainer()}
        {renderBoxContainer()}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Create Outfit</Text>
      </TouchableOpacity>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        selectedDepartments={selectedDepartments}
        toggleDepartment={toggleDepartment}
        clearFilters={clearFilters}
      />
    </SafeAreaView>
  );
}
