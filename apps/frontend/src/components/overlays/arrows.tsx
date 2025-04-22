import type { Color, Square } from 'chess.js';
import React from 'react';
import { cn } from '@/lib/utils';

export type Arrow = {
  from: Square;
  to: Square;
  color: string;
};

const ArrowsOverlay = ({
  arrows,
  orientation,
}: {
  arrows: { [key: string]: Arrow };
  orientation: Color;
}) => {
  return (
    <svg
      viewBox='0 0 100 100'
      className={cn('absolute pointer-events-none z-50', {
        '-scale-100': orientation === 'b',
      })}
    >
      {Object.entries(arrows).map(([key, arrow]) => (
        <ArrowPolygon
          key={key}
          {...arrow}
        />
      ))}
    </svg>
  );
};

const ArrowPolygon = ({ from, to, color }: Arrow) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  const [fromCol, fromRow] = [fromFile.charCodeAt(0) - 'a'.charCodeAt(0), 8 - Number(fromRank)];
  const [toCol, toRow] = [toFile.charCodeAt(0) - 'a'.charCodeAt(0), 8 - Number(toRank)];

  // Constants to keep arrow size consistent
  const SHAFT_WIDTH = 0.25;
  const HEAD_WIDTH = 0.5;
  const HEAD_HEIGHT = 0.375;
  const SPACE_BETWEEN_ORIGIN = 0.35;
  // Rotate around point
  const cx = (fromCol + 0.5) * 12.5;
  const cy = (fromRow + 0.5) * 12.5;
  // Arrow properties
  const [arrowX, arrowY] = [toCol - fromCol, toRow - fromRow];
  const distance = Math.sqrt(Math.pow(toCol - fromCol, 2) + Math.pow(toRow - fromRow, 2));
  let theta = -Math.atan(arrowX / arrowY) * (180 / Math.PI) + (arrowY < 0 ? 180 : 0);
  if (theta < 0) theta += 360;
  if (Math.abs(arrowX) * Math.abs(arrowY) === 2) {
    // This is a knight move
    // Points of the arrow polygon, starting from the tip and working in a clockwise direction
    var points = [
      `${(fromCol + 1.5) * 12.5},${(fromRow + 2.5) * 12.5}`,
      `${(fromCol + 1.5 - HEAD_HEIGHT) * 12.5},${(fromRow + 2.5 + HEAD_WIDTH / 2) * 12.5}`,
      `${(fromCol + 1.5 - HEAD_HEIGHT) * 12.5},${(fromRow + 2.5 + SHAFT_WIDTH / 2) * 12.5}`,
      `${(fromCol + 0.5 - SHAFT_WIDTH / 2) * 12.5},${(fromRow + 2.5 + SHAFT_WIDTH / 2) * 12.5}`,
      `${(fromCol + 0.5 - SHAFT_WIDTH / 2) * 12.5},${
        (fromRow + 0.5 + SPACE_BETWEEN_ORIGIN) * 12.5
      }`,
      `${(fromCol + 0.5 + SHAFT_WIDTH / 2) * 12.5},${
        (fromRow + 0.5 + SPACE_BETWEEN_ORIGIN) * 12.5
      }`,
      `${(fromCol + 0.5 + SHAFT_WIDTH / 2) * 12.5},${(fromRow + 2.5 - SHAFT_WIDTH / 2) * 12.5}`,
      `${(fromCol + 1.5 - HEAD_HEIGHT) * 12.5},${(fromRow + 2.5 - SHAFT_WIDTH / 2) * 12.5}`,
      `${(fromCol + 1.5 - HEAD_HEIGHT) * 12.5},${(fromRow + 2.5 - HEAD_WIDTH / 2) * 12.5}`,
    ];
    const rotate = cn({
      '0': theta > 315 || theta < 45,
      '90': theta > 45 && theta < 135,
      '180': theta > 135 && theta < 225,
      '270': theta > 225 && theta < 315,
    });
    const scale = theta % 90 > 63 ? '1,1' : '-1,1';
    const translate = scale === '1,1' ? '0' : `-${2 * (12.5 * fromCol) + 12.5}`;
    var transform = `rotate(${rotate} ${cx} ${cy}) scale(${scale}) translate(${translate})`;
  } else {
    // Points of the arrow polygon, starting from the tip and working in a clockwise direction
    var points = [
      `${(fromCol + 0.5) * 12.5},${(fromRow + distance + 0.5) * 12.5}`,
      `${(fromCol + 0.5 - HEAD_WIDTH / 2) * 12.5},${
        (fromRow + distance + 0.5 - HEAD_HEIGHT) * 12.5
      }`,
      `${(fromCol + 0.5 - SHAFT_WIDTH / 2) * 12.5},${
        (fromRow + distance + 0.5 - HEAD_HEIGHT) * 12.5
      }`,
      `${(fromCol + 0.5 - SHAFT_WIDTH / 2) * 12.5},${
        (fromRow + 0.5 + SPACE_BETWEEN_ORIGIN) * 12.5
      }`,
      `${(fromCol + 0.5 + SHAFT_WIDTH / 2) * 12.5},${
        (fromRow + 0.5 + SPACE_BETWEEN_ORIGIN) * 12.5
      }`,
      `${(fromCol + 0.5 + SHAFT_WIDTH / 2) * 12.5},${
        (fromRow + distance + 0.5 - HEAD_HEIGHT) * 12.5
      }`,
      `${(fromCol + 0.5 + HEAD_WIDTH / 2) * 12.5},${
        (fromRow + distance + 0.5 - HEAD_HEIGHT) * 12.5
      }`,
    ];
    var transform = `rotate(${theta} ${cx} ${cy})`;
  }

  return (
    <polygon
      id={`arrow-${from}${to}`}
      points={points.join(' ')}
      fill={color}
      opacity={0.8}
      transform={transform}
    />
  );
};

export default React.memo(ArrowsOverlay);
