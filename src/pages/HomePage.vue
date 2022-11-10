<script lang="ts" setup>
    /* eslint-disable @typescript-eslint/no-explicit-any */

    import { onMounted } from "vue";

    import useGithub from "../stores/github";

    const github = useGithub();

    onMounted(async () =>
    {
        const containers = await github.getContainers();

        for (const container of containers)
        {
            const images = await github.getContainerImages(container.name);
            const imagesToRemove = images.filter((image: any) => image.metadata.container.tags.length === 0);

            if (imagesToRemove.length === 0)
            {
                console.log(`No more images to remove for '${container.name}' package.`);

                continue;
            }

            for (const image of imagesToRemove)
            {
                github.deleteContainerImage(container.name, image.id);
            }
        }
    });
</script>

<template>
    <div></div>
</template>

<style lang="scss" scoped>
</style>
