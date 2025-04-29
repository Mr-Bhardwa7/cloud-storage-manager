import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export class FirebasePhoneAuth {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;
  private lastButtonId: string | null = null;

  initRecaptcha(buttonId: string) {
    if (typeof window === 'undefined') return;

    this.cleanup(); // Clean up previous instance
    this.lastButtonId = buttonId;

    this.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired — reinitializing');
        this.initRecaptcha(buttonId); // Auto-reinitialize
      },
    });

    this.recaptchaVerifier.render().catch(console.error);
  }

  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      this.cleanup();
      return false;
    }
  }

  async verifyOTP(otp: string): Promise<User | null> {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP request in progress');
      }

      const result = await this.confirmationResult.confirm(otp);
      this.cleanup(); // Clean up after success
      return result.user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      this.cleanup();
      return null;
    }
  }

  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}

export const firebasePhoneAuth = new FirebasePhoneAuth();
