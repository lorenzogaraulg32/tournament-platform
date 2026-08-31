import {useEffect, useMemo, useState} from "react";
import {ImageStyle, StyleProp,} from "react-native";
import {Image} from "expo-image";
import {getAuthorizationHeader} from "@/src/services/users/sessionService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const placeholderLogoTeam = require("../../../../assets/images/teamPlaceholders/logoPlaceholder.webp");
const placeholderLogoPlayer = require("../../../../assets/images/teamPlaceholders/profilePlaceholder.png");


type PictureProps = {
    logoUrl?: string | null;
    style?: StyleProp<ImageStyle>;
    variant: "player" | "team";
};

export default function Picture({
                                    logoUrl,
                                    style,
                                    variant
                                }: PictureProps) {
    const [authorization, setAuthorization] =
        useState<string | null>(null);

    const [hasError, setHasError] =
        useState(false);

    useEffect(() => {
        let isMounted = true;

        setHasError(false);

        if (!logoUrl) {
            setAuthorization(null);

            return () => {
                isMounted = false;
            };
        }

        getAuthorizationHeader()
            .then(header => {
                if (isMounted) {
                    setAuthorization(header);
                }
            })
            .catch(error => {
                console.error(
                    "Errore recupero autorizzazione immagine:",
                    error
                );

                if (isMounted) {
                    setHasError(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [logoUrl]);

    const completeLogoUrl = useMemo(() => {
        if (!logoUrl || !API_URL) {
            return null;
        }

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

    const placeholder =
        variant === "team"
            ? placeholderLogoTeam
            : placeholderLogoPlayer;


    if (shouldShowPlaceholder) {
        return (
            <Image
                source={placeholder}
                style={style}
                contentFit="cover"
            />)
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