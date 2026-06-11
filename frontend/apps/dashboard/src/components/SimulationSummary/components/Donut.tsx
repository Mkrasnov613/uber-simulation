import { COLORS, FONT } from "../../../theme";

export const Donut = ({ pct }: { pct: number }) => {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  const filled = circ * Math.min(pct, 1);
  return (
    <svg width={140} height={140} style={{ overflow: "visible" }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={11}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={COLORS.green}
        strokeWidth={11}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x={cx}
        y={cy - 7}
        textAnchor="middle"
        fill={COLORS.textPrimary}
        fontSize={22}
        fontWeight={700}
        fontFamily={FONT}
      >
        {Math.round(pct * 100)}%
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill={COLORS.textMuted}
        fontSize={8}
        letterSpacing="0.14em"
        fontFamily={FONT}
      >
        FULFILLED
      </text>
    </svg>
  );
};