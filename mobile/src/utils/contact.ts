import { Alert, Linking } from 'react-native';
import { Shop } from '../data/mock';

async function openUrl(url: string, errorMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Não foi possível abrir', errorMessage);
  }
}

export function openShopOnMaps(shop: Shop) {
  const query = encodeURIComponent(`${shop.name}, ${shop.address}, ${shop.city}`);
  return openUrl(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    'Verifique se tem um aplicativo de mapas instalado.',
  );
}

export function openShopWhatsApp(shop: Shop, message = 'Olá! Gostaria de falar com a barbearia.') {
  return openUrl(
    `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`,
    'Verifique se o WhatsApp está instalado.',
  );
}
