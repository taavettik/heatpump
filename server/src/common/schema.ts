export enum Mode {
  HVAC_HOT,
  HVAC_COLD,
  HVAC_DRY,
  HVAC_FAN, // not used I think
  HVAC_AUTO
}

export enum FanSpeed {
  FAN_SPEED_1,
  FAN_SPEED_2,
  FAN_SPEED_3,
  FAN_SPEED_4,
  FAN_SPEED_5,
  FAN_SPEED_AUTO,
  FAN_SPEED_SILENT
}

export interface AcCommand {
  mode: Mode,
  temperature: number,
  fanSpeed: FanSpeed,
  on: boolean;
}

export interface DbSchema {
  command: AcCommand;
}

export const defaultSchema = (): DbSchema =>({
  command: {
    mode: Mode.HVAC_HOT,
    temperature: 20,
    fanSpeed: FanSpeed.FAN_SPEED_1,
    on: true,
  }
})