import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Eye, AlertCircle, CheckCircle2, ShieldAlert, Info } from 'lucide-react';
import { useAuthStore } from '../store/store';

export default function UpiQr({ money, onPaymentSuccess }) {
    const { user } = useAuthStore();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const upiId = user?.businessDetails?.upiId;
    const payeeName = user?.name || 'Merchant';
    const numericAmount = parseFloat(money) || 0;

    // Standard NPCI UPI Intent Deep Link String
    const upiString = upiId
        ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${numericAmount.toFixed(2)}&cu=INR`
        : '';

    // Web Speech API: Speaks the Hindi verification warning when QR is revealed
    const speakRevealReminder = () => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop any active speech

        const text = "कृपया अपने यूपीआई ऐप में राशि प्राप्त होने य बैंक एसएमएस की कन्फर्मेशन के बाद ही सेल कम्प्लीट करे";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const assignVoiceAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            const hindiVoice = voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            assignVoiceAndSpeak();
        } else {
            window.speechSynthesis.onvoiceschanged = assignVoiceAndSpeak;
        }
    };

    // Toggle QR Reveal + Speak Warning
    const toggleReveal = () => {
        const nextState = !isRevealed;
        setIsRevealed(nextState);

        if (nextState) {
            speakRevealReminder();
        } else {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
    };

    // Native Web Audio API Success Chime (Marimba / Bell Fanfare)
   const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // PhonePe / Paytm Merchant Chime Sequence (Bright, uplifting major arpeggio)
        const sequence = [
            { freq: 523.25, delay: 0, duration: 0.12, vol: 0.12 },     // C5
            { freq: 659.25, delay: 0.08, duration: 0.12, vol: 0.15 },  // E5
            { freq: 783.99, delay: 0.16, duration: 0.15, vol: 0.18 },  // G5
            { freq: 1046.50, delay: 0.24, duration: 0.55, vol: 0.22 }, // C6 (High chime ring)
        ];

        sequence.forEach(({ freq, delay, duration, vol }) => {
            const startTime = now + delay;

            // Dual oscillators for a richer, speaker-like electronic tone
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gainNode = ctx.createGain();

            // Waveform combination: Sine for depth + Triangle for chime brightness
            osc1.type = 'sine';
            osc2.type = 'triangle';

            osc1.frequency.setValueAtTime(freq, startTime);
            // Slight pitch bend on the final high note for that authentic speaker resonance
            if (freq === 1046.50) {
                osc1.frequency.exponentialRampToValueAtTime(1050, startTime + duration);
            }
            osc2.frequency.setValueAtTime(freq, startTime);

            // Smooth envelope curve (Quick attack, natural decay)
            gainNode.gain.setValueAtTime(0.001, startTime);
            gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            // Connect nodes
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + duration);
            osc2.stop(startTime + duration);
        });
    } catch (err) {
        console.warn('Audio context blocked or unsupported:', err);
    }
};

    const handleMarkCompleted = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsSuccess(true);
        playSuccessSound();

        if (onPaymentSuccess) {
            onPaymentSuccess({
                amount: numericAmount,
                upiId,
                timestamp: new Date().toISOString(),
            });
        }
    };

    const handleReset = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsSuccess(false);
        setIsRevealed(false);
    };

    if (!upiId) {
        return (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-amber-600" />
                <span>No UPI ID configured in business settings.</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs transition-all relative overflow-hidden max-w-sm mx-auto">
            {/* --- Animated Payment Success Overlay --- */}
            {isSuccess ? (
                <div className="w-full flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in duration-300">
                    <div className="relative flex items-center justify-center mb-3">
                        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
                        <div className="relative p-3 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-200 animate-bounce">
                            <CheckCircle2 size={40} />
                        </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">Payment Verified!</h4>
                    <p className="text-xs text-slate-500 mb-1">Received via UPI</p>
                    <span className="text-xl font-extrabold text-emerald-600 mb-4">
                        ₹{numericAmount.toFixed(2)}
                    </span>

                    <button
                        onClick={handleReset}
                        className="text-xs text-slate-500 hover:text-slate-800 underline font-medium transition-colors cursor-pointer"
                    >
                        Reset QR Code
                    </button>
                </div>
            ) : (
                /* --- Standard QR View --- */
                <>
                    <div className="text-center mb-3">
                        <p className="text-xs text-slate-500 font-medium">Scan & Pay via any UPI App</p>
                        <p className="text-base font-extrabold text-slate-800">
                            {numericAmount > 0 ? `₹${numericAmount.toFixed(2)}` : 'Enter Amount'}
                        </p>
                    </div>

                    {/* QR Code Container with Unblur Toggle */}
                    <div
                        onClick={toggleReveal}
                        className="relative group cursor-pointer overflow-hidden rounded-xl p-2.5 bg-white border border-slate-100 shadow-2xs mb-2"
                    >
                        <div
                            className={`transition-all duration-300 ${!isRevealed
                                    ? 'filter blur-md opacity-40 scale-95'
                                    : 'blur-0 opacity-100 scale-100'
                                }`}
                        >
                            <QRCodeSVG
                                value={upiString || 'upi://pay'}
                                size={160}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        {/* Faded/Blurred Overlay Prompt */}
                        {!isRevealed && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/20 transition-all rounded-xl text-slate-800 font-semibold text-xs gap-1.5 p-2 text-center">
                                <div className="p-2 bg-white/95 rounded-full shadow-md text-blue-600">
                                    <Eye size={18} />
                                </div>
                                <span className="bg-white/95 px-2.5 py-1 rounded-md text-[11px] shadow-xs">
                                    Tap to show QR
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Payee Details */}
                    <div className="text-center text-[11px] text-slate-500 mb-3">
                        <span className="font-semibold text-slate-700">{payeeName}</span> ({upiId})
                    </div>

                    {/* --- Eye-Catching Senior UI/UX Warning Alert Banner --- */}
                    <div className="w-full mb-3.5 p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 border-y border-r border-amber-200/80 rounded-r-xl flex items-start gap-2.5 text-amber-950 shadow-2xs">
                        <div className="p-1 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5 shadow-xs animate-pulse">
                            <ShieldAlert size={16} />
                        </div>
                        <div className="text-[11px] leading-snug">
                            <span className="font-bold text-amber-900 tracking-wide uppercase text-[10px] block mb-0.5">
                                ⚠️ Verify Before Completing
                            </span>
                            <p className="text-amber-800 font-medium">
                                Check your UPI app or bank SMS to confirm credit before completing the sale.
                            </p>
                        </div>
                    </div>

                    {/* Payment Completed Button + Helper Prompt */}
                    <div className="w-full space-y-1.5">
                        <button
                            type="button"
                            onClick={handleMarkCompleted}
                            disabled={!isRevealed}
                            className="w-full flex items-center justify-center gap-2 text-xs md:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
                        >
                            <CheckCircle2
                                size={16}
                                className={!isRevealed ? 'text-slate-400' : 'text-white'}
                            />
                            <span>Mark Payment Completed</span>
                        </button>

                        {!isRevealed && (
                            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1 font-medium">
                                <Info size={12} /> Tap QR code above to activate payment confirmation
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}