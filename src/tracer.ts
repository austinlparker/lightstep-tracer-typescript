import { Tracer, SpanOptions, Span, SpanContext, FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP } from 'opentracing'
import { LightStepTracerOptions } from "./options"
import LightStepSpanRecorder from './spanRecorder';
import LightStepSpan from './span';
import LightStepSpanContext from './spanContext';
import GenerateGuid from './helpers/generateGuid';
import * as pb from './collector_pb';
import { ProtoHelpers } from './helpers/protoHelpers';
import { LS_SATELLITE_REPORT_PATH } from './helpers/constants';
import fetch from 'cross-fetch';

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

    AppendSpan(span: pb.lightstep.collector.Span): void {
        this._spanRecorder.RecordSpan(span)
    }
    
    async Flush(): Promise<pb.lightstep.collector.ReportResponse | undefined> {
        if (!this._options.shouldRun) {
            return;
        }
        let currentSpanBuffer = this._spanRecorder
        this._spanRecorder = new LightStepSpanRecorder();
        currentSpanBuffer.FinishReport()
        let report = new pb.lightstep.collector.ReportRequest()
        report.spans = currentSpanBuffer.GetSpans()
        report.reporter = new pb.lightstep.collector.Reporter()
        report.reporter.reporterId = parseInt(this._options.tracerGuid, 16)
        report.auth = new pb.lightstep.collector.Auth()
        report.auth.accessToken = this._options.accessToken
        this._options.globalTags.forEach((key, value) => report.reporter!.tags!.push(ProtoHelpers.KeyValue(key, value)))
        report.internalMetrics = new pb.lightstep.collector.InternalMetrics()
        report.internalMetrics.startTimestamp = ProtoHelpers.Timestamp(currentSpanBuffer.GetStartTime())
        report.internalMetrics.durationMicros = Math.floor(currentSpanBuffer.GetDuration() * 1000)
        //TODO: ts error
        //report.internalMetrics.counts = new pb.lightstep.collector.MetricsSample({name: "spans.dropped", intValue: currentSpanBuffer.GetDroppedSpans()})

        let encodedReport = pb.lightstep.collector.ReportRequest.encode(report).finish()
        let responseValue: pb.lightstep.collector.ReportResponse

        try {
            let response = await fetch(`${this._options.useHttps ? 'https' : 'http'}://${this._options.satelliteHost}:${this._options.satellitePort}/${LS_SATELLITE_REPORT_PATH}`, {
                method: "POST",
                headers: { "Accept": "application/octet-stream", "Content-Type": "application/octet-stream" },
                body: encodedReport
            })
            let responseData = await response.arrayBuffer()
            let responseDataArray = new Uint8Array(responseData)
            responseValue = pb.lightstep.collector.ReportResponse.decodeDelimited(responseDataArray)
            return responseValue
        } catch (ex) {
            console.error(ex)
            return undefined
        } 
    }

}