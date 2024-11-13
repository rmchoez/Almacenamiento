import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Button as NativeBaseButton, Text as NativeBaseText } from 'native-base';
import { Button as PaperButton, Text as PaperText, Card, Divider } from 'react-native-paper';
import { NativeBaseProvider } from 'native-base';  // Importa NativeBaseProvider
import { Provider as PaperProvider } from 'react-native-paper';  // Importa PaperProvider

const NativeStyleScreen = () => {
  return (
    // Aquí envolvemos la pantalla solo con los proveedores de las bibliotecas necesarias
    <NativeBaseProvider>
      <PaperProvider>
        <View style={styles.container}>
          {/* Contenedor de NativeBase */}
          <Box alignItems="center" style={styles.nativeBaseContainer}>
            <NativeBaseText fontSize="xl" style={styles.title}>Native Base Component</NativeBaseText>
            <NativeBaseButton onPress={() => alert('¡Botón de NativeBase!')} style={styles.nativeBaseButton}>
              Click me
            </NativeBaseButton>
          </Box>

          <Divider style={styles.divider} />

          {/* Contenedor de React Native Paper */}
          <Card style={styles.paperCard}>
            <Card.Content>
              <PaperText style={styles.title}>React Native Paper Component</PaperText>
              <PaperButton
                mode="contained"
                onPress={() => alert('¡Botón de React Native Paper!')}
                style={styles.paperButton}
              >
                Press me
              </PaperButton>
            </Card.Content>
          </Card>
        </View>
      </PaperProvider>
    </NativeBaseProvider>
  );
};

export default NativeStyleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  nativeBaseContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nativeBaseButton: {
    backgroundColor: '#6200ea',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#6200ea',
    height: 1,
  },
  paperCard: {
    padding: 16,
  },
  paperButton: {
    marginTop: 10,
    backgroundColor: '#6200ea',
  },
});
