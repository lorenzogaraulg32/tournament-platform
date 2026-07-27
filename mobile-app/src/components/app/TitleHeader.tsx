import {Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "@/src/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";

type TitleProps = {
    text: string
    backBtn?: boolean
}

export default function TitleHeader({
                                        text,
                                        backBtn = false,
                                    }: TitleProps) {

    const onPress = () => {
        router.back()
    }

    return (

        <View style={styles.headerContainer}>

            {backBtn && (
                <Pressable
                    onPress={onPress}
                    disabled={!onPress}
                    accessibilityRole="button"
                    accessibilityLabel="Torna indietro"
                    hitSlop={12}
                    android_ripple={{
                        color: "rgba(255, 255, 255, 0.20)",
                    }}
                    style={({pressed}) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed,
                    ]}
                >
                    {({pressed}) => (
                        <Ionicons
                            name="arrow-back"
                            size={25}
                            color={pressed ? "rgba(255, 255, 255, 0.75)" : "#FFFFFF"}
                        />
                    )}
                </Pressable>
            )}
            <Text style={styles.title}>{text}</Text>
        </View>

    )

}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 115,

        paddingTop: 53,
        paddingBottom: 10,
        paddingHorizontal: 22,

        backgroundColor: colors.background,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
    },

    backButton: {
        width: 38,
        height: 38,
        marginRight: 16,
        borderRadius: 21,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.12)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",

        // Necessario per contenere il ripple Android
        overflow: "hidden",
    },

    backButtonPressed: {
        backgroundColor: "rgba(255, 255, 255, 0.24)",
        borderColor: "rgba(255, 255, 255, 0.35)",

        opacity: 0.85,

        transform: [
            {scale: 0.92},
        ],
    },
});