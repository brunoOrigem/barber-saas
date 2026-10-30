import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { THEME } from '../theme';
import { useSettings } from '../contexts/SettingsContext';
import { openInstagramProfile, parseInstagramHandle } from '../utils/contact';

/** Campo para o barbeiro definir o Instagram da barbearia exibido aos clientes. */
export function InstagramLinkEditor() {
  const { activeShop, setShopInstagram } = useSettings();
  const saved = activeShop.instagram ?? '';
  const [text, setText] = useState(saved);
  const [lastSaved, setLastSaved] = useState(saved);

  // Ao trocar de barbearia (ou salvar), o campo volta a refletir o valor salvo.
  if (saved !== lastSaved) {
    setLastSaved(saved);
    setText(saved);
  }

  const isEmpty = text.trim() === '';
  const handle = isEmpty ? null : parseInstagramHandle(text);
  const invalid = !isEmpty && handle === null;
  const dirty = (handle ?? '') !== saved;
  const canSave = dirty && !invalid;

  const save = () => {
    setShopInstagram(handle);
    Keyboard.dismiss();
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Redes sociais</Text>
      <View style={styles.card}>
        <View style={styles.header}>
          <FontAwesome name="instagram" size={THEME.FONT_SIZE.LG} color={THEME.COLORS.PRIMARY} />
          <Text style={styles.label}>Instagram da barbearia</Text>
        </View>

        <TextInput
          style={[styles.input, invalid && styles.inputError]}
          value={text}
          onChangeText={setText}
          placeholder="@sua_barbearia ou instagram.com/sua_barbearia"
          placeholderTextColor={THEME.COLORS.TEXT_MUTED}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          onSubmitEditing={() => canSave && save()}
          selectionColor={THEME.COLORS.PRIMARY}
          accessibilityLabel="Link ou usuário do Instagram da barbearia"
        />

        {invalid ? (
          <Text style={styles.error}>Informe um usuário ou link válido do Instagram.</Text>
        ) : (
          <Text style={styles.hint}>
            {saved && !dirty
              ? 'Visível para os clientes na tela inicial.'
              : 'Cole o link do perfil ou digite apenas o @.'}
          </Text>
        )}

        <View style={styles.actions}>
          {saved !== '' && !dirty && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => openInstagramProfile(saved)}
              accessibilityRole="link"
            >
              <Text style={styles.secondaryText}>Ver perfil</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={save}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave }}
          >
            <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
              {isEmpty && saved ? 'Remover' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.SM,
    marginBottom: THEME.SPACING.SM,
  },
  label: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
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
  hint: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
  },
  secondaryButton: {
    borderRadius: THEME.BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.MD,
  },
  secondaryText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: THEME.COLORS.PRIMARY,
    borderRadius: THEME.BORDER_RADIUS.SM,
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.LG,
  },
  saveButtonDisabled: {
    backgroundColor: THEME.COLORS.PRIMARY_DISABLED,
  },
  saveText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  saveTextDisabled: {
    color: THEME.COLORS.TEXT_MUTED,
  },
});
