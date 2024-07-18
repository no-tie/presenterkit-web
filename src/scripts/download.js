export const download = () => {
    window.onload = (e) => {
        const btn1 = document.getElementById('dwld-btn-1')
        const btn2 = document.getElementById('dwld-btn-2')

        const win_url = 'https://github.com/no-tie/presenterkit-app/releases/download/1.0.0/PresenterKit.Setup.1.0.0.exe'
        const mac_url = 'https://github.com/no-tie/presenterkit-app/releases/download/1.0.0/PresenterKit-1.0.0-arm64.dmg'
        let dwld_url = ''

        const UA = navigator.userAgent

        if (UA.includes('Win64') || UA.includes('Windows')) { dwld_url = win_url }
        else if (UA.includes('Mac') || UA.includes('Macintosh')) { dwld_url = mac_url }
        else {
            [btn1, btn2].map((btn) => {
                btn.style.backgroundColor = '#7676803E'
                btn.style.color = '#EBEBF54D'
                btn.style.cursor = 'default'
                btn.classList.remove('btn-hover')
                btn.disabled = true
            })
        }

        btn1.addEventListener('click', () => window.open(dwld_url))
        btn2.addEventListener('click', () => window.open(dwld_url))
    }
}