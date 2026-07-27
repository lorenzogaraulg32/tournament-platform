import {ReactNode} from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import TitleApp from "@/src/components/app/TitleHeader";

type BackgroundContainerProps = {
    children: ReactNode,
    headerText: String
}

export default function Background({children, headerText}: BackgroundContainerProps) {
    return (

            <View style={styles.container}>
                <TitleApp text={headerText}/>
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
        backgroundColor: "#ffffff"
    },
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingVertical: 15
    },
})
