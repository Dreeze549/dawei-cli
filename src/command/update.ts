import chalk from "chalk";
import ora from "ora";
import { exec } from "child_process"

const spinner = ora({
    text: "h_dawei_cli 正在更新....",
    spinner: {
        interval: 300,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
            chalk.blue(item)
        )
    }
})

export function update() {
    spinner.start();
    exec("npm install h_dawei_cli@latest -g",(error)=>{
        spinner.stop();
        if(!error){
            console.log(chalk.green("h_dawei_cli 更新成功！"));
        }else{
            console.log(chalk.red("h_dawei_cli 更新失败！"));
        }
    })
}