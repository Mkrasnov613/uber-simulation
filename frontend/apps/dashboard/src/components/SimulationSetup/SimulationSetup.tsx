import { useState } from "react";
import { QuotaMode } from "../../types/statuses";
import { postJson } from "../../utils/post";
import { SimulationWindow } from "../SimulationWindow/SimulationWindow";
import {
  FieldLabel,
  FieldsGrid,
  ResetButton,
  SectionHeading,
  SetupBody,
  SetupFooter,
  SetupHeader,
  SetupSubtitle,
  SetupTitle,
  StartButton,
  StyledInput,
  StyledSelect,
} from "./SimulationSetup.styled";

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

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const STORAGE_KEY = "simulationSetupForm";

const loadSaved = (): ConfigForm => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
};

export const SimulationSetup = () => {
  const [form, setForm] = useState<ConfigForm>(loadSaved);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof ConfigForm>(key: K, value: ConfigForm[K]) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

  const numInput = (key: keyof ConfigForm, step = 1, min = 0) => (
    <StyledInput
      type="number"
      step={step}
      min={min}
      value={form[key] as number}
      onChange={(e) =>
        set(
          key,
          (step < 1 ? parseFloat : parseInt)(
            e.target.value,
            10,
          ) as ConfigForm[typeof key],
        )
      }
    />
  );

  const handleStart = async () => {
    setLoading(true);
    await postJson("start", form);
    setLoading(false);
  };

  return (
    <SimulationWindow>
      <SetupHeader>
        <SetupTitle>New Simulation</SetupTitle>
        <SetupSubtitle>CONFIGURE &amp; START</SetupSubtitle>
      </SetupHeader>

      <SetupBody>
        <div>
          <SectionHeading>Drivers &amp; Passengers</SectionHeading>
          <FieldsGrid $columns={3}>
            <Field label="Driver Count">{numInput("driverCount", 1, 1)}</Field>
            <Field label="Initial Passengers">
              {numInput("passengerCount", 1, 0)}
            </Field>
            <Field label="Spawn / Tick">{numInput("spawnPerTick", 1, 0)}</Field>
          </FieldsGrid>
        </div>

        <div>
          <SectionHeading>Timing &amp; Limits</SectionHeading>
          <FieldsGrid $columns={4}>
            <Field label="Max Ticks">{numInput("maxTicks", 10, 1)}</Field>
            <Field label="Max Wait Ticks">
              {numInput("maxPassengerWaitTicks", 1, 1)}
            </Field>
            <Field label="Max Abandoned">
              {numInput("maxAbandoned", 1, 0)}
            </Field>
            <Field label="Driver Speed (km/tick)">
              {numInput("driverSpeedKmPerTick", 0.01, 0.01)}
            </Field>
          </FieldsGrid>
        </div>

        <div>
          <SectionHeading>Quota</SectionHeading>
          <FieldsGrid $columns={2}>
            <Field label="Quota Mode">
              <StyledSelect
                value={form.quotaMode}
                onChange={(e) => set("quotaMode", e.target.value as QuotaMode)}
              >
                <option value={QuotaMode.RIDES}>RIDES</option>
                <option value={QuotaMode.EARNINGS}>EARNINGS</option>
              </StyledSelect>
            </Field>
            <Field label="Quota Target">
              {numInput("quotaTarget", 1, 1)}
            </Field>
          </FieldsGrid>
        </div>
      </SetupBody>

      <SetupFooter>
        <ResetButton onClick={() => { localStorage.removeItem(STORAGE_KEY); setForm(DEFAULTS); }}>
          Reset defaults
        </ResetButton>
        <StartButton onClick={handleStart} disabled={loading} $loading={loading}>
          {loading ? "Starting…" : "Start simulation ▶"}
        </StartButton>
      </SetupFooter>
    </SimulationWindow>
  );
};
