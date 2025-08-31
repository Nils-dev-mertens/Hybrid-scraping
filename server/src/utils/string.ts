/**
 * d
 * @param l d
 * @returns d
 */
export function generateRandomString(l:number):string{
    let r:string = "";
    const c:string[] = [..."qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"];
    for (let i = 0; i < l; i++) {
        r += c[Math.floor(Math.random()*c.length)];   
    }
    return r;
}