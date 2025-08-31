import fs from "fs-extra";
import {generateRandomString} from "../../utils/string"

export async function executeModule(ModuleString:string):Promise<boolean>{
    try {
        const PriceModule = await (import(`../storage/${ModuleString}`));
        await PriceModule();
        return true;   
    } catch (error) {
        return false
    }
}
export async function createNewModule(context:string):Promise<string>{
    const fileString = generateRandomString(20);
    await fs.writeFile(`./src/modules/storage/${fileString}.ts`, context, "utf-8");
    return fileString;
}