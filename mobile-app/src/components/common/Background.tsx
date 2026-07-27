import {ReactNode} from "react";
import {ScrollView, StyleSheet, View} from "react-native";

type BackgroundContainerProps = {
    children: ReactNode,
    header: ReactNode
}

export default function Background({children, header}: BackgroundContainerProps) {
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
        backgroundColor: "#ffffff"
    },
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 8,
        paddingVertical: 15
    },
})
