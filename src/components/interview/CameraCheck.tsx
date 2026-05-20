import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';

interface CameraCheckProps {
  onPermissionChange?: (hasPermission: boolean) => void;
  onStreamChange?: (stream: MediaStream | null) => void;
}

export default function CameraCheck({ onPermissionChange, onStreamChange }: CameraCheckProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const requestCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setHasPermission(true);
      setError('');
      onPermissionChange?.(true);
      onStreamChange?.(mediaStream);
    } catch (err) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please check permissions.');
      onPermissionChange?.(false);
      onStreamChange?.(null);
    }
  };

  useEffect(() => {
    requestCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div>
            <p className="font-semibold">Camera Check</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hasPermission === true && 'Camera working'}
              {hasPermission === false && 'Camera access denied'}
              {hasPermission === null && 'Requesting camera access...'}
            </p>
          </div>
        </div>
        {hasPermission === true && <CheckCircle className="w-5 h-5 text-green-500" />}
        {hasPermission === false && <XCircle className="w-5 h-5 text-red-500" />}
        {hasPermission === null && <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />}
      </div>

      {hasPermission === false && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={requestCamera} size="sm" className="mt-2">
            <RefreshCw className="w-4 h-4 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {hasPermission === true && stream && (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Camera Active
          </div>
        </div>
      )}
    </div>
  );
}