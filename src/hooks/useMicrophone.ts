import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMicrophoneProps {
    autoRequest?: boolean;
    onError?: (error: string) => void;
    onLevelChange?: (level: number) => void;
}

export function useMicrophone({ autoRequest = true, onError, onLevelChange }: UseMicrophoneProps = {}) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string>('');
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number>();
    const streamRef = useRef<MediaStream | null>(null);

    const requestMicrophone = useCallback(async () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            await audioContextRef.current.close();
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = mediaStream;
            setStream(mediaStream);
            setHasPermission(true);
            setError('');
            
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(mediaStream);
            source.connect(analyser);
            analyser.fftSize = 256;
            
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            
            await audioContext.resume();
            setIsRecording(true);
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
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
        } catch (err) {
            console.error('Microphone error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
            setError(errorMessage);
            setHasPermission(false);
            onError?.(errorMessage);
        }
    }, [onError, onLevelChange]);

    const stopMicrophone = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setStream(null);
        setHasPermission(false);
        setIsRecording(false);
        setAudioLevel(0);
    }, []);

    const toggleMicrophone = useCallback(() => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                const enabled = audioTrack.enabled;
                audioTrack.enabled = !enabled;
                return !enabled;
            }
        }
        return false;
    }, []);

    useEffect(() => {
        if (autoRequest) {
            requestMicrophone();
        }
        
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
    }, [autoRequest, requestMicrophone]);

    const getMicStatus = useCallback((): 'active' | 'low' | 'inactive' => {
        if (audioLevel > 0.1) return 'active';
        if (audioLevel > 0.02) return 'low';
        return 'inactive';
    }, [audioLevel]);

    return {
        hasPermission,
        stream,
        audioLevel,
        isRecording,
        error,
        requestMicrophone,
        stopMicrophone,
        toggleMicrophone,
        getMicStatus,
        isMicrophoneActive: streamRef.current?.getAudioTracks()[0]?.enabled ?? false
    };
}