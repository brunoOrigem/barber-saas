import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { SERVICE_ICON_OPTIONS, Service, ServiceIconName } from '../data/mock';
import { NewService } from '../contexts/ServicesContext';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  visible: boolean;
  /** Serviço em edição; quando ausente, o formulário cria um novo serviço. */
  service?: Service | null;
  onSubmit: (data: NewService) => void;
  onClose: () => void;
};

const NAME_MAX_LENGTH = 40;
const MAX_DURATION_MIN = 240;

function parsePrice(text: string) {
  const value = Number(text.replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : null;
}

function parseDuration(text: string) {
  const value = Number(text);
  return Number.isInteger(value) && value > 0 && value <= MAX_DURATION_MIN ? value : null;
}

export function ServiceFormModal({ visible, service, onSubmit, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const isEditing = !!service;

  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [icon, setIcon] = useState<ServiceIconName>(SERVICE_ICON_OPTIONS[0]);

  // Preenche o formulário sempre que o modal abre (edição ou criação).
  useEffect(() => {
    if (!visible) return;
    setName(service?.name ?? '');
    setPriceText(service ? String(service.price).replace('.', ',') : '');
    setDurationText(service ? String(service.durationMin) : '');
    setIcon(service?.icon ?? SERVICE_ICON_OPTIONS[0]);
  }, [visible, service]);

  const price = parsePrice(priceText);
  const duration = parseDuration(durationText);
  const canSubmit = !!name.trim() && price !== null && duration !== null;

  function submit() {
    if (!canSubmit || price === null || duration === null) return;
    onSubmit({ name: name.trim(), price, durationMin: duration, icon });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar">
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={styles.title}>{isEditing ? 'Editar serviço' : 'Novo serviço'}</Text>
                <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
                  <Ionicons name="close" size={THEME.FONT_SIZE.XL} color={THEME.COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>
                {isEditing
                  ? 'O novo valor vale para os próximos agendamentos.'
                  : 'O serviço fica disponível para os clientes na hora.'}
              </Text>

              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Limpeza de Pele"
                placeholderTextColor={THEME.COLORS.TEXT_MUTED}
                maxLength={NAME_MAX_LENGTH}
                selectionColor={THEME.COLORS.PRIMARY}
              />

              <View style={styles.row}>
                <View style={styles.rowField}>
                  <Text style={styles.label}>Preço (R$)</Text>
                  <TextInput
                    style={[styles.input, priceText && price === null && styles.inputError]}
                    value={priceText}
                    onChangeText={setPriceText}
                    placeholder="0,00"
                    placeholderTextColor={THEME.COLORS.TEXT_MUTED}
                    keyboardType="decimal-pad"
                    selectionColor={THEME.COLORS.PRIMARY}
                  />
                </View>
                <View style={styles.rowField}>
                  <Text style={styles.label}>Duração (min)</Text>
                  <TextInput
                    style={[styles.input, durationText && duration === null && styles.inputError]}
                    value={durationText}
                    onChangeText={setDurationText}
                    placeholder="30"
                    placeholderTextColor={THEME.COLORS.TEXT_MUTED}
                    keyboardType="number-pad"
                    maxLength={3}
                    selectionColor={THEME.COLORS.PRIMARY}
                  />
                </View>
              </View>
              {durationText !== '' && duration === null && (
                <Text style={styles.error}>Informe uma duração entre 1 e {MAX_DURATION_MIN} minutos.</Text>
              )}

              <Text style={styles.label}>Ícone</Text>
              <View style={styles.icons}>
                {SERVICE_ICON_OPTIONS.map((option) => {
                  const selected = option === icon;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.iconOption, selected && styles.iconOptionSelected]}
                      onPress={() => setIcon(option)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={`Ícone ${option}`}
                    >
                      <MaterialCommunityIcons
                        name={option}
                        size={THEME.FONT_SIZE.XL}
                        color={selected ? THEME.COLORS.TEXT_PRIMARY : THEME.COLORS.PRIMARY}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.footer}>
                <PrimaryButton
                  title={isEditing ? 'Salvar alterações' : 'Criar serviço'}
                  onPress={submit}
                  disabled={!canSubmit}
                />
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const ICON_OPTION_SIZE = THEME.SPACING.XL + THEME.SPACING.MD;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: THEME.COLORS.OVERLAY,
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderTopLeftRadius: THEME.BORDER_RADIUS.LG,
    borderTopRightRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.LG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  subtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  label: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  input: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    backgroundColor: THEME.COLORS.BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.SM + THEME.SPACING.XS,
  },
  inputError: {
    borderColor: THEME.COLORS.DANGER,
  },
  error: {
    color: THEME.COLORS.DANGER,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS,
  },
  row: {
    flexDirection: 'row',
    gap: THEME.SPACING.SM,
  },
  rowField: {
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.SM,
  },
  iconOption: {
    width: ICON_OPTION_SIZE,
    height: ICON_OPTION_SIZE,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    backgroundColor: THEME.COLORS.PRIMARY,
    borderColor: THEME.COLORS.PRIMARY,
  },
  footer: {
    marginTop: THEME.SPACING.LG,
  },
});
