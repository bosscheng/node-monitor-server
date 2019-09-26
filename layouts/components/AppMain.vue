<template>
    <section class="app-main" style="min-height: 100%;">
        <transition name="fade-transform" mode="out-in">
          <nuxt />
        </transition>
    </section>
</template>

<script>
    /**
     * app main 主要显示核心。
     */
    export default {
        computed: {
            // key() {
            //     // 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同
            //     return this.$route.fullPath
            // }
        }
    }
</script>
