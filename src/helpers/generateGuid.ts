export abstract class GenerateGuid {
    public static GetHexString(): string {
        return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)).toString(16);
    }
}

export default GenerateGuid