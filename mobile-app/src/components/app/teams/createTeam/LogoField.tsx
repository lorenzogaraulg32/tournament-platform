import {useState} from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import {TeamLogoUpload} from "@/src/services/teams/teamCreationService";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
]);

type LogoFieldProps = {
    value: TeamLogoUpload | null;
    onChange: (logo: TeamLogoUpload | null) => void;
    disabled?: boolean;
    errorMessage?: string;
};

export default function LogoField({
                                      value,
                                      onChange,
                                      disabled = false,
                                      errorMessage,
                                  }: LogoFieldProps) {
    const [pickerError, setPickerError] =
        useState<string | null>(null);

    const visibleError = errorMessage ?? pickerError;

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
                    "team-logo",
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
        onChange(null);
    }

    return (
        <View style={styles.container}>
            <View style={styles.externalLabelContainer}>

                <View style={styles.labelContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="image-outline"
                            size={18}
                            color="#C8480A"
                        />
                    </View>
                    <Text style={styles.label}>
                        Logo squadra
                    </Text>
                </View>

                <Text style={styles.optional}>
                    Opzionale
                </Text>

            </View>
            <View
                style={[
                    styles.pickerContainer,
                    visibleError && styles.pickerContainerError,
                    disabled && styles.disabled,
                ]}
            >
                <View style={styles.previewContainer}>
                    {value ? (
                        <Image
                            source={{uri: value.uri}}
                            style={styles.previewImage}
                            contentFit="cover"
                        />
                    ) : (
                        <Ionicons
                            name="shield-outline"
                            size={34}
                            color="#C8480A"
                        />
                    )}
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>
                        {value
                            ? "Logo selezionato"
                            : "Aggiungi un logo"}
                    </Text>

                    <Text
                        style={styles.description}
                        numberOfLines={1}
                    >
                        {value
                            ? value.fileName
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
                                name={
                                    value
                                        ? "images-outline"
                                        : "cloud-upload-outline"
                                }
                                size={17}
                                color="#FFFFFF"
                            />

                            <Text style={styles.selectButtonText}>
                                {value
                                    ? "Cambia"
                                    : "Scegli immagine"}
                            </Text>
                        </Pressable>

                        {value && (
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

    externalLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9,
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    iconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(200, 72, 10, 0.12)",
    },


    label: {
        color: "#1C1C1C",
        fontSize: 17,
        fontWeight: "800",
    },


    optional: {
        color: "#a8a8a8",
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
});