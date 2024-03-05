import isNil from "lodash/isNil";
import { useCallback, useEffect, useMemo, useState } from "react";

type TPositionIP = {
  isCoords: boolean;
  location?: string;
  latitude?: number;
  longitude?: number;
};

type TPositionGPS = {
  errorPosition?: GeolocationPositionError;
  isCoords: boolean;
  location?: string;
  latitude?: number;
  longitude?: number;
};

export type TUseNavigatorResponse = {
  errorPosition?: GeolocationPositionError;
  isCoords: boolean;
  isCoordsGPS: boolean;
  location?: string;
  latitude?: number;
  latitudeGPS?: number;
  longitude?: number;
  longitudeGPS?: number;
};

type TProps = {
  lng: string;
};

type TUseNavigator = (props: TProps) => TUseNavigatorResponse;

export const useNavigator: TUseNavigator = ({ lng }) => {
  const [positionGPS, setPositionGPS] = useState<TPositionGPS>({
    errorPosition: undefined,
    isCoords: false,
    location: undefined,
    longitude: undefined,
    latitude: undefined,
  });
  const [positionIP, setPositionIP] = useState<TPositionIP>({
    isCoords: false,
    location: undefined,
    longitude: undefined,
    latitude: undefined,
  });

  const fetchIPInfo = async (ipAddress: string) => {
    try {
      const response = await fetch(
        `http://ip-api.com/json/${ipAddress}?lang=${lng}`,
      );
      const data = await response.json();
      setPositionIP({
        isCoords: true,
        location: data?.city,
        longitude: data?.lon,
        latitude: data?.lat,
      });
    } catch (error) {
      setPositionIP({
        isCoords: false,
        location: undefined,
        longitude: undefined,
        latitude: undefined,
      });
    }
  };

  const getLocationFromIp = useCallback(async () => {
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip;
      if (!ipAddress) return;
      await fetchIPInfo(ipAddress);
    } catch (error) {
      setPositionIP({
        isCoords: false,
        longitude: undefined,
        latitude: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePositionChange = useCallback((position: GeolocationPosition) => {
    if (
      !isNil(position?.coords?.longitude) &&
      !isNil(position?.coords?.latitude)
    ) {
      setPositionGPS({
        errorPosition: undefined,
        isCoords: true,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
    }
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setPositionGPS({
      errorPosition: error,
      isCoords: false,
      longitude: undefined,
      latitude: undefined,
    });
  }, []);

  useEffect(() => {
    if (positionGPS.isCoords) return;
    getLocationFromIp().then((r) => {});
  }, [getLocationFromIp, positionGPS.isCoords]);

  useEffect(() => {
    navigator?.geolocation?.watchPosition(handlePositionChange, handleError, {
      enableHighAccuracy: false,
    });
  }, [handleError, handlePositionChange]);

  return useMemo(() => {
    return {
      errorPosition: positionGPS?.errorPosition,
      isCoords: positionGPS?.isCoords
        ? positionGPS.isCoords
        : positionIP.isCoords,
      isCoordsGPS: !!positionGPS?.isCoords,
      location: positionIP?.location,
      latitude: positionGPS?.isCoords
        ? positionGPS?.latitude
        : positionIP?.latitude,
      latitudeGPS: positionGPS?.latitude,
      longitude: positionGPS?.isCoords
        ? positionGPS?.longitude
        : positionIP?.longitude,
      longitudeGPS: positionGPS?.longitude,
    };
  }, [
    positionGPS?.errorPosition,
    positionGPS.isCoords,
    positionGPS?.latitude,
    positionGPS?.longitude,
    positionIP.isCoords,
    positionIP?.location,
    positionIP?.latitude,
    positionIP?.longitude,
  ]);
};
