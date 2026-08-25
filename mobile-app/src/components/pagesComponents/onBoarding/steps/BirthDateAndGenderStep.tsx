import {useState} from "react";
import {Pressable, Text, View} from "react-native";
import DateTimePicker, {
    type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import {Gender} from "@/src/services/users/userConstants";
import {
    formatDateForBackend,
    parseBirthDate,
} from "@/src/constants/helpers/parsingHelper";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/onBoarding/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/onBoarding/onboardingStepStyles"
type BirthDateAndGenderStepProps = {
    birthDate: string | null;
    gender: Gender | null;
    birthDateError?: string;
    genderError?: string;
    onBirthDateChange: (value: string) => void;
    onGenderChange: (value: Gender) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function BirthDateAndGenderStep({
    birthDate,
    gender,
    birthDateError,
    genderError,
    onBirthDateChange,
    onGenderChange,
    onBack,
    onNext,
}: BirthDateAndGenderStepProps) {
    const [showBirthDatePicker, setShowBirthDatePicker] =
        useState(false);

    const handleBirthDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        setShowBirthDatePicker(false);

        if (event.type === "set" && selectedDate) {
            onBirthDateChange(formatDateForBackend(selectedDate));
        }
    };

    return (
        <OnBoardingContainer
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <View>
                        <Text style={styles.sectionLabel}>
                            Data di nascita
                        </Text>

                        <Pressable
                            style={[
                                styles.dateField,
                                Boolean(birthDateError) &&
                                styles.dateFieldError,
                            ]}
                            onPress={() =>
                                setShowBirthDatePicker(true)
                            }
                        >
                            <Text
                                style={[
                                    styles.dateText,
                                    !birthDate &&
                                    styles.datePlaceholder,
                                ]}
                            >
                                {birthDate ??
                                    "Seleziona la data di nascita"}
                            </Text>
                        </Pressable>

                        {birthDateError && (
                            <Text style={styles.fieldError}>
                                {birthDateError}
                            </Text>
                        )}

                        {showBirthDatePicker && (
                            <DateTimePicker
                                value={parseBirthDate(birthDate)}
                                mode="date"
                                maximumDate={new Date()}
                                onChange={handleBirthDateChange}
                            />
                        )}

                        <Text style={styles.sectionLabel}>
                            Genere
                        </Text>

                        <View style={styles.optionsContainer}>
                            {Object.values(Gender).map(option => {
                                const selected = gender === option;

                                return (
                                    <Pressable
                                        key={option}
                                        style={[
                                            styles.option,
                                            selected &&
                                            styles.optionSelected,
                                        ]}
                                        onPress={() =>
                                            onGenderChange(option)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selected &&
                                                styles.optionTextSelected,
                                            ]}
                                        >
                                            {GENDER_LABELS[option]}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {genderError && (
                            <Text style={styles.fieldError}>
                                {genderError}
                            </Text>
                        )}
                    </View>

                    <OnBoardingNavigationButtons
                        onBack={onBack}
                        onNext={onNext}
                    />
                </AuthContent>
            }
        />
    );
}

const GENDER_LABELS: Record<Gender, string> = {
    [Gender.MALE]: "Uomo",
    [Gender.FEMALE]: "Donna",
    [Gender.OTHER]: "Altro",
    [Gender.NOT_SPECIFIED]: "Preferisco non specificarlo",
};
