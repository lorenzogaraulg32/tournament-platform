import {paletteVariants, Variant} from "@/src/constants/palette/PaletteManager";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Color from "color";

type EntityTabsProps = {
    tabs: string[];
    currentTab: string;
    variant: Variant;
    onChangeTab: (tab: string) => void;
};

export default function EntityTabs({
                                       tabs,
                                       currentTab,
                                       variant,
                                       onChangeTab
                                   }: EntityTabsProps) {

    const {palette} = paletteVariants[variant];

    const containerColor = Color(palette.defaultColor)
        .darken(0.55)
        .hex();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[
                styles.container,
                {backgroundColor: containerColor}
            ]}
            contentContainerStyle={styles.tabsContent}
        >
            {tabs.map((tab, index) => {
                const isSelected = currentTab === tab;

                return (
                    <View key={tab} style={styles.tabWrapper}>
                        <Pressable
                            style={[
                                styles.labelContainer,
                                isSelected && {
                                    backgroundColor: palette.defaultColor
                                }
                            ]}
                            onPress={() => {
                                if (!isSelected) {
                                    onChangeTab(tab);
                                }
                            }}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    {
                                        color: isSelected
                                            ? "#FFFFFF"
                                            : "rgba(255,255,255,0.65)",
                                        fontWeight: isSelected ? "700" : "500"
                                    }
                                ]}
                            >
                                {tab}
                            </Text>
                        </Pressable>

                        {index < tabs.length - 1 && (
                            <View style={styles.separator}/>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    tabWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },

    separator: {
        width: 1,
        height: 20,
        backgroundColor: "rgba(255,255,255,0.35)",
    },

    container: {
        flexGrow: 0,
        marginTop: -30,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: "hidden",
        zIndex: 2,
    },

    tabsContent: {
        paddingVertical: 4,
        paddingHorizontal: 2,
        alignItems: "center"
    },

    labelContainer: {
        minWidth: 80,
        height: 38,
        marginHorizontal: 3,
        borderRadius: 38,
        justifyContent: "center",
        alignItems: "center"
    },

    label: {
        paddingHorizontal: 10,
        fontSize: 14
    }
});