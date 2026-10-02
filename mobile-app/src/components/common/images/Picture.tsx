import {ImageStyle, StyleProp,} from "react-native";
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
                                    variant,
                                }: PictureProps) {

    const {placeholder} = paletteVariants[variant];

    const isRemote = image?.uri.startsWith("http");

    const [authorization, setAuthorization] = useState<string | null>(null);

    useEffect(() => {
        if (!isRemote) {
            return;
        }

        getAuthorizationHeader()
            .then(setAuthorization)
            .catch(() => setAuthorization(null));
    }, [isRemote]);

    if (!image) {
        return (
            <Image
                source={placeholder}
                style={style}
                contentFit="cover"
            />
        );
    }

    if (isRemote && !authorization) {
        return null;
    }

    return (
        <Image
            source={{
                uri: image.uri,
                headers: isRemote && authorization
                    ? {Authorization: authorization}
                    : undefined,
            }}
            style={style}
            contentFit="cover"
            cachePolicy="none"
            transition={150}
        />
    );
}