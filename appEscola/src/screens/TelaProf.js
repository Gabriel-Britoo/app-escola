import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from "../../supabaseConfig";

export default function TelaProf({ navigation }) {
  const [turmas, setTurmas] = useState([]);
  const [modalNovaTurma, setModalNovaTurma] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [professor, setProfessor] = useState(null);
  const [novaTurma, setNovaTurma] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [novoNomeTurma, setNovoNomeTurma] = useState("");

  async function carregarProfessor() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_email", user.email)
      .single();

    if (error) {
      console.error("Erro ao carregar professor:", error);
    } else {
      setProfessor(data);
    }
  }

  useEffect(() => {
    carregarProfessor();
  }, []);

  async function carregarTurmas(idProfessor) {
    const { data, error } = await supabase
      .from("turmas")
      .select("*")
      .eq("professor_id", idProfessor);

    if (error) {
      console.error("Erro ao carregar turmas:", error);
    } else {
      setTurmas(data);
    }
  }

  useEffect(() => {
    if (professor?.id) {
      carregarTurmas(professor.id);
    }
  }, [professor]);

  const cadastrarTurma = async () => {
    if (novaTurma.trim() === "") {
      alert("Informe um nome para a turma!");
      return;
    }

    if (!professor) {
      alert("Professor não carregado ainda!");
      return;
    }

    const { data, error } = await supabase
      .from("turmas")
      .insert([{ nome_turma: novaTurma, professor_id: professor.id }])
      .select();

    if (error) {
      alert("Erro ao cadastrar turma!");
      console.error(error);
    } else {
      setTurmas([...turmas, data[0]]);
      setNovaTurma("");
      setModalNovaTurma(false);
    }
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
      console.error(error);
    } else {
      await carregarTurmas(professor.id);
      setModalEditar(false);
      setTurmaSelecionada(null);
      setNovoNomeTurma("");
    }
  };

  const excluirTurma = async () => {
    const { error } = await supabase
      .from("turmas")
      .delete()
      .eq("id", turmaSelecionada.id);

    if (error) {
      alert("Erro ao excluir turma!");
      console.error(error);
    } else {
      setTurmas(turmas.filter((t) => t.id !== turmaSelecionada.id));
      setModalExcluir(false);
      setTurmaSelecionada(null);
    }
  };

  const abrirEditar = (turma) => {
    setTurmaSelecionada(turma);
    setNovoNomeTurma(turma.nome_turma);
    setModalEditar(true);
  };

  const abrirExcluir = (turma) => {
    setTurmaSelecionada(turma);
    setModalExcluir(true);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout');
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.profHeader}>{professor?.user_name || 'Carregando...'}</Text>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={{ fontSize: 16, color: '#A31D1D', marginRight: 8, fontWeight: '700' }}>Sair</Text>
          <Ionicons name="log-out" size={25} color="#A31D1D" />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <ScrollView style={styles.listaAtivs}>
          {turmas.length > 0 ? (
            turmas.map((item, index) => (
              <View key={item.id} style={styles.ativItem}>
                <Text style={styles.numero}>{index + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>{item.nome_turma}</Text>
                </View>
                <View style={styles.botoes}>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#8ABF5A" }]}
                    onPress={() => abrirEditar(item)}
                  >
                    <Text style={styles.txtBtn}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#D84040" }]}
                    onPress={() => abrirExcluir(item)}
                  >
                    <Text style={styles.txtBtn}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#A31D1D' }}>Nenhuma turma encontrada.</Text>
          )}
        </ScrollView>

        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity style={styles.novaAtiv} onPress={() => setModalNovaTurma(true)}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Nova Turma</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#d22020ff',
    borderRadius: 5,
  },
  main: {
    flex: 1,
    backgroundColor: '#F8F2DE'
  },
  novaAtiv: {
    height: 40,
    width: '95%',
    backgroundColor: '#A31D1D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  listaAtivs: {
    flex: 1,
    margin: 10
  },
  ativItem: {
    flexDirection: 'row',
    backgroundColor: '#fbf8eeff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D84040',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  numero: {
    fontSize: 40,
    fontWeight: '700',
    color: '#D84040',
    marginHorizontal: 5
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A31D1D'
  },
  botoes: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 10
  },
  btn: {
    padding: 6,
    borderRadius: 6
  },
  txtBtn: {
    color: "#fff",
    fontWeight: "bold"
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
