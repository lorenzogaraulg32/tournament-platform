import {ReactNode} from "react";
import {StyleSheet, View} from "react-native";

type FootballFieldProps = {
    children?: ReactNode;

};


export default function FootballField({
                                          children,
                                      }: FootballFieldProps) {


    return (
        <View style={styles.container}>

            <View style={styles.field}>

                <View pointerEvents="none" style={styles.decoration}>
                    <View style={styles.reflection}/>

                    <View style={styles.pitch}>
                        <View style={styles.halfwayLine}/>

                        <View style={styles.center}>
                            <View style={styles.centerCircle}/>
                            <View style={styles.spot}/>
                        </View>

                        <View style={[styles.penaltyArea, styles.topArea]}/>
                        <View style={[styles.penaltyArea, styles.bottomArea]}/>

                        <View style={[styles.goalArea, styles.topArea]}/>
                        <View style={[styles.goalArea, styles.bottomArea]}/>

                        <View style={[styles.penaltySpot, styles.topSpot]}/>
                        <View style={[styles.penaltySpot, styles.bottomSpot]}/>
                    </View>
                </View>
                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    {children}
                </View>
            </View>
        </View>
    );
}

const LINE_COLOR = "rgba(255, 255, 255, 0.35)";

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 20,
        gap: 5,
    },

    field: {
        width: "100%",
        aspectRatio: 0.70,
        position: "relative",

        backgroundColor: "rgba(8, 105, 72, 0.30)",
        borderColor: "rgba(110, 231, 183, 0.45)",
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
        backgroundColor: "rgba(255, 255, 255, 0.45)",
    },

    pitch: {
        position: "absolute",
        top: 16,
        bottom: 16,
        left: 12,
        right: 12,

        borderWidth: 1,
        borderColor: LINE_COLOR,
        borderRadius: 3,
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
        width: "26%",
        aspectRatio: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    spot: {
        position: "absolute",
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: LINE_COLOR,
    },

    penaltyArea: {
        position: "absolute",
        left: "19%",
        width: "62%",
        height: "17%",
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    goalArea: {
        position: "absolute",
        left: "35%",
        width: "30%",
        height: "6%",
        borderWidth: 1,
        borderColor: LINE_COLOR,
    },

    topArea: {
        top: 0,
        borderTopWidth: 0,
    },

    bottomArea: {
        bottom: 0,
        borderBottomWidth: 0,
    },

    penaltySpot: {
        position: "absolute",
        left: "50%",
        marginLeft: -2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: LINE_COLOR,
    },

    topSpot: {
        top: "12%",
    },

    bottomSpot: {
        bottom: "12%",
    },


});
