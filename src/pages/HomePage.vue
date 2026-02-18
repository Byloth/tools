<script lang="ts" setup>
    /* eslint-disable @typescript-eslint/no-explicit-any */

    import { onMounted } from "vue";

    import useGithub from "../stores/github";

    const github = useGithub();

    onMounted(async () =>
    {
        for await (const container of github.getContainers())
        {
            const imagesToRemove = github.getContainerImages(container.name)
                .filter((image: any) =>
                {
                    if (image.metadata.container.tags.length === 0) { return true; }
                    if (image.metadata.container.tags.length === 1)
                    {
                        const tag = image.metadata.container.tags[0];
                        const date = new Date(tag);
                        if (isNaN(date.getTime())) { return false; }

                        const limit = new Date("2026-01-01");
                        return (date < limit);
                    }
                });

            for await (const image of imagesToRemove)
            {
                github.deleteContainerImage(container.name, image.id);
            }

            console.log(`No more images to remove for '${container.name}' package.`);
        }
    });
</script>

<template>
    <div></div>
</template>

<style lang="scss" scoped>
</style>
