import { GenerateGuid } from "./helpers/generateGuid";
import * as constants from "./helpers/constants";
import { version } from "../package.json"

export class LightStepTracerOptions {
    private _tracerGuid: string;
    private _accessToken?: string;
    private _shouldRun: boolean = true;
    private _satelliteHost: string = "localhost";
    private _satellitePort: number = 8360;
    private _useHttps: boolean = false;
    private _reportPeriod: number = 5000;
    private _reportTimeout: number = 30000;
    private _reportMaxSpans?: number;
    private _globalTags: Map<string, any>;
    private _enableMetaEvents: boolean = false;

    get accessToken(): string | undefined {
        return this._accessToken;
    }
    
    get tracerGuid(): string {
        return this._tracerGuid;
    }

    get satelliteHost(): string {
        return this._satelliteHost;
    }
    
    get satellitePort(): number {
        return this._satellitePort;
    }

    get useHttps(): boolean {
        return this._useHttps;
    }

    get reportPeriod(): number {
        return this._reportPeriod
    }

    get reportTimeout(): number {
        return this._reportTimeout
    }

    get reportMaxSpans(): number | undefined {
        return this._reportMaxSpans
    }

    get globalTags(): Map<string, any> {
        return this._globalTags
    }

    get enableMetaEvents(): boolean {
        return this._enableMetaEvents
    }

    get shouldRun(): boolean {
        return this._shouldRun;
    }

    constructor() {
        this._globalTags = this.initializeTags();
        this._tracerGuid = GenerateGuid.GetHexString();
    }
    
    public WithAccessToken(token: string): LightStepTracerOptions {
        this._accessToken = token;
        return this;
    }

    public WithAutomaticReportingDisabled(): LightStepTracerOptions {
        this._shouldRun = false;
        return this;
    }

    public WithSatelliteHost(host: string): LightStepTracerOptions {
        this._satelliteHost = host;
        return this;
    }

    public WithSatellitePort(port: number): LightStepTracerOptions {
        this._satellitePort = port;
        return this;
    }

    public WithHttps(): LightStepTracerOptions {
        this._useHttps = true;
        return this;
    }

    public WithTags(tags: Map<string, any>): LightStepTracerOptions {
        tags.forEach((k,v) => this._globalTags.set(k, v));
        return this;
    }

    //todo: finish

    private initializeTags(): Map<string, any> {
        return new Map<string, any>([
            [constants.LS_TRACER_PLATFORM_KEY, this.getPlatform()],
            [constants.LS_TRACER_VERSION_KEY, this.getVersion()],
            [constants.LS_TRACER_VERSION_KEY, version],
            [constants.LS_COMPONENT_KEY, this.getComponent()],
            [constants.LS_COMMAND_LINE_KEY, this.getCommandLine()]
        ])
    }

    private getPlatform(): string {
        return constants.LS_TRACER_PLATFORM_VALUE_NODE;
    }

    private getVersion(): string {
        return 'todo'
    }

    private getComponent(): string {
        return 'todo'
    }
    
    private getCommandLine(): string {
        return 'todo'
    }
}

export default LightStepTracerOptions
