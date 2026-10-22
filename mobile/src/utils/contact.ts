import { Alert, Linking } from 'react-native';
import { SHOP } from '../data/mock';

async function openUrl(url: string, errorMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Não foi possível abrir', errorMessage);
  }
}

export function openShopOnMaps() {
  const query = encodeURIComponent(`${SHOP.address}, ${SHOP.city}`);
  return openUrl(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    'Verifique se tem um aplicativo de mapas instalado.',
  );
}

export function openShopWhatsApp(message = 'Olá! Gostaria de falar com a barbearia.') {
  return openUrl(
    `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`,
    'Verifique se o WhatsApp está instalado.',
  );
}
