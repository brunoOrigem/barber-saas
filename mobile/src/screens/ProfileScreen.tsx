import React, { ComponentProps, ReactNode, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { USER } from '../data/mock';
import { useBookings } from '../contexts/BookingsContext';
import { openShopWhatsApp } from '../utils/contact';

type IconName = ComponentProps<typeof Ionicons>['name'];

const AVATAR_SIZE = THEME.SPACING.XL * 2 + THEME.SPACING.MD;

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { history } = useBookings();
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  const completedCount = history.filter((b) => b.status === 'completed').length;
  const initials = USER.fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  const switchColors = {
    trackColor: { false: THEME.COLORS.CARD_SELECTED, true: THEME.COLORS.PRIMARY },
    thumbColor: THEME.COLORS.TEXT_PRIMARY,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.SPACING.MD }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{USER.fullName}</Text>
        <Text style={styles.stat}>
          {completedCount} {completedCount === 1 ? 'corte realizado' : 'cortes realizados'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Dados da conta</Text>
      <View style={styles.group}>
        <Row icon="person-outline" label="Nome" value={USER.fullName} />
        <Row icon="mail-outline" label="E-mail" value={USER.email} />
        <Row icon="call-outline" label="Telefone" value={USER.phone} last />
      </View>

      <Text style={styles.sectionTitle}>Configurações</Text>
      <View style={styles.group}>
        <Row
          icon="notifications-outline"
          label="Notificações"
          right={<Switch value={notifications} onValueChange={setNotifications} {...switchColors} />}
        />
        <Row
          icon="alarm-outline"
          label="Lembrete 1h antes do corte"
          right={<Switch value={reminders} onValueChange={setReminders} {...switchColors} />}
          last
        />
      </View>

      <Text style={styles.sectionTitle}>Ajuda</Text>
      <View style={styles.group}>
        <Row icon="logo-whatsapp" label="Falar com o suporte" onPress={() => openShopWhatsApp()} />
        <Row
          icon="log-out-outline"
          label="Sair da conta"
          danger
          last
          onPress={() =>
            Alert.alert('Sair da conta', 'Deseja mesmo sair?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive' },
            ])
          }
        />
      </View>

      <Text style={styles.version}>CorteApp · versão 1.0.0</Text>
    </ScrollView>
  );
}

type RowProps = {
  icon: IconName;
  label: string;
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
};

function Row({ icon, label, value, right, onPress, danger, last }: RowProps) {
  const content = (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Ionicons
        name={icon}
        size={THEME.FONT_SIZE.LG}
        color={danger ? THEME.COLORS.DANGER : THEME.COLORS.PRIMARY}
      />
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {right ??
        (onPress && (
          <Ionicons name="chevron-forward" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.TEXT_MUTED} />
        ))}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
      {content}
    </TouchableOpacity>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  content: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingBottom: THEME.SPACING.LG,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.MD,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.LG,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    borderWidth: 2,
    borderColor: THEME.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.MD,
  },
  stat: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  sectionTitle: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  group: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    paddingHorizontal: THEME.SPACING.MD,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.COLORS.BORDER,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  rowLabelDanger: {
    color: THEME.COLORS.DANGER,
  },
  rowValue: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  version: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    textAlign: 'center',
    marginTop: THEME.SPACING.LG,
  },
});
