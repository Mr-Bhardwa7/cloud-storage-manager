import { Button, Card, OTPInput } from "nextuiq";

interface VerificationCardProps {
  code: string;
  setCode: (code: string) => void;
  handleVerify: () => void;
  loading: boolean;
  disabled: boolean;
}

const VerificationCard = ({ code, setCode, handleVerify, loading, disabled }: VerificationCardProps) => (
  <Card className="relative overflow-hidden border border-[oklch(var(--theme-border))] group hover:shadow-lg transition-all duration-300">
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
    <div className="absolute inset-0 bg-gradient-to-br from-[oklch(var(--theme-primary)/0.02)] via-transparent to-[oklch(var(--theme-secondary)/0.05)] opacity-0 group-hover:opacity-100 transition-all duration-500" />
    <div className="relative p-8 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-[oklch(var(--theme-muted-foreground))]">
          We&apos;ve sent a verification code to your phone
        </p>
        <p className="text-[oklch(var(--theme-muted-foreground))]">
          OTP sent to <span className="font-semibold tracking-wide">80• ••• ••34</span>
        </p>
      </div>
      <OTPInput
        value={code}
        onChange={setCode}
        length={6}
        className="flex justify-center gap-2 sm:gap-3"
        // inputClassName="w-10 h-12 text-center text-base sm:w-14 sm:h-14 sm:text-lg font-medium border-2 rounded-xl bg-[oklch(var(--theme-background))] focus:border-[oklch(var(--theme-primary))] focus:ring-2 focus:ring-[oklch(var(--theme-primary)/0.3)] transition-all duration-200 group-hover:border-[oklch(var(--theme-primary)/0.5)]"
      />
      <div className="space-y-3">
        <Button
          onClick={handleVerify}
          disabled={code.length !== 6 || loading || disabled}
          loading={loading}
          className="w-full h-12 text-base font-medium bg-[oklch(var(--theme-primary))] hover:opacity-90 transition-opacity"
        >
          Complete Verification
        </Button>
        <Button
          onClick={() => setCode('')}
          variant="ghost"
          disabled={loading || disabled}
          className="w-full h-12 text-sm border border-[oklch(var(--theme-border))] hover:bg-[oklch(var(--theme-primary)/0.05)] transition-colors"
        >
          Resend Code
        </Button>
      </div>
    </div>
  </Card>
);

export default VerificationCard;
