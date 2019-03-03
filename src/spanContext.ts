import { SpanContext } from 'opentracing';
import Baggage from './baggage';

export default class LightStepSpanContext extends SpanContext {
    private _traceId!: string;
    private _spanId!: string;
    private _parentSpanId?: string | null;
    private _baggage: Baggage = new Baggage();

    constructor(traceId: string, spanId: string, baggage?: Baggage, parentId?: string) {
        super()
        this._traceId = traceId;
        this._spanId = spanId;
        if (baggage) {
            this._baggage.Merge(baggage);
        }
        if (parentId) {
            this._parentSpanId = parentId;
        }
    }

    public ToSpanId(): string {
        return this._spanId;
    }

    public ToTraceId(): string {
        return this._traceId;
    }

    public GetBaggageItems(): Baggage {
        return this._baggage;
    }

    public GetBaggageItem(key: string): string {
        return this._baggage.Get(key);
    }

    public SetBaggageItem(key: string, value: string): void {
        this._baggage.Set(key, value);
    }
}