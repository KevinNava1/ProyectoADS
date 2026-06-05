import { ImageSourcePropType } from 'react-native';

/**
 * Pictogramas OFICIALES de cada estación de la Línea 1.
 *
 * Se extrajeron del mapa oficial vectorial de Metrobús (PDF de Movilidad
 * Integrada CDMX, 2025) como siluetas blancas con transparencia, para poder
 * teñir el mosaico con el color de afluencia (verde/ámbar/rojo) sin perder el
 * ícono real. El mapeo está en el mismo orden norte→sur que `ESTACIONES_L1`.
 */
export const ESTACION_ICONOS: Record<string, ImageSourcePropType> = {
  'indios-verdes': require('../../assets/estaciones/indios-verdes.png'),
  'deportivo-18-marzo': require('../../assets/estaciones/deportivo-18-marzo.png'),
  euzkaro: require('../../assets/estaciones/euzkaro.png'),
  potrero: require('../../assets/estaciones/potrero.png'),
  'la-raza': require('../../assets/estaciones/la-raza.png'),
  circuito: require('../../assets/estaciones/circuito.png'),
  'san-simon': require('../../assets/estaciones/san-simon.png'),
  'manuel-gonzalez': require('../../assets/estaciones/manuel-gonzalez.png'),
  buenavista: require('../../assets/estaciones/buenavista.png'),
  'el-chopo': require('../../assets/estaciones/el-chopo.png'),
  revolucion: require('../../assets/estaciones/revolucion.png'),
  'plaza-republica': require('../../assets/estaciones/plaza-republica.png'),
  reforma: require('../../assets/estaciones/reforma.png'),
  hamburgo: require('../../assets/estaciones/hamburgo.png'),
  insurgentes: require('../../assets/estaciones/insurgentes.png'),
  durango: require('../../assets/estaciones/durango.png'),
  'alvaro-obregon': require('../../assets/estaciones/alvaro-obregon.png'),
  sonora: require('../../assets/estaciones/sonora.png'),
  campeche: require('../../assets/estaciones/campeche.png'),
  chilpancingo: require('../../assets/estaciones/chilpancingo.png'),
  'nuevo-leon': require('../../assets/estaciones/nuevo-leon.png'),
  'la-piedad': require('../../assets/estaciones/la-piedad.png'),
  poliforum: require('../../assets/estaciones/poliforum.png'),
  napoles: require('../../assets/estaciones/napoles.png'),
  'colonia-del-valle': require('../../assets/estaciones/colonia-del-valle.png'),
  'ciudad-deportes': require('../../assets/estaciones/ciudad-deportes.png'),
  'parque-hundido': require('../../assets/estaciones/parque-hundido.png'),
  'felix-cuevas': require('../../assets/estaciones/felix-cuevas.png'),
  'rio-churubusco': require('../../assets/estaciones/rio-churubusco.png'),
  'teatro-insurgentes': require('../../assets/estaciones/teatro-insurgentes.png'),
  'jose-maria-velasco': require('../../assets/estaciones/jose-maria-velasco.png'),
  francia: require('../../assets/estaciones/francia.png'),
  olivo: require('../../assets/estaciones/olivo.png'),
  altavista: require('../../assets/estaciones/altavista.png'),
  'la-bombilla': require('../../assets/estaciones/la-bombilla.png'),
  'doctor-galvez': require('../../assets/estaciones/doctor-galvez.png'),
  'ciudad-universitaria': require('../../assets/estaciones/ciudad-universitaria.png'),
  ccu: require('../../assets/estaciones/ccu.png'),
  perisur: require('../../assets/estaciones/perisur.png'),
  'villa-olimpica': require('../../assets/estaciones/villa-olimpica.png'),
  corregidora: require('../../assets/estaciones/corregidora.png'),
  ayuntamiento: require('../../assets/estaciones/ayuntamiento.png'),
  'fuentes-brotantes': require('../../assets/estaciones/fuentes-brotantes.png'),
  'santa-ursula': require('../../assets/estaciones/santa-ursula.png'),
  'la-joya': require('../../assets/estaciones/la-joya.png'),
  'el-caminero': require('../../assets/estaciones/el-caminero.png'),
};

/** Devuelve el pictograma de una estación (o undefined si no existe). */
export function iconoEstacion(id: string): ImageSourcePropType | undefined {
  return ESTACION_ICONOS[id];
}
