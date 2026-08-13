import {Pressable, StyleSheet, Text, View} from "react-native";
import AuthTextField from "@/src/components/auth/AuthTextField";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";
import AuthContent from "@/src/components/auth/AuthContent";
import {colors} from "@/src/constants/theme";
import {useState} from "react";
import {Gender, Sport, SportRole, UserOnBoardingInfo} from "@/src/services/userService";
import PositionField from "@/src/components/app/teams/createTeam/PositionField";
import LogoField, {SelectedLogo} from "@/src/components/app/teams/createTeam/LogoField";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import OnBoardingContainer from "@/src/components/onboarding/OnBoardingContainer";


type OnBoardingFieldErrors = {
    username?: string;
    profileLogo?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
    sports?: string;
    roles?: string;
    location?: string;
};

export default function OnBoarding() {

    const TOTAL_STEPS = 5;

    const [fieldErrors, setFieldErrors] = useState<OnBoardingFieldErrors>({});

    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

    const [step, setStep] = useState(0);


    const [userData, setUserData] = useState<UserOnBoardingInfo>({
        username: "",
        firstName: "",
        lastName: "",
        birthDate: null,
        gender: null,
        sports: [],
        roles: [],
        location: null,
    });

    const [profileLogo, setProfileLogo] = useState<SelectedLogo | null>(null);

    /*Metodi helper*/

    const handleFieldChange = <K extends keyof UserOnBoardingInfo>(field: K, value: UserOnBoardingInfo[K]) => {
        setUserData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleSport = (sport: Sport) => {
        setUserData(prev => {
            const isSelected = prev.sports.includes(sport);

            if (isSelected) {
                return {
                    ...prev,
                    sports: prev.sports.filter(s => s !== sport),

                    // Rimuovo anche i ruoli associati allo sport
                    roles: prev.roles.filter(role => role.sport !== sport),
                };
            }

            return {
                ...prev,
                sports: [...prev.sports, sport],
            };
        });
    };

    const toggleRole = (sport: Sport, role: SportRole) => {

        setUserData(prev => {

            const isSelected = prev.roles.some(
                selectedRole =>
                    selectedRole.sport === sport &&
                    selectedRole.role === role
            );

            if (isSelected) {
                return {
                    ...prev,
                    roles: prev.roles.filter(
                        selectedRole =>
                            !(
                                selectedRole.sport === sport &&
                                selectedRole.role === role
                            )
                    ),
                };
            }

            return {
                ...prev,
                roles: [
                    ...prev.roles,
                    {
                        sport,
                        role,
                    },
                ],
            };
        });
    };


    function parseBirthDate(value: string | null): Date {
        if (!value) {
            return new Date(2000, 0, 1);
        }

        const [year, month, day] =
            value.split("-").map(Number);

        return new Date(
            year,
            month - 1,
            day
        );
    }

    function formatDateForBackend(date: Date): string {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function renderStep() {
        switch (step) {
            case 0:
                return NameAndSurname();

            case 1:
                return UsernameAndLogo();

            case 2:
                return BirthDateAndGender();

            case 3:
                return SportsAndRoles();

            case 4:
                return Location();

            default:
                return NameAndSurname();
        }
    }

    const handleNext = () => {
        const isValid = validateCurrentStep();

        if (!isValid) {
            return;
        }

        setStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 0));
    };

    function validateCurrentStep(): boolean {
        switch (step) {
            case 0:
                return validateNameAndSurname();

            case 1:
                return validateUsernameAndLogo();

            case 2:
                return validateBirthDateAndGender();

            case 3:
                return validateSportsAndRoles();

            case 4:
                return validateLocation();

            default:
                return true;
        }
    }

    /*Componenti e loro validazioni*/

    function NameAndSurname() {
        return (
            <OnBoardingContainer
                label={"Completa la registrazione"}
                content={
                    <AuthContent style={styles.inputFieldsContainer}>

                        <AuthTextField
                            label="Nome"
                            placeholder="Inserisci il tuo nome"
                            value={userData.firstName}
                            onChangeText={(text) =>
                                handleFieldChange("firstName", text)
                            }
                            autoCapitalize="words"
                            autoCorrect={false}
                            editable={!isLoading}
                            errorMessage={fieldErrors.firstName}
                        />

                        <AuthTextField
                            label="Cognome"
                            placeholder="Inserisci il tuo cognome"
                            value={userData.lastName}
                            onChangeText={(text) =>
                                handleFieldChange("lastName", text)
                            }
                            autoCapitalize="words"
                            autoCorrect={false}
                            editable={!isLoading}
                            errorMessage={fieldErrors.lastName}
                        />

                        <ButtonSolid
                            variant={"buttonRegister"}
                            textVariant={"textRegister"}
                            onPress={handleNext}
                            text="Continua"
                        />

                    </AuthContent>
                }
            />
        )

    }

    function validateNameAndSurname(): boolean {
        const errors: OnBoardingFieldErrors = {};

        const firstName = userData.firstName.trim();
        const lastName = userData.lastName.trim();

        if (!firstName) {
            errors.firstName = "Il nome è obbligatorio";
        } else if (firstName.length > 20) {
            errors.firstName = "Il nome non può superare i 50 caratteri";
        }

        if (!lastName) {
            errors.lastName = "Il cognome è obbligatorio";
        } else if (lastName.length > 20) {
            errors.lastName = "Il cognome non può superare i 50 caratteri";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function UsernameAndLogo() {
        return (
            <OnBoardingContainer
                label={"Completa la registrazione"}
                content={
                    <AuthContent style={styles.inputFieldsContainer}>

                        <AuthTextField
                            label="Username"
                            placeholder="Scegli il tuo username"
                            value={userData.username}
                            onChangeText={(text) =>
                                handleFieldChange(
                                    "username",
                                    text
                                )
                            }
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                            errorMessage={fieldErrors.username}
                        />

                        <LogoField
                            variant={"createUser"}
                            label="Foto profilo"
                            placeholderIcon="person-outline"
                            optional
                            value={profileLogo}
                            onChange={setProfileLogo}
                            disabled={isLoading}
                            errorMessage={fieldErrors.profileLogo}
                        />

                        <NavigationButtons/>

                    </AuthContent>
                }
            />
        );
    }

    function validateUsernameAndLogo(): boolean {
        const errors: OnBoardingFieldErrors = {};

        const username = userData.username.trim();

        if (!username) {
            errors.username = "L'username è obbligatorio";
        } else if (username.length > 20) {
            errors.username =
                "Lo username non deve superare i 20 caratteri";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function BirthDateAndGender() {
        return (
            <OnBoardingContainer
                label={"Completa la registrazione"}
                content={
                    <AuthContent style={styles.inputFieldsContainer}>

                        <Text style={styles.sectionLabel}>
                            Data di nascita
                        </Text>

                        <Pressable
                            style={[
                                styles.dateField,
                                fieldErrors.birthDate &&
                                styles.dateFieldError
                            ]}
                            onPress={() =>
                                setShowBirthDatePicker(true)
                            }
                        >
                            <Text
                                style={[
                                    styles.dateText,
                                    !userData.birthDate &&
                                    styles.datePlaceholder
                                ]}
                            >
                                {userData.birthDate
                                    ? userData.birthDate
                                    : "Seleziona la data di nascita"}
                            </Text>
                        </Pressable>

                        {fieldErrors.birthDate && (
                            <Text style={styles.fieldError}>
                                {fieldErrors.birthDate}
                            </Text>
                        )}

                        {showBirthDatePicker && (
                            <DateTimePicker
                                value={parseBirthDate(
                                    userData.birthDate
                                )}
                                mode="date"
                                maximumDate={new Date()}
                                onChange={(
                                    event: DateTimePickerEvent,
                                    selectedDate?: Date
                                ) => {
                                    setShowBirthDatePicker(false);

                                    if (
                                        event.type === "set" &&
                                        selectedDate
                                    ) {
                                        handleFieldChange(
                                            "birthDate",
                                            formatDateForBackend(
                                                selectedDate
                                            )
                                        );
                                    }
                                }}
                            />
                        )}

                        <Text style={styles.sectionLabel}>
                            Genere
                        </Text>

                        <View style={styles.optionsContainer}>
                            {Object.values(Gender).map(gender => {

                                const selected =
                                    userData.gender === gender;

                                return (
                                    <Pressable
                                        key={gender}
                                        style={[
                                            styles.option,
                                            selected && styles.optionSelected
                                        ]}
                                        onPress={() =>
                                            handleFieldChange(
                                                "gender",
                                                gender
                                            )
                                        }
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            selected && styles.optionTextSelected
                                        ]}>
                                            {GENDER_LABELS[gender]}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {fieldErrors.gender && (
                            <Text style={styles.fieldError}>
                                {fieldErrors.gender}
                            </Text>
                        )}

                        <NavigationButtons/>
                    </AuthContent>
                }
            />
        );
    }

    function validateBirthDateAndGender(): boolean {
        const errors: OnBoardingFieldErrors = {};

        if (!userData.birthDate) {
            errors.birthDate =
                "Seleziona la data di nascita";
        }

        if (userData.gender === null) {
            errors.gender =
                "Seleziona un genere";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function SportsAndRoles() {
        return (
            <OnBoardingContainer
                label={"Completa la registrazione"}
                content={
                    <AuthContent style={styles.inputFieldsContainer}>

                        <Text style={styles.sectionLabel}>
                            Quali sport pratichi?
                        </Text>

                        <View style={styles.optionsContainer}>
                            {Object.values(Sport).map(sport => {

                                const selected =
                                    userData.sports.includes(sport);

                                return (
                                    <Pressable
                                        key={sport}
                                        style={[
                                            styles.option,
                                            selected && styles.optionSelected
                                        ]}
                                        onPress={() =>
                                            toggleSport(sport)
                                        }
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            selected && styles.optionTextSelected
                                        ]}>
                                            {SPORT_LABELS[sport]}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {fieldErrors.sports && (
                            <Text style={styles.fieldError}>
                                {fieldErrors.sports}
                            </Text>
                        )}

                        {userData.sports.map(sport => (
                            <View
                                key={sport}
                                style={styles.rolesSection}
                            >

                                <Text style={styles.sectionLabel}>
                                    Ruolo · {SPORT_LABELS[sport]}
                                </Text>

                                <View style={styles.rolesContainer}>
                                    {SPORT_ROLES[sport].map(role => {

                                        const selected =
                                            userData.roles.some(
                                                selectedRole =>
                                                    selectedRole.sport === sport &&
                                                    selectedRole.role === role
                                            );

                                        return (
                                            <Pressable
                                                key={role}
                                                style={[
                                                    styles.roleOption,
                                                    selected &&
                                                    styles.optionSelected
                                                ]}
                                                onPress={() =>
                                                    toggleRole(sport, role)
                                                }
                                            >
                                                <Text style={[
                                                    styles.optionText,
                                                    selected && styles.optionTextSelected
                                                ]}>
                                                    {ROLE_LABELS[role]}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                            </View>
                        ))}

                        {fieldErrors.roles && (
                            <Text style={styles.fieldError}>
                                {fieldErrors.roles}
                            </Text>
                        )}

                        <NavigationButtons/>

                    </AuthContent>
                }
            />
        );
    }

    function validateSportsAndRoles(): boolean {
        const errors: OnBoardingFieldErrors = {};

        if (userData.sports.length === 0) {
            errors.sports =
                "Seleziona almeno uno sport";
        }

        if (userData.roles.length === 0) {
            errors.roles =
                "Seleziona almeno un ruolo";
        }

        const invalidRole = userData.roles.some(
            selectedRole =>
                !userData.sports.includes(selectedRole.sport) ||
                !SPORT_ROLES[selectedRole.sport].includes(
                    selectedRole.role
                )
        );

        if (invalidRole) {
            errors.roles =
                "Uno dei ruoli selezionati non è valido per lo sport";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function Location() {
        return (
            <OnBoardingContainer
                label={"Completa la registrazione"}
                content={
                    <AuthContent style={styles.inputFieldsContainer}>

                        <PositionField
                            variant={"createUser"}
                            value={userData.location}
                            onChange={(location) =>
                                handleFieldChange(
                                    "location",
                                    location
                                )
                            }
                            errorMessage={fieldErrors.location}
                        />

                        <NavigationButtons/>
                    </AuthContent>
                }
            />
        );
    }

    function validateLocation(): boolean {
        const errors: OnBoardingFieldErrors = {};

        setFieldErrors(errors);

        return true;
    }

    function NavigationButtons() {
        return (
            <View style={styles.btnContainer}>

                <ButtonSolid
                    style={styles.btn}
                    onPress={handleBack}
                    variant={"buttonLogin"}
                    textVariant={"textLogin"}

                    text={"Indietro"}/>


                <ButtonSolid
                    style={styles.btn}
                    onPress={handleNext}
                    text="Continua"
                    variant={"buttonRegister"}
                    textVariant={"textRegister"}
                />

            </View>
        );
    }

    return renderStep()

}


const styles = StyleSheet.create({

    inputFieldsContainer: {
        gap: 8,
    },

    apiError: {
        marginTop: 6,
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 400,
        color: colors.error,
        textAlign: "center",
    },

    loginBtn: {
        marginTop: 15,
    },

    sectionLabel: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 800,
        color: "#ffffff",
        marginTop: 14,
        marginLeft: 10,
        textAlign: "left"
    },

    optionsContainer: {
        gap: 8,
    },

    option: {
        minHeight: 48,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: "rgba(230,247,238,0.28)",
        borderColor: "#D0EBDD",
    },

    optionSelected: {
        backgroundColor: "#E6F7EE",
        borderColor: "#00A859",
    },

    optionText: {
        color: "#ffffff",
        fontSize: 15,
    },

    optionTextSelected: {
        color: "#000000",
        fontSize: 15,
    },

    rolesSection: {
        marginTop: 16,
        gap: 8,
    },

    rolesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    roleOption: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#D0EBDD",
    },

    btnContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    btn: {
        width: "45%"
    },


    fieldError: {
        fontSize: 13,
        color: colors.error,
    },

    dateField: {
        minHeight: 52,
        justifyContent: "center",
        paddingHorizontal: 16,

        borderWidth: 1,
        borderColor: "#D0EBDD",
        borderRadius: 14,

        backgroundColor: "#FFFFFF",
    },

    dateFieldError: {
        borderColor: colors.error,
    },

    dateText: {
        fontSize: 15,
        color: "#1C1C1C",
    },

    datePlaceholder: {
        color: "#8A8A8A",
    },


})


const GENDER_LABELS: Record<Gender, string> = {
    [Gender.MALE]: "Uomo",
    [Gender.FEMALE]: "Donna",
    [Gender.OTHER]: "Altro",
    [Gender.NOT_SPECIFIED]: "Preferisco non specificarlo",
};

const SPORT_LABELS: Record<Sport, string> = {
    [Sport.FOOTBALL]: "Calcio",
    [Sport.BEACH_VOLLEY]: "Beach Volley",
    [Sport.BASKETBALL]: "Basket",
};

const SPORT_ROLES: Record<Sport, SportRole[]> = {
    [Sport.FOOTBALL]: [
        SportRole.GOALKEEPER,
        SportRole.DEFENDER,
        SportRole.MIDFIELDER,
        SportRole.FORWARD,
        SportRole.FILL_FB,
    ],

    [Sport.BEACH_VOLLEY]: [
        SportRole.BLOCKER,
        SportRole.BEACH_DEFENDER,
        SportRole.FILL_BV,
    ],

    [Sport.BASKETBALL]: [
        SportRole.POINT_GUARD,
        SportRole.SHOOTING_GUARD,
        SportRole.SMALL_FORWARD,
        SportRole.POWER_FORWARD,
        SportRole.CENTER,
        SportRole.FILL_BK,
    ],
};

const ROLE_LABELS: Record<SportRole, string> = {
    [SportRole.GOALKEEPER]: "Portiere",
    [SportRole.DEFENDER]: "Difensore",
    [SportRole.MIDFIELDER]: "Centrocampista",
    [SportRole.FORWARD]: "Attaccante",
    [SportRole.FILL_FB]: "Jolly",

    [SportRole.BLOCKER]: "Blocker",
    [SportRole.BEACH_DEFENDER]: "Difensore",
    [SportRole.FILL_BV]: "Jolly",

    [SportRole.POINT_GUARD]: "Playmaker",
    [SportRole.SHOOTING_GUARD]: "Guardia",
    [SportRole.SMALL_FORWARD]: "Ala piccola",
    [SportRole.POWER_FORWARD]: "Ala grande",
    [SportRole.CENTER]: "Centro",
    [SportRole.FILL_BK]: "Jolly",
};