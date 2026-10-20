import { useState } from 'react';
import { Eye, Prohibit } from '@phosphor-icons/react';
import { useDatos } from '../../context/DatosContext.jsx';
import css from './VotoBotones.module.css';

// "Yo también lo veo" / "Esto es falso". La regla real (un voto por persona,
// nadie vota lo propio) la impone la base de datos; aquí solo se explica.
export default function VotoBotones({ alerta }) {
  const { votar, misVotos } = useDatos();
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const miVoto = misVotos[alerta.id];

  let bloqueo = null;
  if (alerta.esMio) bloqueo = 'Es tu reporte: espera a que otros vecinos lo confirmen.';
  else if (miVoto === 'confirma') bloqueo = 'Ya lo confirmaste. Gracias por avisar.';
  else if (miVoto === 'falso') bloqueo = 'Marcaste que es falso.';

  const enviar = async (voto) => {
    setEnviando(true);
    const error = await votar(alerta.id, voto);
    setEnviando(false);
    setMensaje(error ?? '');
  };

  return (
    <div className={css.votos}>
      <div className={css.botones}>
        <button
          type="button"
          className="btn btn-comunidad btn-chico"
          disabled={Boolean(bloqueo) || enviando}
          onClick={() => enviar('confirma')}
        >
          <Eye weight="bold" aria-hidden="true" />
          Yo también lo veo
        </button>
        <button
          type="button"
          className="btn btn-fantasma btn-chico"
          disabled={Boolean(bloqueo) || enviando}
          onClick={() => enviar('falso')}
        >
          <Prohibit weight="bold" aria-hidden="true" />
          Esto es falso
        </button>
      </div>
      <p className={css.estado} role="status">
        {mensaje || bloqueo}
      </p>
    </div>
  );
}
