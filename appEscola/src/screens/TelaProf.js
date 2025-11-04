import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput, StyleSheet } from "react-native";
import { supabase } from '../../supabaseConfig';

export default function TelaProf({ navigation }) {
  const [professor, setProfessor] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novaTurma, setNovaTurma] = useState("");


  useEffect(() => {
    async function carregarTurmas() {
      const { data, error } = await supabase
        .from("turmas")
        .select("*")
        .eq("professor", professor);

      if (!error && data) setTurmas(data);
    }
    carregarTurmas();
  }, []);


  const cadastrarTurma = async () => {
  if (novaTurma.trim() === "") {
    Alert.alert("Erro", "Informe um nome para a turma!");
    return;
  }

  const { error } = await supabase
    .from("turmas")
    .insert([{ nome_turma: novaTurma, professor_id: 1 }]);

  if (error) {
    console.log("Erro ao cadastrar turma:", error.message);
    Alert.alert("Erro", "Falha ao cadastrar turma");
  } else {
    setTurmas([...turmas, { nome_turma: novaTurma }]);
    setNovaTurma("");
    setModalVisible(false);
  }
};



  const excluirTurma = async (turma) => {

    const { data: atividades } = await supabase
      .from("atividades")
      .select("*")
      .eq("turma", turma.nome);

    if (atividades && atividades.length > 0) {
      Alert.alert("Erro", "Você não pode excluir uma turma que possui atividades cadastradas");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir a turma "${turma.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await supabase.from("turmas").delete().eq("id", turma.id);
            setTurmas(turmas.filter((t) => t.id !== turma.id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>


      <TouchableOpacity style={styles.botaoCadastrar} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoCadastrar}>Cadastrar turma</Text>
      </TouchableOpacity>

      <FlatList
        data={turmas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardTurma}>
            <Text style={styles.nomeTurma}>{index + 1} {item.nome}</Text>
            <View style={styles.botoes}>
              <TouchableOpacity style={styles.btnExcluir} onPress={() => excluirTurma(item)}>
                <Text style={styles.txtBotao}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnVisualizar}>
                <Text style={styles.txtBotao}>Visualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Nova turma</Text>
            <Text style={styles.subtituloModal}>Informe o nome da turma e confirme para cadastrar.</Text>
            <TextInput
              placeholder="Nome da turma"
              style={styles.input}
              value={novaTurma}
              onChangeText={setNovaTurma}
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={cadastrarTurma}>
              <Text style={styles.txtSalvar}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F2DE",
    padding: 20,
  },
  botaoCadastrar: {
    backgroundColor: "#A31D1D",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  textoCadastrar: {
    color: "#F8F2DE",
    fontWeight: "bold",
  },
  cardTurma: {
    backgroundColor: "#ECDCBF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nomeTurma: {
    color: "#A31D1D",
    fontWeight: "600",
  },
  botoes: {
    flexDirection: "row",
    gap: 10,
  },
  btnExcluir: {
    backgroundColor: "#D84040",
    padding: 6,
    borderRadius: 6,
  },
  btnVisualizar: {
    backgroundColor: "#8ABF5A",
    padding: 6,
    borderRadius: 6,
  },
  txtBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#F8F2DE",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#A31D1D",
  },
  subtituloModal: {
    textAlign: "center",
    color: "#A31D1D",
    marginVertical: 8,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ECDCBF",
    marginVertical: 10,
  },
  btnSalvar: {
    backgroundColor: "#A31D1D",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  txtSalvar: {
    color: "#F8F2DE",
    fontWeight: "bold",
  },
  cancelar: {
    color: "#D84040",
    marginTop: 10,
  },
});
