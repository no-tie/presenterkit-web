import posthog from 'posthog-js'


export const initCTA = () => {
    const btnNav = document.getElementById('dwld-btn-nav')
    const btnHero = document.getElementById('dwld-btn-hero')

    const goTo = (from) => {
        posthog.capture('Clicked download', { from })
        window.open('https://app.presenterkit.app', '_self')
    }

    btnNav.addEventListener('click', () => goTo('Navbar'))
    btnHero.addEventListener('click', () => goTo('Hero'))
}