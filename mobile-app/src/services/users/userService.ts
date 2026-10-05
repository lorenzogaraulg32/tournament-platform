import {UserCreationRequest, UserInfo, UserModRequest} from "@/src/services/users/userDTO";
import {authenticatedFetch} from "@/src/services/fetchService";
import {File, Paths} from "expo-file-system";
import {API_URL} from "@/src/services/common";


export async function createUser(
    request: UserCreationRequest
): Promise<UserInfo> {

    const {avatar, ...userRequest} = request;

    const userFile = new File(
        Paths.cache,
        `user-${Date.now()}.json`
    );

    try {
        userFile.create({overwrite: true});

        userFile.write(
            JSON.stringify(userRequest)
        );

        const formData = new FormData();

        formData.append("user", userFile, userFile.name);

        if (avatar !== undefined && avatar !== null) {
            const avatarFile = new File(avatar.uri);

            formData.append(
                "avatar",
                avatarFile,
                avatar.fileName ?? avatarFile.name
            );
        }

        const response = await authenticatedFetch(
            `${API_URL}/users/me`,
            {
                method: "POST",
                body: formData,
            }
        );

        return await response.json() as UserInfo;

    } finally {
        if (userFile.exists) {
            userFile.delete();
        }
    }
}


export async function checkUsernameAlreadyExists(trimmedName: string) {
    const response = await authenticatedFetch(
        `${API_URL}/tournaments/nameCheck/${trimmedName}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

}

export async function fetchUser(
    id: string
): Promise<UserInfo> {

    const response = await authenticatedFetch(
        `${API_URL}/users/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const user: UserInfo = await response.json() as UserInfo;

    return {
        ...user,
        avatar: {
            uri: `${API_URL}/users/${encodeURIComponent(user.id)}/avatar`,
        }
    }
}


export async function modUser(request: UserModRequest): Promise<UserInfo> {

    const {avatar, ...userRequest} = request;


    const requestBody = {
        ...userRequest,
        removeAvatar: avatar === null,
    };


    const userFile = new File(
        Paths.cache,
        `user-update-${Date.now()}.json`
    );


    try {
        userFile.create({overwrite: true});

        userFile.write(
            JSON.stringify(requestBody)
        );

        const formData = new FormData();

        formData.append("user", userFile, userFile.name);


        if (avatar) {
            const avatarFile = new File(avatar.uri);

            formData.append(
                "avatar",
                avatarFile,
                avatar.fileName
            );
        }

        const response = await authenticatedFetch(
            `${API_URL}/users/me`,
            {
                method: "PATCH",
                body: formData,
            }
        );

        return await response.json() as UserInfo;

    } finally {
        if (userFile.exists) {
            userFile.delete();
        }
    }
}

export async function deleteUser() {

    await authenticatedFetch(
        `${API_URL}/users/me`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        }
    );
}



