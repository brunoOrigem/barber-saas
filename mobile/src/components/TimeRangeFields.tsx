import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { isValidTime, timeToMinutes } from '../utils/booking';

type Props = {
  openTime: string;
  closeTime: string;
  /** Chamado só com horários válidos e com o fechamento depois da abertura. */
  onChange: (openTime: string, closeTime: string) => void;
  /** Complemento dos rótulos de acessibilidade (ex: "de Segunda-feira"). */
  accessibilitySuffix: string;
};

/** Aplica a máscara "HH:MM" enquanto o usuário digita. */
function maskTime(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}

function isValidRange(openTime: string, closeTime: string) {
  return (
    isValidTime(openTime) &&
    isValidTime(closeTime) &&
    timeToMinutes(openTime) < timeToMinutes(closeTime)
  );
}

/**
 * Par de campos abertura/fechamento. Mantém um rascunho local: quem usa só
 * recebe horários válidos, para a agenda nunca trabalhar com valores pela
 * metade enquanto se digita. Para reiniciar o rascunho, troque a `key`.
 */
export function TimeRangeFields({ openTime, closeTime, onChange, accessibilitySuffix }: Props) {
  const [openDraft, setOpenDraft] = useState(openTime);
  const [closeDraft, setCloseDraft] = useState(closeTime);

  const complete = isValidTime(openDraft) && isValidTime(closeDraft);
  const error =
    complete && !isValidRange(openDraft, closeDraft)
      ? 'O fechamento precisa ser depois da abertura.'
      : null;

  function edit(field: 'open' | 'close', raw: string) {
    const value = maskTime(raw);
    const nextOpen = field === 'open' ? value : openDraft;
    const nextClose = field === 'close' ? value : closeDraft;
    setOpenDraft(nextOpen);
    setCloseDraft(nextClose);
    if (isValidRange(nextOpen, nextClose)) onChange(nextOpen, nextClose);
  }

  // Campo incompleto (ex: "9:") volta ao último valor salvo ao perder o foco.
  function blur(field: 'open' | 'close') {
    if (field === 'open' && !isValidTime(openDraft)) setOpenDraft(openTime);
    if (field === 'close' && !isValidTime(closeDraft)) setCloseDraft(closeTime);
  }

  return (
    <>
      <View style={styles.times}>
        <TimeField
          label="Abertura"
          value={openDraft}
          invalid={!!error}
          onChangeText={(text) => edit('open', text)}
          onBlur={() => blur('open')}
          accessibilityLabel={`Horário de abertura ${accessibilitySuffix}`}
        />
        <Ionicons name="arrow-forward" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.TEXT_MUTED} />
        <TimeField
          label="Fechamento"
          value={closeDraft}
          invalid={!!error}
          onChangeText={(text) => edit('close', text)}
          onBlur={() => blur('close')}
          accessibilityLabel={`Horário de fechamento ${accessibilitySuffix}`}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
}

function TimeField({
  label,
  invalid,
  ...input
}: {
  label: string;
  value: string;
  invalid: boolean;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  accessibilityLabel: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...input}
        style={[styles.input, invalid && styles.inputInvalid]}
        keyboardType="number-pad"
        maxLength={5}
        placeholder="00:00"
        placeholderTextColor={THEME.COLORS.TEXT_MUTED}
        selectionColor={THEME.COLORS.PRIMARY}
        selectTextOnFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  times: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: THEME.COLORS.BORDER,
  },
  field: {
    flex: 1,
  },
  fieldLabel: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginBottom: THEME.SPACING.XS,
  },
  input: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    paddingVertical: THEME.SPACING.SM,
  },
  inputInvalid: {
    borderColor: THEME.COLORS.DANGER,
  },
  error: {
    color: THEME.COLORS.DANGER,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.SM,
  },
});
