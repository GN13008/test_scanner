import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, Check, X, Trash2, ArrowLeft } from 'lucide-react';
import { Material, ScanResult } from '../types/material';

interface ScanPageProps {
  onValidate: (materials: Material[]) => void;
  onCancel: () => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ onValidate, onCancel }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scannedMaterials, setScannedMaterials] = useState<Material[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!scannerRef.current && isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-code-scanner",
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          videoConstraints: {
            facingMode: "environment" // Force la caméra arrière
          }
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanError);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

useEffect(() => {
  const container = document.getElementById("qr-code-scanner");
  if (!container) return;

  const observer = new MutationObserver(() => {
    const video = container.querySelector("video") as HTMLVideoElement | null;
    if (video) {
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      video.setAttribute("muted", "true");
      video.style.width = "100%";
      video.style.height = "auto";
      video.style.objectFit = "cover";

      observer.disconnect(); // stop once fixed
    }
  });

  observer.observe(container, { childList: true, subtree: true });
  return () => observer.disconnect();
}, [isScanning]);

  const onScanSuccess = (decodedText: string, result: any) => {
    // Create a new material from scanned data
    const newMaterial: Material = {
      id: Date.now().toString(),
      code: decodedText,
      name: `Matériel ${decodedText}`, // You can customize this logic
      scannedAt: new Date(),
    };

    setScannedMaterials(prev => [...prev, newMaterial]);
    
    // Brief pause before allowing next scan
    setIsScanning(false);
    setTimeout(() => {
      setIsScanning(true);
    }, 1000);
  };

  const onScanError = (errorMessage: string) => {
    // Handle scan error silently or log if needed
    console.log(`QR scan error: ${errorMessage}`);
  };

  const handleValidate = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    onValidate(scannedMaterials);
  };

  const handleCancel = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    onCancel();
  };

  const handleRemoveMaterial = (id: string) => {
    setScannedMaterials(prev => prev.filter(material => material.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Scanner QR Code
          </h1>
          <div className="w-16"></div>
        </div>

        {/* Scanner */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-xl">
          <div id="qr-code-scanner" className="w-full"></div>
        </div>

        {/* Scanned Materials */}
        {scannedMaterials.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Matériels à ajouter ({scannedMaterials.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {scannedMaterials.map((material, index) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{material.code}</p>
                        <p className="text-sm text-gray-600">{material.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMaterial(material.id)}
                      className="text-red-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
          <button
            onClick={handleValidate}
            disabled={scannedMaterials.length === 0}
            className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
              scannedMaterials.length > 0
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            Valider ({scannedMaterials.length})
          </button>
        </div>

        {scannedMaterials.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-400">Scannez un QR code pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;