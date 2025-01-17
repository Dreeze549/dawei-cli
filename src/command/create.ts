import { input, select } from "@inquirer/prompts"
import { clone } from "../utils/clone"
import path from "path"
import fs from "fs-extra"
import { name, version } from "../../package.json"
import axios, { AxiosResponse } from "axios"
import { gt } from "lodash"
import chalk from "chalk"

export interface TemplateInfo {
    name: string, //模版名称
    downloadUrl: string, //模版下载地址
    description: string, //模版描述
    branch: string, //模版分支
}

export const templates: Map<string, TemplateInfo> = new Map(
    [
        ["Vite-Vue3-Typescript-template", {
            name: "Vite-Vue3-Typescript-template",
            downloadUrl: "git@gitee.com:sohucw/admin-pro.git",
            description: "Vue3技术栈开发模版",
            branch: "dev11"
        }],
        ["Vite-temp", {
            name: "Vite-Vue3-Typescript-template",
            downloadUrl: "git@gitee.com:sohucw/admin-pro.git",
            description: "Vue3技术栈开发模版",
            branch: "dev10"
        }]
    ]
)

// 检测文件是否存在
export function isOverwrite(fileName: string) {
    console.warn(`文件 ${fileName} 已存在！`);
    return select({
        message: "是否覆盖?",
        choices: [
            { name: "覆盖", value: true },
            { name: "取消", value: false },
        ],
    })
}

export const getNpmInfo = async (npmName: string) => {
    const npmUrl = `https://registry.npmjs.org/${name}`;
    let res = {};
    try {
        res = await axios.get(npmUrl);
    } catch (err) {
        console.error(err);
    }
    return res;
}

export const getNpmLatestVersion = async (name: string) => {
    const { data } = await getNpmInfo(name) as AxiosResponse;
    return data["dist-tags"].latest;
}

// 检测是否版本更新
export const checkVersion = async (name: string, version: string) => {
    const latestVersion = await getNpmLatestVersion(name)
    const need=gt(latestVersion,version)
    if(need){
        console.warn(`检测到h_dawei_cli最新版本:${chalk.blackBright(latestVersion)},当前版本是:${chalk.blackBright(version)}`)
        console.log(`可使用:${chalk.yellow("npm install h_dawei_cli@latest")},或者使用:${chalk.yellow("h_dawei_cli update")}更新`);
    }
    return need;
}



export async function create(projectName?: string) {
    //初始化模版列表
    const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
        const [name, info] = item
        return {
            name,
            value: name,
            description: info.description
        }
    })
    if (!projectName) {
        projectName = await input({ message: "请输入项目名称" })
    }

    // 如果文件夹存储，则提升覆盖
    const filePath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(projectName)
        if (run) {
            await fs.remove(filePath);
        } else {
            return;  //不覆盖直接结束
        }
    }

    //检查版本更新
    await checkVersion(name, version)

    const templateName = await select({
        message: "请选择模版",
        choices: templateList
    })
    const info = templates.get(templateName);
    console.log(info);

    if (info) {
        //克隆远程仓库
        clone(info.downloadUrl, projectName, ["-b", info.branch])
    }
}