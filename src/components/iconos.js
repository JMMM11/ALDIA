// Un solo set de íconos (Phosphor) para todo el sitio.
import {
  Ambulance,
  Barricade,
  BookOpen,
  CircleDashed,
  Drop,
  DropSlash,
  HourglassMedium,
  House,
  Path,
  Question,
  SealCheck,
  Siren,
  Users,
  UsersThree,
  Waves,
} from '@phosphor-icons/react';

export const ICONO_TIPO = {
  crecida: Waves,
  'corte-agua': DropSlash,
  'via-cerrada': Barricade,
  traslado: Ambulance,
};

export const ICONO_NIVEL = {
  reportado: CircleDashed,
  'en-confirmacion': HourglassMedium,
  confirmado: UsersThree,
  oficial: SealCheck,
};

export const ICONO_NAV = { House, Siren, Question, Path, Drop, BookOpen, Users };
