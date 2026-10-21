// Un solo set de íconos (Bootstrap Icons, SVG) para todo el sitio. Cada
// entrada lleva su movimiento (ver ui/Icono.jsx): <Icono {...ICONO_TIPO.crecida} />.
import {
  Bell,
  BellFill,
  Book,
  BookFill,
  ConeStriped,
  Droplet,
  DropletFill,
  DropletHalf,
  Hospital,
  HospitalFill,
  HourglassSplit,
  HouseDoor,
  HouseDoorFill,
  Megaphone,
  PatchCheckFill,
  People,
  PeopleFill,
  QuestionCircle,
  QuestionCircleFill,
  Water,
} from 'react-bootstrap-icons';

export const ICONO_TIPO = {
  crecida: { de: Water, mov: 'ola' },
  'corte-agua': { de: DropletHalf, mov: 'gota' },
  'via-cerrada': { de: ConeStriped, mov: 'sacudir' },
  traslado: { de: Hospital, mov: 'latido' },
};

export const ICONO_NIVEL = {
  reportado: { de: Megaphone, mov: 'sacudir' },
  'en-confirmacion': { de: HourglassSplit, mov: 'voltear' },
  confirmado: { de: PeopleFill, mov: 'latido' },
  oficial: { de: PatchCheckFill, mov: 'giro' },
};

// lleno: la versión rellena marca la página actual en la barra del teléfono.
export const ICONO_NAV = {
  House: { de: HouseDoor, lleno: HouseDoorFill, mov: 'latido' },
  Siren: { de: Bell, lleno: BellFill, mov: 'sacudir' },
  Question: { de: QuestionCircle, lleno: QuestionCircleFill, mov: 'sacudir' },
  Path: { de: Hospital, lleno: HospitalFill, mov: 'latido' },
  Drop: { de: Droplet, lleno: DropletFill, mov: 'gota' },
  BookOpen: { de: Book, lleno: BookFill, mov: 'sacudir' },
  Users: { de: People, lleno: PeopleFill, mov: 'latido' },
};
