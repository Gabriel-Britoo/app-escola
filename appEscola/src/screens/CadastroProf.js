import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { supabase } from '../../supabaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';

const CadastroProf = ({ navigation }) => {
  const [user_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_name, setName] = useState('');

 const registerUser = async (user_email, password, user_name) => {
  try {
    await supabase.auth.signOut();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: user_email,
      password,
    });

    if (signUpError) throw signUpError;
    const userId = signUpData.user?.id || signUpData.session?.user?.id;

    if (!userId) {
      console.log("Usuário precisa confirmar o e-mail antes do cadastro no banco.");
      Alert.alert("Verifique seu e-mail", "Confirme seu cadastro antes de prosseguir.");
      return;
    }

    const { error: dbError } = await supabase
      .from('users')
      .insert({
        user_name,
        user_email,
      });

    if (dbError) throw dbError;

    console.log("Usuário registrado com sucesso!");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);
    throw error;
  }
};



  const handleRegister = async () => {
    if (user_email && password && user_name) {
      try {
        await registerUser(user_email, password, user_name);
        Alert.alert("Sucesso", "Usuário registrado com sucesso!");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Erro", error.message || "Falha no cadastro.");
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }


  };
  const redirecionarLogin = () => {
    navigation.navigate("Login")
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
                  <Text style={styles.profHeader}>Isadora Gomes</Text>
                  <TouchableOpacity style={styles.logout}>
                      <Text style={{fontSize: 16, color: '#A31D1D', marginRight: 8, fontWeight: '700'}}>Sair</Text>
                      <Ionicons name="log-out" size={25} color="#A31D1D" />
                  </TouchableOpacity>
              </View>
      <View style={styles.formulario}>
        <Image source={require("../assets/img/logo-saber-png.png")} style={styles.imagem} />

        <TextInput
          style={styles.input}
          placeholder="Nome do professor"
          value={user_name}
          onChangeText={setName}
          placeholderTextColor={'#8f1010ff'}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={user_email}
          onChangeText={setEmail}
          placeholderTextColor={'#8f1010ff'}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={'#8f1010ff'}
        />
        <Text style={styles.Text}>Sua senha deve conter uma letra maiúscula, uma minúscula e um caractere especial</Text>

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F2DE',
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
        backgroundColor: '#F8F2DE',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderWidth: 1,
        borderColor: '#d22020ff',
        borderRadius: 5,
    },
  formulario: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 340,
    height: 200,
    resizeMode: 'contain',
    marginTop: 100
  },
  input: {
    height: 42,
    borderColor: '#A31D1D',
    borderWidth: 2,
    marginBottom: 20,
    width: 300,
    paddingLeft: 10,
    borderRadius: 10,
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 110,
    borderRadius: 7,

    marginTop: 20,
    backgroundColor: '#A31d1d',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'Gotham',
  },

  Text:{
    color: "#310909ff",
    margin: 12,
    textAlign: "center",
    fontFamily: "Gotham",
  }
});

export default CadastroProf;