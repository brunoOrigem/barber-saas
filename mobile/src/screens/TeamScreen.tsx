import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { BARBERS } from '../data/mock';

const AVATAR_SIZE = THEME.SPACING.XL * 2;

export function TeamScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + THEME.SPACING.MD }]}
      data={BARBERS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={THEME.FONT_SIZE.XS} color={THEME.COLORS.WARNING} />
              <Text style={styles.rating}>
                {item.rating.toFixed(1)}
                <Text style={styles.reviews}> · {item.reviews} avaliações</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SelectBarber', { barberId: item.id })}
            accessibilityRole="button"
            accessibilityLabel={`Agendar com ${item.name}`}
          >
            <Text style={styles.buttonText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  list: {
    padding: THEME.SPACING.MD,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    marginBottom: THEME.SPACING.SM,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
    marginRight: THEME.SPACING.MD,
  },
  info: {
    flex: 1,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  specialty: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS / 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
    marginTop: THEME.SPACING.XS,
  },
  rating: {
    color: THEME.COLORS.WARNING,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
  },
  reviews: {
    color: THEME.COLORS.TEXT_MUTED,
    fontWeight: 'normal',
  },
  button: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.MD,
    marginLeft: THEME.SPACING.SM,
  },
  buttonText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
});
