import React, { useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { Service } from '../data/mock';
import { RootStackParamList } from '../routes/types';
import { NewService, useServices } from '../contexts/ServicesContext';
import { ServiceFormModal } from '../components/ServiceFormModal';
import { formatDuration, formatPrice } from '../utils/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'BarberServices'>;

// `null` = modal fechado; `'new'` = criação; Service = edição.
type FormState = null | 'new' | Service;

export function BarberServicesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { services, addService, updateService, toggleServiceStatus } = useServices();
  const [form, setForm] = useState<FormState>(null);

  const activeCount = services.filter((s) => s.active).length;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setForm('new')}
          accessibilityRole="button"
          accessibilityLabel="Novo serviço"
          hitSlop={THEME.SPACING.SM}
        >
          <Ionicons name="add" size={THEME.FONT_SIZE.XL} color={THEME.COLORS.PRIMARY} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function submit(data: NewService) {
    if (form === 'new') addService(data);
    else if (form) updateService(form.id, data);
    setForm(null);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.subtitle}>
            {activeCount} de {services.length} serviços visíveis para os clientes. Toque em um
            serviço para reajustar preço e duração.
          </Text>
        }
        renderItem={({ item }) => (
          <ServiceRow
            service={item}
            onPress={() => setForm(item)}
            onToggle={() => toggleServiceStatus(item.id)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setForm('new')}
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={THEME.FONT_SIZE.LG} color={THEME.COLORS.PRIMARY} />
            <Text style={styles.addButtonText}>Criar novo serviço</Text>
          </TouchableOpacity>
        }
      />

      <ServiceFormModal
        visible={form !== null}
        service={form === 'new' ? null : form}
        onSubmit={submit}
        onClose={() => setForm(null)}
      />
    </View>
  );
}

function ServiceRow({
  service,
  onPress,
  onToggle,
}: {
  service: Service;
  onPress: () => void;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, !service.active && styles.cardInactive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Editar ${service.name}`}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={service.icon} size={THEME.FONT_SIZE.XL} color={THEME.COLORS.PRIMARY} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {service.name}
        </Text>
        <Text style={styles.meta}>
          <Text style={styles.price}>{formatPrice(service.price)}</Text> · {formatDuration(service.durationMin)}
          {!service.active && ' · Inativo'}
        </Text>
      </View>
      <Switch
        value={service.active}
        onValueChange={onToggle}
        trackColor={{ false: THEME.COLORS.CARD_SELECTED, true: THEME.COLORS.PRIMARY }}
        thumbColor={THEME.COLORS.TEXT_PRIMARY}
        accessibilityLabel={`${service.name} visível para clientes`}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  list: {
    paddingHorizontal: THEME.SPACING.MD,
  },
  subtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginBottom: THEME.SPACING.MD,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    padding: THEME.SPACING.MD,
    marginBottom: THEME.SPACING.SM,
  },
  cardInactive: {
    opacity: 0.5,
  },
  iconBox: {
    width: THEME.SPACING.XL + THEME.SPACING.SM,
    height: THEME.SPACING.XL + THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: '600',
  },
  meta: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  price: {
    color: THEME.COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.MD,
    borderRadius: THEME.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: THEME.COLORS.PRIMARY,
  },
  addButtonText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
});
