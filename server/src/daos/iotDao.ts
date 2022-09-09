import { db } from '../common/db';
import { AcCommand, FanSpeed, Mode } from '../common/schema';

export class IotDao {
  get(): AcCommand {
    const command = db.get('command');

    if (command) {
      return command;
    }

    const defaultCmd: AcCommand = {
      mode: Mode.HVAC_HOT,
      temperature: 20,
      fanSpeed: FanSpeed.FAN_SPEED_1,
      on: true,
      scheduled: false,
    };

    db.set('command', defaultCmd);

    return defaultCmd;
  }

  update(cmd: Partial<AcCommand>) {
    const command = this.get();

    db.set('command', {
      ...command,
      scheduled: false,
      ...cmd,
    });

    return this.get();
  }
}
