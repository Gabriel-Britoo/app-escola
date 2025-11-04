import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert
} from 'react-native';
import { supabase } from '../../supabaseConfig';

const CadastroProf = ({ navigation }) => {
  const [user_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_name, setName] = useState('');

 const registerUser = async (user_email, password, user_name) => {
  try {
    // Garante que não há sessão ativa
    await supabase.auth.signOut();

    // Cria o usuário no Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: user_email,
      password,
    });

    if (signUpError) throw signUpError;

    // Se o e-mail precisar ser confirmado, o user pode ser null
    const userId = signUpData.user?.id || signUpData.session?.user?.id;

    if (!userId) {
      console.log("Usuário precisa confirmar o e-mail antes do cadastro no banco.");
      Alert.alert("Verifique seu e-mail", "Confirme seu cadastro antes de prosseguir.");
      return;
    }

    // Insere no banco apenas o nome e o e-mail (sem o id)
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
      <View style={styles.formulario}>
        <Image source={require("../assets/img/logo-saber-png.png")} style={styles.imagem} />

        <TextInput
          style={styles.input}
          placeholder="Nome"
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
      <View style={styles.textLogin}>
        <TouchableOpacity onPress={redirecionarLogin}>
          <Text style={styles.linkLogin}>
            Já tem uma conta? <Text style={styles.linkDestacado}>Entre na sua conta</Text>
          </Text>
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
  textLogin: {
    marginTop: 148,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 20,
  },
  linkLogin: {
    color: '#A31d1d',
    fontFamily: 'Gotham',
    fontSize: 16,
    marginRight: 10,
  },
  linkDestacado: {
    color: '#D84040',
    fontFamily: 'Gotham',
    textDecorationLine: 'underline',
  },
  Text:{
    color: "#310909ff",
    margin: 12,
    textAlign: "center",
    fontFamily: "Gotham",
  }
});

export default CadastroProf;