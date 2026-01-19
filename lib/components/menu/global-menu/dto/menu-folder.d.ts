import { SiiMenuVoice } from './menu-voice';
export interface SiiMenuFolder {
    id: number;
    category: string;
    voices: SiiMenuVoice[];
    icon: string;
    icoExt: boolean;
}
