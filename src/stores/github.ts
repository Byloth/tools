import axios from "axios";
import { SmartAsyncIterator } from "@byloth/core";
import { defineStore } from "pinia";

import useUser from "./user";

const _getNextPageUrl = (linkHeader?: string): string | undefined =>
{
    if (linkHeader === undefined) { return undefined; }

    const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    if (match === null) { return undefined; }

    return match[1];
};

export default defineStore("github", () =>
{
    const user = useUser();

    const _getHeaders = () =>
    {
        if (user.token === undefined)
        {
            throw new Error("You must be logged in.");
        }

        return {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${user.token}`
        };
    };

    const _fetchPaginated = (url: string, params?: Record<string, string>) =>
    {
        const headers = _getHeaders();

        return new SmartAsyncIterator(async function* ()
        {
            let nextUrl: string | undefined = url;
            let nextParams: Record<string, string | number> | undefined = { ...params, "per_page": 100 };

            while (nextUrl !== undefined)
            {
                const response = await axios.get(nextUrl, { params: nextParams, headers });

                for (const item of response.data)
                {
                    yield item;
                }

                nextUrl = _getNextPageUrl(response.headers["link"]);
                nextParams = undefined;
            }
        });
    };

    const getContainers = () =>
    {
        return _fetchPaginated("https://api.github.com/user/packages", { "package_type": "container" });
    };

    const getContainerImages = (containerName: string) =>
    {
        containerName = encodeURIComponent(containerName);

        return _fetchPaginated(
            `https://api.github.com/user/packages/container/${containerName}/versions`
        );
    };

    const deleteContainerImage = async (containerName: string, imageId: string) =>
    {
        const headers = _getHeaders();
        containerName = encodeURIComponent(containerName);

        // eslint-disable-next-line max-len
        return await axios.delete(`https://api.github.com/user/packages/container/${containerName}/versions/${imageId}`, { headers });
    };

    return { getContainers, getContainerImages, deleteContainerImage };
});
