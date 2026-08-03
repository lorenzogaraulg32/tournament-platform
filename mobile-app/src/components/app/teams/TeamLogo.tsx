import {useEffect, useState} from "react";
import {type StyleProp} from "react-native";
import {Image, type ImageStyle} from "expo-image";

const DEFAULT_TEAM_LOGO = require("../../../../assets/images/teamPlaceholders/logoPlaceholder.webp");

type TeamLogoProps = {
    logoUrl?: string | null;
    style?: StyleProp<ImageStyle>;
};


export default function TeamLogo({logoUrl, style}: TeamLogoProps) {

    const [logoLoadFailed, setLogoLoadFailed] = useState(false)

    //al cambio di logoUrl riprovo il caricamento
    useEffect(() => {
        setLogoLoadFailed(false)
    }, [logoUrl]);


    const canLoadRemoteLogo = Boolean(logoUrl?.trim()) && !logoLoadFailed;

    return (
        <Image
            source={
                canLoadRemoteLogo
                    ? {uri: logoUrl}
                    : DEFAULT_TEAM_LOGO
            }
            style={style}
            onError={() => setLogoLoadFailed(true)}
        />
    );
}