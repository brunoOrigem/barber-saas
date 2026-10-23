import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../theme';
import { PortfolioPost } from '../contexts/PortfolioContext';
import { formatTimeAgo } from '../utils/booking';

type Props = {
  post: PortfolioPost;
  onPress: () => void;
  accessibilityHint?: string;
};

/** Card de publicação usado na grade de portfólio (cliente e barbeiro). */
export function PortfolioPostCard({ post, onPress, accessibilityHint }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={post.title}
      accessibilityHint={accessibilityHint}
    >
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {post.title}
        </Text>
        <Text style={styles.date}>{formatTimeAgo(post.publishedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    overflow: 'hidden',
    marginBottom: THEME.SPACING.SM,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  body: {
    padding: THEME.SPACING.SM + THEME.SPACING.XS,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  date: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
});
