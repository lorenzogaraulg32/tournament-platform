import {StyleSheet, View} from "react-native";

export default function TeamPlayerCardSmall() {
    return (
        <View style={styles.playerCardSmall}></View>
    )
}

const styles = StyleSheet.create({

    playerCardSmall: {
        height: 80,
        width: 62,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D0EBDD",
    },



})
