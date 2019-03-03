import { Tracer, SpanOptions, Span, SpanContext, FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP } from 'opentracing'
import { LightStepTracerOptions } from "./options"
import LightStepSpanRecorder from './spanRecorder';
import LightStepSpan from './span';
import LightStepSpanContext from './spanContext';
import GenerateGuid from './helpers/generateGuid';

export class LightStepTracer extends Tracer {
    private _options: LightStepTracerOptions
    private _spanRecorder: LightStepSpanRecorder
    
    constructor(options: LightStepTracerOptions) {
        super();
        this._options = options
        this._spanRecorder = new LightStepSpanRecorder()
    }

    // The default behavior returns a no-op span.
    protected _startSpan(name: string, fields: SpanOptions): Span {
        let parentContext: LightStepSpanContext | undefined
        if (fields.references) {
            for (const ref of fields.references) {
                parentContext = ref.referencedContext() as LightStepSpanContext
            }
        }
        let traceId = parentContext ? parentContext.ToTraceId() : GenerateGuid.GetHexString()
        let span = new LightStepSpan(this, name, new LightStepSpanContext(traceId, GenerateGuid.GetHexString()))
        if (parentContext) {
            span.SetParentId(parentContext.ToSpanId())
        }

        return span
    }

    // The default behavior is a no-op.
    protected _inject(spanContext: SpanContext, format: string, carrier: any): void {
    }

    // The default behavior is to return a no-op SpanContext.
    protected _extract(format: string, carrier: any): SpanContext | null {
        return new SpanContext()
    }

}
export default LightStepTracer;