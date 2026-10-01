import {Pressable, Text, View} from "react-native";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import {Gender} from "@/src/services/users/userConstants";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/onBoarding/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/onBoarding/onboardingStepStyles"
import FormDateField from "@/src/components/common/forms/components/FormDateField";
import {LocalDateString} from "@/src/services/common";

type BirthDateAndGenderStepProps = {
    birthDate: LocalDateString | null;
    gender: Gender | null;
    birthDateError?: string;
    genderError?: string;
    onBirthDateChange: (value: LocalDateString) => void;
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


    return (
        <OnBoardingContainer
            step={3}
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <View>
                        <FormDateField
                            variant="onBoarding"
                            label="Data di nascita"
                            value={birthDate}
                            onChange={onBirthDateChange}
                            placeholder="Seleziona la data di nascita"
                            maximumDate={new Date()}
                            errorMessage={birthDateError}
                        />

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
