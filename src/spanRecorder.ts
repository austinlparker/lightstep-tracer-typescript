import * as pb from "./collector_pb"

export default class LightStepSpanRecorder {
    private _spans: pb.lightstep.collector.Span[] = new Array<pb.lightstep.collector.Span>()
    private _reportStartTime: Date = new Date()
    private _reportEndTime!: Date
    private _droppedSpanCount: number = 0

    public RecordSpan(span: pb.lightstep.collector.Span): void {
        this._spans.push(span)
    }

    public FinishReport(): void {
        this._reportEndTime = new Date()
    }

    public RecordDroppedSpan(count: number) {
        this._droppedSpanCount += count
    }

    public GetSpans(): pb.lightstep.collector.Span[] {
        return this._spans
    }

    public GetStartTime(): Date {
        return this._reportStartTime
    }

    public GetDuration(): number {
        return this._reportEndTime.valueOf() - this._reportStartTime.valueOf()
    }

    public GetDroppedSpans(): number {
        return this._droppedSpanCount
    }
}