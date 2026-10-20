import { lazy } from 'react';
import { Route, Switch } from 'wouter';
import Layout from './components/layout/Layout.jsx';
import Inicio from './pages/Inicio.jsx';

// El inicio carga de inmediato; el resto de páginas se descarga al visitarlas.
const Alertas = lazy(() => import('./pages/Alertas.jsx'));
const Reportar = lazy(() => import('./pages/Reportar.jsx'));
const ComoFunciona = lazy(() => import('./pages/ComoFunciona.jsx'));
const Traslados = lazy(() => import('./pages/Traslados.jsx'));
const Agua = lazy(() => import('./pages/Agua.jsx'));
const Aprende = lazy(() => import('./pages/Aprende.jsx'));
const Nosotros = lazy(() => import('./pages/Nosotros.jsx'));
const Moderar = lazy(() => import('./pages/Moderar.jsx'));
const NoEncontrada = lazy(() => import('./pages/NoEncontrada.jsx'));

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Inicio} />
        <Route path="/alertas" component={Alertas} />
        <Route path="/reportar" component={Reportar} />
        <Route path="/como-funciona" component={ComoFunciona} />
        <Route path="/traslados" component={Traslados} />
        <Route path="/agua" component={Agua} />
        <Route path="/aprende" component={Aprende} />
        <Route path="/nosotros" component={Nosotros} />
        <Route path="/moderar" component={Moderar} />
        <Route component={NoEncontrada} />
      </Switch>
    </Layout>
  );
}
