import {Pressable, StyleSheet, Text, View} from "react-native";
import React, {Dispatch, SetStateAction} from "react";
import {Ionicons} from "@expo/vector-icons";
import {ModifyAuthSections} from "@/src/components/pagesComponents/profile/modifyAuth/ModifyAuthPage";
import {paletteVariants} from "@/src/constants/palette/PaletteManager";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";
import {router} from "expo-router";

type MainSectionProps = {
    onChangeSection: Dispatch<SetStateAction<ModifyAuthSections>>;
};

type MenuItem = {
    section: ModifyAuthSections;
    title: string;
    description: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
};

const menuItems: MenuItem[] = [
    {
        section: "changeEmail",
        title: "Modifica email",
        description: "Aggiorna il tuo indirizzo email",
        icon: "mail-outline",
    },
    {
        section: "changePassword",
        title: "Modifica password",
        description: "Gestisci la password di accesso",
        icon: "lock-closed-outline",
    },
    {
        section: "external",
        title: "Provider esterni",
        description: "Gestisci gli account collegati",
        icon: "link-outline",
    },
];

export default function MainSection({
                                        onChangeSection
                                    }: MainSectionProps) {

    const {palette} = paletteVariants["profile"];

    return (
        <View style={styles.menu}>
            {menuItems.map((item) => (
                <Pressable
                    key={item.section}
                    onPress={() => onChangeSection(item.section)}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    style={({pressed}) => [
                        styles.menuItem,
                        {
                            backgroundColor: palette.defaultColorBK,
                            borderColor: palette.defaultColor,
                        },
                        pressed && styles.menuItemPressed
                    ]}
                >
                    <View style={[
                        styles.iconContainer,

                        {backgroundColor: palette.defaultColor}
                    ]}>
                        <Ionicons
                            name={item.icon}
                            size={21}
                            color={"#fff"}
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[
                            styles.itemTitle,
                            {color: palette.labelColor}
                        ]}>
                            {item.title}
                        </Text>

                        <Text style={[
                            styles.itemDescription,
                            {color: palette.labelSecondaryColor}
                        ]}>
                            {item.description}
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={19}
                        color="#8494AB"
                    />
                </Pressable>
            ))}

            <FormStepNavigation
                nextLabel={"Indietro"}
                nextVariant={"profile"}
                onNext={() => {
                    router.back()
                }}
                loading={false}
            />
        </View>

    )
}

const styles = StyleSheet.create({

    title: {
        fontSize: 19,
        fontWeight: "700",
    },

    subtitle: {
        fontSize: 13,
        lineHeight: 19,
    },

    menu: {
        gap: 12,
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,

        minHeight: 56,

        borderRadius: 12,
        borderWidth: 1,

        overflow: "hidden",
    },

    iconContainer: {
        width: 48,
        alignSelf: "stretch",

        justifyContent: "center",
        alignItems: "center",
    },

    menuItemPressed: {
        opacity: 0.7,
    },


    textContainer: {
        flex: 1,
        gap: 0,
    },

    itemTitle: {
        color: "#F8FAFC",
        fontSize: 14,
        fontWeight: "600",
    },

    itemDescription: {
        color: "#A7B4C5",
        fontSize: 11,
        lineHeight: 16,
    },
});
