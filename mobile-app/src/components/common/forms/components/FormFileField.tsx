import {useState} from "react";
import {Linking, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {File} from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import FormLabel from "@/src/components/common/labels/FormLabel";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";
import {colors} from "@/src/constants/theme";
import {Media} from "@/src/services/mediaService";
import Ionicons from "@expo/vector-icons/Ionicons";


type FormFileFieldProps = {
    variant: Variant;
    value: Media | null;
    onChange: (file: Media | null) => void;
    label?: string;
    optional?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
    maxFileSize?: number;
    acceptedFormatsLabel?: string;
    existingFileSource?: string;
};


export default function FormFileField({
                                          variant,
                                          value,
                                          onChange,
                                          label = "File",
                                          optional = true,
                                          disabled = false,
                                          errorMessage,
                                          allowedMimeTypes,
                                          allowedExtensions,
                                          maxFileSize,
                                          acceptedFormatsLabel,
                                          existingFileSource,
                                      }: FormFileFieldProps) {

    const [pickerError, setPickerError] =
        useState<string | null>(null);

    const {palette} = paletteVariants[variant];

    const visibleError =
        errorMessage || pickerError;

    const fileSource = value?.uri ?? existingFileSource;


    const title = value
        ? "File selezionato"
        : existingFileSource
            ? "File attuale"
            : "Aggiungi un file";

    async function selectFile() {
        try {
            setPickerError(null);

            const result = await File.pickFileAsync({
                multipleFiles: false,
                mimeTypes:
                    allowedMimeTypes && allowedMimeTypes.length > 0
                        ? allowedMimeTypes
                        : "*/*",
            });

            if (result.canceled || !result.result) {
                return;
            }

            const file = result.result;

            const fileName =
                file.name ||
                file.uri.split("/").pop() ||
                "file";

            const mimeType =
                file.type?.toLowerCase() ?? "";

            /*
             * Alcuni provider Android restituiscono un MIME generico.
             * In quel caso non possiamo usarlo per validare realmente
             * il formato e facciamo fallback sull'estensione.
             */
            const hasReliableMimeType =
                mimeType !== "" &&
                mimeType !== "application/octet-stream";

            /*
             * VALIDAZIONE MIME TYPE
             */
            if (
                hasReliableMimeType &&
                allowedMimeTypes &&
                allowedMimeTypes.length > 0
            ) {
                const validMimeType =
                    allowedMimeTypes.some(allowedType => {
                        const normalizedAllowedType =
                            allowedType.toLowerCase();

                        if (normalizedAllowedType === "*/*") {
                            return true;
                        }

                        /*
                         * Supporta anche valori tipo image/*
                         */
                        if (normalizedAllowedType.endsWith("/*")) {
                            const category =
                                normalizedAllowedType.split("/")[0];

                            return mimeType.startsWith(
                                `${category}/`
                            );
                        }

                        return mimeType === normalizedAllowedType;
                    });

                if (!validMimeType) {
                    setPickerError(
                        "Il formato del file non è supportato"
                    );
                    return;
                }
            }

            /*
             * VALIDAZIONE ESTENSIONE
             *
             * La usiamo come fallback quando il MIME type
             * non è disponibile o è application/octet-stream.
             */
            if (
                !hasReliableMimeType &&
                allowedExtensions &&
                allowedExtensions.length > 0
            ) {
                const lowerCaseName =
                    fileName.toLowerCase();

                const validExtension =
                    allowedExtensions.some(extension => {
                        const normalizedExtension =
                            extension.startsWith(".")
                                ? extension.toLowerCase()
                                : `.${extension.toLowerCase()}`;

                        return lowerCaseName.endsWith(
                            normalizedExtension
                        );
                    });

                if (!validExtension) {
                    setPickerError(
                        `Sono supportati solo file ${allowedExtensions.join(", ")}`
                    );
                    return;
                }
            }

            /*
             * VALIDAZIONE DIMENSIONE
             */
            if (
                maxFileSize !== undefined &&
                file.size !== undefined &&
                file.size > maxFileSize
            ) {
                setPickerError(
                    `Il file non può superare i ${formatFileSize(maxFileSize)}`
                );
                return;
            }

            /*
             * FILE VALIDO
             */
            onChange({
                uri: file.uri,
                fileName,
                mimeType:
                    hasReliableMimeType
                        ? mimeType
                        : "application/octet-stream",
                fileSize: file.size,
            });

        } catch (error) {
            console.log("Errore selezione file:", error);

            setPickerError(
                "Non è stato possibile selezionare il file"
            );
        }
    }


    function removeFile() {
        setPickerError(null);
        onChange(null);

    }


    function formatFileSize(bytes: number): string {

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${Math.round(bytes / 1024)} KB`;
        }

        return `${Math.round(
            bytes / (1024 * 1024)
        )} MB`;
    }


    function getDescription(): string {
        if (value) {
            if (value.fileSize !== undefined) {
                return `${value.fileName} · ${formatFileSize(value.fileSize)}`;
            }

            return value.fileName || "";
        }

        if (existingFileSource) {
            return "Scegli un file per sostituirlo";
        }

        if (acceptedFormatsLabel) {
            return acceptedFormatsLabel;
        }

        return "Seleziona un file";
    }

    async function openFile() {
        if (!fileSource) {
            return;
        }

        try {
            if (
                fileSource.startsWith("http://") ||
                fileSource.startsWith("https://")
            ) {
                await Linking.openURL(fileSource);
                return;
            }

            if (Platform.OS === "android") {
                const file = new File(fileSource);

                console.log("FILE SOURCE:", fileSource);
                console.log("FILE URI:", file.uri);
                console.log("FILE EXISTS:", file.exists);
                console.log("CONTENT URI:", file.contentUri);

                await IntentLauncher.startActivityAsync(
                    "android.intent.action.VIEW",
                    {
                        data: file.contentUri,
                        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                        type: value?.mimeType ?? "application/pdf",
                    }
                );

                return;
            }

            await Linking.openURL(fileSource);

        } catch (error) {
            console.log("Errore apertura file:", error);

            setPickerError(
                "Non è stato possibile aprire il file"
            );
        }
    }


    return (
        <View style={styles.container}>

            <FormLabel
                text={label}
                variant={variant}
                optional={optional}
                labelIconName="document-outline"
            />


            <View
                style={[
                    styles.pickerContainer,
                    {
                        backgroundColor:
                        palette.defaultColorBK,

                        borderColor:
                            visibleError
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
                            borderColor:
                            palette.defaultColor,

                            backgroundColor:
                            palette.defaultColorBK,
                        },
                    ]}
                >

                    <Ionicons
                        name={
                            value
                                ? "document-text-outline"
                                : "document-outline"
                        }
                        size={34}
                        color={palette.defaultColor}
                    />

                </View>


                <View style={styles.content}>

                    <Text
                        style={[
                            styles.title,
                            {
                                color:
                                palette.labelColor,
                            },
                        ]}
                    >
                        {title}
                    </Text>


                    <Text
                        style={[
                            styles.description,
                            {
                                color:
                                palette.labelSecondaryColor,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {getDescription()}
                    </Text>


                    <View style={styles.actions}>

                        <Pressable
                            onPress={() =>
                                void selectFile()
                            }
                            disabled={disabled}
                            accessibilityRole="button"
                            style={({pressed}) => [
                                styles.selectButton,
                                {
                                    backgroundColor:
                                    palette.defaultColor,
                                },
                                pressed &&
                                styles.buttonPressed,
                            ]}
                        >

                            <Ionicons
                                name={
                                    value
                                        ? "documents-outline"
                                        : "cloud-upload-outline"
                                }
                                size={17}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.selectButtonText
                                }
                            >
                                {
                                    value
                                        ? "Cambia"
                                        : "Scegli file"
                                }
                            </Text>

                        </Pressable>


                        {fileSource && (

                            <Pressable
                                onPress={removeFile}
                                disabled={disabled}

                                accessibilityRole="button"
                                accessibilityLabel="Rimuovi file"

                                style={({pressed}) => [
                                    styles.removeButton,

                                    pressed &&
                                    styles.buttonPressed,
                                ]}
                            >

                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color={colors.error}
                                />

                            </Pressable>

                        )}

                        {value && (
                            <Pressable
                                onPress={() => void openFile()}
                                disabled={disabled}
                                accessibilityRole="button"
                                accessibilityLabel="Apri file"
                                style={({pressed}) => [
                                    styles.openButton,
                                    {
                                        borderColor: palette.defaultColor,
                                        backgroundColor: palette.defaultColorBK,
                                    },
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Ionicons
                                    name="open-outline"
                                    size={18}
                                    color={palette.defaultColor}
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

        borderRadius: 18,

        alignItems: "center",
        justifyContent: "center",

        overflow: "hidden",

        borderWidth: 2,
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

    openButton: {
        width: 38,
        height: 38,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 12,
        borderWidth: 1,
    },

});