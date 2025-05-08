'use client';

export default function StatusBar() {
  return (
    <div className="h-6 bg-[var(--statusbar-background)] text-[var(--statusbar-foreground)] flex items-center px-2 text-xs">
      <div className="flex items-center space-x-4">
        <span>🚀 Launched</span>
        <span>Ln 1, Col 25</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>CRLF</span>
        <span>🖊 Plain Text</span>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <span>No Environment</span>
        <span>Go Live</span>
        <span>[-] Argument</span>
        <span>✓ Prettier</span>
      </div>
    </div>
  );
}