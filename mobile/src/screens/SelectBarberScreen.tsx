import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { THEME } from '../theme';
import { BARBERS, SERVICES, getServiceById } from '../data/mock';
import { RootStackParamList } from '../routes';
import { BarberCard } from '../components/BarberCard';
import { ServiceCard } from '../components/ServiceCard';
import { SelectableChip } from '../components/SelectableChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { BookingSummaryModal } from '../components/BookingSummaryModal';
import { useBookings } from '../contexts/BookingsContext';
import {
  formatDuration,
  formatPrice,
  getAvailableTimes,
  getBookingDays,
  minutesOfDay,
  toDayKey,
} from '../utils/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectBarber'>;

export function SelectBarberScreen({ route, navigation }: Props) {
  const days = useMemo(() => getBookingDays(), []);
  const { upcoming, addBooking } = useBookings();

  const [barberId, setBarberId] = useState<string | null>(() => {
    const id = route.params?.barberId;
    return id && BARBERS.some((b) => b.id === id) ? id : null;
  });
  const [serviceIds, setServiceIds] = useState<string[]>(() =>
    (route.params?.serviceIds ?? []).filter((id) => getServiceById(id)),
  );
  const [dayKey, setDayKey] = useState(() => (days.find((d) => d.hours) ?? days[0]).key);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const selectedServices = SERVICES.filter((service) => serviceIds.includes(service.id));
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.durationMin, 0);

  const barber = BARBERS.find((b) => b.id === barberId) ?? null;
  const day = days.find((d) => d.key === dayKey) ?? days[0];

  const availableTimes = useMemo(() => {
    if (!barberId) return [];
    // Horários que o cliente já reservou com este barbeiro neste dia ficam bloqueados.
    const taken = upcoming
      .filter((b) => b.barberId === barberId && toDayKey(new Date(b.startsAt)) === day.key)
      .map((b) => ({ startMin: minutesOfDay(new Date(b.startsAt)), durationMin: b.totalDuration }));
    return getAvailableTimes(barberId, day, totalDuration, taken);
  }, [barberId, day, totalDuration, upcoming]);

  // Se o barbeiro, dia ou duração mudarem, um horário que deixou de existir é descartado.
  const time = selectedTime && availableTimes.includes(selectedTime) ? selectedTime : null;

  const canProceed = !!barber && selectedServices.length > 0 && !!time;

  function toggleService(id: string) {
    setServiceIds((current) => {
      if (current.includes(id)) return current.filter((sid) => sid !== id);

      const service = getServiceById(id);
      const includes = service?.includes ?? [];
      // Combo e serviços que ele já inclui são mutuamente exclusivos.
      const withoutOverlaps = current.filter(
        (sid) => !includes.includes(sid) && !getServiceById(sid)?.includes?.includes(id),
      );
      return [...withoutOverlaps, id];
    });
  }

  function handleConfirm() {
    if (!barber || !time) return;

    const [hours, minutes] = time.split(':').map(Number);
    const startsAt = new Date(day.date);
    startsAt.setHours(hours, minutes, 0, 0);

    addBooking({
      barberId: barber.id,
      serviceIds: selectedServices.map((s) => s.id),
      startsAt: startsAt.getTime(),
      totalPrice,
      totalDuration,
    });

    setSummaryVisible(false);
    Alert.alert(
      'Agendamento confirmado',
      `${barber.name} te espera ${day.label.toLowerCase()} (${day.sublabel}) às ${time}.`,
      [{ text: 'OK', onPress: () => navigation.popTo('MainTabs', { screen: 'Bookings' }) }],
    );
  }

  function footerLabel() {
    if (!barber) return 'Escolha um profissional';
    if (selectedServices.length === 0) return 'Selecione ao menos um serviço';
    if (!time) return 'Escolha um horário';
    return 'Ver resumo';
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Profissional</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {BARBERS.map((b) => (
            <BarberCard
              key={b.id}
              barber={b}
              selected={b.id === barberId}
              onPress={() => setBarberId(b.id)}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Serviços</Text>
        <View style={styles.section}>
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={serviceIds.includes(service.id)}
              onPress={() => toggleService(service.id)}
              showCheckbox
            />
          ))}
          <View style={styles.totals}>
            <View style={styles.totalsDuration}>
              <Ionicons name="time-outline" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_SECONDARY} />
              <Text style={styles.totalsText}>{formatDuration(totalDuration)}</Text>
            </View>
            <Text style={styles.totalsPrice}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {days.map((d) => (
            <SelectableChip
              key={d.key}
              label={d.label}
              sublabel={d.hours ? d.sublabel : 'Fechado'}
              selected={d.key === dayKey}
              onPress={() => setDayKey(d.key)}
              style={styles.dayChip}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Horários disponíveis</Text>
        <View style={styles.section}>
          {!barberId ? (
            <Text style={styles.emptyText}>Escolha um profissional para ver os horários.</Text>
          ) : selectedServices.length === 0 ? (
            <Text style={styles.emptyText}>Selecione ao menos um serviço.</Text>
          ) : !day.hours ? (
            <Text style={styles.emptyText}>A barbearia está fechada neste dia.</Text>
          ) : availableTimes.length === 0 ? (
            <Text style={styles.emptyText}>Sem horários disponíveis neste dia.</Text>
          ) : (
            <View style={styles.timeGrid}>
              {availableTimes.map((t) => (
                <SelectableChip
                  key={t}
                  label={t}
                  selected={t === time}
                  onPress={() => setSelectedTime(t)}
                  style={styles.timeChip}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        {canProceed && (
          <Text style={styles.footerSummary} numberOfLines={1}>
            {day.label} às {time} · {formatPrice(totalPrice)}
          </Text>
        )}
        <PrimaryButton
          title={footerLabel()}
          disabled={!canProceed}
          onPress={() => setSummaryVisible(true)}
        />
      </SafeAreaView>

      {canProceed && (
        <BookingSummaryModal
          visible={summaryVisible}
          barber={barber}
          services={selectedServices}
          day={day}
          time={time}
          totalPrice={totalPrice}
          totalDuration={totalDuration}
          onConfirm={handleConfirm}
          onClose={() => setSummaryVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  content: {
    paddingBottom: THEME.SPACING.LG,
  },
  sectionTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
    paddingHorizontal: THEME.SPACING.MD,
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  section: {
    paddingHorizontal: THEME.SPACING.MD,
  },
  horizontalList: {
    paddingHorizontal: THEME.SPACING.MD,
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.XS,
  },
  totalsDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
  },
  totalsText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
  },
  totalsPrice: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  dayChip: {
    marginRight: THEME.SPACING.SM,
    minWidth: THEME.SPACING.XL * 2,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.SM,
  },
  timeChip: {
    width: '22%',
  },
  emptyText: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
  },
  footer: {
    padding: THEME.SPACING.MD,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: THEME.COLORS.BORDER,
  },
  footerSummary: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    textAlign: 'center',
    marginBottom: THEME.SPACING.SM,
  },
});
