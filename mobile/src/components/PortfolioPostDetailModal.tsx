import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { PortfolioPost } from '../contexts/PortfolioContext';

type Props = {
  post: PortfolioPost | null;
  onClose: () => void;
};

/** Visualização do corte no feed do cliente: apenas foto, nome e descrição. */
export function PortfolioPostDetailModal({ post, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={!!post} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar">
        {post && (
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}>
            <View>
              <Image source={{ uri: post.imageUrl }} style={styles.image} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
              >
                <Ionicons name="close" size={THEME.FONT_SIZE.LG} color={THEME.COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <Text style={styles.title}>{post.title}</Text>
              {post.description && <Text style={styles.description}>{post.description}</Text>}
            </View>
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}

const CLOSE_BUTTON_SIZE = THEME.SPACING.XL + THEME.SPACING.XS;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: THEME.COLORS.OVERLAY,
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderTopLeftRadius: THEME.BORDER_RADIUS.LG,
    borderTopRightRadius: THEME.BORDER_RADIUS.LG,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 5,
    maxHeight: 480,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  closeButton: {
    position: 'absolute',
    top: THEME.SPACING.MD,
    right: THEME.SPACING.MD,
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: THEME.SPACING.LG,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  description: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    lineHeight: THEME.FONT_SIZE.SM * 1.5,
    marginTop: THEME.SPACING.SM,
  },
});
