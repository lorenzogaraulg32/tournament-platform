import {StyleSheet,  View} from "react-native";
import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderPage from "@/src/components/common/headers/HeaderPage";

export default function TournamentsPage() {
    return (
        <PageLayout
            header={
                <HeaderContainer variant="purple">
                    <HeaderPage
                        label="JoinCup"
                        title="Tornei"
                        subtitle="Gestisci i tuoi tornei e partecipa a nuovi"/>
                </HeaderContainer>

            }
            contentStyle={styles.content}>
            <View></View>

        </PageLayout>
    );
}


const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 18,
        paddingHorizontal: 5,
    },
})

