import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Pequeños envoltorios de retroalimentación háptica (vibración sutil).
 * No hacen nada en web y nunca lanzan error: son "fire and forget".
 */

export function hapticSelect(): void {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}

export function hapticLight(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticSuccess(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
}
