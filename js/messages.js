/**
 * ============================================================
 *  MENSAJES PERSONALIZADOS — edita libremente este archivo
 * ============================================================
 * Cada objeto de la lista representa UN girasol clicable en la
 * galaxia. Hay exactamente uno por cada imagen disponible en
 * assets/flores/ (sin repetir ninguna). Puedes:
 *   - Cambiar "title" y "message" por tu propio texto.
 *   - Cambiar "image" por cualquier archivo dentro de assets/flores/
 *   - Agregar más objetos si agregas nuevas imágenes a esa carpeta.
 *
 * "image" acepta cualquier ruta a un PNG con fondo transparente.
 * Si un mensaje es largo no hay problema: el modal tiene su propio
 * scroll interno, así que nunca se estira de más.
 * ============================================================
 */

const GALAXY_MESSAGES = [
  {
    image: "assets/flores/flor-1.png",
    title: "Desde que nos conocimos",
    message:
      "María, desde que nos conocimos jugando Valorant, nunca imaginé lo mucho que ibas a llegar a significar para mí. Entre partidas, conversaciones y momentos compartidos, poco a poco fuimos construyendo algo que se volvió muy especial para mí. Hoy, después de todo lo que ha pasado, me hace muy feliz volver a tenerte en mi vida y compartir cada día contigo."
  },
  {
    image: "assets/flores/flor-2.png",
    title: "La forma en que me entiendes",
    message:
      "Te amo muchísimo y hay algo que valoro especialmente de ti: la manera en que me entiendes. Me haces sentir escuchado, comprendido y querido de una forma que significa muchísimo para mí. Eres una mujer increíble, inteligente, auténtica y con una personalidad que adoro. Me encanta escucharte, conocer lo que piensas, ver tus fotos durante el día, recibir tus audios, tus mensajes y esos pequeños detalles que me hacen sentir cerca de ti, incluso cuando estamos lejos."
  },
  {
    image: "assets/flores/flor-3.png",
    title: "Nuestro día a día",
    message:
      "Me encanta que podamos compartir nuestro día juntos, aunque sea a la distancia. Hablar todos los días, llamarnos, escribirnos, mandarnos reels, TikToks, y simplemente saber qué está haciendo el otro. Se ha vuelto una parte muy bonita de mi vida. Me gusta estar para ti, escucharte y prestarte atención, porque actualmente eres una persona muy importante para mí y disfruto muchísimo poder compartir mi tiempo contigo."
  },
  {
    image: "assets/flores/flor-4.png",
    title: "Deseo que cumplas tus sueños",
    message:
      "Deseo de corazón que todos tus sueños y objetivos se cumplan. Sé que tienes muchísimo potencial. Y estoy seguro de que puedes llegar muy lejos en todo lo que te propongas. Sería un honor poder estar a tu lado, celebrar tus logros contigo y algún día verte convertida en la mujer exitosa e increíble que sé que puedes ser."
  },
  {
    image: "assets/flores/flor-5.png",
    title: "Cuando pienso en nosotros",
    message:
      "Cuando pienso en nosotros, me ilusiona imaginar el día en que podamos vivir juntos. Despertar uno al lado del otro, viajar, jugar videojuegos, dormir juntos, construir nuestro hogar y compartir una vida llena de momentos que ni siquiera nos imaginamos todavía. Incluso soñar con cosas grandes, como casarnos y tener hijos, me saca una sonrisa, porque cuando pienso en el futuro, muchas veces te imagino a ti formando parte de él.",
    // Esta imagen es más alargada que las demás; se agranda un poco
    // para que se vea igual de protagonista que el resto.
    scale: 1.4
  },
  {
    image: "assets/flores/flor-6.png",
    title: "Nuestra historia, aunque corta",
    message:
      "Quizás nuestra historia todavía sea corta, pero lo que siento por ti es muy grande. Después de todo el tiempo que estuvimos separados, pude darme cuenta de cuánto te amaba y cuánto te extrañaba. Por eso ahora que estamos nuevamente juntos, quiero disfrutar cada momento contigo y darte todo el cariño y amor que siento por ti."
  }
];

// Mensaje que aparece en el centro de la galaxia al tocar la flor principal.
const GALAXY_CORE_MESSAGE = {
  title: "Lo que representan estas flores",
  message:
    "Confío muchísimo en ti y en lo que estamos construyendo juntos. Y estas flores amarillas son mi forma de regalarte un pedacito de todo ese amor. Por ahora son digitales, pero las hice pensando en ti, con mi cariño, porque quería tener un detalle bonito contigo y recordarte lo especial que eres para mí. Espero algún día poder entregarte flores de verdad, tenerte frente a mí y darte ese abrazo que tanto hemos imaginado. Hasta entonces, quiero que estas flores representen todo lo que siento por ti: mi amor, mi cariño y mis ganas de seguir compartiendo mi vida contigo."
};
