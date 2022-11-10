import axios from "axios";
import { defineStore } from "pinia";

import useUser from "./user";

export default defineStore("github", () =>
{
    const user = useUser();

    const getContainers = async () =>
    {
        if (user.token === undefined)
        {
            throw new Error("You must be logged in.");
        }

        return await axios.get("https://api.github.com/user/packages", {
            params: { "package_type": "container" },
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `token ${user.token}`
            }
        }).then((response) => response.data);
    };

    const getContainerImages = async (containerName: string) =>
    {
        if (user.token === undefined)
        {
            throw new Error("You must be logged in.");
        }

        containerName = encodeURIComponent(containerName);

        return await axios.get(`https://api.github.com/user/packages/container/${containerName}/versions`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `token ${user.token}`
            }
        }).then((response) => response.data);
    };

    const deleteContainerImage = async (containerName: string, imageId: string) =>
    {
        if (user.token === undefined)
        {
            throw new Error("You must be logged in.");
        }

        containerName = encodeURIComponent(containerName);

        // eslint-disable-next-line max-len
        return await axios.delete(`https://api.github.com/user/packages/container/${containerName}/versions/${imageId}`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `token ${user.token}`
            }
        });
    };

    return { getContainers, getContainerImages, deleteContainerImage };
});
