import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { DEMO_BARBER_ID, getServiceById } from '../data/mock';
import { PortfolioPost, usePortfolio } from '../contexts/PortfolioContext';
import { NewPortfolioPostModal, PortfolioDraft } from '../components/NewPortfolioPostModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { formatPrice, formatTimeAgo } from '../utils/booking';

const HEADER_BUTTON_SIZE = THEME.SPACING.XL + THEME.SPACING.SM;

export function BarberPortfolioManagerScreen() {
  const insets = useSafeAreaInsets();
  const { posts, addPost, removePost } = usePortfolio();
  const [modalVisible, setModalVisible] = useState(false);

  const myPosts = posts.filter((post) => post.barberId === DEMO_BARBER_ID);

  function publish({ imageUrl, title, service }: PortfolioDraft) {
    addPost({
      barberId: DEMO_BARBER_ID,
      imageUrl,
      title,
      serviceId: service.id,
      price: service.price,
    });
    setModalVisible(false);
  }

  function confirmRemove(post: PortfolioPost) {
    Alert.alert('Remover publicação?', `"${post.title}" deixará de aparecer no feed.`, [
      { text: 'Manter', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removePost(post.id) },
    ]);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + THEME.SPACING.MD }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Portfólio</Text>
          <Text style={styles.subtitle}>
            {myPosts.length} {myPosts.length === 1 ? 'publicação no feed' : 'publicações no feed'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Publicar novo corte"
        >
          <Ionicons name="add" size={THEME.FONT_SIZE.XL} color={THEME.COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard post={item} onPress={() => confirmRemove(item)} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="images-outline" size={THEME.SPACING.XL * 1.5} color={THEME.COLORS.TEXT_MUTED} />
            <Text style={styles.emptyTitle}>Nenhum corte publicado</Text>
            <Text style={styles.emptyText}>Mostre o seu trabalho para atrair novos clientes.</Text>
            <View style={styles.emptyButton}>
              <PrimaryButton title="Publicar primeiro corte" onPress={() => setModalVisible(true)} />
            </View>
          </View>
        }
      />

      <NewPortfolioPostModal
        visible={modalVisible}
        onPublish={publish}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

function PostCard({ post, onPress }: { post: PortfolioPost; onPress: () => void }) {
  const service = getServiceById(post.serviceId);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${post.title}. Toque para gerenciar`}
    >
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {post.title}
        </Text>
        <Text style={styles.postService} numberOfLines={1}>
          {service?.name}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>{formatPrice(post.price)}</Text>
          <Text style={styles.date}>{formatTimeAgo(post.publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
    paddingHorizontal: THEME.SPACING.MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.SPACING.MD,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  subtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  addButton: {
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingBottom: THEME.SPACING.LG,
    flexGrow: 1,
  },
  column: {
    gap: THEME.SPACING.SM,
  },
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
  cardBody: {
    padding: THEME.SPACING.SM + THEME.SPACING.XS,
  },
  postTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  postService: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: THEME.SPACING.SM,
  },
  price: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  date: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
  },
  empty: {
    alignItems: 'center',
    paddingTop: THEME.SPACING.XL * 2,
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
  },
  emptyButton: {
    alignSelf: 'stretch',
    marginTop: THEME.SPACING.LG,
  },
});
