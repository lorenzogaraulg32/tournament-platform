import {ReactNode} from "react";
import {ScrollView, StyleSheet, View,} from "react-native";

import {colors} from "@/src/constants/theme";

type EntityLayoutProps = {
    header: ReactNode;
    children: ReactNode;
};


export default function EntityLayout({
                                         header,
                                         children
                                     }: EntityLayoutProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}
            >
                {header}
                <View style={styles.content}>
                    {children}
                </View>
            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        flexGrow: 1,

        backgroundColor: "#F8FAF9",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: "hidden",

        marginTop: -30,
        zIndex: 1,
        gap: 20,

    },


});