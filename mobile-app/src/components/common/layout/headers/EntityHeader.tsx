import {ImageBackground, StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/images/Picture";
import {formatLocationLabel} from "@/src/services/common";
import {colors} from "@/src/constants/theme";
import {InvitationCodeBadge} from "@/src/components/common/InvitationCodeBadge";
import {paletteVariants, Variant} from "@/src/constants/palette/PaletteManager";
import {Media} from "@/src/services/media/mediaService";
import {ReactNode} from "react";


type HeaderEntityProps = {
    variant: Variant;
    name: string,
    fullName?: string,
    image: Media | null
    position?: string | null
    email?: string
    invitationCode?: string,
    onRefreshCode?: () => Promise<string | undefined>;

    backBtn?: ReactNode,
    optionsBtn?: ReactNode


};

export const HEADER_ENTITY_HEIGHT = 220

export default function EntityHeader({
                                         variant,
                                         name,
                                         fullName,
                                         image,
                                         position,
                                         email,
                                         invitationCode,
                                         onRefreshCode,
                                         backBtn,
                                         optionsBtn
                                     }: HeaderEntityProps) {

    const config = paletteVariants[variant];


    return (

        <ImageBackground
            source={config.background}
            style={styles.container}
        >
            {backBtn}
            {optionsBtn}

            <View style={styles.imageContainer}>
                <Picture
                    variant={variant}
                    image={image}
                    style={styles.image}
                />
            </View>

            <View style={styles.rightContainer}>
                <Text
                    style={styles.primaryText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.65}
                    ellipsizeMode="tail"
                >
                    {name}
                </Text>

                {fullName ? (
                    <Text style={styles.secondaryText} numberOfLines={1}>
                        {fullName}
                    </Text>
                ) : null}

                {email ? (
                    <Text style={styles.secondaryText} numberOfLines={1}>
                        {email}
                    </Text>
                ) : null}


                {position ? (
                    <Text style={styles.secondaryText} numberOfLines={2}>
                        {formatLocationLabel(position)}
                    </Text>
                ) : null}


                {variant === "profile" ? (
                    <></>
                ) : (
                    <InvitationCodeBadge
                        code={invitationCode}
                        canRefresh={!!onRefreshCode}
                        onRefresh={onRefreshCode}
                    />
                )}
            </View>
        </ImageBackground>
    )
}


const styles = StyleSheet.create({

    container: {
        height: HEADER_ENTITY_HEIGHT,
        paddingHorizontal: 25,
        paddingTop: 45,
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },

    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: "hidden",
        borderWidth: 2.5,
        borderColor: "#FFFFFF",
        backgroundColor: colors.labelSecondary,
    },

    rightContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    image: {
        width: "100%",
        height: "100%",
    },


    primaryText: {
        flexShrink: 1,
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
        maxWidth: "85%",
    },

    secondaryText: {
        color: colors.textOffWhite,
        fontSize: 12,
        lineHeight: 18,
    },


    subscriptionBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.28)",
    },

    subscriptionText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },


});