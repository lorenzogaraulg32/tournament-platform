import {Pressable, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type BackButtonProps = {
    onPress: () => void
}


export default function BackButton({onPress}: BackButtonProps) {

    return (
        <Pressable
            onPress={onPress}
            hitSlop={16}
            style={[
                styles.backButton,
            ]}
        >
            <Ionicons
                name="chevron-back"
                size={22}
                color="#FFFFFF"
            />
        </Pressable>
    )


}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",

        left: 0,
        zIndex: 10,

        width: 38,
        height: 38,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 22,

        borderColor: "rgba(255,255,255,0.30)",
        backgroundColor: "rgba(124,124,124,0.6)",
        borderWidth: 5
    },


})