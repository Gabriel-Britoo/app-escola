import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TelaAtivs() {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.profHeader}>Isadora Gomes</Text>
            <TouchableOpacity style={styles.logout}>
                <Text style={{fontSize: 16, color: '#A31D1D', marginRight: 8, fontWeight: '700'}}>Sair</Text>
                <Ionicons name="log-out" size={25} color="#A31D1D" />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        backgroundColor: '#A31D1D',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    profHeader: {
        color: '#ffffff',
        fontSize: 20,
        marginLeft: 10,
        fontWeight: '600',
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#ffffff',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderWidth: 1,
        borderColor: '#d22020ff',
        borderRadius: 5,
    }
})