import {Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "@/src/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";

type TitleProps = {
    text: string,
    backBtn?: boolean,
    optionsBtn?: boolean,
    onOptionsPress?: () => void
}

export default function HeaderMain({
                                       text,
                                       backBtn = false,
                                       optionsBtn,
                                       onOptionsPress
                                   }: TitleProps) {

    const onBackPress = () => {
        router.back()
    }

    return (

        <View style={styles.headerContainer}>

            {backBtn && (
                <Pressable
                    onPress={onBackPress}
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


            {optionsBtn && (
                <Pressable
                    onPress={onOptionsPress}
                    accessibilityRole="button"
                    accessibilityLabel="Modifica"
                    hitSlop={12}
                    android_ripple={{
                        color: "rgba(255, 255, 255, 0.20)",
                    }}
                    style={({pressed}) => [
                        styles.optionsBtn,
                        pressed && styles.onOptionsPressed,
                    ]}
                >
                    {({pressed}) => (
                        <Ionicons
                            name="ellipsis-horizontal"
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


        paddingTop: 55,
        paddingBottom: 12,
        paddingHorizontal: 22,

        backgroundColor: colors.background,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 26,
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

    optionsBtn: {
        position: "absolute",
        right: 22,
        top: 55,
        width: 38,
        height: 38,

        borderRadius: 21,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.12)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",

        overflow: "hidden",
    },

    onOptionsPressed: {
        backgroundColor: "rgba(255, 255, 255, 0.24)",
        borderColor: "rgba(255, 255, 255, 0.35)",

        opacity: 0.85,

        transform: [
            {scale: 0.92},
        ],
    },
});