import {StyleSheet, View} from "react-native";
import LogoBox from "@/src/components/auth/LogoBox";
import AuthText from "@/src/components/auth/AuthText";
import {colors, fontWeights} from "@/src/constants/theme";


type AuthHeaderProps = {
    title: string
    headline: string,
    subtitle: string,
}


export default function AuthHeader({title, headline, subtitle}: AuthHeaderProps) {
    return (
        <View style={styles.introContainer}>
            <LogoBox/>
            <AuthText variant={"title"} style={styles.title} text={title}/>
            <AuthText variant={"subtitle"} style={styles.headline} text={headline}/>
            <AuthText variant={"body"} style={styles.subtitle} text={subtitle}/>
        </View>
    );
}


const styles = StyleSheet.create({
    introContainer: {
        alignItems: "center",
        gap: 10
    },

    title: {
        color: colors.textPrimary,
        fontSize: 48,
        letterSpacing: -1,
        fontWeight: fontWeights.extraBold
    },

    headline: {
        textAlign: "center",
        color: colors.textThird
    },

    subtitle: {
        fontSize: 17,
        lineHeight: 25,
        color: colors.textSecondary,
        textAlign: "center",
        maxWidth: 310,
    }
})

