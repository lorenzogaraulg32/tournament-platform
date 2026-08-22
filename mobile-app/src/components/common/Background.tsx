import {ReactNode} from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import {colors} from "@/src/constants/theme"

type BackgroundContainerProps = {
    children: ReactNode,
    style?: any
}

export default function Background({children, style}: BackgroundContainerProps) {
    return (

        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>

        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        marginTop: 55,
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 8,
    },
})
