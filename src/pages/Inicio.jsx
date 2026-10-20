import Hero from '../components/inicio/Hero.jsx';
import IdeaClave from '../components/inicio/IdeaClave.jsx';
import AlertasRecientes from '../components/inicio/AlertasRecientes.jsx';
import SemaforoPasos from '../components/inicio/SemaforoPasos.jsx';
import Servicios from '../components/inicio/Servicios.jsx';
import Escenarios from '../components/inicio/Escenarios.jsx';

export default function Inicio() {
  return (
    <>
      <Hero />
      <IdeaClave />
      <AlertasRecientes />
      <SemaforoPasos />
      <Servicios />
      <Escenarios />
    </>
  );
}
