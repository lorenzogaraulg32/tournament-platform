import {useEffect, useMemo, useState} from "react";
import {ImageStyle, StyleProp,} from "react-native";
import {Image} from "expo-image";
import {getAuthorizationHeader} from "@/src/services/users/sessionService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const placeholderLogoTeam = require("@/assets/images/placeholders/logoPlaceholder.png");
const placeholderLogoPlayer = require("@/assets/images/placeholders/profilePlaceholder.png");
const placeholderTournamentLogo = require("@/assets/images/placeholders/tournamentPlaceholder.jpg");


type PictureProps = {
    logoUrl?: string | null;
    style?: StyleProp<ImageStyle>;
    variant: "player" | "team" | "tournament";
    local?: boolean
};

export default function Picture({
                                    logoUrl,
                                    style,
                                    variant,
                                    local
                                }: PictureProps) {
    const [authorization, setAuthorization] =
        useState<string | null>(null);

    const [hasError, setHasError] =
        useState(false);

    useEffect(() => {
        let isMounted = true;

        setHasError(false);

        if (!logoUrl || local) {
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
    }, [logoUrl, local]);

    const completeLogoUrl = useMemo(() => {
        if (!logoUrl) {
            return null;
        }

        if (
            local ||
            logoUrl.startsWith("http://") ||
            logoUrl.startsWith("https://")
        ) {
            return logoUrl;
        }

        if (!API_URL) {
            return null;
        }

        const baseUrl = API_URL.replace(/\/+$/, "");
        const relativeUrl = logoUrl.replace(/^\/+/, "");

        return `${baseUrl}/${relativeUrl}`;
    }, [logoUrl, local]);

    const shouldShowPlaceholder =
        !logoUrl ||
        hasError ||
        (!local && (!completeLogoUrl || !authorization));

    const placeholder =
        variant === "team"
            ? placeholderLogoTeam
            : variant == "player" ? placeholderLogoPlayer
                : placeholderTournamentLogo


    function renderPlaceholder() {
        return (
            <Image
                source={placeholder}
                style={style}
                contentFit="cover"
            />
        );
    }

    if (!completeLogoUrl || hasError) {
        return renderPlaceholder();
    }

    if (local) {
        return (
            <Image
                key={`local:${completeLogoUrl}`}
                source={{uri: completeLogoUrl}}
                style={style}
                contentFit="cover"
                cachePolicy="none"
                transition={150}
                onError={(event) => {
                    console.error("Errore caricamento preview:", {
                        url: completeLogoUrl,
                        error: event.error,
                    });

                    setHasError(true);
                }}
            />
        );
    }

    if (!authorization) {
        return renderPlaceholder();
    }

    return (
        <Image
            key={`remote:${completeLogoUrl}`}
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
                console.error("Errore caricamento logo:", {
                    url: completeLogoUrl,
                    error: event.error,
                });

                setHasError(true);
            }}
        />
    );
}