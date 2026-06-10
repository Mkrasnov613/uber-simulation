import { useState } from "react";
import { COLORS, FONT } from "../theme";
import { QuotaMode } from "../types/statuses";
import { postJson } from "../utils/post";
import { SimulationWindow } from "./SimulationWindow";

interface ConfigForm {
  driverCount: number;
  passengerCount: number;
  spawnPerTick: number;
  maxPassengerWaitTicks: number;
  maxAbandoned: number;
  driverSpeedKmPerTick: number;
  quotaMode: QuotaMode;
  quotaTarget: number;
  maxTicks: number;
}

const DEFAULTS: ConfigForm = {
  driverCount: 30,
  passengerCount: 15,
  spawnPerTick: 1,
  maxPassengerWaitTicks: 20,
  maxAbandoned: 20,
  driverSpeedKmPerTick: 0.1,
  quotaMode: QuotaMode.RIDES,
  quotaTarget: 30,
  maxTicks: 400,
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: COLORS.textMuted,
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: 5,
    }}
  >
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 5,
  color: COLORS.textPrimary,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: FONT,
  padding: "7px 10px",
  outline: "none",
  boxSizing: "border-box",
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label>{label}</Label>
    {children}
  </div>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: COLORS.textMuted,
      fontSize: 9,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      marginBottom: 12,
      paddingBottom: 6,
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    {children}
  </div>
);

export const SimulationSetup = () => {
  const [form, setForm] = useState<ConfigForm>(DEFAULTS);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof ConfigForm>(key: K, value: ConfigForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const numInput = (key: keyof ConfigForm, step = 1, min = 0) => (
    <input
      type="number"
      step={step}
      min={min}
      value={form[key] as number}
      onChange={(e) =>
        set(key, (step < 1 ? parseFloat : parseInt)(e.target.value, 10) as ConfigForm[typeof key])
      }
      style={inputStyle}
    />
  );

  const handleStart = async () => {
    setLoading(true);
    await postJson("start", form);
    setLoading(false);
  };

  return (
    <SimulationWindow>
      {/* Header */}
      <div
        style={{
          padding: "22px 28px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: COLORS.textPrimary,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          New Simulation
        </div>
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 9,
            letterSpacing: "0.14em",
          }}
        >
          CONFIGURE & START
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Drivers & Passengers */}
        <div>
          <SectionHeading>Drivers & Passengers</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <Field label="Driver Count">
              {numInput("driverCount", 1, 1)}
            </Field>
            <Field label="Initial Passengers">
              {numInput("passengerCount", 1, 0)}
            </Field>
            <Field label="Spawn / Tick">
              {numInput("spawnPerTick", 1, 0)}
            </Field>
          </div>
        </div>

        {/* Timing & Limits */}
        <div>
          <SectionHeading>Timing & Limits</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            <Field label="Max Ticks">
              {numInput("maxTicks", 10, 1)}
            </Field>
            <Field label="Max Wait Ticks">
              {numInput("maxPassengerWaitTicks", 1, 1)}
            </Field>
            <Field label="Max Abandoned">
              {numInput("maxAbandoned", 1, 0)}
            </Field>
            <Field label="Driver Speed (km/tick)">
              {numInput("driverSpeedKmPerTick", 0.01, 0.01)}
            </Field>
          </div>
        </div>

        {/* Quota */}
        <div>
          <SectionHeading>Quota</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Quota Mode">
              <select
                value={form.quotaMode}
                onChange={(e) => set("quotaMode", e.target.value as QuotaMode)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value={QuotaMode.RIDES}>RIDES</option>
                <option value={QuotaMode.EARNINGS}>EARNINGS</option>
              </select>
            </Field>
            <Field label="Quota Target">
              {numInput("quotaTarget", 1, 1)}
            </Field>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 28px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setForm(DEFAULTS)}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: COLORS.textSecondary,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: FONT,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Reset defaults
        </button>

        <button
          onClick={handleStart}
          disabled={loading}
          style={{
            padding: "8px 24px",
            borderRadius: 6,
            background: loading ? "rgba(52,211,153,0.4)" : COLORS.green,
            border: "none",
            color: "#0a0e15",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: FONT,
            letterSpacing: "0.04em",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          {loading ? "Starting…" : "Start simulation ▶"}
        </button>
      </div>
    </SimulationWindow>
  );
};
