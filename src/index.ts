import { Command } from "commander"
import { version } from "../package.json"
import { create } from "./command/create"

const program = new Command("dawei");
program.version(version, "-v,--version");

program.command("create")
    .description("创建一个新项目")
    .argument("[name]", "项目名称")
    .action(async (dirName?:string) => {
        create(dirName);
    });

program.parse();