import {
  Container,
  PointData,
  Graphics,
  TextStyle,
  Text,
  FederatedPointerEvent,
} from "pixi.js";

export const widgetWidth = 160;
export const widgetHeight = 100;
const sliderWidth = 120;
const primaryColor = "#5DADE2";

export function makeWidget(
  position: PointData,
  labelString: string
): Container {
  const widget = new Container({ position });
  const widgetBackground = new Graphics()
    .rect(0, 0, widgetWidth, widgetHeight)
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

  const handle = new Graphics().circle(0, 0, 8).fill({ color: primaryColor });
  handle.y = slider.height / 2;
  handle.x = sliderWidth / 2;
  handle.eventMode = "static";

  handle
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd);

  // Start dragging slider handle
  function onDragStart(event: FederatedPointerEvent) {
    widget.eventMode = "static";
    widget.addEventListener("pointermove", onDrag);
  }

  // Stop dragging slider handle
  function onDragEnd(event: FederatedPointerEvent) {
    widget.eventMode = "auto";
    widget.removeEventListener("pointermove", onDrag);
  }

  function onDrag(event: FederatedPointerEvent) {
    console.log("dragging");
    const halfHandleWidth = handle.width / 2;
    // Set handle y-position to match pointer, clamped to (4, screen.height - 4).

    handle.x = Math.max(
      halfHandleWidth,
      Math.min(slider.toLocal(event.global).x, sliderWidth - halfHandleWidth)
    );
    // Normalize handle position between -1 and 1.
    const t = 2 * (handle.x / sliderWidth - 0.5);
  }

  widget.addChild(widgetBackground);
  widget.addChild(label);
  widget.addChild(slider);
  slider.addChild(handle);

  return widget;
}
