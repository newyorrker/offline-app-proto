export interface WindowExtended {
  sessionFromNative: (arg0: string) => void;
  activateFromNative: () => void;
  appercode: {
    reloadPage: () => void;
  };
  actor: {
    changeButtons: (arg0: any) => void;
    postMessage: (arg0: any) => void;
  };
  clickButton: (arg0: any) => void;
  // eslint-disable-next-line
  webkit: any;
  session: any;
}

declare global {
  interface Window extends WindowExtended {}
}
