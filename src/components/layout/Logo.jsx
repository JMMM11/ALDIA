import css from './Logo.module.css';

// Logo horizontal del manual de marca (svg/logo-horizontal-*.svg), recortado a
// su contenido. Las letras y el símbolo toman currentColor: verde profundo sobre
// hueso y blanco hueso sobre fotos oscuras. El punto coral nunca cambia.
export default function Logo() {
  return (
    <svg viewBox="420 240 8390 1720" className={css.logo} role="img" aria-label="FLUYA">
      <g transform="translate(200 200)" fill="currentColor">
        <g transform="scale(18.0)">
          <path
            d="M20 10 C20 38 50 40 50 62 M80 10 C80 38 50 40 50 62 M50 58 L50 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="17" r="8.7" fill="#D9785B" />
        </g>
        <g transform="translate(2180 180)">
          <path transform="translate(0 1440) scale(1 -1)" d="M140 0V1440H1020V1168H412V856H900V584H412V0Z" />
          <path transform="translate(1120 1440) scale(1 -1)" d="M160 0V1440H432V254H1052V0Z" />
          <path
            transform="translate(2262 1440) scale(1 -1)"
            d="M726 -30Q552 -30 420.0 40.5Q288 111 214.0 239.0Q140 367 140 540V1438L416 1440V542Q416 471 440.0 413.0Q464 355 506.5 313.0Q549 271 605.5 248.5Q662 226 726 226Q792 226 848.5 249.0Q905 272 947.0 314.0Q989 356 1012.5 414.0Q1036 472 1036 542V1440H1312V540Q1312 367 1238.0 239.0Q1164 111 1032.0 40.5Q900 -30 726 -30Z"
          />
          <path
            d="M3944 0 C3944 380 4404 470 4404 900 M4864 0 C4864 380 4404 470 4404 900 M4404 880 L4404 1440"
            fill="none"
            stroke="currentColor"
            strokeWidth="272"
            strokeLinejoin="round"
          />
          <path
            transform="translate(5094 1440) scale(1 -1)"
            d="M40 0 480 1440H886L1326 0H1046L654 1270H706L320 0ZM304 300V554H1064V300Z"
          />
        </g>
      </g>
    </svg>
  );
}
