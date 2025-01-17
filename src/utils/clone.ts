import simpleGit, { SimpleGitOptions } from "simple-git"
const createLogger = require("progress-estimator")
import chalk from "chalk"

// 初始化进度条
const logger = createLogger({
    spinner: {
        interval: 200,  //变化时间 默认毫秒
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
            chalk.green(item)
        )
    }
})
const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),     //当前工作目录
    binary: 'git',              //git命令路径
    maxConcurrentProcesses: 5,  //最大并发进程
    // trimmed: false,
}

export const clone = async (url: string, projectName: string, options: string[]) => {
    const git = simpleGit(gitOptions);
    try {
        await logger(git.clone(url, projectName, options), "代码下载中...", {
            estimated: 8000,//预估下载时间
        })
        console.log()
        console.log(chalk.blueBright(`==================================`))
        console.log(chalk.blueBright(`=== 欢迎使用 dawei-cli 脚手架 ===`))
        console.log(chalk.blueBright(`==================================`))
        console.log()
        console.log(chalk.green("项目创建成功！"));
        console.log(`执行以下命令启动项目：`)
        console.log(`cd ${chalk.blueBright(projectName)}`)
        console.log(`${chalk.yellow('pnpm')} install`)
        console.log(`${chalk.yellow('pnpm')} run dev`)
    } catch (error) {
        console.error(chalk.red("代码下载失败！"))
        console.log(error);
    }
}