import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { THEME } from '../theme';
import { PrimaryButton } from './PrimaryButton';

export type PortfolioDraft = {
  imageUrl: string;
  title: string;
  description?: string;
};

type Props = {
  visible: boolean;
  onPublish: (draft: PortfolioDraft) => void;
  onClose: () => void;
};

const TITLE_MAX_LENGTH = 40;
const DESCRIPTION_MAX_LENGTH = 200;

export function NewPortfolioPostModal({ visible, onPublish, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const canPublish = Boolean(imageUri && title.trim());

  function reset() {
    setImageUri(null);
    setTitle('');
    setDescription('');
  }

  function close() {
    reset();
    onClose();
  }

  // Selecionar imagens da galeria não exige pedir permissão antes: o sistema
  // abre o seletor nativo (no iOS, a mensagem vem do plugin no app.json).
  async function pickPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch {
      Alert.alert('Não foi possível abrir a galeria', 'Verifique as permissões do app e tente novamente.');
    }
  }

  function publish() {
    if (!imageUri || !title.trim()) return;
    onPublish({ imageUrl: imageUri, title: title.trim(), description: description.trim() || undefined });
    reset();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Fechar">
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={styles.title}>Novo corte</Text>
                <TouchableOpacity onPress={close} accessibilityRole="button" accessibilityLabel="Fechar">
                  <Ionicons name="close" size={THEME.FONT_SIZE.XL} color={THEME.COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.photo, !imageUri && styles.photoEmpty]}
                onPress={pickPhoto}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={imageUri ? 'Trocar foto' : 'Selecionar foto da galeria'}
              >
                {imageUri ? (
                  <>
                    <Image source={{ uri: imageUri }} style={styles.photoImage} />
                    <View style={styles.photoBadge}>
                      <Ionicons name="swap-horizontal" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_PRIMARY} />
                      <Text style={styles.photoBadgeText}>Trocar foto</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Ionicons name="images-outline" size={THEME.FONT_SIZE.XXL} color={THEME.COLORS.PRIMARY} />
                    <Text style={styles.photoLabel}>Selecionar foto da galeria</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Nome do corte / Descrição</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nome do corte (ex: Degradê com risco)"
                placeholderTextColor={THEME.COLORS.TEXT_MUTED}
                maxLength={TITLE_MAX_LENGTH}
                returnKeyType="next"
                selectionColor={THEME.COLORS.PRIMARY}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição (opcional)"
                placeholderTextColor={THEME.COLORS.TEXT_MUTED}
                maxLength={DESCRIPTION_MAX_LENGTH}
                multiline
                textAlignVertical="top"
                selectionColor={THEME.COLORS.PRIMARY}
              />

              <View style={styles.footer}>
                <PrimaryButton title="Publicar no Portfólio" onPress={publish} disabled={!canPublish} />
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const PHOTO_HEIGHT = THEME.SPACING.XL * 6;
const TEXT_AREA_HEIGHT = THEME.SPACING.XL * 3;

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
    marginBottom: THEME.SPACING.MD,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  photo: {
    height: PHOTO_HEIGHT,
    borderRadius: THEME.BORDER_RADIUS.MD,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  photoEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: THEME.COLORS.PRIMARY,
  },
  photoImage: {
    ...StyleSheet.absoluteFill,
  },
  photoBadge: {
    position: 'absolute',
    right: THEME.SPACING.SM,
    bottom: THEME.SPACING.SM,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
    paddingVertical: THEME.SPACING.XS,
    paddingHorizontal: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.OVERLAY,
  },
  photoBadgeText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
  },
  photoLabel: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.SM,
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
  textArea: {
    height: TEXT_AREA_HEIGHT,
    marginTop: THEME.SPACING.SM,
  },
  footer: {
    marginTop: THEME.SPACING.LG,
  },
});
