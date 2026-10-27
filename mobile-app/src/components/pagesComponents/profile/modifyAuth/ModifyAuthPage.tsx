import FormLayout from "@/src/components/common/layout/FormLayout";
import FormHeader from "@/src/components/common/layout/headers/FormHeader";
import {Dispatch, SetStateAction, useState} from "react";
import MainSection from "@/src/components/pagesComponents/profile/modifyAuth/sections/MainSection";
import ChangeEmailSection from "@/src/components/pagesComponents/profile/modifyAuth/sections/ChangeEmailSection";
import ChangePasswordSection from "@/src/components/pagesComponents/profile/modifyAuth/sections/ChangePasswordSection";
import ExternalSection from "@/src/components/pagesComponents/profile/modifyAuth/sections/ExternalSection";

export type ModifyAuthSections = "changeEmail" | "changePassword" | "external" | "main"

type ModifyAuthProps = {
    loading: boolean,
    error?: string,
    setError: Dispatch<SetStateAction<string | undefined>>;
    oldEmail: string,
    changeEmail: (email: string) => Promise<void>;
    hasInternalPassword: boolean,
    changePassword: (password: string, oldPassword: string) => Promise<void>;
}

//Todo: ancora da fare completamente la sezione per scollegare o collegare un account esterno
export default function ModifyAuthPage({
                                           loading,
                                           error,
                                           setError,
                                           changeEmail,
                                           oldEmail,
                                           hasInternalPassword,
                                           changePassword
                                       }: ModifyAuthProps) {

    const [currentSection, setCurrentSection] = useState<ModifyAuthSections>("main");

    function changeSection(section: ModifyAuthSections) {
        setError(undefined);
        setCurrentSection(section);
    }

    function renderSection() {
        switch (currentSection) {
            case "main":
                return (
                    <MainSection
                        onChangeSection={changeSection}
                    />
                );

            case "changeEmail":
                return (
                    <ChangeEmailSection
                        onBack={() => changeSection("main")}
                        changeEmail={changeEmail}
                        oldEmail={oldEmail}
                        error={error}
                        loading={loading}
                        hasInternalPassword={hasInternalPassword}
                    />
                );

            case "changePassword":
                return (
                    <ChangePasswordSection
                        onBack={() => changeSection("main")}
                        loading={loading}
                        changePassword={changePassword}
                        error={error}
                        hasInternalPassword={hasInternalPassword}
                    />
                );

            case "external":
                return (
                    <ExternalSection
                        onBack={() => changeSection("main")}
                    />
                );
        }
    }

    return (
        <FormLayout
            variant={"profile"}
            header={
                <FormHeader
                    title={"Sicurezza e accesso"}
                    subtitle={"Gestisci le credenziali e i metodi di accesso al tuo account."}
                    variant={"profile"}
                />
            }
        >
            {renderSection()}
        </FormLayout>
    )


}

