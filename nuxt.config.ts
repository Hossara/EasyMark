// https://nuxt.com/docs/api/configuration/nuxt-config
import cp, {spawn} from "node:child_process"

let hookedProcessExit = false

declare global {
  namespace NodeJS {
    interface Process {
      electronApp: cp.ChildProcess
    }
  }
}

interface PidTree {
  pid: number
  ppid: number
  children?: PidTree[]
}

const killTree = (tree: PidTree) => {
  if (tree.children) {
    for (const child of tree.children) {
      killTree(child)
    }
  }

  try {
    process.kill(tree.pid) // #214
  } catch { /* empty */ }
}


const pidTree = (tree: PidTree) => {
  const command = process.platform === 'darwin'
      ? `pgrep -P ${tree.pid}` // Mac
      : `ps -o pid --no-headers --ppid ${tree.ppid}` // Linux

  try {
    const childs = cp
        .execSync(command, { encoding: 'utf8' })
        .match(/\d+/g)
        ?.map(id => +id)

    if (childs) {
      tree.children = childs.map(cid => pidTree({ pid: cid, ppid: tree.pid }))
    }
  } catch { }

  return tree
}

const treeKillSync = (pid: number) => {
  if (process.platform === 'win32') {
    cp.execSync(`taskkill /pid ${pid} /T /F`)
  } else {
    killTree(pidTree({ pid, ppid: process.pid }))
  }
}

const exitElectron = async () => {
  if (process.electronApp) {
    process.electronApp.removeAllListeners()
    treeKillSync(process.electronApp.pid!)
  }
}

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  hooks: {
    "listen": async () => {
      await exitElectron()

      const build_process = spawn("tsc", ['electron/*.ts', '--outDir', '.dist.electron', '--module', 'nodenext', '--moduleResolution', 'nodenext'], {
        stdio: 'inherit',
        shell: true
      })

      build_process.once("exit", () => {
        console.log("App built done")
      })

      if (!hookedProcessExit) {
        hookedProcessExit = true
        process.once('exit', exitElectron)
      }

      process.electronApp = spawn("electron", ['.', '--no-sandbox'], { stdio: 'inherit' })

      process.electronApp.once("exit", process.exit)
    },
  },
  ssr: false,
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})