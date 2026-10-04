import type { Translations } from './en';

/** Typed against `en`, so a missing or extra key fails `npm run typecheck`. */
export const es: Translations = {
  common: {
    retry: 'Reintentar',
    somethingWentWrong: 'Algo salió mal.',
  },
  signIn: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para continuar',
    username: 'Usuario',
    password: 'Contraseña',
    submit: 'Iniciar sesión',
    demoHint: 'Cuenta de prueba: {{username}} / {{password}}',
    invalidCredentials: 'Usuario o contraseña incorrectos.',
  },
  tabs: {
    products: 'Productos',
    profile: 'Perfil',
    settings: 'Ajustes',
  },
  products: {
    empty: 'No se encontraron productos.',
    rating: '★ {{rating}}',
    inStock: '{{count}} en stock',
  },
  profile: {
    signOut: 'Cerrar sesión',
  },
  settings: {
    appearance: 'Apariencia',
    language: 'Idioma',
    theme: {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Oscuro',
    },
    languages: {
      system: 'Sistema',
      en: 'English',
      es: 'Español',
    },
  },
  notFound: {
    title: 'Esta pantalla no existe.',
    goHome: 'Ir a la pantalla de inicio',
  },
};
