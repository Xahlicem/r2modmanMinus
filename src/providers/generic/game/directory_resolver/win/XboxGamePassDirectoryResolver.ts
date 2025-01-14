import GameDirectoryResolverProvider from '../../../../ror2/game/GameDirectoryResolverProvider';
import Game from '../../../../../model/game/Game';
import R2Error from '../../../../../model/errors/R2Error';
import ManagerSettings from '../../../../../r2mm/manager/ManagerSettings';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import child from 'child_process';

export default class XboxGamePassDirectoryResolver extends GameDirectoryResolverProvider {

    public async getDirectory(game: Game): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        if (settings.getContext().gameSpecific.gameDirectory !== null) {
            return settings.getContext().gameSpecific.gameDirectory!;
        }

        try {
            const installDirectoryQuery = `get-appxpackage -Name ${game.activePlatform.storeIdentifier} | select -expand InstallLocation`;
            const queryResult: string = child.execSync(`powershell.exe "${installDirectoryQuery}"`).toString().trim();
            const realInstallLocation = await FsProvider.instance.realpath(queryResult);
            if (FsProvider.instance.exists(realInstallLocation)) {
                return realInstallLocation;
            }
            else {
                throw new Error(realInstallLocation);
            }
        } catch (err) {
            return new R2Error(
                `Unable to resolve the ${game.displayName} install directory`,
                err.message,
                `Try manually locating the ${game.displayName} install directory through the settings`
            );
        }
    }

    public async getSteamDirectory(): Promise<string | R2Error> {
        return new R2Error("Directory shouldn't be retrieved for a non-steam game", "", null);
    }

}
