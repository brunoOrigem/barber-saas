import React, { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { UserRole, useUserRole } from '../contexts/UserRoleContext';
import { SettingsSection } from './SettingsList';

type IconName = ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { role: UserRole; label: string; icon: IconName }[] = [
  { role: 'client', label: 'Cliente', icon: 'person-outline' },
  { role: 'barber', label: 'Barbeiro', icon: 'cut-outline' },
];

/** Seletor de demonstração para alternar entre as experiências de cliente e profissional. */
export function RoleModeSwitch() {
  const { userRole, setUserRole } = useUserRole();

  return (
    <SettingsSection title="Modo de exibição (Demo)">
      <View style={styles.container}>
        <View style={styles.segmented} accessibilityRole="radiogroup">
          {OPTIONS.map(({ role, label, icon }) => {
            const active = role === userRole;
            return (
              <TouchableOpacity
                key={role}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => setUserRole(role)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
              >
                <Ionicons
                  name={icon}
                  size={THEME.FONT_SIZE.MD}
                  color={active ? THEME.COLORS.PRIMARY : THEME.COLORS.TEXT_MUTED}
                />
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.hint}>
          Alterna entre a experiência do cliente e a do profissional. Disponível apenas na demonstração.
        </Text>
      </View>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: THEME.SPACING.MD,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: THEME.COLORS.BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    padding: THEME.SPACING.XS,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.SPACING.XS,
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
  hint: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.SM,
  },
});
