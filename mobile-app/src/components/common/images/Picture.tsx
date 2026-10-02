import {ImageStyle, StyleProp} from "react-native";
import {Image} from "expo-image";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";
import {Media} from "@/src/services/mediaService";
import {getAuthorizationHeader} from "@/src/services/users/sessionService";
import {useEffect, useState} from "react";

type PictureProps = {
    image?: Media | null;
    style?: StyleProp<ImageStyle>;
    variant: Variant;
};

export default function Picture({
                                    image,
                                    style,
                                    variant
                                }: PictureProps) {

    const {placeholder} = paletteVariants[variant];

    const isRemote = image?.uri.startsWith("http") ?? false;

    const [authorization, setAuthorization] =
        useState<string | null>(null);

    const [hasError, setHasError] =
        useState(false);

    /*
     * Se cambia immagine, permettiamo al componente
     * di provare nuovamente a caricarla.
     */
    useEffect(() => {
        setHasError(false);
    }, [image?.uri]);

    /*
     * Recuperiamo il token solo per immagini remote.
     */
    useEffect(() => {
        if (!isRemote) {
            setAuthorization(null);
            return;
        }

        getAuthorizationHeader()
            .then(setAuthorization)
            .catch(() => setHasError(true));

    }, [isRemote, image?.uri]);

    /*
     * Nessuna immagine oppure errore:
     * mostriamo semplicemente il placeholder.
     */
    if (!image || hasError) {
        return (
            <Image
                source={placeholder}
                style={style}
                contentFit="cover"
            />
        );
    }

    /*
     * Immagine remota ma Authorization ancora
     * non disponibile.
     *
     * Possiamo mostrare il placeholder anche durante
     * questo brevissimo caricamento.
     */
    if (isRemote && !authorization) {
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
            source={{
                uri: image.uri,
                headers:
                    isRemote && authorization
                        ? {Authorization: authorization}
                        : undefined,
            }}
            style={style}
            contentFit="cover"
            cachePolicy="none"
            transition={150}
            onError={() => setHasError(true)}
        />
    );
}