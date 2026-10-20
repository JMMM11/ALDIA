// Fotos con Licencia Unsplash (uso libre). Los créditos se muestran en el pie del sitio.
import inundadaL from '../assets/fotos/calle-inundada-l.webp';
import inundadaM from '../assets/fotos/calle-inundada-m.webp';
import aguaL from '../assets/fotos/agua-balde-l.webp';
import aguaM from '../assets/fotos/agua-balde-m.webp';
import vecinosL from '../assets/fotos/vecinos-sembrando-l.webp';
import vecinosM from '../assets/fotos/vecinos-sembrando-m.webp';
import barrioL from '../assets/fotos/calle-barrio-l.webp';
import barrioS from '../assets/fotos/calle-barrio-s.webp';
import telefonoL from '../assets/fotos/telefono-manos-l.webp';
import telefonoS from '../assets/fotos/telefono-manos-s.webp';
import viaL from '../assets/fotos/via-mojada-l.webp';
import viaS from '../assets/fotos/via-mojada-s.webp';

// La primera foto del inicio vive en public/ con nombre fijo para que
// index.html la precargue antes de que corra JavaScript (mejora el LCP).
const publica = (archivo) => `${import.meta.env.BASE_URL}fotos/${archivo}`;

// ancho y alto de cada recorte: reservan el espacio y evitan saltos de diseño.
export const FOTOS = {
  lluvia: {
    alt: 'Una persona camina bajo la lluvia de noche con un paraguas, iluminada por los faros de un carro.',
    grande: { src: publica('lluvia-noche-l.webp'), ancho: 1600, alto: 1000 },
    movil: { src: publica('lluvia-noche-m.webp'), ancho: 800, alto: 1100 },
    autor: 'Sohan Shingade',
    enlace: 'https://unsplash.com/photos/WWfiTIjy780',
  },
  inundada: {
    alt: 'Calle mojada por un aguacero, con una cerca blanca y árboles a un lado.',
    grande: { src: inundadaL, ancho: 1600, alto: 1000 },
    movil: { src: inundadaM, ancho: 800, alto: 1100 },
    autor: 'yusrizal iskadi',
    enlace: 'https://unsplash.com/photos/W-snX25xw3s',
  },
  agua: {
    alt: 'Un balde metálico lleno de agua bajo una pluma, con un barrio de fondo.',
    grande: { src: aguaL, ancho: 1600, alto: 1000 },
    movil: { src: aguaM, ancho: 800, alto: 1100 },
    autor: 'George Lopez',
    enlace: 'https://unsplash.com/photos/mKpjaVSueCE',
  },
  vecinos: {
    alt: 'Tres personas siembran flores juntas en una jardinera frente a una casa.',
    grande: { src: vecinosL, ancho: 1600, alto: 1000 },
    movil: { src: vecinosM, ancho: 800, alto: 1100 },
    autor: 'Quilia',
    enlace: 'https://unsplash.com/photos/qo6_mo9dsYg',
  },
  barrio: {
    alt: 'Calle de barrio con carros, motos y casas de colores, con lomas al fondo.',
    grande: { src: barrioL, ancho: 1200, alto: 800 },
    chica: { src: barrioS, ancho: 600, alto: 400 },
    autor: 'Kiran Naidu',
    enlace: 'https://unsplash.com/photos/DLw8tsxnS7c',
  },
  telefono: {
    alt: 'Manos de una mujer escribiendo en su teléfono celular.',
    grande: { src: telefonoL, ancho: 900, alto: 1125 },
    chica: { src: telefonoS, ancho: 480, alto: 600 },
    autor: 'Ruan Richard Rodrigues',
    enlace: 'https://unsplash.com/photos/pK3ozoRgQGc',
  },
  via: {
    alt: 'Avenida vacía y mojada después de la lluvia, con reflejos de luz en el asfalto.',
    grande: { src: viaL, ancho: 1200, alto: 800 },
    chica: { src: viaS, ancho: 600, alto: 400 },
    autor: 'Wes Hicks',
    enlace: 'https://unsplash.com/photos/tHgnDUyUkXc',
  },
};
