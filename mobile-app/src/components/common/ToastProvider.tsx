import {createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState,} from "react";
import {StyleSheet, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Toast from "@/src/components/common/Toast"; // Adatta il percorso

type ToastData = {
    message: string;
    success: boolean;
};

type ToastContextValue = {
    showToast: (message: string, success: boolean) => void;
    hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export default function ToastProvider({
                                          children,
                                      }: {
    children: ReactNode;
}) {
    const [toast, setToast] = useState<ToastData | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const insets = useSafeAreaInsets();

    const hideToast = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setToast(null);
    }, []);

    const showToast = useCallback((message: string, success: boolean) => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }

        setToast({message, success});

        timerRef.current = setTimeout(() => {
            setToast(null);
            timerRef.current = null;
        }, 3500);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <ToastContext.Provider value={{showToast, hideToast}}>
            <View style={styles.container}>
                {children}

                {toast && (
                    <View
                        pointerEvents="none"
                        style={[
                            styles.overlay,
                            {bottom: insets.bottom + 70 + 24},
                        ]}
                    >
                        <Toast
                            message={toast.message}
                            success={toast.success}
                        />
                    </View>
                )}
            </View>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast deve essere usato dentro ToastProvider.");
    }

    return context;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        position: "absolute",
        left: 16,
        right: 16,
        zIndex: 1000,
        elevation: 10,
    },
});