/** Tipados de navegación (react-navigation). */

export type RootStackParamList = {
  Tabs: undefined;
  DetalleEstacion: { estacionId: string };
};

export type TabParamList = {
  Inicio: undefined;
  Mapa: undefined;
  Ajustes: undefined;
};
