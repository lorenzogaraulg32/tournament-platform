import {ReactNode} from "react";
import {ScrollView, StyleSheet, View,} from "react-native";

type EntityLayoutProps = {
    header: ReactNode;
    tabs?: ReactNode
    children: ReactNode;
};


export default function EntityLayout({
                                         header,
                                         tabs,
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
                {tabs}
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
        backgroundColor: "#fff",
    },

    content: {
        flexGrow: 1,

        backgroundColor: "#F8FAF9",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
        overflow: "hidden",

        zIndex: 1,
        gap: 20,

    },


});