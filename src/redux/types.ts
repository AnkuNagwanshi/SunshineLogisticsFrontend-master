// Root state type
export interface RootState {
  sidebarExpanded: SidebarExpandedState;
  speaker: SpeakerState;
}

// Speaker state type
export interface SpeakerState {
  speakers: SpeakerData[];
}

// Sidebar expanded state type
export interface SidebarExpandedState {
  isExpanded: boolean;
}

// Speaker data type
export interface SpeakerData {
  id: number;
  SpeakerName: string;
  Desination: string;
  CompanyName: string;
  Biography: string;
  TopicOfSpeech: string;
  ProfileImageFile: File | null | string;
  IsSpeak: boolean | "Confirmed" | "Not Confirmed";
  EventId: number;
}