import {ReactNode} from "react";
import {StyleSheet, View} from "react-native";

type BeachVolleyFieldProps = {
    children?: ReactNode;
};

export default function BeachVolleyField({
    children,
}: BeachVolleyFieldProps) {
    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <View pointerEvents="none" style={styles.decoration}>
                    <View style={styles.reflection}/>

                    <View style={styles.court}>
                        <View style={styles.net}>
                            <View style={styles.netLine}/>
                        </View>

                        <View style={[styles.netPost, styles.leftPost]}/>
                        <View style={[styles.netPost, styles.rightPost]}/>
                    </View>
                </View>

                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    {children}
                </View>
            </View>
        </View>
    );
}

const LINE_COLOR = "rgba(255, 255, 255, 0.50)";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 5,
    },

    field: {
        width: "100%",
        aspectRatio: 0.80,
        position: "relative",

        backgroundColor: "rgba(210, 165, 80, 0.32)",
        borderColor: "rgba(253, 224, 71, 0.42)",
        borderWidth: 1,
        borderRadius: 22,
        overflow: "hidden",
    },

    decoration: {
        ...StyleSheet.absoluteFill,
    },

    reflection: {
        position: "absolute",
        top: 0,
        left: "8%",
        right: "8%",
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.40)",
    },

    court: {
        position: "absolute",
        top: 16,
        bottom: 16,
        left: 12,
        right: 12,

        borderWidth: 1.5,
        borderColor: LINE_COLOR,
        borderRadius: 3,
    },

    net: {
        position: "absolute",
        top: "20%",
        left: -6,
        right: -6,
        height: 8,
        marginTop: -4,

        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.32)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        justifyContent: "center",
    },

    netLine: {
        height: 1,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.60)",
    },

    netPost: {
        position: "absolute",
        top: "18%",
        width: 4,
        height: 14,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.65)",
    },

    leftPost: {
        left: -3,
    },

    rightPost: {
        right: -3,
    },
});
