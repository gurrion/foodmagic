import { AdEventType, InterstitialAd, RewardedAd, TestIds } from 'react-native-google-mobile-ads';

// IDs de AdMob - Usa TestIds en desarrollo
const PRODUCTION = false; // Cambiar a true cuando lances a producción

const AD_IDS = {
  BANNER: PRODUCTION
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX' // Tu ID de banner real
    : TestIds.BANNER,
  INTERSTITIAL: PRODUCTION
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX' // Tu ID de interstitial real
    : TestIds.INTERSTITIAL,
  REWARDED: PRODUCTION
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX' // Tu ID de rewarded real
    : TestIds.REWARDED,
};

// Contador para mostrar interstitial cada N búsquedas
let searchCount = 0;
const ADS_PER_SEARCH = 4; // Mostrar anuncio cada 4 búsquedas

export const incrementSearchCount = (): boolean => {
  searchCount++;
  if (searchCount >= ADS_PER_SEARCH) {
    searchCount = 0;
    return true; // Mostrar anuncio
  }
  return false;
};

// Pre-cargar interstitial
let interstitialAd: InterstitialAd | null = null;

export const preloadInterstitial = () => {
  interstitialAd = InterstitialAd.createForAdRequest(AD_IDS.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: false,
  });

  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Interstitial ad loaded');
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    // Pre-cargar el siguiente
    preloadInterstitial();
  });

  interstitialAd.load();
};

// Mostrar interstitial (si está cargado)
export const showInterstitial = async (): Promise<boolean> => {
  if (!interstitialAd || !interstitialAd.loaded) {
    console.log('Interstitial not loaded yet');
    return false;
  }

  try {
    await interstitialAd.show();
    return true;
  } catch (error) {
    console.error('Error showing interstitial:', error);
    return false;
  }
};

// Pre-cargar rewarded ad
let rewardedAd: RewardedAd | null = null;

export const preloadRewarded = () => {
  rewardedAd = RewardedAd.createForAdRequest(AD_IDS.REWARDED, {
    requestNonPersonalizedAdsOnly: false,
  });

  rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Rewarded ad loaded');
  });

  rewardedAd.addAdEventListener(AdEventType.EARNED_REWARD, (reward) => {
    console.log('Reward earned:', reward);
  });

  rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    // Pre-cargar el siguiente
    preloadRewarded();
  });

  rewardedAd.load();
};

// Mostrar rewarded ad
export const showRewarded = async (): Promise<boolean> => {
  if (!rewardedAd || !rewardedAd.loaded) {
    console.log('Rewarded ad not loaded yet');
    return false;
  }

  try {
    await rewardedAd.show();
    return true;
  } catch (error) {
    console.error('Error showing rewarded:', error);
    return false;
  }
};

// Inicializar ads
export const initAds = () => {
  preloadInterstitial();
  preloadRewarded();
};
