import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CalculatorExportPayload } from '../../types/export';
import {
  exportCalculatorExcel,
  exportCalculatorPdf,
} from '../../utils/export/downloadExport';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { Button } from './Button';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';

interface ExportActionsProps {
  payload: CalculatorExportPayload;
}

export function ExportActions({ payload }: ExportActionsProps) {
  const [busyAction, setBusyAction] = useState<'pdf' | 'excel' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runExport = useCallback(
    async (action: 'pdf' | 'excel') => {
      setBusyAction(action);
      setError(null);

      try {
        if (action === 'pdf') {
          await exportCalculatorPdf(payload);
        } else {
          await exportCalculatorExcel(payload);
        }
      } catch (exportError) {
        const message =
          exportError instanceof Error ? exportError.message : 'Export failed. Please try again.';
        setError(message);
      } finally {
        setBusyAction(null);
      }
    },
    [payload],
  );

  return (
    <Card>
      <SectionHeader
        title="Export"
        subtitle="Download a PDF or Excel workbook with summary, charts, and full schedules"
      />
      <View style={styles.actions}>
        <Button
          disabled={busyAction !== null}
          label={busyAction === 'pdf' ? 'Preparing PDF…' : 'Download PDF'}
          onPress={() => runExport('pdf')}
          style={styles.actionButton}
        />
        <Button
          disabled={busyAction !== null}
          label={busyAction === 'excel' ? 'Preparing Excel…' : 'Download Excel'}
          onPress={() => runExport('excel')}
          style={styles.actionButton}
          variant="ghost"
        />
      </View>
      {busyAction ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.tealAccent} size="small" />
          <Text style={styles.loadingText}>Building your export…</Text>
        </View>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Text style={styles.hint}>
        Exports include donut breakdown and schedule/growth charts. Excel sheets use plain numbers so you can continue calculating in spreadsheets.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.destructive,
  },
  hint: {
    marginTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
