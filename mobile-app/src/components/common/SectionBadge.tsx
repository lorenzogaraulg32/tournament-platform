import { StyleSheet, Text} from "react-native";
import {ImageBackground} from "expo-image";


type CollapsibleSectionBadgeProps = {
    title: string;
};

export default function SectionBadge({
                                         title,
                                     }: CollapsibleSectionBadgeProps) {


    return (
        <ImageBackground
            source={require("../../../assets/images/teaminfoSectionBkg.png")}
            style={styles.container}
            imageStyle={styles.backgroundImage}
        >
            <Text style={styles.badgeTitle}>{title}</Text>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 35,
        justifyContent: "center",
        paddingHorizontal: 18,
        borderRadius: 16,
        overflow: "hidden",
    },
    backgroundImage: {
        borderRadius: 16,
    },


    badgeTitle: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "900",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 3,
    },

});