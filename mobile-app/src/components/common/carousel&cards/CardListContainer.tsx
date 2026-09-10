import React, {ReactNode} from "react";
import {ActivityIndicator, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";

type CarouselContainerProps = {
    items?: ReactNode[];
    style?: StyleProp<ViewStyle>;
    isLoading: boolean;
    error?: string | null;
    emptyMsg: string;
    orientation?: "horizontal" | "vertical";
}

export default function CardListContainer({
                                              items,
                                              style,
                                              isLoading,
                                              error,
                                              emptyMsg,
                                              orientation = "horizontal",
                                          }: CarouselContainerProps) {
    const isEmpty = !items || items.length === 0;
    const isHorizontal = orientation === "horizontal";

    return (
        <View style={[
            styles.container,
            !isHorizontal && styles.verticalContainer,
            style,
        ]}>
            {isLoading ? (
                <ActivityIndicator
                    size="large"
                    color="#ffffff"
                />
            ) : error ? (
                <View/>
            ) : isEmpty ? (
                <Text style={styles.emptyText}>
                    {emptyMsg}
                </Text>
            ) : isHorizontal ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalContent}
                >
                    {items}
                </ScrollView>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.verticalContent}>
                    {items}
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: 16,
        paddingVertical: 8,
    },

    verticalContainer: {
        flexDirection: "column",
        width: "100%",
    },

    horizontalContent: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 5,
    },

    verticalContent: {
        width: "100%",
        gap: 8,
    },

    emptyText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        color: "#7c7c7c",
    },
});