import {StyleSheet, View} from "react-native";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";
import React, {useState} from "react";
import {paletteVariants} from "@/src/constants/palette/PaletteManager";
import ProfilePasswordField from "@/src/components/pagesComponents/profile/modifyAuth/sections/ProfilePasswordField";

type ChangeEmailSectionProps = {
    error?: string;
    loading: boolean
    onBack: () => void;
    changePassword: (password: string, oldPassword: string) => Promise<void>;
    hasInternalPassword: boolean
};

export default function ChangePasswordSection({
                                                  onBack,
                                                  loading,
                                                  error,
                                                  changePassword,
                                                  hasInternalPassword,
                                              }: ChangeEmailSectionProps) {

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const {palette} = paletteVariants["profile"];

    const [internalError, setInternalError] = useState("");


    function checkPasswordInternal(): boolean {

        if (hasInternalPassword && !oldPassword) {
            setInternalError("Inserisci la password attuale");
            return false;
        }

        if (password.length < 8 || password.length > 64) {
            setInternalError("La password deve contenere tra 8 e 64 caratteri");
            return false;
        }

        if (!/\S/.test(password)) {
            setInternalError("La password non può contenere solo spazi");
            return false;
        }

        if (password !== confPassword) {
            setInternalError("Le due password non coincidono");
            return false;
        }

        return true;
    }

    return (
        <View>
            {hasInternalPassword &&
                <ProfilePasswordField
                    label="Vecchia Password"
                    placeholder="Inserisci la password vecchia"
                    value={oldPassword}
                    onChangeText={(pass) => {
                        setOldPassword(pass)
                        setInternalError("")
                    }}
                    errorMessage={""}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />
            }
            <ProfilePasswordField
                label="Password"
                placeholder="Inserisci la password"
                value={password}
                onChangeText={(pass) => {
                    setPassword(pass)
                    setInternalError("")
                }}
                errorMessage={""}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
            />

            <ProfilePasswordField
                label="Conferma Password"
                placeholder="Conferma la Password"
                value={confPassword}
                onChangeText={(pass) => {
                    setConfPassword(pass)
                    setInternalError("")
                }}
                errorMessage={internalError ? internalError : error}

                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
            />

            <FormStepNavigation
                onNext={async () => {
                    if (checkPasswordInternal()) {
                        await changePassword(password, oldPassword)
                        onBack()
                    }
                }}
                nextLabel={"Modifica"}
                nextVariant={"profile"}
                onBack={onBack}
                loading={loading}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    infoContainer: {
        paddingHorizontal: 8,
        marginVertical: 16,
    },

    infoText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
    },
});