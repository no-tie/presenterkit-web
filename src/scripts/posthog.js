import posthog from 'posthog-js'


export const initPosthog = () => {
    window.onload = () => {
        if (window.location.host.includes('presenterkit.netlify.app')) {
            posthog.init('phc_rd1Kqcal2KSP9Fk0R5hGM1LtlEJX3k1Y7B4DcsrHBGH',
                { api_host: 'https://us.i.posthog.com', person_profiles: 'identified_only' }
            )
        }
    }
}