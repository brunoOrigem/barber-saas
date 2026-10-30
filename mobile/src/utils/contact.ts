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

const INSTAGRAM_HANDLE_PATTERN = /^[a-z0-9._]{1,30}$/;

/**
 * Aceita "@handle", "handle" ou a URL do perfil (instagram.com/handle, com ou sem
 * protocolo/www) e devolve o handle normalizado, ou null se for inválido.
 */
export function parseInstagramHandle(input: string): string | null {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([^/?#]+)/i);
  const handle = (fromUrl ? fromUrl[1] : trimmed).replace(/^@/, '').toLowerCase();
  return INSTAGRAM_HANDLE_PATTERN.test(handle) ? handle : null;
}

export function getInstagramProfileUrl(handle: string) {
  return `https://instagram.com/${handle}`;
}

export async function openInstagramProfile(handle: string) {
  // Tenta o app nativo; se não estiver instalado o openURL rejeita e caímos no navegador.
  try {
    await Linking.openURL(`instagram://user?username=${handle}`);
  } catch {
    await openUrl(getInstagramProfileUrl(handle), 'Não foi possível abrir o perfil do Instagram.');
  }
}
