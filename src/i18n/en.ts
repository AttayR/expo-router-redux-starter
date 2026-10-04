export const en = {
  common: {
    retry: 'Try again',
    somethingWentWrong: 'Something went wrong.',
  },
  signIn: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue',
    username: 'Username',
    password: 'Password',
    submit: 'Sign in',
    demoHint: 'Demo account: {{username}} / {{password}}',
    invalidCredentials: 'Invalid username or password.',
  },
  tabs: {
    products: 'Products',
    profile: 'Profile',
    settings: 'Settings',
  },
  products: {
    empty: 'No products found.',
    rating: '★ {{rating}}',
    inStock: '{{count}} in stock',
  },
  profile: {
    signOut: 'Sign out',
  },
  settings: {
    appearance: 'Appearance',
    language: 'Language',
    theme: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
    },
    languages: {
      system: 'System',
      en: 'English',
      es: 'Español',
    },
  },
  notFound: {
    title: 'This screen does not exist.',
    goHome: 'Go to the home screen',
  },
};

export type Translations = typeof en;
