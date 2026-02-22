    import { getRequestConfig } from "next-intl/server";
    import { routing } from "./routing";

    type Locale = (typeof routing.locales)[number];
    
    function isLocale(locale: string): locale is Locale {
    return routing.locales.includes(locale as Locale);
    }

    export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;

    const finalLocale: Locale =
        locale && isLocale(locale) ? locale : routing.defaultLocale;

    return {
        locale: finalLocale,
        messages: (await import(`../messages/${finalLocale}.json`)).default,
    };
    });
        