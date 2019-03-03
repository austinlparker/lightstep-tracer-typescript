import { Span, SpanContext, Tracer } from 'opentracing';
import { LightStepTracer } from './tracer';
import LightStepSpanContext from './spanContext';
import Log from './log';

export class LightStepSpan extends Span {
    private _operationName!: string;
    private _tags!: Map<string, any>;
    private _logs: Log[] = new Array();
    private _spanContext!: LightStepSpanContext;
    private _lightStepTracer!: LightStepTracer;
    private _startTimeStamp!: Date;
    private _finishTimeStamp!: Date;
    private _finished: boolean = false;
    private _parentSpanId?: string;

    constructor(
        tracer: LightStepTracer, 
        operationName: string, 
        context: LightStepSpanContext, 
        startTime?: Date,
        tags?: Map<string, any>
        ) {
            super();
            this._operationName = operationName;
            this._lightStepTracer = tracer;
            this._spanContext = context;
            this._startTimeStamp = startTime || new Date();
            this._tags = tags || new Map<string, any>()
    }

    public SetParentId(id: string): void {
        this._parentSpanId = id;
    }

     // By default returns a no-op SpanContext.
     protected _context(): SpanContext {
        return this._spanContext;
    }

    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    protected _tracer(): Tracer {
        return this._lightStepTracer!;
    }

    // By default does nothing
    protected _setOperationName(name: string): void {
        this._operationName = name;
    }

    // By default does nothing
    protected _setBaggageItem(key: string, value: string): void {
        this._spanContext.SetBaggageItem(key, value);
    }

    // By default does nothing
    protected _getBaggageItem(key: string): string | undefined {
        return this._spanContext.GetBaggageItem(key);
    }

    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    protected _addTags(keyValuePairs: { [key: string]: any }): void {
        for (let key in keyValuePairs) {
            this._tags.set(key, keyValuePairs[key])
        }
    }

    // By default does nothing
    protected _log(keyValuePairs: { [key: string]: any }, timestamp?: number): void {
        let logDate = new Date();
        if (timestamp) {
            logDate.setTime(timestamp);
        }
        let kvpMap = new Map<string, any>();
        for (let key in keyValuePairs) {
            kvpMap.set(key, keyValuePairs[key])
        }
        this._logs.push(new Log(logDate, kvpMap))
    }

    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    protected _finish(finishTime?: number): void {
        // guard against ending the same span multiple times
        if (this._finished) {
            return;
        }
        this._finished = true;
        this._finishTimeStamp = new Date();
        if (finishTime) {
            this._finishTimeStamp.setTime(finishTime)
        } 
        this.onFinished();
    }

    private onFinished(): void {
        //TODO: convert to proto and append to report
    }
}

export default LightStepSpan;