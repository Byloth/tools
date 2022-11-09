import axios from "axios";
import { defineStore } from "pinia";

import useUser from "./user";

export default defineStore("packages", () =>
{
    const user = useUser();

    const getAll = () =>
    {
        if (user.token === undefined)
        {
            throw new Error("You must be logged in.");
        }

        axios.get("https://api.github.com/user/packages", {
            params: { "package_type": "container" },
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `token ${user.token}`
            }
        });
    };

    return { getAll };
});
