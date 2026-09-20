import {Alert, type AlertButton} from "react-native";
import {router} from "expo-router";

export default function showAlert(
    message: string,
    title: string,
    onRetry?: () => void
) {
    const buttons: AlertButton[] = [];

    if (onRetry) {
        buttons.push({
            text: "Riprova",
            onPress: onRetry,
        });
    }

    buttons.push({
        text: "Annulla",
        style: "cancel",
        onPress: () => router.replace("/(app)/home"),
    });

    Alert.alert(title, message, buttons, {
        cancelable: false,
    });
}