import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { auth, db } from '../firebase';
import { ref, get, set } from 'firebase/database';

const UserDetailsScreen = ({ route }) => {
    const { user } = route.params;
    const [newReview, setNewReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoggedInUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const loadReviews = async () => {
            const currentUserPhoneNumber = user.phoneNumer;
            const userRef = ref(db, `Users/${currentUserPhoneNumber}/reviews`);

            try {
                const snapshot = await get(userRef);
                const reviewData = snapshot.val();

                if (reviewData) {
                    const reviewsArray = Object.values(reviewData);
                    setReviews(reviewsArray);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadReviews();
    }, [user]);

    const addReview = async () => {
        const currentUserPhoneNumber = user.phoneNumer;
        console.log("Logged in assss:", loggedInUser.email);
        console.log("giving review to:", user.email);
        if (loggedInUser.email.toLowerCase() === user.email.toLowerCase()) {
            alert("You cannot review yourself.");
        }
        else {
            console.log("Logged in as:", loggedInUser.email);
            if (newReview) {
                try {
                    await set(ref(db, `Users/${currentUserPhoneNumber}`), {
                        ...user,
                        reviews: { ...reviews, [Date.now()]: newReview },
                    });
                    setNewReview('');
                    alert('Review added successfully');
                } catch (error) {
                    alert(error);
                }
            }
            else
                alert('You haven\'t written a review yet!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{user.username}</Text>

            <View style={styles.detailsContainer}>

                <View>
                    <Text style={styles.label}>Phone Number:</Text>
                    <Text style={styles.value}> {user.phoneNumer}</Text>
                </View>
                <View>
                    <Text> </Text>
                    <Text style={styles.label}>Job:</Text>
                    <Text style={styles.value}> {user.job}</Text>
                </View>
                <View>
                    <Text> </Text>
                    <Text style={styles.label}>Area:</Text>
                    <Text style={styles.value}> {user.area}</Text>
                </View>
                <View>
                    <Text> </Text>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}> {user.email}</Text>
                </View>
            </View>

            <View style={styles.reviewContainer}>
                <TextInput
                    placeholder="Write your review here..."
                    value={newReview}
                    onChangeText={setNewReview}
                    style={styles.input}
                />
                <TouchableOpacity onPress={addReview} style={styles.addButton}>
                    <Text style={styles.buttonText}>Add Review</Text>
                </TouchableOpacity>
                <FlatList
                    data={reviews}
                    renderItem={({ item }) => (
                        <View style={styles.reviewItem}>
                            <Text style={styles.reviewText}>{item}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.reviewList}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
    },
    heading: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: "2%",
        color: '#333',
        marginTop: "10%",
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '80%',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    reviewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewItem: {
        marginTop: "3%",
        backgroundColor: '#EDE7F6',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    reviewText: {
        fontSize: 16,
        color: '#333',
    },
    reviewList: {
        width: '100%',
        marginBottom: "10%",
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

});
export default UserDetailsScreen;
