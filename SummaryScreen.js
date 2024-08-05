import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebase/Firebase'; // Adjust the import according to your project structure
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

function SummaryScreen() {
  const [bookings, setBookings] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const fetchBookings = async () => {
    if (!userId) return;

    try {
      const bookingsQuery = query(
        collection(db, 'Bookings'),
        where('userId', '==', userId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsList = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [userId])
  );

  const handleCancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'Bookings', bookingId));
      Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      Alert.alert('Cancellation Failed', 'There was an error cancelling the booking. Please try again.');
    }
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingContainer}>
      <Text style={styles.label}>Company Name:</Text>
      <Text style={styles.detail}>{item.companyName}</Text>
      <Text style={styles.label}>Car Model:</Text>
      <Text style={styles.detail}>{item.carModel}</Text>
      <Text style={styles.label}>Cost per Hour:</Text>
      <Text style={styles.detail}>${item.costPerHour}</Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleCancelBooking(item.id)}
      >
        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bookings</Text>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noBookingsText}>You have no bookings.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  bookingContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  noBookingsText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SummaryScreen;
