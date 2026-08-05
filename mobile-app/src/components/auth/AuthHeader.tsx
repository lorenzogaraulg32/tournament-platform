import {StyleSheet, Text, View} from "react-native";
import AuthLogoBox from "@/src/components/auth/AuthLogoBox";


type AuthHeaderProps = {
    title: string
    headline: string,
    subtitle: string,
}


export default function AuthHeader({title, headline, subtitle}: AuthHeaderProps) {
    return (
        <View style={styles.introContainer}>
            <AuthLogoBox/>
            <Text style={[styles.textBase, styles.title]}>{title}</Text>
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

    }
})

