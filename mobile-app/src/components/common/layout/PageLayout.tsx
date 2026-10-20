import {ReactNode} from "react";
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from "react-native";

import {colors} from "@/src/constants/theme"

type PageLayoutProps = {
    header: ReactNode,
    children: ReactNode,
}

export default function PageLayout({
                                       header,
                                       children,
                                   }: PageLayoutProps) {
    return (
        <View style={styles.container}>
                {header}
            <View style={styles.scrollContainer}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },


    scrollContainer: {
        //Questo margine serve per coprire i buchi lasciati dagli angoli arrotondati
        marginTop: -30,
        flex: 1,
    },

    scroll: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },

    scrollContent: {
        flexGrow: 1,
        backgroundColor: "#F8FAF9",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
        overflow: "hidden",
    },

});
