import {StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";


type AuthHeaderProps = {
    title?: string
    headline: string,
    subtitle: string,
}

/**
 * Header usato nelle sezioni di autenticazione
 * @param title
 * @param headline
 * @param subtitle
 * @constructor
 */

export default function AuthHeader({title, headline, subtitle}: AuthHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.logoBox}>
                <Ionicons name="trophy" size={54} color={"#00A85A"}/>
            </View>
            {title &&
                <Text style={[styles.text, styles.title]}>{title}</Text>
            }
            <Text style={[styles.text, styles.headline]}>{headline}</Text>
            <Text style={[styles.text, styles.subtitle]}>{subtitle}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 10
    },

    text: {
        textAlign: "center",
        maxWidth: 310,
    },


    title: {
        color: "#ffffff",
        fontSize: 48,
        fontWeight: 800,
        letterSpacing: -1
    },

    headline: {
        color: "#D8F5E3",
        fontSize: 24,
        fontWeight: 700,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 25,
        fontWeight: 400,
        color: "#F2FFF8",

    },

    logoBox: {
        width: 104,
        height: 104,
        borderRadius: 32,
        backgroundColor: "#ffffff",
        shadowColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.22,
        shadowRadius: 18,
        elevation: 10,
    },
})

