import React, { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </>
  );
}

type RowProps = {
  icon: IconName;
  label: string;
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
};

export function SettingsRow({ icon, label, value, right, onPress, danger, last }: RowProps) {
  const content = (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Ionicons
        name={icon}
        size={THEME.FONT_SIZE.LG}
        color={danger ? THEME.COLORS.DANGER : THEME.COLORS.PRIMARY}
      />
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {right ??
        (onPress && (
          <Ionicons name="chevron-forward" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.TEXT_MUTED} />
        ))}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
      {content}
    </TouchableOpacity>
  ) : (
    content
  );
}

type SwitchRowProps = Omit<RowProps, 'right' | 'onPress'> & {
  enabled: boolean;
  onChange: (value: boolean) => void;
};

export function SettingsSwitchRow({ enabled, onChange, ...row }: SwitchRowProps) {
  return (
    <SettingsRow
      {...row}
      right={
        <Switch
          value={enabled}
          onValueChange={onChange}
          trackColor={{ false: THEME.COLORS.CARD_SELECTED, true: THEME.COLORS.PRIMARY }}
          thumbColor={THEME.COLORS.TEXT_PRIMARY}
          accessibilityLabel={row.label}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  group: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    paddingHorizontal: THEME.SPACING.MD,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.COLORS.BORDER,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  rowLabelDanger: {
    color: THEME.COLORS.DANGER,
  },
  rowValue: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
});
