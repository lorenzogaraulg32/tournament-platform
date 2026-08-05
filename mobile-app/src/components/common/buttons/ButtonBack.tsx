import {Pressable, StyleSheet} from "react-native";
import {router} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function ButtonBack() {
    return(
        <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Indietro"
            hitSlop={10}
            style={({pressed}) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
            ]}
        >
            <Ionicons
                name="close"
                size={27}
                color="#FFFFFF"
            />
        </Pressable>
    )
}


const styles = StyleSheet.create({
    closeButton: {
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 10,

        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 21,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.45)",
        backgroundColor: "rgba(255, 255, 255, 0.32)",
    },

    closeButtonPressed: {
        opacity: 0.7,
        transform: [
            {
                scale: 0.94,
            },
        ],
    },
})