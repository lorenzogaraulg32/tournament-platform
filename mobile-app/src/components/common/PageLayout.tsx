import {ReactNode} from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";

import {colors} from "@/src/constants/theme"

type PageLayoutProps = {
    header: ReactNode,
    children: ReactNode,
    headerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}

export default function PageLayout({
                                       header,
                                       children,
                                       headerStyle,
                                       contentStyle
                                   }: PageLayoutProps) {
    return (
        <View style={styles.container}>

            <View style={[styles.header, headerStyle]}>
                {header}
            </View>

            <View style={[styles.content, contentStyle]}>
                {children}
            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        minHeight: 180,
    },

    content: {
        flex: 1,

        marginTop: -24,


        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,

        backgroundColor: "#F8FAF9",

        paddingTop: 22,
        paddingHorizontal: 18,

        overflow: "hidden",
    },

});
