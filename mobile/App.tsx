import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

// Dados simulados dos serviços da barbearia
const SERVICOS = [
  { id: '1', nome: 'Corte de Cabelo', preco: 'R$ 45,00', duracao: '45 min', icone: '✂️' },
  { id: '2', nome: 'Barba Completa', preco: 'R$ 35,00', duracao: '30 min', icone: '🪒' },
  { id: '3', nome: 'Combo Cabelo + Barba', preco: 'R$ 70,00', duracao: '1h 15m', icone: '💈' },
  { id: '4', nome: 'Sobrancelha', preco: 'R$ 15,00', duracao: '15 min', icone: '✨' },
];

export default function App() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.boasVindas}>Bem-vindo à</Text>
        <Text style={styles.nomeBarbearia}>Barbearia VIP 💈</Text>
        <Text style={styles.subtitulo}>Escolha o serviço desejado para agendar:</Text>
      </View>

      {/* Lista de Serviços */}
      <ScrollView contentContainerStyle={styles.listaServicos}>
        {SERVICOS.map((servico) => {
          const isSelected = servicoSelecionado === servico.id;
          return (
            <TouchableOpacity 
              key={servico.id} 
              style={[styles.cardServico, isSelected && styles.cardSelecionado]}
              activeOpacity={0.7}
              onPress={() => setServicoSelecionado(servico.id)}
            >
              <Text style={styles.iconeServico}>{servico.icone}</Text>
              <View style={styles.infoServico}>
                <Text style={styles.nomeServico}>{servico.nome}</Text>
                <Text style={styles.duracaoServico}>⏱️ {servico.duracao}</Text>
              </View>
              <Text style={styles.precoServico}>{servico.preco}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Rodapé com Botão de Ação */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.botaoAgendar, !servicoSelecionado && styles.botaoDesativado]}
          disabled={!servicoSelecionado}
          onPress={() => alert('Próximo passo: Escolher Barbeiro e Horário!')}
        >
          <Text style={styles.textoBotao}>
            {servicoSelecionado ? 'Continuar Agendamento' : 'Selecione um serviço'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },
  boasVindas: {
    color: '#A8A8B3',
    fontSize: 16,
  },
  nomeBarbearia: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  subtitulo: {
    color: '#7C7C8A',
    fontSize: 14,
    marginTop: 4,
  },
  listaServicos: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardServico: {
    backgroundColor: '#202024',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#202024',
  },
  cardSelecionado: {
    borderColor: '#00B37E',
    backgroundColor: '#29292E',
  },
  iconeServico: {
    fontSize: 28,
    marginRight: 16,
  },
  infoServico: {
    flex: 1,
  },
  nomeServico: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  duracaoServico: {
    color: '#7C7C8A',
    fontSize: 14,
    marginTop: 4,
  },
  precoServico: {
    color: '#00B37E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#202024',
    borderTopWidth: 1,
    borderTopColor: '#29292E',
  },
  botaoAgendar: {
    backgroundColor: '#00B37E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoDesativado: {
    backgroundColor: '#29292E',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});