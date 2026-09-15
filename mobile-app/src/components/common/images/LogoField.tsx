import {ComponentProps, useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import FormLabel from "@/src/components/common/labels/FormLabel";
import {SelectedImage} from "@/src/services/imagesService";
import Picture from "@/src/components/common/images/Picture";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
]);

type variant = "createTeam" | "createUser"


type LogoFieldProps = {
    variant: variant
    value: SelectedImage | null;
    onRemove?: () => void
    onChange: (logo: SelectedImage | null) => void;
    placeholderIcon?: ComponentProps<typeof Ionicons>["name"];
    existingLogoSource?: string;
    label?: string;
    optional?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    local?: boolean
};

export default function LogoField({
                                      variant,
                                      value,
                                      onRemove,
                                      onChange,
                                      label = "Picture",
                                      optional = true,
                                      placeholderIcon = "image-outline",
                                      existingLogoSource,
                                      disabled = false,
                                      errorMessage,
                                      local
                                  }: LogoFieldProps) {
    const [pickerError, setPickerError] =
        useState<string | null>(null);

    const visibleError = errorMessage ?? pickerError;
    const isCreateUser = variant === "createUser";
    const previewSource = value?.uri ?? existingLogoSource;
    const hasPreview = Boolean(previewSource);

    async function selectLogo() {
        try {
            setPickerError(null);

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                setPickerError(
                    "È necessario consentire l'accesso alle immagini"
                );
                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.9,
                });

            if (result.canceled) {
                return;
            }

            const asset = result.assets[0];

            if (
                asset.fileSize !== undefined &&
                asset.fileSize > MAX_LOGO_SIZE
            ) {
                setPickerError(
                    "Il logo non può superare i 2 MB"
                );
                return;
            }

            if (
                asset.mimeType &&
                !ALLOWED_MIME_TYPES.has(asset.mimeType)
            ) {
                setPickerError(
                    "Sono supportati solo PNG, JPG e WebP"
                );
                return;
            }

            onChange({
                uri: asset.uri,
                fileName:
                    asset.fileName ??
                    asset.uri.split("/").pop() ??
                    "logo",
                mimeType:
                    asset.mimeType ??
                    "application/octet-stream",
                fileSize: asset.fileSize,
            });
        } catch {
            setPickerError(
                "Non è stato possibile selezionare l'immagine"
            );
        }
    }

    function removeLogo() {
        setPickerError(null);

        if (onRemove) {
            onRemove()
        } else {
            onChange(null);
        }
    }

    return (
        <View style={styles.container}>
            {isCreateUser ? (
                <View style={styles.createUserLabelContainer}>
                    <Text style={styles.createUserLabel}>
                        {label}
                    </Text>

                    {optional && (
                        <Text style={styles.createUserOptional}>
                            Opzionale
                        </Text>
                    )}
                </View>
            ) : (
                <FormLabel
                    text={label}
                    optional={optional}
                    labelIconName="image-outline"
                />
            )}
            <View
                style={[
                    styles.pickerContainer,

                    isCreateUser &&
                    styles.pickerContainerCreateUser,

                    visibleError &&
                    styles.pickerContainerError,

                    disabled &&
                    styles.disabled,
                ]}
            >
                <View
                    style={[
                        styles.previewContainer,
                        isCreateUser &&
                        styles.previewContainerCreateUser,
                    ]}
                >
                    {hasPreview ? (
                        <Picture
                            variant={isCreateUser ? "player" : "team"}
                            logoUrl={previewSource}
                            style={styles.previewImage}
                            local={local}
                        />
                    ) : (
                        <Ionicons
                            name={placeholderIcon}
                            size={34}
                            color={isCreateUser ? "#FFFFFF" : "#C8480A"}
                        />
                    )}
                </View>

                <View style={styles.content}>
                    <Text
                        style={[
                            styles.title,
                            isCreateUser && styles.titleCreateUser,
                        ]}
                    >
                        {value
                            ? isCreateUser
                                ? "Foto selezionata"
                                : "Logo selezionato"
                            : hasPreview
                                ? isCreateUser
                                    ? "Foto attuale"
                                    : "Logo attuale"
                                : isCreateUser
                                    ? "Aggiungi una foto"
                                    : "Aggiungi un logo"}
                    </Text>

                    <Text
                        style={[
                            styles.description,
                            isCreateUser &&
                            styles.descriptionCreateUser,
                        ]}
                        numberOfLines={1}
                    >
                        {value
                            ? value.fileName
                            : hasPreview
                                ? "Scegli un’immagine per sostituirlo"
                                : "PNG, JPG o WebP · massimo 2 MB"}
                    </Text>

                    <View style={styles.actions}>
                        <Pressable
                            onPress={() => void selectLogo()}
                            disabled={disabled}
                            style={({pressed}) => [
                                styles.selectButton,
                                pressed &&
                                styles.buttonPressed,
                            ]}
                        >
                            <Ionicons
                                name={hasPreview ? "images-outline" : "cloud-upload-outline"}
                                size={17}
                                color="#FFFFFF"
                            />

                            <Text style={styles.selectButtonText}>
                                {hasPreview
                                    ? "Cambia"
                                    : isCreateUser
                                        ? "Scegli foto"
                                        : "Scegli immagine"}
                            </Text>
                        </Pressable>

                        {previewSource && (
                            <Pressable
                                onPress={removeLogo}
                                disabled={disabled}
                                accessibilityRole="button"
                                accessibilityLabel="Rimuovi logo"
                                style={({pressed}) => [
                                    styles.removeButton,
                                    pressed &&
                                    styles.buttonPressed,
                                ]}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color="#B42318"
                                />
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>

            {visibleError && (
                <Text style={styles.errorText}>
                    {visibleError}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20,
    },

    pickerContainer: {
        minHeight: 116,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,

        borderWidth: 1,
        borderColor: "#E8D2C7",
        borderRadius: 18,

        backgroundColor: "#FFF8F4",
    },

    pickerContainerError: {
        borderColor: "#B42318",
    },

    disabled: {
        opacity: 0.6,
    },

    previewContainer: {
        width: 82,
        height: 82,
        borderRadius: 41,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",

        borderWidth: 2,
        borderColor: "#C8480A",
        backgroundColor: "#F7E5DC",
    },

    previewImage: {
        width: "100%",
        height: "100%",
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        color: "#2D2D2D",
        fontSize: 15,
        fontWeight: "800",
    },

    description: {
        marginTop: 4,
        color: "#767676",
        fontSize: 12,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 11,
    },

    selectButton: {
        minHeight: 38,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        paddingHorizontal: 13,
        borderRadius: 12,
        backgroundColor: "#C8480A",
    },

    selectButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
    },

    removeButton: {
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F0C6C2",
        backgroundColor: "#FFF1F0",
    },

    buttonPressed: {
        opacity: 0.75,
        transform: [{scale: 0.98}],
    },

    errorText: {
        marginTop: 6,
        marginLeft: 4,
        color: "#B42318",
        fontSize: 12,
        fontWeight: "500",
    },

    pickerContainerCreateUser: {
        backgroundColor: "rgba(255,255,255,0.30)",

        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.35)",

        borderRadius: 18,
    },

    previewContainerCreateUser: {
        borderColor: "rgba(255,255,255,0.55)",
        backgroundColor: "rgba(255,255,255,0.16)",
    },

    titleCreateUser: {
        color: "#FFFFFF",
    },

    descriptionCreateUser: {
        color: "rgba(255,255,255,0.65)",
    },

    createUserLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        marginBottom: 8,
        gap: 6,
    },

    createUserLabel: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "800",
        color: "#FFFFFF",
    },

    createUserOptional: {
        fontSize: 12,
        color: "rgba(255,255,255,0.55)",
    },
});