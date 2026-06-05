import type { EmotionalState, Passage } from '@/domain/types';

/**
 * Curated Bible passages per emotional state.
 * Free tier — shown on every prayer.
 * AI-selected passages are a premium feature (live service only).
 */
export const CURATED_PASSAGES: Record<EmotionalState, Passage[]> = {
  anxiety: [
    {
      ref: 'Filipenses 4,6-7',
      text: 'No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias. Y la paz de Dios, que sobrepasa todo entendimiento, cuidará sus corazones y sus pensamientos en Cristo Jesús.',
      tradition: 'shared',
      emotionalState: 'anxiety',
    },
    {
      ref: 'Mateo 6,25',
      text: 'Por eso les digo: No se preocupen por su vida, qué comerán o qué beberán; ni por su cuerpo, cómo se vestirán. ¿No vale más la vida que la comida, y el cuerpo más que la ropa?',
      tradition: 'shared',
      emotionalState: 'anxiety',
    },
  ],
  grief: [
    {
      ref: 'Juan 11,35',
      text: 'Jesús lloró.',
      tradition: 'shared',
      emotionalState: 'grief',
    },
    {
      ref: 'Salmos 34,19',
      text: 'El Señor está cerca de los que tienen el corazón quebrantado, y salva a los de espíritu abatido.',
      tradition: 'shared',
      emotionalState: 'grief',
    },
  ],
  guilt: [
    {
      ref: 'Salmos 51,1-2',
      text: 'Ten piedad de mí, oh Dios, conforme a tu misericordia; conforme a la multitud de tus piedades borra mis transgresiones. Lávame más y más de mi maldad, y límpiame de mi pecado.',
      tradition: 'shared',
      emotionalState: 'guilt',
    },
    {
      ref: '1 Juan 1,9',
      text: 'Si confesamos nuestros pecados, él es fiel y justo para perdonarnos los pecados y limpiarnos de toda maldad.',
      tradition: 'shared',
      emotionalState: 'guilt',
    },
  ],
  addiction: [
    {
      ref: '1 Corintios 10,13',
      text: 'No les ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no los dejará ser tentados más de lo que pueden resistir, sino que dará también juntamente con la tentación la salida, para que puedan soportar.',
      tradition: 'shared',
      emotionalState: 'addiction',
    },
    {
      ref: '2 Corintios 12,9',
      text: 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad.',
      tradition: 'shared',
      emotionalState: 'addiction',
    },
  ],
  purpose: [
    {
      ref: 'Jeremías 29,11',
      text: 'Porque yo sé los planes que tengo para ustedes —declara el Señor— planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.',
      tradition: 'shared',
      emotionalState: 'purpose',
    },
    {
      ref: 'Proverbios 3,5-6',
      text: 'Fíate del Señor de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.',
      tradition: 'shared',
      emotionalState: 'purpose',
    },
  ],
  relationship: [
    {
      ref: '1 Corintios 13,4-5',
      text: 'El amor es paciente, es bondadoso. El amor no tiene envidia; el amor no es jactancioso, no se envanece; no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor.',
      tradition: 'shared',
      emotionalState: 'relationship',
    },
    {
      ref: 'Colosenses 3,13',
      text: 'Sopórtense mutuamente, y si alguno tiene queja contra otro, perdónense; así como el Señor los perdonó, así también hagan ustedes.',
      tradition: 'shared',
      emotionalState: 'relationship',
    },
  ],
  faith_doubt: [
    {
      ref: 'Marcos 9,24',
      text: '¡Creo! ¡Ayuda mi incredulidad!',
      tradition: 'shared',
      emotionalState: 'faith_doubt',
    },
    {
      ref: 'Hebreos 11,1',
      text: 'La fe es la garantía de lo que se espera, la plena certeza de lo que no se ve.',
      tradition: 'shared',
      emotionalState: 'faith_doubt',
    },
  ],
  other: [
    {
      ref: 'Mateo 11,28',
      text: 'Vengan a mí todos los que están cansados y agobiados, y yo les daré descanso.',
      tradition: 'shared',
      emotionalState: 'other',
    },
    {
      ref: 'Romanos 8,26',
      text: 'El Espíritu nos ayuda en nuestra debilidad; pues qué hemos de pedir como conviene, no lo sabemos, pero el Espíritu mismo intercede por nosotros con gemidos indecibles.',
      tradition: 'shared',
      emotionalState: 'other',
    },
  ],
};
