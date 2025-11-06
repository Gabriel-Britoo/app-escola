import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet, } from "react-native";
import { supabase } from "../../supabaseConfig";

export default function TelaProf() {
  const [turmas, setTurmas] = useState([]);
  const [modalNovaTurma, setModalNovaTurma] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [novaTurma, setNovaTurma] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [novoNomeTurma, setNovoNomeTurma] = useState("");

  useEffect(() => {
    async function carregarTurmas() {
      const { data, error } = await supabase
        .from("turmas")
        .select("*")
        .eq("professor_id", 1);

      if (!error && data) setTurmas(data);
    }
    carregarTurmas();
  }, []);

  const cadastrarTurma = async () => {
    if (novaTurma.trim() === "") {
      alert("Informe um nome para a turma!");
      return;
    }

    const { data, error } = await supabase
      .from("turmas")
      .insert([{ nome_turma: novaTurma, professor_id: 1 }])
      .select();

    if (error) {
      alert("Erro ao cadastrar turma!");
    } else {
      setTurmas([...turmas, data[0]]);
      setNovaTurma("");
      setModalNovaTurma(false);
    }
  };

  const abrirEditar = (turma) => {
    setTurmaSelecionada(turma);
    setNovoNomeTurma(turma.nome_turma);
    setModalEditar(true);
  };

  const editarTurma = async () => {
    if (novoNomeTurma.trim() === "") {
      alert("Informe um nome válido!");
      return;
    }

    const { error } = await supabase
      .from("turmas")
      .update({ nome_turma: novoNomeTurma })
      .eq("id", turmaSelecionada.id);

    if (error) {
      alert("Erro ao editar turma!");
    } else {
      setTurmas(
        turmas.map((t) =>
          t.id === turmaSelecionada.id
            ? { ...t, nome_turma: novoNomeTurma }
            : t
        )
      );
      setModalEditar(false);
      setTurmaSelecionada(null);
    }
  };

  const abrirExcluir = (turma) => {
    setTurmaSelecionada(turma);
    setModalExcluir(true);
  };

  const excluirTurma = async () => {
    const { error } = await supabase
      .from("turmas")
      .delete()
      .eq("id", turmaSelecionada.id);

    if (error) {
      alert("Erro ao excluir turma!");
    } else {
      setTurmas(turmas.filter((t) => t.id !== turmaSelecionada.id));
      setModalExcluir(false);
      setTurmaSelecionada(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoCadastrar}
        onPress={() => setModalNovaTurma(true)}
      >
        <Text style={styles.textoCadastrar}>Cadastrar turma</Text>
      </TouchableOpacity>

      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardTurma}>
            <Text style={styles.nomeTurma}>
              {index + 1}. {item.nome_turma}
            </Text>
            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.btnExcluir}
                onPress={() => abrirExcluir(item)}
              >
                <Text style={styles.txtBotao}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => abrirEditar(item)}
              >
                <Text style={styles.txtBotao}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal transparent visible={modalNovaTurma} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Nova turma</Text>
            <TextInput
              placeholder="Nome da turma"
              style={styles.input}
              value={novaTurma}
              onChangeText={setNovaTurma}
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={cadastrarTurma}>
              <Text style={styles.txtSalvar}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalNovaTurma(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal transparent visible={modalEditar} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Editar turma</Text>
            <TextInput
              placeholder="Novo nome"
              style={styles.input}
              value={novoNomeTurma}
              onChangeText={setNovoNomeTurma}
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={editarTurma}>
              <Text style={styles.txtSalvar}>Salvar alterações</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalEditar(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalExcluir} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Excluir turma</Text>
            <Text style={styles.subtituloModal}>
              Tem certeza que deseja excluir{" "}
              <Text style={{ fontWeight: "bold" }}>
                {turmaSelecionada?.nome_turma}
              </Text>
              ?
            </Text>
            <TouchableOpacity
              style={[styles.btnSalvar, { backgroundColor: "#D84040" }]}
              onPress={excluirTurma}
            >
              <Text style={styles.txtSalvar}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalExcluir(false)}>
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
  btnEditar: {
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
    marginVertical: 10,
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
    marginTop: 10,
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
