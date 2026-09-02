import React, {ReactNode} from "react";
import {ActivityIndicator, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";

type CarouselContainerProps = {
    items?: ReactNode[];
    style?: StyleProp<ViewStyle>;
    isLoading: boolean;
    error?: string | null;
    emptyMsg: string;
}

export default function CarouselContainer({
                                              items,
                                              style,
                                              isLoading,
                                              error,
                                              emptyMsg,
                                          }: CarouselContainerProps) {
    const isEmpty = !items || items.length === 0;


    return (
        <View style={[styles.container, style]}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#ffffff"/>
            ) : error ? (
                <View> </View>
            ) : isEmpty ? (
                <Text style={styles.emptyText}>
                    {emptyMsg}
                </Text>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
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

    scrollContent: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        gap: 5,
    },

    emptyText: {
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        color: "#7c7c7c",
        flex: 1,
    },
});
