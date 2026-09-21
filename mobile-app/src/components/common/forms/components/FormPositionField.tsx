import {ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useEffect, useState} from "react";
import * as Location from "expo-location";
import FormLabel from "@/src/components/common/labels/FormLabel";
import {colors} from "@/src/constants/theme";
import {GeoLocation} from "@/src/services/common";
import {paletteVariants, Variant} from "@/src/constants/PaletteManager";

type LocationSuggestion = {
    placeId: string;
    label: string;
};

type TeamLocationSectionProps = {
    variant: Variant;
    value: GeoLocation | null;
    onChange: (location: GeoLocation | null) => void;
    errorMessage?: string;
};

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export default function TeamLocationSection({
                                                variant,
                                                value,
                                                onChange,
                                                errorMessage,
                                            }: TeamLocationSectionProps) {


    const [isLocating, setIsLocating] = useState(false);

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [searchError, setSearchError] = useState<string | null>(null);

    const {palette} = paletteVariants[variant];
    const visibleError = errorMessage || searchError;

    const surfaceStyle = {
        backgroundColor: palette.defaultColorBK,
        borderColor: palette.borderColor,
    };

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (
            trimmedQuery.length < 3 ||
            value?.label === query
        ) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(() => {
            void searchLocations(trimmedQuery);
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, value]);

    async function useCurrentLocation() {
        try {
            setIsLocating(true);
            setSearchError(null);

            const permission =
                await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                Alert.alert(
                    "Permesso necessario",
                    "Consenti l'accesso alla posizione per utilizzare la tua posizione corrente."
                );
                return;
            }

            const currentPosition =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

            const {latitude, longitude} =
                currentPosition.coords;

            const addresses =
                await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });

            const address = addresses[0];

            const label = address
                ? [
                    address.city,
                    address.region,
                    address.country,
                ]
                    .filter(Boolean)
                    .join(", ")
                : `${latitude}, ${longitude}`;

            const selectedLocation: GeoLocation = {
                label,
                latitude,
                longitude,
            };

            onChange(selectedLocation);
            setQuery(label);
            setSuggestions([]);
        } catch {
            setSearchError(
                "Impossibile recuperare la posizione corrente"
            );
        } finally {
            setIsLocating(false);
        }
    }

    async function searchLocations(searchQuery: string) {
        if (!GOOGLE_API_KEY) {
            setSearchError("Chiave Google Places mancante");
            return;
        }

        try {
            setIsLoading(true);
            setSearchError(null);

            const response = await fetch(
                "https://places.googleapis.com/v1/places:autocomplete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": GOOGLE_API_KEY,
                    },
                    body: JSON.stringify({
                        input: searchQuery,
                        includedRegionCodes: ["it"],
                        languageCode: "it",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Errore durante la ricerca della posizione"
                );
            }

            const data = await response.json();

            const results: LocationSuggestion[] =
                data.suggestions
                    ?.map((item: any) => {
                        const prediction =
                            item.placePrediction;

                        if (!prediction?.placeId) {
                            return null;
                        }

                        return {
                            placeId: prediction.placeId,
                            label:
                                prediction.text?.text ?? "",
                        };
                    })
                    .filter(Boolean) ?? [];

            setSuggestions(results);
        } catch (error) {
            setSuggestions([]);
            setSearchError(
                error instanceof Error
                    ? error.message
                    : "Errore durante la ricerca"
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function selectLocation(
        suggestion: LocationSuggestion
    ) {
        if (!GOOGLE_API_KEY) {
            return;
        }

        try {
            setIsLoading(true);
            setSearchError(null);

            const response = await fetch(
                `https://places.googleapis.com/v1/places/${suggestion.placeId}`,
                {
                    headers: {
                        "X-Goog-Api-Key": GOOGLE_API_KEY,
                        "X-Goog-FieldMask":
                            "displayName,formattedAddress,location",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Impossibile recuperare la posizione"
                );
            }

            const place = await response.json();

            const selectedLocation: GeoLocation = {
                label:
                    place.formattedAddress ??
                    place.displayName?.text ??
                    suggestion.label,
                latitude: place.location.latitude,
                longitude: place.location.longitude,
            };

            onChange(selectedLocation);
            setQuery(selectedLocation.label);
            setSuggestions([]);
        } catch (error) {
            setSearchError(
                error instanceof Error
                    ? error.message
                    : "Errore durante la selezione"
            );
        } finally {
            setIsLoading(false);
        }
    }

    function clearLocation() {
        onChange(null);
        setQuery("");
        setSuggestions([]);
    }

    return (
        <View style={styles.container}>
            <FormLabel
                text="Posizione"
                variant={variant}
                optional
                labelIconName="location-outline"
            />

            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: visibleError
                            ? colors.error
                            : isFocused
                                ? palette.defaultColor
                                : palette.borderColor,
                        backgroundColor: visibleError
                            ? colors.errorBK
                            : isFocused
                                ? "#FFFFFF"
                                : palette.defaultColorBK,
                    },
                ]}
            >
                <Ionicons
                    name="search-outline"
                    size={21}
                    color={palette.defaultColor}
                />

                <TextInput
                    value={query}
                    onChangeText={text => {
                        setQuery(text);

                        if (value) {
                            onChange(null);
                        }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Cerca città o zona..."
                    placeholderTextColor={palette.labelSecondaryColor}
                    selectionColor={palette.defaultColor}
                    style={[styles.input, {color: palette.labelColor}]}
                />

                {isLoading && (
                    <ActivityIndicator
                        size="small"
                        color={palette.defaultColor}
                    />
                )}
            </View>

            {suggestions.length > 0 && (
                <View
                    style={[
                        styles.suggestionsContainer,
                        {borderColor: palette.borderColor},
                    ]}
                >
                    {suggestions.map(suggestion => (
                        <Pressable
                            key={suggestion.placeId}
                            onPress={() => void selectLocation(suggestion)}
                            accessibilityRole="button"
                            style={({pressed}) => [
                                styles.suggestion,
                                {borderBottomColor: palette.borderColor},
                                pressed && {
                                    backgroundColor: palette.defaultColorBK,
                                },
                            ]}
                        >
                            <Ionicons
                                name="location-outline"
                                size={19}
                                color={palette.defaultColor}
                            />

                            <Text
                                style={[
                                    styles.suggestionText,
                                    {color: palette.labelColor},
                                ]}
                            >
                                {suggestion.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}

            <Pressable
                onPress={() => void useCurrentLocation()}
                disabled={isLocating}
                accessibilityRole="button"
                style={({pressed}) => [
                    styles.currentLocationButton,
                    surfaceStyle,
                    pressed && styles.pressed,
                    isLocating && styles.disabled,
                ]}
            >
                {isLocating ? (
                    <ActivityIndicator
                        size="small"
                        color={palette.defaultColor}
                    />
                ) : (
                    <Ionicons
                        name="locate-outline"
                        size={20}
                        color={palette.defaultColor}
                    />
                )}

                <Text
                    style={[
                        styles.currentLocationText,
                        {color: palette.defaultColor},
                    ]}
                >
                    Usa la mia posizione
                </Text>
            </Pressable>

            <View style={[styles.selectedLocation, surfaceStyle]}>
                <Ionicons
                    name={value ? "location-sharp" : "location-outline"}
                    size={24}
                    color={
                        value
                            ? palette.defaultColor
                            : palette.labelSecondaryColor
                    }
                />

                <Text
                    style={[
                        styles.selectedLocationText,
                        {color: palette.labelColor},
                    ]}
                    numberOfLines={1}
                >
                    {value?.label ?? "Nessuna posizione selezionata"}
                </Text>

                {value !== null && (
                    <Pressable
                        onPress={clearLocation}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Rimuovi posizione"
                        style={({pressed}) => [
                            styles.clearButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons
                            name="close"
                            size={23}
                            color={palette.defaultColor}
                        />
                    </Pressable>
                )}
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
        gap: 5,
    },

    inputContainer: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderWidth: 1.5,
    },

    input: {
        flex: 1,
        minHeight: 52,
        fontSize: 16,
        fontWeight: "500",
    },

    suggestionsContainer: {
        marginTop: 6,
        overflow: "hidden",
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
    },

    suggestion: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    suggestionText: {
        flex: 1,
        fontSize: 14,
    },

    currentLocationButton: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 8,
        borderRadius: 14,
        borderWidth: 1,
    },

    currentLocationText: {
        fontSize: 14,
        fontWeight: "700",
    },

    selectedLocation: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
    },

    selectedLocationText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "700",
    },

    clearButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
    },

    pressed: {
        opacity: 0.7,
    },

    disabled: {
        opacity: 0.6,
    },

    errorText: {
        marginTop: 6,
        marginLeft: 4,
        color: colors.error,
        fontSize: 13,
        fontWeight: "500",
    },
});