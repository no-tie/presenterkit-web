import posthog from 'posthog-js'


export const initDownload = () => {
    const btnNav = document.getElementById('dwld-btn-nav')
    const btnHero = document.getElementById('dwld-btn-hero')

    const version = '1.0.4'
    const win_url = `https://github.com/no-tie/presenterkit-app/releases/download/${version}/PresenterKit-Setup-${version}.exe`
    const mac_url = `https://github.com/no-tie/presenterkit-app/releases/download/${version}/PresenterKit-${version}-arm64.dmg`
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