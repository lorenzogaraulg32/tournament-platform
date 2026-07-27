import {StyleSheet, Text, View} from "react-native";
import {colors} from "@/src/constants/theme"

type TitleProps = {
    text: String
}

export default function TitleHeader({text}: TitleProps) {

    return (

        <View style={styles.headerContainer}>
            <Text style={styles.title}>{text}</Text>
        </View>

    )

}


const styles = StyleSheet.create({
    title: {
        marginTop: 34,
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
    },
    headerContainer: {
        flex: 1,
        flexDirection: "column",
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 24,
        maxHeight: 115,
        justifyContent: "center",
 backgroundColor: colors.background
    }

})