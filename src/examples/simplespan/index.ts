import { LightStepTracer } from "../../tracer"
import LightStepTracerOptions from "../../options";

let lstracer = new LightStepTracer(new LightStepTracerOptions())
let span = lstracer.startSpan("test")
setTimeout(() => {
    span.setTag("foo", "bar")
}, 100)
setTimeout(() => {
    span.finish()
    lstracer.Flush()
}, 1000)

