import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import SelectDropdown from 'react-native-select-dropdown';
import { get, child, ref } from 'firebase/database';
import { Image } from 'react-native';

const SearchScreen = () => {
  const [value, setValue] = useState(null); // The value of the job
  const [value2, setValue2] = useState(null); // The value of the area
  const [searchText, setSearchText] = useState(''); // The search text

  const items = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Specialist', 'Graphic Designer', 'Web Developer', 'Accountant', 'Sales Representative', 'Human Resources Manager', 'Project Manager', 'Financial Analyst', 'Operations Manager', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Architect', 'Lawyer', 'Doctor', 'Nurse', 'Pharmacist', 'Teacher', 'Chef', 'Plumber', 'Electrician', 'Carpenter', 'Mechanic', 'Locksmith', 'Painter', 'Gardener'];
  const navigation = useNavigation();
  const areas = ["All areas", "HaSharon", "Center", "North", "South"];

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    handleSearch();
  }, [searchText]); // Run the search whenever the search text changes

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const handleSearch = async () => {
    try {
      const snapshot = await get(child(ref(db), 'Users'));
      const users = Object.values(snapshot.val());

      if (value || value2) {
        let results = users;

        if (value) {
          results = results.filter((user) => user.job === value);
        }

        if (value2 && value2 !== "All areas") {
          results = results.filter((user) => user.area === value2);
        }
        if (results.length === 0) {
            alert('No results found');
          }
        // Filter the results based on the search text
        if (searchText) {
          results = results.filter((user) =>
            user.username.toLowerCase().startsWith(searchText.toLowerCase())
          );
        }
        setSearchResults(results);

      } else {
        setSearchResults([]);
        alert('Please select a job and area');
        }
    } catch (error) {
      console.error(error);
    }
  };

  const renderResultItem = ({ item }) => {
    const onPressHandler = () => {
      navigation.navigate('UserDetailsScreen', { user: item });
    };

    return (
      <TouchableOpacity onPress={onPressHandler}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Name: {item.username}</Text>
          <Text style={styles.resultText}>Phone Number: {item.phoneNumer}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  console.log("Search results state:", searchResults);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 30, alignItems: 'stretch' }}>
        <Image
          source={require('../grapic/small_logo.png')}
          style={{
            position: 'absolute',
            top: 0,
            left: 60,
            width: 140,
            height: 140,
          }}
          resizeMode="contain"
        />
        <Image
          source={require('../grapic/line.jpg')}
          style={{
            position: 'absolute',
            top: 40,
            left: -200,
            width: 400,
            height: 100,
          }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.question}>Search for a professional</Text>
      <View style={styles.dropdownContainer}>
        <SelectDropdown
          data={items}
          onSelect={(selectedItem) => setValue(selectedItem)}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
          dropdownStyle={{
            ...styles.dropdownStyle,
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
          }}
          dropdownTextStyle={styles.dropdownTextStyle}
          search={true}
          searchTextInputStyle={styles.searchTextInputStyle}
          defaultButtonText="Select a job"
          renderDropdownIcon={() => null}
        />
        <SelectDropdown
          data={areas}
          onSelect={(selectedItem) => setValue2(selectedItem)}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
          dropdownStyle={{
            ...styles.dropdownStyle,
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
          }}
          dropdownTextStyle={styles.dropdownTextStyle}
          search={true}
          searchTextInputStyle={styles.searchTextInputStyle}
          defaultButtonText="Select an area"
          renderDropdownIcon={() => null}
        />
      </View>
      <TextInput
        style={styles.searchTextInput}
        placeholder="Search by name"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={searchResults}
        renderItem={renderResultItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 10,
    marginTop: 15,
    width: '100%',
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#444',
    marginBottom: 5,
  },
  searchButton: {
    backgroundColor: '#2D9CDB',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#2D9CDB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: '20%',
  },
  buttonStyle: {
    width: 170,
    height: 45,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: '2%',
  },
  buttonTextStyle: {
    fontSize: 16,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownStyle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '65%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    maxHeight: 200,
  },
  dropdownTextStyle: {
    fontSize: 16,
    padding: 8,
  },
  searchTextInputStyle: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#FF0000',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signOutButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  searchTextInput: {
    width: '60%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SearchScreen;