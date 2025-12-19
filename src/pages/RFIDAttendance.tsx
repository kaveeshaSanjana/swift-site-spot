import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wifi, ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { childAttendanceApi } from '@/api/childAttendance.api';

interface LastAttendance {
  rfidCardId: string;
  studentName: string;
  userIdByInstitute: string;
  status: 'present' | 'absent' | 'late';
  timestamp: number;
  imageUrl?: string;
}

const RfidAttendance = () => {
  const { selectedInstitute, selectedClass, selectedSubject, currentInstituteId } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rfidCardId, setRfidCardId] = useState('');
  const [status, setStatus] = useState<'present' | 'absent' | 'late'>('present');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerStatus, setScannerStatus] = useState('Ready to Scan');
  const [location, setLocation] = useState<string>('');
  const [lastAttendance, setLastAttendance] = useState<LastAttendance | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Build address from current selection
  const buildAddress = () => {
    const parts = [];
    if (selectedInstitute?.name) parts.push(selectedInstitute.name);
    if (selectedClass?.name) parts.push(selectedClass.name);
    if (selectedSubject?.name) parts.push(selectedSubject.name);
    return parts.join(' → ');
  };

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              setLocation(data.display_name || 'Unknown Location');
            } catch (error) {
              console.error('Error fetching address:', error);
              setLocation('Location detected');
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocation('Gate Scanner - Main Entrance');
          }
        );
      } else {
        setLocation('Gate Scanner - Main Entrance');
      }
    };

    getLocation();
  }, []);

  // Clear last attendance after 1 minute
  useEffect(() => {
    if (lastAttendance) {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      clearTimeoutRef.current = setTimeout(() => {
        setLastAttendance(null);
      }, 60000);
    }
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, [lastAttendance]);

  const handleMarkAttendance = async () => {
    if (!rfidCardId.trim()) {
      toast({
        title: "Error",
        description: "Please enter or scan an RFID card ID",
        variant: "destructive"
      });
      return;
    }

    if (!currentInstituteId || !selectedInstitute?.name) {
      toast({
        title: "Error",
        description: "Please select an institute first",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate
    if (lastAttendance && lastAttendance.rfidCardId === rfidCardId.trim()) {
      toast({
        title: "Duplicate Detected",
        description: `Attendance already marked for ${lastAttendance.studentName}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setScannerStatus('Processing...');

    try {
      const request: any = {
        rfidCardId: rfidCardId.trim(),
        instituteId: currentInstituteId.toString(),
        instituteName: selectedInstitute.name,
        address: buildAddress(),
        markingMethod: 'rfid/nfc',
        status: status,
        date: new Date().toISOString().split('T')[0],
        location: location || 'Gate Scanner - Main Entrance'
      };

      if (selectedClass) {
        request.classId = selectedClass.id.toString();
        request.className = selectedClass.name;
      }

      if (selectedSubject) {
        request.subjectId = selectedSubject.id.toString();
        request.subjectName = selectedSubject.name;
      }

      const result = await childAttendanceApi.markAttendanceByCard({
        studentCardId: rfidCardId.trim(),
        instituteId: currentInstituteId.toString(),
        instituteName: selectedInstitute.name,
        classId: selectedClass?.id.toString(),
        className: selectedClass?.name,
        subjectId: selectedSubject?.id.toString(),
        subjectName: selectedSubject?.name,
        address: buildAddress(),
        markingMethod: 'rfid/nfc',
        status: status
      });

      if (result.success) {
        const studentName = result.name || 'Student';
        const imageUrl = result.imageUrl;
        const userIdByInstitute = rfidCardId.trim();
        const dateStr = new Date().toLocaleDateString();
        const timeStr = new Date().toLocaleTimeString();
        
        setLastAttendance({
          rfidCardId: rfidCardId.trim(),
          studentName: studentName,
          userIdByInstitute: userIdByInstitute,
          status: result.status || status,
          timestamp: Date.now(),
          imageUrl: imageUrl || undefined,
        });

        // RFID attendance shows visual feedback in scanner section, no toast needed
        setRfidCardId('');
        setScannerStatus('Attendance Marked Successfully');
        inputRef.current?.focus();
      } else {
        throw new Error(result.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Attendance marking error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to mark attendance',
        variant: "destructive"
      });
      setScannerStatus('Error - Try Again');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setScannerStatus('Ready to Scan'), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleMarkAttendance();
    }
  };

  return (
    <div className="bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/qr-attendance')} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Wifi className="h-6 w-6" />
                RFID Attendance
              </h1>
              <p className="text-sm text-muted-foreground">
                Tap your RFID card or enter the ID manually to mark attendance
              </p>
            </div>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Selection</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Institute:</span> {selectedInstitute?.name || 'Not selected'}
                </p>
                {selectedClass && (
                  <p className="text-sm">
                    <span className="font-medium">Class:</span> {selectedClass.name}
                  </p>
                )}
                {selectedSubject && (
                  <p className="text-sm">
                    <span className="font-medium">Subject:</span> {selectedSubject.name}
                  </p>
                )}
                {location && (
                  <p className="text-sm flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {selectedInstitute?.name ? `${selectedInstitute.name} - ` : ''}{location}
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Modern Scanner Section */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid opacity-30" />
                
                <div className="relative flex flex-col items-center justify-center py-16 sm:py-24 px-8">
                  {/* Large Icon Container */}
                  <div className="relative mb-8">
                    <div className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-500 ${
                      lastAttendance 
                        ? lastAttendance.status === 'present'
                          ? 'bg-emerald-400/30'
                          : lastAttendance.status === 'absent'
                          ? 'bg-red-400/30'
                          : 'bg-amber-400/30'
                        : 'bg-blue-400/20'
                    }`} />
                    <div className={`relative p-8 rounded-full transition-all duration-300 ${
                      lastAttendance 
                        ? lastAttendance.status === 'present'
                          ? 'bg-emerald-100 dark:bg-emerald-900/50'
                          : lastAttendance.status === 'absent'
                          ? 'bg-red-100 dark:bg-red-900/50'
                          : 'bg-amber-100 dark:bg-amber-900/50'
                        : 'bg-blue-100 dark:bg-blue-900/50'
                    }`}>
                      {lastAttendance ? (
                        <CheckCircle className={`h-20 w-20 sm:h-28 sm:w-28 transition-colors ${
                          lastAttendance.status === 'present'
                            ? 'text-emerald-500'
                            : lastAttendance.status === 'absent'
                            ? 'text-red-500'
                            : 'text-amber-500'
                        }`} strokeWidth={1.5} />
                      ) : (
                        <Wifi className="h-20 w-20 sm:h-28 sm:w-28 text-blue-500" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                      {scannerStatus}
                    </h2>
                    
                    {lastAttendance ? (
                      <div className="space-y-4 flex flex-col items-center">
                        {/* Student Image - Large & Modern */}
                        {lastAttendance.imageUrl && (
                          <div className="relative group">
                            <div className={`absolute -inset-1 rounded-full blur-lg transition-opacity duration-500 ${
                              lastAttendance.status === 'present'
                                ? 'bg-emerald-400/40'
                                : lastAttendance.status === 'absent'
                                ? 'bg-red-400/40'
                                : 'bg-amber-400/40'
                            }`} />
                            <img
                              src={lastAttendance.imageUrl}
                              alt={`${lastAttendance.studentName} photo`}
                              className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover ring-4 ring-background shadow-2xl transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        {/* Student Name */}
                        <p className={`text-2xl sm:text-3xl font-bold ${
                          lastAttendance.status === 'present'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : lastAttendance.status === 'absent'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {lastAttendance.studentName}
                        </p>
                        
                        {/* Status Badge - Color Coded */}
                        <div className={`px-6 py-2 rounded-full font-semibold text-lg ${
                          lastAttendance.status === 'present'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : lastAttendance.status === 'absent'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}>
                          {lastAttendance.status.toUpperCase()}
                        </div>
                        
                        {/* Card Info */}
                        <div className="space-y-1 text-center">
                          <p className="text-sm text-muted-foreground">
                            Card ID: <span className="font-mono font-medium">{lastAttendance.rfidCardId}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            User ID: <span className="font-mono">{lastAttendance.userIdByInstitute}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg text-muted-foreground max-w-md">
                        Place your RFID card near the scanner or enter ID below
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-lg font-semibold text-foreground">
                    {currentTime.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time</p>
                  <p className="text-lg font-semibold text-foreground tabular-nums">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rfid-card-input" className="text-sm font-medium text-foreground">
                RFID Card ID
              </Label>
              <Input
                id="rfid-card-input"
                ref={inputRef}
                type="text"
                placeholder="Scan or enter RFID card ID..."
                value={rfidCardId}
                onChange={(e) => setRfidCardId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
                className="h-12 text-base border-2 border-blue-500 focus:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-select" className="text-sm font-medium text-foreground">
                Status
              </Label>
              <Select 
                value={status} 
                onValueChange={(value: 'present' | 'absent' | 'late') => setStatus(value)}
                disabled={isProcessing}
              >
                <SelectTrigger id="status-select" className="h-12 text-base border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleMarkAttendance}
            disabled={isProcessing || !rfidCardId.trim()}
            className="w-full h-14 text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
          >
            {isProcessing ? 'Processing...' : 'Mark Attendance'}
          </Button>
      </div>
    </div>
  );
};

export default RfidAttendance;
