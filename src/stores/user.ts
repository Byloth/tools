import { ref } from "vue";
import { defineStore } from "pinia";

import { jsonLocalStorage } from "../utils";

export default defineStore("user", () =>
{
    const token = ref<string | undefined>(jsonLocalStorage.get<string>("user:token"));

    const setToken = (value?: string) =>
    {
        token.value = value;

        jsonLocalStorage.set("user:token", value);
    };

    return { token, setToken };
});
