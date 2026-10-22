import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { Booking, useBookings } from '../contexts/BookingsContext';
import { BookingCard } from '../components/BookingCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { formatRelativeDay } from '../utils/booking';

type Segment = 'upcoming' | 'history';

export function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { upcoming, history, cancelBooking } = useBookings();
  const [segment, setSegment] = useState<Segment>('upcoming');

  const data = segment === 'upcoming' ? upcoming : history;

  function confirmCancel(booking: Booking) {
    Alert.alert(
      'Cancelar agendamento?',
      `O seu horário de ${formatRelativeDay(new Date(booking.startsAt)).toLowerCase()} será liberado.`,
      [
        { text: 'Manter', style: 'cancel' },
        { text: 'Cancelar', style: 'destructive', onPress: () => cancelBooking(booking.id) },
      ],
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + THEME.SPACING.MD }]}>
      <Text style={styles.title}>Meus agendamentos</Text>

      <View style={styles.segmented}>
        <SegmentButton
          label={`Próximos (${upcoming.length})`}
          active={segment === 'upcoming'}
          onPress={() => setSegment('upcoming')}
        />
        <SegmentButton
          label="Histórico"
          active={segment === 'history'}
          onPress={() => setSegment('history')}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          segment === 'upcoming' ? (
            <BookingCard booking={item} onCancel={() => confirmCancel(item)} />
          ) : (
            <BookingCard
              booking={item}
              onRebook={() =>
                navigation.navigate('SelectBarber', {
                  barberId: item.barberId,
                  serviceIds: item.serviceIds,
                })
              }
            />
          )
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-clear-outline" size={THEME.SPACING.XL * 1.5} color={THEME.COLORS.TEXT_MUTED} />
            <Text style={styles.emptyTitle}>
              {segment === 'upcoming' ? 'Nenhum horário marcado' : 'Sem histórico ainda'}
            </Text>
            <Text style={styles.emptyText}>
              {segment === 'upcoming'
                ? 'Que tal garantir o seu próximo corte?'
                : 'Os seus atendimentos aparecerão aqui.'}
            </Text>
            {segment === 'upcoming' && (
              <View style={styles.emptyButton}>
                <PrimaryButton title="Agendar agora" onPress={() => navigation.navigate('SelectBarber')} />
              </View>
            )}
          </View>
        }
      />
    </View>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.segment, active && styles.segmentActive]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
    paddingHorizontal: THEME.SPACING.MD,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.MD,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    padding: THEME.SPACING.XS,
    marginBottom: THEME.SPACING.MD,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.SM,
  },
  segmentActive: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
  },
  segmentText: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: THEME.COLORS.PRIMARY,
  },
  list: {
    paddingBottom: THEME.SPACING.LG,
    flexGrow: 1,
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
