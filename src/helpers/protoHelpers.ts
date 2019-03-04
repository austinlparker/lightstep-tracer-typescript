import * as pb from "../collector_pb"
import LightStepSpanContext from "../spanContext";
import * as long from "long"

export abstract class ProtoHelpers {
    static KeyValue(value: string | number | boolean, key: string): pb.lightstep.collector.KeyValue {
        let kvp = new pb.lightstep.collector.KeyValue()
        kvp.key = key.toString()
        switch(typeof(value)) {
            case "string":
                kvp.stringValue = value
                break;
            case "number":
                if (Number.isInteger(<number>value)) {
                    kvp.intValue = <number>value
                } else {
                    kvp.doubleValue = <number>value
                }
                break;
            case "boolean":
                kvp.boolValue = value;
                break;
            default:
                kvp.stringValue = value
                
        }
        return kvp
    }

    static Timestamp(date: Date): pb.google.protobuf.Timestamp {
        let ts = new pb.google.protobuf.Timestamp()
        let seconds = Math.floor(date.valueOf() / 1000);
        let nanos = Math.floor(date.valueOf() % 1000) * 1000000
        ts.seconds = seconds
        ts.nanos = nanos
        return ts
    }

    static SpanContext(sc: LightStepSpanContext): pb.lightstep.collector.SpanContext {
        let spanContext = new pb.lightstep.collector.SpanContext()
        spanContext.spanId = long.fromString(sc.ToSpanId(), 16)
        spanContext.traceId = long.fromString(sc.ToTraceId(), 16)
        return spanContext
    }
}

export default ProtoHelpers;