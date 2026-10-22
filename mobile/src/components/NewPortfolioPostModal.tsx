import React, { useState } from 'react';
import {
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
import { THEME } from '../theme';
import { PORTFOLIO_SAMPLE_IMAGES, SERVICES, Service } from '../data/mock';
import { formatPrice } from '../utils/booking';
import { PrimaryButton } from './PrimaryButton';
import { SelectableChip } from './SelectableChip';

export type PortfolioDraft = {
  imageUrl: string;
  title: string;
  service: Service;
};

type Props = {
  visible: boolean;
  onPublish: (draft: PortfolioDraft) => void;
  onClose: () => void;
};

const TITLE_MAX_LENGTH = 40;

export function NewPortfolioPostModal({ visible, onPublish, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [serviceId, setServiceId] = useState<string | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId);
  const imageUrl = imageIndex === null ? null : PORTFOLIO_SAMPLE_IMAGES[imageIndex];
  const canPublish = Boolean(imageUrl && title.trim() && service);

  function reset() {
    setImageIndex(null);
    setTitle('');
    setServiceId(null);
  }

  function close() {
    reset();
    onClose();
  }

  // Sem acesso real à galeria no MVP: percorre fotos de exemplo.
  function pickPhoto() {
    setImageIndex((current) =>
      current === null ? 0 : (current + 1) % PORTFOLIO_SAMPLE_IMAGES.length,
    );
  }

  function publish() {
    if (!imageUrl || !service) return;
    onPublish({ imageUrl, title: title.trim(), service });
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
              <Text style={styles.subtitle}>A publicação aparecerá no feed para os clientes.</Text>

              <TouchableOpacity
                style={[styles.photo, !imageUrl && styles.photoEmpty]}
                onPress={pickPhoto}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={imageUrl ? 'Trocar foto' : 'Selecionar foto'}
              >
                {imageUrl ? (
                  <>
                    <Image source={{ uri: imageUrl }} style={styles.photoImage} />
                    <View style={styles.photoBadge}>
                      <Ionicons name="swap-horizontal" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_PRIMARY} />
                      <Text style={styles.photoBadgeText}>Trocar foto</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={THEME.FONT_SIZE.XXL} color={THEME.COLORS.PRIMARY} />
                    <Text style={styles.photoLabel}>Selecionar foto</Text>
                    <Text style={styles.photoHint}>Simulação de envio da galeria</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Título do corte</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Degradê com risco"
                placeholderTextColor={THEME.COLORS.TEXT_MUTED}
                maxLength={TITLE_MAX_LENGTH}
                returnKeyType="done"
                selectionColor={THEME.COLORS.PRIMARY}
              />

              <Text style={styles.label}>Serviço vinculado</Text>
              <View style={styles.services}>
                {SERVICES.map((s) => (
                  <SelectableChip
                    key={s.id}
                    label={s.name}
                    sublabel={formatPrice(s.price)}
                    selected={s.id === serviceId}
                    onPress={() => setServiceId(s.id)}
                    style={styles.serviceChip}
                  />
                ))}
              </View>

              <View style={styles.footer}>
                <PrimaryButton
                  title={service ? `Publicar · ${formatPrice(service.price)}` : 'Publicar no feed'}
                  onPress={publish}
                  disabled={!canPublish}
                />
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const PHOTO_HEIGHT = THEME.SPACING.XL * 6;

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
    marginBottom: THEME.SPACING.MD,
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
  photoHint: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
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
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.SM,
  },
  serviceChip: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  footer: {
    marginTop: THEME.SPACING.LG,
  },
});
