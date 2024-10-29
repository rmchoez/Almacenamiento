import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Metodos() {

    const [userName, setUsername] = useState('');

    const save = async () => {
        try {
            await AsyncStorage.setItem('my-user-name', username);
            Keyboard.dismiss();
        } catch (e) {
            console.log('Error when saving..');
        }
    }

    const remove = async () => {
        try {
            await AsyncStorage.removeItem('my-user-name');
            setUsername('');
        } catch (e) {
            console.log('Error when removing..');
        }
    }

    const load = async () => {
        try {
            const username = await AsyncStorage.getItem('my-user-name');
            if (username !== null) {
                setUsername(username);
            }
        } catch (e) {
            console.log('Error when loading..');
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <View style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 20, backgroundColor: '#fdfdfd' }}>

            <Ionicons name='person-circle' size={200} color='#22a6b3' style={{ alignSelf: 'center', marginTop: 80 }} />


            {/* <FontAwesome name='user-circle' size={200} color='#22a6b3' style={{ alignSelf: 'center', marginTop: 80 }} /> */}

            <Text style={{ alignSelf: 'center', margin: 8, color: '#2c3e50', fontSize: 16 }}>Digita tu nombre</Text>
            <Text style={{ alignSelf: 'center', margin: 8, color: '#2c3e50', fontSize: 16 }}>{userName}</Text>


            <View style={{ marginTop: 16, padding: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#22a6b3', color: 'gray' }}>
                <TextInput style={{color:'#2c3e50'}} placeholder='Username' value={userName} onChangeText={setUsername} />
            </View>

            <TouchableOpacity style={{ backgroundColor: '#22a6b3', marginTop: 32, padding: 16, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => save()}>
                <Text style={{ color: '#fdfdfd', fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#22a6b3', marginTop: 16, padding: 16, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => remove()}>
                <Text style={{ color: '#fdfdfd', fontWeight: '600' }}>Remove</Text>
            </TouchableOpacity>
        </View>
    );
}