import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db } from '../firebase';


const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumer, setPhoneNumer] = useState("");
  const reviews = [];
  const [job, setJob] = useState("");
  const [area, setArea] = useState("");
  const navigation = useNavigation();
  const items = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Specialist', 'Graphic Designer', 'Web Developer', 'Accountant', 'Sales Representative', 'Human Resources Manager', 'Project Manager', 'Financial Analyst', 'Operations Manager', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Architect', 'Lawyer', 'Doctor', 'Nurse', 'Pharmacist', 'Teacher', 'Chef', 'Plumber', 'Electrician', 'Carpenter', 'Mechanic', 'Locksmith', 'Painter', 'Gardener'];
  const areas = ["Center", "HaSharon", "North", "South"]

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Login");
      }
    });

    return unsubscribe;
  }, []);

  function create() {
    const userData = {
      username: fullName,
      email: email,
      password: password,
      job: job,
      phoneNumer: phoneNumer,
      reviews: reviews,
      area: area,
    };

    const userRef = ref(db, `Users/${phoneNumer}`);
    set(userRef, userData)
      .then(() => {
        alert("Data updated");
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            navigation.replace("SearchScreen");
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error);
      });
  }


  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            create();
          })
          .catch((error) => {
            alert(error.message);
          });
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Register page</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={text => setFullName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone Number"
          value={phoneNumer}
          onChangeText={text => setPhoneNumer(text)}
          style={styles.input}
        />
        <SelectDropdown
          data={items}
          onSelect={selectedItem => setJob(selectedItem)}
          defaultButtonText="Select Job"
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownTextStyle}
          search={true}
          searchTextInputStyle={styles.searchTextInputStyle}
        />
        <SelectDropdown
          data={areas}
          onSelect={selectedItem => setArea(selectedItem)}
          defaultButtonText="Select area"
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownTextStyle}
          search={true}
          searchTextInputStyle={styles.searchTextInputStyle}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (fullName && email && password && job && phoneNumer && area) {
              handleSignUp();
            }
            else
              alert("You didn't fill in all the details");
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
    color: '#1E90FF',
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: "3%",
  },
  buttonTextStyle: {
    fontSize: 17,
    color: 'black',
  },
  dropdownStyle: {
    marginTop: "20%",
    marginLeft: "2%",
    width: '75%',
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
    borderRadius: 9,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 17,
  },
});
