import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, MapPin, Upload, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateSignedUrl, uploadFileToSignedUrl, updateProfileImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FormFieldWithError, validateField, scrollToFirstError } from "@/components/FormFieldWithError";
import { cn } from "@/lib/utils";
import { EmailHelpSection } from "@/components/EmailHelpSection";

const RegisterInstituteAdmin = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    birthCertificateNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    newErrors.firstName = validateField(formData.firstName, { required: true, maxLength: 50 }) || "";
    newErrors.lastName = validateField(formData.lastName, { required: true, maxLength: 50 }) || "";
    newErrors.email = validateField(formData.email, { required: true, email: true }) || "";
    newErrors.password = validateField(formData.password, { required: true, minLength: 8 }) || "";
    newErrors.phoneNumber = validateField(formData.phoneNumber, { required: true, phone: true }) || "";
    newErrors.dateOfBirth = validateField(formData.dateOfBirth, { required: true }) || "";
    newErrors.gender = validateField(formData.gender, { required: true }) || "";
    newErrors.addressLine1 = validateField(formData.addressLine1, { required: true, maxLength: 100 }) || "";
    newErrors.city = validateField(formData.city, { required: true, maxLength: 50 }) || "";
    newErrors.district = validateField(formData.district, { required: true }) || "";
    newErrors.province = validateField(formData.province, { required: true }) || "";

    // Optional fields with length limits
    if (formData.nic) {
      newErrors.nic = validateField(formData.nic, { maxLength: 12 }) || "";
    }
    if (formData.postalCode) {
      newErrors.postalCode = validateField(formData.postalCode, { maxLength: 10 }) || "";
    }

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== "")
    );

    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      scrollToFirstError(filteredErrors);
      return false;
    }

    return true;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !userId) return;

    setIsUploading(true);
    try {
      const signedUrlResponse = await generateSignedUrl(selectedImage, 'profile');
      await uploadFileToSignedUrl(selectedImage, signedUrlResponse);
      await updateProfileImage({
        userId: userId,
        imageUrl: signedUrlResponse.relativePath
      });

      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
      });

      setShowImageDialog(false);
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const mockUserId = "123";
    setUserId(mockUserId);
    setShowImageDialog(true);
    
    toast({
      title: "Registration Successful",
      description: "Please upload your profile image to complete registration.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ModernNavigation />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Institute Admin Registration - Contact Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Institute Admin Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Create your administrator account to manage your educational institution
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="First Name (e.g., HEWAGE MUDIYANSELAGE APPUHAMY)"
                    required
                    error={errors.firstName}
                    maxLength={50}
                    currentLength={formData.firstName.length}
                    id="field-firstName"
                  >
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z ]/g, '').replace(/  +/g, ' ');
                        setFormData({...formData, firstName: value});
                      }}
                      className={cn("bg-background/50 border-border/50", errors.firstName && "border-destructive")}
                      placeholder="ENTER YOUR FIRST NAME"
                      maxLength={50}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Last Name (e.g., DON GAMAGE)"
                    required
                    error={errors.lastName}
                    maxLength={50}
                    currentLength={formData.lastName.length}
                    id="field-lastName"
                  >
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z ]/g, '').replace(/  +/g, ' ');
                        setFormData({...formData, lastName: value});
                      }}
                      className={cn("bg-background/50 border-border/50", errors.lastName && "border-destructive")}
                      placeholder="ENTER YOUR LAST NAME"
                      maxLength={50}
                    />
                  </FormFieldWithError>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="Date of Birth"
                    required
                    error={errors.dateOfBirth}
                    id="field-dateOfBirth"
                  >
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className={cn("bg-background/50 border-border/50", errors.dateOfBirth && "border-destructive")}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Gender"
                    required
                    error={errors.gender}
                    id="field-gender"
                  >
                    <Select 
                      value={formData.gender}
                      onValueChange={(value) => setFormData({...formData, gender: value})}
                    >
                      <SelectTrigger className={cn("bg-background/50 border-border/50", errors.gender && "border-destructive ring-2 ring-destructive/20")}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWithError>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="NIC Number"
                    error={errors.nic}
                    maxLength={12}
                    currentLength={formData.nic.length}
                    id="field-nic"
                  >
                    <Input
                      id="nic"
                      value={formData.nic}
                      onChange={(e) => setFormData({...formData, nic: e.target.value})}
                      className={cn("bg-background/50 border-border/50", errors.nic && "border-destructive")}
                      placeholder="Enter NIC number"
                      maxLength={12}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Birth Certificate No"
                    id="field-birthCertificateNo"
                  >
                    <Input
                      id="birthCertificateNo"
                      value={formData.birthCertificateNo}
                      onChange={(e) => setFormData({...formData, birthCertificateNo: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="123456789"
                    />
                  </FormFieldWithError>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormFieldWithError
                      label="Email Address"
                      required
                      error={errors.email}
                      id="field-email"
                    >
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={cn("bg-background/50 border-border/50", errors.email && "border-destructive")}
                        placeholder="Enter email address"
                      />
                    </FormFieldWithError>
                    <EmailHelpSection />
                  </div>
                  
                  <FormFieldWithError
                    label="Phone Number"
                    required
                    error={errors.phoneNumber}
                    id="field-phoneNumber"
                  >
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className={cn("bg-background/50 border-border/50", errors.phoneNumber && "border-destructive")}
                      placeholder="+94771234567"
                    />
                  </FormFieldWithError>
                </div>

                <FormFieldWithError
                  label="Password"
                  required
                  error={errors.password}
                  id="field-password"
                >
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={cn("bg-background/50 border-border/50", errors.password && "border-destructive")}
                    placeholder="Enter secure password (min 8 characters)"
                  />
                </FormFieldWithError>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <FormFieldWithError
                    label="Address Line 1"
                    required
                    error={errors.addressLine1}
                    maxLength={100}
                    currentLength={formData.addressLine1.length}
                    id="field-addressLine1"
                  >
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                      className={cn("bg-background/50 border-border/50", errors.addressLine1 && "border-destructive")}
                      placeholder="Enter street address"
                      maxLength={100}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Address Line 2 (Optional)"
                    id="field-addressLine2"
                  >
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Apartment, suite, etc."
                    />
                  </FormFieldWithError>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormFieldWithError
                      label="City"
                      required
                      error={errors.city}
                      maxLength={50}
                      currentLength={formData.city.length}
                      id="field-city"
                    >
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className={cn("bg-background/50 border-border/50", errors.city && "border-destructive")}
                        placeholder="Enter city"
                        maxLength={50}
                      />
                    </FormFieldWithError>
                    
                    <FormFieldWithError
                      label="District"
                      required
                      error={errors.district}
                      id="field-district"
                    >
                      <Select 
                        value={formData.district}
                        onValueChange={(value) => setFormData({...formData, district: value})}
                      >
                        <SelectTrigger className={cn("bg-background/50 border-border/50", errors.district && "border-destructive ring-2 ring-destructive/20")}>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border max-h-60">
                          <SelectItem value="COLOMBO">Colombo</SelectItem>
                          <SelectItem value="GAMPAHA">Gampaha</SelectItem>
                          <SelectItem value="KALUTARA">Kalutara</SelectItem>
                          <SelectItem value="KANDY">Kandy</SelectItem>
                          <SelectItem value="MATALE">Matale</SelectItem>
                          <SelectItem value="NUWARA_ELIYA">Nuwara Eliya</SelectItem>
                          <SelectItem value="GALLE">Galle</SelectItem>
                          <SelectItem value="MATARA">Matara</SelectItem>
                          <SelectItem value="HAMBANTOTA">Hambantota</SelectItem>
                          <SelectItem value="JAFFNA">Jaffna</SelectItem>
                          <SelectItem value="KILINOCHCHI">Kilinochchi</SelectItem>
                          <SelectItem value="MANNAR">Mannar</SelectItem>
                          <SelectItem value="MULLAITIVU">Mullaitivu</SelectItem>
                          <SelectItem value="VAVUNIYA">Vavuniya</SelectItem>
                          <SelectItem value="TRINCOMALEE">Trincomalee</SelectItem>
                          <SelectItem value="BATTICALOA">Batticaloa</SelectItem>
                          <SelectItem value="AMPARA">Ampara</SelectItem>
                          <SelectItem value="KURUNEGALA">Kurunegala</SelectItem>
                          <SelectItem value="PUTTALAM">Puttalam</SelectItem>
                          <SelectItem value="ANURADHAPURA">Anuradhapura</SelectItem>
                          <SelectItem value="POLONNARUWA">Polonnaruwa</SelectItem>
                          <SelectItem value="BADULLA">Badulla</SelectItem>
                          <SelectItem value="MONARAGALA">Monaragala</SelectItem>
                          <SelectItem value="RATNAPURA">Ratnapura</SelectItem>
                          <SelectItem value="KEGALLE">Kegalle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldWithError>
                    
                    <FormFieldWithError
                      label="Province"
                      required
                      error={errors.province}
                      id="field-province"
                    >
                      <Select 
                        value={formData.province}
                        onValueChange={(value) => setFormData({...formData, province: value})}
                      >
                        <SelectTrigger className={cn("bg-background/50 border-border/50", errors.province && "border-destructive ring-2 ring-destructive/20")}>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border">
                          <SelectItem value="WESTERN">Western</SelectItem>
                          <SelectItem value="CENTRAL">Central</SelectItem>
                          <SelectItem value="SOUTHERN">Southern</SelectItem>
                          <SelectItem value="NORTHERN">Northern</SelectItem>
                          <SelectItem value="EASTERN">Eastern</SelectItem>
                          <SelectItem value="NORTH_WESTERN">North Western</SelectItem>
                          <SelectItem value="NORTH_CENTRAL">North Central</SelectItem>
                          <SelectItem value="UVA">Uva</SelectItem>
                          <SelectItem value="SABARAGAMUWA">Sabaragamuwa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldWithError>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWithError
                      label="Postal Code"
                      error={errors.postalCode}
                      maxLength={10}
                      currentLength={formData.postalCode.length}
                      id="field-postalCode"
                    >
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className={cn("bg-background/50 border-border/50", errors.postalCode && "border-destructive")}
                        placeholder="Enter postal code"
                        maxLength={10}
                      />
                    </FormFieldWithError>
                    
                    <FormFieldWithError
                      label="Country"
                      id="field-country"
                    >
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="bg-background/50 border-border/50"
                        disabled
                      />
                    </FormFieldWithError>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit"
                  size="lg" 
                  className="px-8 py-3 text-lg"
                >
                  Next
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Image Upload Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Profile Image</DialogTitle>
              <DialogDescription>
                Upload a clear photo of yourself to complete your registration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex flex-col items-center gap-4">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                    {imagePreview ? "Change Image" : "Select Image"}
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                  Skip for Now
                </Button>
                <Button 
                  onClick={handleImageUpload}
                  disabled={!selectedImage || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload & Complete"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegisterInstituteAdmin;
