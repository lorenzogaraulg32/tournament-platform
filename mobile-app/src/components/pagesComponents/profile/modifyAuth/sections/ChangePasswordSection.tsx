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

};

export default function ChangeEmailSection({
                                               onBack,
                                               loading,
                                               error,
                                               changePassword,
                                           }: ChangeEmailSectionProps) {

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const {palette} = paletteVariants["profile"];

    const [internalError, setInternalError] = useState("");


    function checkPasswordInternal(): boolean {
        if (password !== confPassword) {
            setInternalError("Le due password non coincidono")
            return false;
        }
        return true;
    }

    return (
        <View>

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