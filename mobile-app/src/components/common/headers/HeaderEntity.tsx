import {StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/images/Picture";
import {formatLocationLabel} from "@/src/services/common";
import {colors} from "@/src/constants/theme";
import {InvitationCodeBadge} from "@/src/components/common/headers/InvitationCodeBadge";


//tod: Inserire i campi che compongono l'header delle entità in quanto sono comuni
type HeaderEntityProps = {
    variant: "player" | "team" | "tournament";
    name: string,
    imageUrl?: string | null
    position?: string | null
    email?: string
    invitationCode?: string,
    onRefreshCode?: () => Promise<string>;
};


export default function HeaderEntity({
                                         variant,
                                         name,
                                         imageUrl,
                                         position,
                                         email,
                                         invitationCode,
                                         onRefreshCode,

                                     }: HeaderEntityProps
) {
    return (


        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Picture
                    variant={variant}
                    logoUrl={imageUrl}
                    style={styles.image}
                />
            </View>

            <View style={styles.rightContainer}>
                <Text
                    style={styles.primaryText}
                    numberOfLines={1}
                >
                    {name}
                </Text>

                {position ? (
                    <Text style={styles.secondaryText} numberOfLines={2}>
                        {formatLocationLabel(position)}
                    </Text>
                ) : null}

                {email ? (
                    <Text style={styles.secondaryText} numberOfLines={1}>
                        {email}
                    </Text>
                ) : null}


                {variant === "player" ? (
                    <View style={styles.subscriptionBadge}>
                        <Text style={styles.subscriptionText}>
                            Piano gratuito
                        </Text>
                    </View>
                ) : (
                    <InvitationCodeBadge
                        code={invitationCode}
                        canRefresh={!!onRefreshCode}
                        onRefresh={onRefreshCode}
                    />
                )}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 25,
        gap: 25,
    },

    feedbackContainer: {
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        gap: 10,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
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
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "800",
    },

    secondaryText: {
        marginTop: 3,
        marginBottom: 12,
        color: colors.textOffWhite,
        fontSize: 12,
    },


    subscriptionBadge: {
        alignSelf: "flex-start",

        marginTop: 10,

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