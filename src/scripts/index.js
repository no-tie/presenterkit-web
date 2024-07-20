import { init } from './scene'
import { download } from './download'
import { initPosthog } from './posthog'


download()
init()
initPosthog()