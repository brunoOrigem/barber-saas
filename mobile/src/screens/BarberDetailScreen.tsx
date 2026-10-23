import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { getBarberById } from '../data/mock';
import { RootStackParamList } from '../routes/types';
import { PortfolioPost, usePortfolio } from '../contexts/PortfolioContext';
import { PortfolioPostCard } from '../components/PortfolioPostCard';
import { PortfolioPostDetailModal } from '../components/PortfolioPostDetailModal';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'BarberDetail'>;

const AVATAR_SIZE = THEME.SPACING.XL * 2 + THEME.SPACING.MD;

export function BarberDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { posts } = usePortfolio();
  const [selectedPost, setSelectedPost] = useState<PortfolioPost | null>(null);

  const barber = getBarberById(route.params.barberId);
  // Lê direto do contexto: publicações feitas no modo barbeiro aparecem na hora.
  const barberPosts = posts.filter((post) => post.barberId === route.params.barberId);

  if (!barber) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={barberPosts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.profileCard}>
              <Image source={{ uri: barber.avatarUrl }} style={styles.avatar} />
              <Text style={styles.name}>{barber.name}</Text>
              <Text style={styles.specialty}>{barber.specialty}</Text>
              <View style={styles.rating}>
                <Ionicons name="star" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.WARNING} />
                <Text style={styles.ratingText}>
                  {barber.rating.toFixed(1)} · {barber.reviews} avaliações
                </Text>
              </View>
              <View style={styles.bookButton}>
                <PrimaryButton
                  title={`Agendar com ${barber.name.split(' ')[0]}`}
                  onPress={() => navigation.navigate('SelectBarber', { barberId: barber.id })}
                />
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Portfólio</Text>
              <Text style={styles.sectionCount}>
                {barberPosts.length} {barberPosts.length === 1 ? 'corte' : 'cortes'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PortfolioPostCard
            post={item}
            onPress={() => setSelectedPost(item)}
            accessibilityHint="Abre os detalhes do corte"
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="images-outline" size={THEME.SPACING.XL * 1.5} color={THEME.COLORS.TEXT_MUTED} />
            <Text style={styles.emptyTitle}>Nenhum corte publicado ainda</Text>
            <Text style={styles.emptyText}>Os trabalhos de {barber.name} aparecerão aqui.</Text>
          </View>
        }
      />

      <PortfolioPostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  list: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.SM,
    flexGrow: 1,
  },
  column: {
    gap: THEME.SPACING.SM,
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
    borderWidth: 2,
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.MD,
  },
  specialty: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
    marginTop: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.XS,
    paddingHorizontal: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  ratingText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
  },
  bookButton: {
    alignSelf: 'stretch',
    marginTop: THEME.SPACING.LG,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  sectionTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  sectionCount: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
  },
  empty: {
    alignItems: 'center',
    paddingTop: THEME.SPACING.XL,
  },
  emptyTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.MD,
  },
  emptyText: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
    textAlign: 'center',
  },
});
