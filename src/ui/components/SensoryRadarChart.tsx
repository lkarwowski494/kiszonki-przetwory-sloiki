// ============================================================================
// Słoik (Jarwise) — Wektorowy Radar Sensoryczny Kiszonki SVG (Spider Graph)
// 5 osi: Kwasowość, Słoność, Chrupkość, Musowanie, Aromat (skala 1–5)
// Apps4Brew Studio — WCAG AAA, Kontrast kuchenny.
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import {
  FermentSensoryProfile,
  FERMENT_SENSORY_AXES,
  calculateRadarCoordinates,
} from '../../core/sensory-radar';
import { theme } from '../theme';

interface SensoryRadarChartProps {
  profile: FermentSensoryProfile;
  size?: number;
  language?: 'pl' | 'en';
  showLabels?: boolean;
}

export const SensoryRadarChart: React.FC<SensoryRadarChartProps> = ({
  profile,
  size = 220,
  language = 'pl',
  showLabels = true,
}) => {
  const { center, maxRadius, levels, dataPoints } = calculateRadarCoordinates(profile, size);

  const dataPolygonString = dataPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');

  // Etykiety osi na zewnątrz wykresu
  const labelRadius = maxRadius + 18;
  const numAxes = FERMENT_SENSORY_AXES.length;
  const labelPositions = FERMENT_SENSORY_AXES.map((axis, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / numAxes;
    return {
      axis,
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle) + 4,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} testID="sensory-radar-svg">
        {/* Koncentryczne wielokąty siatki (poziomy 1-5) */}
        {levels.map(({ level, points }) => (
          <Polygon
            key={`level-${level}`}
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill={level === 5 ? 'rgba(74, 133, 61, 0.05)' : 'none'}
            stroke={theme.colors.border}
            strokeWidth={level === 5 ? '1.5' : '1'}
            strokeDasharray={level < 5 ? '3,3' : undefined}
          />
        ))}

        {/* Promienie osi z centrum do wierzchołków */}
        {levels[4].points.map((pt, i) => (
          <Line
            key={`spoke-${i}`}
            x1={center}
            y1={center}
            x2={pt.x}
            y2={pt.y}
            stroke={theme.colors.border}
            strokeWidth="1"
          />
        ))}

        {/* Wypełniony poligon danych sensorycznych partii */}
        <Polygon
          points={dataPolygonString}
          fill="rgba(45, 90, 39, 0.35)"
          stroke={theme.colors.pickleGreen}
          strokeWidth="2.5"
        />

        {/* Punkty danych (kropki na wierzchołkach) */}
        {dataPoints.map((pt) => (
          <Circle
            key={`dot-${pt.key}`}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill={theme.colors.amberBrine}
            stroke="#FFF"
            strokeWidth="1.5"
          />
        ))}

        {/* Etykiety osi */}
        {showLabels &&
          labelPositions.map(({ axis, x, y }) => (
            <SvgText
              key={`label-${axis.key}`}
              x={x}
              y={y}
              fontSize="10"
              fontWeight="700"
              fill={theme.colors.textPrimary}
              textAnchor="middle"
            >
              {language === 'pl' ? axis.labelPl : axis.labelEn}
            </SvgText>
          ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
