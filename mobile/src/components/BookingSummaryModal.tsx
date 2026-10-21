import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../theme';
import { Barber, Service } from '../data/mock';
import { BookingDay, formatDuration, formatPrice } from '../utils/booking';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  visible: boolean;
  barber: Barber;
  services: Service[];
  day: BookingDay;
  time: string;
  totalPrice: number;
  totalDuration: number;
  onConfirm: () => void;
  onClose: () => void;
};

export function BookingSummaryModal({
  visible,
  barber,
  services,
  day,
  time,
  totalPrice,
  totalDuration,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Resumo do agendamento</Text>

          <SummaryRow label="Barbeiro" value={barber.name} />
          <SummaryRow label="Serviço(s)" value={services.map((s) => s.name).join('\n')} />
          <SummaryRow label="Data" value={`${day.label} · ${day.sublabel}`} />
          <SummaryRow label="Horário" value={time} />
          <SummaryRow label="Duração" value={formatDuration(totalDuration)} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Valor total</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>

          <PrimaryButton title="Confirmar agendamento" onPress={onConfirm} />
          <TouchableOpacity style={styles.cancel} onPress={onClose} accessibilityRole="button">
            <Text style={styles.cancelText}>Voltar e editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: THEME.COLORS.OVERLAY,
  },
  sheet: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderTopLeftRadius: THEME.BORDER_RADIUS.LG,
    borderTopRightRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.LG,
    paddingBottom: THEME.SPACING.XL,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.MD,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: THEME.SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: THEME.COLORS.BORDER,
  },
  rowLabel: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
  },
  rowValue: {
    flex: 1,
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
    textAlign: 'right',
    marginLeft: THEME.SPACING.MD,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: THEME.SPACING.LG,
  },
  totalLabel: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.MD,
  },
  totalValue: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: THEME.SPACING.MD,
  },
  cancelText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
  },
});
