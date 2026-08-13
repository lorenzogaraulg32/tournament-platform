import {StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";


type AuthHeaderProps = {
    title?: string
    headline: string,
    subtitle: string,
}


export default function AuthHeader({title, headline, subtitle}: AuthHeaderProps) {
    return (
        <View style={styles.introContainer}>
            <View style={styles.logoBox}>
                <Ionicons name="trophy" size={54} color={"#00A85A"}/>
            </View>
            {title &&
                <Text style={[styles.textBase, styles.title]}>{title}</Text>
            }
            <Text style={[styles.textBase, styles.headline]}>{headline}</Text>
            <Text style={[styles.textBase, styles.subtitle]}>{subtitle}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    introContainer: {
        alignItems: "center",
        gap: 10
    },

    textBase: {
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

