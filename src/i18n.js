import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          shop: "Shop",
          cart: "Cart",
          language: "Language"
        }
      },
      fr: {
        translation: {
          home: "Accueil",
          shop: "Boutique",
          cart: "Panier",
          language: "Langue"
        }
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
