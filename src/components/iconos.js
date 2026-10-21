// Un solo set de íconos (Bootstrap Icons, SVG) para todo el sitio. Cada
// entrada lleva su movimiento (ver ui/Icono.jsx): <Icono {...ICONO_TIPO.crecida} />.
import {
  Bell,
  BellFill,
  Book,
  BookFill,
  CheckCircle,
  Clock,
  ConeStriped,
  Droplet,
  DropletFill,
  DropletHalf,
  Hospital,
  HospitalFill,
  HouseDoor,
  HouseDoorFill,
  PatchCheck,
  PlusSquare,
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
  traslado: { de: PlusSquare, mov: 'latido' },
};

export const ICONO_NIVEL = {
  // Íconos del semáforo según el manual de marca.
  reportado: { de: Clock, mov: 'sacudir' },
  'en-confirmacion': { de: People, mov: 'latido' },
  confirmado: { de: CheckCircle, mov: 'latido' },
  oficial: { de: PatchCheck, mov: 'giro' },
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
