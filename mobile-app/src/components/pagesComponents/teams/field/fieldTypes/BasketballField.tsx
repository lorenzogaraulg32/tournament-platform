import {ReactNode} from "react";
import {StyleSheet, View} from "react-native";

type BasketballFieldProps = {
    children?: ReactNode;
};

export default function BasketballField({
    children,
}: BasketballFieldProps) {
    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <View pointerEvents="none" style={styles.decoration}>
                    <View style={styles.reflection}/>

                    <View style={styles.court}>
                        <View style={styles.halfwayLine}/>

                        <View style={styles.center}>
                            <View style={styles.centerCircle}/>
                            <View style={styles.centerSpot}/>
                        </View>

                        {/* Area superiore */}
                        <View style={[styles.paint, styles.topPaint]}/>
                        <View style={[styles.freeThrowCircle, styles.topFreeThrowCircle]}/>
                        <View style={[styles.backboard, styles.topBackboard]}/>
                        <View style={[styles.rim, styles.topRim]}/>

                        {/* Area inferiore */}
                        <View style={[styles.paint, styles.bottomPaint]}/>
                        <View style={[styles.freeThrowCircle, styles.bottomFreeThrowCircle]}/>
                        <View style={[styles.backboard, styles.bottomBackboard]}/>
                        <View style={[styles.rim, styles.bottomRim]}/>

                        {/* Archi da tre punti stilizzati */}
                        <View style={[styles.threePointArc, styles.topThreePointArc]}/>
                        <View style={[styles.threePointArc, styles.bottomThreePointArc]}/>
                    </View>
                </View>

                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    {children}
                </View>
            </View>
        </View>
    );
}

const LINE_COLOR = "rgba(255, 255, 255, 0.38)";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 5,
    },

    field: {
        width: "100%",
        aspectRatio: 0.80,
        position: "relative",

        backgroundColor: "rgba(180, 96, 35, 0.32)",
        borderColor: "rgba(251, 191, 36, 0.45)",
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

        borderWidth: 1,
        borderColor: LINE_COLOR,
        borderRadius: 3,
        overflow: "hidden",
    },

    halfwayLine: {
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: LINE_COLOR,
    },

    center: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
    },

    centerCircle: {
        width: "24%",
        aspectRatio: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    centerSpot: {
        position: "absolute",
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: LINE_COLOR,
    },

    paint: {
        position: "absolute",
        left: "31%",
        width: "38%",
        height: "19%",
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    topPaint: {
        top: 0,
        borderTopWidth: 0,
    },

    bottomPaint: {
        bottom: 0,
        borderBottomWidth: 0,
    },

    freeThrowCircle: {
        position: "absolute",
        left: "39%",
        width: "22%",
        aspectRatio: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    topFreeThrowCircle: {
        top: "13%",
    },

    bottomFreeThrowCircle: {
        bottom: "13%",
    },

    backboard: {
        position: "absolute",
        left: "39%",
        width: "22%",
        height: 1,
        backgroundColor: LINE_COLOR,
    },

    topBackboard: {
        top: "5%",
    },

    bottomBackboard: {
        bottom: "5%",
    },

    rim: {
        position: "absolute",
        left: "48%",
        width: "4%",
        aspectRatio: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    topRim: {
        top: "6.5%",
    },

    bottomRim: {
        bottom: "6.5%",
    },

    threePointArc: {
        position: "absolute",
        left: "14%",
        width: "72%",
        height: "27%",
        borderWidth: 1,
        borderColor: LINE_COLOR,
        borderRadius: 999,
    },

    topThreePointArc: {
        top: "-8%",
    },

    bottomThreePointArc: {
        bottom: "-8%",
    },
});
