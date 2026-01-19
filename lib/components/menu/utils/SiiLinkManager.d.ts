import { SiiMenuVoice } from '../global-menu/dto/menu-voice';
export declare class SIILinkManager {
    private openedLinks;
    openLink(menuVoice: SiiMenuVoice, openInThisWindow: boolean, companyId?: string): Window;
    closeAllOpenedLinks(): void;
}
