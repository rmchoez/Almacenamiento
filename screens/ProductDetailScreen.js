import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const StarRating = ({ rating, reviewStars = false }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    const starSize = reviewStars ? 15 : 30; // Ajusto el tamaño de las estrellas para reseñas y principales
    const starStyle = reviewStars
      ? { maxWidth: '30%', justifyContent: 'flex-end', flexDirection: 'row' }
      : { justifyContent: 'center', flexDirection: 'row' };
  
    return (
      <View style={[styles.starContainer, starStyle]}>
        {[...Array(fullStars)].map((_, index) => (
          <Icon key={index} name={'star'} size={starSize} color="#FFD700"/>
        ))}
        {halfStar && <Icon name={'star-half'} size={starSize} color="#FFD700"/>}
        {[...Array(emptyStars)].map((_, index) => (
          <Icon key={index} name={'star-border'} size={starSize} color="#FFD700" />
        ))}
      </View>
    );
};


const ProductDetailScreen = ({ route }) => {
    const { product } = route.params;
  
    const renderImageItem = ({ item }) => (
        <View style={styles.imageItemContainer}>
            <Image source={{ uri: item }} style={styles.userImage} />
            {product.discountPercentage > 0 && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{product.discountPercentage}% OFF</Text>
                </View>
            )}
        </View>
    );

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.carouselContainer}>
            <FlatList
                data={product.images}
                horizontal
                pagingEnabled
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={0}
                snapToAlignment="center"
                decelerationRate="fast" 
            />
        </View>
        <StarRating rating={product.rating} />    
        <Text style={styles.productTitle}>{product.title}</Text>

        <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>${product.price}</Text>
        </View>

        <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Categoría: {product.category}</Text>
        </View>

        <View style={styles.brandContainer}>
            <Text style={styles.brandLabel}>Marca: {product.brand}</Text>
        </View>

        <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Stock: {product.stock}</Text>
        </View>
        
        {product.tags && product.tags.length > 0 && (
            <Accordion title="Etiquetas">
                <View style={styles.tagsContainer}>
                    {product.tags.map((item, index) => (
                        <Text key={index} style={styles.tagItem}>{item}</Text>
                    ))}
                </View>
            </Accordion>
        )}
  
        <Accordion title="Descripción">
            <Text style={styles.descriptionText}>{product.description}</Text>
        </Accordion>
  
        <Accordion title="Reseñas">
            {product.reviews && product.reviews.length > 0 ?
                (
                    product.reviews.map((item, index) => (
                        <View key={index} style={styles.reviewContainer}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                                <StarRating rating={item.rating} reviewStars={true} />
                            </View>
                            <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString('es-EC')}</Text>
                            <Text style={styles.reviewComment}>{item.comment}</Text>
                            {index < product.reviews.length - 1 && <View style={styles.separator} />}
                        </View>
                    ))
                ) : (<Text style={styles.userDetail}>No hay reseñas disponibles.</Text>)
            }
        </Accordion>
      </ScrollView>
    );
};
  
const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
    userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#6200ea' },
    userDetail: { fontSize: 16, color: '#333', marginVertical: 2 },
    starContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    ratingText: { marginLeft: 5, fontSize: 16, color: '#6200ea' },
    accordionContainer: { backgroundColor: '#ffffff', borderRadius: 8, marginVertical: 10, padding: 10, elevation: 2 },
    accordionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6200ea' },
    accordionContent: { paddingTop: 5, paddingLeft: 10 },
    imageContainer: { alignItems: 'center', marginBottom: 20 },
    userImage: { width: '100%', height: '100%', borderRadius: 8, resizeMode: 'contain' },
    descriptionText: { fontSize: 16, color: 'black', lineHeight: 22 },
    reviewContainer: { paddingVertical: 10 },
    reviewerName: { fontWeight: 'bold', fontSize: 16, color: '#009688' },
    reviewDate: { fontSize: 14, color: '#999', marginBottom: 5 },
    reviewComment: { fontSize: 16, color: 'black', lineHeight: 22 },
    separator: { height: 1, backgroundColor: '#ddd', marginVertical: 10 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    tagItem: {
      backgroundColor: '#6200ea',
      color: 'white',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 20,
      margin: 5,
      fontSize: 14,
      textTransform: 'capitalize'
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6200ea', // Color llamativo para el nombre del producto
      },
      priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      originalPrice: {
        fontSize: 18,
        textDecorationLine: 'line-through', // Tachamos el precio original
        color: '#757575', // Gris para el precio original
        marginRight: 10,
      },
      discountedPrice: {
        fontSize: 20,
        color: '#388e3c', // Verde para el precio con descuento
        fontWeight: 'bold',
        marginRight: 10,
      },
      discountLabel: {
        fontSize: 16,
        color: '#d32f2f', // Rojo para el descuento
        marginRight: 10,
      },
      categoryContainer: {
        backgroundColor: '#f3f3f3', // Fondo gris suave para la categoría
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row', // Alineamos la categoría con un icono si es necesario
        alignItems: 'center',
      },
      categoryLabel: {
        fontSize: 16,
        color: '#6200ea',
        fontWeight: 'bold',
      },
      brandContainer: {
        backgroundColor: '#e3f2fd', // Fondo suave para la marca (ligeramente azul)
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
      },
      brandLabel: {
        fontSize: 16,
        color: '#1976d2', // Azul para la marca
        fontWeight: 'bold',
      },
      stockContainer: {
        backgroundColor: '#e8f5e9', // Fondo verde suave para el stock
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
      },
      stockLabel: {
        fontSize: 16,
        color: '#388e3c', // Verde para indicar que el stock es positivo
        fontWeight: 'bold',
      },
      discountBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
      discountText: {
          color: 'white',
          fontWeight: 'bold',
      },
      carouselContainer: { marginBottom: 20 },
      imageItemContainer: { justifyContent: 'center', alignItems: 'center', width: 300, height: 300 },
});

export default ProductDetailScreen;