import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../supabaseConfig';

export default function TelaAtivs({ navigation }) {
  const [atividades, setAtividades] = useState([]);
  const [modalNovaVisible, setModalNovaVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [modalAlertaVisible, setModalAlertaVisible] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  useEffect(() => {
    carregarAtividades();
  }, []);

  async function carregarAtividades() {
    const { data, error } = await supabase
      .from("atividades")
      .select("*")
      .eq("turma_id", 1);
    if (!error && data) setAtividades(data);
  }

  function mostrarAlerta(mensagem) {
    setMensagemAlerta(mensagem);
    setModalAlertaVisible(true);
  }

async function salvarAtividade() {
  if (!titulo.trim() || !descricao.trim()) {
    return mostrarAlerta("Preencha todos os campos!");
  }

  const { data: existente, error: erroBusca } = await supabase
    .from("atividades")
    .select("*")
    .eq("titulo_atividade", titulo)
    .eq("turma_id", 4)
    .maybeSingle();

  if (erroBusca) {
    return mostrarAlerta("Erro ao verificar duplicatas!");
  }

  if (existente) {
    return mostrarAlerta("Já existe uma atividade com esse título!");
  }

 const { error } = await supabase
  .from("atividades")
  .insert([{ titulo_atividade: titulo, descricao, turma_id: 4 }]);


  if (error) {
    console.error(error);
    mostrarAlerta("Erro ao salvar atividade!");
  } else {
    setModalNovaVisible(false);
    setTitulo("");
    setDescricao("");
    carregarAtividades();
    mostrarAlerta("Atividade salva com sucesso!");
  }

  carregarAtividades();

}


  async function atualizarAtividade() {
    if (!titulo.trim() || !descricao.trim()) {
      return mostrarAlerta("Preencha todos os campos!");
    }
    const { error } = await supabase
      .from("atividades")
      .update({ titulo_atividade: titulo, descricao })
      .eq("id", atividadeSelecionada.id);
    if (!error) {
      setModalEditarVisible(false);
      setTitulo("");
      setDescricao("");
      setAtividadeSelecionada(null);
      carregarAtividades();
      mostrarAlerta("Atividade atualizada com sucesso!");
    }
  }

  async function excluirAtividade() {
    const { error } = await supabase.from("atividades").delete().eq("id", atividadeSelecionada.id);
    if (!error) {
      setModalExcluirVisible(false);
      setAtividadeSelecionada(null);
      carregarAtividades();
      mostrarAlerta("Atividade excluída com sucesso!");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.profHeader}>Isadora Gomes</Text>
        <TouchableOpacity style={styles.logout}>
          <Text style={{ fontSize: 16, color: '#A31D1D', marginRight: 8, fontWeight: '700' }}>Sair</Text>
          <Ionicons name="log-out" size={25} color="#A31D1D" />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <ScrollView style={styles.listaAtivs}>
          {atividades.length > 0 ? (
            atividades.map((ativ, index) => (
              <View key={ativ.id || index} style={styles.ativItem}>
                <Text style={styles.numero}>{index + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>{ativ.titulo_atividade}</Text>
                  <Text numberOfLines={2} style={{ color: "#5a5a5a" }}>
                    {ativ.descricao}
                  </Text>
                </View>
                <View style={styles.botoes}>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#8ABF5A" }]}
                    onPress={() => {
                      setAtividadeSelecionada(ativ);
                      setTitulo(ativ.titulo_atividade);
                      setDescricao(ativ.descricao);
                      setModalEditarVisible(true);
                    }}
                  >
                    <Text style={styles.txtBtn}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#D84040" }]}
                    onPress={() => {
                      setAtividadeSelecionada(ativ);
                      setModalExcluirVisible(true);
                    }}
                  >
                    <Text style={styles.txtBtn}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#A31D1D' }}>Nenhuma atividade encontrada.</Text>
          )}
        </ScrollView>

        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity style={styles.novaAtiv} onPress={() => setModalNovaVisible(true)}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Nova Atividade</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={modalNovaVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Nova Atividade</Text>
            <TextInput
              placeholder="Título da atividade"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              multiline
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={salvarAtividade}>
              <Text style={styles.txtSalvar}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalNovaVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    
      <Modal transparent visible={modalEditarVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Editar Atividade</Text>
            <TextInput
              placeholder="Título da atividade"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              multiline
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={atualizarAtividade}>
              <Text style={styles.txtSalvar}>Salvar Alterações</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalEditarVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalExcluirVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Excluir Atividade</Text>
            <Text style={styles.subtituloModal}>
              Tem certeza que deseja excluir a atividade "{atividadeSelecionada?.titulo_atividade}"?
            </Text>
            <TouchableOpacity
              style={[styles.btnSalvar, { backgroundColor: "#D84040" }]}
              onPress={excluirAtividade}
            >
              <Text style={styles.txtSalvar}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalExcluirVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalAlertaVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>Aviso</Text>
            <Text style={styles.subtituloModal}>{mensagemAlerta}</Text>
            <TouchableOpacity
              style={[styles.btnSalvar, { backgroundColor: "#A31D1D" }]}
              onPress={() => setModalAlertaVisible(false)}
            >
              <Text style={styles.txtSalvar}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  main: { flex: 1, backgroundColor: '#F8F2DE' },
  novaAtiv: {
    height: 40,
    width: '95%',
    backgroundColor: '#D84040',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  listaAtivs: { flex: 1, margin: 10 },
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
  numero: { fontSize: 40, fontWeight: '700', color: '#D84040', marginHorizontal: 5 },
  titulo: { fontSize: 18, fontWeight: '600', color: '#A31D1D' },
  botoes: { flexDirection: "row", gap: 8, marginLeft: 10 },
  btn: { padding: 6, borderRadius: 6 },
  txtBtn: { color: "#fff", fontWeight: "bold" },
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
  tituloModal: { fontSize: 18, fontWeight: "bold", color: "#A31D1D" },
  subtituloModal: { textAlign: "center", color: "#A31D1D", marginVertical: 8 },
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
  txtSalvar: { color: "#F8F2DE", fontWeight: "bold" },
  cancelar: { color: "#D84040", marginTop: 10 },
});
