import {Pressable, Text, View} from "react-native";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import OnBoardingContainer from "@/src/components/pagesComponents/profile/onBoarding/OnBoardingContainer";
import {Gender} from "@/src/services/users/userDTO";
import {
    onboardingStepStyles as styles
} from "@/src/components/pagesComponents/profile/onBoarding/misc/onboardingStepStyles"
import FormDateField from "@/src/components/common/forms/fileds/FormDateField";
import {LocalDateString} from "@/src/services/common";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";

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
            step={2}
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

                    <FormStepNavigation
                        onBack={onBack}
                        onNext={onNext}
                        nextVariant={"onBoarding"}/>
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
