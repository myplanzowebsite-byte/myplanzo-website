// Minimal typings for the Google Identity Services (GIS) client library
// loaded from https://accounts.google.com/gsi/client. Only the surface we use.

interface GoogleIdCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleIdInitializeConfig {
  client_id: string;
  callback: (response: GoogleIdCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleIdButtonConfig {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface GoogleAccountsId {
  initialize(config: GoogleIdInitializeConfig): void;
  renderButton(parent: HTMLElement, config: GoogleIdButtonConfig): void;
  prompt(): void;
}

interface Window {
  google?: {
    accounts: {
      id: GoogleAccountsId;
    };
  };
}
