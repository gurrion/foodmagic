import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const PRODUCTION = false;
const AD_UNIT_ID = PRODUCTION
  ? 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'
  : TestIds.BANNER;

export const AdBanner = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  // Solo mostrar en desarrollo cuando se carga, o siempre en producción
  if (PRODUCTION || isAdLoaded) {
    return (
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={AD_UNIT_ID}
          size={BannerAdSize.ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => setIsAdLoaded(true)}
          onAdFailedToLoad={() => setIsAdLoaded(false)}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
});
