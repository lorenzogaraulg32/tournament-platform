import {ComponentProps, useState} from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import FormLabel from "@/src/components/common/labels/FormLabel";
import {SelectedImage} from "@/src/services/imagesService";
import Picture from "@/src/components/common/images/Picture";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";
import {colors} from "@/src/constants/theme";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
]);


type LogoFieldProps = {
    variant: Variant
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

export default function FormImageField({
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

    const {palette} = paletteVariants[variant];

    const visibleError = errorMessage || pickerError;
    const previewSource = value?.uri ?? existingLogoSource;
    const hasPreview = Boolean(previewSource);

    const title = value
        ? "Immagine selezionata"
        : hasPreview
            ? "Immagine attuale"
            : "Aggiungi un’immagine";

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
            <FormLabel
                text={label}
                variant={variant}
                optional={optional}
                labelIconName="image-outline"
            />

            <View
                style={[
                    styles.pickerContainer,
                    {
                        backgroundColor: palette.defaultColorBK,
                        borderColor: visibleError
                            ? colors.error
                            : palette.borderColor,
                    },
                    disabled && styles.disabled,
                ]}
            >
                <View
                    style={[
                        styles.previewContainer,
                        {
                            borderColor: palette.defaultColor,
                            backgroundColor: palette.defaultColorBK,
                        },
                    ]}
                >
                    {hasPreview ? (
                        <Picture
                            variant={variant}
                            logoUrl={previewSource}
                            style={styles.previewImage}
                            local={value !== null || local === true}
                        />
                    ) : (
                        <Ionicons
                            name={placeholderIcon}
                            size={34}
                            color={palette.defaultColor}
                        />
                    )}
                </View>

                <View style={styles.content}>
                    <Text style={[styles.title, {color: palette.labelColor}]}>
                        {title}
                    </Text>

                    <Text
                        style={[
                            styles.description,
                            {color: palette.labelSecondaryColor},
                        ]}
                        numberOfLines={1}
                    >
                        {value
                            ? value.fileName
                            : hasPreview
                                ? "Scegli un’immagine per sostituirla"
                                : "PNG, JPG o WebP · massimo 2 MB"}
                    </Text>

                    <View style={styles.actions}>
                        <Pressable
                            onPress={() => void selectLogo()}
                            disabled={disabled}
                            accessibilityRole="button"
                            style={({pressed}) => [
                                styles.selectButton,
                                {backgroundColor: palette.defaultColor},
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Ionicons
                                name={hasPreview
                                    ? "images-outline"
                                    : "cloud-upload-outline"}
                                size={17}
                                color="#FFFFFF"
                            />

                            <Text style={styles.selectButtonText}>
                                {hasPreview ? "Cambia" : "Scegli immagine"}
                            </Text>
                        </Pressable>

                        {hasPreview && (
                            <Pressable
                                onPress={removeLogo}
                                disabled={disabled}
                                accessibilityRole="button"
                                accessibilityLabel="Rimuovi immagine"
                                style={({pressed}) => [
                                    styles.removeButton,
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color={colors.error}
                                />
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>

            {!!visibleError && (
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
        borderRadius: 18,
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
        fontSize: 15,
        fontWeight: "800",
    },

    description: {
        marginTop: 4,
        fontSize: 12,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
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
        borderColor: colors.error,
        backgroundColor: colors.errorBK,
    },

    buttonPressed: {
        opacity: 0.75,
    },

    errorText: {
        marginTop: 6,
        marginLeft: 4,
        color: colors.error,
        fontSize: 12,
        fontWeight: "500",
    },
});