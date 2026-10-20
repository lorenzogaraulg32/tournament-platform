import {Pressable, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type BackButtonProps = {
    onPress: () => void
    //per il posizionamento, questa flag è false nei form, ma true negli header di entità
    absolute?: boolean
}


export default function BackButton({onPress, absolute}: BackButtonProps) {

    return (
        <Pressable
            onPress={onPress}
            hitSlop={16}
            style={[
                styles.backButton,
                absolute && styles.absolute
            ]}
        >
            <Ionicons
                name="chevron-back"
                size={20}
                color="#FFFFFF"
            />
        </Pressable>
    )


}

const styles = StyleSheet.create({
    backButton: {
        zIndex: 10,
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 22,
        borderColor: "rgba(255,255,255,0.30)",
        backgroundColor: "rgba(124,124,124,0.6)",
        borderWidth: 5
    },

    absolute :{
        position: "absolute",
        top: 50,
        left: 20
    }


})