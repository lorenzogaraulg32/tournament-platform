import {StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";


export default function LogoBox() {
    return (
        <View style={styles.logoBox}>
            <Ionicons name="trophy" size={54} color={colors.logoIcon}/>
        </View>
    )
}

const styles = StyleSheet.create({
    logoBox: {
        width: 104,
        height: 104,
        borderRadius: 32,
        backgroundColor: colors.surfacePrimary,
        shadowColor: colors.shadow,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.22,
        shadowRadius: 18,
        elevation: 10,
    },
})