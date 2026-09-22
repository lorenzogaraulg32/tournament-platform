import {ActivityIndicator, Text, View} from "react-native";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import PositionField from "@/src/components/common/forms/components/FormPositionField";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/onBoarding/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/onBoarding/onboardingStepStyles"
import {GeoLocation} from "@/src/services/common";

type LocationStepProps = {
    location: GeoLocation | null;
    errorMessage?: string;
    finalError: string;
    isLoading: boolean;
    onLocationChange: (value: GeoLocation | null) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function LocationStep({
                                         location,
                                         errorMessage,
                                         finalError,
                                         isLoading,
                                         onLocationChange,
                                         onBack,
                                         onNext,
                                     }: LocationStepProps) {
    return (
        <OnBoardingContainer
            step={5}
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <PositionField
                        variant="profile"
                        value={location}
                        onChange={onLocationChange}
                        errorMessage={errorMessage}
                    />

                    <View>
                        {finalError && (
                            <Text style={styles.apiError}>
                                {finalError}
                            </Text>
                        )}

                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <Text
                                    style={styles.loadingText}
                                    numberOfLines={1}
                                >
                                    Completamento del processo di onboarding...
                                </Text>

                                <ActivityIndicator
                                    size="large"
                                    color="#FFFFFF"
                                />
                            </View>
                        )}

                        <OnBoardingNavigationButtons
                            onBack={onBack}
                            onNext={onNext}
                            isLastStep
                            disabled={isLoading}
                        />
                    </View>
                </AuthContent>
            }
        />
    );
}
