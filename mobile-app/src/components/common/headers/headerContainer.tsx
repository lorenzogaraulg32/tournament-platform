import {
    ImageBackground,
    ImageSourcePropType,
    StyleSheet,
    View,
} from "react-native";
import {ReactNode} from "react";

type headerProps = {
    children: ReactNode;
    backgroundSource: ImageSourcePropType;
    overlayColor: string;
    borderColor: string;
};

export default function HeaderContainer({
                              children,
                              backgroundSource,
                              overlayColor,
                              borderColor,
                          }: headerProps) {



    return (
        <View style={styles.shadowContainer}>
            <ImageBackground
                source={backgroundSource}
                style={[
                    styles.card,
                    {borderColor},
                ]}
                imageStyle={styles.cardBackground}
                resizeMode="cover"
            >

                <View
                    style={[
                        styles.cardOverlay,
                        {backgroundColor: overlayColor},
                    ]}
                />

                {children}
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    shadowContainer: {
        width: "100%",
        borderRadius: 28,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.16,
        shadowRadius: 9,

        elevation: 5,
    },

    card: {
        minHeight: 120,
        borderRadius: 28,
        overflow: "hidden",
        borderWidth: 1,
    },

    cardBackground: {

        borderRadius: 28,
    },

    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
    },

    verticalSeparator: {
        width: 1,
        height: 76,

        marginHorizontal: 18,

        backgroundColor: "rgba(255, 255, 255, 0.24)",
    },

    textContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    primaryText: {
        color: "#FFFFFF",
        fontSize: 22,
        lineHeight: 27,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    secondaryText: {
        marginTop: 6,

        color: "rgba(255, 255, 255, 0.78)",
        fontSize: 14,
        fontWeight: "400",
    },

    infoBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",

        marginTop: 14,
        paddingHorizontal: 11,
        paddingVertical: 6,

        borderRadius: 18,

        backgroundColor: "rgba(255, 255, 255, 0.14)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",

        gap: 6,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },




});