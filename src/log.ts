export class Log {
    private _timestamp!: Date;
    private _fields!: Map<string, any>;

    constructor(timestamp: Date, fields: Map<string, any>) {
        this._timestamp = timestamp;
        this._fields = fields;
    }

    protected GetTimestamp(): Date {
        return this._timestamp;
    }

    protected GetFields(): Map<string, any> {
        return this._fields;
    }
}

export default Log;