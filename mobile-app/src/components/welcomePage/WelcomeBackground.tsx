import {ReactNode} from "react";
import {StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "../../constants/theme"


type AppBackgroundProps = {
    children: ReactNode;
};

type DecorCircle = {
    size: number;
    opacity: number;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

const decorCircles: DecorCircle[] = [
    {
        size: 260,
        opacity: 0.08,
        top: -90,
        right: -90,
    },
    {
        size: 180,
        opacity: 0.06,
        bottom: 160,
        left: -80,
    },
    {
        size: 120,
        opacity: 0.05,
        bottom: 60,
        right: -40,
    },
    {
        size: 90,
        opacity: 0.07,
        top: 150,
        left: 28,
    },
    {
        size: 54,
        opacity: 0.1,
        top: 250,
        right: 42,
    },
    {
        size: 140,
        opacity: 0.045,
        bottom: 310,
        right: -55,
    },
    {
        size: 76,
        opacity: 0.07,
        bottom: 250,
        left: 150,
    },
    {
        size: 38,
        opacity: 0.12,
        top: 410,
        left: 80,
    },
];


export default function WelcomeBackground({children}: AppBackgroundProps) {
    return (
        <LinearGradient
            colors={[colors.backgroundStart, colors.backgroundEnd]}
            style={styles.container}
        >
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                {decorCircles.map((circle, index) => (
                    <View
                        key={index}
                        style={[
                            styles.decorCircle,
                            {
                                width: circle.size,
                                height: circle.size,
                                borderRadius: circle.size / 2,
                                backgroundColor: `rgba(255,255,255,${circle.opacity})`,
                                top: circle.top,
                                bottom: circle.bottom,
                                left: circle.left,
                                right: circle.right,
                            }
                        ]}
                    />
                ))}
            </View>
            {children}
        </LinearGradient>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    decorCircle: {
        position: "absolute",
    },
});