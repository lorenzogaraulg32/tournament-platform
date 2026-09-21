import {useEffect, useMemo, useState} from "react";
import {ImageStyle, StyleProp,} from "react-native";
import {Image} from "expo-image";
import {getAuthorizationHeader} from "@/src/services/users/sessionService";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";
import {API_URL} from "@/src/services/common";

type PictureProps = {
    logoUrl?: string | null;
    style?: StyleProp<ImageStyle>;
    variant: Variant;
    local?: boolean
};

export default function Picture({
                                    logoUrl,
                                    style,
                                    variant,
                                    local
                                }: PictureProps) {
    const {palette, placeholder, background} = paletteVariants[variant];

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
        !completeLogoUrl ||
        hasError ||
        (!local && !authorization);


    if (shouldShowPlaceholder) {
        return (
            <Image
                source={placeholder}
                style={style}
                contentFit="cover"
            />
        );
    }

    return (
        <Image
            key={`${local ? "local" : "remote"}:${completeLogoUrl}`}
            source={{
                uri: completeLogoUrl,
                ...(!local && authorization
                    ? {headers: {Authorization: authorization}}
                    : {}),
            }}
            style={style}
            contentFit="cover"
            cachePolicy="none"
            transition={150}
            onError={(event) => {
                console.error("Errore caricamento immagine:", event.error);
                setHasError(true);
            }}
        />
    );
}