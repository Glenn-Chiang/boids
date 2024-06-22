import {
  Container,
  PointData,
  Graphics,
  TextStyle,
  Text,
  FederatedPointerEvent,
} from "pixi.js";
import { Parameter } from "./parameter";

export const widgetWidth = 160;
export const widgetHeight = 100;
const sliderWidth = 120;
const primaryColor = "#5DADE2";

export function makeWidget(
  position: PointData,
  labelString: string,
  parameter: Parameter
): Container {
  const widget = new Container({ position });
  const widgetBackground = new Graphics()
    .rect(0, 0, widgetWidth, widgetHeight)
    .fill("white")
    .stroke({ color: "#5DADE2" });

  const sliderLabelStyle = new TextStyle({
    fontSize: 20,
    fontFamily: "consolas",
    fill: primaryColor,
    align: "center",
  });

  const label = new Text({
    text: labelString,
    anchor: 0.5,
    position: { x: widgetWidth / 2, y: 20 },
    style: sliderLabelStyle,
  });

  const slider = new Graphics()
    .rect(0, 0, sliderWidth, 4)
    .fill({ color: primaryColor });
  slider.x = (widgetWidth - sliderWidth) / 2;
  slider.y = widgetHeight / 2;
  slider.eventMode = 'static'

  const handle = new Graphics().circle(0, 0, 8).fill({ color: primaryColor });
  handle.y = slider.height / 2;
  // Position of the handle should reflect the parameter value
  handle.x =
    (parameter.minVal + parameter.value / parameter.maxVal) * sliderWidth;
  handle.eventMode = "static";

  slider.on("pointerdown", (event) => {
    handle.x = slider.toLocal(event.global).x
    onDragStart()
  });

  handle
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd);

  // Start dragging slider handle
  function onDragStart() {
    widget.eventMode = "static";
    widget.addEventListener("pointermove", onDrag);
  }

  // Stop dragging slider handle
  function onDragEnd() {
    widget.eventMode = "auto";
    widget.removeEventListener("pointermove", onDrag);
  }

  function onDrag(event: FederatedPointerEvent) {
    const pointerPos = event.global;
    handle.x = Math.max(0, Math.min(slider.toLocal(pointerPos).x, sliderWidth));

    // How much the slider handle has been dragged between min and max points
    const sliderRatio = handle.x / sliderWidth;
    parameter.setValue(
      parameter.minVal + sliderRatio * (parameter.maxVal - parameter.minVal)
    );
    console.log(parameter.value);
  }

  widget.addChild(widgetBackground);
  widget.addChild(label);
  widget.addChild(slider);
  slider.addChild(handle);

  return widget;
}
