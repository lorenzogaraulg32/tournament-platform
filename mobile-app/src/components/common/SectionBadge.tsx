import {Pressable, StyleSheet, Text} from "react-native";
import {ImageBackground} from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";


type CollapsibleSectionBadgeProps = {
    title: string
    src: string
    collapsed: boolean
    onPress: () => void
};

export default function SectionBadge({
                                         title,
                                         src,
                                         collapsed,
                                         onPress
                                     }: CollapsibleSectionBadgeProps) {


    return (
        <ImageBackground
            source={src}
            style={styles.container}
            imageStyle={styles.backgroundImage}
        >
            <Text style={styles.badgeTitle}>{title}</Text>
            <Pressable onPress={onPress}>
                <Ionicons
                    name={collapsed ? "chevron-down" : "chevron-up"}
                    size={22}
                    color="#FFFFFF"
                />
            </Pressable>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 35,
        justifyContent: "space-between",
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