import {View} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import OnBoardingContainer from "@/src/components/pagesComponents/profile/onBoarding/OnBoardingContainer";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/profile/onBoarding/misc/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/profile/onBoarding/misc/onboardingStepStyles"

type NameAndSurnameStepProps = {
    firstName: string;
    lastName: string;
    firstNameError?: string;
    lastNameError?: string;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onNext: () => void;
};

export default function NameAndSurnameStep({
    firstName,
    lastName,
    firstNameError,
    lastNameError,
    onFirstNameChange,
    onLastNameChange,
    onNext,
}: NameAndSurnameStepProps) {
    return (
        <OnBoardingContainer
            step={1}
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <View>
                        <AuthTextField
                            label="Nome"
                            placeholder="Inserisci il tuo nome"
                            value={firstName}
                            onChangeText={onFirstNameChange}
                            autoCapitalize="words"
                            autoCorrect={false}
                            errorMessage={firstNameError}
                        />

                        <AuthTextField
                            label="Cognome"
                            placeholder="Inserisci il tuo cognome"
                            value={lastName}
                            onChangeText={onLastNameChange}
                            autoCapitalize="words"
                            autoCorrect={false}
                            errorMessage={lastNameError}
                        />
                    </View>

                    <OnBoardingNavigationButtons
                        onNext={onNext}
                    />
                </AuthContent>
            }
         />
    );
}
