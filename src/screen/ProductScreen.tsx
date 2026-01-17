import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import ProductHeader from '../components/ProductHeader';
import ProductCard from '../components/ProductCard';
import ScreenView from '../utils/ScreenView';

const PRODUCTS = [
    {
        id: '1',
        title: 'Basic Facial + Cleanup',
        time: '45 mins',
        price: '₹799',
        oldPrice: '₹1,599',
        image: require('../asset/images/facial.png'),
    },
    {
        id: '2',
        title: 'Basic Facial + Cleanup',
        time: '45 mins',
        price: '₹799',
        oldPrice: '₹1,599',
        image: require('../asset/images/facial.png'),
    },
    {
        id: '3',
        title: 'Basic Facial + Cleanup',
        time: '45 mins',
        price: '₹799',
        oldPrice: '₹1,599',
        image: require('../asset/images/facial.png'),
    },
    {
        id: '4',
        title: 'Basic Facial + Cleanup',
        time: '45 mins',
        price: '₹799',
        oldPrice: '₹1,599',
        image: require('../asset/images/facial.png'),
    },
];
const CATEGORIES = [
  'Waxing',
  'Facial',
  'Pedicure',
  'Hydra Facial'
];

const ProductScreen = () => {
    return (
        <ScreenView>
        <View style={styles.root}>
            <ProductHeader />

            <View style={styles.content}>
                {/* Category Chips */}
                <View style={styles.categoryWrapper}>
                    {CATEGORIES.map((item, index) => (
                        <View key={index} style={styles.categoryChip}>
                            <Text style={styles.categoryText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.title}>Top results for “Facial”</Text>


                <FlatList
                    data={PRODUCTS}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ProductCard item={item} />}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
        </ScreenView>
    );
};

export default ProductScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#EDE4FF',
        paddingTop: 50,
    },

    content: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 18,
        marginTop: 14,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 14,
    },
    categoryWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },

    categoryChip: {
        borderWidth: 1,
        borderColor: '#D8D0FF',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
    },

    categoryText: {
        fontSize: 14,
        color: '#333',
    },

});
