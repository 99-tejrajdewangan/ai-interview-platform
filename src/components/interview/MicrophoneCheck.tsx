import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import Button from '../ui/Button';

interface MicrophoneCheckProps {
  onPermissionChange?: (hasPermission: boolean) => void;
  onLevelChange?: (level: number) => void;
}

export default function MicrophoneCheck({ onPermissionChange, onLevelChange }: MicrophoneCheckProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  const requestMicrophone = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;
      setHasPermission(true);
      setError('');
      onPermissionChange?.(true);

      // Setup audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      await audioContext.resume();
      setIsRecording(true);
      startMonitoring();
    } catch (err) {
      console.error('Microphone error:', err);
      setHasPermission(false);
      setError('Unable to access microphone. Please check permissions.');
      onPermissionChange?.(false);
    }
  };

  const startMonitoring = () => {
    const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteTimeDomainData(dataArray);
      let max = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        max = Math.max(max, Math.abs(v));
      }
      
      setAudioLevel(max);
      onLevelChange?.(max);
      animationRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  useEffect(() => {
    requestMicrophone();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getMicStatus = () => {
    if (audioLevel > 0.1) return 'active';
    if (audioLevel > 0.02) return 'low';
    return 'inactive';
  };

  const statusColors = {
    active: 'bg-green-500',
    low: 'bg-yellow-500',
    inactive: 'bg-gray-300 dark:bg-gray-600'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div>
            <p className="font-semibold">Microphone Check</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hasPermission === true && getMicStatus() === 'active' && 'Microphone working'}
              {hasPermission === true && getMicStatus() === 'low' && 'Microphone level low - speak louder'}
              {hasPermission === true && getMicStatus() === 'inactive' && 'Speak to test microphone'}
              {hasPermission === false && 'Microphone access denied'}
              {hasPermission === null && 'Requesting microphone access...'}
            </p>
          </div>
        </div>
        {hasPermission === true && <CheckCircle className="w-5 h-5 text-green-500" />}
        {hasPermission === false && <XCircle className="w-5 h-5 text-red-500" />}
        {hasPermission === null && <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />}
      </div>

      {hasPermission === true && (
        <>
          {/* Audio Level Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Audio Level</span>
              <span className="text-gray-600 dark:text-gray-400">
                {Math.round(audioLevel * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${statusColors[getMicStatus()]}`}
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>

          {/* Voice Wave Animation */}
          <div className="flex items-center justify-center gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-500 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.sin(Date.now() * 0.005 + i) * 20 + (audioLevel * 40)}px`,
                  opacity: audioLevel > 0.05 ? 1 : 0.3
                }}
              />
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              {getMicStatus() === 'active' 
                ? 'Microphone is picking up your voice clearly' 
                : getMicStatus() === 'low'
                ? 'Please speak louder or move closer to the microphone'
                : 'Speak to test your microphone'}
            </p>
          </div>
        </>
      )}

      {hasPermission === false && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={requestMicrophone} size="sm" className="mt-2">
            <RefreshCw className="w-4 h-4 mr-1" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}