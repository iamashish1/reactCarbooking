import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebase/Firebase'; // Adjust the import according to your project structure
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

function CarDetailScreen({ route }) {
  const { transaction } = route.params;
  const [bookedCabs, setBookedCabs] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    const fetchBookedCabs = async () => {
      if (!userId) return;

      try {
        const bookedCabsQuery = query(
          collection(db, 'Bookings'),
          where('userId', '==', userId)
        );
        const bookedCabsSnapshot = await getDocs(bookedCabsQuery);
        const bookedCabsList = bookedCabsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookedCabs(bookedCabsList);
      } catch (error) {
        console.error('Error fetching booked cabs:', error);
      }
    };

    fetchBookedCabs();
  }, [userId]);

  const handleBookCab = async () => {
    if (!userId) {
      Alert.alert('Not Authenticated', 'You need to be logged in to book a cab.');
      return;
    }

    if (bookedCabs.length >= 2) {
      Alert.alert('Booking Limit', 'You cannot book more than 2 cabs at a time.');
      return;
    }

    setIsBooking(true);

    try {
      await addDoc(collection(db, 'Bookings'), {
        userId,
        cabId: transaction.id,
        companyName: transaction.companyName,
        carModel: transaction.carModel,
        costPerHour: transaction.costPerHour,
        numPassengers: transaction.numPassengers,
        rating: transaction.rating,
        bookedAt: new Date(),
      });

      Alert.alert('Booking Confirmed', 'Your cab has been booked successfully.');
      // Update bookedCabs state
      setBookedCabs(prev => [...prev, { cabId: transaction.id }]);
    } catch (error) {
      Alert.alert('Booking Failed', 'There was an error booking the cab. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const isAlreadyBooked = bookedCabs.some(cab => cab.cabId === transaction.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: transaction.icon }} style={styles.headerImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{transaction.companyName}</Text>
        <Text style={styles.carModel}>{transaction.carModel}</Text>
        <Text style={styles.label}>Number of Passengers:</Text>
        <Text style={styles.detail}>{transaction.numPassengers}</Text>
        <Text style={styles.label}>Rating:</Text>
        <Text style={styles.detail}>{transaction.rating}</Text>
        <Text style={styles.label}>Cost per Hour:</Text>
        <Text style={styles.detail}>${transaction.costPerHour}</Text>

        <TouchableOpacity
          style={[styles.bookButton, isAlreadyBooked && styles.bookButtonDisabled]}
          onPress={handleBookCab}
          disabled={isBooking || isAlreadyBooked}
        >
          <Text style={styles.bookButtonText}>
            {isAlreadyBooked ? 'Booked' : isBooking ? 'Booking...' : 'Book Cab'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  carModel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  bookButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CarDetailScreen
