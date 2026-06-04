import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Max 2 per week per ORATIO_MASTER_BRIEF §2.1
const MAX_PER_WEEK = 2;

// Notification content templates — personalized copy referencing the user's situation
const NOTIFICATION_TEMPLATES = [
  {
    title: 'Tu oración de hoy',
    body: 'Tu carga de esta semana merece un momento de silencio. ¿Oramos juntos?',
  },
  {
    title: 'Un momento contigo',
    body: 'La cuerda puede retejerse hoy. Regresa cuando estés listo.',
  },
  {
    title: 'Continúa tu plan',
    body: 'El pasaje de hoy espera. Un minuto puede cambiar el día.',
  },
  {
    title: 'Camino Sanctus',
    body: 'Lo que cargas no desaparece solo. Llévalo ante Dios hoy.',
  },
];

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function schedulePrayerReminders(
  userName?: string,
): Promise<void> {
  // Cancel existing scheduled notifications before rescheduling
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  // Schedule 2 notifications per week: Wed 8am + Sun 9am
  const schedules = [
    { weekday: 4, hour: 8,  minute: 0 }, // Wednesday
    { weekday: 1, hour: 9,  minute: 0 }, // Sunday
  ];

  for (let i = 0; i < schedules.length && i < MAX_PER_WEEK; i++) {
    const template = NOTIFICATION_TEMPLATES[i % NOTIFICATION_TEMPLATES.length];
    const body = userName
      ? template.body.replace('Tu carga', `${userName}, tu carga`)
      : template.body;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title,
        body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: schedules[i].weekday,
        hour: schedules[i].hour,
        minute: schedules[i].minute,
      },
    });
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
