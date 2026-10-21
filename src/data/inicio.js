import { FOTOS } from './fotos.js';

// Carrusel del inicio: cada foto acompaña un mensaje corto (máx. 20 palabras).
// El primer mensaje también está escrito en index.html (vista previa estática).
export const SLIDES_HERO = [
  {
    id: 'lluvia',
    foto: FOTOS.lluvia,
    mensaje: 'Cuando llueve fuerte, tus vecinos te avisan si el Caimito o el Martín Sánchez empiezan a crecer.',
  },
  {
    id: 'confirmar',
    foto: FOTOS.inundada,
    mensaje: 'Un aviso solo se difunde cuando otros vecinos lo confirman. Así se frenan los rumores.',
  },
  {
    id: 'agua',
    foto: FOTOS.agua,
    mensaje: 'Entérate en qué calles se fue el agua y dónde están repartiendo.',
  },
  {
    id: 'comunidad',
    foto: FOTOS.vecinos,
    mensaje: 'Lo que sabemos lo construimos entre todos, con identidad anónima y sin publicar teléfonos.',
  },
];

// Escenarios ficticios: se muestran siempre con la etiqueta "Ejemplo".
export const ESCENARIOS = [
  {
    id: 'crecida',
    tipo: 'crecida',
    texto: 'El Martín Sánchez venía crecido. Tres vecinos lo confirmaron en doce minutos y alcanzamos a mover los carros.',
    quien: 'Vecina de Martín Sánchez',
  },
  {
    id: 'audio',
    tipo: 'corte-agua',
    texto: 'Me llegó un audio diciendo que el corte duraba tres días. En FLUYA vi el aviso oficial: era solo hasta la noche.',
    quien: 'Vecino de Villa del Campo',
  },
  {
    id: 'falso',
    tipo: 'via-cerrada',
    texto: 'Alguien reportó la entrada cerrada. Cuatro vecinos marcaron "Esto es falso" y el aviso bajó antes de regarse.',
    quien: 'Moderadora de Valle Dorado',
  },
  {
    id: 'traslado',
    tipo: 'traslado',
    texto: 'Mi papá tenía cita en el Nicolás Solano con la autopista trancada. El moderador nos conectó con un vecino que iba.',
    quien: 'Vecino de Nicolás Solano',
  },
];
