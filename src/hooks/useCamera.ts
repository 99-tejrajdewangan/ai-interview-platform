import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCameraProps {
    autoRequest?: boolean;
    onError?: (error: string) => void;
}

export function useCamera({ autoRequest = true, onError }: UseCameraProps = {}) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const requestCamera = useCallback(async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setHasPermission(true);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
            setError(errorMessage);
            setHasPermission(false);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [onError]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
        setHasPermission(false);
    }, [stream]);

    const toggleCamera = useCallback(() => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                const enabled = videoTrack.enabled;
                videoTrack.enabled = !enabled;
                return !enabled;
            }
        }
        return false;
    }, [stream]);

    useEffect(() => {
        if (autoRequest) {
            requestCamera();
        }
        
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [autoRequest, requestCamera]);

    return {
        hasPermission,
        stream,
        isLoading,
        error,
        requestCamera,
        stopCamera,
        toggleCamera,
        videoRef,
        isCameraActive: stream?.getVideoTracks()[0]?.enabled ?? false
    };
}