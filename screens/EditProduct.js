import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../Theme';

const EditProduct = ({ isVisible, onClose, item, onSave }) => {
    const [formData, setFormData] = useState(item);
    // Sincroniza el formData con el producto seleccionado
    useEffect(() => {
        setFormData({
            ...item,
            price: item?.price?.toString() || '',
            stock: item?.stock || 0,
            description: item?.description || ''
        });
    }, [item]);

    const incrementStock = () => {
        setFormData({ ...formData, stock: formData.stock + 1 });
    };

    const decrementStock = () => {
        if (formData.stock > 0) {
            setFormData({ ...formData, stock: formData.stock - 1 });
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Editar Producto</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={formData?.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                        placeholder="Título"
                    />

                    <Text style={styles.label}>Precio</Text>
                    <TextInput
                        style={styles.input}
                        value={formData?.price}
                        onChangeText={(text) => {
                            const numericValue = text.replace(/[^0-9.]/g, '');
                            setFormData({ ...formData, price: numericValue });
                        }}
                        placeholder="Precio"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData?.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Descripción"
                        multiline={true}
                        numberOfLines={4} // Altura inicial del textarea
                    />

                    <View style={styles.stockContainer}>
                        <Text style={styles.stockLabel}>Stock:</Text>
                        <TouchableOpacity style={styles.stockButton} onPress={decrementStock}>
                            <Text style={styles.stockButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.stockValue}>{formData?.stock}</Text>
                        <TouchableOpacity style={styles.stockButton} onPress={incrementStock}>
                            <Text style={styles.stockButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Categoría</Text>
                    <TextInput
                        style={styles.input}
                        value={formData?.category}
                        onChangeText={(text) => setFormData({ ...formData, category: text })}
                        placeholder="Categoría"
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={() => onSave({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock, 10) })}>
                            <Text style={styles.saveButtonText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProduct;

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: theme.background.overlay },
    modalContent: {
      backgroundColor: theme.background.primary,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 10,
      elevation: 5,
    },
    modalTitle: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: theme.primary.main,
      marginBottom: 10 
    },
    label: { 
      fontSize: 16, 
      fontWeight: 'bold', 
      marginBottom: 5, 
      color: theme.primary.dark 
    },
    input: { 
      borderBottomWidth: 2, 
      borderBottomColor: theme.primary.main, 
      marginBottom: 15, 
      padding: 5, 
      fontSize: 16, 
      color: theme.neutral.black,
      backgroundColor: theme.background.secondary, // Fondo de input para destacarlo
    },
    textArea: { 
      height: 100, 
      textAlignVertical: 'top', 
      fontSize: 16, 
      color: theme.neutral.black 
    },
    stockContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginVertical: 10 
    },
    stockButton: {
      backgroundColor: theme.primary.main,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    stockButtonText: { 
      color: theme.neutral.white, 
      fontSize: 20, 
      fontWeight: 'bold' 
    },
    stockValue: { 
      fontSize: 18, 
      color: theme.primary.main 
    },
    buttonContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      marginTop: 20 
    },
    saveButton: { 
      backgroundColor: theme.primary.main, // Mantén el morado
      padding: 12, 
      borderRadius: 5 
    },
    saveButtonText: { 
      color: theme.neutral.white, 
      fontWeight: 'bold' 
    },
    cancelButton: { 
      backgroundColor: theme.neutral.lightGray, 
      padding: 12, 
      borderRadius: 5 
    },
    cancelButtonText: { 
      color: theme.neutral.white, // Usamos el morado oscuro para mejorar el contraste
      fontWeight: 'bold' 
    },
  });
