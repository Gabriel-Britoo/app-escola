import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";

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
        <View style={styles.main}>
            <ScrollView style={styles.listaAtivs}>
                <View style={styles.ativItem}>
                    <Text style={{fontSize: 40, fontWeight: 700, color: '#D84040', marginHorizontal: 5}}>1</Text>
                    <View style={{marginLeft: 10, justifyContent: 'center'}}>
                        <Text style={{fontSize: 18, fontWeight: 600}}>Titulo</Text>
                        <Text style={{overflow: 'hidden'}}>Descrição da atividade</Text>
                    </View>
                </View>

                <View style={styles.ativItem}>
                    <Text style={{fontSize: 40, fontWeight: 700, color: '#D84040', marginHorizontal: 5}}>2</Text>
                    <View style={{marginLeft: 10, justifyContent: 'center'}}>
                        <Text style={{fontSize: 18, fontWeight: 600}}>Titulo</Text>
                        <Text>Descrição da atividade só que bem grande e enorme que nem o Lin</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                <TouchableOpacity style={styles.novaAtiv}>
                    <Text style={{color: '#fff', fontWeight: '700'}}>Nova Atividade</Text>
                </TouchableOpacity>
            </View>
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
    },
    main: {
        flex: 1,
        backgroundColor: '#e9e9e9ff',
    },
    novaAtiv: {
        height: 40,
        width: '95%',
        backgroundColor: '#D84040',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    listaAtivs: {
        flex: 1,
        margin: 10,
    },
    ativItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#D84040',
        borderRadius: 8,
        marginBottom: 10,
    }
})