import {ReactNode} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {inspect} from "node:util";
import {colors} from "@/src/constants/theme"

type BackgroundContainerProps = {
    children: ReactNode,
    header?: ReactNode,
    style?: any
}

export default function Background({children, header, style}: BackgroundContainerProps) {
    return (

        <View style={styles.container}>
            {header}
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
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 8,
    },
})
