// Foto optimizada: WebP, tamaño reservado (sin saltos de diseño) y carga diferida.
// Con recorte "movil" usa <picture> para servir una versión vertical en teléfonos.
export default function Foto({ foto, className, prioridad = false, sizes = '(max-width: 700px) 100vw, 50vw' }) {
  const { grande, movil, chica, alt } = foto;
  const carga = {
    loading: prioridad ? 'eager' : 'lazy',
    fetchPriority: prioridad ? 'high' : 'auto',
    decoding: 'async',
  };

  if (movil) {
    return (
      <picture className={className}>
        <source media="(max-width: 700px)" srcSet={movil.src} width={movil.ancho} height={movil.alto} />
        <img src={grande.src} width={grande.ancho} height={grande.alto} alt={alt} {...carga} />
      </picture>
    );
  }

  return (
    <img
      className={className}
      src={grande.src}
      srcSet={`${chica.src} ${chica.ancho}w, ${grande.src} ${grande.ancho}w`}
      sizes={sizes}
      width={grande.ancho}
      height={grande.alto}
      alt={alt}
      {...carga}
    />
  );
}
