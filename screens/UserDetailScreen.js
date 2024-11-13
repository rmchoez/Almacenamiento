import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Image } from 'react-native';

const Accordion = ({ title, children }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.accordionTitle}>{title}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const UserDetailScreen = ({ route }) => {
  const { user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
 <View style={styles.imageContainer}>
        <Image source={{ uri: user.image }} style={styles.userImage} />
      </View>
      <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.userDetail}>Edad: {user.age}</Text>
      <Text style={styles.userDetail}>Género: {user.gender}</Text>
      <Text style={styles.userDetail}>Correo: {user.email}</Text>

      <Accordion title="Dirección">
        <Text style={styles.userDetail}>Ciudad: {user.address.city}</Text>
        <Text style={styles.userDetail}>Estado: {user.address.state}</Text>
      </Accordion>

      <Accordion  title="Banco">
        <Text style={styles.userDetail}>Número de Tarjeta: {user.bank.cardNumber}</Text>
        <Text style={styles.userDetail}>Expiración: {user.bank.cardExpire}</Text>
      </Accordion>

      <Accordion title="Compañía">
        <Text style={styles.userDetail}>Nombre: {user.company.name}</Text>
        <Text style={styles.userDetail}>Departamento: {user.company.department}</Text>
      </Accordion>

      <Accordion title="Crypto">
        <Text style={styles.userDetail}>Wallet: {user.crypto.wallet}</Text>
      </Accordion>
      <Accordion title="Crypto">
        <Text style={styles.userDetail}>Moneda: {user.crypto.coin}</Text>
        <Text style={styles.userDetail}>Red: {user.crypto.network}</Text>
        <Text style={styles.userDetail}>Wallet: {user.crypto.wallet}</Text>
      </Accordion>

      <Accordion title="Otros">
        <Text style={styles.userDetail}>SSN: {user.ssn}</Text>
        <Text style={styles.userDetail}>EIN: {user.ein}</Text>
        <Text style={styles.userDetail}>User Agent: {user.userAgent}</Text>
      </Accordion>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#6200ea' },
  userDetail: { fontSize: 16, color: 'black', marginVertical: 2 },
  accordionContainer: { backgroundColor: '#ffffff', borderRadius: 8, marginVertical: 10, padding: 10, elevation: 2 },
  accordionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6200ea' },
  accordionContent: { paddingTop: 5, paddingLeft: 10 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  userImage: { width: 128, height: 128, borderRadius: 64 }, // Imagen redonda
});

export default UserDetailScreen;

