import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { THEME } from '../theme';
import { RootStackParamList } from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Legal'>;

// Texto provisório: substituir pelos documentos jurídicos oficiais antes do lançamento.
const CONTENT = {
  terms: {
    title: 'Termos de Uso',
    sections: [
      {
        heading: '1. Uso do aplicativo',
        body: 'O CorteApp permite agendar serviços nas barbearias parceiras cadastradas na plataforma.',
      },
      {
        heading: '2. Agendamentos e cancelamentos',
        body: 'Os horários estão sujeitos à disponibilidade de cada barbearia. Cancelamentos devem ser feitos pelo app com antecedência.',
      },
      {
        heading: '3. Responsabilidades',
        body: 'Os serviços são prestados pelas barbearias parceiras, que definem preços e políticas próprias.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidade',
    sections: [
      {
        heading: '1. Dados coletados',
        body: 'Coletamos nome, telefone, e-mail e histórico de agendamentos para operar o serviço.',
      },
      {
        heading: '2. Compartilhamento',
        body: 'Os dados do agendamento são compartilhados apenas com a barbearia escolhida.',
      },
      {
        heading: '3. Seus direitos',
        body: 'Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, conforme a LGPD.',
      },
    ],
  },
};

export function LegalScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const content = CONTENT[route.params.type];

  useLayoutEffect(() => {
    navigation.setOptions({ title: content.title });
  }, [navigation, content.title]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}
    >
      <View style={styles.notice}>
        <Text style={styles.noticeText}>Documento provisório da versão MVP.</Text>
      </View>
      {content.sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  content: {
    padding: THEME.SPACING.MD,
  },
  notice: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    padding: THEME.SPACING.MD,
    borderLeftWidth: 3,
    borderLeftColor: THEME.COLORS.WARNING,
    marginBottom: THEME.SPACING.MD,
  },
  noticeText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
  },
  section: {
    marginBottom: THEME.SPACING.LG,
  },
  heading: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.SM,
  },
  body: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    lineHeight: THEME.FONT_SIZE.SM * 1.5,
  },
});
