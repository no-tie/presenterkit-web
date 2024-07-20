import posthog from 'posthog-js'


export const download = () => {
    window.onload = (e) => {
        const btnNav = document.getElementById('dwld-btn-nav')
        const btnHero = document.getElementById('dwld-btn-hero')

        const win_url = 'https://github.com/no-tie/presenterkit-app/releases/download/1.0.0/PresenterKit.Setup.1.0.0.exe'
        const mac_url = 'https://github.com/no-tie/presenterkit-app/releases/download/1.0.0/PresenterKit-1.0.0-arm64.dmg'
        let dwld_url = ''

        const UA = navigator.userAgent

        if (UA.includes('Win64') || UA.includes('Windows')) { dwld_url = win_url }
        else if (UA.includes('Mac') || UA.includes('Macintosh')) { dwld_url = mac_url }
        else {
            [btnNav, btnHero].map((btn) => {
                btn.style.backgroundColor = '#7676803E'
                btn.style.color = '#EBEBF54D'
                btn.style.cursor = 'default'
                btn.classList.remove('btn-hover')
                btn.disabled = true
            })
        }

        btnNav.addEventListener('click', () => { posthog.capture('Clicked download', { from: 'Navbar' }); window.open(dwld_url) })
        btnHero.addEventListener('click', () => { posthog.capture('Clicked download', { from: 'Hero' }); window.open(dwld_url) })
    }
}