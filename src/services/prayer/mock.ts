import type { PrayerService } from './interface';
import type { Intake, Prayer } from '@/domain/types';
import type { Passage } from '@/domain/types';

const MOCK_PRAYERS: Record<string, string> = {
  anxiety: 'Señor, cargo el peso de la incertidumbre en mi pecho. Sé que el futuro me preocupa y que mis fuerzas se agotan en el intento de controlar lo que no puedo ver. Pero tú, que conoces cada paso de mi camino antes de que lo dé, me invitas a descansar. Que pueda soltar, aunque sea por un momento, la necesidad de saber todo. Tú eres mi pastor — nada me faltará.',
  grief: 'Señor, traigo ante ti esta pérdida que me pesa como una piedra en el corazón. El dolor es real, la ausencia es real, y tú no me pides que lo niegue. Tú mismo lloraste ante la tumba de tu amigo. Acompáñame en este camino, y que tu luz — aunque no la vea ahora — ilumine la oscuridad que siento.',
  guilt: 'Señor, cargo el peso de lo que hice y no puedo deshacer. La vergüenza es pesada, pero tú eres más grande que mi culpa. Tu misericordia llega antes de que yo termine de hablar. Límpiame, como el Salmo pide, y ayúdame a levantarme sin cargar lo que ya entregué.',
  addiction: 'Señor, reconozco que algo me tiene. Lo que debía ser libre se ha vuelto esclavo. No tengo fuerza sola para salir de esto — pero tú prometiste que tu gracia basta. Dame un día de libertad, solo hoy, y que sea suficiente para empezar.',
  purpose: 'Señor, me siento perdido en medio de tanto ruido. Sé que me creaste para algo, pero no lo veo con claridad. En este silencio te pregunto: ¿dónde quieres que vaya? Abre mis ojos para reconocer el camino que ya pusiste ante mí, aunque no lo haya notado todavía.',
  relationship: 'Señor, las relaciones son difíciles y ahora más que nunca lo siento. El amor que tengo no siempre sabe cómo expresarse, y el dolor de la distancia me pesa. Ayúdame a ver al otro con tus ojos — a ver lo que cargo yo y lo que carga él, y a encontrar el camino hacia la reconciliación.',
  faith_doubt: 'Señor, hay preguntas que no tienen respuesta fácil, y honestamente me pesan. No sé si estás escuchando. No sé si este silencio es tuyo o mío. Pero te lo digo igual, porque si existes, quiero que sepas que estoy aquí — confundido pero buscando.',
  other: 'Señor, no sé bien cómo nombrar lo que cargo. Solo sé que algo pesa y que necesito traértelo. Tú, que conoces mis palabras antes de que las diga, recibe lo que no puedo articular. Tu Espíritu intercede con gemidos que yo no encuentro.',
};

function generateMockId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export const mockPrayerService: PrayerService = {
  async generate(intake: Intake, _passages: Passage[]): Promise<Prayer> {
    await new Promise((r) => setTimeout(r, 800));
    const template = MOCK_PRAYERS[intake.emotionalState] ?? MOCK_PRAYERS.other;
    const closing =
      intake.tradition === 'orthodox'
        ? '\n\nUn padre espiritual puede acompañarte a vivir lo que esta oración nombra. Búscalo cuando estés listo.'
        : '\n\nUn sacerdote puede acompañarte a vivir lo que esta oración nombra. Búscalo cuando estés listo.';
    return {
      id: generateMockId(),
      intakeId: generateMockId(),
      body: `${intake.name}, ${template}${closing}`,
      emotionalState: intake.emotionalState,
      tradition: intake.tradition,
      createdAt: Date.now(),
    };
  },
};
