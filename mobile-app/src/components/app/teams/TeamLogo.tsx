import {useEffect, useMemo, useState} from "react";
import {ImageStyle, StyleProp,} from "react-native";
import {Image} from "expo-image";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const placeholderLogo = require("../../../../assets/images/teamPlaceholders/logoPlaceholder.webp");

type TeamLogoProps = {
    logoUrl?: string | null;
    style?: StyleProp<ImageStyle>;
};

export default function TeamLogo({
                                     logoUrl,
                                     style,
                                 }: TeamLogoProps) {
    const [authorization, setAuthorization] =
        useState<string | null>(null);

    const [hasError, setHasError] =
        useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadAuthorization() {
            const accessToken =
                await SecureStore.getItemAsync(
                    "accessToken"
                );

            const tokenType =
                await SecureStore.getItemAsync(
                    "tokenType"
                );

            if (!isMounted) {
                return;
            }

            if (!accessToken) {
                setAuthorization(null);
                return;
            }

            setAuthorization(
                `${tokenType ?? "Bearer"} ${accessToken}`
            );
        }

        void loadAuthorization();

        return () => {
            isMounted = false;
        };
    }, []);

    /*
     * Quando cambia il logo, permettiamo un nuovo
     * tentativo di caricamento.
     */
    useEffect(() => {
        setHasError(false);
    }, [logoUrl]);

    const completeLogoUrl = useMemo(() => {
        if (!logoUrl || !API_URL) {
            return null;
        }

        /*
         * Supporta anche eventuali URL completi futuri,
         * per esempio Firebase Storage.
         */
        if (
            logoUrl.startsWith("http://") ||
            logoUrl.startsWith("https://")
        ) {
            return logoUrl;
        }

        const baseUrl =
            API_URL.replace(/\/+$/, "");

        const relativeUrl =
            logoUrl.replace(/^\/+/, "");

        return `${baseUrl}/${relativeUrl}`;
    }, [logoUrl]);

    const shouldShowPlaceholder =
        !completeLogoUrl ||
        !authorization ||
        hasError;

    if (shouldShowPlaceholder) {
        return (
            <Image
                source={placeholderLogo}
                style={style}
                contentFit="cover"
            />
        );
    }

    return (
        <Image
            source={{
                uri: completeLogoUrl,
                headers: {
                    Authorization: authorization,
                },
            }}
            style={style}
            contentFit="cover"
            cachePolicy="none"
            transition={150}
            onError={(event) => {
                console.error(
                    "Errore caricamento logo:",
                    {
                        url: completeLogoUrl,
                        error: event.error,
                    }
                );

                setHasError(true);
            }}
        />
    );
}