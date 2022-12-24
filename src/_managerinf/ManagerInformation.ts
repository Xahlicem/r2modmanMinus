import VersionNumber from '../model/VersionNumber';

export default class ManagerInformation {
    public static VERSION: VersionNumber = new VersionNumber('1.1.0');
    public static IS_PORTABLE: boolean = false;
    public static APP_NAME: string = "r2modmanMinus";
}
