import React from "react";

import type {
  CustomPaintProps,
  SkEnum,
  Vector,
  ColorProp,
} from "../../processors";
import { enumKey, processColor } from "../../processors";
import type { IPoint } from "../../../skia";
import { BlendMode } from "../../../skia/Paint/BlendMode";
import type { AnimatedProps } from "../../processors/Animations/Animations";
import { useDrawing } from "../../nodes/Drawing";

export interface CubicBezier {
  src: Vector;
  c1: Vector;
  c2: Vector;
}

export interface PatchProps extends CustomPaintProps {
  colors?: readonly ColorProp[];
  patch: readonly [CubicBezier, CubicBezier, CubicBezier, CubicBezier];
  texs?: IPoint[];
  blendMode?: SkEnum<typeof BlendMode>;
}

export const Patch = (props: AnimatedProps<PatchProps>) => {
  const onDraw = useDrawing(
    props,
    ({ canvas, paint, opacity }, { colors, patch, texs, blendMode }) => {
      // If the colors are provided, the default blendMode is set to dstOver, if not, the default is set to srcOver
      const defaultBlendMode = colors ? BlendMode.DstOver : BlendMode.SrcOver;
      const mode = blendMode ? BlendMode[enumKey(blendMode)] : defaultBlendMode;
      canvas.drawPatch(
        patch.map(({ src, c1, c2 }) => [src, c1, c2]).flat(),
        colors ? colors.map((c) => processColor(c, opacity)) : undefined,
        texs,
        mode,
        paint
      );
    }
  );
  return <skDrawing onDraw={onDraw} {...props} />;
};
