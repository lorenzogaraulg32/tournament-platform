import {colors} from "@/src/constants/theme";
import {StyleSheet, View} from "react-native";


export function HorizontalSeparator() {
    return (
        <View style={[
            styles.horizontalSeparator,
            {
                backgroundColor: colors.textOffWhite
            }
        ]}>
        </View>
    )

}

const styles = StyleSheet.create({

    horizontalSeparator: {
        width: "100%",
        height: 1,
        borderRadius: 10,
    }

});