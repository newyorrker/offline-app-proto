import { createApp } from 'vue'
import './style.css'
import App from './app/App.vue';
import Api, { CorrectSession } from './shared/api/Api';

const apiInstance = Api.getInstance();

const app = createApp(App);

let isAppMounted = false;

const sessionFromNative = (sessionData: string) => {
  const parsedSession = JSON.parse(sessionData) as unknown;

  apiInstance.setSession(parsedSession as unknown as CorrectSession);

  if (!isAppMounted) {
    app.mount('#app');
    isAppMounted = true;
  }
}

window.sessionFromNative = sessionFromNative;

if (process.env.NODE_ENV === 'development') {
  window.sessionFromNative(
    '{"baseUrl":"https://api.test.appercode.com/","projectName":"riskskr", "sessionId":"6fb082d8-c281-41b6-8cef-2a9f1c3a05f2", "appPlatform":"Web","appVersion":"1.0.0","language":"ru","installationId":"00000000-0000-0000-0000-000000000000","refreshToken":"00000000-0000-0000-0000-000000000000","userId":38791,"isAnonymous":false, "userProfile":{"groupIds": ["7d4db736-7469-4b3e-8b1f-f179c001548a"], "dateOfEmployment":"2021-08-05T21:03:00+07:00"}, "colorScheme": { "panel_background": "#F39420", "panel_foreground": "#FFF", "accent": "#7FD68E", "accent_text": "#FFF"}}',
  );
}
