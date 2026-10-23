import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { DEMO_BARBER_ID } from '../data/mock';
import { PortfolioPost, usePortfolio } from '../contexts/PortfolioContext';
import { NewPortfolioPostModal, PortfolioDraft } from '../components/NewPortfolioPostModal';
import { PortfolioPostCard } from '../components/PortfolioPostCard';
import { PrimaryButton } from '../components/PrimaryButton';

const HEADER_BUTTON_SIZE = THEME.SPACING.XL + THEME.SPACING.SM;

export function BarberPortfolioManagerScreen() {
  const insets = useSafeAreaInsets();
  const { posts, addPost, removePost } = usePortfolio();
  const [modalVisible, setModalVisible] = useState(false);

  const myPosts = posts.filter((post) => post.barberId === DEMO_BARBER_ID);

  function publish(draft: PortfolioDraft) {
    addPost({ barberId: DEMO_BARBER_ID, ...draft });
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
        renderItem={({ item }) => (
          <PortfolioPostCard
            post={item}
            onPress={() => confirmRemove(item)}
            accessibilityHint="Toque para gerenciar a publicação"
          />
        )}
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
