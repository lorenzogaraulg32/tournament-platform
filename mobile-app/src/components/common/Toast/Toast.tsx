import {StyleSheet, Text, View} from "react-native";


type ToastProps =  {
    message: string;
    success: boolean;
}

export default function Toast({message, success} : ToastProps) {
    return (<View
        pointerEvents="none"
        style={[
            styles.toast,
            {
                backgroundColor: success
                    ? "rgba(0,35,21,0.95)"
                    : "#B42318",
                borderColor: success
                    ? "#008F4E"
                    : "#B42318",
            },
        ]}
        accessibilityLiveRegion="polite"
    >
        <Text style={styles.toastText}>
            {message}
        </Text>
    </View>)
}
const styles = StyleSheet.create({

    toast: {
        position: "absolute",
        left: 24,
        right: 24,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.18,
        shadowRadius: 6,
        borderWidth: 1,
    },

    toastText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
})