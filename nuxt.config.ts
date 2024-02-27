import vue from '@vitejs/plugin-vue';
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/device'
    ],
    build: {
        transpile: ['vuetify']
    },
    css: ["assets/styles/index.scss"],
    i18n: {
        locales: [
            {code: 'en', file: 'en-EN.json', dir: 'ltr'}
        ],
        defaultLocale: 'en',
        lazy: true,
        langDir: 'lang/',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root', // recommended
        },
        vueI18n: {
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            availableLocales: ['en'],
        },
    }
})
