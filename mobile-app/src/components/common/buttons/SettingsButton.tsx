import {Pressable, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type SettingsButtonProps = {
    onPress: () => void
}


export default function SettingsButton({onPress}: SettingsButtonProps) {

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Modifica profilo"
            hitSlop={10}
            style={({pressed}) => [
                styles.editButton,
                pressed && styles.editButtonPressed,
            ]}
        >
            <Ionicons
                name="settings"
                size={22}
                color="#FFFFFF"
            />
        </Pressable>
    )


}

const styles = StyleSheet.create({
    editButton: {
        width: 45,
        height: 45,

        borderRadius: 25,

        alignItems: "center",
        justifyContent: "center",

        borderColor: "rgba(255,255,255,0.30)",
        backgroundColor: "rgba(124,124,124,0.6)",
        borderWidth: 5
    },

    editButtonPressed: {
        backgroundColor: "rgba(255,255,255,0.20)",
        transform: [{scale: 0.94}],
    },

})