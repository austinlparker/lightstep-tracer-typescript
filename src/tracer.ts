import { Tracer, SpanOptions } from 'opentracing'
import { LightStepTracerOptions } from "./options"

export class LightStepTracer extends Tracer {
    constructor(options: LightStepTracerOptions) {
        super();
    }
}
export default LightStepTracer;