import {useEffect, useMemo, useState} from "react";
import {ImageStyle, StyleProp,} from "react-native";
import {Image} from "expo-image";
import {loadAuthorization} from "@/src/services/authService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const placeholderLogoTeam = require("../../../assets/images/teamPlaceholders/logoPlaceholder.webp");
const placeholderLogoPlayer = require("../../../assets/images/teamPlaceholders/profilePlaceholder.png");


type LogoProps = {
    logoUrl?: string | null;
    style?: StyleProp<ImageStyle>;
    variant: "player" | "team";
};

export default function Logo({
                                 logoUrl,
                                 style,
                                 variant
                             }: LogoProps) {
    const [authorization, setAuthorization] =
        useState<string | null>(null);

    const [hasError, setHasError] =
        useState(false);

    useEffect(() => {

        async function loadAuth() {
            setAuthorization(await loadAuthorization())
        }

        void loadAuth();

    }, []);

    useEffect(() => {
        setHasError(false);
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